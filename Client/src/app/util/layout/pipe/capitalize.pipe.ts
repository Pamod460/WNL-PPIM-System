import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    if (value.split(" ").length > 1) {
      // Handle multiple words
      return value
        .split(" ")
        .map(word =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    } else {
      // Handle single word
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
  }
}
