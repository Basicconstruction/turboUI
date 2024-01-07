import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {AuthModule} from "./auth.module";

@Injectable({
  providedIn: "root"
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token;
    const authReq = req.clone(
      {
        setHeaders:{
          Authorization: `Bearer ${token}`
        }
      }
    );
    return next.handle(authReq);
  }
}
