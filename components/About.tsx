import React from 'react';
import { Button } from './ui/Button';
import { CheckCircle2 } from 'lucide-react';

interface AboutProps {
  onNavigate?: (path: string) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <section id="about-intro" className="py-24 bg-white scroll-mt-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div>
              <span className="text-brand-600 font-bold tracking-wide uppercase text-sm">Về chúng tôi</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2">
                Ngôi nhà thứ hai tràn ngập yêu thương cho bé
              </h2>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-lg">
              Được thành lập từ năm 2010, Trường Mẫu Giáo Vàng Anh tự hào là đơn vị tiên phong trong việc áp dụng phương pháp giáo dục sớm, kết hợp tinh hoa của Montessori và chương trình chuẩn của Bộ Giáo dục.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              Chúng tôi tin rằng mỗi đứa trẻ là một hạt giống duy nhất và đặc biệt. Nhiệm vụ của Vàng Anh là tạo ra môi trường đất màu mỡ, đầy đủ ánh sáng và tình yêu thương để hạt giống ấy nảy mầm và vươn cao mạnh mẽ.
            </p>

            <ul className="space-y-4 pt-2">
              {[
                'Không gian học tập xanh, gần gũi thiên nhiên',
                'Đội ngũ giáo viên tận tâm, giàu kinh nghiệm',
                'Chương trình tiếng Anh chuẩn Cambridge',
                'Hoạt động ngoại khóa đa dạng mỗi tuần'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Button onClick={() => onNavigate && onNavigate('about')}>
                Xem thêm về lịch sử trường
              </Button>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative">
             {/* Decorative blob/bg */}
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-50 rounded-full blur-3xl opacity-60"></div>
             
             <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800" 
                  alt="Students playing" 
                  className="rounded-3xl shadow-lg w-full h-64 object-cover mt-12"
                />
                <img 
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800" 
                  alt="Teacher and kids" 
                  className="rounded-3xl shadow-lg w-full h-64 object-cover"
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};