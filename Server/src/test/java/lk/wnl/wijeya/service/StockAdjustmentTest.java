package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.MaterialGrnDto;
import lk.wnl.wijeya.dto.MaterialIssueDto;
import lk.wnl.wijeya.dto.PaperGrnDto;
import lk.wnl.wijeya.dto.PaperIssueDto;
import lk.wnl.wijeya.entity.*;
import lk.wnl.wijeya.exception.ResourceAlreadyExistException;
import lk.wnl.wijeya.repository.*;
import lk.wnl.wijeya.service.IMPL.*;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/** Stock stays right when GRNs and issues are added, edited or deleted. */
@ExtendWith(MockitoExtension.class)
class StockAdjustmentTest {

    @Mock private ObjectMapper objectMapper;
    @Mock private UserRepository userRepository;
    @Mock private MaterialService materialService;
    @Mock private PaperService paperService;
    @Mock private MaterialPorderService materialPorderService;
    @Mock private PaperPorderService paperPorderService;
    @Mock private ProductionOrderService productionOrderService;
    @Mock private MaterialGRNRepository materialGRNRepository;
    @Mock private PaperGRNRepository paperGRNRepository;
    @Mock private MaterialIssueRepository materialIssueRepository;
    @Mock private PaperIssueRepository paperIssueRepository;
    @Mock private SupplierPaymentRepository supplierPaymentRepository;
    @Mock private MaterialRepository materialRepository;

    @InjectMocks private MaterialGRNServiceIMPL materialGrnService;
    @InjectMocks private PaperGRNServiceIMPL paperGrnService;
    @InjectMocks private MaterialIssueServiceIMPL materialIssueService;
    @InjectMocks private PaperIssueServiceIMPL paperIssueService;
    @InjectMocks private MaterialServiceIMPL materialStock;

    // ---------- GRNs

    @Test
    void editingAMaterialGrnChangesStockByTheDifference() {
        // Was 10 of material 1; now 15 of material 1 and 5 of material 2.
        MaterialGrn old = materialGrn(7, line(1, 10));
        MaterialGrn edited = materialGrn(7, line(1, 15), line(2, 5));
        when(objectMapper.toMaterialGrn(any())).thenReturn(edited);
        when(materialGRNRepository.findById(7)).thenReturn(Optional.of(old));
        when(materialGRNRepository.save(any())).thenReturn(edited);

        materialGrnService.UpdateMaterialGrn(new MaterialGrnDto());

        verify(materialService).adjustQuantity(1, BigDecimal.valueOf(5));
        verify(materialService).adjustQuantity(2, BigDecimal.valueOf(5));
        verify(materialPorderService).updatePorderReceivingStatus(9);
    }

    @Test
    void deletingAMaterialGrnTakesTheStockBackOutAndRecountsThePo() {
        MaterialGrn grn = materialGrn(7, line(1, 10));
        when(materialGRNRepository.findById(7)).thenReturn(Optional.of(grn));

        materialGrnService.deleteMaterialGrn(7);

        verify(materialService).adjustQuantity(1, BigDecimal.valueOf(-10));
        verify(materialGRNRepository).delete(grn);
        verify(materialPorderService).updatePorderReceivingStatus(9);
    }

    @Test
    void savingAPaperGrnUpdatesThePurchaseOrderStatus() {
        PaperGrn grn = paperGrn(3, paperGrnLine(4, 20));
        when(objectMapper.toPaperGrn(any())).thenReturn(grn);
        when(paperGRNRepository.save(any())).thenReturn(grn);

        paperGrnService.savePaperGrn(new PaperGrnDto());

        verify(paperService).increaseQuantity(4, BigDecimal.valueOf(20));
        verify(paperPorderService).updatePorderReceivingStatus(11);
    }

    @Test
    void deletingAPaperGrnTakesTheStockBackOut() {
        PaperGrn grn = paperGrn(3, paperGrnLine(4, 20));
        when(paperGRNRepository.findById(3)).thenReturn(Optional.of(grn));

        paperGrnService.deletePaperGrn(3);

        verify(paperService).adjustQuantity(4, BigDecimal.valueOf(-20));
        verify(paperPorderService).updatePorderReceivingStatus(11);
    }

    // ---------- Issues

    @Test
    void issuingPaperReducesPaperStock() {
        PaperIssue issue = paperIssue(5, issuedPaper(4, 8));
        when(objectMapper.toPaperIssue(any())).thenReturn(issue);
        when(paperIssueRepository.save(any())).thenReturn(issue);

        paperIssueService.savePaperIssue(new PaperIssueDto());

        verify(paperService).decreaseQuantity(4, BigDecimal.valueOf(8));
    }

