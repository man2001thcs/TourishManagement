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

  description: string;

  startDate?: Date;
  endDate?: Date;

  createDate?: Date;
  updateDate?: Date;
}

export interface MovingSchedule {
  id?: string;
  tourishPlanId?: string;

  driverName: string;
  vehiclePlate: string;
  phoneNumber: string;

  singlePrice?: number;
  vehicleType: number;
  transportId: string;

  startingPlace: string;
  headingPlace: string;

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
}
