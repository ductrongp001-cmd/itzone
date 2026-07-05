import { getDb, saveDb } from "./database";
import { initSchema } from "./schema";

export async function runSeed() {
  await seed();
}

async function seed() {
  await initSchema();
  const db = await getDb();

  db.run("DELETE FROM questions");
  db.run("DELETE FROM lessons");
  db.run("DELETE FROM categories");

  // Seed users
  db.run("DELETE FROM users");
  db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Admin", "admin@itzone.com", "admin123", "admin"]);
  db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    ["Nguyen Van A", "user@itzone.com", "user123", "user"]);

  const categories = [
    { name: "MOS Word", description: "Microsoft Word - Soạn thảo văn bản chuyên nghiệp", cert: "MOS", icon: "📝", order_index: 1 },
    { name: "MOS Excel", description: "Microsoft Excel - Bảng tính và phân tích dữ liệu", cert: "MOS", icon: "📊", order_index: 2 },
    { name: "MOS PowerPoint", description: "Microsoft PowerPoint - Thiết kế bài thuyết trình", cert: "MOS", icon: "🎨", order_index: 3 },
    { name: "IC3 - Computing Fundamentals", description: "Phần cứng, phần mềm, hệ điều hành", cert: "IC3", icon: "💻", order_index: 4 },
    { name: "IC3 - Key Applications", description: "Ứng dụng văn phòng cốt lõi", cert: "IC3", icon: "📋", order_index: 5 },
    { name: "IC3 - Living Online", description: "Internet, email, an ninh mạng", cert: "IC3", icon: "🌐", order_index: 6 },
  ];

  for (const c of categories) {
    db.run("INSERT INTO categories (name, description, cert, icon, order_index) VALUES (?, ?, ?, ?, ?)",
      [c.name, c.description, c.cert, c.icon, c.order_index]);
  }

  const lessons: { category_id: number; title: string; content: string; order_index: number; questions: any[] }[] = [
    // ======================= MOS WORD (12 lessons) =======================
    {
      category_id: 1, title: "Định dạng văn bản cơ bản", order_index: 1,
      content: `[SECTION: Kiến thức cần nhớ]
Các thao tác định dạng văn bản trong Word:

📌 Font (Phông chữ)
• Chọn kiểu chữ, cỡ chữ, màu sắc tại Home > Font
• Các hiệu ứng: Bold (Ctrl+B), Italic (Ctrl+I), Underline (Ctrl+U)
• Strikethrough, Superscript (x²), Subscript (H₂O)
• Change Case: Chuyển đổi chữ hoa/thường (Shift+F3)

📌 Paragraph (Đoạn văn)
• Căn lề: Left (Ctrl+L), Center (Ctrl+E), Right (Ctrl+R), Justify (Ctrl+J)
• Khoảng cách dòng (Line Spacing): Home > Paragraph > Line and Paragraph Spacing
• Indent: Thụt lề trái/phải, First Line Indent, Hanging Indent
• Tabs: Đặt tab dừng (Left, Center, Right, Decimal, Bar)

📌 Bullets & Numbering
• Bullets: Đánh dấu đầu dòng Home > Paragraph > Bullets
• Numbering: Đánh số tự động Home > Paragraph > Numbering
• Multilevel List: Danh sách đa cấp (Tab để xuống cấp, Shift+Tab lên cấp)

📌 Borders & Shading
• Borders: Đường viền cho đoạn văn, ô, bảng
• Shading: Tô màu nền

📌 Phím tắt quan trọng
• Ctrl+B - Bold | Ctrl+I - Italic | Ctrl+U - Underline
• Ctrl+L - Left | Ctrl+E - Center | Ctrl+R - Right | Ctrl+J - Justify
• Ctrl+Shift+> - Tăng cỡ chữ | Ctrl+Shift+< - Giảm cỡ chữ
• Ctrl+1 - Đơn | Ctrl+2 - Đôi | Ctrl+5 - 1.5 dòng
• Shift+F3 - Chuyển đổi chữ hoa/thường`,
      questions: [
        { q: "Phím tắt để in đậm văn bản trong Word là gì?", o: ["Ctrl+B", "Ctrl+I", "Ctrl+U", "Ctrl+P"], a: "Ctrl+B", d: "beginner" },
        { q: "Để căn giữa văn bản, ta dùng phím tắt nào?", o: ["Ctrl+L", "Ctrl+E", "Ctrl+R", "Ctrl+J"], a: "Ctrl+E", d: "beginner" },
        { q: "Chức năng 'Bullets' dùng để làm gì?", o: ["Đánh dấu đầu dòng", "Đánh số tự động", "Căn lề", "Tạo bảng"], a: "Đánh dấu đầu dòng", d: "beginner" },
        { q: "Để thay đổi khoảng cách dòng, vào đâu?", o: ["Home > Paragraph", "Home > Font", "Insert > Text", "Layout > Page Setup"], a: "Home > Paragraph", d: "beginner" },
        { q: "Shift+F3 dùng để làm gì?", o: ["Chuyển đổi chữ hoa/thường", "Tìm kiếm", "In đậm", "Căn lề"], a: "Chuyển đổi chữ hoa/thường", d: "beginner" },
        { q: "Để thụt lề dòng đầu tiên của đoạn, dùng gì?", o: ["First Line Indent", "Hanging Indent", "Left Indent", "Right Indent"], a: "First Line Indent", d: "intermediate" },
        { q: "Ctrl+J có tác dụng gì?", o: ["Căn đều hai bên", "Căn trái", "Căn phải", "Căn giữa"], a: "Căn đều hai bên", d: "beginner" },
        { q: "Multilevel List dùng để làm gì?", o: ["Danh sách đa cấp", "Đánh số trang", "Chèn bảng", "Tạo mục lục"], a: "Danh sách đa cấp", d: "intermediate" },
      ]
    },
    {
      category_id: 1, title: "Styles và Themes", order_index: 2,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Styles (Kiểu định dạng)
Styles là tập hợp định dạng có sẵn giúp bạn định dạng đồng bộ:

Các kiểu Styles quan trọng:
• Normal: Kiểu mặc định cho văn bản thường
• Heading 1, 2, 3: Đề mục các cấp (dùng để tạo mục lục tự động)
• Title: Tiêu đề văn bản
• Subtitle: Phụ đề
• No Spacing: Kiểu không khoảng cách dòng

Cách dùng Styles:
1. Chọn đoạn văn bản
2. Home > Styles > Chọn kiểu
3. Hoặc dùng Ctrl+Shift+S để mở hộp thoại Apply Styles

[TIP: Mẹo]
• Sử dụng Styles Heading để tạo mục lục tự động (Table of Contents)
• Nhấn Ctrl+Shift+N để áp dụng Normal style
• Modify Style: Chuột phải > Modify để tùy chỉnh

📌 Themes (Chủ đề)
Themes là bộ màu + font đồng bộ cho toàn bộ tài liệu:
• Apply Theme: Design > Themes
• Customize Colors: Design > Colors
• Customize Fonts: Design > Fonts
• Effects: Design > Effects

📌 Style Sets & Templates
• Style Sets: Bộ Styles có sẵn (Design > Document Formatting)
• Templates: Mẫu tài liệu (.dotx) - File > New > Personal`,
      questions: [
        { q: "Styles trong Word có tác dụng gì?", o: ["Định dạng đồng bộ", "Tạo bảng", "Chèn hình ảnh", "Tạo biểu đồ"], a: "Định dạng đồng bộ", d: "beginner" },
        { q: "Để tạo mục lục tự động, cần dùng gì?", o: ["Styles Heading", "Bullets", "Table", "Text Box"], a: "Styles Heading", d: "intermediate" },
        { q: "Theme trong Word nằm ở tab nào?", o: ["Design", "Home", "Insert", "Layout"], a: "Design", d: "beginner" },
        { q: "Shortcut để áp dụng Normal style?", o: ["Ctrl+Shift+N", "Ctrl+N", "Alt+N", "Shift+N"], a: "Ctrl+Shift+N", d: "intermediate" },
        { q: "Template Word có đuôi mở rộng là gì?", o: [".dotx", ".docx", ".doc", ".dotm"], a: ".dotx", d: "intermediate" },
        { q: "Để tùy chỉnh màu sắc của Theme, vào đâu?", o: ["Design > Colors", "Home > Colors", "Insert > Colors", "View > Colors"], a: "Design > Colors", d: "beginner" },
      ]
    },
    {
      category_id: 1, title: "Bảng biểu (Tables)", order_index: 3,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Tạo bảng
• Insert > Table: Chèn bảng (kéo thả để chọn số ô)
• Insert > Table > Insert Table: Nhập chính xác số hàng/cột
• Draw Table: Vẽ bảng thủ công
• Quick Tables: Bảng mẫu có sẵn

📌 Thao tác với bảng
Khi chọn bảng, xuất hiện 2 tab ngữ cảnh:

📍 Table Design
• Header Row: Tô màu hàng đầu
• Total Row: Tô màu hàng cuối
• Banded Rows/Cột: Kẻ sọc xen kẽ
• Borders: Đường viền
• Shading: Tô màu ô

📍 Table Tools > Layout
• Merge Cells: Gộp ô
• Split Cells: Chia ô
• Split Table: Tách bảng
• Insert Above/Below: Thêm hàng
• Insert Left/Right: Thêm cột
• Delete: Xóa hàng/cột/bảng
• Sort: Sắp xếp dữ liệu
• Formula: Tính toán (SUM, AVERAGE, COUNT...)
• Repeat Header Rows: Lặp lại tiêu đề bảng

[TIP: Mẹo]
• Ctrl+Tab: Tạo tab trong ô bảng
• AutoFit: Tự động co giãn bảng
• Convert Text to Table: Chuyển văn bản thành bảng`,
      questions: [
        { q: "Để gộp nhiều ô trong bảng, dùng chức năng gì?", o: ["Merge Cells", "Split Cells", "Delete Cells", "Insert Cells"], a: "Merge Cells", d: "beginner" },
        { q: "Chèn bảng nằm ở tab nào?", o: ["Insert", "Home", "Design", "Layout"], a: "Insert", d: "beginner" },
        { q: "Để thêm hàng mới trong bảng, dùng lệnh nào?", o: ["Insert Above", "Insert Left", "Merge", "Split"], a: "Insert Above", d: "beginner" },
        { q: "Repeat Header Rows dùng để làm gì?", o: ["Lặp tiêu đề bảng", "Tô màu", "Thêm hàng", "Xóa cột"], a: "Lặp tiêu đề bảng", d: "intermediate" },
        { q: "Để sắp xếp dữ liệu bảng, vào tab nào?", o: ["Layout (Table Tools)", "Home", "Insert", "Review"], a: "Layout (Table Tools)", d: "intermediate" },
        { q: "Convert Text to Table dùng để làm gì?", o: ["Chuyển VB thành bảng", "Xóa bảng", "Tạo biểu đồ", "Thêm cột"], a: "Chuyển VB thành bảng", d: "advanced" },
      ]
    },
    {
      category_id: 1, title: "Quản lý tài liệu (Documents)", order_index: 4,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Tạo và lưu tài liệu
• New (Ctrl+N): Tạo tài liệu mới
• Open (Ctrl+O): Mở tài liệu có sẵn
• Save (Ctrl+S): Lưu tài liệu
• Save As (F12): Lưu với tên/định dạng khác

📌 Các định dạng file
• .docx: Định dạng mặc định (Word 2007+)
• .doc: Định dạng cũ (Word 97-2003)
• .pdf: Xuất PDF (File > Export > Create PDF)
• .txt: Văn bản thuần
• .rtf: Rich Text Format
• .dotx: Template (mẫu tài liệu)
• .htm/.html: Trang web

📌 In ấn (Print)
• Ctrl+P: Mở hộp thoại in
• Print Preview: Xem trước khi in
• Settings:
  - Print All Pages / Current Page / Custom
  - Print One Sided / Print on Both Sides
  - Collated / Uncollated
  - Portrait / Landscape Orientation
  - Page Size: A4, Letter, Legal...
• Copies: Số bản in

📌 Xuất file
• File > Export > Create PDF/XPS
• File > Export > Change File Type
• PDF là định dạng phổ biến để chia sẻ (giữ nguyên định dạng)`,
      questions: [
        { q: "Phím tắt Save As trong Word là gì?", o: ["F12", "Ctrl+S", "Ctrl+N", "Ctrl+O"], a: "F12", d: "beginner" },
        { q: "Định dạng mặc định của Word 2019 là?", o: [".docx", ".doc", ".pdf", ".dotx"], a: ".docx", d: "beginner" },
        { q: "Để xuất file PDF, vào đâu?", o: ["File > Export", "File > Print", "File > Save", "File > Share"], a: "File > Export", d: "beginner" },
        { q: "Để in hai mặt, cần chọn gì?", o: ["Print on Both Sides", "Print One Sided", "Collated", "Uncollated"], a: "Print on Both Sides", d: "intermediate" },
        { q: "Ctrl+N dùng để làm gì?", o: ["Tạo tài liệu mới", "Mở tài liệu", "Lưu tài liệu", "In tài liệu"], a: "Tạo tài liệu mới", d: "beginner" },
      ]
    },
    {
      category_id: 1, title: "Mail Merge (Trộn thư)", order_index: 5,
      content: `[SECTION: Kiến thức cần nhớ]

Mail Merge dùng để tạo nhiều văn bản từ một mẫu (thông báo, thư mời, nhãn...).

📌 Các bước thực hiện
Bước 1: Mailings > Start Mail Merge > Letters (hoặc Labels, Envelopes...)
Bước 2: Select Recipients
  • Type New List: Nhập danh sách mới
  • Use Existing List: Dùng file Excel, Access, Outlook
  • Select from Outlook Contacts
Bước 3: Insert Merge Field - Chèn trường dữ liệu (Tên, Địa chỉ, Email...)
Bước 4: Preview Results - Xem trước kết quả
Bước 5: Finish & Merge
  • Print Documents: In trực tiếp
  • Send E-mail Messages: Gửi email
  • Edit Individual Documents: Chỉnh từng bản

[TIP: Mẹo]
• Nguồn dữ liệu thường dùng là Excel file
• Dùng Update Labels khi làm nhãn
• Kiểm tra Preview trước khi Finish`,
      questions: [
        { q: "Mail Merge dùng để làm gì?", o: ["Tạo nhiều thư từ một mẫu", "Gửi email", "In ấn hàng loạt", "Chèn hình ảnh"], a: "Tạo nhiều thư từ một mẫu", d: "intermediate" },
        { q: "Tính năng Mail Merge nằm ở tab nào?", o: ["Mailings", "Home", "Insert", "Review"], a: "Mailings", d: "intermediate" },
        { q: "Để chèn tên người nhận vào thư, dùng gì?", o: ["Merge Field", "Text Box", "Bookmark", "Hyperlink"], a: "Merge Field", d: "intermediate" },
        { q: "Nguồn dữ liệu cho Mail Merge thường là?", o: ["Excel file", "Word file", "PowerPoint file", "PDF file"], a: "Excel file", d: "intermediate" },
        { q: "Sau khi xem trước kết quả, bước cuối là gì?", o: ["Finish & Merge", "Print", "Save", "Close"], a: "Finish & Merge", d: "intermediate" },
      ]
    },
    {
      category_id: 1, title: "References (Mục lục, Chú thích)", order_index: 6,
      content: `[SECTION: Kiến thức cần nhớ]
Tab References cung cấp các công cụ tạo mục lục và chú thích cho tài liệu dài.

📌 Table of Contents (Mục lục)
• Tạo mục lục tự động (cần dùng Styles Heading trước)
• Automatic Table: Mục lục tự động
• Custom Table of Contents: Tùy chỉnh
• Update Table: Cập nhật khi thay đổi nội dung

📌 Footnotes & Endnotes
• Footnote: Chú thích cuối trang (Ctrl+Alt+F)
• Endnote: Chú thích cuối văn bản (Ctrl+Alt+D)
• Next Footnote: Chuyển đến chú thích tiếp theo
• Show Notes: Hiển thị vùng chú thích

📌 Citations & Bibliography (Trích dẫn)
• Insert Citation: Chèn trích dẫn
• Manage Sources: Quản lý nguồn tài liệu
• Style: APA, MLA, Chicago...
• Bibliography: Tạo danh mục tài liệu tham khảo

📌 Captions
• Insert Caption: Chú thích cho hình ảnh, bảng biểu
• Cross-reference: Tham chiếu chéo
• Table of Figures: Mục lục hình ảnh

📌 Index (Chỉ mục)
• Mark Entry: Đánh dấu từ cho chỉ mục (Alt+Shift+X)
• Insert Index: Chèn chỉ mục

📌 Table of Authorities
• Dùng trong văn bản pháp lý
• Mark Citation: Đánh dấu trích dẫn pháp lý`,
      questions: [
        { q: "Để tạo mục lục tự động, cần dùng gì trước?", o: ["Styles Heading", "Table", "Bullets", "Page Break"], a: "Styles Heading", d: "intermediate" },
        { q: "Footnote dùng để làm gì?", o: ["Chú thích cuối trang", "Tạo mục lục", "Đánh số trang", "Chèn hình ảnh"], a: "Chú thích cuối trang", d: "intermediate" },
        { q: "Phím tắt tạo Footnote?", o: ["Ctrl+Alt+F", "Ctrl+F", "Alt+F", "Shift+F"], a: "Ctrl+Alt+F", d: "intermediate" },
        { q: "Phím tắt đánh dấu Index Entry?", o: ["Alt+Shift+X", "Ctrl+Alt+X", "Alt+X", "Shift+X"], a: "Alt+Shift+X", d: "advanced" },
        { q: "Table of Figures dùng để làm gì?", o: ["Mục lục hình ảnh", "Mục lục văn bản", "Chỉ mục", "Chú thích"], a: "Mục lục hình ảnh", d: "intermediate" },
        { q: "Để cập nhật mục lục sau khi thay đổi, dùng gì?", o: ["Update Table", "Refresh", "Reload", "Sync"], a: "Update Table", d: "beginner" },
      ]
    },
    {
      category_id: 1, title: "Định dạng trang (Page Layout)", order_index: 7,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Page Setup (Thiết lập trang)
Vào Layout > Page Setup:

• Margins (Lề): Normal (2.54cm), Narrow, Wide, Custom Margins
  - Top, Bottom, Left, Right
  - Gutter: Lề đóng gáy (cho tài liệu đóng sách)
• Orientation (Hướng): Portrait (Dọc) / Landscape (Ngang)
• Size (Kích thước): A4, Letter, Legal, A3...
• Columns: Chia cột (1, 2, 3 cột)
  - Có thể đặt đường kẻ giữa các cột (Line between)
  - Column width: Độ rộng từng cột

📌 Page Breaks & Section Breaks
• Page Break (Ctrl+Enter): Ngắt trang
• Column Break: Ngắt cột
• Text Wrapping Break: Ngắt xuống dòng

📍 Section Breaks (Phân vùng):
• Next Page: Section mới từ trang tiếp
• Continuous: Section mới ngay trên cùng trang
• Even/Odd Page: Section từ trang chẵn/lẻ tiếp theo

📌 Hyphenation (Ngắt từ)
• Automatic: Tự động ngắt từ
• Manual: Ngắt từ thủ công
• Hyphenation Options: Tùy chọn

📌 Line Numbers
• Đánh số dòng cho văn bản
• Restart Each Page / Each Section / Continuous

📌 Page Borders
• Design > Page Borders
• Box, Shadow, 3D, Custom
• Art: Viền trang trí`,
      questions: [
        { q: "Để thay đổi lề trang, vào đâu?", o: ["Layout > Margins", "Home > Margins", "Design > Margins", "Insert > Margins"], a: "Layout > Margins", d: "beginner" },
        { q: "Phím tắt Page Break là gì?", o: ["Ctrl+Enter", "Ctrl+Shift+Enter", "Alt+Enter", "Shift+Enter"], a: "Ctrl+Enter", d: "beginner" },
        { q: "Section Break khác Page Break ở điểm nào?", o: ["Cho phép định dạng khác nhau", "Nhanh hơn", "Đẹp hơn", "Không khác"], a: "Cho phép định dạng khác nhau", d: "intermediate" },
        { q: "Gutter dùng để làm gì?", o: ["Lề đóng gáy", "Lề trên", "Lề dưới", "Khoảng cách dòng"], a: "Lề đóng gáy", d: "intermediate" },
        { q: "Để chia văn bản thành nhiều cột, vào tab nào?", o: ["Layout", "Insert", "Home", "Design"], a: "Layout", d: "beginner" },
        { q: "Orientation Portrait là gì?", o: ["Hướng dọc", "Hướng ngang", "Khổ giấy", "Lề"], a: "Hướng dọc", d: "beginner" },
      ]
    },
    {
      category_id: 1, title: "Header & Footer và số trang", order_index: 8,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Header & Footer (Đầu trang & Chân trang)
Insert > Header & Footer:

• Header: Đầu trang (văn bản, logo, hình ảnh)
• Footer: Chân trang
• Page Number: Chèn số trang

📌 Các thao tác
Khi ở chế độ Header/Footer (double-click vào vùng đầu/chân trang):
• Chèn text, hình ảnh, logo
• Insert > Date & Time (cập nhật tự động)
• Insert > Quick Parts > Field (các trường đặc biệt)
• Different First Page: Header/Footer khác cho trang đầu
• Different Odd & Even Pages: Khác cho trang chẵn/lẻ
• Link to Previous: Liên kết với section trước

📌 Page Number (Số trang)
Insert > Page Number:
• Top of Page: Đầu trang
• Bottom of Page: Cuối trang
• Page Margins: Lề
• Current Position: Vị trí hiện tại
• Format Page Numbers:
  - Number format: 1, 2, 3 / i, ii, iii / a, b, c
  - Start at: Bắt đầu từ số mấy

[TIP: Mẹo]
• Section Breaks cho phép mỗi section có Header/Footer khác nhau
• Để bỏ Header/Footer trang đầu, check "Different First Page"`,
      questions: [
        { q: "Để chèn Header/Footer vào tab nào?", o: ["Insert", "Home", "Design", "Layout"], a: "Insert", d: "beginner" },
        { q: "Different First Page dùng để làm gì?", o: ["Header/Footer khác trang đầu", "Xóa header", "Thêm footer", "Đánh số trang"], a: "Header/Footer khác trang đầu", d: "intermediate" },
        { q: "Để số trang bắt đầu từ số khác 1, dùng gì?", o: ["Format Page Numbers > Start at", "Page Number > Top", "Page Number > Bottom", "Different First Page"], a: "Format Page Numbers > Start at", d: "intermediate" },
        { q: "Different Odd & Even Pages dùng để làm gì?", o: ["Header/Footer khác trang chẵn/lẻ", "Xóa header", "Thêm số trang", "Tạo mới"], a: "Header/Footer khác trang chẵn/lẻ", d: "intermediate" },
        { q: "Để chèn ngày tự động cập nhật vào Header?", o: ["Insert > Date & Time", "Gõ ngày", "Insert > Picture", "Insert > Table"], a: "Insert > Date & Time", d: "beginner" },
      ]
    },
    {
      category_id: 1, title: "Chèn hình ảnh và đồ họa", order_index: 9,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Pictures (Hình ảnh)
Insert > Pictures:
• This Device: Chọn từ máy tính
• Stock Images: Ảnh có sẵn
• Online Pictures: Tìm trên Bing

📍 Format (Picture Tools):
• Remove Background: Xóa nền
• Corrections: Độ sáng/tương phản
• Color: Màu sắc
• Artistic Effects: Hiệu ứng nghệ thuật
• Compress Pictures: Giảm dung lượng
• Picture Border: Đường viền
• Picture Effects: Đổ bóng, phản chiếu, 3D
• Wrap Text: Cách bố trí chữ quanh ảnh
  - In Line with Text, Square, Tight, Through, Top and Bottom, Behind Text, In Front of Text
• Crop: Cắt ảnh
• Position: Vị trí trên trang

📌 Shapes (Hình khối)
Insert > Shapes:
• Vẽ hình: Rectangle, Circle, Arrow, Line, Flowchart...
• Format (Shape Tools):
  - Shape Fill: Tô màu
  - Shape Outline: Đường viền
  - Shape Effects: Hiệu ứng
• Add Text: Thêm chữ vào shape

📌 SmartArt
Insert > SmartArt:
• List, Process, Cycle, Hierarchy, Relationship, Matrix, Pyramid
• Chuyển đổi văn bản thành SmartArt: Home > Convert to SmartArt
• Add Shape: Thêm hình
• Text Pane: Bảng văn bản

📌 Text Box & WordArt
• Text Box: Hộp văn bản (Insert > Text Box, hoặc Draw Text Box)
• WordArt: Chữ nghệ thuật (Insert > WordArt)
• Drop Cap: Chữ cái đầu lớn (Insert > Drop Cap)

📌 Charts & Icons
• Chart: Biểu đồ (Insert > Chart)
• Icons: Biểu tượng (Insert > Icons)
• 3D Models: Mô hình 3D (Insert > 3D Models)
• Screenshot: Chụp màn hình (Insert > Screenshot)`,
      questions: [
        { q: "Chức năng Remove Background dùng để làm gì?", o: ["Xóa nền ảnh", "Cắt ảnh", "Đổi màu ảnh", "Xoay ảnh"], a: "Xóa nền ảnh", d: "intermediate" },
        { q: "Wrap Text Square có tác dụng gì?", o: ["Chữ bao quanh hình vuông", "Chữ trên hình", "Chữ dưới hình", "Chữ trong hình"], a: "Chữ bao quanh hình vuông", d: "intermediate" },
        { q: "SmartArt dùng để làm gì?", o: ["Vẽ sơ đồ trực quan", "Chèn hình", "Tạo bảng", "Định dạng"], a: "Vẽ sơ đồ trực quan", d: "beginner" },
        { q: "Để giảm dung lượng hình ảnh, dùng gì?", o: ["Compress Pictures", "Crop", "Resize", "Delete"], a: "Compress Pictures", d: "intermediate" },
        { q: "WordArt dùng để làm gì?", o: ["Tạo chữ nghệ thuật", "Tạo bảng", "Chèn hình", "Vẽ sơ đồ"], a: "Tạo chữ nghệ thuật", d: "beginner" },
        { q: "Drop Cap dùng để làm gì?", o: ["Chữ cái đầu lớn", "Chữ hoa", "Chữ đậm", "Chữ nghiêng"], a: "Chữ cái đầu lớn", d: "intermediate" },
        { q: "Để thêm chữ vào Shape, dùng lệnh gì?", o: ["Add Text", "Type Text", "Insert Text", "Write Text"], a: "Add Text", d: "beginner" },
      ]
    },
    {
      category_id: 1, title: "Tìm kiếm và thay thế", order_index: 10,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Find (Tìm kiếm)
• Ctrl+F: Mở Navigation Pane
• Home > Find hoặc Ctrl+F
• Gõ từ khóa, kết quả hiển thị ngay

📍 Navigation Pane:
• Điều hướng nhanh giữa các Heading
• Tìm kiếm trực quan

📌 Advanced Find (Tìm kiếm nâng cao)
Ctrl+H hoặc Home > Replace:

📍 Find and Replace:
• Find what: Từ cần tìm
• Replace with: Từ thay thế
• More >>: Mở rộng tùy chọn

📍 Các tùy chọn:
• Match case: Phân biệt chữ hoa/thường
• Find whole words only: Chỉ tìm từ nguyên vẹn
• Use wildcards: Sử dụng ký tự đại diện
  - ?: Một ký tự bất kỳ
  - *: Nhiều ký tự bất kỳ
• Sounds like: Tìm từ phát âm giống (homophones)
• Find all word forms: Tìm tất cả dạng từ

📍 Special Characters:
• ^p: Paragraph mark (xuống dòng)
• ^t: Tab character
• ^?: Any character
• ^#: Any digit
• ^$: Any letter
• ^&: Find what text

📍 Replace All: Thay thế tất cả (cẩn thận!)
• Replace: Thay thế từng cái
• Replace All: Thay toàn bộ

📌 Go To (Ctrl+G hoặc F5)
Chuyển đến nhanh: Page, Section, Line, Bookmark, Comment, Footnote, Table...
• Nhập số trang để chuyển đến
• Dùng trong tài liệu dài`,
      questions: [
        { q: "Phím tắt mở Navigation Pane (Find)?", o: ["Ctrl+F", "Ctrl+H", "Ctrl+G", "Ctrl+D"], a: "Ctrl+F", d: "beginner" },
        { q: "Phím tắt mở Replace (Thay thế)?", o: ["Ctrl+H", "Ctrl+F", "Ctrl+G", "Ctrl+R"], a: "Ctrl+H", d: "beginner" },
        { q: "Wildcard * dùng để làm gì?", o: ["Đại diện nhiều ký tự", "Đại diện 1 ký tự", "Ký tự số", "Ký tự chữ"], a: "Đại diện nhiều ký tự", d: "intermediate" },
        { q: "Match case có tác dụng gì?", o: ["Phân biệt chữ hoa/thường", "So khớp từ", "Tìm kiếm nhanh", "Bỏ qua dấu"], a: "Phân biệt chữ hoa/thường", d: "intermediate" },
        { q: "Go To dùng để làm gì?", o: ["Chuyển đến trang/section", "Tìm kiếm", "Thay thế", "Xóa văn bản"], a: "Chuyển đến trang/section", d: "beginner" },
        { q: "^p trong Find/Replace đại diện cho gì?", o: ["Paragraph mark", "Tab", "Khoảng trắng", "Xuống dòng"], a: "Paragraph mark", d: "advanced" },
      ]
    },
    {
      category_id: 1, title: "Kiểm tra chính tả và ngữ pháp", order_index: 11,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Spelling & Grammar (Kiểm tra chính tả & ngữ pháp)
• F7: Mở Spelling & Grammar
• Review > Spelling & Grammar
• Sửa lỗi (Change), bỏ qua (Ignore), thêm từ (Add to Dictionary)

📍 Các tùy chọn:
• Spelling: Kiểm tra lỗi chính tả
• Grammar: Kiểm tra ngữ pháp
• Check Document: Kiểm tra toàn bộ văn bản
• Options > Proofing: Tùy chỉnh kiểm tra

📌 AutoCorrect (Tự động sửa)
• File > Options > Proofing > AutoCorrect Options
• Tự động sửa lỗi chính tả thường gặp
• Thay thế chữ viết tắt: (c) → ©, (tm) → ™
• Thêm từ viết tắt riêng

📌 Thesaurus (Từ đồng nghĩa)
• Shift+F7: Mở Thesaurus
• Review > Thesaurus
• Chọn từ > Synonyms

📌 Translate (Dịch)
• Review > Translate
• Translate Document: Dịch toàn bộ
• Translate Selected Text: Dịch đoạn chọn
• Mini Translator: Dịch nhanh khi trỏ chuột
• Language: Ngôn ngữ nguồn và đích

📌 Word Count (Đếm từ)
• Review > Word Count (Ctrl+Shift+G)
• Đếm: Words, Characters, Paragraphs, Lines
• Hiển thị ở status bar bên dưới

📌 Smart Lookup & Researcher
• Smart Lookup: Tra cứu thông tin từ Bing
• Researcher: Nghiên cứu tài liệu học thuật`,
      questions: [
        { q: "Phím tắt kiểm tra Spelling & Grammar là gì?", o: ["F7", "F5", "F1", "F3"], a: "F7", d: "beginner" },
        { q: "Shift+F7 dùng để làm gì?", o: ["Thesaurus", "Spell Check", "Translate", "Word Count"], a: "Thesaurus", d: "intermediate" },
        { q: "AutoCorrect dùng để làm gì?", o: ["Tự động sửa lỗi", "Kiểm tra ngữ pháp", "Đếm từ", "Dịch"], a: "Tự động sửa lỗi", d: "beginner" },
        { q: "Phím tắt Word Count?", o: ["Ctrl+Shift+G", "Ctrl+W", "Ctrl+G", "Shift+F7"], a: "Ctrl+Shift+G", d: "intermediate" },
        { q: "Add to Dictionary dùng để làm gì?", o: ["Thêm từ vào từ điển", "Xóa từ", "Sửa lỗi", "Tra từ"], a: "Thêm từ vào từ điển", d: "beginner" },
        { q: "Researcher trong Word dùng để làm gì?", o: ["Nghiên cứu tài liệu", "Kiểm tra chính tả", "Dịch thuật", "Vẽ biểu đồ"], a: "Nghiên cứu tài liệu", d: "advanced" },
      ]
    },
    {
      category_id: 1, title: "Bảo vệ và chia sẻ tài liệu", order_index: 12,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Protect Document (Bảo vệ tài liệu)
File > Info > Protect Document:

• Mark as Final: Đánh dấu hoàn tất (chỉ đọc)
• Encrypt with Password: Mã hóa bằng mật khẩu
• Restrict Editing: Hạn chế chỉnh sửa
  - Formatting restrictions: Giới hạn định dạng
  - Editing restrictions: Chỉ cho phép đọc, nhận xét, hoặc điền form
• Restrict Permission: Quản lý quyền (cần Azure Information Protection)
• Add a Digital Signature: Thêm chữ ký số

📌 Restrict Editing chi tiết
Review > Restrict Editing:
• Limit formatting to a selection of styles
• Allow only this type of editing in the document:
  - No changes (Read only)
  - Comments
  - Filling in forms
  - Tracked changes
• Exceptions: Ngoại lệ cho người dùng cụ thể
• Enforce Protection: Bật bảo vệ

📌 Track Changes (Theo dõi chỉnh sửa)
Review > Tracking:
• Track Changes (Ctrl+Shift+E): Bật/tắt theo dõi
• Display for Review:
  - Simple Markup: Đơn giản
  - All Markup: Hiển thị tất cả
  - No Markup: Ẩn
  - Original: Bản gốc
• Show Markup: Chọn hiển thị (Comments, Ink, Insertions/Deletions...)
• Reviewing Pane: Bảng theo dõi

📍 Accept/Reject:
• Accept: Chấp nhận thay đổi
• Reject: Từ chối thay đổi
• Accept All / Reject All

📌 Comments (Nhận xét)
Review > Comments:
• New Comment: Thêm nhận xét
• Delete: Xóa nhận xét
• Previous / Next: Chuyển giữa các nhận xét
• Show Comments: Hiển thị/ẩn

📌 So sánh và kết hợp
Review > Compare:
• Compare: So sánh hai tài liệu
• Combine: Kết hợp chỉnh sửa từ nhiều người

📌 Chia sẻ và cộng tác
• File > Share (cần OneDrive/SharePoint)
• Save to Cloud: Lưu lên OneDrive
• Co-authoring: Nhiều người cùng chỉnh sửa`,
      questions: [
        { q: "Encrypt with Password dùng để làm gì?", o: ["Mã hóa tài liệu", "Chia sẻ tài liệu", "In tài liệu", "Lưu tài liệu"], a: "Mã hóa tài liệu", d: "intermediate" },
        { q: "Phím tắt Track Changes?", o: ["Ctrl+Shift+E", "Ctrl+E", "Shift+E", "Alt+E"], a: "Ctrl+Shift+E", d: "intermediate" },
        { q: "Để hạn chế chỉnh sửa, vào đâu?", o: ["Review > Restrict Editing", "File > Info > Protect", "Home > Editing", "Insert > Protect"], a: "Review > Restrict Editing", d: "intermediate" },
        { q: "Compare dùng để làm gì?", o: ["So sánh hai tài liệu", "Kết hợp tài liệu", "Kiểm tra lỗi", "Định dạng"], a: "So sánh hai tài liệu", d: "intermediate" },
        { q: "Mark as Final có tác dụng gì?", o: ["Đánh dấu hoàn tất", "Mã hóa", "Thêm chữ ký", "Chia sẻ"], a: "Đánh dấu hoàn tất", d: "intermediate" },
        { q: "Simple Markup hiển thị gì?", o: ["Kết quả chỉnh sửa đơn giản", "Tất cả markup", "Ẩn markup", "Bản gốc"], a: "Kết quả chỉnh sửa đơn giản", d: "intermediate" },
        { q: "Để thêm nhận xét, dùng gì?", o: ["New Comment", "Add Note", "Insert Comment", "Review Note"], a: "New Comment", d: "beginner" },
      ]
    },

    // ======================= MOS EXCEL (8 lessons) =======================
    {
      category_id: 2, title: "Công thức và hàm cơ bản", order_index: 1,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Cú pháp công thức
• Tất cả công thức bắt đầu bằng dấu =
• =SUM(A1:A10) - Tính tổng
• Có thể kết hợp: =A1+B1

📌 Tham chiếu ô
• Tương đối (A1): Thay đổi khi sao chép
• Tuyệt đối ($A$1): Giữ nguyên khi sao chép
• Hỗn hợp ($A1, A$1): Cố định cột hoặc hàng
• 3D Reference: =SUM(Sheet1:Sheet3!A1)

📌 Các hàm cơ bản
• =SUM(range): Tính tổng
• =AVERAGE(range): Trung bình cộng
• =COUNT(range): Đếm ô có số
• =COUNTA(range): Đếm ô không rỗng
• =MAX(range): Giá trị lớn nhất
• =MIN(range): Giá trị nhỏ nhất
• =LARGE(range, k): Giá trị lớn thứ k
• =SMALL(range, k): Giá trị nhỏ thứ k

📌 Hàm xử lý văn bản
• =LEFT(text, n): Lấy n ký tự trái
• =RIGHT(text, n): Lấy n ký tự phải
• =MID(text, start, n): Lấy từ vị trí
• =LEN(text): Độ dài chuỗi
• =UPPER/LOWER/PROPER: Chuyển chữ hoa/thường
• =TRIM: Xóa khoảng trắng thừa
• =CONCATENATE(text1, text2...): Nối chuỗi

📌 Hàm ngày tháng
• =TODAY(): Ngày hiện tại
• =NOW(): Ngày giờ hiện tại
• =DATE(year, month, day): Tạo ngày
• =DAY/MONTH/YEAR: Lấy ngày/tháng/năm
• =DATEDIF(start, end, "d"): Khoảng cách ngày

📌 Lỗi thường gặp
• #DIV/0!: Chia cho 0
• #N/A: Không tìm thấy
• #REF!: Tham chiếu không hợp lệ
• #VALUE!: Sai kiểu dữ liệu`,
      questions: [
        { q: "Hàm nào tính tổng trong Excel?", o: ["SUM", "AVERAGE", "COUNT", "MAX"], a: "SUM", d: "beginner" },
        { q: "Ký tự nào bắt đầu một công thức Excel?", o: ["=", "+", "@", "#"], a: "=", d: "beginner" },
        { q: "Tham chiếu $A$1 là loại tham chiếu gì?", o: ["Tuyệt đối", "Tương đối", "Hỗn hợp", "Động"], a: "Tuyệt đối", d: "intermediate" },
        { q: "Hàm COUNTA đếm gì?", o: ["Ô không rỗng", "Ô có số", "Ô có chữ", "Tất cả ô"], a: "Ô không rỗng", d: "beginner" },
        { q: "Lỗi #DIV/0! xảy ra khi nào?", o: ["Chia cho 0", "Không tìm thấy", "Sai kiểu", "Tham chiếu lỗi"], a: "Chia cho 0", d: "beginner" },
        { q: "Hàm DATEDIF dùng để làm gì?", o: ["Tính khoảng cách ngày", "Tính tổng", "Đếm số", "Tìm kiếm"], a: "Tính khoảng cách ngày", d: "intermediate" },
        { q: "Hàm TRIM dùng để làm gì?", o: ["Xóa khoảng trắng thừa", "Cắt chuỗi", "Nối chuỗi", "Đếm ký tự"], a: "Xóa khoảng trắng thừa", d: "beginner" },
        { q: "Để lấy 3 ký tự đầu của chuỗi, dùng hàm gì?", o: ["LEFT", "RIGHT", "MID", "LEN"], a: "LEFT", d: "beginner" },
      ]
    },
    {
      category_id: 2, title: "Hàm IF và hàm logic", order_index: 2,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Hàm IF
=IF(logical_test, value_if_true, value_if_false)
Ví dụ: =IF(A1>=5,"Đạt","Trượt")

📌 Các hàm logic
• AND: =AND(A1>5, B1<10) → TRUE nếu tất cả đều đúng
• OR: =OR(A1="X", B1="Y") → TRUE nếu ít nhất một đúng
• NOT: =NOT(A1="") → Phủ định
• XOR: =XOR(A1>5, B1>5) → TRUE nếu chỉ một đúng

📌 IF lồng nhau
=IF(A1>=8,"Giỏi", IF(A1>=5,"Khá", IF(A1>=3,"Yếu","Kém")))

📌 IFS (Excel 2019+)
=IFS(A1>=8,"Giỏi", A1>=5,"Khá", A1>=3,"Yếu")
• Không cần lồng IF, dễ đọc hơn

📌 SWITCH (Excel 2019+)
=SWITCH(A1, 1,"Một", 2,"Hai", 3,"Ba", "Khác")
• So sánh nhiều giá trị cụ thể

📌 IFERROR & IFNA
• =IFERROR(formula, value_if_error): Bắt mọi lỗi
• =IFNA(formula, value_if_na): Chỉ bắt lỗi #N/A`,
      questions: [
        { q: "Cú pháp hàm IF đúng là?", o: ["=IF(test, true, false)", "=IF(test, true)", "=IF(true, false, test)", "=IF(test, false, true)"], a: "=IF(test, true, false)", d: "intermediate" },
        { q: "Hàm AND trả về TRUE khi nào?", o: ["Tất cả đều đúng", "Một cái đúng", "Tất cả sai", "Không xác định"], a: "Tất cả đều đúng", d: "intermediate" },
        { q: "Hàm IFS là gì?", o: ["IF nhiều điều kiện", "IF lồng nhau", "IF đơn giản", "IF sai"], a: "IF nhiều điều kiện", d: "intermediate" },
        { q: "IFERROR dùng để làm gì?", o: ["Bắt lỗi công thức", "Kiểm tra điều kiện", "Tìm kiếm", "Tính tổng"], a: "Bắt lỗi công thức", d: "intermediate" },
        { q: "Hàm SWITCH khác IF ở điểm nào?", o: ["So sánh nhiều giá trị", "Kiểm tra điều kiện", "Nhanh hơn", "Đơn giản hơn"], a: "So sánh nhiều giá trị", d: "advanced" },
        { q: "Công thức =IF(5>3,'Đúng','Sai') cho kết quả?", o: ["Đúng", "Sai", "Lỗi", "TRUE"], a: "Đúng", d: "beginner" },
      ]
    },
    {
      category_id: 2, title: "VLOOKUP và hàm tra cứu", order_index: 3,
      content: `[SECTION: Kiến thức cần nhớ]

📌 VLOOKUP (Vertical Lookup)
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])
• Tìm giá trị theo cột dọc (từ trái sang phải)
• range_lookup: FALSE (chính xác), TRUE (tương đối)

⚠️ Hạn chế của VLOOKUP:
• Chỉ tìm từ trái sang phải
• Cột tìm phải là cột đầu tiên của bảng

📌 HLOOKUP (Horizontal Lookup)
=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])
• Tìm giá trị theo hàng ngang

📌 INDEX + MATCH (Linh hoạt hơn VLOOKUP)
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
• Có thể tìm từ phải sang trái
• Nhanh hơn VLOOKUP

📌 XLOOKUP (Excel 365)
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
• Không có hạn chế của VLOOKUP
• Có thể tìm theo chiều ngược
• Nếu không tìm thấy, trả về giá trị tùy chỉnh
• match_mode: 0 (chính xác), -1 (gần đúng nhỏ hơn), 1 (gần đúng lớn hơn), 2 (wildcard)

📌 FILTER (Excel 365)
=FILTER(array, include, [if_empty])
• Lọc mảng động theo điều kiện`,
      questions: [
        { q: "VLOOKUP dùng để làm gì?", o: ["Tìm dọc", "Tìm ngang", "Tính tổng", "Đếm số"], a: "Tìm dọc", d: "intermediate" },
        { q: "HLOOKUP khác VLOOKUP ở điểm nào?", o: ["Tìm theo hàng", "Tìm theo cột", "Tìm chính xác", "Tìm tương đối"], a: "Tìm theo hàng", d: "intermediate" },
        { q: "Trong VLOOKUP, FALSE có nghĩa là gì?", o: ["Tìm chính xác", "Tìm tương đối", "Tìm tất cả", "Không tìm"], a: "Tìm chính xác", d: "intermediate" },
        { q: "Hạn chế của VLOOKUP là gì?", o: ["Chỉ tìm từ trái sang phải", "Chậm", "Không tìm được số", "Dễ lỗi"], a: "Chỉ tìm từ trái sang phải", d: "intermediate" },
        { q: "XLOOKUP có sẵn từ phiên bản Excel nào?", o: ["Excel 365", "Excel 2010", "Excel 2016", "Excel 2019"], a: "Excel 365", d: "advanced" },
        { q: "INDEX+MATCH có ưu điểm gì so với VLOOKUP?", o: ["Tìm được từ phải sang trái", "Đơn giản hơn", "Nhanh hơn", "Đẹp hơn"], a: "Tìm được từ phải sang trái", d: "advanced" },
      ]
    },
    {
      category_id: 2, title: "Biểu đồ (Charts)", order_index: 4,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Tạo biểu đồ
Chọn dữ liệu > Insert > Charts

📍 Các loại biểu đồ:
• Column Chart: Biểu đồ cột - So sánh giá trị
• Line Chart: Biểu đồ đường - Xu hướng theo thời gian
• Pie Chart: Biểu đồ tròn - Tỷ lệ phần trăm
• Bar Chart: Biểu đồ thanh ngang
• Area Chart: Biểu đồ vùng
• Scatter Chart: Biểu đồ phân tán
• Radar Chart: Biểu đồ radar

📌 Tùy chỉnh biểu đồ
Khi chọn biểu đồ, xuất hiện Chart Tools:

📍 Design tab:
• Add Chart Element: Thêm thành phần
  - Chart Title, Axis Titles, Legend, Data Labels, Data Table, Error Bars, Trendline
• Quick Layout: Bố cục nhanh
• Change Colors: Đổi màu
• Change Chart Type: Đổi loại biểu đồ
• Switch Row/Column: Đổi hàng/cột

📍 Format tab:
• Shape Fill, Shape Outline, Shape Effects
• Size: Kích thước
• Format Selection: Định dạng chi tiết

📌 Biểu đồ nâng cao
• Combo Chart: Kết hợp cột + đường
• Trendline: Đường xu hướng
• Secondary Axis: Trục phụ
• Sparklines: Biểu đồ mini trong ô (Insert > Sparklines)`,
      questions: [
        { q: "Biểu đồ nào hiển thị tỷ lệ phần trăm?", o: ["Pie", "Column", "Line", "Bar"], a: "Pie", d: "beginner" },
        { q: "Để thêm tiêu đề cho biểu đồ, dùng gì?", o: ["Chart Title", "Legend", "Axis", "Gridlines"], a: "Chart Title", d: "beginner" },
        { q: "Sparkline là gì?", o: ["Biểu đồ nhỏ trong ô", "Biểu đồ lớn", "Đường xu hướng", "Biểu đồ tròn"], a: "Biểu đồ nhỏ trong ô", d: "intermediate" },
        { q: "Trendline dùng để làm gì?", o: ["Đường xu hướng", "Đường kẻ", "Đường viền", "Đường nối"], a: "Đường xu hướng", d: "intermediate" },
        { q: "Combo Chart là gì?", o: ["Kết hợp nhiều loại biểu đồ", "Biểu đồ cột", "Biểu đồ đường", "Biểu đồ tròn"], a: "Kết hợp nhiều loại biểu đồ", d: "advanced" },
        { q: "Secondary Axis dùng để làm gì?", o: ["Trục phụ cho giá trị khác đơn vị", "Trục chính", "Trục x", "Trục y"], a: "Trục phụ cho giá trị khác đơn vị", d: "advanced" },
      ]
    },
    {
      category_id: 2, title: "PivotTable và PivotChart", order_index: 5,
      content: `[SECTION: Kiến thức cần nhớ]

📌 PivotTable là gì?
PivotTable: Công cụ tổng hợp dữ liệu động
• Insert > PivotTable
• Chọn dữ liệu nguồn (Table/Range)
• Đặt vào: Rows, Columns, Values, Filters

📍 Các trường trong PivotTable:
• Rows: Hàng (ví dụ: Tên sản phẩm)
• Columns: Cột (ví dụ: Tháng)
• Values: Giá trị cần tổng hợp (Sum, Count, Average...)
• Filters: Bộ lọc (ví dụ: Năm)

📌 Tính năng
• Group: Nhóm dữ liệu (ngày tháng, số)
  - Nhóm theo tháng, quý, năm
  - Nhóm số theo khoảng
• Slicer: Bộ lọc trực quan (Insert > Slicer)
  - Nút bấm để lọc nhanh
  - Kết nối nhiều PivotTable
• Timeline: Lọc theo thời gian (Insert > Timeline)
• Refresh Data: Cập nhật khi nguồn thay đổi

📌 PivotChart
• Trực quan hóa PivotTable
• Tự động cập nhật khi lọc
• Tương tác với Slicer/Timeline

📌 Value Field Settings
• Sum: Tổng
• Count: Đếm
• Average: Trung bình
• Max/Min: Lớn nhất/nhỏ nhất
• % of Grand Total: % tổng`,
      questions: [
        { q: "PivotTable dùng để làm gì?", o: ["Tổng hợp dữ liệu", "Vẽ biểu đồ", "Tạo bảng tính", "Nhập dữ liệu"], a: "Tổng hợp dữ liệu", d: "intermediate" },
        { q: "Slicer dùng để làm gì?", o: ["Lọc dữ liệu trực quan", "Tạo bảng", "Vẽ biểu đồ", "Nhập công thức"], a: "Lọc dữ liệu trực quan", d: "intermediate" },
        { q: "PivotTable nằm ở tab nào?", o: ["Insert", "Home", "Data", "Review"], a: "Insert", d: "intermediate" },
        { q: "Để cập nhật PivotTable khi nguồn thay đổi?", o: ["Refresh", "Update", "Reload", "Sync"], a: "Refresh", d: "intermediate" },
        { q: "Timeline dùng để lọc gì?", o: ["Thời gian", "Số", "Văn bản", "Màu sắc"], a: "Thời gian", d: "intermediate" },
        { q: "Giá trị mặc định trong PivotTable là gì?", o: ["Count", "Sum", "Average", "Max"], a: "Count", d: "intermediate" },
      ]
    },
    {
      category_id: 2, title: "Conditional Formatting", order_index: 6,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Conditional Formatting là gì?
Định dạng ô tự động dựa trên giá trị
Home > Conditional Formatting

📌 Các loại:

📍 Highlight Cell Rules:
• Greater Than / Less Than / Between / Equal To
• Text that Contains
• A Date Occurring
• Duplicate Values

📍 Top/Bottom Rules:
• Top 10 Items / Top 10%
• Bottom 10 Items / Bottom 10%
• Above Average / Below Average

📍 Data Bars:
• Thanh màu trong ô (Gradient hoặc Solid)
• Tỷ lệ với giá trị ô

📍 Color Scales:
• 2-Color Scale: 2 màu
• 3-Color Scale: 3 màu

📍 Icon Sets:
• Biểu tượng: Traffic Lights, Flags, Arrows...

📌 Quản lý
• Manage Rules: Xem/sửa/xóa quy tắc
• New Rule: Tạo quy tắc tùy chỉnh (dùng công thức)
• Clear Rules: Xóa tất cả

📍 Dùng công thức:
=AND(A1>100, A1<200)
• Cho phép tạo điều kiện phức tạp`,
      questions: [
        { q: "Conditional Formatting nằm ở tab nào?", o: ["Home", "Insert", "Data", "Review"], a: "Home", d: "beginner" },
        { q: "Data Bars dùng để làm gì?", o: ["Thanh màu trong ô", "Tô màu ô", "Biểu tượng", "Màu sắc"], a: "Thanh màu trong ô", d: "beginner" },
        { q: "Để tìm giá trị trùng lặp, dùng gì?", o: ["Duplicate Values", "Highlight Cells", "Top/Bottom", "Data Bars"], a: "Duplicate Values", d: "intermediate" },
        { q: "Clear Rules dùng để làm gì?", o: ["Xóa quy tắc", "Thêm quy tắc", "Sửa quy tắc", "Xem quy tắc"], a: "Xóa quy tắc", d: "beginner" },
        { q: "Icon Sets dùng để làm gì?", o: ["Hiển thị biểu tượng theo giá trị", "Tô màu", "Thanh dữ liệu", "Màu sắc"], a: "Hiển thị biểu tượng theo giá trị", d: "intermediate" },
        { q: "Để tạo quy tắc tùy chỉnh dùng công thức, chọn gì?", o: ["New Rule", "Manage Rules", "Highlight Cells", "Top/Bottom"], a: "New Rule", d: "intermediate" },
      ]
    },
    {
      category_id: 2, title: "Data Tools (Xử lý dữ liệu)", order_index: 7,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Data Validation (Ràng buộc dữ liệu)
Data > Data Validation
• Whole Number: Chỉ nhập số nguyên
• Decimal: Số thập phân
• List: Danh sách thả xuống
• Date/Time: Ngày/giờ
• Text Length: Độ dài văn bản
• Custom: Công thức tùy chỉnh

📍 Input Message: Hướng dẫn khi chọn ô
📍 Error Alert: Cảnh báo khi nhập sai

📌 Text to Columns (Tách cột)
Data > Text to Columns
• Delimited: Phân cách bằng ký tự (dấu phẩy, tab...)
• Fixed Width: Độ rộng cố định
• Dùng để tách dữ liệu trong 1 cột ra nhiều cột

📌 Remove Duplicates (Xóa trùng)
Data > Remove Duplicates
• Chọn cột để kiểm tra trùng lặp
• Có thể chọn nhiều cột

📌 Sort & Filter
📍 Sort:
• Sort A-Z / Z-A
• Custom Sort: Nhiều tiêu chí
• Sort by Color / Font Color / Icon

📍 Filter:
• AutoFilter: Lọc nhanh (Ctrl+Shift+L)
• Filter by Color: Lọc bằng màu
• Text/Number Filters: Lọc văn bản/số
• Advanced Filter: Lọc phức tạp
  - Copy to another location
  - Unique records only

📌 Group & Ungroup
• Group: Nhóm hàng/cột
• Subtotal: Tổng phụ tự động
• Outline: Đại cương

📌 Consolidate
Data > Consolidate: Tổng hợp dữ liệu từ nhiều bảng`,
      questions: [
        { q: "Data Validation dùng để làm gì?", o: ["Ràng buộc dữ liệu nhập", "Tính toán", "Vẽ biểu đồ", "Sắp xếp"], a: "Ràng buộc dữ liệu nhập", d: "intermediate" },
        { q: "Text to Columns dùng để làm gì?", o: ["Tách cột", "Gộp cột", "Xóa cột", "Thêm cột"], a: "Tách cột", d: "intermediate" },
        { q: "Phím tắt AutoFilter?", o: ["Ctrl+Shift+L", "Ctrl+Shift+F", "Ctrl+L", "Alt+F"], a: "Ctrl+Shift+L", d: "beginner" },
        { q: "Advanced Filter khác AutoFilter ở điểm nào?", o: ["Lọc phức tạp hơn", "Lọc nhanh", "Lọc màu", "Lọc số"], a: "Lọc phức tạp hơn", d: "intermediate" },
        { q: "Remove Duplicates nằm ở tab nào?", o: ["Data", "Home", "Insert", "Review"], a: "Data", d: "beginner" },
        { q: "Group trong Excel dùng để làm gì?", o: ["Nhóm hàng/cột", "Nhóm dữ liệu", "Tạo bảng", "Vẽ biểu đồ"], a: "Nhóm hàng/cột", d: "intermediate" },
      ]
    },
    {
      category_id: 2, title: "What-If Analysis", order_index: 8,
      content: `[SECTION: Kiến thức cần nhớ]

📌 What-If Analysis là gì?
Phân tích tình huống giả định trong Excel.
Data > What-If Analysis

📌 Goal Seek (Tìm mục tiêu)
• Tìm giá trị đầu vào để đạt kết quả mong muốn
• Data > What-If Analysis > Goal Seek
• Ví dụ: Cần doanh số bao nhiêu để đạt lợi nhuận 100tr?
• Yêu cầu: 1 giá trị đầu vào, 1 công thức

📌 Scenario Manager (Quản lý kịch bản)
• Tạo nhiều kịch bản (Best Case, Worst Case...)
• Data > What-If Analysis > Scenario Manager
• Add: Thêm kịch bản
• Summary: Tạo báo cáo so sánh

📌 Data Table (Bảng dữ liệu)
• Phân tích nhiều giá trị cùng lúc

📍 One-Variable Data Table:
• 1 đầu vào, nhiều giá trị
• Data > What-If Analysis > Data Table
• Column Input Cell / Row Input Cell

📍 Two-Variable Data Table:
• 2 đầu vào, nhiều giá trị

📌 Solver (Add-in)
• Tối ưu hóa: Tìm giá trị tốt nhất
• Ràng buộc (Constraints)
• Cần bật Add-in: File > Options > Add-ins > Solver

📌 Forecast Sheet
• Dự báo dựa trên dữ liệu lịch sử
• Data > Forecast Sheet
• Tạo biểu đồ dự báo tự động`,
      questions: [
        { q: "Goal Seek dùng để làm gì?", o: ["Tìm giá trị mục tiêu", "Tìm kiếm", "Thay thế", "Lọc"], a: "Tìm giá trị mục tiêu", d: "advanced" },
        { q: "Scenario Manager dùng để làm gì?", o: ["Quản lý kịch bản", "Quản lý dữ liệu", "Vẽ biểu đồ", "Sắp xếp"], a: "Quản lý kịch bản", d: "advanced" },
        { q: "Data Table dùng để làm gì?", o: ["Phân tích nhiều giá trị", "Tạo bảng", "Tính tổng", "Lọc dữ liệu"], a: "Phân tích nhiều giá trị", d: "advanced" },
        { q: "Solver dùng để làm gì?", o: ["Tối ưu hóa", "Tìm kiếm", "Tính toán", "Dự báo"], a: "Tối ưu hóa", d: "advanced" },
        { q: "Forecast Sheet dùng để làm gì?", o: ["Dự báo dữ liệu", "Vẽ biểu đồ", "Tính tổng", "Lọc"], a: "Dự báo dữ liệu", d: "advanced" },
        { q: "Goal Seek yêu cầu mấy giá trị đầu vào?", o: ["1", "2", "3", "Nhiều"], a: "1", d: "advanced" },
      ]
    },

    // ======================= MOS POWERPOINT (8 lessons) =======================
    {
      category_id: 3, title: "Tạo và định dạng slide", order_index: 1,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Thao tác cơ bản với slide
• New Slide (Ctrl+M): Thêm slide mới
• Layout: Chọn bố cục (Title, Content, Blank, Two Content...)
• Duplicate Slide: Nhân bản slide
• Delete Slide: Xóa slide
• Reorder: Kéo thả sắp xếp trong Slide Sorter View
• Hide Slide: Ẩn slide (không chiếu)

📌 Sections (Phần)
• Home > Section > Add Section
• Giúp tổ chức bài thuyết trình
• Đặt tên Section để dễ quản lý
• Collapse/Expand Section

📌 Slide Orientation
• Design > Slide Size
• Widescreen (16:9) - Mặc định hiện nay
• Standard (4:3) - Màn hình cũ
• Custom Slide Size: Tùy chỉnh

📌 Các chế độ xem (View)
• Normal: Chế độ soạn thảo chính
• Outline View: Xem dàn bài
• Slide Sorter: Xem tổng thể
• Notes Page: Trang ghi chú
• Reading View: Xem thử
• Slide Show (F5): Trình chiếu`,
      questions: [
        { q: "Phím tắt thêm slide mới?", o: ["Ctrl+M", "Ctrl+N", "Ctrl+S", "Ctrl+T"], a: "Ctrl+M", d: "beginner" },
        { q: "Để đổi bố cục slide, dùng gì?", o: ["Layout", "Theme", "Design", "Format"], a: "Layout", d: "beginner" },
        { q: "Section dùng để làm gì?", o: ["Nhóm slide", "Tạo hiệu ứng", "Chèn hình", "Định dạng"], a: "Nhóm slide", d: "beginner" },
        { q: "Tỷ lệ màn hình chuẩn cho PowerPoint hiện nay?", o: ["16:9", "4:3", "16:10", "1:1"], a: "16:9", d: "beginner" },
        { q: "Slide Sorter View dùng để làm gì?", o: ["Xem tổng thể các slide", "Soạn thảo", "Trình chiếu", "Ghi chú"], a: "Xem tổng thể các slide", d: "beginner" },
        { q: "Hide Slide dùng để làm gì?", o: ["Ẩn slide khi chiếu", "Xóa slide", "Thêm slide", "Sao chép slide"], a: "Ẩn slide khi chiếu", d: "intermediate" },
      ]
    },
    {
      category_id: 3, title: "Theme và Slide Master", order_index: 2,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Theme (Chủ đề)
Design > Themes:
• Apply Theme: Chọn theme có sẵn
• Variants: Biến thể màu sắc và font
• Customize: Design > Colors / Fonts / Effects

📌 Slide Master (Bản mẫu chính)
View > Slide Master:

📍 Tại sao dùng Slide Master?
• Thay đổi một lần, áp dụng cho tất cả slide
• Giúp đồng bộ font, màu, logo

📍 Các thao tác:
• Insert Slide Master: Thêm bản mẫu mới
• Insert Layout: Thêm bố cục mới
• Chỉnh sửa Placeholder (vùng chứa nội dung)
  - Title, Text, Picture, Chart, Table, SmartArt, Media
• Background Styles: Định dạng nền
• Close Master View: Thoát

📍 Các thành phần trong Slide Master:
• Master layout: Định dạng chung
• Layout layouts: Các bố cục con
• Thay đổi trên Master ảnh hưởng đến tất cả Layout

[TIP: Mẹo]
• Luôn chỉnh Slide Master trước khi làm nội dung
• Có thể tạo nhiều Slide Master trong 1 file`,
      questions: [
        { q: "Slide Master nằm ở tab nào?", o: ["View", "Home", "Design", "Format"], a: "View", d: "intermediate" },
        { q: "Thay đổi trên Slide Master ảnh hưởng đến?", o: ["Tất cả slide", "Slide hiện tại", "Slide đầu", "Không ảnh hưởng"], a: "Tất cả slide", d: "intermediate" },
        { q: "Theme nằm ở tab nào?", o: ["Design", "Home", "View", "Insert"], a: "Design", d: "beginner" },
        { q: "Variants dùng để làm gì?", o: ["Biến thể màu sắc", "Tạo hiệu ứng", "Chèn hình", "Định dạng văn bản"], a: "Biến thể màu sắc", d: "beginner" },
        { q: "Placeholder trong Slide Master là gì?", o: ["Vùng chứa nội dung mẫu", "Hiệu ứng động", "Hình nền", "Màu sắc"], a: "Vùng chứa nội dung mẫu", d: "intermediate" },
        { q: "Insert Slide Master dùng để làm gì?", o: ["Thêm bản mẫu mới", "Thêm slide", "Thêm layout", "Thêm theme"], a: "Thêm bản mẫu mới", d: "intermediate" },
      ]
    },
    {
      category_id: 3, title: "Animations và Transitions", order_index: 3,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Animations (Hiệu ứng cho đối tượng)
Animations tab:

📍 Các loại Animation:
• Entrance: Xuất hiện (Fade, Fly In, Zoom...)
• Emphasis: Nhấn mạnh (Spin, Grow/Shrink...)
• Exit: Biến mất (Disappear, Fade Out...)
• Motion Paths: Di chuyển theo đường

📍 Animation Pane:
• Mở: Animations > Animation Pane
• Quản lý thứ tự hiệu ứng
• Timing: Start, Duration, Delay
  - Start: On Click, With Previous, After Previous
  - Duration: Tốc độ hiệu ứng
  - Delay: Trì hoãn
• Trigger: Kích hoạt (On Click of...)
• Reorder: Sắp xếp thứ tự

📍 Animation Painter:
• Sao chép hiệu ứng từ đối tượng này sang đối tượng khác
• Giống Format Painter

📌 Transitions (Hiệu ứng chuyển slide)
Transitions tab:

• Chọn hiệu ứng (None, Fade, Push, Wipe, Morph...)
• Effect Options: Tùy chỉnh hướng
• Timing:
  - Duration: Thời gian chuyển
  - Sound: Âm thanh
  - Advance Slide: On Mouse Click / After (tự động)
• Apply To All: Áp dụng cho tất cả slide

📌 Morph (PowerPoint 2019+)
• Chuyển cảnh mượt mà giữa 2 slide
• Tự động tạo hiệu ứng di chuyển, phóng to
• Cần duplicate slide và thay đổi đối tượng

[TIP: Mẹo]
• Không lạm dụng hiệu ứng (giữ chuyên nghiệp)
• Dùng Animation Painter để tiết kiệm thời gian`,
      questions: [
        { q: "Animation Entrance dùng để làm gì?", o: ["Xuất hiện", "Nhấn mạnh", "Biến mất", "Di chuyển"], a: "Xuất hiện", d: "beginner" },
        { q: "Transition khác Animation ở điểm nào?", o: ["Chuyển slide", "Hiệu ứng đối tượng", "Âm thanh", "Màu sắc"], a: "Chuyển slide", d: "beginner" },
        { q: "Animation Pane dùng để làm gì?", o: ["Quản lý hiệu ứng", "Tạo hiệu ứng", "Xóa hiệu ứng", "Sao chép hiệu ứng"], a: "Quản lý hiệu ứng", d: "beginner" },
        { q: "Morph Transition có gì đặc biệt?", o: ["Chuyển cảnh mượt", "Hiệu ứng chữ", "Âm thanh", "Màu sắc"], a: "Chuyển cảnh mượt", d: "intermediate" },
        { q: "Animation Painter dùng để làm gì?", o: ["Sao chép hiệu ứng", "Xóa hiệu ứng", "Thêm hiệu ứng", "Sửa hiệu ứng"], a: "Sao chép hiệu ứng", d: "intermediate" },
        { q: "Start: With Previous có nghĩa là gì?", o: ["Chạy cùng lúc", "Chạy sau khi click", "Chạy tự động", "Không chạy"], a: "Chạy cùng lúc", d: "intermediate" },
      ]
    },
    {
      category_id: 3, title: "Chèn đa phương tiện", order_index: 4,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Hình ảnh (Pictures)
Insert > Pictures:
• This Device / Stock Images / Online Pictures
• Format tab:
  - Remove Background, Corrections, Color
  - Artistic Effects, Compress Pictures
  - Picture Border, Picture Effects
  - Crop: Cắt ảnh (Crop to Shape: Cắt theo hình)
  - Wrap Text: Bố trí chữ

📌 Video & Audio
Insert > Video / Audio:

📍 Video:
• This Device / Stock Video / Online Video
• Playback tab:
  - Trim Video: Cắt video
  - Fade In/Out
  - Loop until Stopped
  - Play Full Screen
• Video Format:
  - Poster Frame: Ảnh đại diện
  - Color Correction

📍 Audio:
• Audio on My PC / Record Audio
• Playback: Start (Automatically / On Click)
• Play Across Slides: Phát xuyên slide
• Hide During Show: Ẩn biểu tượng loa

📌 SmartArt
Insert > SmartArt:
• List, Process, Cycle, Hierarchy, Relationship, Matrix, Pyramid
• Add Shape: Thêm hình
• Text Pane: Bảng văn bản
• Convert to SmartArt: Từ văn bản có sẵn

📌 Icons & 3D Models
• Icons: Biểu tượng (Insert > Icons)
• 3D Models: Mô hình 3D (Insert > 3D Models)
  - Xoay, phóng to thu nhỏ

📌 Charts & Tables
• Insert > Chart: Biểu đồ
• Insert > Table: Bảng

📌 Screenshot & Screen Recording
• Insert > Screenshot: Chụp màn hình
• Insert > Screen Recording: Quay màn hình`,
      questions: [
        { q: "SmartArt dùng để làm gì?", o: ["Vẽ sơ đồ", "Chèn hình", "Tạo bảng", "Định dạng"], a: "Vẽ sơ đồ", d: "beginner" },
        { q: "Để giảm dung lượng hình ảnh, dùng gì?", o: ["Compress Pictures", "Crop", "Resize", "Delete"], a: "Compress Pictures", d: "intermediate" },
        { q: "Poster Frame dùng để làm gì?", o: ["Ảnh đại diện video", "Khung hình", "Hiệu ứng", "Đường viền"], a: "Ảnh đại diện video", d: "intermediate" },
        { q: "Icons nằm ở tab nào?", o: ["Insert", "Home", "Design", "View"], a: "Insert", d: "beginner" },
        { q: "Play Across Slides dùng để làm gì?", o: ["Phát nhạc xuyên slide", "Phát 1 slide", "Dừng nhạc", "Lặp lại"], a: "Phát nhạc xuyên slide", d: "intermediate" },
        { q: "Screen Recording dùng để làm gì?", o: ["Quay màn hình", "Chụp màn hình", "Ghi âm", "Chèn video"], a: "Quay màn hình", d: "intermediate" },
      ]
    },
    {
      category_id: 3, title: "Trình chiếu và in ấn", order_index: 5,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Slide Show (Trình chiếu)
Slide Show tab:

📍 Bắt đầu trình chiếu:
• From Beginning (F5): Từ đầu
• From Current Slide (Shift+F5): Từ slide hiện tại
• Presenter View: Xem ghi chú + slide + timer
  - Pen/Laser Pointer: Bút vẽ
  - Zoom into Slide: Phóng to
  - Black/White Screen: Tạm ẩn

📍 Set Up Slide Show:
• Show Type: Presented by speaker, Browsed by individual, Browsed at kiosk
• Show Options: Loop, Show without narration, Show without animation
• Show Slides: All, Custom, Range
• Advance Slides: Manually, Using timings

📍 Rehearse Timings:
• Tập dượt thời gian
• Ghi lại thời gian cho từng slide
• Dùng cho tự động trình chiếu

📌 In ấn
File > Print (Ctrl+P):
• Full Page Slides: 1 slide/trang
• Notes Pages: Trang ghi chú
• Outline: Dàn bài
• Handouts: 2, 3, 4, 6, 9 slide/trang
• Frame Slides: Khung viền
• Grayscale: Đen trắng

📌 Export
• File > Export > PDF/XPS
• Create Handouts in Word
• Create Video (tạo video từ slide)
• Package Presentation for CD`,
      questions: [
        { q: "Phím tắt trình chiếu từ đầu?", o: ["F5", "F1", "F3", "F7"], a: "F5", d: "beginner" },
        { q: "Presenter View dùng để làm gì?", o: ["Xem ghi chú khi trình chiếu", "Chỉnh sửa slide", "Thêm hiệu ứng", "In ấn"], a: "Xem ghi chú khi trình chiếu", d: "intermediate" },
        { q: "Handouts in được mấy slide trên 1 trang?", o: ["2-9", "2-6", "1-4", "1-8"], a: "2-9", d: "intermediate" },
        { q: "Để trình chiếu liên tục, dùng gì?", o: ["Loop", "Rehearse", "Record", "Auto"], a: "Loop", d: "intermediate" },
        { q: "Shift+F5 dùng để làm gì?", o: ["Chiếu từ slide hiện tại", "Chiếu từ đầu", "Dừng chiếu", "Ghi âm"], a: "Chiếu từ slide hiện tại", d: "beginner" },
        { q: "Rehearse Timings dùng để làm gì?", o: ["Tập dượt thời gian", "Ghi âm", "Thêm hiệu ứng", "Chèn hình"], a: "Tập dượt thời gian", d: "intermediate" },
        { q: "Browse at kiosk dùng để làm gì?", o: ["Trình chiếu tự động liên tục", "Trình chiếu thủ công", "Trình chiếu có ghi chú", "In ấn"], a: "Trình chiếu tự động liên tục", d: "advanced" },
      ]
    },
    {
      category_id: 3, title: "Hyperlinks và Action Buttons", order_index: 6,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Hyperlinks (Liên kết)
Insert > Link (Ctrl+K):

• Existing File or Web Page: Liên kết đến file/web
• Place in This Document: Liên kết đến slide khác
• Create New Document: Tạo tài liệu mới
• E-mail Address: Liên kết email

📍 ScreenTip: Chú thích khi hover

📍 Định dạng Hyperlink:
• Màu xanh + gạch chân (mặc định)
• Thay đổi màu qua Theme Colors

📌 Action Buttons
Insert > Shapes > Action Buttons (hàng cuối):

• Các nút: Back, Forward, Beginning, End, Home, Movie, Sound, Custom
• Khi click:
  - Hyperlink to: Slide, URL, Other file
  - Run macro
  - Play sound
• Mouse Over: Hành động khi trỏ chuột qua

📌 Action Settings
Insert > Action (hoặc chuột phải > Hyperlink > Action Settings):
• Mouse Click: Hành động khi click
• Mouse Over: Hành động khi trỏ chuột
• Play Sound: Âm thanh
• Highlight Click: Tô sáng khi click

📌 Zoom (PowerPoint 2019+)
Insert > Zoom:
• Summary Zoom: Menu tương tác
• Section Zoom: Phóng đến section
• Slide Zoom: Phóng đến slide

📌 Custom Shows
Slide Show > Custom Slide Show:
• Tạo nhiều phiên bản trình chiếu từ 1 file
• Chọn slide nào chiếu, theo thứ tự nào`,
      questions: [
        { q: "Phím tắt chèn Hyperlink?", o: ["Ctrl+K", "Ctrl+H", "Ctrl+L", "Ctrl+Link"], a: "Ctrl+K", d: "intermediate" },
        { q: "Action Button dùng để làm gì?", o: ["Tạo nút tương tác", "Chèn hình", "Tạo bảng", "Định dạng"], a: "Tạo nút tương tác", d: "intermediate" },
        { q: "Summary Zoom dùng để làm gì?", o: ["Menu tương tác", "Phóng to", "Thu nhỏ", "Xoay"], a: "Menu tương tác", d: "advanced" },
        { q: "Custom Show dùng để làm gì?", o: ["Trình chiếu tùy chỉnh", "Tạo hiệu ứng", "Chèn hình", "In ấn"], a: "Trình chiếu tùy chỉnh", d: "intermediate" },
        { q: "Place in This Document dùng để làm gì?", o: ["Liên kết đến slide khác", "Liên kết web", "Liên kết file", "Liên kết email"], a: "Liên kết đến slide khác", d: "intermediate" },
        { q: "Mouse Over khác Mouse Click ở điểm nào?", o: ["Hành động khi trỏ chuột qua", "Hành động khi click", "Nhanh hơn", "Chậm hơn"], a: "Hành động khi trỏ chuột qua", d: "advanced" },
      ]
    },
    {
      category_id: 3, title: "Review và Collaboration", order_index: 7,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Comments (Nhận xét)
Review > Comments:
• New Comment: Thêm nhận xét
• Delete: Xóa nhận xét
• Previous / Next: Chuyển giữa các nhận xét
• Show Comments: Hiển thị bảng nhận xét
• Reply: Trả lời nhận xét
• Resolve: Đánh dấu đã giải quyết

📌 Compare (So sánh)
Review > Compare:
• So sánh 2 bài thuyết trình
• Accept/Reject changes
• Previous/Next change
• Merge: Kết hợp thay đổi

📌 Tương tác với người xem
Slide Show tab:
• Present Online: Trình chiếu trực tuyến
  - Gửi link cho người xem
  - Xem trên trình duyệt
• Hide Presenter View: Ẩn Presenter View

📌 Co-authoring (Cộng tác)
• File > Save to OneDrive/SharePoint
• Nhiều người cùng chỉnh sửa
• See who's editing: Xem ai đang chỉnh
• AutoSave: Tự động lưu (cần OneDrive)

📌 Bảo vệ bài thuyết trình
File > Info > Protect Presentation:
• Mark as Final: Đánh dấu hoàn tất
• Encrypt with Password: Mã hóa
• Restrict Access: Hạn chế quyền
• Add a Digital Signature: Chữ ký số

📌 Inspect Presentation
File > Info > Check for Issues:
• Inspect Document: Kiểm tra metadata
• Check Accessibility: Kiểm tra tiếp cận
• Check Compatibility: Kiểm tra tương thích`,
      questions: [
        { q: "Compare trong PowerPoint dùng để làm gì?", o: ["So sánh 2 bài trình chiếu", "Tạo hiệu ứng", "Chèn hình", "In ấn"], a: "So sánh 2 bài trình chiếu", d: "intermediate" },
        { q: "Resolve Comment dùng để làm gì?", o: ["Đánh dấu đã giải quyết", "Xóa nhận xét", "Thêm nhận xét", "Trả lời"], a: "Đánh dấu đã giải quyết", d: "beginner" },
        { q: "Present Online dùng để làm gì?", o: ["Trình chiếu online", "In ấn", "Lưu file", "Tạo hiệu ứng"], a: "Trình chiếu online", d: "intermediate" },
        { q: "Check Accessibility dùng để làm gì?", o: ["Kiểm tra tiếp cận", "Kiểm tra lỗi", "Kiểm tra metadata", "Kiểm tra tương thích"], a: "Kiểm tra tiếp cận", d: "intermediate" },
        { q: "AutoSave yêu cầu lưu ở đâu?", o: ["OneDrive", "Máy tính", "USB", "Email"], a: "OneDrive", d: "beginner" },
        { q: "Để xem ai đang chỉnh sửa cùng lúc, dùng gì?", o: ["See who's editing", "Track Changes", "Compare", "Comments"], a: "See who's editing", d: "intermediate" },
      ]
    },
    {
      category_id: 3, title: "Thiết kế nâng cao và Mẫu", order_index: 8,
      content: `[SECTION: Kiến thức cần nhớ]

📌 Thiết kế slide chuyên nghiệp

📍 Nguyên tắc thiết kế:
• Ít là nhiều (Less is more)
• Tương phản (Contrast): Chữ nổi bật trên nền
• Nhất quán (Consistency): Font, màu sắc đồng bộ
• Cân bằng (Balance): Bố cục hài hòa
• Khoảng trắng (White space): Đừng nhồi nhét

📍 Mẹo thiết kế:
• Tối đa 6 dòng 1 slide
• Font chữ: Sans-serif (Arial, Calibri) cho slide
• Cỡ chữ: Title 36-44pt, Content 24-32pt
• Màu chữ tương phản với nền

📌 Grids and Guides
View > Show:
• Ruler: Thước
• Gridlines: Đường lưới
• Guides: Đường căn chỉnh
  - Thêm guide: Ctrl+Alt+drag
  - Xóa guide: Kéo ra ngoài slide

📌 Selection Pane
Home > Select > Selection Pane:
• Quản lý tất cả đối tượng trên slide
• Đổi tên đối tượng
• Ẩn/hiện (eye icon)
• Reorder (Bring Forward/Send Backward)
• Group/Ungroup

📌 Format Background
Design > Format Background:
• Solid Fill: Màu đơn sắc
• Gradient Fill: Màu chuyển sắc
• Picture or Texture Fill: Ảnh nền
• Pattern Fill: Họa tiết
• Hide Background Graphics: Ẩn đồ họa nền

📌 Photo Album
Insert > Photo Album:
• Tạo album ảnh từ nhiều ảnh
• Chọn layout và frame
• Thêm caption

📌 Template (.potx)
File > Save As > PowerPoint Template (.potx):
• Lưu lại thiết kế để dùng sau
• Personal templates: File > New > Personal`,
      questions: [
        { q: "Selection Pane dùng để làm gì?", o: ["Quản lý đối tượng", "Chèn đối tượng", "Xóa đối tượng", "Định dạng"], a: "Quản lý đối tượng", d: "intermediate" },
        { q: "Gridlines dùng để làm gì?", o: ["Đường lưới căn chỉnh", "Thước đo", "Đường kẻ", "Viền"], a: "Đường lưới căn chỉnh", d: "beginner" },
        { q: "Template PowerPoint có đuôi gì?", o: [".potx", ".pptx", ".ppt", ".ppsx"], a: ".potx", d: "intermediate" },
        { q: "Hide Background Graphics dùng để làm gì?", o: ["Ẩn đồ họa nền", "Xóa nền", "Thêm nền", "Đổi màu nền"], a: "Ẩn đồ họa nền", d: "intermediate" },
        { q: "Photo Album dùng để làm gì?", o: ["Tạo album ảnh", "Chèn ảnh", "Sửa ảnh", "Xóa ảnh"], a: "Tạo album ảnh", d: "intermediate" },
        { q: "Để ẩn đối tượng trong Selection Pane, click vào đâu?", o: ["Eye icon", "Name", "Arrow", "X button"], a: "Eye icon", d: "beginner" },
        { q: "Khoảng trắng (White space) có tác dụng gì?", o: ["Giúp slide thoáng, dễ nhìn", "Chứa nội dung", "Tô màu", "Trang trí"], a: "Giúp slide thoáng, dễ nhìn", d: "beginner" },
      ]
    },

    // ======================= IC3 - Computing Fundamentals (3 lessons) =======================
    {
      category_id: 4, title: "Phần cứng máy tính", order_index: 1,
      content: `Các thành phần phần cứng cơ bản...

CPU (Central Processing Unit): Bộ xử lý trung tâm
• Ví dụ: Intel Core i5, AMD Ryzen 7
• Tốc độ: GHz (Gigahertz)

RAM (Random Access Memory): Bộ nhớ tạm
• Lưu dữ liệu đang xử lý
• Mất khi tắt máy (Volatile)
• Đơn vị: GB (Gigabyte)

Lưu trữ:
• HDD (Hard Disk Drive): Ổ cứng cơ, dung lượng lớn, chậm
• SSD (Solid State Drive): Ổ cứng thể rắn, nhanh hơn HDD
• USB Flash Drive: Ổ nhớ di động

Thiết bị ngoại vi:
• Input: Bàn phím, chuột, máy quét
• Output: Màn hình, máy in, loa`,
      questions: [
        { q: "CPU là viết tắt của?", o: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"], a: "Central Processing Unit", d: "beginner" },
        { q: "RAM là bộ nhớ gì?", o: ["Tạm thời", "Vĩnh viễn", "Lưu trữ", "Đọc"], a: "Tạm thời", d: "beginner" },
        { q: "SSD khác HDD ở điểm nào?", o: ["Nhanh hơn", "Rẻ hơn", "Dung lượng lớn hơn", "Ồn hơn"], a: "Nhanh hơn", d: "beginner" },
        { q: "Thiết bị nào là thiết bị Input?", o: ["Bàn phím", "Màn hình", "Máy in", "Loa"], a: "Bàn phím", d: "beginner" },
      ]
    },
    {
      category_id: 4, title: "Phần mềm máy tính", order_index: 2,
      content: `Phân loại phần mềm...

Hệ điều hành (Operating System): Windows, macOS, Linux
Phần mềm ứng dụng: Word, Excel, PowerPoint, Chrome
Phần mềm mã nguồn mở (Open Source): LibreOffice, GIMP, Firefox
Driver: Phần mềm điều khiển thiết bị phần cứng`,
      questions: [
        { q: "Ví dụ về hệ điều hành?", o: ["Windows", "Word", "Excel", "Chrome"], a: "Windows", d: "beginner" },
        { q: "Phần mềm nguồn mở là gì?", o: ["Có mã nguồn", "Miễn phí", "Trả phí", "Đóng"], a: "Có mã nguồn", d: "intermediate" },
        { q: "Driver dùng để làm gì?", o: ["Điều khiển phần cứng", "Soạn thảo văn bản", "Lướt web", "Chơi game"], a: "Điều khiển phần cứng", d: "intermediate" },
      ]
    },
    {
      category_id: 4, title: "Bảo trì và bảo mật", order_index: 3,
      content: `Bảo trì máy tính:
• Disk Cleanup: Dọn ổ đĩa
• Backup: Sao lưu dữ liệu định kỳ

Bảo mật: Antivirus, Firewall, Strong Password, 2FA, Phishing`,
      questions: [
        { q: "Firewall có tác dụng gì?", o: ["Ngăn chặn xâm nhập", "Diệt virus", "Tăng tốc", "Sao lưu"], a: "Ngăn chặn xâm nhập", d: "beginner" },
        { q: "Phishing là gì?", o: ["Lừa đảo trực tuyến", "Virus", "Phần mềm", "Tường lửa"], a: "Lừa đảo trực tuyến", d: "intermediate" },
        { q: "2FA là viết tắt của?", o: ["Two-Factor Authentication", "Two-Fast Access", "Tech-Factor Auth", "Total-File Access"], a: "Two-Factor Authentication", d: "intermediate" },
      ]
    },

    // ======================= IC3 - Key Applications (3 lessons) =======================
    {
      category_id: 5, title: "Xử lý văn bản nâng cao", order_index: 1,
      content: `Các kỹ năng xử lý văn bản nâng cao...`,
      questions: [
        { q: "Track Changes dùng để làm gì?", o: ["Theo dõi chỉnh sửa", "Tạo mục lục", "Chèn hình", "Định dạng"], a: "Theo dõi chỉnh sửa", d: "intermediate" },
        { q: "Protect Document có chức năng gì?", o: ["Bảo vệ văn bản", "Sao lưu", "In ấn", "Chia sẻ"], a: "Bảo vệ văn bản", d: "intermediate" },
        { q: "Compare Documents dùng để?", o: ["So sánh văn bản", "Gộp văn bản", "Tách văn bản", "Đếm từ"], a: "So sánh văn bản", d: "intermediate" },
      ]
    },
    {
      category_id: 5, title: "Bảng tính nâng cao", order_index: 2,
      content: `Kỹ năng Excel nâng cao...`,
      questions: [
        { q: "Data Validation dùng để làm gì?", o: ["Ràng buộc dữ liệu", "Tính toán", "Vẽ biểu đồ", "Sắp xếp"], a: "Ràng buộc dữ liệu", d: "intermediate" },
        { q: "Goal Seek dùng để làm gì?", o: ["Tìm giá trị mục tiêu", "Tìm kiếm", "Thay thế", "Lọc"], a: "Tìm giá trị mục tiêu", d: "advanced" },
        { q: "Conditional Formatting nằm ở tab nào?", o: ["Home", "Insert", "Data", "Review"], a: "Home", d: "beginner" },
      ]
    },
    {
      category_id: 5, title: "Thuyết trình nâng cao", order_index: 3,
      content: `Kỹ năng PowerPoint nâng cao...`,
      questions: [
        { q: "Custom Show dùng để làm gì?", o: ["Trình chiếu tùy chỉnh", "Tạo hiệu ứng", "Chèn hình", "In ấn"], a: "Trình chiếu tùy chỉnh", d: "intermediate" },
        { q: "Morph Transition có gì đặc biệt?", o: ["Chuyển cảnh mượt", "Hiệu ứng chữ", "Âm thanh", "Màu sắc"], a: "Chuyển cảnh mượt", d: "intermediate" },
        { q: "Record Slide Show ghi lại gì?", o: ["Giọng nói + thời gian", "Chỉ hình ảnh", "Chỉ văn bản", "Chỉ hiệu ứng"], a: "Giọng nói + thời gian", d: "intermediate" },
      ]
    },

    // ======================= IC3 - Living Online (4 lessons) =======================
    {
      category_id: 6, title: "Internet và Web", order_index: 1,
      content: `Khái niệm Internet cơ bản...`,
      questions: [
        { q: "WWW là viết tắt của?", o: ["World Wide Web", "World Web Wide", "Web World Wide", "Wide World Web"], a: "World Wide Web", d: "beginner" },
        { q: "HTTPS khác HTTP ở điểm nào?", o: ["Mã hóa an toàn", "Nhanh hơn", "Miễn phí", "Chậm hơn"], a: "Mã hóa an toàn", d: "beginner" },
        { q: ".vn là tên miền của nước nào?", o: ["Việt Nam", "Mỹ", "Anh", "Pháp"], a: "Việt Nam", d: "beginner" },
      ]
    },
    {
      category_id: 6, title: "Email và giao tiếp", order_index: 2,
      content: `Email (Thư điện tử)...`,
      questions: [
        { q: "CC trong email là gì?", o: ["Carbon Copy", "Copy Center", "Confidential Copy", "Closed Copy"], a: "Carbon Copy", d: "beginner" },
        { q: "BCC khác CC ở điểm nào?", o: ["Người nhận ẩn", "Người nhận thấy", "Gửi hàng loạt", "Trả lời"], a: "Người nhận ẩn", d: "beginner" },
        { q: "Attachment dùng để làm gì?", o: ["Đính kèm file", "Viết thư", "Chèn link", "Định dạng"], a: "Đính kèm file", d: "beginner" },
      ]
    },
    {
      category_id: 6, title: "An ninh mạng và quyền riêng tư", order_index: 3,
      content: `An ninh mạng cơ bản...`,
      questions: [
        { q: "Phần mềm độc hại mã hóa dữ liệu đòi tiền?", o: ["Ransomware", "Virus", "Trojan", "Spyware"], a: "Ransomware", d: "intermediate" },
        { q: "VPN dùng để làm gì?", o: ["Bảo mật kết nối", "Tăng tốc", "Diệt virus", "Lưu trữ"], a: "Bảo mật kết nối", d: "intermediate" },
        { q: "Cookie trong trình duyệt là gì?", o: ["Dữ liệu theo dõi", "Virus", "Phần mềm", "File tạm"], a: "Dữ liệu theo dõi", d: "intermediate" },
      ]
    },
    {
      category_id: 6, title: "Mạng xã hội và đạo đức số", order_index: 4,
      content: `Digital Citizenship (Công dân số)...`,
      questions: [
        { q: "Digital Footprint là gì?", o: ["Dấu chân số", "Virus", "Phần mềm", "Tài khoản"], a: "Dấu chân số", d: "intermediate" },
        { q: "Fake news nên được xử lý thế nào?", o: ["Kiểm tra nguồn", "Chia sẻ", "Like", "Bình luận"], a: "Kiểm tra nguồn", d: "beginner" },
        { q: "Creative Commons là gì?", o: ["Giấy phép mở", "Bản quyền", "Phần mềm", "Trang web"], a: "Giấy phép mở", d: "intermediate" },
      ]
    },
  ];

  for (const l of lessons) {
    db.run("INSERT INTO lessons (category_id, title, content, order_index) VALUES (?, ?, ?, ?)",
      [l.category_id, l.title, l.content, l.order_index]);
    const idResult = db.exec("SELECT last_insert_rowid()");
    const lessonId = idResult[0].values[0][0] as number;
    for (const q of l.questions) {
      db.run("INSERT INTO questions (lesson_id, category_id, question, options, correct_answer, explanation, difficulty) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [lessonId, l.category_id, q.q, JSON.stringify(q.o), q.a, q.a, q.d]);
    }
  }

  saveDb();
  console.log("ITZone seed data created successfully!");
  console.log(`- ${categories.length} categories`);
  console.log(`- ${lessons.length} lessons`);
  const totalQ = lessons.reduce((s, l) => s + l.questions.length, 0);
  console.log(`- ${totalQ} questions`);

  saveDb();
  console.log("Seed completed successfully!");
}

seed().catch(console.error);
