import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for high-res base64 image uploads
app.use(express.json({ limit: "25mb" }));

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-Memory Database for Marine Pollution Logs
let pollutionLogs: Array<{
  id: string;
  date: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  pollutionIndex: number;
  totalPlastics: number;
  totalMarineLife: number;
  primaryCategory: string;
  observer: string;
  notes: string;
  imageUrl?: string;
}> = [
  {
    id: "log-1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    locationName: "Bali Kuta Coastal Zone, Indonesia",
    coordinates: { lat: -8.7183, lng: 115.1686 },
    pollutionIndex: 78,
    totalPlastics: 18,
    totalMarineLife: 2,
    primaryCategory: "Plastic Bottles & Carrier Bags",
    observer: "EcoBeach Patrol Team A",
    notes: "High accumulation along high-tide line after tropical storm surge.",
    imageUrl: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "log-2",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    locationName: "Raja Ampat Reef Sanctuary, Indonesia",
    coordinates: { lat: -0.2312, lng: 130.5186 },
    pollutionIndex: 64,
    totalPlastics: 6,
    totalMarineLife: 14,
    primaryCategory: "Ghost Nets & Fishing Lines",
    observer: "Reef Check Diver Unit 4",
    notes: "Snagged monofilament net on live acropora coral wall. Diver intervention scheduled.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "log-3",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    locationName: "Monterey Bay Coastal Reserve, USA",
    coordinates: { lat: 36.6002, lng: -121.8947 },
    pollutionIndex: 28,
    totalPlastics: 3,
    totalMarineLife: 12,
    primaryCategory: "Microplastic Fragments",
    observer: "Pacific Coast Sentinel",
    notes: "Low density, but isolated styrofoam pieces detected in kelp bed zone.",
  },
  {
    id: "log-4",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    locationName: "Galapagos Marine Reserve, Ecuador",
    coordinates: { lat: -0.9538, lng: -90.9656 },
    pollutionIndex: 4,
    totalPlastics: 0,
    totalMarineLife: 22,
    primaryCategory: "None (Pristine)",
    observer: "Galapagos Conservation Trust",
    notes: "Pristine marine sanctuary benchmark survey. Healthy sea turtle foraging site.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "log-5",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    locationName: "Mediterranean Coastal Zone, Nice, France",
    coordinates: { lat: 43.6961, lng: 7.2718 },
    pollutionIndex: 52,
    totalPlastics: 11,
    totalMarineLife: 4,
    primaryCategory: "Plastic Cups & Straws",
    observer: "MedClean Marine Survey",
    notes: "High tourist activity shoreline litter.",
  },
  {
    id: "log-6",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    locationName: "Great Barrier Reef Northern Section, Australia",
    coordinates: { lat: -16.8286, lng: 145.7828 },
    pollutionIndex: 42,
    totalPlastics: 5,
    totalMarineLife: 19,
    primaryCategory: "Polyolefin Film & Caps",
    observer: "AIMS Marine Observer",
    notes: "Surface drift items entering reef channel during tidal shift.",
  },
];

// --- API ENDPOINTS --- //

// 1. Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiConfigured: !!ai });
});

// 2. Fetch Pollution Survey Logs
app.get("/api/logs", (_req, res) => {
  res.json(pollutionLogs);
});

// 3. Create New Survey Log
app.post("/api/logs", (req, res) => {
  try {
    const { locationName, coordinates, pollutionIndex, totalPlastics, totalMarineLife, primaryCategory, observer, notes, imageUrl } = req.body;
    
    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      locationName: locationName || "Unmapped Coastal Zone",
      coordinates: coordinates || { lat: 0, lng: 0 },
      pollutionIndex: Number(pollutionIndex) || 0,
      totalPlastics: Number(totalPlastics) || 0,
      totalMarineLife: Number(totalMarineLife) || 0,
      primaryCategory: primaryCategory || "Plastic Waste",
      observer: observer || "Anonymous Marine Observer",
      notes: notes || "",
      imageUrl: imageUrl || undefined,
    };

    pollutionLogs.unshift(newLog);
    res.json({ success: true, log: newLog });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to log survey" });
  }
});

