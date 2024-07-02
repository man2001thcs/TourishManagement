const ADMIN_HEADER_CODE: Map<string, string> = new Map([
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
  ["/admin/chat/display", "10th"],
  ["/admin/notification/list", "11th"],
  ["/admin/transport/service/list", "12th"],
  ["/admin/resthouse/service/list", "13th"],
  ["/admin/moving/receipt/list", "14th"],
  ["/admin/staying/receipt/list", "15th"]
]);

const USER_HEADER_CODE: Map<string, string> = new Map([
  ["/user/service-search-page?serviceType=moving", "1st"],
  ["/user/service-search-page?serviceType=staying", "2nd"],
  ["/user/receipt/list", "3rd"],
  ["/user/moving/receipt/list", "4th"],
  ["/user/staying/receipt/list", "5th"],
]);

export function getAdminHeaderPhase(key: string): string {
  return ADMIN_HEADER_CODE.get(key) ?? "";
}

export function getUserHeaderPhase(key: string): string {
  return USER_HEADER_CODE.get(key) ?? "";
}
