import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from "../../auth";
import {Router} from "@angular/router";
import {auth} from "../../auth/auth.service";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {FileInChat} from "../../models";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent{
  message: string = "登录成功，正在返回";
  constructor(@Inject(auth) private authService: AuthService, private router: Router) {

  }
  fileList: NzUploadFile[] = [];
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  ngOnInit(): void {
    // this.authService.login();
    // if (this.authService.isLogin) {
    //   this.router.navigate(['chat']); // 登录成功后跳转到 /chat 页面
    // }else{
    //   this.message = "自动登录失败";
    // }
  }
  chatFileList: FileInChat[] = [];
  isBase64Image(fileType: string): boolean {
    return fileType.startsWith("image");
  }
  async buildFileList() {
    const promises = this.fileList.map((file) => this.readFile(file));
    await Promise.all(promises);
    console.log(this.chatFileList);
  }

  readFile(file: NzUploadFile): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const isImg = this.isBase64Image(file.type!);
        let fileContent: string | ArrayBuffer | null;
        if (isImg) {
          fileContent = reader.result;
          if (fileContent == null || fileContent instanceof ArrayBuffer) {
            reject(new Error('File content error'));
            return;
          }
        } else {
          fileContent = '';
        }
        const afile: FileInChat = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileContent: fileContent,
        };
        this.chatFileList.push(afile);
        resolve();
      };

      if (file) {
        // @ts-ignore
        reader.readAsDataURL(file);
      }
    });
  }
  async submit() {
    await this.buildFileList();
  }
}
