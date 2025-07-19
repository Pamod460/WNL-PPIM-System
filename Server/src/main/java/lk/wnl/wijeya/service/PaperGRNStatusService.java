package lk.wnl.wijeya.service;


import lk.wnl.wijeya.dto.PaperGrnStatusDto;
import lk.wnl.wijeya.dto.PaperPorderStatusDto;
import lk.wnl.wijeya.entity.PaperGrnStatus;

import java.util.List;

public interface PaperGRNStatusService {

    List<PaperGrnStatusDto> getAll();
}

