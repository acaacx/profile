import { useEffect, useRef, useState } from 'react';

const VERTEX_SHADER = `
const pos = array(vec2(-1, -1), vec2(3, -1), vec2(-1, 3));
const uv = array(vec2(0, 0), vec2(2, 0), vec2(0, 2));

struct VSOut {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex fn main(@builtin(vertex_index) ix: u32) -> VSOut {
  return VSOut(vec4(pos[ix], 0, 1), uv[ix]);
}
`;

const FLUID_SIM_SHADER = `
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var cellStateIn: texture_2d<f32>;
@group(0) @binding(3) var<storage, read_write> fluidBuffer: array<vec4<f32>>;

struct Uniforms {
  gridSize: f32,
  time: f32,
  mousePos: vec2<f32>,
  mouseActive: f32,
};

@compute @workgroup_size(8, 8)
fn fluidSim(@builtin(global_invocation_id) cell: vec3<u32>) {
  let x = cell.x;
  let y = cell.y;
  if (x >= u32(uniforms.gridSize) || y >= u32(uniforms.gridSize)) { return; }

  let idx = y * u32(uniforms.gridSize) + x;
  let gridF = uniforms.gridSize;
  let nx = 1.0 / gridF;
  let ny = 1.0 / gridF;

  var prev = fluidBuffer[idx];

  let left   = fluidBuffer[y * u32(uniforms.gridSize) + max(x, 1u) - 1u];
  let right  = fluidBuffer[y * u32(uniforms.gridSize) + min(x + 1u, u32(gridF) - 1u)];
  let up     = fluidBuffer[max(y, 1u) * u32(uniforms.gridSize) + x - u32(uniforms.gridSize)];
  let down   = fluidBuffer[min(y + 1u, u32(gridF) - 1u) * u32(uniforms.gridSize) + x];

  let diffuse = 0.25 * (left + right + up + down);
  prev = mix(prev, diffuse, 0.18);

  prev *= 0.985;
  prev = max(prev, vec4(0.0));

  let mPos = uniforms.mousePos;
  let cPos = vec2((f32(x) + 0.5) * nx, (f32(y) + 0.5) * ny);
  let dx = cPos.x - mPos.x;
  let dy = cPos.y - mPos.y;
  let dist = sqrt(dx * dx + dy * dy);

  if (uniforms.mouseActive > 0.5) {
    let brushSize = 0.028;
    let strength = 2.8;
    let brush = exp(-dist * dist / (brushSize * brushSize));
    let angle = atan2(dy, dx) + 3.14159 * 0.5;
    let vx = cos(angle) * strength;
    let vy = sin(angle) * strength;

    prev.x += brush * vx * 0.16;
    prev.y += brush * vy * 0.16;
    prev.z += brush * 0.35;
    prev.w += brush * 0.35;
  }

  fluidBuffer[idx] = prev;
}
`;

const GAME_OF_LIFE_SHADER = `
@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var cellStateIn: texture_2d<f32>;
@group(0) @binding(2) var cellStateOut: texture_storage_2d<rgba8unorm, write>;

struct Uniforms {
  gridSize: f32,
  time: f32,
  mousePos: vec2<f32>,
  mouseActive: f32,
};

@compute @workgroup_size(8, 8)
fn gameOfLife(@builtin(global_invocation_id) cell: vec3<u32>) {
  let x = u32(cell.x);
  let y = u32(cell.y);
  if (x >= u32(uniforms.gridSize) || y >= u32(uniforms.gridSize)) { return; }

  let gridU = u32(uniforms.gridSize);

  let cellVal = textureLoad(cellStateIn, vec2<i32>(i32(x), i32(y)), 0);
  var isAlive = cellVal.x > 0.5;

  var aliveNeighbors = 0u;
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      if (dx == 0 && dy == 0) { continue; }
      let nx = (x + gridU + u32(dx)) % gridU;
      let ny = (y + gridU + u32(dy)) % gridU;
      let neighbor = textureLoad(cellStateIn, vec2<i32>(i32(nx), i32(ny)), 0);
      if (neighbor.x > 0.5) {
        aliveNeighbors++;
      }
    }
  }

  var nextAlive = isAlive;
  if (isAlive) {
    if (aliveNeighbors < 2u || aliveNeighbors > 3u) {
      nextAlive = false;
    }
  } else {
    if (aliveNeighbors == 3u) {
      nextAlive = true;
    }
  }

  if (nextAlive) {
    textureStore(cellStateOut, vec2<i32>(i32(x), i32(y)), vec4(1.0, 1.0, 1.0, 1.0));
  } else {
    textureStore(cellStateOut, vec2<i32>(i32(x), i32(y)), vec4(0.0, 0.0, 0.0, 1.0));
  }
}
`;

