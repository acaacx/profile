import LabSection from '../sections/LabSection';

export default function InteractivePage() {
  return (
    <div className="page-shell">
      <header className="route-intro max-w-[1100px] mx-auto px-6">
        <p className="font-mono-label mb-4" style={{ color: '#a89f91' }}>
          // live browser demos
        </p>
        <h1 className="font-display text-[48px] md:text-[72px] leading-[0.95] text-primary">
          Interactive
        </h1>
        <p className="route-copy mt-6 max-w-[640px] text-[15px] md:text-[17px]">
          Working SRE, platform, and delivery-system demonstrations. Adjust the controls, run the
          pipelines, and inspect the trade-offs directly in your browser.
        </p>
      </header>
      <LabSection />
    </div>
  );
}
