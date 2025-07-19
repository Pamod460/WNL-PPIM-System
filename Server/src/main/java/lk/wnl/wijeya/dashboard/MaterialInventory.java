package lk.wnl.wijeya.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MaterialInventory {
   private String productName;
   private Integer quantity;
   private BigDecimal rop;
}