const FRAGMENT_SHADER = `
@group(0) @binding(4) var cellTex: texture_2d<f32>;
@group(0) @binding(5) var cellSamp: sampler;
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct Uniforms {
  gridSize: f32,
  time: f32,
  mousePos: vec2<f32>,
  mouseActive: f32,
};

fn oklch_to_rgb(l: f32, c: f32, h: f32) -> vec3<f32> {
  let a = c * cos(h);
  let b_ = c * sin(h);
  let l_ = l + 0.3963377774 * a + 0.2158037573 * b_;
  let m_ = l - 0.1055613458 * a - 0.0638541728 * b_;
  let s_ = l - 0.0894841775 * a - 1.2914855480 * b_;
  let l3 = l_ * l_ * l_;
  let m3 = m_ * m_ * m_;
  let s3 = s_ * s_ * s_;
  let lr = select(12.92 * l_, 1.055 * pow(l3, 1.0/3.0) - 0.055, l3 > 0.00008856);
  let mg = select(12.92 * m_, 1.055 * pow(m3, 1.0/3.0) - 0.055, m3 > 0.00008856);
  let sb = select(12.92 * s_, 1.055 * pow(s3, 1.0/3.0) - 0.055, s3 > 0.00008856);
  return vec3(lr, mg, sb);
}

@fragment fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
  let cell = textureSample(cellTex, cellSamp, uv);
  let alive = cell.x;
  let t = uniforms.time * 0.08;

  var oklch: vec3<f32>;
  if (alive > 0.5) {
    oklch = vec3(0.65, 0.12, 0.8 + sin(t + uv.x * 2.0 + uv.y) * 0.06);
  } else {
    oklch = vec3(0.12, 0.06, 4.4 + sin(t * 0.7 + uv.y * 1.5) * 0.15);
  }

  var rgb = oklch_to_rgb(oklch.x, oklch.y, oklch.z);
  rgb = pow(rgb, vec3(2.2));

  // Film grain
  let grainCoord = vec2<f32>(uv.x * f32(textureDimensions(cellTex).x), uv.y * f32(textureDimensions(cellTex).y));
  var p3 = fract(vec3(grainCoord.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  let noise = fract((p3.x + p3.y) * p3.z) - 0.5;
  rgb += noise * 0.02;

  // Vignette
  let dist = length(uv - 0.5);
  let vignette = 1.0 - pow(dist * 1.6, 2.5);
  rgb *= clamp(vignette, 0.0, 1.0);

  return vec4(rgb, 1.0);
}
`;

