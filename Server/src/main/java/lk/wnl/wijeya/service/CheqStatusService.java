package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.CheqStatusDto;
import lk.wnl.wijeya.entity.CheqStatus;

import java.util.List;

public interface CheqStatusService {
    List<CheqStatusDto> getAllCheqStatuses();
}
