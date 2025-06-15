package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.Employee;
import lk.wnl.wijeya.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route,Integer> {

    Boolean existsByRouteNumber(String routeNumber);

    Route findTopByOrderByIdDesc();
}
