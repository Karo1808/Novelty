import { Button } from "@novelty/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-semibold">BookStore</span>
        </div>
        <div className="flex gap-2">
          <Link to="/register">
            <Button
              variant="outline"
              className="transition-all duration-200 hover:bg-slate-700 hover:text-white
                        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                        active:scale-95 active:bg-slate-600 border-slate-600 px-6 rounded-sm"
            >
              Register
            </Button>
          </Link>
          <Link to="/">
            <Button
              className="bg-indigo-600 hover:bg-indigo-500 transition-all duration-200
                        shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500
                        active:scale-95 active:bg-indigo-700 px-6 rounded-sm"
            >
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to BookStore</h1>
        <p className="text-slate-300 mb-4">
          Discover our wide collection of books from various genres. Whether
          you're into fiction, non-fiction, or academic texts, we have something
          for everyone.
        </p>
        <p className="text-slate-300">
          Our mission is to provide quality books at affordable prices while
          supporting authors and publishers worldwide.
        </p>
      </main>
    </div>
  );
}
