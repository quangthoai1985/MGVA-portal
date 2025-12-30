import React from 'react';
import { Facebook, MapPin, Phone, Mail, Clock, Instagram, Youtube, Send, Lock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-gray-300 py-16 text-sm relative" id="footer">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.schoolName}
                  className="h-12 w-auto object-contain shadow-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-brand-500/20">
                  {settings?.schoolName ? settings.schoolName.substring(0, 2).toUpperCase() : 'VA'}
                </div>
              )}
              <span className="text-2xl font-display font-bold text-white">
                {settings?.schoolName || 'Vàng Anh'}
              </span>
            </div>
            <p className="leading-relaxed text-gray-400">
              {settings?.pageTitle || 'Trường Mẫu Giáo Vàng Anh - Nơi ươm mầm những ước mơ con trẻ.'}
            </p>
            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-800">
              <p>Giấy phép hoạt động số: 123/GP-GDĐT</p>
              <p>Cấp ngày: 01/01/2010</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold font-display text-lg mb-6">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-brand-500 shrink-0 mt-0.5 group-hover:text-brand-400 transition-colors" />
                <span className="group-hover:text-white transition-colors">{settings?.address || '123 Đường Hạnh Phúc, Quận 1, TP.HCM'}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-brand-500 shrink-0 group-hover:text-brand-400 transition-colors" />
                <span className="group-hover:text-white transition-colors">{settings?.hotline || '090 123 4567'}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-brand-500 shrink-0 group-hover:text-brand-400 transition-colors" />
                <span className="group-hover:text-white transition-colors">{settings?.email || 'info@vanganh.edu.vn'}</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Clock className="w-5 h-5 text-brand-500 shrink-0 group-hover:text-brand-400 transition-colors" />
                <span className="group-hover:text-white transition-colors">7:00 - 17:30 (Thứ 2 - Thứ 6)</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold font-display text-lg mb-6">Liên kết nhanh</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-brand-500 hover:pl-2 transition-all duration-300 block">Quy trình tuyển sinh</a></li>
              <li><a href="#" className="hover:text-brand-500 hover:pl-2 transition-all duration-300 block">Học phí & Ưu đãi</a></li>
              <li><a href="#" className="hover:text-brand-500 hover:pl-2 transition-all duration-300 block">Nội quy trường</a></li>
              <li><a href="#" className="hover:text-brand-500 hover:pl-2 transition-all duration-300 block">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-brand-500 hover:pl-2 transition-all duration-300 block">Tuyển dụng</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-bold font-display text-lg mb-6">Kết nối với chúng tôi</h4>
            <p className="text-gray-400 mb-6">Theo dõi để cập nhật hoạt động mới nhất của trường!</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-blue-900/20" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#229ED9] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-sky-900/20" aria-label="Telegram">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-pink-900/20" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-red-900/20" aria-label="Youtube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {currentYear} {settings?.schoolName || 'Trường Mẫu Giáo Vàng Anh'}. Tất cả quyền được bảo lưu.</p>

          {/* Admin Link */}
          <button
            onClick={() => onNavigate && onNavigate('admin')}
            className="flex items-center gap-2 bg-brand-500 text-white hover:bg-brand-600 transition-all text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-brand-500/20 hover:scale-105 transform duration-200"
          >
            <Lock className="w-3 h-3" />
            Quản trị website
          </button>
        </div>
      </div>
    </footer>
  );
};