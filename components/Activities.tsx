import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

const ACTIVITIES = [
  {
    id: 1,
    title: "Lễ hội mùa hè rực rỡ sắc màu 2024",
    summary: "Một ngày tràn ngập niềm vui với các trò chơi nước, tiệc buffet trái cây và những màn biểu diễn thời trang tái chế độc đáo của các bé.",
    image: "https://images.unsplash.com/photo-1566004100631-35d015d6a491?auto=format&fit=crop&q=80&w=800",
    date: "15/06/2024"
  },
  {
    id: 2,
    title: "Chuyến tham quan nông trại EduFarm",
    summary: "Các bé được trải nghiệm trồng rau, bắt cá và tìm hiểu về thế giới tự nhiên phong phú. Một bài học thực tế đầy ý nghĩa.",
    image: "https://images.unsplash.com/photo-1596464716127-f9a16a8122d2?auto=format&fit=crop&q=80&w=800",
    date: "22/05/2024"
  }
];

export const Activities: React.FC = () => {
  return (
    <section id="activities" className="py-24 bg-brand-50 scroll-mt-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-brand-600 font-bold tracking-wide uppercase text-sm">Tin tức nổi bật</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2">
              Hoạt động nổi bật
            </h2>
          </div>
          <a href="#" className="hidden md:flex items-center text-brand-600 font-bold hover:underline">
            Xem tất cả hoạt động <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ACTIVITIES.map((item) => (
            <motion.div
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-transparent hover:border-brand-200"
              whileHover={{ y: -8 }}
            >
              {/* Image Container */}
              <div className="aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-3">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </div>
                <h3 className="text-2xl font-display font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
                <div className="mt-6 flex items-center text-brand-600 font-bold text-sm">
                  Đọc thêm <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
           <a href="#" className="inline-flex items-center text-brand-600 font-bold">
            Xem tất cả hoạt động <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
};