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
    const newArr = items,
      firstItems = [items[0]],
      lastItems = [];
    for (let i = 1, len = items.length; i < len; i++) {
      const cloneItem = items[i];
      lastItems.push(cloneItem);
    }
    return Array.prototype.concat(lastItems, newArr , firstItems);
  }
}
