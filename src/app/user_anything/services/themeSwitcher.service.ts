import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {NzMessageService} from "ng-zorro-antd/message";
import {themes} from "../../share/themes/theme";

@Injectable()
export class ThemeSwitcherService{
  theme: string = 'next-light';
  constructor(private http: HttpClient,private message: NzMessageService) {
  }
  public load(theme: string | undefined){
    let themePath = this.getThemePath(theme);
    this.updateThemeLink(themePath).then(r => {
      this.message.success("应用主题成功");
    });
  }
  public getThemePath(theme: string | undefined): string{
    let index = themes.findIndex(m=>m===theme);
    if(index===-1){
      return this.getThemePath('next-light');
    }
    return `assets/css/theme-${theme}.css`;
  }
  private updateThemeLink(themePath: string): Promise<void> {
    let old = document.querySelector('style[theme]');
    return new Promise((resolve, reject) => {
      this.http.get(themePath, {responseType: 'text'})
        .subscribe(
          {
            next: (styleContent: string) => {
              if(old!=null){
                document.head.removeChild(old!);
              }
              let styleElement = document.createElement('style');
              styleElement!.setAttribute('type', 'text/css');
              styleElement!.setAttribute("theme","")
              styleElement!.appendChild(document.createTextNode(styleContent));
              document.head.appendChild(styleElement);
              resolve();
            },
            error: (error) => {
              reject(error);
            }
          }
        );
    });
  }
}
