import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Calendar, ArrowLeft, Clock, Tag } from 'lucide-react';
import { Button } from './ui/Button';

export const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'news', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setNews({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching news detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewsDetail();
    }, [id]);

    // Process images to add captions
    useEffect(() => {
        if (!news) return;

        const processImageCaptions = () => {
            const contentDiv = document.querySelector('.news-content');
            if (!contentDiv) return;

            const images = contentDiv.querySelectorAll('img');
            images.forEach((img) => {
                // Skip if already processed
                if (img.parentElement?.classList.contains('image-with-caption')) return;

                const caption = img.getAttribute('data-caption') || img.getAttribute('title') || img.getAttribute('alt');

                if (caption && caption.trim()) {
                    // Create wrapper
                    const wrapper = document.createElement('div');
                    wrapper.className = 'image-with-caption';

                    // Create caption element
                    const captionEl = document.createElement('p');
                    captionEl.className = 'image-caption';
                    captionEl.textContent = caption;

                    // Wrap image and add caption
                    img.parentNode?.insertBefore(wrapper, img);
                    wrapper.appendChild(img);
                    wrapper.appendChild(captionEl);
                }
            });
        };

        // Wait for content to be rendered
        setTimeout(processImageCaptions, 100);
    }, [news]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
        </div>
    );

    if (!news) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy bài viết</h2>
            <Button onClick={() => navigate('/')}>Quay về trang chủ</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Header */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 container mx-auto">
                    <Button
                        variant="ghost"
                        className="text-white/80 hover:text-white hover:bg-white/10 mb-6 gap-2 pl-0"
                        onClick={() => navigate('/')}
                    >
                        <ArrowLeft className="w-5 h-5" /> Quay lại
                    </Button>

                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {news.tag}
                        </span>
                        <span className="text-gray-300 text-sm font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> {news.date}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight max-w-4xl">
                        {news.title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 md:px-8 -mt-10 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12 max-w-4xl mx-auto">
                    {/* Summary */}
                    {news.summary && (
                        <div className="bg-brand-50 border-l-4 border-brand-500 p-6 rounded-r-xl mb-8">
                            <p className="text-lg text-brand-900 font-medium italic">
                                {news.summary}
                            </p>
                        </div>
                    )}

                    {/* Main Content */}
                    <style>{`
                        .news-content img {
                            max-width: 100% !important;
                            height: auto !important;
                            display: block;
                            margin: 1.5rem auto;
                        }
                        .news-content img[style*="text-align: left"],
                        .news-content p[style*="text-align: left"] img {
                            margin-left: 0;
                            margin-right: auto;
                        }
                        .news-content img[style*="text-align: center"],
                        .news-content p[style*="text-align: center"] img {
                            margin-left: auto;
                            margin-right: auto;
                        }
                        .news-content img[style*="text-align: right"],
                        .news-content p[style*="text-align: right"] img {
                            margin-left: auto;
                            margin-right: 0;
                        }
                        .news-content p[style*="text-align"] {
                            text-align: inherit !important;
                        }
                        .image-with-caption {
                            margin: 2rem auto;
                            max-width: 100%;
                        }
                        .image-caption {
                            text-align: center;
                            font-size: 0.875rem;
                            color: #6b7280;
                            font-style: italic;
                            margin-top: 0.5rem;
                            margin-bottom: 0;
                            line-height: 1.5;
                        }
                    `}</style>
                    <div
                        className="news-content prose prose-lg max-w-none prose-headings:font-display prose-headings:text-brand-900 prose-a:text-brand-600 hover:prose-a:text-brand-700 prose-img:rounded-xl prose-img:shadow-lg prose-p:text-gray-700"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />

                    <hr className="my-12 border-gray-100" />

                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <span className="text-gray-500 text-sm font-medium">Chia sẻ:</span>
                            {/* Add share buttons here if needed */}
                        </div>
                        <Button onClick={() => navigate('/news')} variant="outline">
                            Xem các tin khác
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
