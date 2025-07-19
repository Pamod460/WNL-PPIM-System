import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AgentOrderProduct } from "../../entity/agentorderproduct";
import { MessageComponent } from "../../util/dialog/message/message.component";
import { ConfirmComponent } from "../../util/dialog/confirm/confirm.component";
import { Product } from "../../entity/Product";
import { Agent } from "../../entity/agent";
import { Productdesign } from "../../entity/productdesign";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { AgentorderService } from "../../service/agentorder/agentorder.service";
import { AgentService } from "../../service/agent/agent.service";
import { ProductService } from "../../service/product/product.service";
import { ProductdesignService } from "../../service/productdesign/productdesign.service";
import { ToastrService } from "ngx-toastr";
import { AgentOrder } from "../../entity/agentOrder";
import { AgentOrderStatus } from "../../entity/agentOrderStatus";
import { AgentorderstatusService } from "../../service/agentorder/agentorderstatus.service";

@Component({
  selector: 'app-agent-order-public',
  templateUrl: './agent-order-public.component.html',
  styleUrls: ['./agent-order-public.component.css']
})
export class AgentOrderPublicComponent implements OnInit {
  productForm: FormGroup;
  form: FormGroup;
  aligibilityForm: FormGroup;
  productList!: Product[];
  matchedNavItem = 'Agent Order';
  isAligible = false;
  isInnerDataUpdated = false;
  inndata!: AgentOrderProduct;
  innerdata: AgentOrderProduct[] = [];
  id: number = 0;
  protected readonly document = document;
  grandTotal = 0;
  smRole? = false;
  accRole? = false;
  agents: Agent[] = [];
  productDesignList!: Productdesign[];
  filteredProductDesignList: Productdesign[] = [];
  filteredProductList: Product[] = [];
  agentOrderStatuses: AgentOrderStatus[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private agentOrderService: AgentorderService,
    private agentService: AgentService,
    private productService: ProductService,
    private productDesignService: ProductdesignService,
    private agentOrderStatusService: AgentorderstatusService,
    private toastrService: ToastrService
  ) {
    this.aligibilityForm = this.formBuilder.group({
      agentNumber: new FormControl('', [Validators.required, Validators.minLength(3)]),
      nic: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(12)])
    }, { updateOn: 'change' });

    this.form = this.formBuilder.group({
      orderNumber: new FormControl('', [Validators.maxLength(20)]),
      orderDate: new FormControl('', [Validators.required]),
      grandTotal: new FormControl(null, [Validators.required]),
      description: new FormControl(''),
      logger: new FormControl(null, [Validators.required]),
      agent: new FormControl(null, [Validators.required]),
      orderTime: new FormControl(null, [Validators.required]),
      agentOrderStatus: new FormControl(null, [Validators.required]),
      agentOrderProducts: this.formBuilder.array([])
    }, { updateOn: 'change' });

    this.productForm = this.formBuilder.group({
      product: [null, Validators.required],
      productDesign: [null],
      quantity: [0, [Validators.required, Validators.min(1)]],
      lineTotal: [0]
    });

    this.productForm.get("quantity")?.valueChanges.subscribe(values => {
      this.updatePrices(values);
    });

    this.isAligible = !!localStorage.getItem('agent');
    this.form.get('agentOrderStatus')?.setValue({id:1})
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    // Load products
    this.productService.getAll("").subscribe({
      next: (products: Product[]) => {
        this.productList = products;
        this.filteredProductList = [...this.productList];
      },
      error: (err: any) => {
        this.toastrService.error('Error fetching products: ' + err.message);
      }
    });

    // Load product designs
    this.productDesignService.getAll("").subscribe({
      next: (designs: Productdesign[]) => {
        this.productDesignList = designs;
        this.filteredProductDesignList = [];
      },
      error: (err: any) => {
        this.toastrService.error('Error fetching product designs: ' + err.message);
      }
    });




    // Set today's date and time
    this.form.get("orderDate")?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.form.get("orderTime")?.setValue(this.datePipe.transform(new Date(), 'HH:mm'));

    // Set logger (assuming a default value or from auth service)
    this.form.get("logger")?.setValue('Agent'); // Replace with actual auth service if available
