import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'lng'
})
export class LanguagePipe implements PipeTransform {
    transform(value: any): any {
        const list = JSON.parse(value);
        return list.join(',');
    }
}
