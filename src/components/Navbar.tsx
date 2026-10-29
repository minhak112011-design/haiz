import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { SITE_CONFIG, ViewRoute } from '../config/siteConfig';

interface NavbarProps {
  activeView: ViewRoute;
  onSelectView: (view: ViewRoute) => void;
}

export const NAV_ITEMS: { id: ViewRoute; num: string; label: string }[] = [
  { id: 'trang-chu', num: '01', label: 'Trang chủ' },
  { id: 'gioi-thieu', num: '02', label: 'Giới thiệu & Kỹ năng' },
  { id: 'dich-vu', num: '03', label: 'Dịch vụ' },
  { id: 'ban-mau', num: '04', label: 'Bản mẫu' },
  { id: 'san-pham-so', num: '05', label: 'Sản phẩm số' },
  { id: 'lien-he', num: '06', label: 'Quy trình & Liên hệ' },
];

export const Navbar: React.FC<NavbarProps> = ({ activeView, onSelectView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (view: ViewRoute) => {
    onSelectView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#111110]/95 border-b border-[#F3F1EC]/10">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Clean Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('trang-chu')}
          className="font-display text-lg font-bold tracking-tight text-[#F3F1EC] hover:text-[#E04F2E] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#E04F2E]"
        >
          {SITE_CONFIG.creator.brandWordmark}
        </button>

        {/* Zone 2: Separate View Tabs (Clicking switches view immediately) */}
        <nav
          aria-label="Chọn trang hiển thị"
          className="hidden lg:flex items-center gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#F3F1EC] text-[#111110] font-semibold'
                    : 'text-[#8E8B82] hover:text-[#F3F1EC] hover:bg-[#1A1A18]'
                }`}
              >
                <span className="font-mono-tabular opacity-60 mr-1.5">{item.num}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Facebook Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={SITE_CONFIG.contact.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#F3F1EC] bg-[#E04F2E] hover:bg-[#EB5B3A] rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <span>Đặt làm web</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 h-10 rounded-lg border border-[#F3F1EC]/15 text-xs font-medium text-[#F3F1EC] hover:border-[#E04F2E]"
          >
            <span>Mục lục</span>
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile View Switcher Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menu di động"
          className="lg:hidden bg-[#161614] border-b border-[#F3F1EC]/15 px-4 pt-2 pb-4 space-y-1"
        >
          <div className="grid grid-cols-2 gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-lg text-left text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F3F1EC] text-[#111110] font-semibold'
                      : 'bg-[#111110] text-[#8E8B82] hover:text-[#F3F1EC]'
                  }`}
                >
                  <span className="font-mono-tabular opacity-60">{item.num}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="pt-2">
            <a
              href={SITE_CONFIG.contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#E04F2E] text-[#F3F1EC] font-semibold text-xs"
            >
              <span>{SITE_CONFIG.contact.facebookCtaText}</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
