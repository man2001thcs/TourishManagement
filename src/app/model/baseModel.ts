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

export interface RestHouseContact {
  id?: string;
  placeBranch: string;
  restHouseType: number;
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
  restHouseType: number;
  hotlineNumber: string;
  supportEmail: string;
  headQuarterAddress: string;
  discountFloat: number;
  discountAmount: number;
  description: string;

  createDate?: Date;
  updateDate?: Date;
}

export interface MovingContact {
  id?: string;
  branchName: string;
  vehicleType: number;
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

  name?: string;
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

  serviceScheduleList?: TourishSchedule[];
  scheduleInterestList?: ScheduleInterest[];
}

export interface ScheduleInterest {
  id: string;
  movingScheduleId?: string;
  stayingScheduleId?: string;
  userId: string;
  interestStatus: number;
  createDate?: string;
  updateDate?: string;
}

export interface StayingSchedule {
  id?: string;
  tourishPlanId?: string;
  name?: string;
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

  serviceScheduleList?: TourishSchedule[];
  scheduleInterestList?: ScheduleInterest[];
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

export interface TourishCategoryRelation {
  tourishCategory: TourishCategory;
  tourishPlan?: TourishPlan;
  id?: string;
  tourishPlanId?: string;
}

export interface TourishCategory {
  id?: string;
  name: string;
  description: string;
  createDate?: Date;
  updateDate?: Date;
}

export interface Instruction {
  id?: string;

  instructionType: number;
  description: string;

  tourishPlanId?: string;
  movingScheduleId?: string;
  stayingdScheduleId?: string;

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

  tourishCategoryRelations?: TourishCategoryRelation[];
  tourishCategories?: TourishCategory[];
  stayingSchedules?: StayingSchedule[];
  eatSchedules?: EatSchedule[];
  movingSchedules?: MovingSchedule[];
  tourishScheduleList?: TourishSchedule[];

  instructionList?: Instruction[];
}

export interface TourishInterest {
  id: string;
  tourishPlanId: string;
  userId: string;
  interestStatus: number;
  createDate?: string;
  updateDate?: string;
}

export interface TourishSchedule {
  id?: string;
  tourishPlanId?: string;
  movingScheduleId?: string;
  stayingScheduleId?: string;
  planStatus: number;
  startDate: Date;
  endDate: Date;
  createDate?: Date;
  updateDate?: Date;
}

export interface TourishComment {
  id: string;
  userId: string;
  userName: string;
  tourishPlanId: string;
  content?: string;
  createDate: string;
  updateDate: string;
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

export interface SaveFile {
  id?: string;
  accessSourceId: string;
  resourceType: number;
  fileType: string;
  createDate: string;
}

export interface FullReceipt {
  fullReceiptId?: string;
  totalReceiptId?: string;
  guestName: string;
  originalPrice: number;
  totalTicket: number;
  totalChildTicket: number;
  tourishPlanId?: string;
  scheduleId?: string;
  scheduleType?: number;
  completeDate?: string;
  phoneNumber: string;
  email: string;
  discountFloat: number;
  discountAmount: number;

  createDate?: string;
  description: string;
  status: number;

  tourishScheduleId?: string;
  tourishSchedule?: TourishSchedule;
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

export interface Notification {
  id?: string;
  userCreateId: string;
  userReceiveId?: string;
  content: string;
  contentCode?: string;
  creatorFullName?: string;
  connectionId?: string;
  objectName?: string;
  isRead: boolean;
  isDeleted: boolean;
  createDate?: string;
  updateDate?: string;

  // Relationships
  userCreator?: User;
  userReceiver?: User;
  tourishPlan?: TourishPlan;
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface GuestMessage {
  id?: string;
  groupId?: string;
  content: string;
  isRead?: boolean;
  isDeleted?: boolean;
  state?: number;
  createDate?: string;
  updateDate?: string;

  // 1: Sender, 2: Receiver
  side?: number;
  guestMessageConId?: string;
}

export interface GuestMessageCon {
  id: string;

  guestConHisId: string;

  // Guest
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: string;

  connectionID: string;
  userAgent: string;
  connected: boolean;
  createDate: Date;

  admin?: User;
  guestMessageConHis: GuestMessageConHistory;
  guestMessages: GuestMessage[];
}

export interface AdminMessageCon {
  id: string;

  guestConHisId: string;

  // Or admin
  adminId: string;
  adminFullName: string;

  connectionID: string;
  userAgent: string;
  connected: boolean;
  createDate: Date;

  guestMessageConHis: GuestMessageConHistory;
  guestMessages: GuestMessage[];
}

export interface GuestMessageConHistory {
  id: string;
  guestConId: string;
  adminConId: string;
  createDate: Date;
  guestMessageCon: GuestMessageCon;
  adminMessageCon: AdminMessageCon;
  guestMessages?: GuestMessage[];
  status: number;
}

export interface PriceRange {
  startPrice: number;
  endPrice: number;
}

export interface ChartConfig {
  chart: {
    type?: string;
    plotBorderWidth?: number;
    plotShadow?: boolean;
  };
  title: {
    text: string;
  };
  subtitle?: {
    text: string;
  };
  xAxis?: {
    categories: string[];
    crosshair?: boolean;
  };
  yAxis?: {
    min?: number;
    title: {
      text: string;
    };
  };
  tooltip: {
    headerFormat?: string;
    pointFormat?: string;
    footerFormat?: string;
    valueSuffix?: string;
    shared?: boolean;
    useHTML?: boolean;
  };
  plotOptions?: {
    pie?: any;
    column?: {
      pointPadding: number;
      borderWidth: number;
    };
  };
  series: {
    type?: string;
    name: string;
    data: any;
  }[];
}