// 4. AI Marine Litter & Plastic Detection Endpoint using Gemini 3.6 Flash
app.post("/api/detect", async (req, res) => {
  try {
    const { imageBase64, locationName, coordinates } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data in request" });
    }

    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured." });
      }
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });
    }

    // Clean base64 header if present
    const base64Clean = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    const promptText = `
You are an expert Marine Biologist and Environmental Computer Vision AI specializing in marine debris analysis and the TACO (Trash Annotations in Context) plastic taxonomy.
Analyze this beach or underwater ocean image to detect, identify, categorize, and locate all visible plastic items, non-plastic waste, and natural marine life / substrate.

Task Instructions:
1. Locate every distinct litter object and marine organism in the image.
2. For each detected object, output its bounding box as normalized integers from 0 to 1000 where [ymin, xmin, ymax, xmax] represents the box coordinates.
3. Classify each object into one of 4 main categories:
   - "Plastic Waste": Bottles, carrier bags, food packaging, foam, caps, utensils, ghost nets, lines, microplastic fragments.
   - "Non-Plastic Waste": Glass, metal cans, cardboard, fabric.
   - "Marine Life": Fish, coral, sea turtles, crabs, shellfish, seaweed, kelp.
   - "Natural Substrate": Sand, rocks, driftwood, shells.
4. If applicable, match the plastic item to a TACO dataset category (e.g. "TACO 1-01: Plastic bottle", "TACO 2-01: Single-use carrier bag", "TACO 3-01: Crisp/Snack packet", "TACO 4-01: Bottle cap", "TACO 6-01: Fishing Gear / Net", "TACO 7-01: Microplastic fragment").
5. Estimate typical decomposition time in years for each waste item in marine environments (e.g. plastic bottle = 450 years, plastic bag = 20 years, fishing net = 600 years, styrofoam = 500 years).
6. Assign Environmental Risk ("Low", "Medium", "High", "Critical").
7. Compute a total "Pollution Index" score from 0 to 100 based on the total quantity, toxicity, and density of plastics vs clean marine elements:
   - 0-15: Pristine / Clean
   - 16-35: Mild Pollution
   - 36-60: Moderate Pollution
   - 61-85: High Pollution
   - 86-100: Critical / Hazardous Spill Zone
8. Provide threat analysis on ingestion risk, entanglement hazard, toxic leaching, primary pollutant, and recommended action.

Return the response strictly matching the requested JSON schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Clean,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pollutionIndex: { type: Type.NUMBER, description: "Pollution index score from 0 to 100" },
            pollutionLevel: { type: Type.STRING, description: "Pristine, Mild, Moderate, High, or Critical" },
            summary: { type: Type.STRING, description: "Professional summary of detected pollution and ecosystem health" },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Plastic Waste, Non-Plastic Waste, Marine Life, or Natural Substrate" },
                  tacoCategory: { type: Type.STRING, description: "TACO dataset code and label if applicable" },
                  confidence: { type: Type.NUMBER, description: "Confidence score between 0.5 and 1.0" },
                  boundingBox: {
                    type: Type.OBJECT,
                    properties: {
                      ymin: { type: Type.NUMBER },
                      xmin: { type: Type.NUMBER },
                      ymax: { type: Type.NUMBER },
                      xmax: { type: Type.NUMBER },
                    },
                    required: ["ymin", "xmin", "ymax", "xmax"],
                  },
                  estimatedDecompositionYears: { type: Type.NUMBER },
                  environmentalRisk: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
                  description: { type: Type.STRING },
                },
                required: ["label", "category", "confidence", "environmentalRisk"],
              },
            },
            counts: {
              type: Type.OBJECT,
              properties: {
                totalItems: { type: Type.NUMBER },
                plasticsCount: { type: Type.NUMBER },
                nonPlasticWasteCount: { type: Type.NUMBER },
                marineLifeCount: { type: Type.NUMBER },
              },
              required: ["totalItems", "plasticsCount", "nonPlasticWasteCount", "marineLifeCount"],
            },
            threatAnalysis: {
              type: Type.OBJECT,
              properties: {
                ingestionRisk: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
                entanglementRisk: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
                toxicLeachRisk: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
                primaryPollutant: { type: Type.STRING },
                recommendedAction: { type: Type.STRING },
              },
              required: ["ingestionRisk", "entanglementRisk", "toxicLeachRisk", "primaryPollutant", "recommendedAction"],
            },
          },
          required: ["pollutionIndex", "pollutionLevel", "summary", "items", "counts", "threatAnalysis"],
        },
      },
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    // Format final structured response object
    const finalResult = {
      id: `det-${Date.now()}`,
      timestamp: new Date().toISOString(),
      imageUrl: imageBase64,
      locationName: locationName || "Coastal Beach / Marine Zone",
      coordinates: coordinates || { lat: -8.7183, lng: 115.1686 },
      pollutionIndex: parsedData.pollutionIndex ?? 50,
      pollutionLevel: parsedData.pollutionLevel ?? "Moderate",
      summary: parsedData.summary || "Marine detection analysis complete.",
      items: (parsedData.items || []).map((item: any, idx: number) => ({
        id: item.id || `item-${idx + 1}`,
        label: item.label || "Detected Object",
        category: item.category || "Plastic Waste",
        tacoCategory: item.tacoCategory,
        confidence: item.confidence ?? 0.9,
        boundingBox: item.boundingBox,
        estimatedDecompositionYears: item.estimatedDecompositionYears,
        environmentalRisk: item.environmentalRisk || "Medium",
        description: item.description || "",
      })),
      counts: parsedData.counts || {
        totalItems: parsedData.items?.length || 0,
        plasticsCount: (parsedData.items || []).filter((i: any) => i.category === "Plastic Waste").length,
        nonPlasticWasteCount: (parsedData.items || []).filter((i: any) => i.category === "Non-Plastic Waste").length,
        marineLifeCount: (parsedData.items || []).filter((i: any) => i.category === "Marine Life").length,
      },
      threatAnalysis: parsedData.threatAnalysis || {
        ingestionRisk: "Medium",
        entanglementRisk: "Medium",
        toxicLeachRisk: "Medium",
        primaryPollutant: "Plastic Waste",
        recommendedAction: "Regular coastal monitoring and waste interceptor deployment.",
      },
    };

    res.json(finalResult);
  } catch (err: any) {
    console.error("Gemini Detection Error:", err);
    res.status(500).json({
      error: "Failed to perform AI plastic pollution detection",
      details: err.message || String(err),
    });
  }
});

// --- VITE MIDDLEWARE SETUP --- //
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌊 Marine Litter Detection Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
