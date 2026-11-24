export type SiteItem = {
  href: string;
  label: string;
  blurb: string;
};

export type SiteSection = {
  id: string;
  label: string;
  note: string;
  items: SiteItem[];
};

export const sections: SiteSection[] = [
  {
    id: 'cau-hoi',
    label: 'Câu hỏi',
    note: 'Ba câu hỏi thường ngày, trả lời trước rồi mới đến bản vẽ.',
    items: [
      {
        href: '/',
        label: 'Đi làm sẽ nhanh hơn không?',
        blurb: 'Metro được xếp theo bốn giai đoạn; câu trả lời phụ thuộc tuyến gần bạn.',
      },
      {
        href: '/ngap/',
        label: 'Đường tôi có còn ngập không?',
        blurb: 'Có quy hoạch thoát nước, nhưng bản vẽ không ghi năm.',
      },
      {
        href: '/cay-xanh/',
        label: 'Có thêm công viên gần nhà không?',
        blurb: 'Bản vẽ quyết định cây xanh ở cấp vùng, không phải cấp phường.',
      },
    ],
  },
  {
    id: 'dia-diem',
    label: 'Địa điểm',
    note: 'Năm địa điểm trong mô hình, mỗi nơi một vai trò.',
    items: [
      {
        href: '/thu-duc/',
        label: 'Thủ Đức',
        blurb: 'Cực đổi mới sáng tạo — đô thị tri thức mở.',
      },
      {
        href: '/ben-thanh/',
        label: 'Bến Thành',
        blurb: 'Lõi trung tâm — nút đo khoảng cách của mô hình đa cực.',
      },
      {
        href: '/can-gio/',
        label: 'Cần Giờ',
        blurb: 'Khu dự trữ sinh quyển — lớp giữ, không phải lớp mở.',
      },
      {
        href: '/tan-son-nhat/',
        label: 'Tân Sơn Nhất',
        blurb: 'Sân bay ở lại; Long Thành là sân bay thứ hai của vùng.',
      },
      {
        href: '/vung-tau/',
        label: 'Vũng Tàu',
        blurb: 'Cực cảng biển của thành phố mở rộng.',
      },
    ],
  },
  {
    id: 'goc-nhin',
    label: 'Góc nhìn',
    note: 'Đọc một phối cảnh thay vì một bản đồ.',
    items: [
      {
        href: '/my-khanh/',
        label: 'Mỹ Khánh',
        blurb: 'TOD ven sông — mở mặt tiền đô thị ra sông Đồng Nai.',
      },
    ],
  },
  {
    id: 'cong-cu',
    label: 'Công cụ',
    note: 'Bốn cách đọc bản vẽ: tra điểm, chú giải, bản đồ, hiệu chỉnh.',
    items: [
      {
        href: '/tra-cuu/',
        label: 'Tra cứu điểm',
        blurb: 'Chọn một điểm: nhóm đất, đường gần nhất, hai bản vẽ thoát nước.',
      },
      {
        href: '/chu-giai/',
        label: 'Chú giải',
        blurb: '32 màu đất, ba loại đường, và quy tắc màu = gì, nét = khi nào.',
      },
      {
        href: '/ban-do/',
        label: 'Bản đồ năm cực',
        blurb: 'Năm cực của mô hình trên nền OpenStreetMap — vị trí ước lệ.',
      },
      {
        href: '/can-chinh/',
        label: 'Hiệu chỉnh bản vẽ (kỹ thuật)',
        blurb: 'Công cụ nội bộ để ghép toạ độ; không cần cho việc đọc.',
      },
    ],
  },
];

export const allItems = sections.flatMap((section) =>
  section.items.map((item) => ({ ...item, section: section.label, sectionId: section.id })),
);

export function sectionFor(path: string) {
  const norm = path.replace(/\/+$/, '') || '/';
  return sections.find((section) =>
    section.items.some((item) => (item.href.replace(/\/+$/, '') || '/') === norm),
  );
}

export function itemFor(path: string) {
  const norm = path.replace(/\/+$/, '') || '/';
  return allItems.find((item) => (item.href.replace(/\/+$/, '') || '/') === norm);
}
