'use client';

import { Briefcase, Calendar, Target, Zap } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
      role: 'AI Engineer',
      company: 'Sarvam AI',
      period: 'Jun 2025 - Present',
      duration: 'Present',
      description: 'Built voice agents for multiple client organizations, focusing on seamless conversation with customers. Took ownership of the entire development process, from ideation to deployment. Implemented PII data masking features for voice agent conversations.',
      achievements: [
        'Developed multiple dashboards for clients providing valuable insights',
        'Enhanced data privacy and security with PII masking',
        'Led end-to-end development of voice AI solutions'
      ],
      tags: ['AI Agents', 'Voice AI', 'PII Masking', 'Dashboard Development']
    },
    {
      role: 'AI Intern',
      company: 'Sarvam AI',
      period: 'Dec 2024 - May 2025',
      duration: '6 months',
      description: 'Assisted multiple client organizations in developing advanced V2V-AI agents. Contributed to the design and implementation of AI-powered chatbots for general use cases.',
      achievements: [
        'Developed tailored AI agents for business operations',
        'Created streamlined user interaction systems',
        'Collaborated on general-purpose chatbot development'
      ],
      tags: ['V2V-AI', 'Chatbots', 'Business Automation']
    },
    {
      role: 'AI Intern (MLOps & GenAI)',
      company: 'FixIt',
      period: 'Aug 2024 - Nov 2024',
      duration: '4 months',
      description: 'Achieved 7x reduction in transcription generation time using multi-threading. Designed and developed over 10 REST APIs for CRUD operations and file processing.',
      achievements: [
        'Optimized performance through multi-threading',
        'Built scalable backend systems',
        'Designed efficient file processing architecture'
      ],
      tags: ['MLOps', 'REST APIs', 'Performance Optimization', 'Backend']
    },
    {
      role: 'Project Intern',
      company: 'Oracle NetSuite',
      period: 'May 2024 - Jul 2024',
      duration: '3 months',
      description: 'Developed NLP and LLM-based solutions to improve machine understanding and generation of human language. Worked on innovations in text analysis and conversational AI.',
      achievements: [
        'Contributed to NLP research and development',
        'Worked on text summarization and translation systems',
        'Enhanced conversational AI capabilities'
      ],
      tags: ['NLP', 'LLMs', 'Conversational AI', 'Text Analysis']
    },
    {
      role: 'Jr. Flutter Developer',
      company: 'EzTruck',
      period: 'Jul 2023 - Oct 2023',
      duration: '4 months',
      description: 'Developed a comprehensive logistics management application using Flutter for both customer and client needs. Streamlined logistics operations with tracking and management features.',
      achievements: [
        'Built cross-platform logistics app',
        'Implemented real-time tracking features',
        'Created seamless user interfaces'
      ],
      tags: ['Flutter', 'Mobile Development', 'Logistics', 'Cross-platform']
    }
  ];

  return (
    <section id="experience" className="section-container bg-gradient-to-b from-white to-blue-50 scroll-mt-20">
      <h2 className="section-title">
        <span className="flex items-center justify-center gap-3">
          <Briefcase className="w-8 h-8 text-blue-600" />
          Professional Experience
        </span>
      </h2>
      
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-200 to-blue-400" />
          
          {experiences.map((exp, index) => (
            <div 
              key={index} 
              className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-1/2 md:pl-4' : 'md:pl-1/2 md:pr-4'} md:flex items-center`}
              data-section="experience"
              data-index={index}
            >
              {/* Timeline dot */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
              
              <div className={`bg-white p-6 rounded-2xl shadow-lg card-hover ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-lg text-blue-700 font-semibold mb-3">
                      <Briefcase className="w-4 h-4" />
                      {exp.company}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{exp.period}</span>
                    <span className="text-sm bg-blue-100 px-2 py-1 rounded-full">{exp.duration}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{exp.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <span className="text-gray-600">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}