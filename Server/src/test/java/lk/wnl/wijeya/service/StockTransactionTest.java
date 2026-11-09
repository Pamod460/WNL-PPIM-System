package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.MaterialGrnDto;
import lk.wnl.wijeya.dto.MaterialIssueDto;
import lk.wnl.wijeya.dto.MaterialPorderDto;
import lk.wnl.wijeya.entity.IssuedMaterial;
import lk.wnl.wijeya.entity.Material;
import lk.wnl.wijeya.entity.MaterialGrn;
import lk.wnl.wijeya.entity.MaterialIssue;
import lk.wnl.wijeya.entity.ProductionOrder;
import lk.wnl.wijeya.exception.ResourceNotFoundException;
import lk.wnl.wijeya.repository.MaterialGRNRepository;
import lk.wnl.wijeya.repository.MaterialIssueRepository;
import lk.wnl.wijeya.repository.SupplierPaymentRepository;
import lk.wnl.wijeya.repository.UserRepository;
import lk.wnl.wijeya.service.IMPL.MaterialGRNServiceIMPL;
import lk.wnl.wijeya.service.IMPL.MaterialIssueServiceIMPL;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.support.SimpleTransactionStatus;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Stock-changing saves run in one transaction: if any line fails (e.g. the 2nd material would
 * drop below its reorder point) the whole save rolls back, including the stock already taken
 * off for the 1st material.
 */
@SpringJUnitConfig(StockTransactionTest.Config.class)
class StockTransactionTest {

    @Configuration
    @EnableTransactionManagement
    @Import({MaterialIssueServiceIMPL.class, MaterialGRNServiceIMPL.class})
    static class Config {
    }

    @MockBean private PlatformTransactionManager txManager;
    @MockBean private MaterialIssueRepository materialIssueRepository;
    @MockBean private MaterialGRNRepository materialGRNRepository;
    @MockBean private SupplierPaymentRepository supplierPaymentRepository;
    @MockBean private ObjectMapper objectMapper;
    @MockBean private UserRepository userRepository;
    @MockBean private MaterialService materialService;
    @MockBean private ProductionOrderService productionOrderService;
    @MockBean private MaterialPorderService materialPorderService;

    @Autowired private MaterialIssueService materialIssueService;
    @Autowired private MaterialGRNService materialGRNService;

    @BeforeEach
    void stubTransactions() {
        TransactionStatus status = new SimpleTransactionStatus(true);
        when(txManager.getTransaction(any())).thenReturn(status);
    }

    @Test
    void failedMaterialIssueRollsBackStockChanges() {
        MaterialIssue issue = issueWithTwoMaterials();
        when(objectMapper.toMaterialIssue(any())).thenReturn(issue);
        doNothing().doThrow(new ResourceNotFoundException("Cannot be Issue Requested Quantity the reorder point is: 10"))
                .when(materialService).decreaseQuantity(any(), any());

        assertThatThrownBy(() -> materialIssueService.saveMaterialIssue(new MaterialIssueDto()))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(materialService, times(2)).decreaseQuantity(any(), any());
        verify(txManager).rollback(any());
        verify(txManager, never()).commit(any());
        verify(materialIssueRepository, never()).save(any());
    }

    @Test
    void successfulMaterialIssueCommitsOnce() {
        MaterialIssue issue = issueWithTwoMaterials();
        when(objectMapper.toMaterialIssue(any())).thenReturn(issue);
        when(materialIssueRepository.save(any())).thenReturn(issue);

        materialIssueService.saveMaterialIssue(new MaterialIssueDto());

        verify(txManager, times(1)).commit(any());
        verify(txManager, never()).rollback(any());
    }

    @Test
    void grnIsSavedBeforePurchaseOrderStatusIsWorkedOut() {
        MaterialGrn grn = new MaterialGrn();
        grn.setId(5);
        grn.setCode("GRN-01");
        grn.setMaterialGrnMaterials(new LinkedHashSet<>());
        when(objectMapper.toMaterialGrn(any())).thenReturn(grn);
        when(materialGRNRepository.save(any())).thenReturn(grn);
        MaterialGrnDto dto = new MaterialGrnDto();
        MaterialPorderDto porder = new MaterialPorderDto();
        porder.setId(9);
        dto.setMaterialPorder(porder);

        materialGRNService.saveMaterialGrn(dto);

        InOrder order = inOrder(materialGRNRepository, materialPorderService);
        order.verify(materialGRNRepository).save(grn);
        order.verify(materialPorderService).updatePorderReceivingStatus(9);
        verify(txManager).commit(any());
    }

    private static MaterialIssue issueWithTwoMaterials() {
        MaterialIssue issue = new MaterialIssue();
        issue.setId(1);
        issue.setCode("MI-01");
        ProductionOrder po = new ProductionOrder();
        po.setId(3);
        issue.setProductionOrder(po);
        Set<IssuedMaterial> lines = new LinkedHashSet<>();
        for (int i = 1; i <= 2; i++) {
            Material m = new Material();
            m.setId(i);
            IssuedMaterial line = new IssuedMaterial();
            line.setId(i);
            line.setMaterial(m);
            line.setQuantity(5);
            lines.add(line);
        }
        issue.setIssuedMaterials(lines);
        return issue;
    }
}
