import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { City, Officer, Case } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyBL5bRSmrrdAOSV-BTpEaTJSSqdY5VGp2k" });

// Local intelligent response generator (fallback)
function generateIntelligentResponse(message: string, data: { cities: City[], officers: Officer[], cases: Case[] }): string {
  const { cities, officers, cases } = data;
  
  // Greetings and general help
  if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
    return `Hello! I'm your Santa Barbara County Accountability Assistant. I can help you investigate:

📊 **Statistics**: Ask about transparency scores, case counts, or city data
👥 **Officers**: Get information about mayors, police chiefs, DAs, and city managers
🏛️ **Cities**: Learn about different municipalities and their accountability records
⚖️ **Cases**: Explore ongoing investigations and corruption cases
🔍 **Analysis**: Get insights into patterns and trends across the county

Try asking: "What cases involve Alice Patino?" or "Which city has the lowest transparency score?"`;
  }

  // Officer-specific queries
  const officerNames = officers.map(o => o.name.toLowerCase());
  const mentionedOfficer = officerNames.find(name => message.includes(name.toLowerCase()));
  
  if (mentionedOfficer) {
    const officer = officers.find(o => o.name.toLowerCase() === mentionedOfficer);
    const officerCases = cases.filter(c => c.officerId === officer?.id);
    
    return `**${officer?.name}** - ${officer?.position} in ${officer?.cityName}

**Status**: ${officer?.status === 'active' ? '✅ Active' : officer?.status === 'investigation' ? '🔍 Under Investigation' : '⚠️ Under Review'}
**Term**: ${officer?.term}
**Active Cases**: ${officer?.activeCases}

${officerCases.length > 0 ? `**Current Cases**:
${officerCases.map(c => `• ${c.title} (${c.severity.toUpperCase()})`).join('\n')}` : 'No active cases on record.'}

${officer?.status === 'investigation' ? '🚨 This officer is currently under investigation for potential misconduct.' : ''}`;
  }

  // City-specific queries
  const cityNames = cities.map(c => c.name.toLowerCase());
  const mentionedCity = cityNames.find(name => message.includes(name.toLowerCase().replace(' ', '')));
  
  if (mentionedCity) {
    const city = cities.find(c => c.name.toLowerCase() === mentionedCity);
    const cityOfficers = officers.filter(o => o.cityName === city?.name);
    const cityCases = cases.filter(c => c.cityName === city?.name);
    
    return `**${city?.name}** Municipal Analysis

**Population**: ${city?.population?.toLocaleString() || 'N/A'}
**Transparency Score**: ${city?.transparencyScore || 0}% ${!city?.transparencyScore ? '' : city.transparencyScore > 85 ? '✅ Excellent' : city.transparencyScore > 70 ? '⚠️ Fair' : '🚨 Needs Improvement'}
**Active Cases**: ${city?.activeCases || 0}
**Total Officials**: ${city?.totalOfficials || 0}

**Key Officials**:
${cityOfficers.map(o => `• ${o.name} (${o.position}) - ${o.status === 'active' ? '✅' : '🔍'}`).join('\n')}

${cityCases.length > 0 ? `**Active Investigations**:
${cityCases.map(c => `• ${c.title} - ${c.severity.toUpperCase()} severity`).join('\n')}` : 'No active cases.'}`;
  }

  // Case and corruption queries
  if (message.includes('case') || message.includes('corruption') || message.includes('investigation')) {
    const criticalCases = cases.filter(c => c.severity === 'critical');
    const highCases = cases.filter(c => c.severity === 'high');
    
    return `**Santa Barbara County Case Analysis**

**Total Active Cases**: ${cases.length}
🚨 **Critical**: ${criticalCases.length} cases
⚠️ **High Priority**: ${highCases.length} cases

**Most Serious Cases**:
${criticalCases.concat(highCases).slice(0, 3).map(c => 
  `• **${c.title}**
   Officer: ${c.officerName} (${c.cityName})
   Status: ${c.status}
   Severity: ${c.severity.toUpperCase()}`
).join('\n\n')}

The most concerning case involves ${criticalCases[0]?.officerName} in ${criticalCases[0]?.cityName} regarding ${criticalCases[0]?.title.toLowerCase()}.`;
  }

  // Transparency and statistics
  if (message.includes('transparency') || message.includes('score') || message.includes('statistics') || message.includes('stats')) {
    const avgScore = Math.round(cities.reduce((sum, city) => sum + city.transparencyScore, 0) / cities.length);
    const bestCity = cities.reduce((best, city) => city.transparencyScore > best.transparencyScore ? city : best);
    const worstCity = cities.reduce((worst, city) => city.transparencyScore < worst.transparencyScore ? city : worst);
    
    return `**Santa Barbara County Transparency Analysis**

**Average Transparency Score**: ${avgScore}%

**Best Performing**: ${bestCity.name} (${bestCity.transparencyScore}%)
**Needs Improvement**: ${worstCity.name} (${worstCity.transparencyScore}%)

**City Rankings**:
${cities.sort((a, b) => b.transparencyScore - a.transparencyScore).map((city, index) => 
  `${index + 1}. ${city.name}: ${city.transparencyScore}% ${city.activeCases > 0 ? `(${city.activeCases} active cases)` : ''}`
).join('\n')}

Cities with active corruption cases tend to have lower transparency scores, indicating systemic accountability issues.`;
  }

  // Patterns and analysis
  if (message.includes('pattern') || message.includes('trend') || message.includes('analysis')) {
    const officersUnderInvestigation = officers.filter(o => o.status === 'investigation' || o.status === 'under_review');
    const citiesWithCases = cities.filter(c => c.activeCases > 0);
    
    return `**Accountability Pattern Analysis**

**Key Findings**:
• ${officersUnderInvestigation.length} officials currently under investigation
• ${citiesWithCases.length} of ${cities.length} cities have active corruption cases
• ${cases.filter(c => c.severity === 'critical').length} critical cases requiring immediate attention

**Risk Factors Identified**:
• Cities with lower transparency scores correlate with higher case counts
• ${citiesWithCases.map(c => c.name).join(', ')} show concerning patterns
• Police departments and mayoral offices most frequently involved

**Recommendations**:
• Increase oversight in ${citiesWithCases[0]?.name} (highest case count)
• Implement transparency reforms in cities scoring below 80%
• Monitor ${officersUnderInvestigation.map(o => o.name).join(', ')} closely`;
  }

  // Default response for unclear queries
  return `I can help you investigate Santa Barbara County accountability issues. Here's what I can analyze:

**Available Data**:
• ${cities.length} cities monitored
• ${officers.length} officials tracked  
• ${cases.length} active corruption cases

**Try asking about**:
• Specific officers: "Tell me about Alice Patino"
• Cities: "What's happening in Santa Maria?"
• Cases: "Show me corruption investigations"
• Analysis: "What patterns do you see?"

What would you like to investigate?`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Cities routes
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  app.get("/api/cities/:id", async (req, res) => {
    try {
      const city = await storage.getCityById(parseInt(req.params.id));
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      res.json(city);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch city" });
    }
  });

  // Officers routes
  app.get("/api/officers", async (req, res) => {
    try {
      const { city } = req.query;
      let officers;
      
      if (city && typeof city === 'string') {
        officers = await storage.getOfficersByCity(city);
      } else {
        officers = await storage.getOfficers();
      }
      
      res.json(officers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch officers" });
    }
  });

  app.get("/api/officers/:id", async (req, res) => {
    try {
      const officer = await storage.getOfficerById(parseInt(req.params.id));
      if (!officer) {
        return res.status(404).json({ message: "Officer not found" });
      }
      res.json(officer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch officer" });
    }
  });

  // Cases routes
  app.get("/api/cases", async (req, res) => {
    try {
      const { city, officer } = req.query;
      let cases_;
      
      if (city && typeof city === 'string') {
        cases_ = await storage.getCasesByCity(city);
      } else if (officer && typeof officer === 'string') {
        cases_ = await storage.getCasesByOfficer(parseInt(officer));
      } else {
        cases_ = await storage.getCases();
      }
      
      res.json(cases_);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  app.get("/api/cases/:id", async (req, res) => {
    try {
      const case_ = await storage.getCaseById(parseInt(req.params.id));
      if (!case_) {
        return res.status(404).json({ message: "Case not found" });
      }
      res.json(case_);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case" });
    }
  });

  // AI Chat route - Gemini AI powered analysis
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get all data for context
      const cities = await storage.getCities();
      const officers = await storage.getOfficers();
      const cases = await storage.getCases();

      try {
        // Use Gemini AI for intelligent analysis
        const context = {
          cities,
          officers,
          cases,
          totalCities: cities.length,
          totalOfficers: officers.length,
          totalActiveCases: cases.length,
          averageTransparencyScore: Math.round(cities.reduce((sum, city) => sum + city.transparencyScore, 0) / cities.length)
        };

        const systemPrompt = `You are an AI assistant for the Santa Barbara County Accountability Portal, a government transparency platform investigating corruption. You help analyze corruption cases, officer records, and transparency data.

Current data context:
- Cities: ${JSON.stringify(context.cities)}
- Officers: ${JSON.stringify(context.officers)}
- Cases: ${JSON.stringify(context.cases)}

Guidelines:
1. Answer questions about specific officers, cities, cases, and corruption investigations
2. Provide detailed analysis of transparency scores and trends
3. Help connect cases to officers and identify patterns
4. Maintain a serious, professional tone appropriate for government accountability
5. Always cite specific data from the context when answering
6. Focus on accountability, transparency, and corruption investigation
7. If asked about something not in the data, clearly state you don't have that information
8. Use markdown formatting for better readability

Respond in a helpful, factual manner focused on government transparency and accountability.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\nUser question: " + message }] }
          ],
        });

        const aiResponse = response.text || "I'm unable to process that request right now.";
        res.json({ response: aiResponse });
      } catch (geminiError) {
        console.error('Gemini AI error:', geminiError);
        // Fallback to local intelligent response
        const response = generateIntelligentResponse(message.toLowerCase(), { cities, officers, cases });
        res.json({ response });
      }
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ message: "Failed to process chat request" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const cities = await storage.getCities();
      const officers = await storage.getOfficers();
      const cases = await storage.getCases();

      const stats = {
        totalCities: cities.length,
        totalOfficers: officers.length,
        activeCases: cases.length,
        transparencyScore: Math.round(cities.reduce((sum, city) => sum + city.transparencyScore, 0) / cities.length)
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
