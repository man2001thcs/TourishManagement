
export interface FileModel {
  id: string;
  accessSourceId: string;
  fileType: string;
  createdDate: string;
  resourceType: number;
}

export interface InterestModalParam {
  resourceId: string;
  resourceType: string;
  title: string;
  isNotify: boolean;
}