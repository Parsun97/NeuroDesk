import express, { type Express } from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import healthRouter from "./routes/health";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Infra health checks (Render/Railway/etc. liveness & readiness probes) must
// never depend on third-party auth config. Mounted before Clerk so a bad or
// missing Clerk key can't make the platform think the whole service is down.
app.use("/api", healthRouter);

// ── Serve the built frontend as a single deployable service ─────────────────
// On Replit, the frontend runs as its own proxied dev/preview process, so this
// is a no-op there. Off Replit (Render, Railway, a VPS, etc.) there is no
// platform-level proxy to stitch a separate frontend + API together, so the
// API server serves the built static files itself and falls back to
// index.html for client-side routes. This requires the frontend to have been
// built first (`pnpm --filter @workspace/neurodesk run build`) so that
// artifacts/neurodesk/dist/public exists alongside this package at deploy time.
// Mounted before Clerk middleware: the SPA authenticates client-side with its
// own build-time publishable key, so serving its static files must not depend
// on the server's Clerk config succeeding.
const frontendDist = path.resolve(import.meta.dirname, "../../neurodesk/dist/public");
const hasFrontendBuild = fs.existsSync(path.join(frontendDist, "index.html"));

if (hasFrontendBuild) {
  app.use(express.static(frontendDist));
}

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

app.use("/api", router);

if (hasFrontendBuild) {
  app.use((req, res, next) => {
    if (req.path.startsWith("/api") || req.method !== "GET") return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
