import {Supply} from "./Supply";
import {SupplierStatus} from "./SupplierStatus";
import {SupplierType} from "./SupplierType";
import {Country} from "./Country";

export class Supplier {
  id!: number;
  name?: string;
  telephone?: string;
  faxNo?: string;
  address?: string;
  email?: string;
  contactPerson?: string;
  contactPersonTelephone?: string;
  country?: Country;
  regdate?: Date;
  bankAccNo?: string;
  description?: string;
  supplierstatus?: SupplierStatus;
  suppliertype?: SupplierType;
  supplies!: Supply[];
  regNo?: string;
}
