import type { VercelRequest, VercelResponse } from "@vercel/node";
import "dotenv/config";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.status(200).end();
    return;
  }

  // Health check endpoint
  if (req.url?.includes("/api/health")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ ok: true });
    return;
  }

  // tRPC handler
  if (req.url?.includes("/api/trpc")) {
    try {
      // Convert Vercel request to standard Request
      const protocol = req.headers["x-forwarded-proto"] || "https";
      const host = req.headers.host || "localhost";
      const url = `${protocol}://${host}${req.url}`;

      const body = req.method !== "GET" ? JSON.stringify(req.body) : undefined;

      const fetchReq = new Request(url, {
        method: req.method || "GET",
        headers: req.headers as HeadersInit,
        body,
      });

      const response = await fetchRequestHandler({
        endpoint: "/api/trpc",
        req: fetchReq,
        router: appRouter,
        createContext: async () => {
          // Simplified context for serverless
          return {
            req: req as any,
            res: res as any,
            user: null,
          };
        },
      });

      // Set CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");

      // Copy response headers
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      // Send response
      const responseBody = await response.text();
      res.status(response.status).send(responseBody);
    } catch (error) {
      console.error("tRPC error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
    return;
  }

  res.status(404).json({ error: "Not found" });
}
