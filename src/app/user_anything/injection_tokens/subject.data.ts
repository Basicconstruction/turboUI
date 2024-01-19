import {InjectionToken} from "@angular/core";

export const chatSessionSubject = new InjectionToken("chat-session-subject");
export const backChatHistorySubject = new InjectionToken("back-chat-history-subject");
export const configurationChangeSubject = new InjectionToken("configuration-change");
export const systemPromptChangeSubject = new InjectionToken("system-prompt");
