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
  ["/admin/notification/list", "10th"],
  ["/admin/notification/list", "11th"],
  ["/admin/transport/service/list", "12th"],
  ["/admin/resthouse/service/list", "13th"],
  ["/admin/moving/receipt/list", "14th"],
  ["/admin/staying/receipt/list", "15th"]
]);

const USER_HEADER_CODE: Map<string, string> = new Map([
  ["/user/service-search-page", "1st"],
  ["/user/service-search-page", "2nd"],

  ["/user/receipt/list", "3rd"],
  ["/user/receipt/list?active=0", "3rd"],
  ["/user/receipt/list?active=1", "3rd"],
  ["/user/receipt/list?active=2", "3rd"],
  ["/user/receipt/list?active=3", "3rd"],

  ["/user/moving/receipt/list", "4th"],
  ["/user/moving/receipt/list?active=0", "4th"],
  ["/user/moving/receipt/list?active=1", "4th"],
  ["/user/moving/receipt/list?active=2", "4th"],
  ["/user/moving/receipt/list?active=3", "4th"],
  
  ["/user/staying/receipt/list", "5th"],
  ["/user/staying/receipt/list?active=0", "5th"],
  ["/user/staying/receipt/list?active=1", "5th"],
  ["/user/staying/receipt/list?active=2", "5th"],
  ["/user/staying/receipt/list?active=3", "5th"]
]);

export function getAdminHeaderPhase(key: string): string {
  return ADMIN_HEADER_CODE.get(key) ?? "";
}

export function getUserHeaderPhase(key: string): string {
  return USER_HEADER_CODE.get(key) ?? "";
}
