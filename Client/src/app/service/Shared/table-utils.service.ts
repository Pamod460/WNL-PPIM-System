import {Injectable} from '@angular/core';
import {UiAssist} from "../../util/ui/ui.assist";

@Injectable({
  providedIn: 'root'
})
export class TableUtilsService {
  constructor() {
  }

  getColumnSizeClass<T>(dataSource: any, binders: string[], columnIndex: number, uiassist: UiAssist): string {
    // Ensure dataSource is an array
    const data = Array.isArray(dataSource) ? dataSource : dataSource?.data;

    if (!data || data.length === 0) return '';

    // Extract the value for the given column (first row for header size calculation)
    const value = uiassist.getProperty(data[0], binders[columnIndex]);

    // If the value is an image (base64 or URL), return a special class (for image columns)
    if (this.isImageColumn(value)) {

      return 'image-column';  // You can define an 'image-column' class for image columns
    }

    // Otherwise, check the maximum text length in the column
    const maxLength = Math.max(
      ...data.map((item: any) => (uiassist.getProperty(item, binders[columnIndex]) || '').length)
    );

    // Apply text size classes based on the maximum text length
    if (maxLength > 20) {
      return 'long-text';
    } else if (maxLength >= 10) {
      return 'medium-text';
    } else {
      return '';
    }
  }

  // Check if the value is an image (base64 or URL)
  isImageColumn(value: any): boolean {
    return typeof value === 'string' && (value.startsWith('data:image') || value.startsWith('http'));
  }
}
