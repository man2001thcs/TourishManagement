export const ERR_MESSAGE_CODE_EN: Map<string, string> = new Map([
  ["C001", "Wrong password"],
  ["C002", "Wrong token's alg"],
  ["C003", "Token hasn't expired"],
  ["C004", "Login expired"],
  ["C004e", "Token expired"],
  ["C005", "Refresh token does not exist"],
  ["C006", "Refresh token has been used"],
  ["C007", "Refresh token has been revoked"],
  ["C008", "Token doesn't match"],
  ["C009", "Unexpected error"],
  ["C010", "Account existed"],
  ["C010e", "Email existed"],
  ["C010n", "Account's not exist"],

  ["C011", "Failed at Account's information change"],
  ["C012", "Failed at Account's password change"],
  ["C013", "Get account list unsuccessfully"],
  ["C014", "Get account unsuccessfully"],
  ["C015", "No permission aquired"],

  ["C110", "MovingContact not found"],
  ["C111", "MovingContact add error"],
  ["C112", "MovingContact update error"],
  ["C113", "MovingContact delete error"],
  ["C114", "MovingContact SQL error"],

  ["C120", "Air plane branch not found"],
  ["C121", "Air plane branch add error"],
  ["C122", "Air plane branch update error"],
  ["C123", "Air plane branch delete error"],
  ["C124", "Air plane branch SQL error"],

  ["C210", "Hotel branch not found"],
  ["C211", "Hotel branch add error"],
  ["C212", "Hotel branch update error"],
  ["C213", "Hotel branch delete error"],
  ["C214", "Hotel branch SQL error"],

  ["C220", "RestHouseContact branch not found"],
  ["C221", "RestHouseContact branch add error"],
  ["C222", "RestHouseContact branch update error"],
  ["C223", "RestHouseContact branch delete error"],
  ["C224", "RestHouseContact branch SQL error"],

  ["C310", "Restaurant branch not found"],
  ["C311", "Restaurant branch add error"],
  ["C312", "Restaurant branch update error"],
  ["C313", "Restaurant branch delete error"],
  ["C314", "Restaurant branch SQL error"],

  ["C410", "Tourish plan not found"],
  ["C411", "Tourish plan add error"],
  ["C412", "Tourish plan update error"],
  ["C413", "Tourish plan delete error"],
  ["C414", "Tourish plan SQL error"],

  ["C420", "Tourish category not found"],
  ["C421", "Tourish category add error"],
  ["C422", "Tourish category update error"],
  ["C423", "Tourish category delete error"],
  ["C424", "Tourish category SQL error"],

  ["C430", "Service not found"],
  ["C431", "Service add error"],
  ["C432", "Service update error"],
  ["C433", "Service delete error"],
  ["C434", "Service SQL error"],

  ["C510", "Receipt branch not found"],
  ["C511", "Receipt branch add error"],
  ["C512", "Receipt branch update error"],
  ["C513", "Receipt branch delete error"],
  ["C514", "Receipt branch SQL error"],
  ["C515", "Out of ticket"],
  ["C516", "The receipt has been canceled"],
  ["C517", "Tour is ongoing"],
  ["C518", "Tour has been completed"],
  ["C519", "Tour has been canceled"],
  ["C520", "Receipt status can't be set to complete"],
  ["C521", "Payment's attemp has been failed"],

  ["C600", "Message not found"],
  ["C601", "Message add error"],
  ["C602", "Message update error"],
  ["C603", "Message delete error"],
  ["C604", "Message SQL error"],

  ["C700", "Notification not found"],
  ["C701", "Notification add error"],
  ["C702", "Notification update error"],
  ["C703", "Notification delete error"],
  ["C704", "Notification SQL error"],

  ["C810", "Tour comment not found"],
  ["C811", "Tour comment add error"],
  ["C812", "Tour comment update error"],
  ["C813", "Tour comment delete error"],
  ["C814", "Tour comment SQL error"],

  ["C910", "Image not found"],
  ["C911", "Image add error"],
  ["C912", "Image update error"],
  ["C913", "Image delete error"],
  ["C914", "Image SQL error"],

  ["C1114", "Failed to get the list"],
  
]);

