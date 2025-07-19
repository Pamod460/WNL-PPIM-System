package lk.wnl.wijeya.report.controller;

import lk.wnl.wijeya.report.entity.AgentsCountByDistrict;
import lk.wnl.wijeya.report.entity.AgentsOrderCount;
import lk.wnl.wijeya.report.entity.CountByDesignation;
import lk.wnl.wijeya.report.entity.PurchaseOrderCount;
import lk.wnl.wijeya.report.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/reports")
public class ReportController {

    private final CountByDesignaitonRepository countbydesignaitondao;
    private final AgentsCountByDistrictRepository countbydistrictdao;
    private final AgentsOrderCountRepository agentsOrderCountRepository;
    private final PurchaseOrderCountRepository purchaseOrderCountRepository;
    private final PurchaseOrderSummryRepository purchaseOrderSummryRepository;
    private final InventoryReportRepository inventoryReportRepository;
    @GetMapping(path = "/countbydesignation", produces = "application/json")
    public List<CountByDesignation> get() {

        List<CountByDesignation> designations = this.countbydesignaitondao.countByDesignation();
        long totalCount = 0;

        for (CountByDesignation countByDesignation : designations) {
            totalCount += countByDesignation.getCount();
        }

        for (CountByDesignation countByDesignation : designations) {
            long count = countByDesignation.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countByDesignation.setPercentage(percentage);
        }

        return designations;
    }

    @GetMapping(path = "/countbydistrict", produces = "application/json")
    public List<AgentsCountByDistrict> getCountByDistrict() {

        List<AgentsCountByDistrict> districts = countbydistrictdao.countByDistrict();
        long totalCount = 0;

        for (AgentsCountByDistrict countByDesignation : districts) {
            totalCount += countByDesignation.getCount();
        }

        for (AgentsCountByDistrict countByDesignation : districts) {
            long count = countByDesignation.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countByDesignation.setPercentage(percentage);
        }

        return districts;
    }

    @GetMapping(path = "/agentcoutbyorders", produces = "application/json")
    public List<AgentsOrderCount> getAgentOrderCounts(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return agentsOrderCountRepository.countAgentOrders(startDate, endDate);
    }

    @GetMapping(path = "/purchaseordercount", produces = "application/json")
    public List<PurchaseOrderCount> getPurchaseOrderCounts(
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return purchaseOrderCountRepository.countPaperPurchaseOrders(startDate, endDate);
    }

    @GetMapping(path = "/materialpordersummry", produces = "application/json")
    public List<Map<String, Object>> getMaterialPurchaseOrderSummary(LocalDate startDate, LocalDate endDate) {
        return purchaseOrderSummryRepository.summarizeMaterialPurchaseOrders(startDate, endDate);
    }

    @GetMapping(path = "/paperpordersummry", produces = "application/json")

    public List<Map<String, Object>> getPaperPurchaseOrderSummary(LocalDate startDate, LocalDate endDate) {
        return purchaseOrderSummryRepository.summarizePaperPurchaseOrders(startDate, endDate);
    }
    @GetMapping("/material")
    public List<Map<String, Object>> getMaterialInventory(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status) {
        return inventoryReportRepository.summarizeMaterialInventory(code, name, status);
    }

    @GetMapping("/paper")
    public List<Map<String, Object>> getPaperInventory(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String status) {
        return inventoryReportRepository.summarizePaperInventory(code, name, status);
    }
}


