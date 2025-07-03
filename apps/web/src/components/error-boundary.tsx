import { Button } from "@novelty/ui/components/button";
import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

export function ErrorBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  // TODO: Add production environment check to hide error details in production
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex flex-col items-center justify-center gap-8">
      <div className="max-w-2xl w-full bg-slate-800 rounded-lg p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-red-400 mb-4">
          Something went wrong
        </h1>
        <div className="bg-slate-700/50 rounded p-4 mb-6">
          <ErrorComponent error={error} />
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.invalidate()}
            className="bg-indigo-600 hover:bg-indigo-500 transition-all duration-200
          shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
          focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
          active:scale-95 active:bg-indigo-700 px-6 rounded-sm text-slate-200"
          >
            Try Again
          </Button>
          {isRoot ? (
            <Link to="/">
              <Button
                className="bg-slate-700 hover:bg-slate-600 transition-all duration-200
              shadow-lg shadow-slate-500/20 hover:shadow-slate-500/30
              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
              active:scale-95 active:bg-slate-600 px-6 rounded-sm text-slate-200"
              >
                Home
              </Button>
            </Link>
          ) : (
            <Button
              onClick={(e) => {
                window.history.back();
              }}
              className="bg-slate-700 hover:bg-slate-600 transition-all duration-200
            shadow-lg shadow-slate-500/20 hover:shadow-slate-500/30
            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
            active:scale-95 active:bg-slate-600 px-6 rounded-sm text-slate-200"
            >
              Go Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
