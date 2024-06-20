export function getEnNotifyMessagePhase(key: string): string {
  return SUCCESS_MESSAGE_CODE_EN.get(key) ?? "";
}

export function getViNotifyMessagePhase(key: string): string {
  return SUCCESS_MESSAGE_CODE_VI.get(key) ?? "";
}

export const SUCCESS_MESSAGE_CODE_EN: Map<string, string> = new Map([
  ["I411", " added new tour: "],
  ["I412", " has updated tour: "],
  ["I413", " has deleted tour: "],

  ["I421", "Tourish category add ok"],
  ["I422", "Tourish category update ok"],
  ["I423", "Tourish category delete ok"],
]);

export const SUCCESS_MESSAGE_CODE_VI: Map<string, string> = new Map([
  ["I411", " đã thêm tour: "],
  ["I412", " đã cập nhật thông tin cơ bản của tour: "],
  ["I412-schedule", " đã cập nhật lịch trình tour: "],
  ["I412-new-schedule", " đã thêm lịch trình tour: "],
  ["I413", " đã xóa tour: "],

  ["I421", "Thể loại tour thêm thành công"],
  ["I422", "Thể loại tour cập nhật thành công"],
  ["I423", "Thể loại tour xóa thành công"],

  ["I431", " đã thêm dịch vụ: "],
  ["I432", " đã cập nhật thông tin cơ bản của dịch vụ: "],
  ["I432-schedule", " đã cập nhật lịch trình của dịch vụ: "],
  ["I432-new-schedule", " đã thêm lịch trình của dịch vụ: "],
  ["I433", " đã xóa dịch vụ: "],

  ["I511-user-create", " đã tạo đơn thanh toán cho sản phẩm dịch vụ: "],
  ["I511-user-await", " đã chuyển hóa đơn sang trạng thái thanh toán: "],
  ["I511-user-cancel", " đã hủy đơn thanh toán cho sản phẩm dịch vụ: "],
  ["I511-user-complete", " đã hoàn tấtthanh toán cho sản phẩm dịch vụ: "],

  ["I511-admin-create", " đã tạo đơn thanh toán cho sản phẩm dịch vụ: "],
  ["I511-admin-await", " đã xác nhận và chuyển sang trạng thái chờ thanh toán cho hóa đơn: "],
  ["I511-admin-cancel", " đã hủy đơn thanh toán cho sản phẩm dịch vụ: "],
  ["I511-admin-complete", " đã hoàn tất thanh toán cho sản phẩm dịch vụ: "],
]);
