import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: "htmlSanitizer"
})
export class EscapeHtmlPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if(value===undefined) return '';
    const segments:string[] = [];
    const regex = /(```.*?```)/gs; // 匹配 ``` ``` 代码块
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(value)) !== null) {
      const codeStartIndex = match.index;
      const codeEndIndex = regex.lastIndex;
      const precedingText = value.substring(lastIndex, codeStartIndex);
      if (precedingText.trim().length > 0) {
        segments.push(precedingText);
      }
      const codeContent = match[1];
      segments.push(codeContent);
      lastIndex = codeEndIndex;
    }
    const remainingText = value.substring(lastIndex);
    if (remainingText.trim().length > 0) {
      segments.push(remainingText);
    }
    return segments.map(part => {
      if(part.startsWith('```')&&part.endsWith('```')){
        return part;
      }else{
        return part.replaceAll('<','&lt;').replaceAll('>','&gt;');
      }
    }).join('');

  }
}
