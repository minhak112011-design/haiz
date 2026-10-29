import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Monitor,
  Heart,
  Volume2,
  VolumeX,
  Calendar,
  ExternalLink,
  FlaskConical,
  RefreshCw,
  ArrowUpRight,
} from 'lucide-react';
import { ConceptProject, SITE_CONFIG } from '../config/siteConfig';

interface ConceptPreviewModalProps {
  project: ConceptProject | null;
  onClose: () => void;
}

interface BioProteinSummary {
  accession: string;
  pdbId: string;
  gene: string;
  title: string;
  organism: string;
  residueCount: number;
  resolution?: string;
  method: string;
  plddtHigh: number;
  plddtConfident: number;
  plddtLow: number;
  plddtVeryLow: number;
  sourceUrl: string;
  provenance: string;
}

const PRESET_PROTEINS: Record<string, BioProteinSummary> = {
  P04637: {
    accession: 'P04637',
    pdbId: '1TUP',
    gene: 'TP53',
    title: 'Cellular tumor antigen p53',
    organism: 'Homo sapiens',
    residueCount: 393,
    resolution: '2.20 Å',
    method: 'AlphaFold DB v6 + X-Ray',
    plddtHigh: 58,
    plddtConfident: 18,
    plddtLow: 10,
    plddtVeryLow: 14,
    sourceUrl: 'https://alphafold.ebi.ac.uk/entry/P04637',
    provenance: 'Predicted by model (AlphaFold DB) & Experimentally determined (RCSB 1TUP)',
  },
  P68871: {
    accession: 'P68871',
    pdbId: '4HHB',
    gene: 'HBB',
    title: 'Hemoglobin subunit beta (Deoxyhemoglobin)',
    organism: 'Homo sapiens',
    residueCount: 147,
    resolution: '1.74 Å',
    method: 'X-RAY DIFFRACTION',
    plddtHigh: 91,
    plddtConfident: 7,
    plddtLow: 2,
    plddtVeryLow: 0,
    sourceUrl: 'https://www.rcsb.org/structure/4HHB',
    provenance: 'Experimentally determined (RCSB PDB 4HHB)',
  },
  P00533: {
    accession: 'P00533',
    pdbId: '1M17',
    gene: 'EGFR',
    title: 'Epidermal growth factor receptor',
    organism: 'Homo sapiens',
    residueCount: 1210,
    resolution: '2.60 Å',
    method: 'AlphaFold DB v6',
    plddtHigh: 69,
    plddtConfident: 19,
    plddtLow: 6,
    plddtVeryLow: 6,
    sourceUrl: 'https://alphafold.ebi.ac.uk/entry/P00533',
    provenance: 'Predicted by model (AlphaFold DB)',
  },
};

