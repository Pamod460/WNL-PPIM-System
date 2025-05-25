package lk.wnl.wijeya.repository;


import lk.wnl.wijeya.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle,Integer> {

    Optional<Vehicle> findByNumber(String number);

    boolean existsByNumber(String number);
}
