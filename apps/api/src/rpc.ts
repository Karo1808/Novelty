import { hc } from "hono/client";
import type app from "./app";

// eslint-disable-next-line unused-imports/no-unused-vars
const client = hc<typeof app>("");
export type Client = typeof client;

export function generateRpcClient(...args: Parameters<typeof hc>): Client {
  return hc<typeof app>(...args);
}
