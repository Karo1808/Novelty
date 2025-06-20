import type app from "./app";
import { hc } from "hono/client";

// eslint-disable-next-line unused-imports/no-unused-vars
const client = hc<typeof app>("");
export type Client = typeof client;

export function generateRpcClient(...args: Parameters<typeof hc>): Client {
  return hc<typeof app>(...args);
}
