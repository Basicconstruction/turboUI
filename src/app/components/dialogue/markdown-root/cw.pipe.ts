import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  standalone: true,
  name: "cw"
})
export class CwPipe implements PipeTransform {
  transform(value: any): any{
    console.log(value)
    return value;
  }
}
