import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Testimonials />
      <Contact />
      
      <footer className="bg-gray-900 text-white py-8">
        <div className="section-container">
          <div className="text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Swoyam Siddharth Nayak. All rights reserved.</p>
            <p className="text-gray-500 text-sm mt-2">Built with Next.js, Tailwind CSS, and Gemini AI</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="https://github.com/swoyam2609" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="https://linkedin.com/in/swoyam-siddharth" className="text-gray-400 hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="mailto:swoyam.nayak@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}