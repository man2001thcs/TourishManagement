export interface Restaurant {
  id?: string;
  placeBranch: string;
  hotlineNumber: string;
  supportEmail: string;
  headQuarterAddress: string;
  discountFloat: number;
  discountAmount: number;
  description: string;

  createDate?: Date;
  updateDate?: Date;
}

export interface HomeStay {
  id?: string;
  placeBranch: string;
  hotlineNumber: string;
  supportEmail: string;
  headQuarterAddress: string;
  discountFloat: number;
  discountAmount: number;
  description: string;

  createDate?: Date;
  updateDate?: Date;
}

export interface Hotel {
  id?: string;
  placeBranch: string;
  hotlineNumber: string;
  supportEmail: string;
  headQuarterAddress: string;
  discountFloat: number;
  discountAmount: number;
  description: string;

  createDate?: Date;
  updateDate?: Date;
}

export interface PassengerCar {
  id?: string;
  branchName: string;
  hotlineNumber: string;
  supportEmail: string;
  headQuarterAddress: string;
  discountFloat: number;
  discountAmount: number;
  description: string;

  createDate?: Date;
  updateDate?: Date;
}

export interface AirPlane {
  id?: string;
  branchName: string;
  hotlineNumber: string;
  supportEmail: string;
  headQuarterAddress: string;
  discountFloat: number;
  discountAmount: number;
  description: string;

  createDate?: Date;
  updateDate?: Date;
}

export interface EatSchedule {
  id?: string;
  tourishPlanId?: string;
  placeName: string;
  address: string;
  supportNumber: string;

  restaurantId: string;
  singlePrice?: number;
  status: number;
  description: string;

  startDate?: Date;
  endDate?: Date;

  createDate?: Date;
  updateDate?: Date;
}

export interface MovingSchedule {
  id?: string;
  tourishPlanId?: string;

  branchName: string;
  driverName: string;
  vehiclePlate: string;
  phoneNumber: string;

  singlePrice?: number;
  vehicleType: number;
  transportId: string;

  startingPlace: string;
  headingPlace: string;
  status: number;
  description: string;

  startDate?: Date;
  endDate?: Date;

  createDate?: Date;
  updateDate?: Date;
}

export interface StayingSchedule {
  id?: string;
  tourishPlanId?: string;
  placeName: string;
  address: string;
  supportNumber: string;

  restHouseType: number;
  restHouseBranchId: string;

  singlePrice?: number;
  status: number;
  description: string;

  startDate?: Date;
  endDate?: Date;

  createDate?: Date;
  updateDate?: Date;
}

export interface Author {
  id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  description: string;
  createDate: string;
  updateDate: string;
}

export interface TourishCategory {
  id?: string;
  name: string;
  description: string;
  createDate?: Date;
  updateDate?: Date;
}

export interface TourishPlan {
  id?: string;
  tourName: string;
  startingPoint: string;
  endPoint: string;

  supportNumber: string;
  totalTicket: number;
  remainTicket: number;
  planStatus: number;
  description: string;

  createDate?: string;
  updateDate?: string;

  startDate: string;
  endDate: string;

  tourishCategories?: TourishCategory[];
  stayingSchedules?: StayingSchedule[];
  eatSchedules?: EatSchedule[];
  movingSchedules?: MovingSchedule[];
}

export interface TotalReceipt {
  totalReceiptId?: string;
  tourishPlanId: string;
  completeDate: string;

  description: string;
  status: number;
  fullReceiptList: FullReceipt[];

  tourishPlan?: TourishPlan;
}

export interface FullReceipt {
  fullReceiptId?: string;
  totalReceiptId?: string;
  guestName: string;
  originalPrice: number;
  totalTicket: number;
  tourishPlanId: string;
  completeDate?: string;
  phoneNumber: string;
  email: string;
  discountFloat: number;
  discountAmount: number;

  createDate?: string;
  description: string;
  status: number;

  totalReceipt?: TotalReceipt;
}

export interface User {
  id?: string;
  userName?: string;
  password?: string;
  role: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;

  createDate?: string;
}
