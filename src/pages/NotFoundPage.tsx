import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="page-shell min-h-[70vh] flex items-center">
      <div className="max-w-[1000px] w-full mx-auto px-6">
        <p className="font-mono-label mb-4" style={{ color: '#a89f91' }}>
          // 404
        </p>
        <h1 className="font-display text-[48px] md:text-[72px] leading-none text-primary">
          Page not found
        </h1>
        <p className="mt-6 text-secondary max-w-[520px]">
          This route does not exist, but the rest of the portfolio is right where you left it.
        </p>
        <Link className="route-link mt-8 inline-flex" to="/">
          Return home
        </Link>
      </div>
    </section>
  );
}
