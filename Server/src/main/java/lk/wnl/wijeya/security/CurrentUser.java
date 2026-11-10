package lk.wnl.wijeya.security;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/** The user making the current request, taken from the JWT (never from the request body). */
public final class CurrentUser {

    private CurrentUser() {
    }

    /** Username from the token, or null for a visitor who is not logged in. */
    public static String username() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) return null;
        return auth.getName();
    }

    public static boolean isAnonymous() {
        return username() == null;
    }
}
