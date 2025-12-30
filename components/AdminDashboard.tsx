import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Utensils,
  FileText,
  Settings,
  LogOut,
  Users,
  Eye,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Save,
  ChevronLeft,
  Image as ImageIcon, // Icon for Gallery
  Upload, // Icon for Upload
  Bell, // Icon for Announcements
  AlertCircle, // Icon for Priority
  Globe, // Icon for Website
  Inbox, // Icon for Contact/Leads
  Phone, // Icon for Phone
  Mail, // Icon for Mail
  CheckCircle, // Icon for Status
  Clock, // Icon for Pending
  CalendarDays, // Icon for Schedule
  Menu, // Icon for Hamburger
  X, // Icon for Close
  Loader2
} from 'lucide-react';
import { Button } from './ui/Button';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, doc, getDocs, writeBatch, query, orderBy, onSnapshot, deleteDoc, updateDoc, addDoc, serverTimestamp, getDoc, limit, setDoc, where } from 'firebase/firestore';
import { DailyMenu } from '../types';
import { getWeekDates } from '../utils/menuUtils';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

type AdminTab = 'dashboard' | 'menu' | 'schedule' | 'news' | 'settings' | 'gallery' | 'announcements' | 'contacts';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { Editor } from './ui/Editor';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { currentUser, login, logout } = useAuth();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // --- LOGIN VIEW ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 animate-in fade-in zoom-in duration-300">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-brand-500/20 mx-auto mb-4">
              VA
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Đăng nhập quản trị</h2>
            <p className="text-gray-500 mt-2">Hệ thống quản lý nội dung Vàng Anh</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" type="button" onClick={() => onNavigate('home')} fullWidth className="text-gray-500">
                Quay lại
              </Button>
              <Button type="submit" fullWidth>
                Đăng nhập
              </Button>
            </div>
          </form>
          <div className="mt-6 text-center text-xs text-gray-400">
            Hint: Sử dụng tài khoản Firebase đã tạo
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans relative">

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Mobile Sidebar Drawer */}
          <aside className="relative w-64 bg-slate-900 text-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="absolute top-2 right-2">
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <AdminSidebarContent
              activeTab={activeTab}
              setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }}
              onNavigate={onNavigate}
              handleLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar (Fixed) */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full z-10 hidden md:flex flex-col">
        <AdminSidebarContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigate={onNavigate}
          handleLogout={handleLogout}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-x-hidden">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button
              className="md:hidden p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-7 h-7" />
            </button>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                {activeTab === 'dashboard' && 'Tổng quan hệ thống'}
                {activeTab === 'contacts' && 'Yêu cầu tư vấn'}
                {activeTab === 'gallery' && 'Quản lý Thư viện ảnh'}
                {activeTab === 'menu' && 'Quản lý thực đơn'}
                {activeTab === 'schedule' && 'Quản lý Thời khóa biểu'}
                {activeTab === 'news' && 'Tin tức & Hoạt động'}
                {activeTab === 'announcements' && 'Quản lý Thông báo'}
                {activeTab === 'settings' && 'Cấu hình chung'}
              </h1>
              <p className="text-gray-500 text-sm mt-1 hidden md:block">Xin chào, Admin! Chúc bạn một ngày làm việc hiệu quả.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" onClick={() => onNavigate('home')} className="w-full md:w-auto">
              <ChevronLeft className="w-4 h-4 mr-2 md:hidden" />
              Về trang chủ
            </Button>
          </div>
        </header>

        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'contacts' && <ContactManager />}
        {activeTab === 'gallery' && <GalleryManager />}
        {activeTab === 'menu' && <MenuManager />}
        {activeTab === 'schedule' && <ScheduleManager />}
        {activeTab === 'news' && <NewsManager />}
        {activeTab === 'announcements' && <AnnouncementsManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </main>
    </div>
  );
};

// --- REUSABLE SIDEBAR CONTENT COMPONENT ---
interface AdminSidebarContentProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onNavigate: (path: string) => void;
  handleLogout: () => void;
}

const AdminSidebarContent: React.FC<AdminSidebarContentProps> = ({ activeTab, setActiveTab, onNavigate, handleLogout }) => {
  return (
    <>
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            VA
          </div>
          <span className="font-bold text-lg tracking-wide">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <SidebarItem
          icon={LayoutDashboard}
          label="Tổng quan"
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        />
        <SidebarItem
          icon={Inbox}
          label="Yêu cầu tư vấn"
          active={activeTab === 'contacts'}
          onClick={() => setActiveTab('contacts')}
        />
        <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nội dung</div>
        <SidebarItem
          icon={Bell}
          label="Thông báo"
          active={activeTab === 'announcements'}
          onClick={() => setActiveTab('announcements')}
        />
        <SidebarItem
          icon={FileText}
          label="Tin tức & HĐ"
          active={activeTab === 'news'}
          onClick={() => setActiveTab('news')}
        />
        <SidebarItem
          icon={Utensils}
          label="Thực đơn tuần"
          active={activeTab === 'menu'}
          onClick={() => setActiveTab('menu')}
        />
        <SidebarItem
          icon={CalendarDays}
          label="Thời khóa biểu"
          active={activeTab === 'schedule'}
          onClick={() => setActiveTab('schedule')}
        />
        <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Media</div>
        <SidebarItem
          icon={ImageIcon}
          label="Thư viện ảnh"
          active={activeTab === 'gallery'}
          onClick={() => setActiveTab('gallery')}
        />
        <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Hệ thống</div>
        <SidebarItem
          icon={Settings}
          label="Cấu hình chung"
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all w-full text-sm font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Về Trang Chủ
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-all w-full text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </>
  );
};

