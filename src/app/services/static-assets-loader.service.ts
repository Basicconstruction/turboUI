import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StaticAssetsLoaderService {
  constructor(private http: HttpClient) {
  }
  // 编译后才能用，要求在angular.json 中引入js,css
  // 在 assets （和对应组件中加载）中也添加和导入，编译之前取消导入

  loadStyleSheet(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get(url, {responseType: 'text'})
        .subscribe(
          {
            next: (styleContent: string) => {
              const style = document.createElement('style');
              style.setAttribute('type', 'text/css');
              console.log("数据表内容"+styleContent)
              style.appendChild(document.createTextNode(styleContent));
              document.head.appendChild(style);
              console.log("加载"+url+"成功")
              resolve();
            },
            error: (error) => {
              reject(error);
            }
          }
        );
    });
  }

  loadScript(url: string): Promise<void> {
    return new Promise((resolve) => {
      this.http.get(url, {responseType: 'text'})
        .subscribe(scriptContent => {
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.text = scriptContent;
          document.body.appendChild(script);
          resolve();
        });
    });
  }
}
