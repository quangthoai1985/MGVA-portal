import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from './ui/Button';

export const GalleryPage: React.FC = () => {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const list = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setImages(list);
            } catch (error) {
                console.error("Error fetching gallery:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    const openLightbox = (index: number) => setSelectedImageIndex(index);
    const closeLightbox = () => setSelectedImageIndex(null);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev! + 1) % images.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev! - 1 + images.length) % images.length);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex]);

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-2 block">
                        Thư viện ảnh
                    </span>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                        Khoảnh khắc đáng nhớ
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Nơi lưu giữ những nụ cười trong veo và hành trình khôn lớn mỗi ngày của các bé tại Mầm Non Vàng Anh.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-60 animate-pulse"></div>
                        ))}
                    </div>
                ) : images.length > 0 ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {images.map((img, index) => (
                            <motion.div
                                key={img.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in"
                                onClick={() => openLightbox(index)}
                            >
                                <img
                                    src={img.url || img.src}
                                    alt={img.title || "Gallery Image"}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-white text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <ZoomIn className="w-8 h-8 mx-auto mb-2 opacity-80" />
                                        <h4 className="font-bold text-lg">{img.title}</h4>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        Chưa có hình ảnh nào trong thư viện.
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Nav Buttons */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors hidden md:block z-50"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors hidden md:block z-50"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        {/* Main Image */}
                        <motion.div
                            key={images[selectedImageIndex].id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = Math.abs(offset.x) * velocity.x;
                                if (swipe < -100) nextImage();
                                else if (swipe > 100) prevImage();
                            }}
                            className="relative max-w-full max-h-[90vh] touch-none"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={images[selectedImageIndex].url || images[selectedImageIndex].src}
                                alt={images[selectedImageIndex].title}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                            <div className="absolute bottom-[-3rem] left-0 w-full text-center text-white/80 font-medium">
                                {images[selectedImageIndex].title}
                            </div>
                        </motion.div>

                        {/* Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-mono bg-black/50 px-3 py-1 rounded-full">
                            {selectedImageIndex + 1} / {images.length}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
