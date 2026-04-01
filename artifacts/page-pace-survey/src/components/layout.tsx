import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center bg-background text-foreground font-sans">
      <main className="w-full max-w-2xl px-6 py-12 flex-1 flex flex-col animate-in fade-in duration-500">
        {children}
      </main>
      <footer className="w-full text-center py-6 text-sm text-muted-foreground border-t border-border mt-auto">
        Survey by Justin Diaz, BAIS:3300 - Spring 2026
      </footer>
    </div>
  );
}
