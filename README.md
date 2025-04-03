# CHON CLI

Công cụ dòng lệnh cho dự án NCKH, giúp bạn dễ dàng xử lý ảnh với các chức năng như chuyển đổi định dạng, kiểm tra và thay đổi DPI, và điều chỉnh kích thước ảnh.

## Cài đặt

### Gỡ cài đặt phiên bản cũ (nếu có)
```bash
npm uninstall -g chon-cli
```

### Cách 1: Cài đặt trực tiếp (có thể hiển thị cảnh báo)
```bash
npm uninstall -g https://github.com/trungnguyenthien/chon-cli#latest
npm install -g https://github.com/trungnguyenthien/chon-cli#latest
```

### Cách 2: Cài đặt với tắt cảnh báo
```bash
NODE_NO_WARNINGS=1 npm install -g https://github.com/trungnguyenthien/chon-cli.git#main
```

### Cách 3: Cài đặt từ npm registry (nếu đã publish)
```bash
npm install -g chon-cli
```

### Cách 4: Cài đặt từ source code
```bash
# Clone repository
git clone https://github.com/trungnguyenthien/chon-cli.git
cd chon-cli

# Cài đặt dependencies
npm install

# Link package globally
npm link
```

### Cách 5: Cài đặt với force (nếu gặp lỗi EEXIST)
```bash
npm install -g --force https://github.com/trungnguyenthien/chon-cli.git#main
```

## Hướng dẫn cài đặt chi tiết

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

## Cách sử dụng

Sau khi cài đặt, bạn có thể sử dụng CHON CLI bằng cách gõ `chon` theo sau là các lệnh:

```bash
# Xem hướng dẫn sử dụng
chon --help

# Xem phiên bản
chon --version
```

## Các lệnh chính

### 1. Chuyển đổi định dạng ảnh
```bash
# Chuyển đổi ảnh PNG sang JPEG với nền trắng (mặc định)
chon convert-img logo.png jpg

# Chuyển đổi ảnh PNG sang JPEG với nền đen
chon convert-img logo.png jpg -b 0x000000

# Chuyển đổi ảnh PNG sang JPEG với nền đỏ
chon convert-img logo.png jpg --background 0xff0000
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
# Scale ảnh để chiều rộng là 400px
chon scale-img ./images 400-x

# Scale ảnh để chiều cao là 600px
chon scale-img ./images x-600

# Scale ảnh để vừa với khung 400x600
chon scale-img ./images 400-600
```

### 5. Kiểm tra và sửa ảnh theo yêu cầu
```bash
# Kiểm tra và sửa ảnh theo yêu cầu về DPI và kích thước
chon formal-img -dpi 300 -mm 100 image.jpg

# Xử lý nhiều ảnh cùng lúc
chon formal-img -dpi 300 -mm 100 *.jpg *.png

# Xử lý ảnh trong thư mục
chon formal-img -dpi 300 -mm 100 ./images/*
```

Lệnh này sẽ:
- Kiểm tra DPI và kích thước của ảnh
- Tự động sửa ảnh nếu không đạt yêu cầu:
  + Tăng DPI nếu thấp hơn yêu cầu
  + Chuyển đổi định dạng sang PNG nếu không phải định dạng được hỗ trợ
  + Scale ảnh nếu kích thước nhỏ hơn yêu cầu
- Tạo file mới với hậu tố "_fixed" thay vì ghi đè file gốc
- Hiển thị báo cáo chi tiết về trạng thái trước và sau khi xử lý

## Lưu ý
- Đảm bảo bạn đã cài đặt Node.js trước khi cài đặt CHON CLI
- Nếu gặp lỗi về quyền truy cập, hãy thử chạy lệnh với quyền Administrator (Windows) hoặc thêm `sudo` (macOS)
- Nếu cần gỡ cài đặt, sử dụng lệnh: `npm uninstall -g chon-cli`

## Tài liệu chi tiết
Xem thêm tài liệu chi tiết về cách sử dụng trong file [CLI.md](CLI.md) 