// --- SUB COMPONENTS ---

const SidebarItem: React.FC<{ icon: React.ElementType, label: string, active: boolean, onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-medium ${active
      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
      : 'text-gray-400 hover:text-white hover:bg-slate-800'
      }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    visitCount: 0,
    contactRequests: 0,
    newContacts: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Stats
    const fetchStats = async () => {
      try {
        // General Settings (Students & Visits)
        const settingsRef = doc(db, 'settings', 'general');
        const settingsSnap = await getDoc(settingsRef);
        const settingsData = settingsSnap.exists() ? settingsSnap.data() : { totalStudents: 524, visitCount: 8200 };

        // Contacts
        const contactsQ = query(collection(db, 'contacts'));
        const contactsSnap = await getDocs(contactsQ);
        const totalContacts = contactsSnap.size;
        const newContacts = contactsSnap.docs.filter(doc => doc.data().status === 'new').length;

        setStats({
          totalStudents: settingsData.totalStudents || 0,
          visitCount: settingsData.visitCount || 0,
          contactRequests: totalContacts,
          newContacts: newContacts
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();

    // Fetch Recent Activities (Combined Announcements & Gallery)
    const fetchActivities = async () => {
      try {
        const announcementsQ = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(3));
        const galleryQ = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'), limit(3));

        const [announcementsSnap, gallerySnap] = await Promise.all([
          getDocs(announcementsQ),
          getDocs(galleryQ)
        ]);

        const activities = [
          ...announcementsSnap.docs.map(doc => ({ type: 'announcement', ...doc.data() })),
          ...gallerySnap.docs.map(doc => ({ type: 'gallery', ...doc.data() }))
        ].sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
          .slice(0, 5);

        setRecentActivities(activities);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tổng học sinh"
          value={stats.totalStudents.toString()}
          change="Năm học 2024-2025"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Lượt truy cập"
          value={stats.visitCount.toLocaleString()}
          change="Tổng lượt xem"
          icon={Eye}
          color="bg-emerald-500"
        />
        <StatCard
          title="Yêu cầu tư vấn"
          value={stats.contactRequests.toString()}
          change={`${stats.newContacts} chưa xử lý`}
          icon={Inbox}
          color="bg-brand-500"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Hoạt động gần đây</h3>
        <div className="space-y-4">
          {recentActivities.length > 0 ? recentActivities.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'announcement' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                  {item.type === 'announcement' ? <Bell className="w-4 h-4 text-orange-600" /> : <ImageIcon className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.title || item.content}</p>
                  <p className="text-xs text-gray-500">
                    {item.type === 'announcement' ? 'Thông báo' : 'Thư viện ảnh'} • {item.date || new Date(item.createdAt?.seconds * 1000).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {item.status === 'active' ? 'Hiển thị' : 'Đã đăng'}
              </span>
            </div>
          )) : (
            <p className="text-sm text-gray-500 text-center py-4">Chưa có hoạt động nào gần đây.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ContactManager = () => {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setContacts(contactList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const { confirm } = useConfirm();

  const handleDeleteContact = async (id: string) => {
    confirm({
      title: 'Xóa yêu cầu tư vấn',
      message: 'Bạn có chắc chắn muốn xóa yêu cầu này? Hành động này không thể hoàn tác.',
      confirmLabel: 'Xóa',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'contacts', id));
          showToast('Đã xóa yêu cầu thành công', 'success');
        } catch (error) {
          console.error("Error deleting contact:", error);
          showToast("Có lỗi xảy ra khi xóa.", 'error');
        }
      }
    });
  };

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'new' ? 'processed' : 'new';
      await updateDoc(doc(db, 'contacts', id), {
        status: newStatus
      });
      showToast(`Đã cập nhật trạng thái thành: ${newStatus === 'processed' ? 'Đã xử lý' : 'Mới'}`, 'success');
    } catch (error) {
      console.error("Error updating status:", error);
      showToast('Lỗi khi cập nhật trạng thái.', 'error');
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  const newCount = contacts.filter(c => c.status === 'new').length;
  const processedCount = contacts.filter(c => c.status === 'processed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <input type="text" placeholder="Tìm kiếm SĐT, tên..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <Eye className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> {newCount} Mới
          </span>
          <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-sm font-bold border border-gray-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span> {processedCount} Đã xử lý
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <div key={contact.id} className={`bg-white p-6 rounded-2xl border transition-all shadow-sm ${contact.status === 'processed' ? 'border-gray-100 bg-gray-50/50' : 'border-blue-100 hover:shadow-md'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-gray-100 border-dashed">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${contact.status === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                  {contact.parentName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{contact.parentName}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {contact.phone}</span>
                    <span className="hidden md:inline">•</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-400 font-medium">{contact.date}</span>
                {contact.status === 'new' ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                    <Clock className="w-3 h-3" /> Mới
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100">
                    <CheckCircle className="w-3 h-3" /> Đã tư vấn
                  </span>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-gray-600 text-sm italic">"{contact.message}"</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="px-3 py-1 rounded-lg bg-orange-50 text-orange-700 font-medium border border-orange-100">
                    Bé: <strong>{contact.childName}</strong>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 font-medium border border-gray-200">
                    Tuổi: {contact.childAge}
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-center gap-2">
                <Button variant="primary" size="sm" className="w-full gap-2 justify-center" onClick={() => window.location.href = `tel:${contact.phone}`}>
                  <Phone className="w-4 h-4" /> Gọi điện ngay
                </Button>
                {contact.status === 'new' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 justify-center border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                    onClick={() => handleStatusUpdate(contact.id, contact.status)}
                  >
                    <CheckCircle className="w-4 h-4" /> Đánh dấu đã xử lý
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 justify-center text-gray-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => handleDeleteContact(contact.id)}
                >
                  <Trash2 className="w-4 h-4" /> Xóa yêu cầu
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnnouncementsManager = () => {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tag: 'Quan trọng',
    status: 'active'
  });

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAnnouncements(list);
    });
    return () => unsubscribe();
  }, []);

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `announcements/images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error uploading editor image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentAnnouncement) {
        await updateDoc(doc(db, 'announcements', currentAnnouncement.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        showToast('Cập nhật thông báo thành công!', 'success');
      } else {
        await addDoc(collection(db, 'announcements'), {
          ...formData,
          createdAt: serverTimestamp(),
          date: new Date().toLocaleDateString('vi-VN')
        });
        showToast('Tạo thông báo mới thành công!', 'success');
      }
      resetForm();
    } catch (error) {
      console.error("Error saving announcement:", error);
      showToast('Có lỗi xảy ra khi lưu thông báo.', 'error');
    }
  };

  const { confirm } = useConfirm();

  const handleDelete = async (id: string) => {
    confirm({
      title: 'Xóa thông báo',
      message: 'Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác.',
      confirmLabel: 'Xóa',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'announcements', id));
          showToast('Đã xóa thông báo thành công', 'success');
        } catch (error) {
          console.error("Error deleting announcement:", error);
          showToast('Có lỗi xảy ra khi xóa.', 'error');
        }
      }
    });
  };

  const startEdit = (item: any) => {
    setIsEditing(true);
    setIsFormVisible(true);
    setCurrentAnnouncement(item);
    setFormData({
      title: item.title,
      summary: item.summary || '',
      content: item.content,
      tag: item.tag,
      status: item.status
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setIsFormVisible(false);
    setCurrentAnnouncement(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      tag: 'Quan trọng',
      status: 'active'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <input type="text" placeholder="Tìm kiếm thông báo..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <Eye className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <Button size="sm" className="gap-2" onClick={() => {
          resetForm();
          setIsFormVisible(true);
        }}>
          <Plus className="w-4 h-4" /> Tạo thông báo
        </Button>
      </div>

      {/* Form Section */}
      {isFormVisible && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">{isEditing ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                rows={2}
                placeholder="Tóm tắt nội dung thông báo (hiển thị trên trang chủ)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung chi tiết</label>
              <Editor
                value={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
                onImageUpload={handleEditorImageUpload}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại tin</label>
                <select
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="Quan trọng">Quan trọng</option>
                  <option value="Y tế">Y tế</option>
                  <option value="Sự kiện">Sự kiện</option>
                  <option value="Học tập">Học tập</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="active">Hiển thị</option>
                  <option value="expired">Đã hết hạn</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsFormVisible(false)}>Hủy</Button>
              <Button type="submit">{isEditing ? 'Cập nhật' : 'Đăng thông báo'}</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {announcements.map((item) => (
          <div
            key={item.id}
            onClick={() => startEdit(item)}
            className={`bg-white p-6 rounded-2xl border transition-all shadow-sm cursor-pointer ${item.status === 'expired' ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:border-brand-300 hover:shadow-md'}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${item.tag === 'Quan trọng' ? 'bg-red-50 text-red-600 border-red-100' :
                  item.tag === 'Y tế' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-green-50 text-green-600 border-green-100'
                  }`}>
                  {item.tag}
                </span>
                <span className="text-xs text-gray-400">• {item.date}</span>
                {item.status === 'expired' && <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Đã hết hạn</span>}
              </div>
              <div className="flex gap-1">
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-brand-600 transition-colors"
                  title="Chỉnh sửa"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(item);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  title="Xóa"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
              {item.tag === 'Quan trọng' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {item.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {item.summary || item.content.replace(/<[^>]+>/g, '')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const GalleryManager = () => {
  const { showToast } = useToast();
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGalleryImages(list);
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'gallery'), {
          url,
          title: file.name.split('.')[0],
          category: 'Hoạt động',
          createdAt: serverTimestamp()
        });
        showToast('Tải ảnh lên thành công!', 'success');
      } catch (error) {
        console.error("Error uploading image:", error);
        showToast('Lỗi khi tải ảnh.', 'error');
      } finally {
        setUploading(false);
      }
    }
  };

  const { confirm } = useConfirm();

  const handleDelete = async (id: string, url: string) => {
    confirm({
      title: 'Xóa ảnh',
      message: 'Bạn có chắc chắn muốn xóa ảnh này khỏi thư viện? Hành động này không thể hoàn tác.',
      confirmLabel: 'Xóa',
      variant: 'danger',
      onConfirm: async () => {
        try {
          // Delete from Firestore
          await deleteDoc(doc(db, 'gallery', id));

          // Try to delete from Storage (optional, might fail if URL is external)
          if (url.includes('firebasestorage')) {
            const fileRef = ref(storage, url);
            await deleteObject(fileRef).catch(err => console.log("Storage delete skipped", err));
          }
          showToast('Đã xóa ảnh thành công', 'success');
        } catch (error) {
          console.error("Error deleting image:", error);
          showToast('Có lỗi xảy ra khi xóa ảnh.', 'error');
        }
      }
    });
  };

  const handleUpdate = async (id: string, field: string, value: string) => {
    try {
      await updateDoc(doc(db, 'gallery', id), {
        [field]: value
      });
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Thư viện ảnh ({galleryImages.length})</h3>
        <div className="relative">
          <input
            type="file"
            id="gallery-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="gallery-upload">
            <Button size="sm" className="gap-2 pointer-events-none" as="span">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {uploading ? 'Đang tải...' : 'Thêm ảnh vào thư viện'}
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((img) => (
          <div key={img.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <img src={`${img.url}`} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                onClick={() => handleDelete(img.id, img.url)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <input
                type="text"
                defaultValue={img.title}
                onBlur={(e) => handleUpdate(img.id, 'title', e.target.value)}
                className="w-full text-sm font-bold text-gray-900 border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400 mb-1"
                placeholder="Tiêu đề ảnh..."
              />
              <div className="flex items-center gap-2">
                <select
                  className="text-xs text-gray-500 bg-gray-50 border-none rounded px-2 py-1 cursor-pointer hover:bg-gray-100 focus:ring-0 w-full"
                  defaultValue={img.category}
                  onChange={(e) => handleUpdate(img.id, 'category', e.target.value)}
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Cơ sở vật chất">Cơ sở vật chất</option>
                  <option value="Sự kiện">Sự kiện</option>
                  <option value="Sinh hoạt">Sinh hoạt</option>
                  <option value="Năng khiếu">Năng khiếu</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Placeholder */}
        <label htmlFor="gallery-upload" className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center aspect-square bg-gray-50 hover:bg-gray-100 hover:border-brand-300 transition-all text-gray-400 hover:text-brand-500 group">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          </div>
          <span className="font-bold text-xs">{uploading ? 'Đang tải...' : 'Thêm ảnh'}</span>
        </label>
      </div>
    </div>
  );
};

const MenuManager = () => {
  const { showToast } = useToast();
  const [activeWeek, setActiveWeek] = React.useState(1);
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [menuData, setMenuData] = React.useState<DailyMenu[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [monthlyMenuFile, setMonthlyMenuFile] = React.useState<File | null>(null);
  const [currentMenuUrl, setCurrentMenuUrl] = React.useState<string>('');
  const [currentMenuFileName, setCurrentMenuFileName] = React.useState<string>('');
  const [uploading, setUploading] = React.useState(false);

  // Fetch menu data for all weeks
  React.useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        // Fetch all menus for the selected month/year
        // We construct IDs based on the selected month/year: menu_YYYY_MM_weekW_dayD
        // However, to fetch all efficiently without knowing exact headers, we might query by collection if feasible, 
        // OR we can just generate the expected IDs and fetch them. 
        // Since we need to show 4 weeks, we can fetch all potential docs.

        // BETTER APPROACH: Query by 'month' and 'year' fields if we add them to docs.
        // I added 'month' and 'year' to types, so assuming we verify 'handleSave' adds them.
        // But for backward compatibility or if fields are missing, let's use the ID convention for now or query.
        // Actually, previous step updated types.ts. We should use a query.

        const q = query(
          collection(db, 'menus'),
          // We can't easily query by fields if they don't exist yet on old docs.
          // OLD docs: 'weekX_dayY'. NEW docs: 'menu_YYYY_MM_weekX_dayY'.
          // Let's rely on ID patterns or just fetch the specific 4 weeks * 5 days = 20 docs.
        );

        // Let's just try obtaining all docs gives us flexibility but might be heavy? No, only a few docs in total usually?
        // Actually, if we have many months, fetching ALL is bad.
        // Let's fetch specific IDs for this month!

        // Generate expected IDs for 4 weeks * 5 days
        const expectedIds: string[] = [];
        for (let w = 1; w <= 4; w++) {
          for (let d = 2; d <= 6; d++) {
            expectedIds.push(`menu_${selectedYear}_${selectedMonth}_week${w}_day${d}`);
          }
        }

        // Firestore 'in' query supports up to 10 items (or 30? it varies, usually 10 for 'in', 30 for 'array-contains'). 
        // 20 items is too many for a single 'in' check on documentId().
        // So we might need to make parallel requests or just fetch the whole collection and filter client side IF the collection is small.
        // BUT as data grows, that's bad.
        // Best approach: Add 'month' and 'year' fields and Composite Index? 
        // OR just fetch them one by one (20 reads is fine).
        // Let's try fetching by query if possible. 
        // Allow querying for this specific month/year.

        let menus: DailyMenu[] = [];
        const qByMonth = query(
          collection(db, 'menus'),
          where('month', '==', selectedMonth),
          where('year', '==', selectedYear)
        );
        const querySnapshot = await getDocs(qByMonth);
        menus = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyMenu));

        // If no data found for this month (e.g. new month), we initialize empty
        if (menus.length === 0) {
          // check if we have data from old format solely for "current" month? No, let's just use empty for new months.
        }

        // Sort client-side
        menus = menus.sort((a, b) => {
          if (a.week !== b.week) return a.week - b.week;
          return a.dayOfWeek - b.dayOfWeek;
        });

        // Deduplicate Logic
        // In case multiple documents exist for the same day (e.g. mixed ID formats),
        // we prioritize the one matching the new ID format 'menu_YYYY_MM...',
        // or the one with content.
        const uniqueMap = new Map<string, DailyMenu>();
        const targetIdPrefix = `menu_${selectedYear}_${selectedMonth}`;

        menus.forEach(item => {
          const key = `${item.week}-${item.dayOfWeek}`;

          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          } else {
            const existing = uniqueMap.get(key)!;

            // Rules to replace existing:
            // 1. If current item has correct ID prefix and existing does not.
            // 2. If both have/don't have prefix, but current has content and existing is empty.
            const currentHasPrefix = item.id?.startsWith(targetIdPrefix);
            const existingHasPrefix = existing.id?.startsWith(targetIdPrefix);

            const currentHasContent = (item.mainMeal || item.morningSnack || '').length > 0;
            const existingHasContent = (existing.mainMeal || existing.morningSnack || '').length > 0;

            let shouldReplace = false;

            if (currentHasPrefix && !existingHasPrefix) {
              shouldReplace = true;
            } else if (currentHasPrefix === existingHasPrefix) {
              if (currentHasContent && !existingHasContent) {
                shouldReplace = true;
              }
            }

            if (shouldReplace) {
              uniqueMap.set(key, item);
            }
          }
        });

        menus = Array.from(uniqueMap.values()).sort((a, b) => {
          if (a.week !== b.week) return a.week - b.week;
          return a.dayOfWeek - b.dayOfWeek;
        });

        if (menus.length > 0) {
          setMenuData(menus);
        } else {
          // Initialize with empty data for all 4 weeks
          const initialData: DailyMenu[] = [];
          for (let week = 1; week <= 4; week++) {
            const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];
            const dates = getWeekDates(week, selectedMonth, selectedYear);

            weekDays.forEach((day, index) => {
              initialData.push({
                week,
                dayOfWeek: index + 2,
                day,
                date: dates[index],
                morningSnack: '',
                mainMeal: '',
                afternoonSnack1: '',
                afternoonSnack2: '',
                month: selectedMonth,
                year: selectedYear
              });
            });
          }
          setMenuData(initialData);
        }

        // Fetch monthly menu URL
        // We need month specific menu file? "File Thực đơn tháng" implies specific to this month? 
        // Or one global file? 
        // User request: "Hiển thị File Thực đơn tháng đã được upload".
        // It implies the file for the SELECTED month ideally, OR just one file.
        // Let's assume one GLOBAL file for now based on previous implementation, 
        // BUT logic suggests it should probably be per month if we are selecting months?
        // "Trong Admin Panel thêm tùy chọn Drop List chọn tháng để nhập thực đơn." -> "Hiển thị File Thực đơn tháng..." 
        // Likely per month. Let's make it per month: 'settings/menu_YYYY_MM'.

        const menuSettingsId = `menu_${selectedYear}_${selectedMonth}`;
        const menuSettingsDoc = await getDoc(doc(db, 'settings', menuSettingsId));

        // Fallback to global 'menu' only if dealing with legacy? No, let's start fresh for months.
        if (menuSettingsDoc.exists()) {
          setCurrentMenuUrl(menuSettingsDoc.data()?.monthlyMenuUrl || '');
          setCurrentMenuFileName(menuSettingsDoc.data()?.fileName || '');
        } else {
          setCurrentMenuUrl('');
          setCurrentMenuFileName('');
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        showToast('Lỗi khi tải thực đơn', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [selectedMonth, selectedYear]);

  const getCurrentWeekMenu = () => {
    return menuData.filter(item => item.week === activeWeek);
  };

  const handleInputChange = (dayOfWeek: number, field: keyof DailyMenu, value: string) => {
    const newMenu = menuData.map(item => {
      if (item.week === activeWeek && item.dayOfWeek === dayOfWeek) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setMenuData(newMenu);
  };

  const handleMonthlyMenuUpload = async () => {
    if (!monthlyMenuFile) {
      showToast('Vui lòng chọn file', 'error');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `menus/monthly/${selectedYear}_${selectedMonth}_${Date.now()}_${monthlyMenuFile.name}`);
      await uploadBytes(storageRef, monthlyMenuFile);
      const downloadUrl = await getDownloadURL(storageRef);

      // Save URL to Firestore with specific month ID
      const menuSettingsId = `menu_${selectedYear}_${selectedMonth}`;
      const menuSettingsRef = doc(db, 'settings', menuSettingsId);

      await setDoc(menuSettingsRef, {
        monthlyMenuUrl: downloadUrl,
        fileName: monthlyMenuFile.name,
        month: selectedMonth,
        year: selectedYear,
        updatedAt: serverTimestamp()
      }, { merge: true });

      setCurrentMenuUrl(downloadUrl);
      setCurrentMenuFileName(monthlyMenuFile.name);
      setMonthlyMenuFile(null);
      showToast('Đã tải lên thực đơn tháng thành công!', 'success');
    } catch (error) {
      console.error("Error uploading monthly menu:", error);
      showToast('Lỗi khi tải lên file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMonthlyMenu = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa file thực đơn này không?')) return;

    try {
      // Delete from Firestore
      const menuSettingsId = `menu_${selectedYear}_${selectedMonth}`;
      await deleteDoc(doc(db, 'settings', menuSettingsId));

      // Optionally delete from Storage if we had the full path ref, but URL is enough to unlink.
      // For now, we just unlink the DB record.

      setCurrentMenuUrl('');
      setCurrentMenuFileName('');
      showToast('Đã xóa file thực đơn tháng.', 'success');
    } catch (error) {
      console.error("Error deleting monthly menu:", error);
      showToast('Lỗi khi xóa file', 'error');
    }
  };

  const handleSave = async () => {
    try {
      const batch = writeBatch(db);
      const currentWeekMenu = getCurrentWeekMenu();

      currentWeekMenu.forEach((item) => {
        // Use composite ID: menu_YYYY_MM_weekW_dayD
        const docId = `menu_${selectedYear}_${selectedMonth}_week${item.week}_day${item.dayOfWeek}`;
        const docRef = doc(db, 'menus', docId);
        const { id, ...data } = item;

        // Ensure month and year are saved
        const saveData = {
          ...data,
          month: selectedMonth,
          year: selectedYear
        };

        batch.set(docRef, saveData);
      });

      await batch.commit();
      showToast('Đã lưu thực đơn tuần ' + activeWeek + ' (Tháng ' + selectedMonth + ') thành công!', 'success');
    } catch (error) {
      console.error("Error saving menu:", error);
      showToast('Lỗi khi lưu thực đơn', 'error');
    }
  };

  if (loading) return <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;

  const currentWeekMenu = getCurrentWeekMenu();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Month/Year Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-wrap gap-4 items-end">
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tháng</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="w-full rounded-lg border-gray-200 focus:ring-brand-500 focus:border-brand-500"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>Tháng {m}</option>
            ))}
          </select>
        </div>
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-2">Năm</label>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full rounded-lg border-gray-200 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Monthly Menu Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">File Thực đơn tháng {selectedMonth}/{selectedYear}</h3>
            <p className="text-sm text-gray-500">File này sẽ được tải về khi phụ huynh nhấn nút "Tải về thực đơn tháng" trên trang chủ.</p>
          </div>
          {currentMenuUrl && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(currentMenuUrl, '_blank')}
              >
                <Eye className="w-4 h-4" /> Xem file
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleDeleteMonthlyMenu}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {currentMenuFileName && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4" />
            <span>File hiện tại: <strong>{currentMenuFileName}</strong></span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn file PDF hoặc hình ảnh mới (sẽ thay thế file cũ)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setMonthlyMenuFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer border border-gray-200 rounded-lg"
            />
          </div>
          <Button
            onClick={handleMonthlyMenuUpload}
            disabled={!monthlyMenuFile || uploading}
            className="gap-2"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Đang tải lên...' : 'Tải lên'}
          </Button>
        </div>
      </div>

      {/* Weekly Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4].map((week) => (
            <button
              key={week}
              onClick={() => setActiveWeek(week)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeWeek === week
                ? 'bg-brand-500 text-white shadow-md'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
            >
              Tuần {week}
            </button>
          ))}
        </div>

        {/* Menu Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th rowSpan={2} className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase border border-gray-200">Thứ</th>
                <th rowSpan={2} className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase border border-gray-200">Ngày</th>
                <th rowSpan={2} className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase border border-gray-200 w-24">Nghỉ lễ</th>

                {/* Buổi Sáng Group */}
                <th colSpan={2} className="px-4 py-2 text-center text-xs font-bold text-brand-600 uppercase border border-gray-200 bg-brand-50/50">Buổi Sáng</th>

                {/* Buổi Chiều Group */}
                <th colSpan={2} className="px-4 py-2 text-center text-xs font-bold text-brand-600 uppercase border border-gray-200 bg-brand-50/50">Buổi Chiều</th>
              </tr>
              <tr>
                {/* Morning Sub-headers */}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border border-gray-200 w-1/5">
                  Bữa phụ sáng <br /><span className="text-gray-400 text-[10px]">(08:45)</span>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border border-gray-200 w-1/5">
                  Bữa chính trưa <br /><span className="text-gray-400 text-[10px]">(10:20)</span>
                </th>

                {/* Afternoon Sub-headers */}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border border-gray-200 w-1/5">
                  Bữa phụ chiều 1 <br /><span className="text-gray-400 text-[10px]">(13:30)</span>
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 border border-gray-200 w-1/5">
                  Bữa phụ chiều 2 <br /><span className="text-gray-400 text-[10px]">(15:05)</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentWeekMenu.map((item) => (
                <tr key={item.dayOfWeek} className={`hover:bg-gray-50 ${item.isHoliday ? 'bg-red-50/50' : ''}`}>
                  <td className="px-4 py-4 font-bold text-gray-900 border border-gray-100">{item.day}</td>
                  <td className="px-4 py-4 text-sm text-gray-500 border border-gray-100">{item.date}</td>
                  <td className="px-4 py-4 border border-gray-100">
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.isHoliday || false}
                          onChange={(e) => {
                            const newMenu = menuData.map(menuItem => {
                              if (menuItem.week === activeWeek && menuItem.dayOfWeek === item.dayOfWeek) {
                                return { ...menuItem, isHoliday: e.target.checked };
                              }
                              return menuItem;
                            });
                            setMenuData(newMenu);
                          }}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-600">Nghỉ</span>
                      </label>
                      {item.isHoliday && (
                        <input
                          type="text"
                          value={item.holidayName || ''}
                          onChange={(e) => {
                            const newMenu = menuData.map(menuItem => {
                              if (menuItem.week === activeWeek && menuItem.dayOfWeek === item.dayOfWeek) {
                                return { ...menuItem, holidayName: e.target.value };
                              }
                              return menuItem;
                            });
                            setMenuData(newMenu);
                          }}
                          placeholder="Tên ngày lễ"
                          className="w-full px-2 py-1 text-xs border border-red-200 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  </td>

                  {/* Morning Inputs */}
                  <td className="px-4 py-4 border border-gray-100">
                    {item.isHoliday ? (
                      <span className="text-red-600 font-medium italic text-xs">Nghỉ lễ</span>
                    ) : (
                      <input
                        type="text"
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-600 focus:text-brand-600 font-medium transition-colors text-sm"
                        value={item.morningSnack || ''}
                        onChange={(e) => handleInputChange(item.dayOfWeek, 'morningSnack', e.target.value)}
                        placeholder="Nhập món..."
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 border border-gray-100">
                    {item.isHoliday ? (
                      <span className="text-red-600 font-medium italic text-xs">Nghỉ lễ</span>
                    ) : (
                      <input
                        type="text"
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-600 focus:text-brand-600 font-medium transition-colors text-sm"
                        value={item.mainMeal || ''}
                        onChange={(e) => handleInputChange(item.dayOfWeek, 'mainMeal', e.target.value)}
                        placeholder="Nhập món..."
                      />
                    )}
                  </td>

                  {/* Afternoon Inputs */}
                  <td className="px-4 py-4 border border-gray-100">
                    {item.isHoliday ? (
                      <span className="text-red-600 font-medium italic text-xs">Nghỉ lễ</span>
                    ) : (
                      <input
                        type="text"
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-600 focus:text-brand-600 font-medium transition-colors text-sm"
                        value={item.afternoonSnack1 || ''}
                        onChange={(e) => handleInputChange(item.dayOfWeek, 'afternoonSnack1', e.target.value)}
                        placeholder="Nhập món..."
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 border border-gray-100">
                    {item.isHoliday ? (
                      <span className="text-red-600 font-medium italic text-xs">Nghỉ lễ</span>
                    ) : (
                      <input
                        type="text"
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-600 focus:text-brand-600 font-medium transition-colors text-sm"
                        value={item.afternoonSnack2 || ''}
                        onChange={(e) => handleInputChange(item.dayOfWeek, 'afternoonSnack2', e.target.value)}
                        placeholder="Nhập món..."
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" /> Lưu thay đổi tuần {activeWeek}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ScheduleManager = () => {
  const [scheduleData, setScheduleData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSchedule = async () => {
      try {
        // Assuming 'db' is imported from your firebase config, e.g., import { db } from '@/lib/firebase';
        // And firebase functions are imported, e.g., import { collection, query, orderBy, getDocs, doc, writeBatch } from 'firebase/firestore';
        const q = query(collection(db, 'schedules'), orderBy('id', 'asc'));
        const querySnapshot = await getDocs(q);
        const schedules = querySnapshot.docs.map(doc => doc.data());
        if (schedules.length > 0) {
          setScheduleData(schedules);
        } else {
          // Initialize with default structure if empty
          setScheduleData([
            { id: 1, time: '07:00 - 08:00', activity: 'Đón trẻ, Thể dục sáng, Điểm danh' },
            { id: 2, time: '08:00 - 08:30', activity: 'Ăn sáng' },
            { id: 3, time: '08:30 - 10:00', activity: 'Hoạt động học tập & Vui chơi ngoài trời' },
            { id: 4, time: '10:00 - 11:00', activity: 'Hoạt động góc & Kỹ năng' },
            { id: 5, time: '11:00 - 12:00', activity: 'Ăn trưa' },
            { id: 6, time: '12:00 - 14:30', activity: 'Ngủ trưa' },
            { id: 7, time: '14:30 - 15:30', activity: 'Ăn xế & Vệ sinh cá nhân' },
            { id: 8, time: '15:30 - 16:30', activity: 'Học năng khiếu / Tiếng Anh' },
            { id: 9, time: '16:30 - 17:30', activity: 'Trả trẻ' },
          ]);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newSchedule = [...scheduleData];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setScheduleData(newSchedule);
  };

  const handleSave = async () => {
    try {
      const batch = writeBatch(db);
      scheduleData.forEach((item) => {
        const docRef = doc(db, 'schedules', item.id.toString());
        batch.set(docRef, item);
      });
      await batch.commit();
      alert('Đã lưu thời khóa biểu thành công!');
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert('Lỗi khi lưu thời khóa biểu.');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* File Upload Section Omitted for brevity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* ... existing file upload UI ... */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">File Chương trình học chi tiết</h3>
            <p className="text-sm text-gray-500">File này sẽ được tải về khi phụ huynh nhấn nút "Tải về chi tiết chương trình học".</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="w-4 h-4" /> Xem file hiện tại
          </Button>
        </div>
        {/* ... placeholder for file upload ... */}
      </div>

      {/* Daily Schedule Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900">Thời gian biểu một ngày</h3>
            <p className="text-sm text-gray-500">Chỉnh sửa các mốc thời gian và hoạt động tương ứng</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 border-gray-200 text-gray-600">
              <Plus className="w-4 h-4" /> Thêm mốc thời gian
            </Button>
            <Button size="sm" className="gap-2" onClick={handleSave}>
              <Save className="w-4 h-4" /> Lưu thay đổi
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase w-48">Thời gian</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Hoạt động</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scheduleData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-brand-600 font-bold focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm"
                      value={item.time}
                      onChange={(e) => handleInputChange(idx, 'time', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-700 font-medium transition-colors"
                      value={item.activity}
                      onChange={(e) => handleInputChange(idx, 'activity', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const NewsManager = () => {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [news, setNews] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentNews, setCurrentNews] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tag: 'Hoạt động',
    date: new Date().toLocaleDateString('vi-VN'),
    image: '',
    status: 'active'
  });

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNews(list);
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      try {
        const storageRef = ref(storage, `news/covers/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setFormData(prev => ({ ...prev, image: url }));
        showToast('Tải ảnh bìa thành công!', 'success');
      } catch (error) {
        console.error("Error uploading image:", error);
        showToast('Lỗi khi tải ảnh.', 'error');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleEditorImageUpload = async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `news/content/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error("Error uploading editor image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentNews) {
        await updateDoc(doc(db, 'news', currentNews.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        showToast('Cập nhật bài viết thành công!', 'success');
      } else {
        await addDoc(collection(db, 'news'), {
          ...formData,
          createdAt: serverTimestamp()
        });
        showToast('Đăng bài viết mới thành công!', 'success');
      }
      resetForm();
    } catch (error) {
      console.error("Error saving news:", error);
      showToast('Có lỗi xảy ra khi lưu bài viết.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: 'Xóa bài viết',
      message: 'Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.',
      confirmLabel: 'Xóa',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'news', id));
          showToast('Đã xóa bài viết thành công', 'success');
        } catch (error) {
          console.error("Error deleting news:", error);
          showToast('Có lỗi xảy ra khi xóa.', 'error');
        }
      }
    });
  };

  const startEdit = (item: any) => {
    setIsEditing(true);
    setIsFormVisible(true);
    setCurrentNews(item);
    setFormData({
      title: item.title,
      summary: item.summary || '',
      content: item.content,
      tag: item.tag,
      date: item.date,
      image: item.image || '',
      status: item.status || 'active'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setIsFormVisible(false);
    setCurrentNews(null);
    setFormData({
      title: '',
      summary: '',
      content: '',
      tag: 'Hoạt động',
      date: new Date().toLocaleDateString('vi-VN'),
      image: '',
      status: 'active'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <input type="text" placeholder="Tìm kiếm bài viết..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          <Eye className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <Button size="sm" className="gap-2" onClick={() => {
          resetForm();
          setIsFormVisible(true);
        }}>
          <Plus className="w-4 h-4" /> Thêm bài viết
        </Button>
      </div>

      {/* Form Section */}
      {isFormVisible && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">{isEditing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đăng</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                rows={2}
                placeholder="Tóm tắt nội dung bài viết (hiển thị trên trang chủ)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa</label>
              <div className="flex items-center gap-4">
                {formData.image && (
                  <img src={formData.image} alt="Cover" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                )}
                <div className="relative">
                  <input
                    type="file"
                    id="news-cover-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  <label htmlFor="news-cover-upload">
                    <Button type="button" variant="outline" size="sm" className="gap-2 pointer-events-none" as="span">
                      <Upload className="w-4 h-4" /> {uploading ? 'Đang tải...' : 'Tải ảnh bìa'}
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung chi tiết</label>
              <Editor
                value={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
                onImageUpload={handleEditorImageUpload}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên mục</label>
                <select
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Sự kiện">Sự kiện</option>
                  <option value="Cuộc thi">Cuộc thi</option>
                  <option value="Hội thảo">Hội thảo</option>
                  <option value="Thông báo">Thông báo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="active">Hiển thị</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsFormVisible(false)}>Hủy</Button>
              <Button type="submit">{isEditing ? 'Cập nhật' : 'Đăng bài viết'}</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {news.map((item) => (
          <div
            key={item.id}
            onClick={() => startEdit(item)}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center cursor-pointer hover:border-brand-300 hover:shadow-md transition-all"
          >
            <div className="w-full md:w-32 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-1">{item.summary}</p>
              <div className="flex gap-3 mt-2 text-xs text-gray-400">
                <span>{item.date}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{item.tag}</span>
                <span>•</span>
                <span className={`font-medium ${item.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                  {item.status === 'active' ? 'Hiển thị' : 'Ẩn'}
                </span>
              </div>
            </div>
            <div className="flex gap-2 self-end md:self-center">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(item);
                }}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Chưa có bài viết nào. Hãy thêm bài viết mới!
          </div>
        )}
      </div>
    </div>
  );
};

const SettingsManager = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      {/* SECTION 1: BRANDING & IDENTITY */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-500" />
          Nhận diện thương hiệu
        </h3>

        <div className="space-y-6">
          {/* Website Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề trang web (Page Title)</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              defaultValue="Trường Mẫu Giáo Vàng Anh - Ươm mầm hạnh phúc"
            />
            <p className="text-xs text-gray-400 mt-2">Hiển thị trên tab trình duyệt và kết quả tìm kiếm Google.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Logo Configuration */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Logo Website</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-sm">
                  VA
                </div>
                <div className="text-center w-full">
                  <Button size="sm" variant="outline" className="gap-2" fullWidth>
                    <Upload className="w-4 h-4" /> Tải lên Logo
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">Định dạng PNG, SVG (Trong suốt). Tối đa 2MB.</p>
                </div>
              </div>
            </div>

            {/* Favicon Configuration */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Favicon</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                  <div className="w-10 h-10 bg-brand-500 rounded-full"></div>
                </div>
                <div className="text-center w-full">
                  <Button size="sm" variant="outline" className="gap-2" fullWidth>
                    <Upload className="w-4 h-4" /> Tải lên Favicon
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">Icon hiển thị trên tab trình duyệt. (32x32px)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CONTACT INFO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-500" />
          Thông tin liên hệ
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên trường (Hiển thị trong Footer)</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200" defaultValue="Trường Mẫu Giáo Vàng Anh" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotline</label>
              <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200" defaultValue="090 123 4567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200" defaultValue="info@vanganh.edu.vn" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200" defaultValue="123 Đường Hạnh Phúc, Quận 1, TP.HCM" />
          </div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex justify-end pt-2">
        <Button className="gap-2 shadow-lg shadow-brand-500/20">
          <Save className="w-4 h-4" /> Lưu cấu hình hệ thống
        </Button>
      </div>
    </div>
  )
}

const StatCard: React.FC<{ title: string, value: string, change: string, icon: React.ElementType, color: string }> = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-lg opacity-90`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <p className="text-sm font-medium text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded-md">
      {change}
    </p>
  </div>
);