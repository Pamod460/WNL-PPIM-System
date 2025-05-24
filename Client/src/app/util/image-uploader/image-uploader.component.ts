import {Component, EventEmitter, Input, Output} from '@angular/core';
export interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  standalone: true,
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent {
  @Input() allowMultiple: boolean = false;
  @Input() maxFileSize: number = 50 * 1024 * 1024; // 50MB
  @Input() acceptedTypes: string = 'image/jpeg,image/png,image/jpg';
  @Output() filesChanged = new EventEmitter<File[]>();
  @Output() fileRemoved = new EventEmitter<string>();

  uploadedFiles: UploadedFile[] = [];
  isDragOver = false;

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
      // Clear existing files if single file mode
      this.uploadedFiles = [];
    }

    validFiles.forEach(file => {
      const fileData: UploadedFile = {
        file: file,
        preview: '',
        id: this.generateId()
      };

      // Create preview
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
    // Check file type
    const acceptedTypesArray = this.acceptedTypes.split(',').map(type => type.trim());
    if (!acceptedTypesArray.includes(file.type)) {
      alert(`File type ${file.type} is not supported. Please use: ${this.acceptedTypes}`);
      return false;
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      alert(`File size exceeds ${this.maxFileSize / (1024 * 1024)}MB limit`);
      return false;
    }

    return true;
  }

  removeFile(fileId: string, event: Event) {
    event.stopPropagation(); // Prevent triggering file browser
    this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
    this.fileRemoved.emit(fileId);
    this.emitFiles();
  }

  private emitFiles() {
    const files = this.uploadedFiles.map(f => f.file);
    this.filesChanged.emit(files);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Public methods for parent component
  clearFiles() {
    this.uploadedFiles = [];
    this.emitFiles();
  }

  getFiles(): File[] {
    return this.uploadedFiles.map(f => f.file);
  }
}
