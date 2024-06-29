### Hướng dẫn deploy Angular Front-end

#### Cách 1: Sử dụng GitHub Actions để triển khai lên Azure Static Web Apps

1. **Tạo một ứng dụng Azure Static Web App:**
   - Đăng nhập vào [Azure Portal](https://portal.azure.com/).
   - Tạo một Azure Static Web App mới bằng cách chọn `Create a resource` > `Web` > `Static Web App`.
   - Lựa chọn `Create` và điền thông tin cơ bản như tên, vùng địa lý, và tài khoản GitHub.

2. **Cấu hình GitHub Actions:**
   - Trên repository GitHub của bạn, tạo một workflow mới hoặc sửa đổi workflow hiện tại trong thư mục `.github/workflows`.

   ```yaml
   name: Build and Deploy Angular App to Azure Static Web Apps

   on:
     push:
       branches:
         - main  # thay đổi tên nhánh tương ứng với tên nhánh của bạn

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest

       steps:
       - uses: actions/checkout@v2

       - name: Set up Node.js
         uses: actions/setup-node@v2
         with:
           node-version: '20'

       - name: Install dependencies
         run: npm install

       - name: Build Angular app
         run: npm run build --prod

       - name: Deploy to Azure Static Web Apps
         uses: azure/static-web-apps-deploy@v1
         with:
           azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_PROD }}
           app_location: '/'  # Đường dẫn đến thư mục chứa file build
           api_location: 'api'  # Nếu có API, điền vào đây
           output_location: 'dist'  # Thư mục build Angular
           configuration_location: ''  # Nếu cần, cấu hình thêm

   ```

   - Đảm bảo rằng bạn đã thiết lập `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD` trong cài đặt `Secrets` của repository để có quyền truy cập vào Azure.

3. **Triển khai:**
   - Mỗi khi có sự thay đổi trên nhánh `main` (hoặc nhánh được thiết lập trong `on`), GitHub Actions sẽ tự động triển khai ứng dụng Angular của bạn lên Azure Static Web Apps.

#### Cách 2: Build local và triển khai bằng Nginx

1. **Build ứng dụng Angular:**
   - Mở terminal và di chuyển vào thư mục dự án Angular của bạn.
   - Chạy lệnh sau để build ứng dụng Angular:

     ```bash
     npm run build
     ```

   - Sau khi hoàn thành, thư mục build sẽ nằm trong `dist/` trong thư mục dự án.

2. **Triển khai bằng Nginx:**
   - Cài đặt Nginx trên máy chủ của bạn nếu chưa có.

   - Sao chép toàn bộ thư mục `dist/` từ bước build Angular vào thư mục root của Nginx (thông thường là `/var/www/html` trên Linux).

   - Cấu hình Nginx để phục vụ ứng dụng Angular:
     - Mở file cấu hình Nginx (`nginx.conf` hoặc các file cấu hình ảnh hưởng đến việc phục vụ trang web).
     - Thêm cấu hình sau vào trong phần `server` block của file cấu hình:

       ```nginx
       server {
           listen       80;
           server_name  your_domain.com;  # Thay đổi với tên miền hoặc địa chỉ IP của bạn

           location / {
               root   /var/www/html/dist;  # Đường dẫn đến thư mục build Angular
               index  index.html;
               try_files $uri $uri/ /index.html;
           }

           # Các cấu hình bổ sung nếu cần

           error_page   500 502 503 504  /50x.html;
           location = /50x.html {
               root   html;
           }
       }
       ```

   - Lưu và khởi động lại dịch vụ Nginx để áp dụng cấu hình mới.

3. **Hoàn tất:**
   - Sau khi triển khai, truy cập vào địa chỉ domain hoặc IP của máy chủ của bạn để kiểm tra ứng dụng Angular đã được triển khai thành công.

Thông qua các hướng dẫn này, bạn có thể triển khai ứng dụng Angular của mình lên Azure Static Web Apps bằng GitHub Actions hoặc triển khai local bằng Nginx tùy thuộc vào yêu cầu và môi trường của dự án.