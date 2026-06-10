import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily to avoid crashing on start if API key is not supplied.
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Routes
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, role, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      // Return a simulated, helpful, creative game-dev team response in case API key is missing
      console.warn("Gemini API client could not initialize:", err.message);
      
      const responses = [
        "**[DEVELOPMENT TEAM SIMULATION]** ¡Excelente idea! Como tu Diseñador de Juego Senior, considero que agregar esa regla de desempate en los minijuegos de Combate mantendrá el ritmo cardíaco de los jugadores al máximo.",
        "**[DEVELOPMENT TEAM SIMULATION]** ¡Saludos del Productor! Analizando el costo de renderizado en Android de esa mecánica, creo que si agrupamos las partículas del Fénix Dorado en un Atlas de Texturas optimizado lo correremos a 60 FPS estables.",
        "**[DEVELOPMENT TEAM SIMULATION]** ¡Hola! Tu Director Creativo por aquí. Ese enfoque gráfico estilizado, combinando sombreadores tipo cel-shading en los personajes y un delineado tipo cómic, definirá la identidad visual de 'Clashtoon Party' frente a Stumble Guys.",
        "**[DEVELOPMENT TEAM SIMULATION]** Tu Diseñador de Economía reportándose. Si controlamos el multiplicador del Gato de la Fortuna para que solo dé monedas de bonificación en los minijuegos 'Todos contra Todos', la curva inflacionaria de los Trofeos se mantendrá balanceada."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return res.json({
        text: `${randomResponse}\n\n*(Nota: Si configuras tu clave GEMINI_API_KEY en la sección de Secrets en AI Studio, podré usar el modelo Gemini 3.5 real para co-diseñar y responderte con análisis súper detallados de mecánicas de inmediato)*`
      });
    }

    const systemInstruction = `
Eres la mesa de debate y el EQUIPO COMPLETO DE DESARROLLO DE VIDEOJUEGOS de "Clashtoon Party":
1. Director Creativo (apasionado por el arte cartoon, la emoción, la marca y la estética visual retro/moderna).
2. Diseñador de Juego Senior (obsesionado con mecánicas divertidas, controles móviles y dinámicas divertidas).
3. Diseñador de Economía (cuidadoso con el grindeo de monedas, el valor de los trofeos y la prevención de inflación).
4. Diseñador de Sistemas Multijugador (perfeccionista con la conectividad, tiempos de emparejamiento y crossplay).
5. Diseñador UX/UI (obsesionado con el espacio táctil móvil, retroalimentación visual inmediata y diseño comprensible).
6. Productor (atento a los plazos, el alcance del MVP, la viabilidad técnica y el presupuesto).
7. Arquitecto de Software y Desarrollador Experto en Unity (técnico, riguroso, sugiere patrones ScriptableObjects, Eventos, Addressables, etc.).

Cuando respondes, usa una conversación corta o una propuesta unificada donde los miembros del equipo aportan ideas desde su rol pertinente. Tus respuestas deben ser creativas, profesionales de videojuegos, en español, estructuradas con formato Markdown limpio y centradas en responder al usuario de forma súper práctica sobre "Clashtoon Party".
`;

    // Format contents for Gemini SDK (contents structure)
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.75,
        maxOutputTokens: 2048,
      }
    });

    res.json({
      text: response.text || "No se ha podido procesar la consulta."
    });
  } catch (error: any) {
    console.error("Gemini route error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in Development Mode (Vite)...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in Production Mode (Static assets)...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Clashtoon Party Portal running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Express startup fail:", error);
});