export const ERR_MESSAGE_CODE_VI: Map<string, string> = new Map([
    ["C001", "Mật khẩu không đúng, vui lòng thử lại"],
    ["C001ne", "Số lượt đăng nhập đã vượt quá cho phép, vui lòng chờ "],
    ["C001-m4", "Số lượt đăng nhập thất bại đã vượt quá cho phép, vui lòng chờ 15 phút rồi thử lại"],
    ["C001-h2", "Số lượt đăng nhập thất bại đã vượt quá cho phép, vui lòng chờ 2 tiếng rồi thử lại"],
    ["C002", "Token sai định dạng"],
    ["C003", "Token chưa hết hạn"],
    ["C004", "Quá hạn lượt đăng nhập, vui lòng đăng nhập lại"],
    ["C004e", "Token đã quá hạn sử dụng"],
    ["C005", "Refresh Token không tồn tại"],
    ["C006", "Refresh token đã được sử dụng"],
    ["C007", "Refresh token đã bị thu hồi"],
    ["C008", "Token không hợp lệ"],
    ["C009", "Lỗi không xác định"],
    ["C010", "Tài khoản đã tồn tại"],
    ["C010e", "Email đã được đăng kí, vui lòng kiểm tra lại"],
    ["C010n", "Tài khoản không tồn tại"],

    ["C011", "Cập nhật thông tin không thành công"],
    ["C012", "Cập nhật mật khẩu không thành công"],
    ["C013", "Lấy danh sách không thành công"],
    ["C014", "Lấy thông tin người dùng không thành công"],
    ["C015", "Không có thẩm quyền"],

    ["C110", "Đối tác không tồn tại"],
    ["C111", "Đối tác thêm vào bị lỗi"],
    ["C112", "Đối tác sửa đang gặp lỗi cập nhật"],
    ["C113", "Đối tác xóa thất bại"],
    ["C114", "Đối tác đang gặp lỗi cơ sở dữ liệu"],

    ["C120", "Đối tác không tồn tại"],
    ["C121", "Đối tác thêm vào bị lỗi"],
    ["C122", "Đối tác sửa đang gặp lỗi cập nhật"],
    ["C123", "Đối tác xóa thất bại"],
    ["C124", "Đối tác đang gặp lỗi cơ sở dữ liệu"],

    ["C210", "Đối tác không tồn tại"],
    ["C211", "Đối tác thêm vào bị lỗi"],
    ["C212", "Đối tác sửa đang gặp lỗi cập nhật"],
    ["C213", "Đối tác xóa thất bại"],
    ["C214", "Đối tác đang gặp lỗi cơ sở dữ liệu"],

    ["C220", "Đối tác không tồn tại"],
    ["C221", "Đối tác thêm vào bị lỗi"],
    ["C222", "Đối tác sửa đang gặp lỗi cập nhật"],
    ["C223", "Đối tác xóa thất bại"],
    ["C224", "Đối tác đang gặp lỗi cơ sở dữ liệu"],

    ["C310", "Đối tác không tồn tại"],
    ["C311", "Đối tác thêm vào bị lỗi"],
    ["C312", "Đối tác sửa đang gặp lỗi cập nhật"],
    ["C313", "Đối tác xóa thất bại"],
    ["C314", "Đối tác đang gặp lỗi cơ sở dữ liệu"],

    ["C410", "Tour không tồn tại"],
    ["C411", "Tour thêm vào bị lỗi"],
    ["C412", "Tour sửa đang gặp lỗi cập nhật"],
    ["C413", "Tour xóa thất bại"],
    ["C414", "Tour đang gặp lỗi cơ sở dữ liệu"],
    ["C415", "Không thể cập nhật trạng thái quan tâm"],
    ["C416", "Không thay đổi trạng thái theo dõi khi bạn đang là người tạo"],

    ["C420", "Thể loại tour không tồn tại"],
    ["C421", "Thể loại tour thêm vào bị lỗi"],
    ["C422", "Thể loại tour sửa đang gặp lỗi cập nhật"],
    ["C423", "Thể loại tour xóa thất bại"],
    ["C424", "Thể loại tour đang gặp lỗi cơ sở dữ liệu"],

    ["C430", "Dịch vụ tour không tồn tại"],
    ["C431", "Dịch vụ tour thêm vào bị lỗi"],
    ["C432", "Dịch vụ tour sửa đang gặp lỗi cập nhật"],
    ["C433", "Dịch vụ tour xóa thất bại"],
    ["C434", "Dịch vụ tour đang gặp lỗi cơ sở dữ liệu"],
    ["C435", "Gặp lỗi trong lúc xác lập trạng thái theo dõi"],
    ["C436", "Không thay đổi trạng thái theo dõi khi bạn đang là người tạo"],

    ["C510", "Hóa đơn không tồn tại"],
    ["C511", "Hóa đơn thêm vào bị lỗi"],
    ["C512", "Hóa đơn sửa đang gặp lỗi cập nhật"],
    ["C513", "Hóa đơn xóa thất bại"],
    ["C514", "Hóa đơn đang gặp lỗi cơ sở dữ liệu"],
    ["C515", "Tour không còn đủ số vé"],
    ["C515-m", "Dịch vụ không còn đủ số vé, hủy yêu cầu đặt"],
    ["C516", "Hóa đơn đã hủy"],
    ["C517", "Tour đang hoạt động"],
    ["C518", "Tour đã hoàn thành"],
    ["C519", "Tour đã hủy"],
    ["C520", "Không thể tự đổi sang trạng thái hoàn thành"],
    ["C521", "Thanh toán tự động thất bại"],
    ["C522", "Yêu cầu đã được tạo, vui lòng vào mục quản lý hóa đơn để thanh toán"],

    ["C600", "Tin nhắn không tồn tại"],
    ["C601", "Tin nhắn thêm vào bị lỗi"],
    ["C602", "Tin nhắn lỗi cập nhật"],
    ["C603", "Tin nhắn xóa thất bại"],
    ["C604", "Tin nhắn lỗi cơ sở dữ liệu"],

    ["C700", "Thông báo không tồn tại"],
    ["C701", "Thông báo thêm vào bị lỗi"],
    ["C702", "Thông báo lỗi cập nhật"],
    ["C703", "Thông báo xóa thất bại"],
    ["C704", "Thông báo lỗi cơ sở dữ liệu"],

    ["C610", "Tour comment không tồn tại"],
    ["C611", "Tour comment thêm vào bị lỗi"],
    ["C612", "Tour comment sửa đang gặp lỗi cập nhật"],
    ["C613", "Tour comment xóa thất bại"],
    ["C614", "Tour comment đang gặp lỗi cơ sở dữ liệu"],

    ["C900", "Ảnh không tồn tại"],
    ["C901", "Ảnh thêm vào bị lỗi"],
    ["C902", "Ảnh lỗi cập nhật"],
    ["C903", "Ảnh xóa thất bại"],
    ["C904", "Ảnh lỗi cơ sở dữ liệu"],

    ["C1114", "Lấy danh sách thất bại"],
    
  ]);

  export function getViErrMessagePhase(key: string): string {
    return ERR_MESSAGE_CODE_VI.get(key) ?? "";
  }

  export function getViMessagePhase(key: string): string {
    return SUCCESS_MESSAGE_CODE_VI.get(key) ?? "";
  }

