export interface DallImage{
  revised_prompt:string,
  url:string,
  b64_json:string
}
export interface ImageList{
  dataId: number;
  images: DallImage[]
}
