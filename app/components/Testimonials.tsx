'use client';

import { Quote, Star, Award } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Ayusha Kar',
      role: 'GDSC Lead',
      content: 'Swoyam is an exceptional individual whom I met as my junior but have offered me a lot to learn from. He has consistently demonstrated outstanding organisational skills in managing our GDSC team and seamless execution of various sessions and responsibilities.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    {
      name: 'Diwakar Arodiya',
      role: 'Colleague',
      content: 'Swoyam is one of the hardworking talents I have worked with. Always on edge to go extra mile and learn to get things done.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w-150'
    },
    {
      name: 'Sahil Singh',
      role: 'Code8 Community Lead',
      content: 'Highly Efficient is the phrase that comes to my mind when I think about Swoyam. I have worked with him at Code8, he was the Core Team Lead. He managed, led the internal team, conducted events, contributed effectively to the growth of Code8 community.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    }
  ];

  return (
    <section id="testimonials" className="section-container bg-gradient-to-b from-white to-gray-50 scroll-mt-20">
      <h2 className="section-title">
        <span className="flex items-center justify-center gap-3">
          <Award className="w-8 h-8 text-blue-600" />
          Testimonials
        </span>
      </h2>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-lg card-hover relative"
              data-section="testimonials"
              data-index={index}
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-blue-100" />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-white p-0.5">
                    {/* In production, replace with actual image */}
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-100 to-purple-100" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-blue-600">{testimonial.role}</p>
                  <div className="flex mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 italic relative z-10">
                "{testimonial.content}"
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Verified Review</span>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Top Contributor</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-2xl shadow-md">
            <div className="text-3xl font-bold text-blue-600">4.9/5.0</div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Average Rating</div>
              <div className="text-gray-600">From colleagues and mentors</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}