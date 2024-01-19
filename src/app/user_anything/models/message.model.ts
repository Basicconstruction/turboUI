export interface Message{
  role: string,
  content: string
}
export interface VisionMessage{
  role: string,
  content: (TextContent | ImageContent)[]
}
export interface TextContent{
  type: string,
  text: string,
}
export interface ImageContent{
  type: string,
  image_url: LocalImage
}
export interface LocalImage{
  url: string,
  detail?: string
}
