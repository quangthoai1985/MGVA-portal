import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Button } from './ui/Button';

import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export const NewsHero: React.FC = () => {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('Fetching news...');
        // Query only active news to satisfy Security Rules for guests
        const q = query(collection(db, 'news'), where('status', '==', 'active'), orderBy('createdAt', 'desc'), limit(5));
        const snapshot = await getDocs(q);
        console.log('Snapshot received. Size:', snapshot.size, 'Empty:', snapshot.empty);
        const list = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        console.log('Processed list:', list);

        if (list.length > 0) {
          setNewsItems(list);
        } else {
          // Fallback if no news
          setNewsItems([]);
          alert('Không tìm thấy tin tức nào (Empty list)');
        }
      } catch (error: any) {
        console.error("Error fetching news:", error);
        alert('Lỗi tải tin tức: ' + error.message);
        // If index error, show link
        if (error.message.includes('index')) {
          prompt("Copy link tạo Index dưới đây:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Auto-rotate logic
  useEffect(() => {
    if (isPaused || newsItems.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [isPaused, newsItems.length]);

  if (loading) return <div className="py-20 text-center text-gray-500">Đang tải tin tức...</div>;
  if (newsItems.length === 0) return null;

  const activeNews = newsItems[activeIndex];

  return (
    <section className="pt-8 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-brand-600 font-bold tracking-wide uppercase text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              Tin tức & Hoạt động
            </span>
            <h2 className="text-3xl font-display font-bold text-gray-900 mt-1">Tiêu điểm Vàng Anh</h2>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2 text-brand-600 hover:text-brand-700">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">

          {/* LEFT: Main Hero News (2/3 width) */}
          <div
            className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-xl group cursor-pointer"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNews.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeNews.image}
                  alt={activeNews.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-10">
              <motion.div
                key={`text-${activeNews.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {activeNews.tag}
                  </span>
                  <span className="text-gray-300 text-xs font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {activeNews.date}
                  </span>
                </div>
                <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-3 leading-tight md:max-w-3xl">
                  {activeNews.title}
                </h3>
                <p className="text-gray-200 text-sm md:text-lg line-clamp-2 md:max-w-2xl mb-6">
                  {activeNews.summary}
                </p>
                <Button
                  variant="primary"
                  className="shadow-lg shadow-brand-500/20"
                  onClick={() => navigate(`/news/${activeNews.id}`)}
                >
                  Đọc chi tiết
                </Button>
              </motion.div>
            </div>
          </div>

          {/* RIGHT: News List (1/3 width) */}
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
            {newsItems.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 relative overflow-hidden ${isActive
                    ? 'bg-white border-brand-500 shadow-lg'
                    : 'bg-white border-transparent hover:border-gray-200'
                    }`}
                >
                  {/* Progress Bar for Active Item */}
                  {isActive && !isPaused && (
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-1 bg-brand-500 z-10"
                    />
                  )}

                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt="thumbnail"
                      className={`w-20 h-20 rounded-xl object-cover shrink-0 transition-all ${isActive ? 'brightness-100' : 'brightness-90 grayscale-[0.3]'}`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${isActive ? 'text-brand-600' : 'text-gray-400'}`}>
                          {item.tag}
                        </span>
                        {isActive && <span className="flex h-2 w-2 rounded-full bg-red-500"></span>}
                      </div>
                      <h4 className={`font-bold text-sm leading-snug mb-2 line-clamp-2 ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* View All Button for Mobile */}
            <Button variant="outline" fullWidth className="md:hidden mt-2">
              Xem tất cả tin tức
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};