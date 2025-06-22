import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./vite"; // Only import what's actually exported

// Define a local log function for now; you can expand or replace this later
const log = (...args: any[]) => console.log(...args);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // --- START: Vite/Static Handling ---
  // For future expansion: setupVite can be implemented and exported from vite.ts
  if (app.get("env") === "development") {
    // Uncomment and implement setupVite in vite.ts if/when needed:
    // await setupVite(app, server);
    log("setupVite would run here in development mode.");
  } else {
    serveStatic(app);
  }
  // --- END: Vite/Static Handling ---

  // Define the port, prioritizing the environment variable provided by Railway (or Replit)
  // The '5000' is a fallback for local development if process.env.PORT is not set.
  const port = parseInt(process.env.PORT || "5000", 10);

  server.listen(
    {
      port,
      host: "0.0.0.0", // This is correct for Railway and production, keep it!
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