export default function WebGPUCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let device: GPUDevice | null = null;
    let context: GPUCanvasContext | null = null;

    async function init() {
      if (!navigator.gpu) {
        setFallback(true);
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        setFallback(true);
        return;
      }

      device = await adapter.requestDevice();
      if (!device) {
        setFallback(true);
        return;
      }

      context = canvas!.getContext('webgpu') as GPUCanvasContext;
      if (!context) {
        setFallback(true);
        return;
      }

      const GRID_SIZE = 256;
      const WORKGROUP_SIZE = 8;
      const workgroupCount = GRID_SIZE / WORKGROUP_SIZE;

      const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
      context.configure({
        device,
        format: canvasFormat,
        alphaMode: 'premultiplied',
      });

      // Create ping-pong textures
      const textureUsage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST;

      const cellStateA = device.createTexture({
        size: [GRID_SIZE, GRID_SIZE],
        format: 'rgba8unorm',
        usage: textureUsage,
      });

      const cellStateB = device.createTexture({
        size: [GRID_SIZE, GRID_SIZE],
        format: 'rgba8unorm',
        usage: textureUsage,
      });

      // Seed initial state (30% alive)
      const initialState = new Uint8Array(GRID_SIZE * GRID_SIZE * 4);
      for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const alive = Math.random() < 0.3 ? 255 : 0;
        initialState[i * 4] = alive;
        initialState[i * 4 + 1] = alive;
        initialState[i * 4 + 2] = alive;
        initialState[i * 4 + 3] = 255;
      }

      device.queue.writeTexture(
        { texture: cellStateA },
        initialState,
        { bytesPerRow: GRID_SIZE * 4 },
        [GRID_SIZE, GRID_SIZE]
      );

      // Fluid buffer
      const fluidBuffer = device.createBuffer({
        size: GRID_SIZE * GRID_SIZE * 4 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });

      // Uniform buffer
      const uniformBuffer = device.createBuffer({
        size: 20,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      // Bind group layout
      const bindGroupLayout = device.createBindGroupLayout({
        entries: [
          { binding: 0, visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' } },
          { binding: 1, visibility: GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT, texture: { sampleType: 'unfilterable-float', viewDimension: '2d', multisampled: false } },
          { binding: 2, visibility: GPUShaderStage.COMPUTE, storageTexture: { format: 'rgba8unorm', access: 'write-only', viewDimension: '2d' } },
          { binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
          { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'unfilterable-float' } },
          { binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'non-filtering' } },
        ],
      });

      const sampler = device.createSampler({ magFilter: 'nearest', minFilter: 'nearest' });

      const createBindGroups = (inTex: GPUTexture, outTex: GPUTexture) => [
        device!.createBindGroup({
          layout: bindGroupLayout,
          entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: inTex.createView() },
            { binding: 2, resource: outTex.createView() },
            { binding: 3, resource: { buffer: fluidBuffer } },
            { binding: 4, resource: inTex.createView() },
            { binding: 5, resource: sampler },
          ],
        }),
        device!.createBindGroup({
          layout: bindGroupLayout,
          entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: outTex.createView() },
            { binding: 2, resource: inTex.createView() },
            { binding: 3, resource: { buffer: fluidBuffer } },
            { binding: 4, resource: outTex.createView() },
            { binding: 5, resource: sampler },
          ],
        }),
      ];

      const bindGroups = createBindGroups(cellStateA, cellStateB);
      let step = 0;

      // Create pipelines
      const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      });

      const fluidPipeline = device.createComputePipeline({
        layout: pipelineLayout,
        compute: {
          module: device.createShaderModule({ code: FLUID_SIM_SHADER }),
          entryPoint: 'fluidSim',
        },
      });

      const lifePipeline = device.createComputePipeline({
        layout: pipelineLayout,
        compute: {
          module: device.createShaderModule({ code: GAME_OF_LIFE_SHADER }),
          entryPoint: 'gameOfLife',
        },
      });

      const renderPipeline = device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
          module: device.createShaderModule({ code: VERTEX_SHADER }),
          entryPoint: 'main',
        },
        fragment: {
          module: device.createShaderModule({ code: FRAGMENT_SHADER }),
          entryPoint: 'main',
          targets: [{ format: canvasFormat }],
        },
        primitive: { topology: 'triangle-list' },
      });

      // Resize handler
      function resize() {
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio, 2);
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
      }
      resize();
      window.addEventListener('resize', resize);

      // Mouse handlers
      function onMouseMove(e: MouseEvent) {
        mouseRef.current.x = e.clientX / window.innerWidth;
        mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
        mouseRef.current.active = 1;
      }
      function onMouseLeave() {
        mouseRef.current.active = 0;
      }
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseleave', onMouseLeave);

      // Render loop
      function frame() {
        if (!device || !context) return;

        const time = performance.now() / 1000;
        const uniforms = new Float32Array([
          GRID_SIZE,
          time,
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRef.current.active,
        ]);
        device.queue.writeBuffer(uniformBuffer, 0, uniforms);

        const encoder = device.createCommandEncoder();

        // Fluid simulation
        const fluidPass = encoder.beginComputePass();
        fluidPass.setPipeline(fluidPipeline);
        fluidPass.setBindGroup(0, bindGroups[step % 2]);
        fluidPass.dispatchWorkgroups(workgroupCount, workgroupCount);
        fluidPass.end();

        // Game of Life
        const lifePass = encoder.beginComputePass();
        lifePass.setPipeline(lifePipeline);
        lifePass.setBindGroup(0, bindGroups[step % 2]);
        lifePass.dispatchWorkgroups(workgroupCount, workgroupCount);
        lifePass.end();

        // Render to canvas
        const renderPass = encoder.beginRenderPass({
          colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            storeOp: 'store',
            clearValue: { r: 0.012, g: 0.012, b: 0.02, a: 1.0 },
          }],
        });
        renderPass.setPipeline(renderPipeline);
        renderPass.setBindGroup(0, bindGroups[step % 2]);
        renderPass.draw(3);
        renderPass.end();

        device.queue.submit([encoder.finish()]);
        step++;
        rafRef.current = requestAnimationFrame(frame);
      }

      rafRef.current = requestAnimationFrame(frame);

      // Device loss handling
      device.lost.then((info: GPUDeviceLostInfo) => {
        console.warn('WebGPU device lost:', info.reason);
      });

      return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseleave', onMouseLeave);
      };
    }

    let cleanup: (() => void) | undefined;
    init().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      cleanup?.();
    };
  }, []);

  if (fallback) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: 'radial-gradient(ellipse at 30% 50%, #0a0a14 0%, #030305 60%, #000000 100%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