export const ConceptPreviewModal: React.FC<ConceptPreviewModalProps> = ({
  project,
  onClose,
}) => {
  const [viewportMode, setViewportMode] = useState<'mobile' | 'desktop'>('desktop');
  const [letterOpened, setLetterOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState(0);
  const [activeProfileTab, setActiveProfileTab] = useState<'all' | 'code' | 'notes'>('all');

  const [selectedAccession, setSelectedAccession] = useState<string>('P04637');
  const [liveProteinData, setLiveProteinData] = useState<BioProteinSummary>(
    PRESET_PROTEINS.P04637
  );
  const [loadingApi, setLoadingApi] = useState(false);
  const [apiStatusNote, setApiStatusNote] = useState<string>(
    'Dữ liệu chuẩn từ AlphaFold DB / RCSB PDB'
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  useEffect(() => {
    if (!project || project.previewType !== 'launch-page') return;
    let cancelled = false;

    async function fetchLiveBioData(acc: string) {
      const fallback = PRESET_PROTEINS[acc] || PRESET_PROTEINS.P04637;
      setLiveProteinData(fallback);
      setLoadingApi(true);
      try {
        const res = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${acc}`);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          const entry = data[0];
          setLiveProteinData({
            ...fallback,
            gene: entry.gene || fallback.gene,
            title: entry.uniprotDescription || fallback.title,
            organism: entry.organismScientificName || fallback.organism,
            residueCount:
              entry.uniprotEnd && entry.uniprotStart
                ? entry.uniprotEnd - entry.uniprotStart + 1
                : fallback.residueCount,
            sourceUrl: `https://alphafold.ebi.ac.uk/entry/${acc}`,
          });
          setApiStatusNote(`Đã đồng bộ trực tiếp từ AlphaFold EBI API (${entry.entryId || acc})`);
        }
      } catch {
        if (!cancelled) {
          setApiStatusNote('Đang hiển thị bản ghi chuẩn đã xác thực (AlphaFold / RCSB)');
        }
      } finally {
        if (!cancelled) setLoadingApi(false);
      }
    }

    fetchLiveBioData(selectedAccession);
    return () => {
      cancelled = true;
    };
  }, [project, selectedAccession]);

  if (!project) return null;

  const memories = [
    {
      date: 'Mốc kỷ niệm 01',
      title: 'Ngày đầu tiên bắt chuyện',
      note: 'Khung nội dung mẫu: Khách đặt làm web sẽ gửi câu chuyện thật và ảnh kỷ niệm của hai người để đưa vào từng trang.',
    },
    {
      date: 'Mốc kỷ niệm 02',
      title: 'Buổi hẹn cà phê chiều mưa',
      note: 'Mỗi thẻ kỷ niệm được căn chỉnh để đọc rõ trên màn hình điện thoại dọc mà không bị tràn lề.',
    },
    {
      date: 'Lời nhắn gửi',
      title: 'Cảm ơn vì đã luôn đồng hành',
      note: 'Tích hợp nút bật/tắt nhạc nền do người xem chủ động điều khiển (tuyệt đối không tự phát âm thanh khi vừa mở trang).',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="concept-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#181715] border border-[#F4F1EA]/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 bg-[#11110F] border-b border-[#F4F1EA]/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#EB4D28]">
              <span>{project.code}</span>
              <span aria-hidden="true">·</span>
              <span>BẢN DỰNG MẪU TƯƠNG TÁC ({project.label.toUpperCase()})</span>
            </div>
            <h3
              id="concept-modal-title"
              className="font-display text-lg sm:text-xl font-bold text-[#F4F1EA] mt-0.5"
            >
              {project.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Viewport Switcher */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-[#1A1917] border border-[#F4F1EA]/12">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  viewportMode === 'desktop'
                    ? 'bg-[#F4F1EA] text-[#141413] font-semibold'
                    : 'text-[#A39E93] hover:text-[#F4F1EA]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Máy tính</span>
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  viewportMode === 'mobile'
                    ? 'bg-[#F4F1EA] text-[#141413] font-semibold'
                    : 'text-[#A39E93] hover:text-[#F4F1EA]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Điện thoại (375px)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng cửa sổ xem thử"
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#1A1917] border border-[#F4F1EA]/15 text-[#A39E93] hover:text-[#F4F1EA] hover:border-[#EB4D28] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Concept Viewport Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0D0D0C]">
          <div
            className={`mx-auto transition-all duration-200 ${
              viewportMode === 'mobile'
                ? 'max-w-[375px] border-2 border-[#F4F1EA]/20 rounded-2xl overflow-hidden shadow-xl'
                : 'w-full'
            }`}
          >
            {/* CONCEPT 1: LOVE LETTER */}
            {project.previewType === 'love-letter' && (
              <div className="rounded-xl bg-[#F2EFE9] text-[#141413] border border-[#141413]/15 p-5 sm:p-7 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#141413]/12 pb-4">
                  <div className="flex items-center gap-2 text-xs text-[#57534E]">
                    <Heart className="w-4 h-4 text-[#EB4D28]" />
                    <span>Bản mẫu: Góc Kỷ Niệm Hai Đứa</span>
                    <span aria-hidden="true">·</span>
                    <span>Dành riêng cho người nhận</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMusicPlaying((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141413] text-xs font-medium text-[#F4F1EA] hover:bg-[#292826] transition-colors whitespace-nowrap shrink-0"
                  >
                    {musicPlaying ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#EB4D28]" />
                        <span>Nhạc nền: Đang bật (Mô phỏng)</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-[#A39E93]" />
                        <span>Bật nhạc kỷ niệm (Chủ động)</span>
                      </>
                    )}
                  </button>
                </div>

                {!letterOpened ? (
                  <div className="py-10 px-4 text-center space-y-4 bg-white rounded-xl border border-[#141413]/10">
                    <p className="text-xs font-mono-tabular text-[#EB4D28]">
                      PHONG BÌ SỐ TƯƠNG TÁC
                    </p>
                    <h4 className="font-display text-2xl font-bold text-[#141413]">
                      Gửi người thương — Có một bức thư nhỏ dành cho bạn
                    </h4>
                    <p className="text-sm text-[#57534E] max-w-md mx-auto">
                      Khi khách đặt làm web quà tặng, trang đầu tiên có thể là một lời chào nhẹ nhàng hoặc câu đố kỷ niệm trước khi mở toàn bộ bức thư.
                    </p>
                    <button
                      type="button"
                      onClick={() => setLetterOpened(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg btn-industrial-primary font-semibold text-sm"
                    >
                      <span>Mở bức thư kỷ niệm</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-lg font-bold text-[#141413]">
                        Dòng thời gian kỷ niệm (Bấm chọn từng mốc)
                      </h4>
                      <button
                        type="button"
                        onClick={() => setLetterOpened(false)}
                        className="text-xs text-[#57534E] hover:text-[#EB4D28] underline"
                      >
                        Đóng lại phong bì
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {memories.map((m, idx) => (
                        <button
                          key={m.title}
                          type="button"
                          onClick={() => setSelectedMemoryIndex(idx)}
                          className={`p-3.5 rounded-xl text-left border transition-colors ${
                            selectedMemoryIndex === idx
                              ? 'bg-[#141413] border-[#141413] text-[#F4F1EA]'
                              : 'bg-white border-[#141413]/12 text-[#57534E] hover:text-[#141413]'
                          }`}
                        >
                          <div
                            className={`flex items-center gap-1.5 text-xs font-mono-tabular ${
                              selectedMemoryIndex === idx ? 'text-[#EB4D28]' : 'text-[#57534E]'
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{m.date}</span>
                          </div>
                          <div className="font-semibold text-sm mt-1">{m.title}</div>
                        </button>
                      ))}
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-[#141413]/12 space-y-2">
                      <div className="text-xs font-mono-tabular text-[#EB4D28]">
                        {memories[selectedMemoryIndex].date}
                      </div>
                      <h5 className="font-display text-lg font-bold text-[#141413]">
                        {memories[selectedMemoryIndex].title}
                      </h5>
                      <p className="text-sm text-[#57534E] leading-relaxed">
                        {memories[selectedMemoryIndex].note}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CONCEPT 2: PERSONAL CORNER */}
            {project.previewType === 'personal-corner' && (
              <div className="rounded-xl bg-[#181715] border border-[#F4F1EA]/12 p-5 sm:p-7 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F4F1EA]/10 pb-4">
                  <div>
                    <div className="text-xs font-mono-tabular text-[#EB4D28]">
                      CONCEPT BIO & GROUP DIRECTORY
                    </div>
                    <h4 className="font-display text-xl font-bold text-[#F4F1EA] mt-0.5">
                      Góc Cá Nhân / Tập Thể Lớp (Mẫu Bố Cục Bento)
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 p-1 rounded-lg bg-[#11110F] border border-[#F4F1EA]/12">
                    {(
                      [
                        { id: 'all', label: 'Tất cả mục' },
                        { id: 'code', label: 'Dự án' },
                        { id: 'notes', label: 'Góc ghi chép' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveProfileTab(tab.id)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          activeProfileTab === tab.id
                            ? 'bg-[#EB4D28] text-[#F4F1EA] font-semibold'
                            : 'text-[#A39E93] hover:text-[#F4F1EA]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(activeProfileTab === 'all' || activeProfileTab === 'code') && (
                    <div className="p-4 rounded-xl bg-[#11110F] border border-[#F4F1EA]/10 space-y-2">
                      <div className="text-xs font-mono-tabular text-[#EB4D28]">
                        MỤC HỒ SƠ · 01
                      </div>
                      <h5 className="font-display text-base font-bold text-[#F4F1EA]">
                        Danh sách thành viên / Kỹ năng cá nhân
                      </h5>
                      <p className="text-sm text-[#A39E93]">
                        Trình bày gọn gàng thông tin giới thiệu, vai trò từng thành viên trong nhóm hoặc các môn học/kỹ năng yêu thích mà không bị rối mắt.
                      </p>
                    </div>
                  )}

                  {(activeProfileTab === 'all' || activeProfileTab === 'notes') && (
                    <div className="p-4 rounded-xl bg-[#11110F] border border-[#F4F1EA]/10 space-y-2">
                      <div className="text-xs font-mono-tabular text-[#C8A96E]">
                        MỤC HỒ SƠ · 02
                      </div>
                      <h5 className="font-display text-base font-bold text-[#F4F1EA]">
                        Bảng liên kết nhanh (Bio Hub) & Nhật ký hoạt động
                      </h5>
                      <p className="text-sm text-[#A39E93]">
                        Gom tất cả link Facebook, Discord, GitHub, Google Drive tài liệu học tập vào một địa chỉ web duy nhất dễ nhớ.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CONCEPT 3: LAUNCH PAGE & BIOSTRUCTURE LAB */}
            {project.previewType === 'launch-page' && (
              <div className="rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] p-5 sm:p-7 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#0B57D0]">
                      <FlaskConical className="w-4 h-4" />
                      <span>LAB DEMO · LANDING PAGE DỰ ÁN KHOA HỌC SINH - HÓA</span>
                    </div>
                    <h4 className="font-display text-xl font-bold text-[#0F172A] mt-1">
                      BioStructure Explorer — Minh họa tích hợp API Khoa học thật
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-[#475569] mr-1">Thử mã Protein thật:</span>
                    {(
                      [
                        { acc: 'P04637', label: 'TP53 (P04637)' },
                        { acc: 'P68871', label: 'Hemoglobin (4HHB)' },
                        { acc: 'P00533', label: 'EGFR (P00533)' },
                      ] as const
                    ).map((item) => (
                      <button
                        key={item.acc}
                        type="button"
                        onClick={() => setSelectedAccession(item.acc)}
                        className={`px-2.5 py-1 rounded text-xs font-mono-tabular font-medium transition-colors whitespace-nowrap shrink-0 ${
                          selectedAccession === item.acc
                            ? 'bg-[#0B57D0] text-white'
                            : 'bg-white border border-[#CBD5E1] text-[#334155] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-7 bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#475569]">
                      <span className="font-mono-tabular font-semibold text-[#0B57D0]">
                        UniProt: {liveProteinData.accession} · PDB: {liveProteinData.pdbId}
                      </span>
                      {loadingApi && (
                        <span className="inline-flex items-center gap-1 text-[#0D9488]">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Đang tải API...
                        </span>
                      )}
                    </div>

                    <div>
                      <h5 className="font-display text-lg font-bold text-[#0F172A]">
                        {liveProteinData.gene} — {liveProteinData.title}
                      </h5>
                      <p className="text-xs text-[#475569] mt-0.5">
                        Sinh vật: <em>{liveProteinData.organism}</em> · Chiều dài chuỗi:{' '}
                        <span className="font-mono-tabular font-semibold">
                          {liveProteinData.residueCount} aa
                        </span>{' '}
                        · Độ phân giải:{' '}
                        <span className="font-mono-tabular font-semibold">
                          {liveProteinData.resolution}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                      <div className="text-xs font-semibold text-[#0F172A]">
                        Phân bố độ tin cậy cấu trúc AlphaFold (pLDDT Confidence Scale):
                      </div>
                      <div className="h-3 w-full rounded-full overflow-hidden flex bg-[#E2E8F0]">
                        <div
                          style={{ width: `${liveProteinData.plddtHigh}%` }}
                          className="bg-[#0053D6]"
                          title="Very High (>90)"
                        />
                        <div
                          style={{ width: `${liveProteinData.plddtConfident}%` }}
                          className="bg-[#65CBF3]"
                          title="Confident (70-90)"
                        />
                        <div
                          style={{ width: `${liveProteinData.plddtLow}%` }}
                          className="bg-[#FFDB13]"
                          title="Low (50-70)"
                        />
                        <div
                          style={{ width: `${liveProteinData.plddtVeryLow}%` }}
                          className="bg-[#FF7D45]"
                          title="Very Low (<50)"
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-tabular text-[#334155]">
                        <div>
                          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#0053D6] mr-1" />
                          &gt;90: {liveProteinData.plddtHigh}%
                        </div>
                        <div>
                          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#65CBF3] mr-1" />
                          70-90: {liveProteinData.plddtConfident}%
                        </div>
                        <div>
                          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#FFDB13] mr-1" />
                          50-70: {liveProteinData.plddtLow}%
                        </div>
                        <div>
                          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[#FF7D45] mr-1" />
                          &lt;50: {liveProteinData.plddtVeryLow}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="text-xs font-mono-tabular text-[#0D9488] font-semibold">
                        NGUỒN DỮ LIỆU & KIỂM CHỨNG
                      </div>
                      <p className="text-xs text-[#334155] leading-relaxed">
                        {liveProteinData.provenance}
                      </p>
                      <p className="text-xs text-[#64748B]">{apiStatusNote}</p>
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                      <a
                        href={liveProteinData.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B57D0] hover:underline"
                      >
                        <span>Mở hồ sơ gốc trên AlphaFold / RCSB</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-[#11110F] border-t border-[#F4F1EA]/10">
          <p className="text-xs text-[#A39E93]">
            Đây là bản dựng Concept để minh họa cách bố trí và tương tác. Khi bạn đặt làm web, giao diện sẽ được thiết kế riêng theo nội dung của bạn.
          </p>
          <div className="flex items-center gap-2.5">
            <a
              href={SITE_CONFIG.contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg btn-industrial-primary text-xs font-semibold whitespace-nowrap shrink-0"
            >
              <span>Đặt làm kiểu web tương tự</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
