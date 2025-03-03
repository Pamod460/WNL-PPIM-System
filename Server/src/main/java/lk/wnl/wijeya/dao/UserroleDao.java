package lk.wnl.wijeya.dao;

import lk.wnl.wijeya.entity.Userrole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserroleDao extends JpaRepository<Userrole, Integer> {

    Userrole findById(int id);

}
