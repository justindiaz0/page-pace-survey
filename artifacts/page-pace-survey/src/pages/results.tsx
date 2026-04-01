import { useEffect, useState } from "react";
import { supabase, SurveyRow, aggregateField, FrequencyCount } from "@/lib/supabase";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "hsl(262 80% 50%)",
  "hsl(280 65% 60%)",
  "hsl(300 50% 70%)",
  "hsl(240 50% 60%)",
  "hsl(220 60% 70%)",
  "hsl(262 40% 40%)",
];

interface AggregatedResults {
  total_responses: number;
  reading_frequency_distribution: FrequencyCount[];
  reading_time_distribution: FrequencyCount[];
  reading_duration_distribution: FrequencyCount[];
  distractions_distribution: FrequencyCount[];
  skipping_feeling_distribution: FrequencyCount[];
  consistency_helpers_distribution: FrequencyCount[];
}

export default function Results() {
  const [results, setResults] = useState<AggregatedResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("survey_responses")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      const rows = (data ?? []) as SurveyRow[];

      setResults({
        total_responses: rows.length,
        reading_frequency_distribution: aggregateField(rows, "reading_frequency"),
        reading_time_distribution: aggregateField(rows, "reading_time"),
        reading_duration_distribution: aggregateField(rows, "reading_duration"),
        distractions_distribution: aggregateField(rows, "distractions"),
        skipping_feeling_distribution: aggregateField(rows, "skipping_feeling"),
        consistency_helpers_distribution: aggregateField(rows, "consistency_helpers"),
      });

      setIsLoading(false);
    }

    fetchResults();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-8 w-full max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid gap-6">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !results) {
    return (
      <Layout>
        <div className="w-full max-w-md mx-auto mt-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error ?? "Failed to load survey results. Please try again later."}
            </AlertDescription>
          </Alert>
          <div className="mt-6 flex justify-center">
            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              Survey Results
            </h1>
          </div>
          <div
            className="bg-primary/5 text-primary px-4 py-2 rounded-lg font-medium border border-primary/10"
            data-testid="text-total-responses"
          >
            {results.total_responses} Total {results.total_responses === 1 ? "Response" : "Responses"}
          </div>
        </div>

        {results.total_responses === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No responses yet</p>
            <p className="text-sm mt-1">Be the first to take the survey!</p>
            <Link href="/survey">
              <Button className="mt-6" data-testid="button-take-survey-empty">Take Survey</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            {/* Reading Frequency */}
            <Card>
              <CardHeader>
                <CardTitle>Reading Frequency</CardTitle>
                <CardDescription>How often respondents read for enjoyment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.reading_frequency_distribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))" }}
                        contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Preferred Reading Time */}
            <Card>
              <CardHeader>
                <CardTitle>Preferred Reading Times</CardTitle>
                <CardDescription>When respondents plan to read</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.reading_time_distribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))" }}
                        contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distractions (Horizontal) */}
            <Card>
              <CardHeader>
                <CardTitle>Common Distractions</CardTitle>
                <CardDescription>What keeps respondents from reading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.distractions_distribution} layout="vertical" margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis type="category" dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} width={110} />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))" }}
                        contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Reading Duration */}
            <Card>
              <CardHeader>
                <CardTitle>Reading Session Length</CardTitle>
                <CardDescription>How long respondents typically read</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.reading_duration_distribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))" }}
                        contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Skipping Feelings (Pie) */}
            <Card>
              <CardHeader>
                <CardTitle>Feelings When Skipping</CardTitle>
                <CardDescription>How respondents feel when they miss a reading session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={results.skipping_feeling_distribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="count"
                        nameKey="label"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {results.skipping_feeling_distribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-4 pb-8">
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]" data-testid="button-return-home">
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
