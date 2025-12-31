import React from 'react';
import { Card } from './ui/Card';
import { Rocket, Star, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VALUES = [
  {
    icon: Target,
    color: 'text-rose-500',
    bg: 'bg-rose-100',
    title: 'Sứ mạng',
    description: 'Tạo dựng được môi trường chăm sóc, giáo dục an toàn, lành mạnh, kỷ cương, tình thương, trách nhiệm, để giúp trẻ phát triển một cách toàn diện. Phát hiện và bồi dưỡng phẩm chất đạo đức và sở trường riêng của từng trẻ, giúp trẻ biết sáng tạo, trải nghiệm, có năng lực tư duy. Cung cấp nền tảng kiến thức vững chắc bằng nhiều phương pháp giáo dục nhẹ nhàng và tự nhiên nhất.'
  },
  {
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-100',
    title: 'Giá trị cốt lõi',
    list: [
      'Lòng yêu nước và lòng nhân ái; Đoàn kết và hợp tác',
      'Có trách nhiệm và trung thực',
      'Đam mê và sáng tạo'
    ]
  },
  {
    icon: Rocket,
    color: 'text-sky-500',
    bg: 'bg-sky-100',
    title: 'Phương châm hành động',
    list: [
      'Nâng cao chất lượng giáo dục của đơn vị',
      'Tạo uy tín, danh dự và xây dựng thương hiệu của nhà trường'
    ]
  }
];

export const CoreValues: React.FC = () => {
  return (
    <section className="py-24 bg-white scroll-mt-24" id="about">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-brand-600 font-bold tracking-wide uppercase text-sm">Vàng Anh Kindergarten</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2 mb-4">
            Tầm nhìn & Sứ mệnh
          </h2>
          <p className="text-gray-600">
            Cam kết kiến tạo môi trường giáo dục hạnh phúc, nơi mỗi đứa trẻ được yêu thương, tôn trọng và phát triển toàn diện.
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
                  <div className="p-8 flex flex-col items-center h-full">
                    <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-6`}>
                      <Icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <h3 className="text-xl font-bold font-display text-gray-900 mb-3 text-center">
                      {item.title}
                    </h3>

                    {item.description ? (
                      <p className="text-gray-600 leading-relaxed text-justify">
                        {item.description}
                      </p>
                    ) : (
                      <ul className="w-full space-y-3 mt-2">
                        {item.list?.map((text, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-5 h-5 ${item.color} shrink-0 mt-0.5`} />
                            <span className="text-gray-600 text-left">{text}</span>
                          </li>
                        ))}
                      </ul>
                    )}
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