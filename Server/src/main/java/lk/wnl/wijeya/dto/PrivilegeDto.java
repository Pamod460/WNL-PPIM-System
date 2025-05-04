package lk.wnl.wijeya.dto;

import lk.wnl.wijeya.entity.Module;
import lk.wnl.wijeya.entity.Operation;
import lk.wnl.wijeya.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PrivilegeDto {

    private Integer id;
    private String authority;
    private Role role;
    private ModuleDto module;
    private OperationDto operation;
}
