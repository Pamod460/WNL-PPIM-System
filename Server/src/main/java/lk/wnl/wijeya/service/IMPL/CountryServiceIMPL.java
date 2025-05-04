package lk.wnl.wijeya.service.IMPL;

import lk.wnl.wijeya.dto.CountryDto;
import lk.wnl.wijeya.entity.Country;
import lk.wnl.wijeya.repository.CountryRepository;
import lk.wnl.wijeya.service.CountryService;
import lk.wnl.wijeya.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryServiceIMPL implements CountryService {

    private final CountryRepository countryRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<CountryDto> getAllCountries() {
        List<Country> countries = this.countryRepository.findAll();
        return objectMapper.toCountryDtoList(countries);
    }
}
