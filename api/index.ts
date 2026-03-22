import "dotenv/config";
import { createApp } from "../server/app";

let appPromise: ReturnType<typeof createApp> | null = null;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = createApp({ mode: "production" });
  }

  const app = await appPromise;
  return app(req, res);
}
