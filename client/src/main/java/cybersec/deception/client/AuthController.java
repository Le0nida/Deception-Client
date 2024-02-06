package cybersec.deception.client;

import cybersec.deception.client.auth.FileAuthenticationManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {

    private final FileAuthenticationManager authenticationManager;
    @Autowired
    public AuthController(FileAuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttributes) {
        this.authenticationManager.logout((String) session.getAttribute("username"));
        session.invalidate();
        redirectAttributes.addAttribute("logout", "true");
        return showLoginForm();
    }

    @PostMapping("/login")
    public String login(@RequestParam("username") String username, @RequestParam("password") String password, HttpServletRequest request, RedirectAttributes redirectAttributes) {
        boolean success = this.authenticationManager.login(username, password);
        if (success) {
            // Creazione della sessione HTTP con timeout di 60 minuti
            HttpSession session = request.getSession(true);
            session.setMaxInactiveInterval(60 * 60); // 60 minuti
            session.setAttribute("username", username);

            return "redirect:/";
        }
        else {
            if (this.authenticationManager.userExists(username)) {
                redirectAttributes.addAttribute("error", "La password è errata");
            }
            else {
                redirectAttributes.addAttribute("error", "L'utente non esiste");
            }
            return showLoginForm();
        }
    }

}
