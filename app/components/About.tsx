'use client';

import { User, GraduationCap, MapPin, Calendar } from 'lucide-react';

export default function About() {
  const education = [
    {
      institution: 'International Institute of Information Technology, Bhubaneswar',
      degree: 'Bachelors Degree in Computer Science',
      period: '2021 - Present',
      details: 'CGPA: 8.27 | Tech Secretary\'25 | Class Representative CSE\'25'
    },
    {
      institution: 'KV no.3 Bhubaneswar',
      degree: 'Senior Secondary - PCM-CS',
      period: '2018 - 2021',
      details: 'Grade: 95%'
    },
    {
      institution: 'KV No. 2, AFS Maharajpura, Gwalior',
      degree: 'Secondary',
      period: '2016 - 2018',
      details: 'Grade: 87.2%'
    }
  ];

  return (
    <section id="about" className="section-container scroll-mt-20">
      <h2 className="section-title">
        <span className="flex items-center justify-center gap-3">
          <User className="w-8 h-8 text-blue-600" />
          About Me
        </span>
      </h2>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <p className="text-lg text-gray-700 mb-6">
              Hello! I'm <span className="font-semibold text-blue-600">Swoyam Siddharth Nayak</span>, 
              a Computer Science Engineering graduate from IIIT Bhubaneswar, Class of 2025. 
              Currently, I serve as an AI Engineer at Sarvam AI, where I'm contributing to the 
              development of India's sovereign Large Language Model (LLM) under the IndiaAI Mission.
            </p>
            
            <p className="text-lg text-gray-700 mb-6">
              My journey has been fueled by a passion for full-stack development, AI/ML, and 
              mobile app innovation. I've had the privilege of interning at organizations like 
              Sarvam AI, FixIt-AI, and Oracle NetSuite, where I contributed to developing 
              advanced AI agents, optimizing backend systems, and enhancing NLP capabilities.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Location</div>
                  <div className="text-gray-600">Bhubaneswar, India</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Experience</div>
                  <div className="text-gray-600">2+ Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Education
          </h3>
          
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md card-hover border-l-4 border-blue-500"
                data-section="education"
                data-index={index}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{edu.institution}</h4>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {edu.period}
                  </span>
                </div>
                <p className="text-blue-600 font-medium mb-2">{edu.degree}</p>
                <p className="text-gray-600">{edu.details}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Current Focus</h4>
            <p className="text-gray-700">
              Currently focusing on building voice agents and implementing PII data masking 
              features at Sarvam AI. Actively contributing to India's foundational AI infrastructure 
              under the IndiaAI Mission.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}