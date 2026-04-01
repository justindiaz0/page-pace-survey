import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const surveyResponsesTable = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  reading_frequency: text("reading_frequency").notNull(),
  reading_time: text("reading_time").notNull(),
  distractions: text("distractions").array().notNull(),
  motivation: text("motivation").array().notNull(),
  skipping_feeling: text("skipping_feeling").notNull(),
  consistency_helpers: text("consistency_helpers").array().notNull(),
  struggle_reason: text("struggle_reason").notNull(),
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponsesTable).omit({ id: true, created_at: true });
export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponseRow = typeof surveyResponsesTable.$inferSelect;
