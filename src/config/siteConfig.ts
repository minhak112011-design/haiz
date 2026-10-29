/**
 * Cấu hình nội dung cho Nhật Minh Portfolio.
 * Ngắn gọn, tự nhiên, trung thực — dễ dàng chỉnh sửa tại một nơi.
 */

export type ViewRoute =
  | 'trang-chu'
  | 'gioi-thieu'
  | 'dich-vu'
  | 'ban-mau'
  | 'san-pham-so'
  | 'lien-he';

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  tagline: string;
  suitableFor: string;
  deliverables: string[];
  clientNeedsToProvide: string[];
  pricingNote: string;
  sampleLayoutType: 'gift' | 'profile' | 'landing';
}

export interface ConceptProject {
  id: string;
  code: string;
  label: 'Concept' | 'Lab';
  title: string;
  category: string;
  summary: string;
  highlights: string[];
  previewType: 'love-letter' | 'personal-corner' | 'launch-page';
}

export interface DigitalToolSpec {
  id: string;
  name: string;
  summary: string;
  specs: {
    label: string;
    value: string;
  }[];
  note: string;
}

export const SITE_CONFIG = {
  creator: {
    displayName: 'Nhật Minh',
    brandWordmark: 'Nhật Minh',
    role: 'Student Web Creator',
    heroHeadline: 'Bạn có ý tưởng. Mình giúp nó thành một chiếc web thật.',
    heroLead:
      'Mình hiện vẫn đang đi học. Ngoài giờ học, mình nhận làm web quà tặng, trang giới thiệu cá nhân/nhóm và landing page gọn gàng cho cả điện thoại lẫn máy tính.',
    aboutStory: [
      'Mình không phải agency lớn. Mình là một học sinh thích mày mò viết code và chỉ nhận những dự án vừa sức để làm cho kỹ.',
      'Mỗi trang web mình làm đều ưu tiên chữ nghĩa dễ đọc, mở nhanh từ link Messenger/Zalo trên điện thoại và đúng với ý tưởng ban đầu của bạn.',
    ],
    principles: [
      {
        title: 'Nói thật về khả năng',
        detail: 'Việc gì làm được mình nhận, phần nào vượt khả năng sẽ báo rõ ngay từ đầu.',
      },
      {
        title: 'Ưu tiên điện thoại',
        detail: 'Thiết kế vừa vặn màn hình dọc trước vì đa số người xem mở link từ điện thoại.',
      },
      {
        title: 'Thống nhất trước khi code',
        detail: 'Chốt rõ bố cục, màu sắc và nội dung cần có để không làm lệch ý bạn.',
      },
    ],
  },

  contact: {
    facebookUrl: 'https://www.facebook.com/profile.php?id=61594074891915&locale=vi_VN',
    facebookCtaText: 'Inbox Facebook để đặt làm web',
    discordPlaceholder: '[Chờ Nhật Minh bổ sung Discord]',
    emailPlaceholder: '[Chờ Nhật Minh bổ sung Email]',
    note: 'Vì mình đang đi học nên đôi lúc sẽ trả lời sau giờ học. Bạn cứ nhắn trước ý tưởng qua Facebook nha.',
  },

  services: [
    {
      id: 'gift-website',
      index: '01',
      title: 'Web tặng người thương & kỷ niệm',
      tagline: 'Lưu giữ lời nhắn, dòng thời gian và album kỷ niệm riêng tư trên web.',
      suitableFor: 'Tặng sinh nhật, kỷ niệm ngày quen nhau hoặc gửi một bức thư số có chiều sâu.',
      deliverables: [
        'Mở phong bì thư tương tác, lật xem từng mốc kỷ niệm.',
        'Hiệu ứng nhẹ nhàng, chạy mượt trên điện thoại.',
        'Nút bật nhạc/video chủ động (khi bạn cung cấp file có quyền sử dụng).',
      ],
      clientNeedsToProvide: [
        'Lời nhắn hoặc các mốc thời gian muốn kể.',
        'Ảnh kỷ niệm và bài nhạc bạn có quyền sử dụng.',
      ],
      pricingNote: 'Báo giá sau khi trao đổi phạm vi',
      sampleLayoutType: 'gift',
    },
    {
      id: 'profile-group-website',
      index: '02',
      title: 'Web cá nhân, lớp hoặc nhóm',
      tagline: 'Trang giới thiệu bản thân, kỷ yếu lớp hoặc góc hoạt động CLB để gắn lên bio.',
      suitableFor: 'Học sinh, sinh viên, nhóm làm dự án hoặc tập thể lớp.',
      deliverables: [
        'Bố cục giới thiệu thành viên, kỹ năng và dự án rõ ràng.',
        'Gom toàn bộ link mạng xã hội, tài liệu về một địa chỉ duy nhất.',
        'Tách riêng file dữ liệu để dễ cập nhật nội dung sau này.',
      ],
      clientNeedsToProvide: [
        'Thông tin giới thiệu và các đường link chính xác.',
        'Ảnh đại diện hoặc ảnh tập thể rõ nét.',
      ],
      pricingNote: 'Báo giá sau khi trao đổi phạm vi',
      sampleLayoutType: 'profile',
    },
    {
      id: 'custom-landing-page',
      index: '03',
      title: 'Landing page dự án & sản phẩm',
      tagline: 'Trang giới thiệu công cụ, dự án học thuật hoặc sản phẩm mới.',
      suitableFor: 'Cá nhân hoặc nhóm nhỏ cần trang đích mạch lạc để khách liên hệ.',
      deliverables: [
        'Trình bày điểm nổi bật, thông số, FAQ và nút liên hệ rõ ràng.',
        'Có thể kết hợp mô hình 3D hoặc bảng dữ liệu tương tác.',
        'Chuẩn hiển thị thẻ chia sẻ link (Open Graph) trên mạng xã hội.',
      ],
      clientNeedsToProvide: [
        'Mô tả ngắn gọn về sản phẩm/dự án và kênh nhận liên hệ.',
        'Hình chụp hoặc thông số thực tế của sản phẩm.',
      ],
      pricingNote: 'Báo giá sau khi trao đổi phạm vi',
      sampleLayoutType: 'landing',
    },
  ] as ServiceItem[],

  concepts: [
    {
      id: 'concept-love-letter',
      code: '01',
      label: 'Concept',
      title: 'Love Letter — Thư số & Dòng thời gian',
      category: 'Web quà tặng',
      summary: 'Mở phong bì thư, xem từng mốc kỷ niệm và bật nhạc nền chủ động trên điện thoại.',
      highlights: [
        'Tập trung vào câu chuyện và hình ảnh kỷ niệm.',
        'Không tự động phát nhạc gây giật mình.',
        'Hiển thị gọn trên màn hình dọc.',
      ],
      previewType: 'love-letter',
    },
    {
      id: 'concept-personal-corner',
      code: '02',
      label: 'Concept',
      title: 'Personal Corner — Hồ sơ cá nhân & Nhóm',
      category: 'Web cá nhân / Lớp',
      summary: 'Giới thiệu thành viên, dự án và danh bạ liên kết với bộ lọc ngay trên trang.',
      highlights: [
        'Lọc danh mục trực tiếp không cần tải lại trang.',
        'Dễ thay đổi nội dung qua file cấu hình.',
      ],
      previewType: 'personal-corner',
    },
    {
      id: 'concept-launch-page',
      code: '03',
      label: 'Lab',
      title: 'BioStructure Lab — Trang dự án & Tra cứu Protein',
      category: 'Landing page · API thật',
      summary: 'Thử nghiệm kết nối trực tiếp dữ liệu cấu trúc Protein thật từ AlphaFold DB & RCSB PDB.',
      highlights: [
        'Tra cứu trực tiếp mã TP53, Hemoglobin, EGFR.',
        'Hiển thị thang độ tin cậy pLDDT chuẩn khoa học.',
      ],
      previewType: 'launch-page',
    },
  ] as ConceptProject[],

  digitalTools: [
    {
      id: 'tool-discord',
      name: 'Tool Discord',
      summary:
        'Tiện ích hỗ trợ thao tác trên Discord. Chỉ liệt kê đúng tính năng có sẵn và kiểm tra tương thích trước khi dùng.',
      specs: [
        { label: 'Phiên bản', value: '[Cần Nhật Minh bổ sung tên & phiên bản]' },
        { label: 'Tính năng thực tế', value: '[Cần Nhật Minh bổ sung danh sách tính năng]' },
        { label: 'Thiết bị tương thích', value: '[Cần Nhật Minh bổ sung hệ điều hành hỗ trợ]' },
        { label: 'Chi phí & Hỗ trợ', value: '[Cần Nhật Minh bổ sung mức giá & hỗ trợ]' },
        { label: 'Video chạy thử', value: '[Cần Nhật Minh bổ sung link demo thực tế]' },
      ],
      note: 'Nhắn Facebook để kiểm tra máy của bạn có tương thích không trước khi nhận tool.',
    },
    {
      id: 'tool-hook-mb',
      name: 'Hook MB',
      summary:
        'Tiện ích số chuyên biệt do Nhật Minh giới thiệu. Thông tin chức năng và giới hạn thiết bị được trao đổi đúng thực tế.',
      specs: [
        { label: 'Phiên bản', value: '[Cần Nhật Minh bổ sung phiên bản hiện hành]' },
        { label: 'Chức năng cụ thể', value: '[Cần Nhật Minh bổ sung phạm vi hoạt động]' },
        { label: 'Yêu cầu hệ thống', value: '[Cần Nhật Minh bổ sung phiên bản máy đã test]' },
        { label: 'Chi phí & Điều kiện', value: '[Cần Nhật Minh bổ sung báo giá & điều kiện]' },
      ],
      note: 'Không cam kết chạy trên mọi thiết bị nếu chưa kiểm tra trước.',
    },
  ] as DigitalToolSpec[],

  processSteps: [
    {
      step: '01',
      title: 'Gửi ý tưởng',
      detail: 'Nhắn qua Facebook loại web bạn muốn làm, dành cho ai và tông màu mong muốn.',
    },
    {
      step: '02',
      title: 'Chốt phạm vi',
      detail: 'Thống nhất các mục trên trang, tư liệu bạn gửi (chữ, ảnh, nhạc) và báo giá.',
    },
    {
      step: '03',
      title: 'Xem bản nháp',
      detail: 'Mình gửi link bản dựng đầu tiên để bạn mở xem trực tiếp trên điện thoại và máy tính.',
    },
    {
      step: '04',
      title: 'Chỉnh sửa & Bàn giao',
      detail: 'Hoàn thiện chi tiết theo góp ý và bàn giao code hoặc đường dẫn web.',
    },
  ],

  faqs: [
    {
      id: 'faq-1',
      question: 'Cần chuẩn bị gì trước khi đặt làm web?',
      answer:
        'Bạn chỉ cần có ý tưởng chính, phần chữ muốn đưa lên và ảnh/nhạc bạn có quyền sử dụng. Nếu chưa có bố cục, mình sẽ gợi ý cùng bạn.',
    },
    {
      id: 'faq-2',
      question: 'Có được xem thử trước khi hoàn thiện không?',
      answer:
        'Có. Bạn có thể bấm xem ngay 3 bản mẫu ở mục Bản mẫu, và khi làm web thật mình cũng gửi link nháp để bạn duyệt trên điện thoại.',
    },
    {
      id: 'faq-3',
      question: 'Chi phí tính như thế nào?',
      answer:
        'Tùy theo độ dài và hiệu ứng bạn cần. Bạn cứ nhắn ý tưởng qua Facebook, mình sẽ báo giá rõ ràng sau khi xem phạm vi.',
    },
  ],
};
