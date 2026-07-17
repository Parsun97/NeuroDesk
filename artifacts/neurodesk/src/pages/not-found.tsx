import { Link } from "wouter";
import { Bot } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-8">
        <Bot className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-7xl font-black text-indigo-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-3">Page not found</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
        Go home
      </Link>
    </div>
  );
}
