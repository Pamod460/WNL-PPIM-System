package lk.wnl.wijeya.dto;

    import lk.wnl.wijeya.entity.IssuedPaper;
    import lk.wnl.wijeya.entity.ProductionOrder;
    import lk.wnl.wijeya.entity.User;
    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;

    import java.time.LocalDate;
    import java.time.LocalTime;
    import java.util.LinkedHashSet;
    import java.util.Set;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public class PaperIssueDto {
        private Integer id;
        private String code;
        private LocalDate date;
        private LocalDate issuedDate;
        private LocalTime issuedTime;
        private ProductionOrderDto productionOrder;
        private Set<IssuedPaperDto> issuedPapers;
        private String logger;

        public PaperIssueDto(Integer id, String code) {
            this.id = id;
            this.code = code;
        }
    }