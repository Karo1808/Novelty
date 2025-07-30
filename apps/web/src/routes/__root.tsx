import { NotFound } from "@/components/not-found";
import { SentryErrorBoundary } from "@/components/sentry-error-boundary";
import appCss from "@/globals.css?url";
import { ThemeProvider } from "@/providers/theme-provider";
import type { RootContext } from "@/types";
import { Toaster } from "@novelty/ui/components/sonner";
import { wrapCreateRootRouteWithSentry } from "@sentry/tanstackstart-react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { type ReactNode } from "react";

export const Route = wrapCreateRootRouteWithSentry(
  createRootRouteWithContext<RootContext>(),
)({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <SentryErrorBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="h-[100vh]">
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
        <Toaster richColors position="top-right" />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
