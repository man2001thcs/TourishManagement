const HEADER_CODE: Map<string, string> = new Map([
  ["/admin/tourish-plan/list", "1st"],
  ["/admin/tourish-plan/create", "2nd"],
  ["/admin/transport/passenger-car/list", "3rd"],
  ["/admin/transport/air-plane/list", "4th"],
  ["/admin/resthouse/hotel/list", "5th"],
  ["/admin/resthouse/RestHouseContact/list", "6th"],
  ["/admin/restaurant/list", "7th"],
  ["/admin/receipt/list", "8th"],
  ["/admin/user/list", "9th"],
]);

export function getHeaderPhase(key: string): string {
  return HEADER_CODE.get(key) ?? "";
}
