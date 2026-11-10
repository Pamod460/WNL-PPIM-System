package lk.wnl.wijeya.util;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

/** Adds up GRN / issue line quantities per material or paper, so edits can change stock by the difference. */
public final class StockLines {

    private StockLines() {
    }

    /** item id -> total quantity on these lines. */
    public static <T> Map<Integer, Integer> totals(Collection<T> lines, Function<T, Integer> itemId,
                                                   Function<T, Integer> quantity) {
        Map<Integer, Integer> totals = new HashMap<>();
        if (lines == null) return totals;
        for (T line : lines) {
            Integer id = itemId.apply(line);
            Integer qty = quantity.apply(line);
            if (id != null && qty != null) totals.merge(id, qty, Integer::sum);
        }
        return totals;
    }

    /** item id -> (after - before), leaving out items that did not change. */
    public static Map<Integer, Integer> difference(Map<Integer, Integer> after, Map<Integer, Integer> before) {
        Set<Integer> ids = new HashSet<>(after.keySet());
        ids.addAll(before.keySet());
        Map<Integer, Integer> diff = new HashMap<>();
        for (Integer id : ids) {
            int change = after.getOrDefault(id, 0) - before.getOrDefault(id, 0);
            if (change != 0) diff.put(id, change);
        }
        return diff;
    }
}