// @ts-ignore
    this.form.get("agent")?.setValue(JSON.parse(localStorage.getItem('agent')))
    console.log( this.form.get("agent")?.value)
    // Get next order number
    this.getNextCode();
  }

  updatePrices(values: number) {
    const agentPrice = this.productForm.get("product")?.value.agentPrice || 0;
    const lineTotal = agentPrice * values;
    this.productForm.get("lineTotal")?.setValue(lineTotal);
  }

  addToTable() {
    this.inndata = this.productForm.getRawValue();
    console.log(this.inndata.quantity);
    // Validate product input
    if (!this.inndata.product || this.inndata.quantity === 0) {
      this.showMessageDialog("Errors - Product Add", "Please Add Required Details");
      return;
    }

    const quantity = this.inndata.quantity || 0;
    const agentPrice = this.inndata.product?.agentPrice || 0;
    const expectedlineTotal = quantity * agentPrice;
    this.grandTotal += expectedlineTotal;
    this.form.get("grandTotal")?.setValue(this.grandTotal);
    const newEntry = new AgentOrderProduct(
      this.id,
      this.inndata.product,
      this.inndata.productDesign,
      quantity,
      expectedlineTotal
    );

    // Clone and repopulate innerdata
    const updatedData: AgentOrderProduct[] = this.innerdata ? [...this.innerdata] : [];

    const isDuplicate = updatedData.some(item => item.product?.id === newEntry.product?.id);

    if (isDuplicate) {
      this.showMessageDialog("Errors - Product Add", "Duplicate record.<br>This record already exists in the table.");
    } else {
      // Add new entry and remove from filtered list
      updatedData.push(newEntry);
      const addedProductId = newEntry.product?.id;
      const removeIndex = this.filteredProductList.findIndex(e => e.id === addedProductId);
      if (removeIndex > -1) {
        this.filteredProductList.splice(removeIndex, 1);
      }
      this.innerdata = updatedData;
      this.id++;
      this.isInnerDataUpdated = true;
      this.resetProductForm();
    }
  }

  private showMessageDialog(heading: string, message: string): void {
    const dialogRef = this.matDialog.open(MessageComponent, {
      width: '400px',
      data: { heading, message }
    });

    dialogRef.afterClosed().subscribe();
  }

  private resetProductForm(): void {
    this.productForm.reset();
    for (const controlName in this.productForm.controls) {
      const control = this.productForm.controls[controlName];
      control.clearValidators();
      control.updateValueAndValidity();
    }
    // Reapply validators after reset
    this.productForm.get('product')?.setValidators([Validators.required]);
    this.productForm.get('quantity')?.setValidators([Validators.required, Validators.min(1)]);
    this.productForm.get('lineTotal')?.setValidators([]);
    this.productForm.updateValueAndValidity();
  }

  deleteRow(x: AgentOrderProduct): void {
    const dialogRef = this.matDialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Delete Product",
        message: "Are You Sure You Want To Perform this Operation?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const indexToDelete = this.innerdata.findIndex(item => item.id === x.id);

      if (indexToDelete > -1) {
        const product = this.innerdata[indexToDelete]?.product;

        // Re-add the product to the filtered list if not already present
        if (product?.id) {
          const existingProduct = this.productList.find(e => e.id === product.id);
          const isAlreadyInFiltered = this.filteredProductList.some(e => e.id === product.id);

          if (existingProduct && !isAlreadyInFiltered) {
            this.filteredProductList.push(existingProduct);
          }
        }

        // Update grand total
        this.grandTotal -= this.innerdata[indexToDelete].lineTotal || 0;
        this.form.get("grandTotal")?.setValue(this.grandTotal);

        // Remove the entry from innerdata
        this.innerdata.splice(indexToDelete, 1);
        this.isInnerDataUpdated = true;
      }
    });
  }

  get timeControl() {
    return this.form.get('orderTime');
  }

  trackByInnerData(index: number, item: any): any {
    return item?.id || index;
  }

  onProductChange(value: any) {
    this.filteredProductDesignList = this.productDesignList.filter(des => des.product.id === value.id);
  }

  onSubmit() {
    if (!this.isAligible) {
      this.showMessageDialog("Error", "Please verify agent eligibility before submitting the order.");
      return;
    }

    const errors = this.getErrors(['description']);

    if (errors !== "") {
      this.showMessageDialog("Errors - Agent Order Add", "You have the following Errors <br> " + errors);
      return;
    }

    if (this.innerdata.length === 0) {
      this.showMessageDialog("Error", "Please add at least one product to the order.");
      return;
    }

    const agentOrder: AgentOrder = this.form.getRawValue();
    this.innerdata.forEach((i) => delete i.id);
    agentOrder.agentOrderProducts = this.innerdata;

    const mpdata = `<br>Order Number: ${agentOrder.orderNumber}<br>Agent: ${agentOrder.agent?.fullName || 'Unknown'}`;

    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Agent Order Add",
        message: "Are you sure to add the following Agent Order? <br> <br>" + mpdata
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.agentOrderService.add(agentOrder).subscribe({
          next: (response) => {
            this.toastrService.success(response.message).onShown.subscribe(() => {
              this.resetForm();
            });
          },
          error: (error) => {
            this.toastrService.error(error.error?.data?.message || 'An error occurred while adding the order.');
          }
        });
      }
    });
  }

  getErrors(optionalFields: string[] = []): string {
    let errors = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (!optionalFields.includes(controlName) && control.errors) {
        errors += `<br>Invalid ${controlName}`;
      }
    }
    return errors;
  }

  resetForm() {
    this.form.reset();
    this.innerdata = [];
    this.isInnerDataUpdated = false;
    this.grandTotal = 0;
    this.id = 0;
    this.filteredProductList = this.productList ? [...this.productList] : [];
    // Reset form with default values
    this.form.get("orderDate")?.setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.form.get("orderTime")?.setValue(this.datePipe.transform(new Date(), 'HH:mm'));
    this.form.get("logger")?.setValue('Public User');
    this.form.get("agentOrderStatus")?.setValue(this.agentOrderStatuses.find(m => m.id === 1));
    this.getNextCode();
  }

  ckeckAligibility() {
    if (!this.aligibilityForm.valid) {
      this.showMessageDialog("Error", "Please provide valid Agent Number and NIC.");
      return;
    }

    const { agentNumber, nic } = this.aligibilityForm.getRawValue();
    let query = `?number=${agentNumber}&nic=${nic}`;

    this.agentService.getAll(query).subscribe({
      next: (agents: Agent[]) => {
        if (agents.length > 0) {
          localStorage.setItem('agent', JSON.stringify(agents[0]));
          this.isAligible = true;
          this.form.get('agent')?.setValue(agents[0]);
          this.toastrService.success('Agent verified successfully.');
        } else {
          this.isAligible = false;
          localStorage.removeItem('agent');
          this.form.get('agent')?.setValue(null);
          this.showMessageDialog("Error", "No agent found with the provided Agent Number and NIC.");
        }
      },
      error: (err: any) => {
        this.isAligible = false;
        localStorage.removeItem('agent');
        this.form.get('agent')?.setValue(null);
        this.toastrService.error('Error verifying agent: ' + err.message);
      }
    });
  }

  getNextCode() {
    this.agentOrderService.getNextCode().subscribe({
      next: (code: { code: any }) => {
        this.form.controls["orderNumber"].setValue(code.code);
      },
      error: (err: any) => {
        this.toastrService.error('Error fetching next order number: ' + err.message);
      }
    });
  }
}
