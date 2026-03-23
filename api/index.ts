// @ts-ignore This file is generated during the build step.
import vercelHandler from "../dist/api/vercel.cjs";

const handler =
  typeof vercelHandler === "function"
    ? vercelHandler
    : (vercelHandler as { default?: unknown }).default;

export default handler;
