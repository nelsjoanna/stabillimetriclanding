import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { setupSecurityHeaders, setupTrustProxy, apiLimiter } from "./security";
import { setupSession } from "./auth";
import { registerAuthRoutes } from "./auth-routes";
import { validateEnv } from "./env";

// Validate environment variables on startup
try {
  validateEnv();
} catch (error) {
  console.error("❌", error);
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Security: Trust proxy for accurate IP addresses (important for Railway)
setupTrustProxy(app);

// Security: Set security headers
setupSecurityHeaders(app);

// Security: Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// Body parsing (must come after security middleware)
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
    limit: "10mb", // Prevent large payload attacks
  }),
);

app.use(express.urlencoded({ extended: false, limit: "10mb" }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Setup session and authentication (requires DATABASE_URL)
  if (process.env.DATABASE_URL) {
    setupSession(app);
    registerAuthRoutes(app);
  } else {
    console.warn(
      "⚠️  DATABASE_URL not set - authentication features disabled"
    );
  }

  await registerRoutes(httpServer, app);

  // Secure error handling - don't leak sensitive information
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    
    // In production, don't expose error details
    const message =
      process.env.NODE_ENV === "production"
        ? "An error occurred"
        : err.message || "Internal Server Error";

    // Log full error for debugging (but don't send to client)
    console.error("Error:", err);

    res.status(status).json({ error: message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
