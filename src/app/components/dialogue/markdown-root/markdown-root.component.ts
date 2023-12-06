import {AfterViewChecked, Component, ElementRef, Input, ViewChild} from '@angular/core';
import * as hljs from 'highlight.js';
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-markdown-root',
  templateUrl: './markdown-root.component.html',
  styleUrl: './markdown-root.component.css'
})
export class MarkdownRootComponent implements AfterViewChecked{
  constructor(private notification: NzNotificationService) {

  }
  @Input()
  set content(value: string | undefined){
    this._content = value;
  }
  get content(){
    return this._content===undefined?'':this._content;
  }
  private _content: string | undefined;

  @ViewChild("markdownContent",{ read: ElementRef })
  private markdownContent: ElementRef|undefined;
  ngAfterViewChecked(): void {
    this.highlight()
  }
  highlight() {
    if(!this.markdownContent) return;
    // 在视图初始化后，获取 ngx-markdown 组件的实例
    const markdownElement = this.markdownContent.nativeElement;
    const preElements = markdownElement.querySelectorAll('pre');
    preElements.forEach((pre: HTMLElement) => {
      hljs.default.highlightElement(pre); // 使用 highlight.js 对每个 pre 元素进行高亮
      // 检查是否已经存在包含按钮的 div 元素
      const existingCopyDiv = pre.previousElementSibling as HTMLDivElement;
      if (!existingCopyDiv || existingCopyDiv.className !== 'code-block d-flex flex-row-reverse bg-dark') {
        // 创建一个包含按钮的 div 元素
        const copyDiv = document.createElement('div');
        copyDiv.className = 'code-block d-flex flex-row-reverse bg-dark';

        // 创建一个拷贝按钮
        const copyButton = document.createElement('button');
        copyButton.innerText = 'Copy code';
        copyButton.classList.add("border-0");
        copyButton.classList.add("text-white");
        copyButton.classList.add("bg-transparent");
        copyButton.style.fontSize = "12px";
        copyButton.style.padding = "6px 10px";
        copyButton.addEventListener('click', () => {
          const text : string | undefined = (existingCopyDiv.nextElementSibling?.nextElementSibling as HTMLPreElement).innerText;
          // const text : string | undefined = pre.innerText;
          if(text===undefined) return;
          // 处理拷贝逻辑
          navigator.clipboard.writeText(text)
            .then(() => {
              // 拷贝成功的逻辑
              this.notification.create(
                'success',
                '复制成功','',{nzClass: 'rounded-5'}
              );
            })
            .catch(err => {
              // 处理拷贝失败的逻辑
              console.error('Failed to copy:', err);
            });
        });

        // 将按钮添加到 div 元素中
        copyDiv.appendChild(copyButton);

        // 将包含按钮的 div 元素插入到每个 <pre> 元素的前面
        markdownElement.insertBefore(copyDiv, pre);
      }
      pre.style.padding = '12px 5px';
    });
  }


}
