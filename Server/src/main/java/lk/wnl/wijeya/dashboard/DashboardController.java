package lk.wnl.wijeya.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Arrays;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/dashboard")
public class DashboardController {
    private final DashboardRepository dashboardRepository;

    @GetMapping(produces = "application/json")
    public Dashboard getDashboardData() {
        try {
            Object[] result = dashboardRepository.getDashboardData();
            if (result == null || result.length != 4) {
                throw new RuntimeException("Invalid dashboard data");
            }
            return new Dashboard(
                    ((Number) result[0]).intValue(),
                    ((Number) result[1]).intValue(),
                    ((Number) result[2]).intValue(),
                    ((Number) result[3]).intValue()
            );
        } catch (Exception e) {
            throw new RuntimeException("Error fetching dashboard data: " + e.getMessage());
        }
    }
    @GetMapping(value = "/material-inventory", produces = "application/json")
    public MaterialInventory[] getMaterialInventory() {
        try {
            Object[] result = dashboardRepository.getMaterialInventory();
            return Arrays.stream(result)
                    .map(row -> {
                        Object[] columns = (Object[]) row;
                        return new MaterialInventory(
                                (String) columns[0],          // productName
                                ((Number) columns[1]).intValue(), // quantity
                                (BigDecimal) columns[2]           // rop
                        );
                    })
                    .toArray(MaterialInventory[]::new);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching material inventory: " + e.getMessage());
        }
    } @GetMapping(value = "/paper-inventory", produces = "application/json")
    public PaperInventory[] getPaperInventory() {
        try {
            Object[] result = dashboardRepository.getPaperInventory();
            return Arrays.stream(result)
                    .map(row -> {
                        Object[] columns = (Object[]) row;
                        return new PaperInventory(
                                (String) columns[0],          // productName
                                ((Number) columns[1]).intValue(), // quantity
                                (Integer) columns[2]           // rop
                        );
                    })
                    .toArray(PaperInventory[]::new);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching material inventory: " + e.getMessage());
        }
    }
}