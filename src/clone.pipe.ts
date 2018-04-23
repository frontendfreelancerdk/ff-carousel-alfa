import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clone',
  pure: false
})
export class ClonePipe implements PipeTransform {

  transform(items: any[], numbers: number): any[] {
    if(!items){
      return items;
    }
    let newArr = items;
    const firstItems = [items[0]],
      lastItems = [];
    for (let i = 1, len = items.length; i < len; i++) {
      const cloneItem = items[i];
      lastItems.push(cloneItem);
    }
    while(numbers){
        newArr = Array.prototype.concat(newArr,items);
        numbers--;
    }
    return Array.prototype.concat(lastItems, newArr , firstItems);
  }
}
