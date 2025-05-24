import { Component, EventEmitter, Input, OnInit, Output, TrackByFunction } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { NgForOf, NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";

export interface SelectableItem {
  id: number;
  [key: string]: any;
}

@Component({
  selector: 'app-checklist-dialog',
  templateUrl: './checklist-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatButtonModule,
    NgForOf
  ],
  styleUrls: ['./checklist-dialog.component.css']
})
export class ChecklistDialogComponent<T extends SelectableItem> implements OnInit {
  @Input() title = 'Select Items';
  @Input() allItems: T[] = [];
  @Input() preselectedItems: T[] = [];

  @Input() dialogTitle = 'Select Items';
  @Input() searchPlaceholder = 'Search items...';
  @Input() icon = 'checklist';
  @Input() displayProperty = 'name';

  @Output() confirmed = new EventEmitter<T[]>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<T[]>();

  form: FormGroup;
  filteredItems: T[] = [];
  searchTerm = '';
  selectedCount = 0;
  trackByItemId!: TrackByFunction<T>;
  isSubmitDisabled=true;
  isApplyDisabled =false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.filteredItems = [...this.allItems];
    this.trackByItemId = (_: number, item: T) => item.id;
  }

  private initializeForm(): void {
    const selectedItemsArray = this.form.get('selectedItems') as FormArray;
    const selectedIds = this.preselectedItems.map(item => item.id);

    this.allItems.forEach(item => {
      const isSelected = selectedIds.includes(item.id);
      selectedItemsArray.push(new FormControl(isSelected));
      if (isSelected) this.selectedCount++;
    });
  }

  get selectedItemsArray(): FormArray {
    return this.form.get('selectedItems') as FormArray;
  }

  get selected(): T[] {
    return this.selectedItemsArray.controls
      .map((control, i) => control.value ? this.allItems[i] : null)
      .filter((item): item is T => !!item);
  }

  displayFn(item: T): string {
    return item[this.displayProperty] || '';
  }

  onSearchChange(event: any): void {
    const term = event.target.value.toLowerCase();
    this.filteredItems = this.allItems.filter(item =>
      this.displayFn(item).toLowerCase().includes(term)
    );
  }

  toggleSelection(index: number): void {
    const control = this.selectedItemsArray.at(index);
    const newValue = !control.value;
    control.setValue(newValue);
    this.selectedCount += newValue ? 1 : -1;
  }

  isSelected(index: number): boolean {
    return this.selectedItemsArray.at(index)?.value || false;
  }

  selectAll(): void {
    const allSelected = this.selectedCount === this.filteredItems.length;
    this.filteredItems.forEach(item => {
      const index = this.getActualIndex(item.id);
      const control = this.selectedItemsArray.at(index);
      if (allSelected) {
        if (control.value) {
          control.setValue(false);
          this.selectedCount--;
        }
      } else {
        if (!control.value) {
          control.setValue(true);
          this.selectedCount++;
        }
      }
    });
  }

  clearAll(): void {
    this.selectedItemsArray.controls.forEach(control => {
      if (control.value) control.setValue(false);
    });
    this.selectedCount = 0;
  }

  confirm(): void {
    this.isApplyDisabled = true;
    this.isSubmitDisabled=false
    this.confirmed.emit(this.selected);
  }

  cancel(): void {
    this.cancelled.emit();
  }

  onCancel(): void {
    this.cancel();
  }

  onConfirm(): void {
    this.confirm();
  }

  onSubmit(): void {
    this.submitted.emit(this.selected);
  }

  getActualIndex(id: number): number {
    return this.allItems.findIndex(item => item.id === id);
  }
}
