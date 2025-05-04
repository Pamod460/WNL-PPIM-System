package lk.wnl.wijeya.service;

import lk.wnl.wijeya.dto.MaterialstatusDto;
import lk.wnl.wijeya.entity.Materialstatus;

import java.util.List;

public interface MaterialStatusService {
    List<MaterialstatusDto> getAll();
}
