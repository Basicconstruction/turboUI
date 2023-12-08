export class UserTask{
  constructor(public task: TaskType, public id: number) {
  }
}
export enum TaskType{
  edit,
  asContext,
  delete
}
