export class DallImageModel{
  constructor(public revised_prompt:string,
              public url:string,
              public b64_json:string) {
  }
}
export class DallImageListModel{
  constructor(public dataId:number, public imageList: DallImageModel[]){

  }
}
