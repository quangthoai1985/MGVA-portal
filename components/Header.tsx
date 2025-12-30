import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Search, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { NavItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Defined logic types for href: 'home', 'about', 'resources', or '#section'
const NAV_ITEMS: NavItem[] = [
  { label: 'Trang chủ', href: 'home' },
  { label: 'Giới thiệu', href: 'about' },
  { label: 'Tài nguyên', href: 'resources' },
  { label: 'Tin hoạt động', href: '#activities' },
  { label: 'Thông báo', href: '#announcements' },
  { label: 'Liên hệ', href: '#footer' },
];

interface HeaderProps {
  onNavigate?: (path: string, hash?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // 1. Handle Sticky Background
      setIsScrolled(window.scrollY > 20);

      // 2. Handle Scroll Spy (Active State)
      // Only spy on sections present on the homepage or identified by ID
      const sections = NAV_ITEMS.filter(item => item.href.startsWith('#')).map(item => item.href.substring(1));
      
      let current = '';
      
      // Check standard pages first based on URL/State if we were using a router, 
      // but here we check scroll position for sections
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If top of section is within the viewport (with some offset)
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = '#' + section;
          }
        }
      }

      // If we are at the top, default to home
      if (window.scrollY < 100) {
        current = 'home';
      }

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setActiveSection(href); // Immediate feedback
    
    if (onNavigate) {
      if (href.startsWith('#')) {
        onNavigate('home', href);
      } else {
        onNavigate(href);
      }
    }
    setIsMobileMenuOpen(false);
  };

  // Animation Variants for Mobile Menu
  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30, staggerChildren: 0.1, delayChildren: 0.2 }
    },
    closed: {
      x: "100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: 20 }
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="home" 
              onClick={(e) => handleNavClick(e, 'home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform shadow-brand-500/20 shadow-lg">
                VA
              </div>
              <span className={`text-2xl font-display font-bold transition-colors ${isScrolled ? 'text-gray-800' : 'text-gray-900'}`}>
                Vàng Anh
              </span>
            </a>

            {/* Desktop Nav - Hidden on mobile (lg:flex shows it on large screens) */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <a 
                    key={item.label} 
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`text-sm font-bold uppercase tracking-wide transition-all relative py-2
                      ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-500'}
                    `}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-full"
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Button variant="outline" size="sm" className="hidden xl:flex gap-2">
                <Search className="w-4 h-4" />
                Tra cứu
              </Button>
              <Button variant="primary" size="sm" className="shadow-brand-200 shadow-lg">
                Đăng ký nhập học
              </Button>
            </div>

            {/* Mobile Toggle Button - Hidden on desktop (lg:hidden hides it on large screens) */}
            <button 
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer - Rendered via Portal */}
      {createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-[9999] backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Drawer Content */}
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                className="fixed inset-y-0 right-0 w-[85vw] max-w-[320px] bg-white z-[10000] shadow-2xl flex flex-col p-6"
              >
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">VA</div>
                     <span className="text-xl font-display font-bold text-gray-900">Menu</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-gray-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeSection === item.href;
                    return (
                      <motion.a 
                        key={item.label} 
                        href={item.href}
                        variants={itemVariants}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`text-lg font-medium py-3 px-4 rounded-xl flex items-center justify-between transition-colors
                          ${isActive 
                            ? 'bg-brand-50 text-brand-700 font-bold' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'
                          }
                        `}
                      >
                        {item.label}
                        {isActive && <ChevronRight className="w-5 h-5" />}
                      </motion.a>
                    );
                  })}
                </div>

                <div className="mt-auto flex flex-col gap-4 pt-6 border-t border-gray-100">
                   <motion.div variants={itemVariants}>
                      <Button variant="outline" fullWidth className="justify-center h-12">
                         Tra cứu thông tin
                      </Button>
                   </motion.div>
                   <motion.div variants={itemVariants}>
                      <Button variant="primary" fullWidth className="justify-center h-12 shadow-lg shadow-brand-500/20">
                         Đăng ký nhập học
                      </Button>
                   </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};