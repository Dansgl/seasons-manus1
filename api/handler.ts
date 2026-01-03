import type { VercelRequest, VercelResponse } from "@vercel/node";
import "dotenv/config";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../server/routers";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Health check
  if (req.url?.includes("/api/health")) {
    res.status(200).json({ ok: true });
    return;
  }

  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.status(200).end();
    return;
  }

  // tRPC
  if (req.url?.includes("/api/trpc")) {
    try {
      const protocol = req.headers["x-forwarded-proto"] || "https";
      const host = req.headers.host || "localhost";
      const url = `${protocol}://${host}${req.url}`;

      const body = req.method !== "GET" && req.body ? JSON.stringify(req.body) : undefined;

      const fetchReq = new Request(url, {
        method: req.method || "GET",
        headers: Object.fromEntries(
          Object.entries(req.headers).filter(([_, v]) => v !== undefined) as [string, string][]
        ),
        body,
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: fetchReq,
        router: appRouter,
        createContext: async () => ({
          req: req as any,
          res: res as any,
          user: null,
        }),
      });

      res.setHeader("Access-Control-Allow-Origin", "*");
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      const responseBody = await response.text();
      res.status(response.status).send(responseBody);
    } catch (error: any) {
      console.error("tRPC error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
    return;
  }

  res.status(404).json({ error: "Not found" });
}
