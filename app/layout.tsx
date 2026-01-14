import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swoyam Siddharth - Portfolio with AI Assistant',
  description: 'AI Engineer | Full Stack Developer | AI/ML Enthusiast',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50`}>
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <ChatInterface />
        
        {/* Add DOM content structure for AI */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize sections data for AI
              window.portfolioSections = {
                about: { id: 'about', title: 'About Me', selector: '#about' },
                experience: { id: 'experience', title: 'Experience', selector: '#experience' },
                skills: { id: 'skills', title: 'Skills', selector: '#skills' },
                testimonials: { id: 'testimonials', title: 'Testimonials', selector: '#testimonials' },
                contact: { id: 'contact', title: 'Contact', selector: '#contact' }
              };
            `
          }}
        />
      </body>
    </html>
  );
}