export enum ChatHistoryTitleAction{
  Delete,
  Rename
}
export interface ChatHistoryTitleActionInfo {
  action: ChatHistoryTitleAction;
  info: any;
}
export interface ChatHistoryTitleDeleteInfo {
  dataId: number;
}
export interface ChatHistoryTitleRenameInfo {
  dataId: number;
  title: string;
}
