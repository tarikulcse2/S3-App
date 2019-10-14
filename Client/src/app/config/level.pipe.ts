import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'level'
})
export class LevelPipe implements PipeTransform {
    transform(value: number, args?: any[]): any {
        return args.find(s => s.id === value).name;
    }
}
