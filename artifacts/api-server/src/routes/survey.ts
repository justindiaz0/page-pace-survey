import { Router, type IRouter } from "express";
import { db, surveyResponsesTable } from "@workspace/db";
import {
  SubmitSurveyBody,
  GetSurveyResultsResponse,
  ListSurveyResponsesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/survey/submit", async (req, res): Promise<void> => {
  const parsed = SubmitSurveyBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid survey submission");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [response] = await db
    .insert(surveyResponsesTable)
    .values({
      reading_frequency: parsed.data.reading_frequency,
      reading_time: parsed.data.reading_time,
      distractions: parsed.data.distractions,
      motivation: parsed.data.motivation,
      skipping_feeling: parsed.data.skipping_feeling,
      consistency_helpers: parsed.data.consistency_helpers,
      struggle_reason: parsed.data.struggle_reason,
    })
    .returning();

  req.log.info({ id: response.id }, "Survey response submitted");
  res.status(201).json(response);
});

router.get("/survey/results", async (req, res): Promise<void> => {
  const responses = await db.select().from(surveyResponsesTable);

  const total_responses = responses.length;

  function countItems(items: string[]): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item] = (counts[item] ?? 0) + 1;
    }
    return counts;
  }

  function toFrequencyArray(counts: Record<string, number>) {
    return Object.entries(counts).map(([label, count]) => ({ label, count }));
  }

  const readingFreqCounts = countItems(responses.map((r) => r.reading_frequency));
  const readingTimeCounts = countItems(responses.map((r) => r.reading_time));
  const skippingFeelingCounts = countItems(responses.map((r) => r.skipping_feeling));

  const distractionsAll = responses.flatMap((r) => r.distractions);
  const distractionsCounts = countItems(distractionsAll);

  const consistencyHelpersAll = responses.flatMap((r) => r.consistency_helpers);
  const consistencyHelpersCounts = countItems(consistencyHelpersAll);

  const result = {
    total_responses,
    reading_frequency_distribution: toFrequencyArray(readingFreqCounts),
    reading_time_distribution: toFrequencyArray(readingTimeCounts),
    distractions_distribution: toFrequencyArray(distractionsCounts),
    skipping_feeling_distribution: toFrequencyArray(skippingFeelingCounts),
    consistency_helpers_distribution: toFrequencyArray(consistencyHelpersCounts),
  };

  res.json(GetSurveyResultsResponse.parse(result));
});

router.get("/survey/responses", async (_req, res): Promise<void> => {
  const responses = await db
    .select()
    .from(surveyResponsesTable)
    .orderBy(surveyResponsesTable.created_at);

  res.json(ListSurveyResponsesResponse.parse(responses));
});

export default router;
