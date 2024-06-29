import { Component } from "@angular/core";

export interface PolicyItem {
  title: string;
  content: string[];
}

@Component({
  selector: "app-policy",
  templateUrl: "./policy.component.html",
  styleUrls: ["./policy.component.css"],
})
export class PolicyPageComponent {
  policyItems: PolicyItem[] = [
    {
      title: "Chính sách Bảo mật",
      content: [
        "Roxanne Tourist cam kết bảo vệ thông tin cá nhân của khách hàng. Chúng tôi có thể thu thập các thông tin cá nhân như tên, địa chỉ email, số điện thoại và thông tin thanh toán để cung cấp dịch vụ cho khách hàng. Thông tin này sẽ được sử dụng nội bộ và không được tiết lộ ra ngoài mà không có sự cho phép của khách hàng.",
        "Chúng tôi sử dụng công nghệ để đảm bảo an toàn thông tin và sẵn sàng hỗ trợ khách hàng trong việc điều chỉnh hoặc xóa bỏ thông tin nếu có yêu cầu từ phía khách hàng.",
      ],
    },
    {
      title: "Sử dụng thông tin",
      content: [
        "Thông tin cá nhân của khách hàng sẽ được sử dụng để cung cấp các dịch vụ đặt phòng khách sạn, vé máy bay và các dịch vụ du lịch khác. Chúng tôi cam kết chỉ sử dụng thông tin này cho các mục đích đã được khách hàng đồng ý và không chia sẻ thông tin với bất kỳ bên thứ ba nào mà không có sự cho phép từ khách hàng.",
        "Roxanne Tourist có thể sử dụng thông tin cá nhân của khách hàng để cải thiện chất lượng dịch vụ và gợi ý các sản phẩm phù hợp hơn dựa trên lịch sử tìm kiếm và đặt phòng của khách hàng.",
      ],
    },
    {
      title: "Điều khoản sử dụng",
      content: [
        "Việc sử dụng trang web Roxanne Tourist đồng nghĩa với việc bạn chấp nhận các điều khoản và điều kiện sau đây. Chúng tôi có quyền thay đổi các điều khoản này mà không cần thông báo trước. Các thay đổi sẽ có hiệu lực ngay khi được công bố trên trang web Roxanne Tourist.",
        "Bằng việc tiếp tục sử dụng trang web Roxanne Tourist, bạn đồng ý tuân thủ các điều khoản và điều kiện sử dụng mới nhất được công bố trên trang web.",
      ],
    },
    {
      title: "Chính sách Hủy đặt phòng",
      content: [
        "Roxanne Tourist có chính sách hủy đặt phòng linh hoạt và rõ ràng. Khách hàng có thể hủy đặt phòng mà không bị áp đặt các khoản phí hủy nếu thực hiện đúng thời gian quy định.",
        "Cụ thể, các chính sách hủy đặt phòng của Roxanne Tourist sẽ được quy định rõ ràng trên từng sản phẩm khi khách hàng đặt phòng.",
      ],
    },
    {
      title: "Bảo hành giá tốt nhất",
      content: [
        "Roxanne Tourist cam kết bảo đảm giá tốt nhất cho các sản phẩm du lịch. Nếu khách hàng tìm thấy giá thấp hơn từ các nhà cung cấp khác trong khoảng thời gian đặt phòng, chúng tôi sẽ áp dụng giá thấp nhất đó cho khách hàng.",
        "Điều này giúp khách hàng yên tâm về giá cả và sự hài lòng với dịch vụ của chúng tôi.",
      ],
    },
    {
      title: "Chính sách bảo mật thông tin thanh toán",
      content: [
        "Roxanne Tourist sử dụng các phương thức thanh toán an toàn và đảm bảo. Chúng tôi không lưu trữ thông tin thẻ thanh toán của khách hàng trên hệ thống của chúng tôi.",
        "Mọi giao dịch thanh toán đều được mã hóa để đảm bảo an toàn tuyệt đối cho thông tin cá nhân của khách hàng.",
      ],
    },
  ];
}
