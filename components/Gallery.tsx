import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGalleryImages(list);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Fallback to picsum if no data
  const displayImages = galleryImages.length > 0 ? galleryImages : [
    { src: 'https://picsum.photos/id/152/600/800', size: 'row-span-2', title: 'Hoạt động ngoài trời' },
    { src: 'https://picsum.photos/id/102/600/400', size: 'row-span-1', title: 'Giờ ăn trưa' },
    { src: 'https://picsum.photos/id/119/600/400', size: 'row-span-1', title: 'Góc đọc sách' },
    { src: 'https://picsum.photos/id/160/600/400', size: 'row-span-1', title: 'Lớp học vẽ' },
    { src: 'https://picsum.photos/id/180/600/800', size: 'row-span-2', title: 'Dã ngoại công viên' },
    { src: 'https://picsum.photos/id/250/600/400', size: 'row-span-1', title: 'Lễ tổng kết' },
  ];

  // Helper to determine grid size based on index (simulating the original layout)
  const getSize = (idx: number) => {
    if (galleryImages.length > 0) {
      // Simple logic for dynamic data: first and fifth items are tall
      return (idx % 6 === 0 || idx % 6 === 4) ? 'row-span-2' : 'row-span-1';
    }
    return (displayImages[idx] as any).size;
  };

  // Lightbox Logic (simplified from GalleryPage)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const openLightbox = (index: number) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);

  return (
    <section className="py-20 bg-white" id="program">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-brand-600 font-bold tracking-wide uppercase text-sm">Thư viện ảnh</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mt-2 mb-6">
            Hoạt động của bé tại trường
          </h2>
          <p className="max-w-2xl text-gray-600">
            Mỗi khoảnh khắc của con đều đáng giá. Chúng tôi lưu giữ những nụ cười,
            sự tò mò và hành trình lớn khôn của bé qua từng bức ảnh.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {displayImages.map((img, idx) => (
            <div
              key={idx}
              className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 relative group cursor-zoom-in ${getSize(idx)} ${idx === 0 ? 'col-span-2 md:col-span-1' : ''}`}
              onClick={() => openLightbox(idx)}
            >
              <img
                src={img.url || img.src}
                alt={img.title || "Kid activity"}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-medium text-sm">{img.title || "Hoạt động"}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 hover:text-brand-600 hover:border-brand-500"
            onClick={() => navigate('/gallery')}
          >
            Xem toàn bộ album
          </Button>
        </div>
      </div>

      {/* Simple Lightbox for Homepage */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={closeLightbox}>
          <img
            src={displayImages[selectedImageIndex].url || displayImages[selectedImageIndex].src}
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      )}
    </section>
  );
};