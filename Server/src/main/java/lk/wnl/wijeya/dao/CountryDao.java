package lk.wnl.wijeya.dao;

import lk.wnl.wijeya.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryDao extends JpaRepository<Country,Integer> {
}
