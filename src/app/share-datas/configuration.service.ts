import {Injectable} from "@angular/core";
import {DbService} from "./db.service";
import {Configuration, RequestType} from "../models";

@Injectable({
  providedIn: "root"
})
export class ConfigurationService {
  public configuration: Configuration | undefined;
  private initFinish = false;
  constructor(private dbService: DbService) {
    this.init();
  }

  public async init() {
    await this.waitForInit();
    this.configuration = await this.getConfiguration()
    this.initFinish = true;
  }

  private waitForInit(): Promise<void> {
    return new Promise((resolve) => {
      if (this.dbService.initFinish) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (this.dbService.initFinish) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
  }

  public async accept() {
    if (this.configuration !== undefined) {
      return true;
    } else {
      await this.waitThisInit();
      return true;
    }
  }
  private async waitThisInit(): Promise<void> {
    return new Promise((resolve) => {
      if (this.initFinish) {
        resolve();
      } else {
        const interval = setInterval(() => {
          if (this.initFinish) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      }
    });
  }

  public default_configuration():Configuration {
    return {
      model: "gpt-3.5-turbo-0613",
      requestType: RequestType.Chat,
      chatConfiguration:{
        models: [
          "gpt-3.5-turbo-1106",
          "gpt-3.5-turbo",
          "gpt-3.5-turbo-16k",
          "gpt-3.5-turbo-instruct",
          "gpt-4-1106-preview",
          "gpt-4-vision-preview",
          "gpt-4",
          "gpt-4-0613",
          "gpt-4-32k",
          "gpt-4-32k-0613",
        ],historySessionLength: 10,
        top_p: 0.6,
        temperature: 0.6,
        max_tokens: 4000,
        presence_penalty: 0.6,
        frequency_penalty: 0.6
      },
      imageConfiguration: {
        models: [
          "dall-e-3"
        ],
        n: 1,
        size: "1024x1024",
        response_format: "url",
        quality: "hd",
        style: "natural",
      },
      speechConfiguration: {
        models: ["tts-1-hd", "tts-1"],
        voice: "alloy",
        response_format: "mp3",
        speed: 1,
      },
      transcriptionConfiguration:{
        models: ["whisper"]
      },
      displayConfiguration:{
        fontSize: "14"
      },
      endpoint: "http://localhost:8888",
      accessKey: "",
      baseUrl: "",
      apiKey: ""
    };
  }

  async getConfiguration(): Promise<Configuration | undefined> {
    return await this.dbService.getConfiguration();
  }

  async setConfigurationLocal() {
    await this.setConfiguration(this.configuration!);
  }

  async setConfiguration(configuration: Configuration) {
    if (!configuration) return;
    return await this.dbService.setConfiguration(configuration);
  }

  async restoreConfiguration() {
    this.configuration = this.default_configuration();
    await this.setConfigurationLocal();
  }


}
