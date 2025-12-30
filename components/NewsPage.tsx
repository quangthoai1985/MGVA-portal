import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Clock, Search } from 'lucide-react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

export const NewsPage: React.FC = () => {
    const navigate = useNavigate();
    const [newsItems, setNewsItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, news, activity
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const q = query(
                    collection(db, 'news'),
                    where('status', '==', 'active'),
                    orderBy('createdAt', 'desc')
                );
                const snapshot = await getDocs(q);
                const list = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNewsItems(list);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const filteredNews = newsItems.filter(item => {
        const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.summary?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'news' && item.tag === 'Tin tức') ||
            (filter === 'activity' && item.tag === 'Hoạt động');
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-2 block">
                        Cập nhật liên tục
                    </span>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
                        Tin tức & Hoạt động
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Theo dõi những hoạt động mới nhất của các bé và thông báo quan trọng từ nhà trường.
                    </p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <Button
                            variant={filter === 'all' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            Tất cả
                        </Button>
                        <Button
                            variant={filter === 'activity' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter('activity')}
                        >
                            Hoạt động
                        </Button>
                        <Button
                            variant={filter === 'news' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter('news')}
                        >
                            Thông báo
                        </Button>
                    </div>

                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Tìm kiếm tin tức..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border-gray-200 focus:ring-brand-500 focus:border-brand-500"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-96 animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredNews.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                                onClick={() => navigate(`/news/${item.id}`)}
                            >
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                            {item.tag}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-3">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{item.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{new Date(item.createdAt?.seconds * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                                        {item.summary}
                                    </p>

                                    <div className="flex items-center text-brand-600 font-bold text-sm group-hover:gap-2 transition-all">
                                        Xem chi tiết <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Không tìm thấy tin tức nào</h3>
                        <p className="text-gray-500">Thử tìm kiếm với từ khóa khác xem sao nhé.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
