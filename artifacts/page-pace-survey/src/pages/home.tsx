import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { BookOpen } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center flex-1 text-center space-y-8 py-12">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight text-foreground" data-testid="text-home-title">
            Page Pace Survey
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-home-description">
            A brief academic study on personal reading habits, consistency, and the challenges of staying engaged with books in a busy world.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-8">
          <Link href="/survey" className="w-full sm:w-auto" data-testid="link-take-survey">
            <Button size="lg" className="w-full text-base h-12 px-8 shadow-sm">
              Take Survey
            </Button>
          </Link>
          <Link href="/results" className="w-full sm:w-auto" data-testid="link-view-results">
            <Button variant="outline" size="lg" className="w-full text-base h-12 px-8">
              View Results
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
