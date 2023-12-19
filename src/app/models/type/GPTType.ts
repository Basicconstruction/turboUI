export enum ShowType{
  staticChatRequest,
  staticVisionRequest,
  staticImageRequest,
  staticSpeechRequest,
  staticTranscriptionRequest,

  staticChat,// 包含static vision的请求和响应(已经完成的)
  staticVision,
  staticImage,
  staticSpeech,
  staticTranscription,

  promiseChat,
  promiseVision,
  promiseImage,
  promiseSpeech,
  promiseTranscription
}
// 用于储存当前的状态，用于发起请求时区分
export enum RequestType{
  Chat,
  ChatVision,
  Image,
  Speech,
  Transcription,// 包含翻译和转录
}
