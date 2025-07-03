import { Button } from "@novelty/ui/components/button";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-xl text-slate-300 max-w-md text-center">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => window.history.back()}
          className="bg-slate-700 hover:bg-slate-600 transition-all duration-200
          shadow-lg shadow-slate-500/20 hover:shadow-slate-500/30
          focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
          active:scale-95 active:bg-slate-600 px-6 rounded-sm text-slate-200"
        >
          Go Back
        </Button>
        <Link to="/">
          <Button
            className="bg-indigo-600 hover:bg-indigo-500 transition-all duration-200
            shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
            active:scale-95 active:bg-indigo-700 px-6 rounded-sm text-slate-200"
          >
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
