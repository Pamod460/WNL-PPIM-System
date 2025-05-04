package lk.wnl.wijeya.controller;

import lk.wnl.wijeya.dto.GenderDto;
import lk.wnl.wijeya.repository.GenderRepository;
import lk.wnl.wijeya.entity.Gender;
import lk.wnl.wijeya.service.GenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
@CrossOrigin
@RestController
@RequestMapping(value = "/genders")
@RequiredArgsConstructor
public class GenderController {

    private final GenderService genderService;

    @GetMapping(path ="/list",produces = "application/json")
    public List<GenderDto> get() {


        return this.genderService.getAll();

    }

}


