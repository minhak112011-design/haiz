/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Eye,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { Navbar, NAV_ITEMS } from './components/Navbar';
import {
  SITE_CONFIG,
  ConceptProject,
  ServiceItem,
  ViewRoute,
} from './config/siteConfig';
import { ConceptPreviewModal } from './components/ConceptPreviewModal';
import { BriefBuilderSection } from './components/BriefBuilderSection';

const LazyHeroAtelier3D = lazy(() =>
  import('./components/HeroAtelier3D').then((m) => ({ default: m.HeroAtelier3D }))
);

const LazyTactileSkillsSection = lazy(() =>
  import('./components/TactileSkillsSection').then((m) => ({
    default: m.TactileSkillsSection,
  }))
);

const VALID_VIEWS: ViewRoute[] = [
  'trang-chu',
  'gioi-thieu',
  'dich-vu',
  'ban-mau',
  'san-pham-so',
  'lien-he',
];

function parseHashToView(hash: string): ViewRoute {
  const cleaned = hash.replace(/^#\/?/, '').trim() as ViewRoute;
  return VALID_VIEWS.includes(cleaned) ? cleaned : 'trang-chu';
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewRoute>(() =>
    typeof window !== 'undefined' ? parseHashToView(window.location.hash) : 'trang-chu'
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    SITE_CONFIG.services[0].id
  );
  const [selectedConceptId, setSelectedConceptId] = useState<string>(
    SITE_CONFIG.concepts[0].id
  );
  const [activeModalConcept, setActiveModalConcept] = useState<ConceptProject | null>(
    null
  );
  const [selectedToolId, setSelectedToolId] = useState<string>(
    SITE_CONFIG.digitalTools[0].id
  );
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setActiveView(parseHashToView(window.location.hash));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const selectView = (view: ViewRoute) => {
    setActiveView(view);
    const nextHash = `#/${view}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentNavIndex = NAV_ITEMS.findIndex((item) => item.id === activeView);
  const prevNav = currentNavIndex > 0 ? NAV_ITEMS[currentNavIndex - 1] : null;
  const nextNav =
    currentNavIndex < NAV_ITEMS.length - 1 ? NAV_ITEMS[currentNavIndex + 1] : null;

  const activeService: ServiceItem =
    SITE_CONFIG.services.find((s) => s.id === selectedServiceId) ||
    SITE_CONFIG.services[0];

  const activeConcept: ConceptProject =
    SITE_CONFIG.concepts.find((c) => c.id === selectedConceptId) ||
    SITE_CONFIG.concepts[0];

  const activeTool =
    SITE_CONFIG.digitalTools.find((t) => t.id === selectedToolId) ||
    SITE_CONFIG.digitalTools[0];

  const openMatchingConceptForService = (service: ServiceItem) => {
    const mapType: Record<
      ServiceItem['sampleLayoutType'],
      ConceptProject['previewType']
    > = {
      gift: 'love-letter',
      profile: 'personal-corner',
      landing: 'launch-page',
    };
    const targetPreview = mapType[service.sampleLayoutType];
    const matched = SITE_CONFIG.concepts.find(
      (c) => c.previewType === targetPreview
    );
    if (matched) {
      setActiveModalConcept(matched);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0C] text-[#F3F1EC] flex flex-col justify-between selection:bg-[#E04F2E] selection:text-[#F3F1EC]">
      <Navbar activeView={activeView} onSelectView={selectView} />

      <main className="flex-1 flex flex-col justify-center py-6 sm:py-10">
        <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* =========================================================
              01 · TRANG CHỦ (STANDALONE VIEW)
             ========================================================= */}
          {activeView === 'trang-chu' && (
            <section aria-labelledby="view-home-heading" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left Column */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2.5 text-xs font-mono-tabular uppercase tracking-widest text-[#9E9A90]">
                    <span className="w-2 h-2 rounded-full bg-[#E04F2E]" />
                    <span>01 / 06 · {SITE_CONFIG.creator.displayName}</span>
                    <span>·</span>
                    <span>{SITE_CONFIG.creator.role}</span>
                  </div>

                  <h1
                    id="view-home-heading"
                    className="font-display font-bold text-[#F3F1EC] tracking-tight"
                    style={{
                      fontSize: 'clamp(2.1rem, 4vw + 0.6rem, 3.75rem)',
                      lineHeight: 1.06,
                    }}
                  >
                    {SITE_CONFIG.creator.heroHeadline}
                  </h1>

                  <p className="text-base sm:text-lg text-[#C4C0B7] leading-relaxed max-w-[54ch]">
                    {SITE_CONFIG.creator.heroLead}
                  </p>

                  {/* Primary & Secondary Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={SITE_CONFIG.contact.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-[#E04F2E] hover:bg-[#EB5E3E] text-[#F3F1EC] text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>{SITE_CONFIG.contact.facebookCtaText}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => selectView('dich-vu')}
                      className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-[#141413] hover:bg-[#1C1C1A] text-[#F3F1EC] border border-[#F3F1EC]/12 text-sm font-medium transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Xem 3 gói dịch vụ</span>
                      <ArrowRight className="w-4 h-4 text-[#E04F2E]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => selectView('ban-mau')}
                      className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-[#141413] text-[#9E9A90] hover:text-[#F3F1EC] text-sm font-medium transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Thử bản mẫu 3D & Web</span>
                    </button>
                  </div>

                  {/* Minimal Spec Strip */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#F3F1EC]/10">
                    <div>
                      <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E9A90]">
                        Hạng mục chính
                      </p>
                      <p className="text-sm font-semibold text-[#F3F1EC] mt-0.5">
                        Kỷ niệm · Cá nhân · Riêng
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E9A90]">
                        Hiển thị
                      </p>
                      <p className="text-sm font-semibold text-[#F3F1EC] mt-0.5">
                        Mượt trên Điện thoại & PC
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9E9A90]">
                        Kênh làm việc
                      </p>
                      <p className="text-sm font-semibold text-[#F3F1EC] mt-0.5">
                        Trao đổi trực tiếp 1:1
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Interactive 3D Stage */}
                <div className="lg:col-span-6">
                  <Suspense
                    fallback={
                      <div className="w-full h-[400px] sm:h-[460px] lg:h-[510px] rounded-2xl bg-[#141413] border border-[#F3F1EC]/10 flex items-center justify-center text-xs font-mono-tabular text-[#9E9A90]">
                        Đang khởi tạo mô hình 3D...
                      </div>
                    }
                  >
                    <LazyHeroAtelier3D />
                  </Suspense>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              02 · GIỚI THIỆU & KỸ NĂNG 3D (STANDALONE VIEW)
             ========================================================= */}
          {activeView === 'gioi-thieu' && (
            <section aria-labelledby="view-about-heading" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* Left Column: Concise Story & 3 Principles */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-3">
                    <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#E04F2E]">
                      02 / 06 · GIỚI THIỆU & KỸ NĂNG
                    </div>
                    <h1
                      id="view-about-heading"
                      className="font-display text-2xl sm:text-3xl font-bold text-[#F3F1EC] tracking-tight leading-tight"
                    >
                      Một người trẻ thích biến những dòng ghi chú thành trang web chạy thật.
                    </h1>
                  </div>

                  <div className="space-y-3 text-sm sm:text-base text-[#C4C0B7] leading-relaxed">
                    {SITE_CONFIG.creator.aboutStory.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-[#F3F1EC]/10">
                    <div className="text-xs font-mono-tabular uppercase tracking-wider text-[#9E9A90]">
                      Nguyên tắc làm việc
                    </div>
                    {SITE_CONFIG.creator.principles.map((item, idx) => (
                      <div
                        key={item.title}
                        className="rounded-xl bg-[#141413] border border-[#F3F1EC]/10 p-3.5 flex items-start gap-3"
                      >
                        <span className="text-xs font-mono-tabular text-[#E04F2E] font-semibold mt-0.5">
                          0{idx + 1}
                        </span>
                        <div>
                          <h2 className="text-sm font-semibold text-[#F3F1EC]">
                            {item.title}
                          </h2>
                          <p className="text-xs sm:text-sm text-[#9E9A90] mt-0.5">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Interactive 3D Skills Stage */}
                <div className="lg:col-span-7">
                  <Suspense
                    fallback={
                      <div className="w-full h-[380px] rounded-2xl bg-[#141413] border border-[#F3F1EC]/10 flex items-center justify-center text-xs font-mono-tabular text-[#9E9A90]">
                        Đang tải mô hình kỹ năng 3D...
                      </div>
                    }
                  >
                    <LazyTactileSkillsSection />
                  </Suspense>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              03 · DỊCH VỤ THIẾT KẾ WEB (STANDALONE VIEW)
             ========================================================= */}
          {activeView === 'dich-vu' && (
            <section aria-labelledby="view-services-heading" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F3F1EC]/10 pb-5">
                <div>
                  <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#E04F2E] mb-2">
                    03 / 06 · DỊCH VỤ THIẾT KẾ WEB
                  </div>
                  <h1
                    id="view-services-heading"
                    className="font-display text-2xl sm:text-3xl font-bold text-[#F3F1EC] tracking-tight"
                  >
                    3 nhóm website mình nhận thực hiện
                  </h1>
                </div>

                <a
                  href={SITE_CONFIG.contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E04F2E] hover:bg-[#EB5E3E] text-[#F3F1EC] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
                >
                  <span>{SITE_CONFIG.contact.facebookCtaText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* 3 Service Selector Tabs */}
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                role="tablist"
                aria-label="Chọn gói dịch vụ"
              >
                {SITE_CONFIG.services.map((service) => {
                  const isSelected = service.id === activeService.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`text-left p-4 rounded-xl border transition-colors ${
                        isSelected
                          ? 'bg-[#171715] border-[#E04F2E] text-[#F3F1EC]'
                          : 'bg-[#121211] border-[#F3F1EC]/10 text-[#9E9A90] hover:text-[#F3F1EC] hover:border-[#F3F1EC]/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono-tabular mb-1">
                        <span className={isSelected ? 'text-[#E04F2E]' : 'text-[#9E9A90]'}>
                          GÓI {service.index}
                        </span>
                        {isSelected && (
                          <span className="text-[11px] text-[#E04F2E]">Đang chọn</span>
                        )}
                      </div>
                      <div className="font-display text-base font-bold text-[#F3F1EC]">
                        {service.title}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Service Detail Panel */}
              <div className="rounded-2xl bg-[#141413] border border-[#F3F1EC]/12 p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 space-y-5">
                  <div className="space-y-2">
                    <span className="text-xs font-mono-tabular text-[#E04F2E]">
                      HẠNG MỤC {activeService.index}
                    </span>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F3F1EC]">
                      {activeService.title}
                    </h2>
                    <p className="text-sm sm:text-base text-[#C4C0B7] leading-relaxed">
                      {activeService.tagline}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0D0D0C] border border-[#F3F1EC]/10 p-4 space-y-1.5">
                    <div className="text-xs font-mono-tabular uppercase tracking-wider text-[#9E9A90]">
                      Phù hợp cho
                    </div>
                    <p className="text-sm text-[#F3F1EC]">{activeService.suitableFor}</p>
                  </div>

                  <div className="rounded-xl bg-[#0D0D0C] border border-[#F3F1EC]/10 p-4 space-y-1">
                    <div className="text-xs font-mono-tabular uppercase tracking-wider text-[#9E9A90]">
                      Chi phí & Thời gian
                    </div>
                    <p className="text-sm font-medium text-[#E04F2E]">
                      {activeService.pricingNote}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => openMatchingConceptForService(activeService)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F3F1EC] hover:bg-white text-[#0D0D0C] text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Mở bản mẫu tương ứng</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectView('lien-he')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0D0D0C] hover:bg-[#1B1B19] text-[#F3F1EC] border border-[#F3F1EC]/15 text-xs sm:text-sm font-medium transition-colors"
                    >
                      <span>Soạn tin nhắn đặt gói này</span>
                      <ArrowRight className="w-4 h-4 text-[#E04F2E]" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#0D0D0C] border border-[#F3F1EC]/10 p-4 space-y-3">
                    <div className="text-xs font-mono-tabular uppercase tracking-wider text-[#E04F2E]">
                      Bạn nhận được gì
                    </div>
                    <ul className="space-y-2.5">
                      {activeService.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs sm:text-sm text-[#C4C0B7]"
                        >
                          <Check className="w-4 h-4 text-[#E04F2E] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-[#0D0D0C] border border-[#F3F1EC]/10 p-4 space-y-3">
                    <div className="text-xs font-mono-tabular uppercase tracking-wider text-[#9E9A90]">
                      Bạn cần chuẩn bị
                    </div>
                    <ul className="space-y-2.5">
                      {activeService.clientNeedsToProvide.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs sm:text-sm text-[#C4C0B7]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#9E9A90] shrink-0 mt-2" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              04 · BẢN MẪU TƯƠNG TÁC (STANDALONE VIEW)
             ========================================================= */}
          {activeView === 'ban-mau' && (
            <section aria-labelledby="view-concepts-heading" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F3F1EC]/10 pb-5">
                <div>
                  <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#E04F2E] mb-2">
                    04 / 06 · BẢN MẪU (CONCEPT DEMO)
                  </div>
                  <h1
                    id="view-concepts-heading"
                    className="font-display text-2xl sm:text-3xl font-bold text-[#F3F1EC] tracking-tight"
                  >
                    Bản dựng mẫu để bạn bấm thử trực tiếp
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalConcept(activeConcept)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E04F2E] hover:bg-[#EB5E3E] text-[#F3F1EC] text-xs sm:text-sm font-semibold transition-colors self-start sm:self-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Chạy thử {activeConcept.title}</span>
                </button>
              </div>

              {/* 3 Concept Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {SITE_CONFIG.concepts.map((concept) => {
                  const isSelected = concept.id === activeConcept.id;
                  return (
                    <button
                      key={concept.id}
                      type="button"
                      onClick={() => setSelectedConceptId(concept.id)}
                      className={`text-left p-4 rounded-xl border transition-colors ${
                        isSelected
                          ? 'bg-[#171715] border-[#E04F2E] text-[#F3F1EC]'
                          : 'bg-[#121211] border-[#F3F1EC]/10 text-[#9E9A90] hover:text-[#F3F1EC]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono-tabular mb-1">
                        <span className={isSelected ? 'text-[#E04F2E]' : 'text-[#9E9A90]'}>
                          {concept.code}
                        </span>
                        <span className="text-[11px]">{concept.label}</span>
                      </div>
                      <div className="font-display text-base font-bold text-[#F3F1EC]">
                        {concept.title}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Concept Detail + Quick Launch */}
              <div className="rounded-2xl bg-[#141413] border border-[#F3F1EC]/12 p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-mono-tabular text-[#E04F2E]">
                    <span>{activeConcept.code}</span>
                    <span>·</span>
                    <span>{activeConcept.category}</span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F3F1EC]">
                    {activeConcept.title}
                  </h2>

                  <p className="text-sm sm:text-base text-[#C4C0B7] leading-relaxed">
                    {activeConcept.summary}
                  </p>

                  <div className="space-y-2 pt-1">
                    {activeConcept.highlights.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-2.5 text-xs sm:text-sm text-[#F3F1EC]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E04F2E] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModalConcept(activeConcept)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E04F2E] hover:bg-[#EB5E3E] text-[#F3F1EC] text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Mở cửa sổ tương tác trực tiếp</span>
                    </button>

                    <a
                      href={SITE_CONFIG.contact.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0D0D0C] hover:bg-[#1B1B19] text-[#F3F1EC] border border-[#F3F1EC]/15 text-xs sm:text-sm font-medium transition-colors"
                    >
                      <span>Đặt làm giao diện tương tự</span>
                      <ArrowUpRight className="w-4 h-4 text-[#E04F2E]" />
                    </a>
                  </div>
                </div>

                {/* Right: Visual Interactive Card Trigger */}
                <div className="lg:col-span-6">
                  <div className="rounded-xl bg-[#0D0D0C] border border-[#F3F1EC]/12 p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F3F1EC]/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E04F2E]" />
                        <span className="text-xs font-mono-tabular text-[#F3F1EC]">
                          {activeConcept.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono-tabular text-[#9E9A90]">
                        {activeConcept.label}
                      </span>
                    </div>

                    <div className="rounded-lg bg-[#141413] border border-[#F3F1EC]/10 p-5 space-y-3">
                      {activeConcept.previewType === 'love-letter' && (
                        <>
                          <div className="text-xs font-mono-tabular text-[#E04F2E]">
                            GIAO DIỆN THƯ TAY & ĐẾM NGÀY
                          </div>
                          <p className="font-display text-lg font-bold text-[#F3F1EC]">
                            Mở phong bì thư, lật từng trang kỷ niệm và xem cột mốc ngày quen nhau.
                          </p>
                        </>
                      )}
                      {activeConcept.previewType === 'personal-corner' && (
                        <>
                          <div className="text-xs font-mono-tabular text-[#E04F2E]">
                            HỒ SƠ CÁ NHÂN TỐI GIẢN
                          </div>
                          <p className="font-display text-lg font-bold text-[#F3F1EC]">
                            Chuyển đổi tab Kỹ năng / Dự án mượt mà và sao chép nhanh liên hệ.
                          </p>
                        </>
                      )}
                      {activeConcept.previewType === 'launch-page' && (
                        <>
                          <div className="text-xs font-mono-tabular text-[#E04F2E]">
                            LANDING PAGE & TƯƠNG TÁC TRỰC QUAN
                          </div>
                          <p className="font-display text-lg font-bold text-[#F3F1EC]">
                            Trải nghiệm bố cục giới thiệu sản phẩm/dự án và mô phỏng dữ liệu trực tiếp.
                          </p>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveModalConcept(activeConcept)}
                        className="w-full py-2.5 rounded-lg bg-[#1F1E1C] hover:bg-[#E04F2E] text-[#F3F1EC] text-xs font-mono-tabular uppercase tracking-wider transition-colors"
                      >
                        Bấm để mở bản chạy thử →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              05 · SẢN PHẨM SỐ / CÔNG CỤ (STANDALONE VIEW)
             ========================================================= */}
          {activeView === 'san-pham-so' && (
            <section aria-labelledby="view-tools-heading" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F3F1EC]/10 pb-5">
                <div>
                  <div className="text-xs font-mono-tabular uppercase tracking-widest text-[#E04F2E] mb-2">
                    05 / 06 · SẢN PHẨM SỐ & TIỆN ÍCH
                  </div>
                  <h1
                    id="view-tools-heading"
                    className="font-display text-2xl sm:text-3xl font-bold text-[#F3F1EC] tracking-tight"
                  >
                    Tool Discord & Hook MB
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfigGuide((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#141413] hover:bg-[#1C1C1A] border border-[#F3F1EC]/15 text-xs font-mono-tabular text-[#C4C0B7] transition-colors self-start sm:self-auto"
                >
                  <FileCode className="w-3.5 h-3.5 text-[#E04F2E]" />
                  <span>
                    {showConfigGuide ? 'Ẩn hướng dẫn sửa file' : 'Cách cập nhật thông số'}
                  </span>
                </button>
              </div>

              {showConfigGuide && (
                <div className="rounded-xl bg-[#141413] border border-[#E04F2E]/40 p-4 text-xs sm:text-sm text-[#C4C0B7] flex items-start gap-3">
                  <Code2 className="w-4 h-4 text-[#E04F2E] shrink-0 mt-0.5" />
                  <div>
                    Nhật Minh có thể cập nhật trực tiếp tính năng, nền tảng hỗ trợ và hình thức bàn giao của{' '}
                    <span className="text-[#F3F1EC] font-medium">Tool Discord</span> và{' '}
                    <span className="text-[#F3F1EC] font-medium">Hook MB</span> tại file{' '}
                    <code className="text-[#E04F2E] font-mono-tabular">
                      src/config/siteConfig.ts
                    </code>
                    .
                  </div>
                </div>
              )}

              {/* Tool Selector Tabs */}
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {SITE_CONFIG.digitalTools.map((tool) => {
                  const isSelected = tool.id === activeTool.id;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => setSelectedToolId(tool.id)}
                      className={`p-3.5 rounded-xl border text-left transition-colors ${
                        isSelected
                          ? 'bg-[#171715] border-[#E04F2E] text-[#F3F1EC]'
                          : 'bg-[#121211] border-[#F3F1EC]/10 text-[#9E9A90] hover:text-[#F3F1EC]'
                      }`}
                    >
                      <div className="text-xs font-mono-tabular text-[#E04F2E]">
                        SẢN PHẨM SỐ
                      </div>
                      <div className="font-display text-base font-bold mt-0.5">
                        {tool.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Tool Specification Sheet */}
              <div className="rounded-2xl bg-[#141413] border border-[#F3F1EC]/12 p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <h2 className="font-display text-2xl font-bold text-[#F3F1EC]">
                    {activeTool.name}
                  </h2>
                  <p className="text-sm sm:text-base text-[#C4C0B7] leading-relaxed">
                    {activeTool.summary}
                  </p>
                  <p className="text-xs text-[#9E9A90] leading-relaxed border-l-2 border-[#E04F2E] pl-3">
                    {activeTool.note}
                  </p>
                  <div className="pt-2">
                    <a
                      href={SITE_CONFIG.contact.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E04F2E] hover:bg-[#EB5E3E] text-[#F3F1EC] text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <span>Nhắn Facebook hỏi chi tiết {activeTool.name}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="rounded-xl bg-[#0D0D0C] border border-[#F3F1EC]/10 divide-y divide-[#F3F1EC]/10">
                    {activeTool.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                      >
                        <span className="text-xs font-mono-tabular text-[#9E9A90]">
                          {spec.label}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-[#F3F1EC]">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =========================================================
              06 · QUY TRÌNH & LIÊN HỆ (STANDALONE VIEW)
             ========================================================= */}
          {activeView === 'lien-he' && <BriefBuilderSection />}

          {/* =========================================================
              STEP-BY-STEP DECK PAGER (PREV / NEXT SECTION)
             ========================================================= */}
          <div className="mt-10 pt-5 border-t border-[#F3F1EC]/10 flex items-center justify-between gap-4">
            {prevNav ? (
              <button
                type="button"
                onClick={() => selectView(prevNav.id)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141413] hover:bg-[#1C1C1A] border border-[#F3F1EC]/10 text-xs font-medium text-[#C4C0B7] hover:text-[#F3F1EC] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#E04F2E]" />
                <span>
                  {prevNav.num} · {prevNav.label}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextNav ? (
              <button
                type="button"
                onClick={() => selectView(nextNav.id)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141413] hover:bg-[#1C1C1A] border border-[#F3F1EC]/10 text-xs font-medium text-[#F3F1EC] transition-colors"
              >
                <span>
                  Tiếp theo: {nextNav.num} · {nextNav.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E04F2E]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => selectView('trang-chu')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141413] hover:bg-[#1C1C1A] border border-[#F3F1EC]/10 text-xs font-medium text-[#C4C0B7] hover:text-[#F3F1EC] transition-colors"
              >
                <span>Quay về 01 · Trang chủ</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* =========================================================
          MINIMAL FOOTER WITH MANDATORY FACEBOOK CTA
         ========================================================= */}
      <footer className="border-t border-[#F3F1EC]/10 bg-[#0D0D0C] py-4">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9E9A90]">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-[#F3F1EC]">NHẬT MINH</span>
            <span>·</span>
            <span>Thiết kế Website & Sản phẩm số</span>
          </div>

          <a
            href={SITE_CONFIG.contact.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#F3F1EC] hover:text-[#E04F2E] font-medium transition-colors"
          >
            <span>{SITE_CONFIG.contact.facebookCtaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#E04F2E]" />
          </a>
        </div>
      </footer>

      {/* Interactive Concept Modal */}
      <ConceptPreviewModal
        project={activeModalConcept}
        onClose={() => setActiveModalConcept(null)}
      />
    </div>
  );
}
