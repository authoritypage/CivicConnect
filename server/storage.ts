import { cities, officers, cases, type City, type Officer, type Case, type InsertCity, type InsertOfficer, type InsertCase } from "@shared/schema";

export interface IStorage {
  // Cities
  getCities(): Promise<City[]>;
  getCityById(id: number): Promise<City | undefined>;
  
  // Officers
  getOfficers(): Promise<Officer[]>;
  getOfficersByCity(cityName: string): Promise<Officer[]>;
  getOfficerById(id: number): Promise<Officer | undefined>;
  
  // Cases
  getCases(): Promise<Case[]>;
  getCasesByCity(cityName: string): Promise<Case[]>;
  getCasesByOfficer(officerId: number): Promise<Case[]>;
  getCaseById(id: number): Promise<Case | undefined>;
}

export class MemStorage implements IStorage {
  private cities: Map<number, City>;
  private officers: Map<number, Officer>;
  private cases: Map<number, Case>;
  private currentCityId: number;
  private currentOfficerId: number;
  private currentCaseId: number;

  constructor() {
    this.cities = new Map();
    this.officers = new Map();
    this.cases = new Map();
    this.currentCityId = 1;
    this.currentOfficerId = 1;
    this.currentCaseId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize cities
    const citiesData: Array<Omit<City, 'id'>> = [
      { name: "Santa Barbara", population: 91364, transparencyScore: 82, activeCases: 8, totalOfficials: 47, status: "active" },
      { name: "Santa Maria", population: 109707, transparencyScore: 74, activeCases: 12, totalOfficials: 52, status: "active" },
      { name: "Lompoc", population: 43834, transparencyScore: 85, activeCases: 3, totalOfficials: 28, status: "active" },
      { name: "Carpinteria", population: 13264, transparencyScore: 94, activeCases: 0, totalOfficials: 18, status: "active" },
      { name: "Solvang", population: 5245, transparencyScore: 91, activeCases: 0, totalOfficials: 12, status: "active" },
      { name: "Goleta", population: 32690, transparencyScore: 88, activeCases: 0, totalOfficials: 24, status: "active" },
      { name: "Buellton", population: 5161, transparencyScore: 92, activeCases: 0, totalOfficials: 10, status: "active" },
      { name: "Guadalupe", population: 7681, transparencyScore: 79, activeCases: 0, totalOfficials: 15, status: "active" },
    ];

    citiesData.forEach(city => {
      const newCity: City = { ...city, id: this.currentCityId++ };
      this.cities.set(newCity.id, newCity);
    });

    // Initialize officers
    const officersData: Array<Omit<Officer, 'id'>> = [
      { name: "Jennifer Martinez", position: "Mayor", cityId: 1, cityName: "Santa Barbara", term: "2020-2024", status: "active", activeCases: 0 },
      { name: "Robert Chen", position: "Police Chief", cityId: 1, cityName: "Santa Barbara", term: "2019-Present", status: "under_review", activeCases: 2 },
      { name: "Patricia Williams", position: "City Manager", cityId: 1, cityName: "Santa Barbara", term: "2021-Present", status: "active", activeCases: 0 },
      { name: "Michael Torres", position: "District Attorney", cityId: 1, cityName: "Santa Barbara County", term: "2022-2026", status: "active", activeCases: 0 },
      { name: "Alice Patino", position: "Mayor", cityId: 2, cityName: "Santa Maria", term: "2018-2022", status: "investigation", activeCases: 4 },
      { name: "David Rodriguez", position: "Police Chief", cityId: 2, cityName: "Santa Maria", term: "2020-Present", status: "active", activeCases: 1 },
      { name: "Maria Gonzalez", position: "City Manager", cityId: 2, cityName: "Santa Maria", term: "2019-Present", status: "active", activeCases: 0 },
      { name: "James Wilson", position: "Mayor", cityId: 3, cityName: "Lompoc", term: "2021-2025", status: "active", activeCases: 0 },
      { name: "Sarah Thompson", position: "Police Chief", cityId: 3, cityName: "Lompoc", term: "2022-Present", status: "active", activeCases: 0 },
    ];

    officersData.forEach(officer => {
      const newOfficer: Officer = { ...officer, id: this.currentOfficerId++ };
      this.officers.set(newOfficer.id, newOfficer);
    });

    // Initialize cases
    const casesData: Array<Omit<Case, 'id'>> = [
      {
        title: "Misuse of Public Funds Investigation",
        description: "Investigation into alleged misappropriation of $2.3M in municipal development funds",
        severity: "critical",
        cityId: 2,
        cityName: "Santa Maria",
        officerId: 5,
        officerName: "Alice Patino",
        status: "Under Investigation",
        dateReported: new Date("2023-11-15"),
      },
      {
        title: "Police Conduct Review",
        description: "Internal affairs investigation regarding excessive force complaints",
        severity: "high",
        cityId: 1,
        cityName: "Santa Barbara",
        officerId: 2,
        officerName: "Robert Chen",
        status: "Internal Review",
        dateReported: new Date("2023-10-28"),
      },
      {
        title: "Procurement Process Audit",
        description: "Review of city contract bidding processes for compliance violations",
        severity: "medium",
        cityId: 3,
        cityName: "Lompoc",
        officerId: 8,
        officerName: "James Wilson",
        status: "Audit Phase",
        dateReported: new Date("2023-09-12"),
      },
      {
        title: "Conflict of Interest Review",
        description: "Business dealings with city contractors under investigation",
        severity: "high",
        cityId: 2,
        cityName: "Santa Maria",
        officerId: 5,
        officerName: "Alice Patino",
        status: "Under Investigation",
        dateReported: new Date("2023-10-05"),
      },
    ];

    casesData.forEach(caseData => {
      const newCase: Case = { ...caseData, id: this.currentCaseId++ };
      this.cases.set(newCase.id, newCase);
    });
  }

  async getCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }

  async getCityById(id: number): Promise<City | undefined> {
    return this.cities.get(id);
  }

  async getOfficers(): Promise<Officer[]> {
    return Array.from(this.officers.values());
  }

  async getOfficersByCity(cityName: string): Promise<Officer[]> {
    return Array.from(this.officers.values()).filter(officer => officer.cityName === cityName);
  }

  async getOfficerById(id: number): Promise<Officer | undefined> {
    return this.officers.get(id);
  }

  async getCases(): Promise<Case[]> {
    return Array.from(this.cases.values());
  }

  async getCasesByCity(cityName: string): Promise<Case[]> {
    return Array.from(this.cases.values()).filter(case_ => case_.cityName === cityName);
  }

  async getCasesByOfficer(officerId: number): Promise<Case[]> {
    return Array.from(this.cases.values()).filter(case_ => case_.officerId === officerId);
  }

  async getCaseById(id: number): Promise<Case | undefined> {
    return this.cases.get(id);
  }
}

export const storage = new MemStorage();
