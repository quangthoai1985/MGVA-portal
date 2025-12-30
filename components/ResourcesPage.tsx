import React, { useState } from 'react';
import { FileText, Music, Video, Download, Search, FolderOpen, FileSpreadsheet } from 'lucide-react';
import { Button } from './ui/Button';
import { motion } from 'framer-motion';

type ResourceType = 'all' | 'document' | 'music' | 'video' | 'form';

interface Resource {
  id: number;
  title: string;
  type: Exclude<ResourceType, 'all'>;
  size: string;
  date: string;
  downloads: number;
  description: string;
}

const RESOURCES: Resource[] = [
  {
    id: 1,
    title: "Giáo án tuần 1 - Lớp Mầm: Chủ đề Gia đình",
    type: "document",
    size: "2.4 MB",
    date: "20/08/2024",
    downloads: 128,
    description: "Chi tiết kế hoạch giảng dạy, hoạt động vui chơi và rèn luyện kỹ năng cho bé lớp Mầm tuần đầu tiên."
  },
  {
    id: 2,
    title: "Album nhạc thể dục sáng: Khỏe & Vui",
    type: "music",
    size: "15 MB",
    date: "15/08/2024",
    downloads: 342,
    description: "Tổng hợp các bài hát vui nhộn, nhịp điệu sôi động giúp bé hứng khởi bắt đầu ngày mới."
  },
  {
    id: 3,
    title: "Video hướng dẫn: 6 bước rửa tay đúng cách",
    type: "video",
    size: "45 MB",
    date: "10/08/2024",
    downloads: 89,
    description: "Video hoạt hình sinh động hướng dẫn bé quy trình rửa tay sạch khuẩn chuẩn Bộ Y tế."
  },
  {
    id: 4,
    title: "Đơn xin nghỉ học (Mẫu 2024)",
    type: "form",
    size: "500 KB",
    date: "01/08/2024",
    downloads: 56,
    description: "Mẫu đơn xin phép nghỉ học dành cho phụ huynh, bao gồm các thông tin cần thiết."
  },
  {
    id: 5,
    title: "Thực đơn dinh dưỡng tháng 9",
    type: "document",
    size: "1.2 MB",
    date: "25/08/2024",
    downloads: 210,
    description: "Chi tiết thực đơn, định lượng calo và thành phần dinh dưỡng các bữa ăn trong tháng."
  },
  {
    id: 6,
    title: "Tuyển tập truyện kể: Bé ngoan",
    type: "music",
    size: "28 MB",
    date: "18/08/2024",
    downloads: 156,
    description: "Audio kể chuyện diễn cảm các câu chuyện giáo dục nhân cách cho trẻ mầm non."
  },
  {
    id: 7,
    title: "Giáo án Montessori: Thực hành cuộc sống",
    type: "document",
    size: "5.6 MB",
    date: "22/08/2024",
    downloads: 98,
    description: "Tài liệu hướng dẫn chi tiết các bài tập thực hành cuộc sống theo phương pháp Montessori."
  }
];

const FILTER_TABS: { id: ResourceType; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'Tất cả', icon: FolderOpen },
  { id: 'document', label: 'Giáo án & Tài liệu', icon: FileText },
  { id: 'music', label: 'Âm nhạc', icon: Music },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'form', label: 'Biểu mẫu', icon: FileSpreadsheet },
];

export const ResourcesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ResourceType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = RESOURCES.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'music': return <Music className="w-6 h-6 text-pink-500" />;
      case 'video': return <Video className="w-6 h-6 text-red-500" />;
      case 'form': return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
      default: return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-50 group-hover:bg-blue-100';
      case 'music': return 'bg-pink-50 group-hover:bg-pink-100';
      case 'video': return 'bg-red-50 group-hover:bg-red-100';
      case 'form': return 'bg-emerald-50 group-hover:bg-emerald-100';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="bg-white min-h-screen pt-4 pb-24 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="bg-brand-50 py-16 mb-12">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <span className="text-brand-600 font-bold tracking-wide uppercase text-sm mb-2 block">Thư viện số</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Kho tài nguyên học tập
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-8">
            Nơi chia sẻ giáo án, tài liệu học tập, âm nhạc và video bổ ích dành cho giáo viên và phụ huynh Vàng Anh.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-transparent focus:border-brand-500 focus:ring-0 shadow-lg text-gray-700 outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 border ${
                  activeFilter === tab.id
                    ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/25'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${getColorClass(item.type)}`}>
                    {getIcon(item.type)}
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    {item.size}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400">
                    {item.downloads} lượt tải
                  </span>
                  <Button variant="ghost" size="sm" className="text-brand-600 hover:bg-brand-50 px-3 h-9">
                    <Download className="w-4 h-4 mr-2" />
                    Tải về
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
            <p className="text-gray-500">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
          </div>
        )}
      </div>
    </div>
  );
};