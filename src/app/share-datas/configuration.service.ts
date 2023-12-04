import {Inject, Injectable} from "@angular/core";
import {Db, DbService} from "./db.service";
import {
  ChatStreamConfigurationModel,
  Configuration,
  ConfigurationModel,
  ImageConfigurationModel,
  RequestType
} from "../models";
import {
  DisplayConfigurationModel,
  SpeechConfigurationModel,
  TranscriptionConfigurationModel
} from "../models/configuration.model";

@Injectable()
export class ConfigurationService {
    public configuration: ConfigurationModel | undefined;

    constructor(@Inject(Db) private dbService: DbService) {
        this.init();
    }

    public async init() {
        this.configuration = await this.getConfiguration()
    }
    public default_configuration(){
        return new ConfigurationModel(
            "gpt-3.5-turbo-0613",
            RequestType.Chat,
            new ChatStreamConfigurationModel(
                ["gpt-3.5-turbo-1106",
                  "gpt-3.5-turbo",
                  "gpt-3.5-turbo-16k",
                  "gpt-3.5-turbo-instruct",
                  "gpt-4-1106-preview",
                  "gpt-4-vision-preview",
                  "gpt-4",
                  "gpt-4-0613",
                  "gpt-4-32k",
                  "gpt-4-32k-0613",],
                6,
                0.6,
              0.6,
              4000,
                0.6,
                0.6
            ),
            new ImageConfigurationModel(
                ["dall-e-3"],
                1,
                "1024x1024",
              "url",
              "hd",
              "natural"
            ),
            new SpeechConfigurationModel(
              ["tts-1-hd","tts-1"],
              "alloy",
              "mp3",
              1
            ),
            new TranscriptionConfigurationModel(
              ["whisper-1"],
            ),
            new DisplayConfigurationModel(
              "14"
            ),
            "http://localhost:8888",
            "",
            "",
            ""
        );
    }
    async getConfiguration(): Promise<ConfigurationModel> {
        let configuration = await this.dbService.getConfiguration();
        if (!configuration) {
            console.log("return default")
            // 默认配置
            return this.default_configuration();
        }

        const chatConfig = new ChatStreamConfigurationModel(
            configuration.chatConfiguration.models,
            configuration.chatConfiguration.historySessionLength,
            configuration.chatConfiguration.top_p,
            configuration.chatConfiguration.temperature,
            configuration.chatConfiguration.max_tokens,
            configuration.chatConfiguration.presence_penalty,
            configuration.chatConfiguration.frequency_penalty,
            configuration.chatConfiguration.detail,
        );

        const imageConfig = new ImageConfigurationModel(
            configuration.imageConfiguration.models,
            configuration.imageConfiguration.n,
            configuration.imageConfiguration.size,
          configuration.imageConfiguration.response_format,
          configuration.imageConfiguration.quality,
          configuration.imageConfiguration.style
        );
        const speechConfig = new SpeechConfigurationModel(
          configuration.speechConfiguration.models,
          configuration.speechConfiguration.voice,
          configuration.speechConfiguration.response_format,
          configuration.speechConfiguration.speed
        );
        const transcription = new TranscriptionConfigurationModel(
          configuration.transcriptionConfiguration.models,
          configuration.transcriptionConfiguration.temperature,
          configuration.transcriptionConfiguration.language
        );
        const display = new DisplayConfigurationModel(
          configuration.displayConfiguration.fontSize
        );
        return new ConfigurationModel(
            configuration.model,
            configuration.requestType,
            chatConfig,
            imageConfig,
            speechConfig,
            transcription,
            display,
            configuration.endpoint,
          configuration.accessKey,
          configuration.baseUrl,
          configuration.apiKey
        );
    }
    async setConfigurationLocal(){
        await this.setConfiguration(this.configuration!);
    }
    async setConfiguration(configuration: ConfigurationModel) {
        if (!configuration) return;
        let config: Configuration = {
            model: configuration.model,
            requestType: configuration.requestType,
            chatConfiguration: {
                models: configuration.chatConfiguration.models,
                top_p: configuration.chatConfiguration.top_p,
                temperature: configuration.chatConfiguration.temperature,
                max_tokens: configuration.chatConfiguration.max_tokens,
                presence_penalty: configuration.chatConfiguration.presence_penalty,
                frequency_penalty: configuration.chatConfiguration.frequency_penalty,
                historySessionLength: configuration.chatConfiguration.historySessionLength,
                detail: configuration.chatConfiguration.detail
            },
            imageConfiguration: {
                models: configuration.imageConfiguration.models,
                n: configuration.imageConfiguration.n,
                size: configuration.imageConfiguration.size,
                response_format: configuration.imageConfiguration.response_format,
                quality: configuration.imageConfiguration.quality,
                style: configuration.imageConfiguration.style
            },
            speechConfiguration: {
              models: configuration.speechConfiguration.models,
              voice: configuration.speechConfiguration.voice,
              response_format: configuration.speechConfiguration.response_format,
              speed: configuration.speechConfiguration.speed
            },
            transcriptionConfiguration:{
              models: configuration.transcriptionConfiguration.models,
              temperature: configuration.transcriptionConfiguration.temperature,
              language: configuration.transcriptionConfiguration.language
            },
            displayConfiguration:{
              fontSize: configuration.displayConfiguration.fontSize
            },
            endpoint: configuration.endpoint,
            accessKey: configuration.accessKey,
            baseUrl: configuration.baseUrl,
            apiKey: configuration.apiKey
        };
        return await this.dbService.setConfiguration(config);
    }

    async restoreConfiguration() {
        this.configuration = this.default_configuration();
        await this.setConfigurationLocal();
    }
}
