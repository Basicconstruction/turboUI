import {Injectable, InjectionToken} from "@angular/core";
export const auth = new InjectionToken("auth");
@Injectable()
export class AuthService {
    private isLoggedIn = false;
    constructor() {}

    // 检查登录状态
    get isLogin(): boolean {
        return this.isLoggedIn;
    }

    // 登录
    login(): void {
        this.isLoggedIn = true;
    }

    // 注销
    logout(): void {
        this.isLoggedIn = false;
    }
}
