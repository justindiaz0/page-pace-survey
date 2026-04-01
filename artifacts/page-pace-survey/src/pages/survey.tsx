import { useState } from "react";
import { supabase, SurveySubmission } from "@/lib/supabase";
import { Layout } from "@/components/layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const surveySchema = z.object({
  reading_frequency: z.string({ required_error: "Please select your reading frequency." }),
  reading_time: z.string({ required_error: "Please select when you plan to read." }),
  distractions: z.array(z.string()).min(1, "Please select at least one distraction."),
  reading_duration: z.string({ required_error: "Please select how long you typically read." }),
  skipping_feeling: z.string({ required_error: "Please select how you feel when skipping." }),
  consistency_helpers: z.array(z.string()).min(1, "Please select at least one helper."),
  struggle_reason: z.string().min(5, "Please explain why you struggle briefly."),
});

type SurveyFormValues = z.infer<typeof surveySchema>;

const DISTRACTIONS_OPTIONS = [
  "Phone / social media",
  "School work",
  "Work/job",
  "Being too tired",
  "Other",
];

const CONSISTENCY_OPTIONS = [
  "Setting a routine",
  "Tracking progress",
  "Removing distractions",
  "Setting small goals",
  "Other",
];

export default function Survey() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      distractions: [],
      consistency_helpers: [],
      struggle_reason: "",
    },
  });

  async function onSubmit(data: SurveyFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    const payload: SurveySubmission = {
      reading_frequency: data.reading_frequency,
      reading_time: data.reading_time,
      distractions: data.distractions,
      reading_duration: data.reading_duration,
      skipping_feeling: data.skipping_feeling,
      consistency_helpers: data.consistency_helpers,
      struggle_reason: data.struggle_reason,
    };

    const { error } = await supabase.from("survey_responses").insert([payload]);

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (isSuccess) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Thank You!</h2>
          <p className="text-muted-foreground max-w-md">
            Your responses have been recorded successfully. Your input is valuable for understanding student reading habits.
          </p>
          <div className="pt-6">
            <Link href="/results">
              <Button size="lg" className="px-8 shadow-sm" data-testid="button-view-results">
                View Results
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div className="space-y-2">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Reading Habits Survey</h1>
          <p className="text-muted-foreground">Please answer all questions below.</p>
        </div>

        {submitError && (
          <Alert variant="destructive">
            <AlertTitle>Error submitting survey</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 pb-8">
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 md:p-8 space-y-8">

                {/* Q1 */}
                <FormField
                  control={form.control}
                  name="reading_frequency"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-semibold text-foreground">
                        1. How often do you read for personal enjoyment?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {["Every day", "Few times a week", "Once a week", "Rarely", "Never"].map((option) => (
                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} data-testid={`radio-freq-${option.replace(/\s+/g, "-")}`} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">{option}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Q2 */}
                <FormField
                  control={form.control}
                  name="reading_time"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-foreground">
                        2. When do you usually plan to read?
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-reading-time">
                            <SelectValue placeholder="Select a time..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Afternoon">Afternoon</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
                          <SelectItem value="Before bed">Before bed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Q3 */}
                <FormField
                  control={form.control}
                  name="distractions"
                  render={() => (
                    <FormItem className="space-y-4">
                      <div className="mb-4">
                        <FormLabel className="text-base font-semibold text-foreground">
                          3. What distracts you from reading?
                        </FormLabel>
                        <FormDescription>Select all that apply.</FormDescription>
                      </div>
                      {DISTRACTIONS_OPTIONS.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="distractions"
                          render={({ field }) => (
                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) =>
                                    checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(field.value?.filter((v) => v !== item))
                                  }
                                  data-testid={`checkbox-distraction-${item.replace(/[\s\/]+/g, "-")}`}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">{item}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Q4 */}
                <FormField
                  control={form.control}
                  name="reading_duration"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-foreground">
                        4. How long do you typically read?
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-reading-duration">
                            <SelectValue placeholder="Select duration..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Less than 10 minutes">Less than 10 minutes</SelectItem>
                          <SelectItem value="10–20 minutes">10–20 minutes</SelectItem>
                          <SelectItem value="20–30 minutes">20–30 minutes</SelectItem>
                          <SelectItem value="30+ minutes">30+ minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Q5 */}
                <FormField
                  control={form.control}
                  name="skipping_feeling"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-base font-semibold text-foreground">
                        5. How do you feel when you skip reading?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {["Guilty", "Indifferent", "Frustrated", "Motivated to try again"].map((option) => (
                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} data-testid={`radio-feeling-${option.replace(/\s+/g, "-")}`} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">{option}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Q6 */}
                <FormField
                  control={form.control}
                  name="consistency_helpers"
                  render={() => (
                    <FormItem className="space-y-4">
                      <div className="mb-4">
                        <FormLabel className="text-base font-semibold text-foreground">
                          6. What helps you stay consistent?
                        </FormLabel>
                        <FormDescription>Select all that apply.</FormDescription>
                      </div>
                      {CONSISTENCY_OPTIONS.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="consistency_helpers"
                          render={({ field }) => (
                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) =>
                                    checked
                                      ? field.onChange([...field.value, item])
                                      : field.onChange(field.value?.filter((v) => v !== item))
                                  }
                                  data-testid={`checkbox-helper-${item.replace(/\s+/g, "-")}`}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">{item}</FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Q7 */}
                <FormField
                  control={form.control}
                  name="struggle_reason"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-semibold text-foreground">
                        7. Why do you struggle to read consistently?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Explain why it is hard to stay consistent…"
                          className="resize-none h-24"
                          data-testid="textarea-struggle-reason"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Link
                href="/results"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-survey-to-results"
              >
                Skip to results
              </Link>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="px-8 shadow-sm"
                data-testid="button-submit-survey"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Survey"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Layout>
  );
}
