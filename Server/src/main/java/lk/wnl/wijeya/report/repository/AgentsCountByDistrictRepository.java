package lk.wnl.wijeya.report.repository;

import lk.wnl.wijeya.report.entity.AgentsCountByDistrict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AgentsCountByDistrictRepository extends JpaRepository<AgentsCountByDistrict,Integer> {
    @Query(value = "SELECT NEW AgentsCountByDistrict(d.name, COUNT(a.fullName)) FROM Agent a, District d WHERE a.district.id = d.id GROUP BY d.id")
    List<AgentsCountByDistrict> countByDistrict();

}
