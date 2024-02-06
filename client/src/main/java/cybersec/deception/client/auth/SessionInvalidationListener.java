package cybersec.deception.client.auth;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSession;
import java.util.Enumeration;

@WebListener
public class SessionInvalidationListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // Non è necessario fare nulla all'avvio dell'applicazione
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        ServletContext servletContext = sce.getServletContext();
        invalidateAllSessions(servletContext);
    }

    private void invalidateAllSessions(ServletContext servletContext) {
        Enumeration<String> sessionIds = servletContext.getAttributeNames();
        while (sessionIds.hasMoreElements()) {
            String sessionId = sessionIds.nextElement();
            HttpSession session = (HttpSession) servletContext.getAttribute(sessionId);
            session.invalidate(); // Invalida la sessione
        }
    }
}
