package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class SupplierDto {
    private Integer id;
    private String name;
    private String telephone;
    private String faxNo;
    private String address;
    private String email;
    private String contactPerson;
    private String contactPersonTelephone;
    private LocalDate regdate;
    private String bankAccNo;
    private String description;
    private SupplierStatus supplierstatus;
    private SupplierType suppliertype;
    private Set<Supply> supplies;
    private Set<PaperSupply> paperSupplies;
    private String regNo;
    private String bankName;
    private String bankBranch;
    private String accontHolder;
    private Country country;
    private String logger;
    public SupplierDto(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}