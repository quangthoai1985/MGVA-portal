import React from 'react';
import { motion } from 'framer-motion';
import { History, Building2, Users, Trophy, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-4 pb-24 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="bg-brand-50 py-16 mb-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <span className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-2 block">Về chúng tôi</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Hành trình 15 năm <br/> <span className="text-brand-600">Ươm mầm hạnh phúc</span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg">
            Từ những viên gạch đầu tiên năm 2010, Trường Mầm non Vàng Anh đã không ngừng nỗ lực để trở thành ngôi nhà thứ hai đáng tin cậy cho hàng ngàn trẻ em.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {/* History Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative">
             <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-100 rounded-full -z-10"></div>
             <img 
               src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000" 
               alt="School History" 
               className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
             />
             <div className="absolute bottom-8 right-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <History className="w-6 h-6 text-brand-500" />
                  <span className="font-bold text-gray-900 text-lg">Thành lập 2010</span>
                </div>
                <p className="text-gray-500 text-sm">Khởi đầu với 3 phòng học và 50 học sinh, nay đã vươn mình mạnh mẽ.</p>
             </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl font-display font-bold text-gray-900">Lịch sử hình thành & Phát triển</h2>
            <div className="space-y-6">
              {[
                { year: '2010', title: 'Thành lập trường', desc: 'Trường Mầm non Vàng Anh chính thức đi vào hoạt động tại Quận Phú Nhuận.' },
                { year: '2015', title: 'Mở rộng quy mô', desc: 'Khánh thành cơ sở 2 và nâng cấp hệ thống phòng học theo tiêu chuẩn quốc tế.' },
                { year: '2018', title: 'Đổi mới phương pháp', desc: 'Chính thức áp dụng phương pháp Montessori và Reggio Emilia vào giảng dạy.' },
                { year: '2023', title: 'Trường chuẩn Quốc gia', desc: 'Vinh dự đón nhận bằng khen và công nhận đạt chuẩn Quốc gia mức độ 2.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-brand-500 rounded-full mt-2 group-hover:scale-150 transition-transform"></div>
                    {idx !== 3 && <div className="w-0.5 h-full bg-brand-100 mt-2"></div>}
                  </div>
                  <div className="pb-6">
                    <span className="text-brand-600 font-bold text-lg">{item.year}</span>
                    <h3 className="font-bold text-gray-900 text-xl mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Facilities Scale Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Quy mô & Cơ sở vật chất</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Không gian học tập hiện đại, an toàn và gần gũi với thiên nhiên, đảm bảo điều kiện tốt nhất cho sự phát triển toàn diện của trẻ.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-emerald-50 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Building2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">20+</h3>
                <p className="font-bold text-gray-800 mb-2">Phòng học tiêu chuẩn</p>
                <p className="text-gray-600 text-sm">Diện tích 50m2/phòng, tràn ngập ánh sáng tự nhiên và trang thiết bị hiện đại.</p>
             </div>
             
             <div className="bg-brand-50 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Users className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">500+</h3>
                <p className="font-bold text-gray-800 mb-2">Học sinh theo học</p>
                <p className="text-gray-600 text-sm">Được chia thành các nhóm lớp theo độ tuổi với tỷ lệ cô/trẻ đạt chuẩn vàng.</p>
             </div>

             <div className="bg-sky-50 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Trophy className="w-8 h-8 text-sky-500" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">50+</h3>
                <p className="font-bold text-gray-800 mb-2">Giáo viên & Nhân sự</p>
                <p className="text-gray-600 text-sm">100% đạt chuẩn và trên chuẩn, tận tâm, yêu trẻ và giàu kinh nghiệm.</p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800" className="rounded-2xl w-full h-64 object-cover" alt="Classroom" />
            <img src="https://images.unsplash.com/photo-1596464716127-f9a16a8122d2?auto=format&fit=crop&q=80&w=800" className="rounded-2xl w-full h-64 object-cover" alt="Playground" />
          </div>
        </div>
      </div>
    </div>
  );
};