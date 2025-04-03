# CHON CLI Documentation

## Overview
CHON CLI là một công cụ dòng lệnh cung cấp các tiện ích hữu ích cho dự án CHON. Công cụ này hỗ trợ nhiều lệnh khác nhau để thực hiện các tác vụ phổ biến.

## Cài đặt
```bash
npm install -g .
```

## Các lệnh

### 1. Convert Image
Lệnh `convert-img` cho phép chuyển đổi định dạng của file ảnh sang định dạng khác. Lệnh này hỗ trợ nhiều định dạng ảnh phổ biến như PNG, JPEG, GIF, TIFF, WebP, và nhiều định dạng khác.

#### Cú pháp
```bash
chon convert-img <input> <format> [options]
```

#### Tham số
- `input`: Đường dẫn đến file ảnh đầu vào
- `format`: Định dạng ảnh đầu ra (png, jpg, gif, tiff, webp, etc.)

#### Tùy chọn
- `-b, --background <color>`: Màu nền cho vùng trong suốt (định dạng hex, ví dụ: 0xffffff). Mặc định là màu trắng (0xffffff)

#### Ví dụ
```bash
# Chuyển đổi ảnh JPG sang PNG
chon convert-img input.jpg png

# Chuyển đổi ảnh PNG sang JPEG với nền trắng (mặc định)
chon convert-img logo.png jpg

# Chuyển đổi ảnh PNG sang JPEG với nền đen
chon convert-img logo.png jpg -b 0x000000

# Chuyển đổi ảnh PNG sang JPEG với nền đỏ
chon convert-img logo.png jpg --background 0xff0000

# Chuyển đổi ảnh sang định dạng WebP
chon convert-img photo.jpg webp
```

#### Lưu ý
- File đầu ra sẽ được tạo trong cùng thư mục với file đầu vào
- Tên file đầu ra sẽ giữ nguyên tên file đầu vào, chỉ thay đổi phần mở rộng
- Nếu file đầu vào không tồn tại, lệnh sẽ hiển thị thông báo lỗi
- Định dạng đầu ra phải là một định dạng ảnh hợp lệ được hỗ trợ bởi thư viện Sharp
- DPI của ảnh gốc sẽ được giữ nguyên trong file đầu ra
- Nếu ảnh gốc không có thông tin DPI, file đầu ra cũng sẽ không có thông tin DPI
- Khi chuyển đổi từ định dạng có hỗ trợ độ trong suốt (alpha) sang JPG:
  - Các vùng trong suốt sẽ được thay thế bằng màu nền được chỉ định
  - Các vùng bán trong suốt sẽ được pha trộn với màu nền theo tỷ lệ độ trong suốt
  - Nếu không chỉ định màu nền, mặc định sẽ sử dụng màu trắng (0xffffff)
  - Màu nền phải được chỉ định theo định dạng hex: 0xRRGGBB (ví dụ: 0xff0000 cho màu đỏ)

### 2. Check DPI
Lệnh `check-dpi` cho phép kiểm tra thông tin DPI (Dots Per Inch) và các thông tin cơ bản khác của file ảnh.

#### Cú pháp
```bash
chon check-dpi <input>
```

#### Tham số
- `input`: Đường dẫn đến file ảnh cần kiểm tra

#### Ví dụ
```bash
# Kiểm tra DPI của một file ảnh
chon check-dpi image.jpg
```

#### Kết quả
Lệnh sẽ hiển thị các thông tin sau:
- Tên file
- Kích thước ảnh (width x height)
- DPI của ảnh
- Định dạng file

#### Lưu ý
- Nếu file đầu vào không tồn tại, lệnh sẽ hiển thị thông báo lỗi
- Một số định dạng ảnh có thể không lưu thông tin DPI, trong trường hợp này sẽ hiển thị "Not specified"
- Lệnh này hỗ trợ tất cả các định dạng ảnh được hỗ trợ bởi thư viện Sharp

### 3. Change DPI
Lệnh `change-dpi` cho phép thay đổi giá trị DPI của ảnh. Lệnh này chỉ thay đổi metadata DPI của ảnh mà không làm thay đổi kích thước thực tế của ảnh.

#### Cú pháp
```bash
chon change-dpi <input> <dpi>
```

#### Tham số
- `input`: Đường dẫn đến file ảnh cần thay đổi DPI
- `dpi`: Giá trị DPI mới (phải là số dương)

#### Ví dụ
```bash
# Thay đổi DPI của ảnh từ 120 lên 300
chon change-dpi image.jpg 300

# Thay đổi DPI của ảnh từ 300 xuống 150
chon change-dpi high_res.jpg 150
```

