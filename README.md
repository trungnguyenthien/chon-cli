# CHON CLI

Công cụ dòng lệnh cho dự án NCKH, giúp bạn dễ dàng xử lý ảnh với các chức năng như chuyển đổi định dạng, kiểm tra và thay đổi DPI, và điều chỉnh kích thước ảnh.

## Hướng dẫn cài đặt

### 1. Cài đặt Node.js

#### Trên Windows:
1. Truy cập trang web chính thức của Node.js: https://nodejs.org/
2. Tải phiên bản LTS (Long Term Support) cho Windows
3. Chạy file cài đặt vừa tải về
4. Nhấn "Next" và làm theo các bước hướng dẫn
5. Để kiểm tra cài đặt thành công, mở Command Prompt (cmd) và gõ:
   ```bash
   node --version
   npm --version
   ```

#### Trên macOS:
1. Cách 1 - Sử dụng Homebrew (khuyến nghị):
   - Mở Terminal (tìm trong Spotlight bằng cách nhấn Command + Space và gõ "Terminal")
   - Cài đặt Homebrew nếu chưa có:
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```
   - Cài đặt Node.js:
     ```bash
     brew install node
     ```

2. Cách 2 - Tải trực tiếp:
   - Truy cập https://nodejs.org/
   - Tải phiên bản LTS cho macOS
   - Mở file .pkg vừa tải và làm theo hướng dẫn
   - Kiểm tra cài đặt bằng cách mở Terminal và gõ:
     ```bash
     node --version
     npm --version
     ```

### 2. Cài đặt CHON CLI

#### Trên Windows:
1. Mở Command Prompt (cmd) với quyền Administrator:
   - Nhấn Windows + X
   - Chọn "Windows PowerShell (Admin)" hoặc "Command Prompt (Admin)"
2. Di chuyển đến thư mục chứa mã nguồn:
   ```bash
   cd đường_dẫn_đến_thư_mục_chứa_mã_nguồn
   ```
3. Cài đặt CHON CLI:
   ```bash
   npm install -g .
   ```

#### Trên macOS:
1. Mở Terminal
2. Di chuyển đến thư mục chứa mã nguồn:
   ```bash
   cd đường_dẫn_đến_thư_mục_chứa_mã_nguồn
   ```
3. Cài đặt CHON CLI:
   ```bash
   npm install -g .
   ```

## Cách sử dụng

Sau khi cài đặt, bạn có thể sử dụng CHON CLI bằng cách gõ `chon` theo sau là các lệnh:

```bash
# Xem hướng dẫn sử dụng
chon --help

# Xem phiên bản
chon --version

# Lệnh chào hỏi
chon greet
chon greet --name "Tên của bạn"
```

## Các lệnh chính

### 1. Chuyển đổi định dạng ảnh
```bash
chon convert-img input.jpg png
```

### 2. Kiểm tra DPI của ảnh
```bash
chon check-dpi image.jpg
```

### 3. Thay đổi DPI của ảnh
```bash
chon change-dpi photo.jpg 300
```

### 4. Điều chỉnh kích thước ảnh
```bash
chon scale-img ./images 400-x
```

## Phát triển

Nếu bạn muốn phát triển hoặc tùy chỉnh CHON CLI:

1. Clone repository này về máy
2. Cài đặt các thư viện cần thiết:
```bash
npm install
```

3. Liên kết package locally:
```bash
npm link
```

4. Code sẽ tự động được định dạng bằng Prettier khi bạn lưu các file có đuôi:
- .js
- .json
- .md
- .html
- .xml
- .yaml
- .yml

Để định dạng thủ công tất cả các file:
```bash
npm run format
```

## Lưu ý
- Đảm bảo bạn đã cài đặt Node.js trước khi cài đặt CHON CLI
- Nếu gặp lỗi về quyền truy cập, hãy thử chạy lệnh với quyền Administrator (Windows) hoặc thêm `sudo` (macOS)
- Nếu cần gỡ cài đặt, sử dụng lệnh: `npm uninstall -g chon-cli` 