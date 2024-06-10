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
  ["I412", " đã cập nhật tour: "],
  ["I413", " đã xóa tour: "],

  ["I421", "Thể loại tour thêm thành công"],
  ["I422", "Thể loại tour cập nhật thành công"],
  ["I423", "Thể loại tour xóa thành công"],

  ["I431", " đã thêm dịch vụ: "],
  ["I432", " đã cập nhật dịch vụ: "],
  ["I433", " đã xóa dịch vụ: "],

  ["I511", " đã thanh toán cho sản phẩm dịch vụ: "],
]);
