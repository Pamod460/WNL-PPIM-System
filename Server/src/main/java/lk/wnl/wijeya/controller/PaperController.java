package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.PaperDto;
import lk.wnl.wijeya.service.PaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/papers")
@RequiredArgsConstructor
public class PaperController {
     private final PaperService paperService;

     @GetMapping(path = "/list", produces = "application/json")
     public List<PaperDto> get() {
         return paperService.getAllList();
     }
}
