import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Tag, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Button } from './ui/Button';

interface AnnouncementDetailProps {
    id: string;
    onBack: () => void;
}

export const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({ id, onBack }) => {
    const [announcement, setAnnouncement] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncement = async () => {
            try {
                const docRef = doc(db, 'announcements', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setAnnouncement({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching announcement:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAnnouncement();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-gray-500">Không tìm thấy thông báo.</p>
                <Button onClick={onBack} variant="outline">Quay lại</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl">
                <Button
                    onClick={onBack}
                    variant="ghost"
                    className="mb-8 hover:bg-white hover:shadow-sm transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại trang chủ
                </Button>

                <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 md:p-12 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${announcement.tag === 'Quan trọng' ? 'bg-red-100 text-red-600' :
                                    announcement.tag === 'Y tế' ? 'bg-blue-100 text-blue-600' :
                                        'bg-emerald-100 text-emerald-600'
                                }`}>
                                {announcement.tag}
                            </span>
                            <div className="flex items-center text-gray-400 text-sm font-medium">
                                <Calendar className="w-4 h-4 mr-1.5" />
                                {announcement.date}
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight">
                            {announcement.title}
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 prose prose-lg max-w-none prose-headings:font-display prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-img:rounded-2xl">
                        <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
                    </div>
                </article>
            </div>
        </div>
    );
};
