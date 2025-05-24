package lk.wnl.wijeya.repository;

import lk.wnl.wijeya.entity.Agent;
import lk.wnl.wijeya.entity.AgentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent,Integer> {
    boolean existsByNumber(String number);

    boolean existsByNic(String nic);

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    boolean existsByNumberAndIdNot(String number, Integer id);

    boolean existsByNicAndIdNot(String nic, Integer id);

    boolean existsByMobileAndIdNot(String mobile, Integer id);

    boolean existsByEmailAndIdNot(String email, Integer id);

    Agent findTopByOrderByIdDesc();
}
