'use client';

import { Code, Palette, Database, Cpu, TrendingUp } from 'lucide-react';

export default function Skills() {
  const skillCategories = [
    {
      title: 'AI & Machine Learning',
      icon: <Cpu className="w-6 h-6" />,
      skills: [
        { name: 'Agentic AI', level: 90 },
        { name: 'NLP & LLMs', level: 85 },
        { name: 'MLOps', level: 80 },
        { name: 'Computer Vision', level: 75 }
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Backend Development',
      icon: <Database className="w-6 h-6" />,
      skills: [
        { name: 'Python', level: 90 },
        { name: 'FastAPI', level: 85 },
        { name: 'Node.js', level: 80 },
        { name: 'PostgreSQL', level: 85 }
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Frontend & Mobile',
      icon: <Palette className="w-6 h-6" />,
      skills: [
        { name: 'React/Next.js', level: 85 },
        { name: 'Flutter', level: 80 },
        { name: 'TypeScript', level: 85 },
        { name: 'Tailwind CSS', level: 90 }
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Tools & DevOps',
      icon: <Code className="w-6 h-6" />,
      skills: [
        { name: 'Git & GitHub', level: 90 },
        { name: 'Docker', level: 80 },
        { name: 'AWS', level: 75 },
        { name: 'CI/CD', level: 85 }
      ],
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="skills" className="section-container scroll-mt-20">
      <h2 className="section-title">
        <span className="flex items-center justify-center gap-3">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          Skills & Expertise
        </span>
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {skillCategories.map((category, catIndex) => (
          <div 
            key={catIndex} 
            className="bg-white rounded-2xl shadow-lg p-6 card-hover"
            data-section="skills"
            data-category={category.title.toLowerCase()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
            </div>
            
            <div className="space-y-6">
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="font-semibold text-blue-600">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${skill.level}%` }}
                      data-skill={skill.name.toLowerCase()}
                      data-level={skill.level}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
            <div className="text-gray-700">AI Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
            <div className="text-gray-700">Programming Languages</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">8+</div>
            <div className="text-gray-700">Frameworks Mastered</div>
          </div>
        </div>
      </div>
    </section>
  );
}