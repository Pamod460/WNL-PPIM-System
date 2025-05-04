package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country,Integer> {
}
