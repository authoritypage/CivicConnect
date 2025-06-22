import { db } from "./db";
import { cities, officers, cases } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database with Santa Barbara County data...");

  // Clear existing data
  await db.delete(cases);
  await db.delete(officers);
  await db.delete(cities);

  // Insert cities
  const insertedCities = await db.insert(cities).values([
    { name: "Santa Barbara", population: 91364, transparencyScore: 82, activeCases: 8, totalOfficials: 47, status: "active" },
    { name: "Santa Maria", population: 109707, transparencyScore: 74, activeCases: 12, totalOfficials: 52, status: "active" },
    { name: "Lompoc", population: 43834, transparencyScore: 85, activeCases: 3, totalOfficials: 28, status: "active" },
    { name: "Carpinteria", population: 13264, transparencyScore: 94, activeCases: 0, totalOfficials: 18, status: "active" },
    { name: "Solvang", population: 5245, transparencyScore: 91, activeCases: 0, totalOfficials: 12, status: "active" },
    { name: "Goleta", population: 32690, transparencyScore: 88, activeCases: 0, totalOfficials: 24, status: "active" },
    { name: "Buellton", population: 5161, transparencyScore: 92, activeCases: 0, totalOfficials: 10, status: "active" },
    { name: "Guadalupe", population: 7681, transparencyScore: 79, activeCases: 0, totalOfficials: 15, status: "active" },
  ]).returning();

  // Insert officers
  const insertedOfficers = await db.insert(officers).values([
    { name: "Jennifer Martinez", position: "Mayor", cityId: insertedCities[0].id, cityName: "Santa Barbara", term: "2020-2024", status: "active", activeCases: 0 },
    { name: "Robert Chen", position: "Police Chief", cityId: insertedCities[0].id, cityName: "Santa Barbara", term: "2019-Present", status: "under_review", activeCases: 2 },
    { name: "Patricia Williams", position: "City Manager", cityId: insertedCities[0].id, cityName: "Santa Barbara", term: "2021-Present", status: "active", activeCases: 0 },
    { name: "Michael Torres", position: "District Attorney", cityId: insertedCities[0].id, cityName: "Santa Barbara County", term: "2022-2026", status: "active", activeCases: 0 },
    { name: "Alice Patino", position: "Mayor", cityId: insertedCities[1].id, cityName: "Santa Maria", term: "2018-2022", status: "investigation", activeCases: 4 },
    { name: "David Rodriguez", position: "Police Chief", cityId: insertedCities[1].id, cityName: "Santa Maria", term: "2020-Present", status: "active", activeCases: 1 },
    { name: "Maria Gonzalez", position: "City Manager", cityId: insertedCities[1].id, cityName: "Santa Maria", term: "2019-Present", status: "active", activeCases: 0 },
    { name: "James Wilson", position: "Mayor", cityId: insertedCities[2].id, cityName: "Lompoc", term: "2021-2025", status: "active", activeCases: 0 },
    { name: "Sarah Thompson", position: "Police Chief", cityId: insertedCities[2].id, cityName: "Lompoc", term: "2022-Present", status: "active", activeCases: 0 },
  ]).returning();

  // Insert cases
  await db.insert(cases).values([
    {
      title: "Misuse of Public Funds Investigation",
      description: "Investigation into alleged misappropriation of $2.3M in municipal development funds",
      severity: "critical",
      cityId: insertedCities[1].id,
      cityName: "Santa Maria",
      officerId: insertedOfficers[4].id,
      officerName: "Alice Patino",
      status: "Under Investigation",
      dateReported: new Date("2023-11-15"),
    },
    {
      title: "Police Conduct Review",
      description: "Internal affairs investigation regarding excessive force complaints",
      severity: "high",
      cityId: insertedCities[0].id,
      cityName: "Santa Barbara",
      officerId: insertedOfficers[1].id,
      officerName: "Robert Chen",
      status: "Internal Review",
      dateReported: new Date("2023-10-28"),
    },
    {
      title: "Procurement Process Audit",
      description: "Review of city contract bidding processes for compliance violations",
      severity: "medium",
      cityId: insertedCities[2].id,
      cityName: "Lompoc",
      officerId: insertedOfficers[7].id,
      officerName: "James Wilson",
      status: "Audit Phase",
      dateReported: new Date("2023-09-12"),
    },
    {
      title: "Conflict of Interest Review",
      description: "Business dealings with city contractors under investigation",
      severity: "high",
      cityId: insertedCities[1].id,
      cityName: "Santa Maria",
      officerId: insertedOfficers[4].id,
      officerName: "Alice Patino",
      status: "Under Investigation",
      dateReported: new Date("2023-10-05"),
    },
  ]);

  console.log("Database seeded successfully!");
}

// Run seeding if this file is executed directly
seedDatabase().catch(console.error);

export { seedDatabase };