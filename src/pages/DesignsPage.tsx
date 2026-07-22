import { Maximize2 } from 'lucide-react';
import { Link } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

const DESIGN_IMAGE = '/images/designs/cicd-pipeline-architecture.png';
const DESIGN_ALT =
  'Secure CI/CD pipeline architecture from source control through testing, publishing, GitOps deployment, progressive delivery, and observability';

export default function DesignsPage() {
  return (
    <section className="page-shell min-h-screen pb-[120px]">
      <header className="route-intro max-w-[1100px] mx-auto px-6">
        <p className="font-mono-label mb-4" style={{ color: '#a89f91' }}>
          // systems, flows &amp; technical design
        </p>
        <h1 className="font-display text-[48px] md:text-[72px] leading-[0.95] text-primary">
          Designs
        </h1>
        <p className="route-copy mt-6 max-w-[640px] text-[15px] md:text-[17px]">
          A growing archive of delivery systems, platform flows, and technical architecture made to
          turn complex operational work into something teams can understand and use.
        </p>
      </header>

      <div className="max-w-[1100px] mx-auto px-6 mt-16 md:mt-20">
        <article className="glass-card overflow-hidden">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label="View CI/CD Pipeline Architecture full size"
                className="group relative block w-full overflow-hidden bg-[#f7f8fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a89f91]"
              >
                <img
                  src={DESIGN_IMAGE}
                  alt={DESIGN_ALT}
                  className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.01]"
                />
                <span className="absolute right-4 bottom-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#030305]/85 px-4 text-[12px] text-[#E8E8EC] backdrop-blur-md border border-white/10">
                  <Maximize2 aria-hidden="true" size={14} />
                  View full size
                </span>
              </button>
            </DialogTrigger>

            <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-[96vw] h-[92vh] bg-[#f7f8fa] border-white/10 p-3 md:p-5 gap-3">
              <DialogHeader className="sr-only">
                <DialogTitle>CI/CD Pipeline Architecture — full size</DialogTitle>
                <DialogDescription>
                  Enlarged view of the secure, automated, progressive, and observable pipeline design.
                </DialogDescription>
              </DialogHeader>
              <div className="min-h-0 h-full flex items-center justify-center overflow-auto rounded-md">
                <img
                  src={DESIGN_IMAGE}
                  alt={DESIGN_ALT}
                  className="block max-w-full max-h-full w-auto h-auto object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>

          <div className="p-6 md:p-8 border-t border-white/[0.06]">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
              <div className="max-w-[760px]">
                <p className="font-mono-label mb-3" style={{ color: 'rgba(255,255,255,0.48)' }}>
                  Delivery architecture · 2026
                </p>
                <h2 className="font-display text-[28px] md:text-[36px] leading-tight text-primary">
                  CI/CD Pipeline Architecture
                </h2>
                <p className="route-copy mt-4 text-[14px] md:text-[15px] leading-relaxed">
                  A secure, automated delivery reference spanning commit, test, package, GitOps
                  deployment, progressive delivery, and post-deploy observability.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-secondary">
                Architecture diagram
              </span>
            </div>
          </div>
        </article>

        <div className="mt-10">
          <Link className="route-link inline-flex" to="/#projects">
            Back to projects
          </Link>
        </div>
      </div>
    </section>
  );
}
