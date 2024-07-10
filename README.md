### Hướng dẫn deploy Angular Front-end

#### Cách 1: Sử dụng GitHub Actions để triển khai lên Azure Static Web Apps

1. **Tạo một ứng dụng Azure Static Web App:**

   - Đăng nhập vào [Azure Portal](https://portal.azure.com/).
   - Tạo một Azure Static Web App mới bằng cách chọn `Create a resource` > `Web` > `Static Web App`.
   - Lựa chọn `Create` và điền thông tin cơ bản như tên, vùng địa lý, và tài khoản GitHub.

2. **Cấu hình GitHub Actions:**

   - Trên repository GitHub của bạn, tạo một workflow mới hoặc sửa đổi workflow hiện tại trong thư mục `.github/workflows`.

   ```yaml
    name: Azure Static Web Apps CI/CD
    on:
    push:
        branches:
        - release
    pull_request:
        types: [opened, synchronize, reopened, closed]
        branches:
        - release

    jobs:
    build_and_deploy_job:
        if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
        runs-on: ubuntu-latest
        name: Build and Deploy Job
        steps:
        - uses: actions/checkout@v3
            with:
            submodules: true
            lfs: false
        # - name: Install Dependencies
        #   run: npm install --force  # Add --force flag to force npm install
        - name: Build And Deploy
            id: builddeploy
            uses: Azure/static-web-apps-deploy@v1
            with:
            azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_DELIGHTFUL_SMOKE_05712E200 }}
            repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
            action: "upload"
            ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
            # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
            app_location: "dist/roxanne"
            # App source code path
            api_location: "" # Api source code path - optional
            output_location: "dist/roxanne" # Built app content directory - optional
            ###### End of Repository/Build Configurations ######
            skip_app_build: true
            env:
            NPM_CONFIG_LEGACY_PEER_DEPS: true

    close_pull_request_job:
        if: github.event_name == 'pull_request' && github.event.action == 'closed'
        runs-on: ubuntu-latest
        name: Close Pull Request Job
        steps:
        - name: Close Pull Request
            id: closepullrequest
            uses: Azure/static-web-apps-deploy@v1
            with:
            azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_DELIGHTFUL_SMOKE_05712E200 }}
            action: "close"

   ```


- Đảm bảo rằng bạn đã thiết lập `AZURE_STATIC_WEB_APPS_API_TOKEN_DELIGHTFUL_SMOKE_05712E200` trong cài đặt `Secrets` của repository để có quyền truy cập vào Azure.

- Giữ lại file config staticwebapp.config.json trong file dist/roxanne để đảm bảo router hoạt động bình thường:

```json
{
  "navigationFallback": {
    "rewrite": "index.html",
    "exclude": ["/images/*.{png,jpg,gif,ico}", "/*.{css,scss,js}"]
  }
}
```

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
