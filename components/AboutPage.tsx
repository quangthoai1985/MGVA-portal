import React from 'react';
import { motion } from 'framer-motion';
import { History, Building2, Users, Trophy, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();
  return (
    <div className="bg-white min-h-screen pt-4 pb-24 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="bg-brand-50 py-16 mb-16">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <span className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-2 block">Về chúng tôi</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Hành trình 20 năm <br /> <span className="text-brand-600">Ươm mầm hạnh phúc</span>
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg">
            Từ những viên gạch đầu tiên năm 2006, Trường {settings?.schoolName || 'Mầm non Vàng Anh'} đã không ngừng nỗ lực để trở thành ngôi nhà thứ hai đáng tin cậy cho hàng ngàn trẻ em.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {/* History Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-100 rounded-full -z-10"></div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/vanganh-portal/o/aboutpage%2F1764646245199_z6924891262685_8dd06a32a6e7f077e34f54885a22a52b.jpg?alt=media"
              alt="School History"
              className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
            />
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-display font-bold text-gray-900">Lịch sử hình thành & Phát triển</h2>
            <div className="space-y-6">
              {[
                { year: '2006', title: 'Thành lập trường', desc: `Trường ${settings?.schoolName || 'Mầm non Vàng Anh'} chính thức đi vào hoạt động với tên gọi là Trường mẫu giáo Vĩnh Châu.` },
                { year: '2018', title: 'Đổi tên trường', desc: 'Trường được đổi tên thành Trường mẫu giáo Vàng Anh theo Quyết định số 2352/QĐ-UBND ngày 09 tháng 8 năm 2018 của Ủy ban nhân dân thành phố Châu Đốc.' },
                { year: '2020', title: 'Được đầu tư mở rộng cơ sở vật chất', desc: 'Trường được đầu tư hơn 10 tỷ đồng để nâng cấp toàn diện từ cải tạo các hạng mục của khối cũ, xây dựng khối mới và trang cấp thiết bị, đồ dùng đồ chơi.' },
                { year: '2025', title: 'Trường chuẩn Quốc gia', desc: 'Trường đã vinh dự được công nhận đạt chuẩn quốc gia mức độ 2 và đạt kiểm định chất lượng giáo dục cấp độ 3.' }
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
              <h3 className="text-4xl font-bold text-gray-900 mb-2">10+</h3>
              <p className="font-bold text-gray-800 mb-2">Phòng học tiêu chuẩn</p>
              <p className="text-gray-600 text-sm">Diện tích 50m2/phòng, tràn ngập ánh sáng tự nhiên và trang thiết bị hiện đại.</p>
            </div>

            <div className="bg-brand-50 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Users className="w-8 h-8 text-brand-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">140+</h3>
              <p className="font-bold text-gray-800 mb-2">Học sinh theo học</p>
              <p className="text-gray-600 text-sm">Trường có 5 lớp với 144 trẻ (120 trẻ bán trú).</p>
            </div>

            <div className="bg-sky-50 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Trophy className="w-8 h-8 text-sky-500" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">10+</h3>
              <p className="font-bold text-gray-800 mb-2">Giáo viên & Nhân sự</p>
              <p className="text-gray-600 text-sm">Đội ngũ gồm 18 cán bộ, giáo viên, nhân viên, trong đó 100% đạt chuẩn, 70% trên chuẩn, tận tâm, yêu trẻ và giàu kinh nghiệm.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <img src="https://firebasestorage.googleapis.com/v0/b/vanganh-portal/o/aboutpage%2F1764646290727_z5800009575201_da5bdd0fd3c9d9e70e446c3765eb9842.jpg?alt=media" className="rounded-2xl w-full h-64 object-cover" alt="Classroom" />
            <img src="https://firebasestorage.googleapis.com/v0/b/vanganh-portal/o/aboutpage%2F1764646308350_z5812638503711_e3b52528951982096cadde3bff018243.jpg?alt=media" className="rounded-2xl w-full h-64 object-cover" alt="Playground" />
          </div>
        </div>
      </div>
    </div>
  );
};