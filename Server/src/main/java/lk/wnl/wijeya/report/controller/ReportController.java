package lk.wnl.wijeya.report.controller;

import lk.wnl.wijeya.report.repository.AgentsCountByDistrictRepository;
import lk.wnl.wijeya.report.repository.CountByDesignaitonRepository;
import lk.wnl.wijeya.report.entity.AgentsCountByDistrict;
import lk.wnl.wijeya.report.entity.CountByDesignation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/reports")
public class ReportController {

    private final CountByDesignaitonRepository countbydesignaitondao;
    private final AgentsCountByDistrictRepository countbydistrictdao;

    @GetMapping(path ="/countbydesignation",produces = "application/json")
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
    @GetMapping(path ="/countbydistrict",produces = "application/json")
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
}


