# CHON CLI

Công cụ dòng lệnh cho dự án NCKH, giúp bạn dễ dàng xử lý ảnh với các chức năng như chuyển đổi định dạng, kiểm tra và thay đổi DPI, và điều chỉnh kích thước ảnh.

## Cài đặt nhanh

### Cài đặt từ npm registry
```bash
npm install -g chon-cli
```

### Cài đặt từ GitHub release
```bash
npm install -g https://github.com/trungnguyenthien/chon-cli/releases/download/1.0/chon-cli-1.0.0.tgz
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

## Lưu ý
- Đảm bảo bạn đã cài đặt Node.js trước khi cài đặt CHON CLI
- Nếu gặp lỗi về quyền truy cập, hãy thử chạy lệnh với quyền Administrator (Windows) hoặc thêm `sudo` (macOS)
- Nếu cần gỡ cài đặt, sử dụng lệnh: `npm uninstall -g chon-cli`

## Tài liệu chi tiết
Xem thêm tài liệu chi tiết về cách sử dụng trong file [CLI.md](CLI.md) 