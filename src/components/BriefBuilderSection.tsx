import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight, ChevronDown } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

export const BriefBuilderSection: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('Web tặng người thương');
  const [selectedReadiness, setSelectedReadiness] = useState<string>(
    'Mới có ý tưởng sơ bộ, cần gợi ý thêm'
  );
  const [customNote, setCustomNote] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string>(SITE_CONFIG.faqs[0].id);

  const webTypes = [
    'Web tặng người thương',
    'Web cá nhân / lớp / nhóm',
    'Landing page dự án',
    'Hỏi Tool Discord / Hook MB',
  ];

  const readinessOptions = [
    'Mới có ý tưởng sơ bộ, cần gợi ý thêm',
    'Đã có sẵn nội dung chữ và ảnh',
    'Muốn hỏi báo giá trước',
  ];

  const generatedMessage = `Chào Nhật Minh, mình muốn trao đổi về: ${selectedType}.\n- Chuẩn bị: ${selectedReadiness}.${
    customNote.trim() ? `\n- Ghi chú: ${customNote.trim()}` : ''
  }\nKhi nào rảnh sau giờ học nhờ Minh tư vấn giúp mình nha!`;

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: 4-Step Process & Concise FAQs */}
      <div className="lg:col-span-6 space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-mono-tabular text-[#E04F2E]">06 · QUY TRÌNH & LIÊN HỆ</div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F3F1EC]">
            Cách làm việc & Câu hỏi thường gặp
          </h1>
        </div>

        {/* Compact 4-Step Process */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SITE_CONFIG.processSteps.map((s) => (
            <div
              key={s.step}
              className="rounded-xl bg-[#161614] border border-[#F3F1EC]/10 p-4 space-y-1.5"
            >
              <div className="text-xs font-mono-tabular text-[#E04F2E]">Bước {s.step}</div>
              <div className="font-display text-sm font-bold text-[#F3F1EC]">{s.title}</div>
              <p className="text-xs text-[#8E8B82] leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Compact FAQ Accordion */}
        <div className="divide-y divide-[#F3F1EC]/10 border-t border-b border-[#F3F1EC]/10">
          {SITE_CONFIG.faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div key={faq.id} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left text-sm font-semibold text-[#F3F1EC] hover:text-[#E04F2E] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8E8B82] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#E04F2E]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs sm:text-sm text-[#8E8B82] leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Quick Message Composer & Facebook CTA */}
      <div className="lg:col-span-6 rounded-2xl bg-[#161614] border border-[#F3F1EC]/12 p-6 sm:p-7 space-y-5">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-[#F3F1EC]">
            Bạn đang nghĩ tới một chiếc web nào?
          </h2>
          <p className="text-xs text-[#8E8B82]">{SITE_CONFIG.contact.note}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#8E8B82]">Chọn nhu cầu:</label>
          <div className="grid grid-cols-2 gap-2">
            {webTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 rounded-lg text-left text-xs font-medium border transition-colors cursor-pointer ${
                  selectedType === type
                    ? 'bg-[#F3F1EC] border-[#F3F1EC] text-[#111110] font-semibold'
                    : 'bg-[#111110] border-[#F3F1EC]/10 text-[#8E8B82] hover:text-[#F3F1EC]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#8E8B82]">Mức độ chuẩn bị:</label>
          <div className="flex flex-wrap gap-1.5">
            {readinessOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedReadiness(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  selectedReadiness === opt
                    ? 'bg-[#E04F2E] border-[#E04F2E] text-[#F3F1EC] font-semibold'
                    : 'bg-[#111110] border-[#F3F1EC]/10 text-[#8E8B82] hover:text-[#F3F1EC]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="brief-note" className="block text-xs font-medium text-[#8E8B82]">
            Ghi chú thêm (tùy chọn):
          </label>
          <input
            id="brief-note"
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Ví dụ: Cần kịp sinh nhật cuối tháng này..."
            className="w-full rounded-lg bg-[#111110] border border-[#F3F1EC]/15 px-3 py-2 text-xs sm:text-sm text-[#F3F1EC] placeholder:text-[#8E8B82]/50 focus:outline-none focus:border-[#E04F2E]"
          />
        </div>

        <div className="rounded-xl bg-[#111110] border border-[#F3F1EC]/10 p-3.5 space-y-3">
          <pre className="text-xs text-[#F3F1EC] whitespace-pre-wrap font-sans leading-relaxed">
            {generatedMessage}
          </pre>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCopyBrief}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1C1B18] border border-[#F3F1EC]/15 text-xs font-semibold text-[#F3F1EC] hover:border-[#E04F2E] transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E04F2E]" />
                  <span>Đã chép tin nhắn</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép tin nhắn</span>
                </>
              )}
            </button>

            <a
              href={SITE_CONFIG.contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E04F2E] hover:bg-[#EB5B3A] text-[#F3F1EC] text-xs font-semibold transition-colors"
            >
              <span>{SITE_CONFIG.contact.facebookCtaText}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
