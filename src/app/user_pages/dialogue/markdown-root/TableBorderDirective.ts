import {Directive, ElementRef, AfterViewChecked} from '@angular/core';

@Directive({
  selector: 'markdown',
  standalone: true
})
export class TableBorderDirective implements AfterViewChecked {
  constructor(private el: ElementRef) {}
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
