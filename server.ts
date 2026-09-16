import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middleware with safe limit for compressed log images (max 5mb)
app.use(express.json({ limit: '5mb' }));

// Lazy initialize Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment. Gemini calls will return structured fallback math.');
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// In-memory rate limiter: max 30 diagnostic audits per IP per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= 30) {
    return false;
  }
  current.count++;
  return true;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Diagnostic Audit API Route (Hero Feature)
app.post('/api/diagnostic/analyze', async (req, res) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a few minutes before submitting another shift audit.',
    });
  }

  try {
    const { title, siteName, shiftHours, machines, shiftNotes, logImageBase64 } = req.body;

    // Server-side validation
    if (!machines || !Array.isArray(machines) || machines.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one machine for telemetry audit.' });
    }

    if (machines.length > 30) {
      return res.status(400).json({ error: 'Maximum 30 machines per audit batch.' });
    }

    const validatedShiftHours = Math.max(1, Math.min(24, Number(shiftHours) || 8));
    const validatedSiteName = typeof siteName === 'string' && siteName.trim() ? siteName.trim().slice(0, 100) : 'Job Site Alpha';
    const validatedTitle = typeof title === 'string' && title.trim() ? title.trim().slice(0, 120) : 'Shift Telematics Audit';

    // Normalize input machines
    const cleanMachines = machines.map((m: any, idx: number) => {
      const totalEngineHours = Math.max(0, Math.min(validatedShiftHours, Number(m.totalEngineHours) || validatedShiftHours));
      const activeWorkingHours = Math.max(0, Math.min(totalEngineHours, Number(m.activeWorkingHours) || Math.max(0, totalEngineHours * 0.45)));
      const idleHours = Math.max(0, Number((totalEngineHours - activeWorkingHours).toFixed(2)));
      const hourlyOperatorRate = Math.max(20, Math.min(300, Number(m.hourlyOperatorRate) || 68));
      const fuelCostPerHour = Math.max(5, Math.min(150, Number(m.fuelCostPerHour) || 28));

      return {
        unitNumber: typeof m.unitNumber === 'string' && m.unitNumber.trim() ? m.unitNumber.trim().slice(0, 30) : `EQ-0${idx + 1}`,
        makeModel: typeof m.makeModel === 'string' && m.makeModel.trim() ? m.makeModel.trim().slice(0, 60) : 'Cat / Komatsu / Deere Unit',
        totalEngineHours,
        activeWorkingHours,
        idleHours,
        hourlyOperatorRate,
        fuelCostPerHour,
      };
    });

    // Base deterministic engineering calculations
    let totalShiftCost = 0;
    let activeWorkCost = 0;
    let idlePayrollWaste = 0;
    let idleFuelWaste = 0;

    const machineBreakdown = cleanMachines.map((m) => {
      const totalCost = m.totalEngineHours * (m.hourlyOperatorRate + m.fuelCostPerHour);
      const activeCost = m.activeWorkingHours * (m.hourlyOperatorRate + m.fuelCostPerHour);
      const idleLabor = m.idleHours * m.hourlyOperatorRate;
      // Equipment burns ~30-40% fuel when idling vs full load
      const idleFuel = m.idleHours * (m.fuelCostPerHour * 0.4);
      const totalWasted = idleLabor + idleFuel;
      const idlePercentage = m.totalEngineHours > 0 ? (m.idleHours / m.totalEngineHours) * 100 : 0;

      totalShiftCost += totalCost;
      activeWorkCost += activeCost;
      idlePayrollWaste += idleLabor;
      idleFuelWaste += idleFuel;

      return {
        unitNumber: m.unitNumber,
        makeModel: m.makeModel,
        totalEngineHours: Number(m.totalEngineHours.toFixed(1)),
        activeHours: Number(m.activeWorkingHours.toFixed(1)),
        idleHours: Number(m.idleHours.toFixed(1)),
        idlePercentage: Number(idlePercentage.toFixed(1)),
        idlePayrollLoss: Math.round(idleLabor),
        idleFuelLoss: Math.round(idleFuel),
        totalWastedDollar: Math.round(totalWasted),
        keyBottleneck: idlePercentage > 50 ? 'Haul truck queuing / grade check standby' : 'Cycle turnaround delay',
      };
    });

    const totalWastedCost = idlePayrollWaste + idleFuelWaste;
    const efficiencyPercentage = totalShiftCost > 0 ? ((totalShiftCost - totalWastedCost) / totalShiftCost) * 100 : 0;
    // 22 working shifts per month
    const monthlyLossProjection = Math.round(totalWastedCost * 22);
    // Remote command: 1 remote operator handles 2.5 seats on average across sites, cutting 60% of idle standby wages
    const remoteConsolidationPotential = Math.round(idlePayrollWaste * 0.65 * 22);

    // Call Gemini for high-level site engineering synthesis & supervisory recommendations
    let aiSynthesis = {
      executiveSummary: `Fleet operated at ${efficiencyPercentage.toFixed(1)}% labor efficiency. $${Math.round(totalWastedCost).toLocaleString()} in unworked operator wages and idle fuel was consumed during ${validatedShiftHours}-hour shift across ${cleanMachines.length} machines.`,
      recommendations: [
        'Stagger morning haul-truck departure to eliminate excavator staging backlog at site entry.',
        'Install remote camera telemetry on the primary dozer to enable cross-site grading coverage.',
        'Implement standardized standby throttle protocols to curb idle fuel burn during wait cycles.',
      ],
      machineBottlenecks: cleanMachines.map((m) => ({
        unitNumber: m.unitNumber,
        bottleneck: m.idleHours > 3 ? 'Excessive waiting for haul truck staging' : 'Normal cycle pacing',
      })),
    };

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        const prompt = `You are a heavy civil equipment telematics engineer and construction economist.
Analyze this shift telematics data for a small fleet (2-20 machines):
Site: ${validatedSiteName} (${validatedShiftHours}hr shift)
Notes: ${shiftNotes || 'Standard shift'}
Machines:
${JSON.stringify(cleanMachines, null, 2)}
Calculated Metrics:
Total Shift Cost: $${Math.round(totalShiftCost)}
Active Work Value: $${Math.round(activeWorkCost)}
Idle Payroll Waste: $${Math.round(idlePayrollWaste)}
Idle Fuel Waste: $${Math.round(idleFuelWaste)}
Overall Efficiency: ${efficiencyPercentage.toFixed(1)}%
Monthly Loss Projection: $${monthlyLossProjection}
Remote Command Monthly Savings: $${remoteConsolidationPotential}

Provide a concise, highly pragmatic executive summary (2-3 sentences), 3 specific operational recommendations for the fleet supervisor, and the primary bottleneck for each machine.`;

        // Content parts (including image if provided)
        const parts: any[] = [{ text: prompt }];
        if (logImageBase64 && typeof logImageBase64 === 'string') {
          // Extract base64 without prefix
          const base64Data = logImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
          parts.push({
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          });
        }

        // Use strongest frontier model (gemini-3.1-pro-preview or gemini-3.7-flash)
        let modelName = 'gemini-3.1-pro-preview';
        let response;
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  executiveSummary: { type: Type.STRING },
                  recommendations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  machineBottlenecks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        unitNumber: { type: Type.STRING },
                        bottleneck: { type: Type.STRING },
                      },
                      required: ['unitNumber', 'bottleneck'],
                    },
                  },
                },
                required: ['executiveSummary', 'recommendations'],
              },
            },
          });
        } catch (modelErr) {
          console.warn('Pro model request error, falling back to gemini-3.7-flash:', modelErr);
          response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: { parts },
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  executiveSummary: { type: Type.STRING },
                  recommendations: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  machineBottlenecks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        unitNumber: { type: Type.STRING },
                        bottleneck: { type: Type.STRING },
                      },
                      required: ['unitNumber', 'bottleneck'],
                    },
                  },
                },
                required: ['executiveSummary', 'recommendations'],
              },
            },
          });
        }

        if (response && response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed.executiveSummary) aiSynthesis.executiveSummary = parsed.executiveSummary;
          if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
            aiSynthesis.recommendations = parsed.recommendations.slice(0, 4);
          }
          if (Array.isArray(parsed.machineBottlenecks)) {
            aiSynthesis.machineBottlenecks = parsed.machineBottlenecks;
          }
        }
      } catch (geminiError) {
        console.error('Gemini synthesis notice:', geminiError);
        // Retains base deterministic engineering calculations safely
      }
    }

    // Merge machine bottlenecks into machine breakdown
    const finalBreakdown = machineBreakdown.map((item) => {
      const match = aiSynthesis.machineBottlenecks?.find((b: any) => b.unitNumber === item.unitNumber);
      return {
        ...item,
        keyBottleneck: match ? match.bottleneck : item.keyBottleneck,
      };
    });

    const auditResult = {
      title: validatedTitle,
      siteName: validatedSiteName,
      timestamp: new Date().toISOString(),
      shiftHours: validatedShiftHours,
      totalShiftCost: Math.round(totalShiftCost),
      activeWorkCost: Math.round(activeWorkCost),
      idlePayrollWaste: Math.round(idlePayrollWaste),
      idleFuelWaste: Math.round(idleFuelWaste),
      totalWastedCost: Math.round(totalWastedCost),
      efficiencyPercentage: Number(efficiencyPercentage.toFixed(1)),
      monthlyLossProjection,
      remoteConsolidationPotential,
      machineBreakdown: finalBreakdown,
      recommendations: aiSynthesis.recommendations,
      executiveSummary: aiSynthesis.executiveSummary,
    };

    res.json(auditResult);
  } catch (error) {
    console.error('Diagnostic error:', error);
    res.status(500).json({
      error: 'Failed to process shift telematics audit. Please verify input values and try again.',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// Start server and mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Rigpilot server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
