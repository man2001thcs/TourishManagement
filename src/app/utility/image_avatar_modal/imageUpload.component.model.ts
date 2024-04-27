
export interface FileModel {
  id: string;
  accessSourceId: string;
  fileType: string;
  createdDate: string;
  resourceType: number;
}

export interface FileModalParam {
  resourceId: string;
  resourceType: number;
}