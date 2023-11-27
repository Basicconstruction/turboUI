import {Inject, Injectable} from "@angular/core";
import {Db, DbService} from "./db.service";
import {Configuration, ConfigurationModel} from "../models";
import {ChatStreamConfiguration, ImageConfiguration} from "../models/configuration.model";
import {GPTType} from "../models/chat.interface";

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
            GPTType.ChatStream,
            new ChatStreamConfiguration(
                ["gpt-3.5-turbo-0613", "gpt-4-1106"],
                0.6,
                0.6,
                4900,
                0.6,
                0.6,
                6
            ),
            new ImageConfiguration(
                ["dall-e-3"],
                1,
                "1024x1024",
              "url",
              "hd",
              "natural"
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

        const chatConfig = new ChatStreamConfiguration(
            configuration.chatConfiguration.models,
            configuration.chatConfiguration.top_p,
            configuration.chatConfiguration.temperature,
            configuration.chatConfiguration.max_tokens,
            configuration.chatConfiguration.presence_penalty,
            configuration.chatConfiguration.frequency_penalty,
            configuration.chatConfiguration.historySessionLength
        );

        const imageConfig = new ImageConfiguration(
            configuration.imageConfiguration.models,
            configuration.imageConfiguration.n,
            configuration.imageConfiguration.size,
          configuration.imageConfiguration.response_format,
          configuration.imageConfiguration.quality,
          configuration.imageConfiguration.style
        );

        return new ConfigurationModel(
            configuration.model,
            configuration.type,
            chatConfig,
            imageConfig,
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
            type: configuration.type,
            chatConfiguration: {
                models: configuration.chatConfiguration.models,
                top_p: configuration.chatConfiguration.top_p,
                temperature: configuration.chatConfiguration.temperature,
                max_tokens: configuration.chatConfiguration.max_tokens,
                presence_penalty: configuration.chatConfiguration.presence_penalty,
                frequency_penalty: configuration.chatConfiguration.frequency_penalty,
                historySessionLength: configuration.chatConfiguration.historySessionLength,
            },
            imageConfiguration: {
                models: configuration.imageConfiguration.models,
                n: configuration.imageConfiguration.n,
                size: configuration.imageConfiguration.size,
                response_format: configuration.imageConfiguration.response_format,
                quality: configuration.imageConfiguration.quality,
                style: configuration.imageConfiguration.style
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
