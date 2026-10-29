# Cách dùng bộ prompt + skill với Google AI Studio

## Nếu bạn dùng AI Studio Playground > Agents

1. Đưa các file trong thư mục này vào một GitHub repository (giữ nguyên thư mục ẩn `.agents`).
2. Trong Google AI Studio, mở Playground và chuyển sang tab/toggle **Agents**.
3. Trong phần **Environment**, chọn **Add Sources** rồi mount GitHub repository này trước khi gửi prompt đầu tiên.
4. Bắt đầu phiên agent và gửi:

   `Đọc .agents/AGENTS.md, .agents/skills/minh-human-portfolio/SKILL.md, references/quality-checklist.md và PROMPT_MASTER.md. Hãy áp dụng chúng để kiểm tra project hiện tại rồi xây dựng landing page hoàn chỉnh. Trước khi code, xác nhận ngắn gọn bạn đã đọc các file nào và nêu art direction; sau đó tiếp tục làm đến khi hoàn tất, kiểm tra build và báo rõ phần nào chưa test được.`

AI Studio Agents documentation says it loads `AGENTS.md` and discovers skills at `.agents/skills/<skill-name>/SKILL.md` from the mounted environment. Add sources before the first message of that session.

## Nếu bạn dùng AI Studio Build mode thông thường (không phải tab Agents)

Đừng mặc định rằng Build mode sẽ tự kích hoạt skill theo cấu trúc `.agents`. Hãy đính kèm hoặc đưa nội dung các file `PROMPT_MASTER.md` và `.agents/skills/minh-human-portfolio/SKILL.md` vào ngữ cảnh, rồi gửi:

`Hãy đọc toàn bộ PROMPT_MASTER.md và .agents/skills/minh-human-portfolio/SKILL.md. Coi chúng là yêu cầu bắt buộc của dự án. Trước khi sửa code, hãy tóm tắt 5 yêu cầu quan trọng nhất để xác nhận đã đọc đúng; sau đó triển khai website theo brief và tự kiểm tra giao diện mobile/desktop, mọi CTA và lỗi build trong phạm vi công cụ hiện có.`

Nếu giao diện không cho tải cả thư mục/ZIP, mở file Markdown và dán nội dung vào cuộc trò chuyện hoặc chuyển file sang một nguồn mà AI Studio hỗ trợ. Chỉ gửi ZIP mà không nói rõ cách dùng không đảm bảo agent sẽ tự động đọc từng file.


## Facebook đặt làm website

Trong prompt/skill đã cấu hình CTA “Inbox Facebook để đặt làm web” trỏ tới: https://www.facebook.com/profile.php?id=61594074891915&locale=vi_VN

Khi Gemini dựng trang, hãy kiểm tra nút này xuất hiện ở hero hoặc contact, dùng đúng link trên và có thêm link Facebook ở footer.
