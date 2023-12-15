import {Injectable} from "@angular/core";
@Injectable({
  providedIn: "root"
})
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
