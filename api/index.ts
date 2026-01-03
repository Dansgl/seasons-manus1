import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Health check
  if (req.url?.includes("/api/health")) {
    res.status(200).json({ ok: true });
    return;
  }

  // tRPC
  if (req.url?.includes("/api/trpc")) {
    try {
      // Dynamic import to catch any errors
      const { fetchRequestHandler } = await import("@trpc/server/adapters/fetch");
      const { appRouter } = await import("../server/routers.js");

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
      console.error("Import/tRPC error:", error);
      res.status(500).json({
        error: error.message || "Internal server error",
        stack: error.stack?.split("\n").slice(0, 5)
      });
    }
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

  res.status(404).json({ error: "Not found" });
}