    @Test
    void issuingLessMaterialPutsStockBackAndIssuingMoreTakesIt() {
        // Material 1: 5 -> 3 (2 back). Material 2: 4 -> 7 (3 more, reorder-point check applies).
        MaterialIssue old = materialIssue(6, issued(1, 5), issued(2, 4));
        MaterialIssue edited = materialIssue(6, issued(1, 3), issued(2, 7));
        when(objectMapper.toMaterialIssue(any())).thenReturn(edited);
        when(materialIssueRepository.findById(6)).thenReturn(Optional.of(old));
        when(materialIssueRepository.save(any())).thenReturn(edited);

        materialIssueService.UpdateMaterialIssue(new MaterialIssueDto());

        verify(materialService).adjustQuantity(1, BigDecimal.valueOf(2));
        verify(materialService).decreaseQuantity(2, BigDecimal.valueOf(3));
    }

    @Test
    void deletingAPaperIssueReturnsThePaperToStock() {
        PaperIssue issue = paperIssue(5, issuedPaper(4, 8));
        when(paperIssueRepository.findById(5)).thenReturn(Optional.of(issue));

        paperIssueService.deletePaperIssue(5);

        verify(paperService).adjustQuantity(4, BigDecimal.valueOf(8));
    }

    // ---------- adjustQuantity

    @Test
    void stockCannotGoBelowZeroWhenUndoingAGrn() {
        Material material = new Material();
        material.setId(1);
        material.setName("Ink");
        material.setQuantity(BigDecimal.valueOf(4));
        when(materialRepository.findById(1)).thenReturn(Optional.of(material));

        assertThatThrownBy(() -> materialStock.adjustQuantity(1, BigDecimal.valueOf(-10)))
                .isInstanceOf(ResourceAlreadyExistException.class)
                .hasMessageContaining("Not enough stock of Ink");
        verify(materialRepository, never()).save(any());

        materialStock.adjustQuantity(1, BigDecimal.valueOf(-4));
        assertThat(material.getQuantity()).isEqualByComparingTo("0");
    }

    // ---------- builders

    private static MaterialGrn materialGrn(int id, MaterialGrnMaterial... lines) {
        MaterialGrn grn = new MaterialGrn();
        grn.setId(id);
        grn.setCode("GRN-" + id);
        MaterialPorder po = new MaterialPorder();
        po.setId(9);
        grn.setMaterialPorder(po);
        grn.setMaterialGrnMaterials(new LinkedHashSet<>(Set.of(lines)));
        return grn;
    }

    private static MaterialGrnMaterial line(int materialId, int qty) {
        Material m = new Material();
        m.setId(materialId);
        MaterialGrnMaterial line = new MaterialGrnMaterial();
        line.setMaterial(m);
        line.setQuantity(qty);
        return line;
    }

    private static PaperGrn paperGrn(int id, PaperGrnPaper... lines) {
        PaperGrn grn = new PaperGrn();
        grn.setId(id);
        grn.setCode("PGRN-" + id);
        PaperPorder po = new PaperPorder();
        po.setId(11);
        grn.setPaperPorder(po);
        grn.setPaperGrnPapers(new LinkedHashSet<>(Set.of(lines)));
        return grn;
    }

    private static PaperGrnPaper paperGrnLine(int paperId, int qty) {
        Paper p = new Paper();
        p.setId(paperId);
        PaperGrnPaper line = new PaperGrnPaper();
        line.setPaper(p);
        line.setQuantity(qty);
        return line;
    }

    private static MaterialIssue materialIssue(int id, IssuedMaterial... lines) {
        MaterialIssue issue = new MaterialIssue();
        issue.setId(id);
        issue.setCode("MI-" + id);
        issue.setIssuedMaterials(new LinkedHashSet<>(Set.of(lines)));
        return issue;
    }

    private static IssuedMaterial issued(int materialId, int qty) {
        Material m = new Material();
        m.setId(materialId);
        IssuedMaterial line = new IssuedMaterial();
        line.setMaterial(m);
        line.setQuantity(qty);
        return line;
    }

    private static PaperIssue paperIssue(int id, IssuedPaper... lines) {
        PaperIssue issue = new PaperIssue();
        issue.setId(id);
        issue.setCode("PI-" + id);
        issue.setIssuedPapers(new LinkedHashSet<>(Set.of(lines)));
        return issue;
    }

    private static IssuedPaper issuedPaper(int paperId, int qty) {
        Paper p = new Paper();
        p.setId(paperId);
        IssuedPaper line = new IssuedPaper();
        line.setPaper(p);
        line.setQuantity(qty);
        return line;
    }
}
