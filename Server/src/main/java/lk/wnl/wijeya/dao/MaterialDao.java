package lk.wnl.wijeya.dao;


import lk.wnl.wijeya.entity.Material;
import lk.wnl.wijeya.entity.Usestatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialDao extends JpaRepository<Material,Integer> {

}