export const SUCCESS_MESSAGE_CODE_EN: Map<string, string> = new Map([
    ["I000", "Login success"],
    ["I001", "Token has been renewed"],
    ["I010", "Account can be created"],
    ["I010a", "Account has been registered"],
    ["I010b", "Account's exist"],
    ["I011", "Account's information change successfully"],
    ["I012", "Account's password change successfully"],

    ["I111", "Passenger Car add ok"],
    ["I112", "Passenger Car update ok"],
    ["I113", "Passenger Car delete ok"],

    ["I121", "Air plane branch add ok"],
    ["I122", "Air plane branch update ok"],
    ["I123", "Air plane branch delete ok"],

    ["I211", "Hotel branch add ok"],
    ["I212", "Hotel branch update ok"],
    ["I213", "Hotel branch delete ok"],

    ["I221", "Home stay branch add ok"],
    ["I222", "Home stay branch update ok"],
    ["I223", "Home stay branch delete ok"],

    ["I311", "Restaurant branch add ok"],
    ["I312", "Restaurant branch update ok"],
    ["I313", "Restaurant branch delete ok"],

    ["I411", "Tourish plan add ok"],
    ["I412", "Tourish plan update ok"],
    ["I413", "Tourish plan delete ok"],
    ["I415", "Interest has been set"],
    ["I416", "Interest has been canceled"],

    ["I421", "Tourish category add ok"],
    ["I422", "Tourish category update ok"],
    ["I423", "Tourish category delete ok"],

    ["I431", "Service add ok"],
    ["I432", "Service update ok"],
    ["I433", "Service delete ok"],

    ["I511", "Receipt add ok"],
    ["I512", "Receipt update ok"],
    ["I513", "Receipt delete ok"],
    ["I514", "Payment has been completed successfully"],

    ["I601", "Message add ok"],
    ["I602", "Message update ok"],
    ["I603", "Message delete ok"],

    ["I701", "Notification add ok"],
    ["I702", "Notification update ok"],
    ["I703", "Notification delete ok"],
    ["I704", "Save FCM token successfully"],

    ["I811", "Tour comment add ok"],
    ["I812", "Tour comment update ok"],
    ["I813", "Tour comment delete ok"],

    ["I911", "Image add ok"],
    ["I912", "Image update ok"],
    ["I913", "Image delete ok"],
    
  ]);

  export const SUCCESS_MESSAGE_CODE_VI: Map<string, string> = new Map([
    ["I000", "Đăng nhập thành công"],
    ["I001", "Token đã được làm mới"],
    ["I010", "Tài khoản đã được tạo, vui lòng truy cập địa chỉ mail của bạn để xác nhận tài khoản"],
    ["I010a", "Yêu cầu đã được gửi, vui lòng truy cập địa chỉ mail của bạn để xác nhận tài khoản"],
    ["I010b", "Tài khoản có tồn tại"],
    ["I011", "Thay đổi thông tin tài khoản thành công"],
    ["I012", "Thay đổi mật khẩu tài khoản thành công"],

    ["I111", "Đối tác thêm thành công"],
    ["I112", "Đối tác cập nhật thành công"],
    ["I113", "Đối tác xóa thành công"],

    ["I121", "Đối tác thêm thành công"],
    ["I122", "Đối tác cập nhật thành công"],
    ["I123", "Đối tác xóa thành công"],

    ["I211", "Đối tác thêm thành công"],
    ["I212", "Đối tác cập nhật thành công"],
    ["I213", "Đối tác xóa thành công"],

    ["I221", "Đối tác thêm thành công"],
    ["I222", "Đối tác cập nhật thành công"],
    ["I223", "Đối tác xóa thành công"],

    ["I311", "Đối tác thêm thành công"],
    ["I312", "Đối tác cập nhật thành công"],
    ["I313", "Đối tác xóa thành công"],

    ["I411", "Tour thêm thành công, vui lòng bổ sung thêm thông tin ở ngoài danh sách"],
    ["I412", "Tour cập nhật thành công"],
    ["I413", "Tour xóa thành công"],
    ["I415", "Trạng thái theo dõi đã được thiết lập"],
    ["I416", "Trạng thái theo dõi đã được hủy"],

    ["I421", "Thể loại tour thêm thành công"],
    ["I422", "Thể loại tour cập nhật thành công"],
    ["I423", "Thể loại tour xóa thành công"],

    ["I431", "Dịch vụ tour thêm thành công"],
    ["I432", "Dịch vụ tour cập nhật thành công"],
    ["I433", "Dịch vụ tour xóa thành công"],
    ["I435", "Trạng thái theo dõi đã được thiết lập"],

    ["I510", "Có thể thanh toán"],
    ["I511", "Hóa đơn thêm thành công"],
    ["I512", "Hóa đơn cập nhật thành công"],
    ["I513", "Hóa đơn xóa thành công"],
    ["I514", "Thanh toán qua PayOs thành công"],

    ["I601", "Tin nhắn thêm thành công"],
    ["I602", "Tin nhắn cập nhật thành công"],
    ["I603", "Tin nhắn xóa thành công"],

    ["I701", "Thông báo thêm thành công"],
    ["I702", "Thông báo cập nhật thành công"],
    ["I703", "Thông báo xóa thành công"],
    ["I704", "Lưu FCM token thành công"],

    ["I811", "Tour comment thêm thành công"],
    ["I812", "Tour comment cập nhật thành công"],
    ["I813", "Tour comment xóa thành công"],

    ["I911", "Ảnh thêm thành công"],
    ["I912", "Ảnh cập nhật thành công"],
    ["I913", "Ảnh xóa thành công"],
  ]);
