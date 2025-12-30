import React from 'react';
import { Card } from './ui/Card';
import { ShieldCheck, Utensils, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const VALUES = [
  {
    icon: ShieldCheck,
    color: 'text-sky-500',
    bg: 'bg-sky-100',
    title: 'An toàn tuyệt đối',
    description: 'Hệ thống camera giám sát 24/7 phủ khắp khuôn viên. Quy trình đón trả trẻ nghiêm ngặt bằng thẻ từ và nhận diện khuôn mặt.'
  },
  {
    icon: Utensils,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100',
    title: 'Dinh dưỡng chuẩn',
    description: 'Thực phẩm organic từ nông trại sạch. Bếp ăn một chiều đảm bảo vệ sinh. Thực đơn được tư vấn bởi Viện Dinh Dưỡng.'
  },
  {
    icon: GraduationCap,
    color: 'text-brand-600',
    bg: 'bg-brand-100',
    title: 'Giáo dục tận tâm',
    description: '100% giáo viên tốt nghiệp Đại học/Cao đẳng Sư phạm. Thường xuyên được đào tạo phương pháp Montessori, Reggio Emilia.'
  }
];

export const CoreValues: React.FC = () => {
  return (
    <section className="py-24 bg-white scroll-mt-24" id="about">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-brand-600 font-bold tracking-wide uppercase text-sm">Giá trị cốt lõi</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2 mb-4">
            Tại sao ba mẹ chọn Vàng Anh?
          </h2>
          <p className="text-gray-600">
            Chúng tôi hiểu rằng, chọn trường cho con là quyết định quan trọng nhất. 
            Tại Vàng Anh, chúng tôi cam kết mang lại những điều tốt đẹp nhất.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {VALUES.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card hoverEffect className="h-full border-none shadow-xl shadow-gray-100/50">
                  <div className="p-8 flex flex-col items-center text-center h-full">
                    <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-6`}>
                      <Icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <h3 className="text-xl font-bold font-display text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};