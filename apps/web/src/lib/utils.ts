import { getCookie, getHeaders } from "@tanstack/react-start/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAuthHeaders() {
  const session = getCookie("session");
  const cookies = getHeaders().cookie;

  return { session, cookies: { cookie: cookies ?? "" } };
}
