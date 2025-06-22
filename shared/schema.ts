import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  population: integer("population").notNull(),
  transparencyScore: integer("transparency_score").notNull(),
  activeCases: integer("active_cases").notNull().default(0),
  totalOfficials: integer("total_officials").notNull().default(0),
  status: text("status").notNull().default("active"),
});

export const officers = pgTable("officers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  cityId: integer("city_id").references(() => cities.id),
  cityName: text("city_name").notNull(),
  term: text("term").notNull(),
  status: text("status").notNull().default("active"),
  activeCases: integer("active_cases").notNull().default(0),
});

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // critical, high, medium, low
  cityId: integer("city_id").references(() => cities.id),
  cityName: text("city_name").notNull(),
  officerId: integer("officer_id").references(() => officers.id),
  officerName: text("officer_name").notNull(),
  status: text("status").notNull(),
  dateReported: timestamp("date_reported").notNull(),
});

export const insertCitySchema = createInsertSchema(cities).omit({
  id: true,
});

export const insertOfficerSchema = createInsertSchema(officers).omit({
  id: true,
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
});

export type City = typeof cities.$inferSelect;
export type Officer = typeof officers.$inferSelect;
export type Case = typeof cases.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;
export type InsertOfficer = z.infer<typeof insertOfficerSchema>;
export type InsertCase = z.infer<typeof insertCaseSchema>;
