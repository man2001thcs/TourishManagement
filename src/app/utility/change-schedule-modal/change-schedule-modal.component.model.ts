export interface FileModel {
  id: string;
  accessSourceId: string;
  fileType: string;
  createdDate: string;
  resourceType: number;
}

export interface InterestModalParam {
  disabled?: boolean;
  tourishPlanId?: string;
  movingScheduleId?: string;
  stayingScheduleId?: string;
}
