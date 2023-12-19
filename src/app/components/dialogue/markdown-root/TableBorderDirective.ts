import {Directive, ElementRef, Renderer2, AfterViewInit, AfterViewChecked} from '@angular/core';

@Directive({
  selector: 'markdown'
})
export class TableBorderDirective implements AfterViewChecked {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngAfterViewChecked(): void {
    const tables = this.el.nativeElement.querySelectorAll('table');
    tables.forEach((table:any) => {
      let t = table as HTMLTableElement;
      if(t.classList.length===0){
        t.classList.add("table");
        t.classList.add("table-sm");
        t.classList.add("table-stripped");
        t.classList.add("table-bordered");
      }
    });
  }
}
