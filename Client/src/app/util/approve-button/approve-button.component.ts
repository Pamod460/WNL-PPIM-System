import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-approve-button',
  templateUrl: './approve-button.component.html',
  styleUrls: ['./approve-button.component.css'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApproveButtonComponent),
      multi: true
    }
  ]
})
export class ApproveButtonComponent implements ControlValueAccessor{
  @Input() defaultText: string = 'Approve';
  @Input() approvedText: string = 'Approved';
  @Input() disabled: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'primary' | 'success' | 'secondary' = 'primary';

  @Output() approvalChange = new EventEmitter<boolean>();
  @Output() approved = new EventEmitter<void>();
  @Output() unapproved = new EventEmitter<void>();

  isApproved = false;
  isFormControlDisabled = false;

  // Getter to combine both disabled states
  get isDisabled(): boolean {
    return this.disabled || this.isFormControlDisabled;
  }

  // ControlValueAccessor implementation
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  onCheckboxChange(event: Event): void {
    if (this.isDisabled) return;

    const target = event.target as HTMLInputElement;
    this.isApproved = target.checked;

    // Emit events
    this.approvalChange.emit(this.isApproved);

    if (this.isApproved) {
      this.approved.emit();
    } else {
      this.unapproved.emit();
    }

    // ControlValueAccessor callbacks
    this.onChange(this.isApproved);
    this.onTouched();
  }

  // ControlValueAccessor methods
  writeValue(value: boolean): void {
    this.isApproved = value || false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isFormControlDisabled = isDisabled;
  }
}
