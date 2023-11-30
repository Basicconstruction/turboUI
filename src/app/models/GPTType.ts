export enum GPTType {
  ChatStream,
  Image,
  Speech,        // file
  Transcriptions, // file
  NotCareRequest,// 用于区分上下文，只有chatStream使用上下文
  ImageRequest,
  SpeechRequest,
  TranscriptionRequest
}
