import React, { useState, useEffect } from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

interface AnnouncementsProps {
  onNavigate?: (path: string) => void;
}

export const Announcements: React.FC<AnnouncementsProps> = ({ onNavigate }) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(collection(db, 'announcements'), where('status', '==', 'active'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAnnouncements(list);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Fallback if no data
  const displayList = announcements.length > 0 ? announcements : [
    {
      id: 1,
      title: "Thông báo lịch nghỉ lễ Quốc Khánh 02/09/2024",
      content: "Nhà trường xin thông báo đến Quý phụ huynh về lịch nghỉ lễ Quốc Khánh. Các bé sẽ được nghỉ từ thứ Hai (02/09) đến hết thứ Ba (03/09).",
      tag: "Quan trọng"
    },
    {
      id: 2,
      title: "Kế hoạch tiêm chủng bổ sung Vitamin A đợt 2",
      content: "Trạm y tế phường sẽ phối hợp với nhà trường tổ chức cho các bé uống Vitamin A vào sáng thứ Năm tuần tới. Kính mong phụ huynh lưu ý.",
      tag: "Y tế"
    }
  ];

  return (
    <section id="announcements" className="py-24 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-bold tracking-wide uppercase text-sm">Cập nhật mới nhất</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2">
            Thông báo từ nhà trường
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayList.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate && onNavigate(`announcement-detail/${item.id}`)}
              className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-brand-500 transition-colors duration-300 shadow-sm hover:shadow-md group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${item.tag === 'Quan trọng' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                  {item.tag}
                </span>
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-brand-500 transition-colors" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                {item.summary || item.content.replace(/<[^>]+>/g, '')}
              </p>
              <div
                className="inline-flex items-center text-sm font-bold text-gray-900 group-hover:text-brand-600 hover:underline"
              >
                Xem chi tiết <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};