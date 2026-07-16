import { useLenis } from './hooks/useLenis';
import WebGPUCanvas from './components/WebGPUCanvas';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ExperienceSection from './sections/ExperienceSection';
import LabSection from './sections/LabSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';

function App() {
  useLenis();

  return (
    <>
      {/* Fixed WebGPU background canvas */}
      <WebGPUCanvas />

      {/* Navigation */}
      <Navigation />

      {/* Page content */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <LabSection />
        <ProjectsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