#### Kết quả
Lệnh sẽ tạo một file ảnh mới trong cùng thư mục với file đầu vào, với tên dạng: `original_name_<dpi>dpi.extension`
Ví dụ: Nếu file đầu vào là `/path/to/image.jpg`, file đầu ra sẽ là `/path/to/image_300dpi.jpg`

#### Lưu ý
- Nếu file đầu vào không tồn tại, lệnh sẽ hiển thị thông báo lỗi
- Giá trị DPI phải là một số dương
- Lệnh này chỉ thay đổi metadata DPI, không làm thay đổi kích thước thực tế của ảnh
- File gốc sẽ không bị thay đổi, một file mới sẽ được tạo ra với DPI mới trong cùng thư mục
- Lệnh này hỗ trợ tất cả các định dạng ảnh được hỗ trợ bởi thư viện Sharp

### 4. Scale Image
Lệnh `scale-img` cho phép thay đổi kích thước tất cả các ảnh trong một thư mục theo một mẫu kích thước cho trước, đồng thời giữ nguyên tỷ lệ khung hình.

#### Cú pháp
```bash
chon scale-img <directory> <size_pattern>
```

#### Tham số
- `directory`: Đường dẫn đến thư mục chứa các ảnh cần xử lý
- `size_pattern`: Mẫu kích thước theo một trong ba định dạng sau:
  - `w-x`: Scale ảnh để chiều rộng là w (ví dụ: 400-x)
  - `x-h`: Scale ảnh để chiều cao là h (ví dụ: x-600)
  - `w-h`: Scale ảnh để vừa với khung w x h (ví dụ: 400-600)

#### Ví dụ
```bash
# Scale tất cả ảnh trong thư mục để chiều rộng là 400px
chon scale-img ./images 400-x

# Scale tất cả ảnh trong thư mục để chiều cao là 600px
chon scale-img ./images x-600

# Scale tất cả ảnh trong thư mục để vừa với khung 400x600
chon scale-img ./images 400-600
```

#### Kết quả
- Mỗi ảnh sẽ được tạo một bản sao mới trong cùng thư mục
- Tên file mới sẽ có dạng: `original_name_<width>x<height>.extension`
- Tỷ lệ khung hình gốc sẽ được giữ nguyên
- Chỉ các file ảnh có định dạng được hỗ trợ mới được xử lý

#### Lưu ý
- Thư mục đầu vào phải tồn tại
- Các số trong size_pattern phải là số dương
- File gốc sẽ không bị thay đổi
- Hỗ trợ các định dạng ảnh: PNG, JPG, JPEG, BMP, GIF, TIFF, WebP
- Nếu một file ảnh không thể xử lý, lệnh sẽ tiếp tục xử lý các file khác và hiển thị thông báo lỗi cho file đó 

### 5. Formal Image
Lệnh `formal-img` kiểm tra và tự động sửa các ảnh để đáp ứng các yêu cầu về DPI, định dạng và kích thước.

#### Cú pháp
```bash
chon formal-img -dpi <min_dpi> -mm <min_size> -file <image1> <image2> ... <imageN>
```

#### Tham số
- `-dpi <min_dpi>`: DPI tối thiểu cần đạt (bắt buộc)
- `-mm <min_size>`: Kích thước tối thiểu theo mm (bắt buộc)
- `-file <image1> <image2> ... <imageN>`: Danh sách các file ảnh cần xử lý (bắt buộc)

#### Ví dụ
```bash
# Kiểm tra và sửa ảnh với DPI tối thiểu 300 và kích thước tối thiểu 100mm
chon formal-img -dpi 300 -mm 100 -file image1.jpg image2.png image3.tiff
```

#### Kết quả
Lệnh sẽ hiển thị hai bảng:
1. Bảng trạng thái ban đầu của các ảnh, bao gồm:
   - Tên file
   - Định dạng
   - DPI hiện tại
   - Kích thước theo mm (chiều rộng và chiều cao)
   - Trạng thái (OK/NG)

2. Bảng trạng thái sau khi xử lý, hiển thị thông tin tương tự cho các file đã được sửa.

#### Xử lý tự động
Nếu ảnh không đáp ứng yêu cầu, lệnh sẽ tự động:
- Tăng DPI nếu thấp hơn yêu cầu
- Chuyển đổi sang định dạng PNG nếu không phải định dạng được hỗ trợ
- Scale ảnh để đạt kích thước tối thiểu theo mm

#### Lưu ý
- Các định dạng ảnh được hỗ trợ: JPG, JPEG, PNG, TIFF
- File đã sửa sẽ được lưu với hậu tố "_formal" trong cùng thư mục với file gốc
- File gốc sẽ không bị thay đổi
- Nếu ảnh đã đáp ứng tất cả yêu cầu, sẽ được đánh dấu là "OK" và không bị sửa đổi
- Kích thước tối thiểu được tính theo mm, và ít nhất một cạnh phải đạt kích thước này 