import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";

export interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnChanges {
  @Input() title: string = 'Upload Image';
  @Input() allowMultiple: boolean = false;
  @Input() preview: any = '';
  @Input() maxFileSize: number = 50 * 1024 * 1024; // 50MB
  @Input() acceptedTypes: string = 'image/jpeg,image/png,image/jpg';
  @Output() filesChanged = new EventEmitter<File[]>();
  @Output() fileRemoved = new EventEmitter<string>();

  uploadedFiles: UploadedFile[] = [];
  isDragOver = false;
  private suppressEmit: boolean = false;

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['preview']) {
      const newValue = changes['preview'].currentValue;

      if (!newValue || newValue === '') {
        this.clearFiles();
      } else {
        this.suppressEmit = true;
        await this.setImage(newValue);
        this.suppressEmit = false;
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = Array.from(event.dataTransfer?.files || []);
    this.handleFiles(files);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.handleFiles(files);
    }
  }

  private handleFiles(files: File[]) {
    const validFiles = files.filter(file => this.validateFile(file));

    if (!this.allowMultiple && validFiles.length > 0) {
      this.uploadedFiles = [];
    }

    validFiles.forEach(file => {
      const fileData: UploadedFile = {
        file: file,
        preview: '',
        id: this.generateId()
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.preview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      if (!this.allowMultiple) {
        this.uploadedFiles = [fileData];
      } else {
        this.uploadedFiles.push(fileData);
      }
    });

    this.emitFiles();
  }

  private validateFile(file: File): boolean {
    const acceptedTypesArray = this.acceptedTypes.split(',').map(type => type.trim());
    if (!acceptedTypesArray.includes(file.type)) {
      alert(`File type ${file.type} is not supported. Please use: ${this.acceptedTypes}`);
      return false;
    }

    if (file.size > this.maxFileSize) {
      alert(`File size exceeds ${this.maxFileSize / (1024 * 1024)}MB limit`);
      return false;
    }

    return true;
  }

  removeFile(fileId: string, event: Event) {
    event.stopPropagation();
    this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
    this.fileRemoved.emit(fileId);
    this.emitFiles();
  }

  private emitFiles() {
    if (this.suppressEmit) return;
    const files = this.uploadedFiles.map(f => f.file);
    this.filesChanged.emit(files);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  clearFiles() {
    this.uploadedFiles = [];
    this.emitFiles();
  }

  getFiles(): File[] {
    return this.uploadedFiles.map(f => f.file);
  }

  async setImage(base64String: string): Promise<void> {
    if (!base64String || base64String.trim() === '') {
      console.warn('Empty base64 string provided');
      return;
    }

    try {
      const decoded = atob(base64String);
      if (decoded === 'undefined' || decoded === 'null') {
        console.warn('Base64 string contains invalid data:', decoded);
        return;
      }
    } catch (e) {
      console.warn('Invalid base64 string format');
      return;
    }

    try {
      const base64DataUrl = `data:image/jpeg;base64,${base64String}`;
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = base64DataUrl;
      });

      const response = await fetch(base64DataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

      const fileData: UploadedFile = {
        file: file,
        preview: base64DataUrl,
        id: this.generateId()
      };

      this.uploadedFiles = [fileData];
      this.emitFiles();
    } catch (error) {
      console.error('Error setting image from base64:', error);
      this.uploadedFiles = [];
      this.emitFiles();
    }
  }

  openImageInPopupWindow(previewUrl: string): void {
    if (!previewUrl) return;

    const popupWidth = 800;
    const popupHeight = 600;

    // Calculate center position
    const screenLeft = window.screenLeft ?? window.screenX;
    const screenTop = window.screenTop ?? window.screenY;
    const screenWidth = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
    const screenHeight = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;

    const left = screenLeft + (screenWidth - popupWidth) / 2;
    const top = screenTop + (screenHeight - popupHeight) / 2;

    const windowFeatures = `
    toolbar=no,
    location=no,
    status=no,
    menubar=no,
    scrollbars=yes,
    resizable=yes,
    width=${popupWidth},
    height=${popupHeight},
    top=${top},
    left=${left}
  `;

    const popup = window.open('', '_blank', windowFeatures);

    if (popup) {
      popup.document.write(`
      <html>
        <head>
          <title>Image Preview</title>
          <style>
            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #111;
              height: 100vh;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${previewUrl}" alt="Image Preview">
        </body>
      </html>
    `);
      popup.document.close();
    } else {
      alert('Popup blocked! Please allow popups for this site.');
    }
  }



}
