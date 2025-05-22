package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.Module;
import lk.wnl.wijeya.entity.PaperColor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaperColorRepository extends JpaRepository<PaperColor,Integer> {

}
