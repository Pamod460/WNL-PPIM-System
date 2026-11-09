package lk.wnl.wijeya;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Starts the whole application (all controllers, services, repositories and security)
 * against an in-memory H2 database, so a broken bean or mapping fails the build.
 */
@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:wnldb;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1;NON_KEYWORDS=USER,VALUE,YEAR,MONTH,DAY",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class ApplicationTests {

    @Autowired private ApplicationContext context;

    @Test
    void contextLoads() {
        assertThat(context.getBeanNamesForAnnotation(org.springframework.web.bind.annotation.RestController.class))
                .hasSizeGreaterThan(20);
    }
}
