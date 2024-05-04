import { TourishInterest } from "src/app/model/baseModel";

export interface TourishPlan {
  id?: string;
  publisherId: string;
  title: string;
  pageNumber: string;
  description: string;
  createDate?: Date;
  updateDate?: Date;

  tourishInterestList?: TourishInterest[];
}
