const HEADER_CODE: Map<string, string> = new Map([
  ["/admin/dash-board", "0th"],
  ["/admin/tourish-plan/list", "1st"],
  ["/admin/tourish-plan/create", "2nd"],
  ["/admin/tour/category/list", "3rd"],
  ["/admin/transport/moving-contact/list", "4th"],
  ["/admin/resthouse/rest-house-contact/list", "5th"],
  ["/admin/restaurant/list", "6th"],
  ["/admin/receipt/list", "7th"],
  ["/admin/user/list", "8th"],
  ["/admin/chat/list", "9th"],
  ["/admin/notification/list", "10th"],
  ["/admin/notification/list", "11th"],
  ["/admin/transport/service/list", "12th"],
  ["/admin/resthouse/service/list", "13th"]
]);

export function getHeaderPhase(key: string): string {
  return HEADER_CODE.get(key) ?? "";
}
