import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Compass, Award, Sparkles, Users, CheckCircle, Gamepad2, Coins, 
  MessageSquare, RotateCcw, FileText, Layers, Activity, TrendingUp, 
  Smartphone, PlayCircle, ShoppingBag, Calendar, ShieldAlert, Wrench, 
  Send, RefreshCw, Trophy, Star, Crown, BookOpen, Skull, ShieldCheck,
  User, Check, ChevronRight, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CHARACTERS, PETS, MINIGAMES, DIVINE_INVOCATIONS, 
  BOARD_SECTORS, SANDBOX_BOARD_NODES, COMPARATIVE_ANALYSIS 
} from "./data";
import { Character, Pet, Minigame, DivineInvocation } from "./types";

export default function App() {
  // System tabs: 'gdd', 'sandbox', 'chatbot'
  const [activeTab, setActiveTab] = useState<'gdd' | 'sandbox' | 'chatbot'>('gdd');
  
  // GDD sub-sections: 'vision', 'board', 'characters', 'pets', 'minigames', 'economy', 'marketing'
  const [gddSubTab, setGddSubTab] = useState<string>('vision');

  // GDD Filters
  const [characterFilter, setCharacterFilter] = useState<string>('Todos');
  const [characterSearch, setCharacterSearch] = useState<string>('');
  
  const [petFilter, setPetFilter] = useState<string>('Todos');
  const [petSearch, setPetSearch] = useState<string>('');

  const [minigameFilter, setMinigameFilter] = useState<string>('Todos');
  const [minigameSearch, setMinigameSearch] = useState<string>('');

  // Sandbox Game State
  const [playerChar, setPlayerChar] = useState<Character>(CHARACTERS[0]);
  const [playerPet, setPlayerPet] = useState<Pet>(PETS[0]);
  const [coins, setCoins] = useState<number>(15);
  const [trophies, setTrophies] = useState<number>(0);
  const [currentNodeId, setCurrentNodeId] = useState<number>(1);
  const [gameLogs, setGameLogs] = useState<string[]>([
    "¡Comienza la sesión de juego en el Valle de los Dioses Perdidos!",
    "Seleccionas a " + CHARACTERS[0].name + " acompañado de " + PETS[0].name + "."
  ]);
  const [activeInvocation, setActiveInvocation] = useState<DivineInvocation | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [boardEffectsActive, setBoardEffectsActive] = useState<string>("Ninguno");

  // Chatbot State
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text: "**[DIRECTOR CREATIVO]** ¡Saludos, colega diseñador! Estamos reunidos el Diseñador de Economía, el programador de Unity, el Diseñador UX/UI y yo para darle forma a *Clashtoon Party*.\n\n¿Qué aspecto del diseño te gustaría profundizar hoy? Podemos inventar un nuevo minijuego, ajustar los costes de los trofeos, planificar las optimizaciones móviles en Unity, o redactar diálogos extravagantes para Lupino."
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to the bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatLoading]);

  // Handle Sand Box character change
  const handleSelectSandboxChar = (char: Character) => {
    setPlayerChar(char);
    addLog(`Cambias tu héroe a ${char.name}.`);
  };

  // Handle Sandbox pet change
  const handleSelectSandboxPet = (pet: Pet) => {
    setPlayerPet(pet);
    addLog(`Equipas la mascota ${pet.name} (${pet.rarity}). Habilidad: ${pet.abilityName}.`);
  };

  const addLog = (msg: string) => {
    setGameLogs(prev => [msg, ...prev.slice(0, 19)]); // keep last 20 logs
  };

  // Roll Dice Sandbox Simulation
  const handleRollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setDiceResult(null);
    let counter = 0;
    const interval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        finalizeRoll();
      }
    }, 100);
  };

  const finalizeRoll = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceResult(roll);
    setIsRolling(false);

    // Apply Pet mobility advantage if Imperial Dragon is occupied (Legendary favor)
    let moveMod = 0;
    if (playerPet.id === "p13") {
      // Extra 1-3 dice added
      const extra = Math.floor(Math.random() * 3) + 1;
      moveMod = extra;
      addLog(`✨ ¡Habilidad de Gema Dragón! Se añade dado extra de +${extra} pasos.`);
    }

    const totalSteps = roll + moveMod;
    
    // Compute next node
    let nextNodeId = currentNodeId + totalSteps;
    if (nextNodeId > 10) {
      // Loop around
      nextNodeId = nextNodeId - 10 || 1;
      addLog(`🏁 ¡Completaste una ronda entera del Valle! Recibes un bono de +5 monedas.`);
      setCoins(c => c + 5);
    }

    setCurrentNodeId(nextNodeId);
    const landedNode = SANDBOX_BOARD_NODES.find(n => n.id === nextNodeId) || SANDBOX_BOARD_NODES[0];
    
    addLog(`🎲 Sacas un ${roll}. Te mueves ${totalSteps} casillas y caes en node #${landedNode.id}: "${landedNode.name}".`);

    // Evaluate land event
    let finalCoins = coins;

    // Apply pet coin helper
    let coinBonus = 0;
    if (playerPet.category === "Monedas") {
      coinBonus = 1;
      addLog(`🐱 Habilidad de Monedas activa: +1 moneda adicional.`);
    }

    switch (landedNode.type) {
      case 'coin_plus':
        const bonus = 3 + coinBonus;
        setCoins(c => c + bonus);
        addLog(`💰 Casilla Azul: Recibes +${bonus} monedas de oro sagrado.`);
        break;
      case 'coin_minus':
        // Safeguard with protective bubble of bubble pet burbujita
        if (playerPet.id === "p3") {
          addLog(`🧼 Saboteas el golpe de calor: El escudo de burbujas evitó la pérdida de monedas.`);
        } else {
          const minus = Math.max(1, 3);
          setCoins(c => Math.max(0, c - minus));
          addLog(`🌋 Casilla Roja: Pierdes -${minus} monedas de oro debido a trampas activas.`);
        }
        break;
      case 'divine_portal':
        const randomInvo = DIVINE_INVOCATIONS[Math.floor(Math.random() * DIVINE_INVOCATIONS.length)];
        setActiveInvocation(randomInvo);
        addLog(`🔮 ¡Portal Divino Activado! Despiertas el poder de: ${randomInvo.name}.`);
        triggerInvocationEffect(randomInvo);
        break;
      case 'shortcut':
        nextNodeId = 8; // shortcut to node 8
        setCurrentNodeId(nextNodeId);
        addLog(`✨ Atajo de Viento: ¡Soplas un puente colgante y avanzas directo a la casilla #8!`);
        break;
      case 'trophy':
        const trophyCost = activeInvocation?.id === "dragon_ancestral" ? 10 : 20;
        if (coins >= trophyCost) {
          setCoins(c => c - trophyCost);
          setTrophies(t => t + 1);
          addLog(`🏆 ¡ALTAR DE VICTORIA! Compras un Trofeo Cósmico por ${trophyCost} monedas de oro.`);
        } else {
          addLog(`🔒 Llegaste al Altar del Trofeo, pero no tienes las ${trophyCost} monedas necesarias.`);
        }
        break;
      case 'neutral':
      default:
        // simple land
        if (playerPet.id === "p6") {
          setCoins(c => c + 2);
          addLog(`⛏️ Tu topo Gromito escava la casilla neutral y halla +2 monedas de premio.`);
        } else {
          addLog(`🐾 Casilla Neutral: Te relajas un poco y revisas tus recursos.`);
        }
        break;
    }
  };

  const triggerInvocationEffect = (invo: DivineInvocation) => {
    if (invo.id === "dragon_ancestral") {
      setBoardEffectsActive("Precio del Trofeo rebajado un 50% (cuesta 10 monedas)");
    } else if (invo.id === "fenix_dorado") {
      setCoins(c => c + 5);
      setBoardEffectsActive("+5 monedas de emergencia al jugador de asistencia");
    } else if (invo.id === "lobo_lunar") {
      setBoardEffectsActive("Dirección Invertida activada temporalmente");
    } else if (invo.id === "kraken_celestial") {
      setBoardEffectsActive("Paso inudado: evites impares");
    } else if (invo.id === "gato_fortuna") {
      setCoins(c => c + 8);
      setBoardEffectsActive("+8 monedas de chocolate otorgadas por Maneki-Neko");
    }
  };

  const handleTriggerManualInvocation = (invo: DivineInvocation) => {
    setActiveInvocation(invo);
    addLog(`⚡ Invocación Forzada manual por los directores creativos: ¡${invo.name}!`);
    triggerInvocationEffect(invo);
  };

  const handleResetSandbox = () => {
    setCoins(15);
    setTrophies(0);
    setCurrentNodeId(1);
    setActiveInvocation(null);
    setBoardEffectsActive("Ninguno");
    setGameLogs([
      "Tablero inicializado de nuevo.",
      "Comienzas con 15 monedas de oro."
    ]);
  };

  // Chatbot send message
  const handleSendChatMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isChatLoading) return;

    const userText = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userText,
          history: chatHistory.slice(-10) // Send latest 10 messages context
        })
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setChatHistory(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, {
        role: 'model',
        text: `**[PRODUCTOR DE EMERGENCIA]** Perdón, tuvimos un problema con el compilador o la conexión de red.\n\n*Análisis resumido*: "${userText}" es una propuesta excelente. El Diseñador de Sistemas sugiere procesarla en el próximo Sprint de desarrollo. ¿Qué otro apartado de Clashtoon Party quieres co-diseñar?`
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Filter lists helper
  const filteredCharacters = CHARACTERS.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(characterSearch.toLowerCase()) || 
                          char.story.toLowerCase().includes(characterSearch.toLowerCase());
    const matchesType = characterFilter === 'Todos' || char.type === characterFilter;
    return matchesSearch && matchesType;
  });

  const filteredPets = PETS.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(petSearch.toLowerCase()) || 
                          pet.abilityName.toLowerCase().includes(petSearch.toLowerCase()) ||
                          pet.abilityDesc.toLowerCase().includes(petSearch.toLowerCase());
    const matchesRarity = petFilter === 'Todos' || pet.rarity === petFilter;
    return matchesSearch && matchesRarity;
  });

  const filteredMinigames = MINIGAMES.filter(mg => {
    const matchesSearch = mg.name.toLowerCase().includes(minigameSearch.toLowerCase()) || 
                          mg.objective.toLowerCase().includes(minigameSearch.toLowerCase());
    const matchesCat = minigameFilter === 'Todos' || mg.category === minigameFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full h-full bg-[#5B21B6] text-white flex flex-col overflow-hidden relative select-none">
      
      {/* Dynamic Background Parallax Bubbles */}
      <div className="absolute inset-0 opacity-15 pointer-events-none z-0 overflow-hidden" 
           style={{ backgroundImage: `radial-gradient(circle at 15% 25%, #8B5CF6 0%, transparent 45%), radial-gradient(circle at 85% 75%, #EC4899 0%, transparent 45%), radial-gradient(circle at 50% 50%, #EAB308 0%, transparent 35%)` }}>
      </div>

      {/* HEADER SECTION - Styled like the Vibrant Palette layout exactly */}
      <header className="h-20 bg-black/40 border-b-4 border-black/30 flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-white flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.3)]">
            <span className="text-xl font-black text-white italic">C</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs uppercase tracking-widest text-pink-300 font-extrabold leading-none">PREMIUM GDD ENGINE</span>
            <span className="text-xl md:text-2xl font-black tracking-tighter italic drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">CLASHTOON PARTY</span>
          </div>
        </div>

        {/* Real-time statistics of Sandbox or overall system info */}
        <div className="flex items-center gap-4">
          <div className="bg-black/30 h-10 px-3 md:px-4 rounded-full flex items-center gap-2 border-2 border-white/10 shadow-inner">
            <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-[0_0_8px_#fbbf24] animate-pulse"></div>
            <span className="text-xs md:text-sm font-black text-yellow-300 font-mono">{coins} MONEDAS</span>
            <button className="hidden sm:flex w-5 h-5 bg-blue-500 rounded-full items-center justify-center text-[10px] font-black pointer-events-none">+</button>
          </div>
          <div className="bg-black/30 h-10 px-3 md:px-4 rounded-full flex items-center gap-2 border-2 border-white/10 shadow-inner">
            <div className="w-4 h-4 bg-pink-500 rounded-md rotate-45 shadow-[0_0_8px_#ec4899]"></div>
            <span className="text-xs md:text-sm font-black text-pink-300 font-mono">{trophies} TROFEOS</span>
            <button className="hidden sm:flex w-5 h-5 bg-blue-500 rounded-full items-center justify-center text-[10px] font-black pointer-events-none">+</button>
          </div>
          {/* Refresh/Reset button */}
          <button 
            id="reset_sandbox_btn"
            onClick={handleResetSandbox}
            className="p-2 bg-pink-500/10 hover:bg-pink-500/30 rounded-xl border-2 border-pink-400/20 text-xs font-bold transition flex items-center gap-1"
            title="Reset Sandbox State"
          >
            <RotateCcw className="w-4 h-4 text-pink-300" />
            <span className="hidden lg:inline text-[9px] uppercase tracking-wider">Reset</span>
          </button>
        </div>
      </header>

      {/* CORE WRAPPER - Lateral Main Actions */}
      <main className="flex-1 flex overflow-hidden p-4 md:p-6 gap-4 md:gap-6 z-10 relative">
        
        {/* ASIDE BAR: Quick Launcher Buttons */}
        <aside className="w-20 md:w-24 flex flex-col gap-4 shrink-0 z-10" id="aside_navigation">
          <button 
            id="nav_gdd"
            onClick={() => setActiveTab('gdd')}
            className={`flex flex-col items-center justify-center w-full aspect-square rounded-3xl border-b-8 transition shadow-lg ${
              activeTab === 'gdd' 
                ? 'bg-pink-500 border-pink-700 ring-4 ring-white/30 text-white translate-y-0.5' 
                : 'bg-pink-900/40 border-pink-950/60 text-pink-300 hover:bg-pink-800/40 hover:text-white'
            }`}
          >
            <FileText className="w-7 h-7" />
            <span className="text-[10px] md:text-[11px] font-black mt-1 uppercase tracking-tighter">EL GDD</span>
          </button>

          <button 
            id="nav_sandbox"
            onClick={() => setActiveTab('sandbox')}
            className={`flex flex-col items-center justify-center w-full aspect-square rounded-3xl border-b-8 transition shadow-lg ${
              activeTab === 'sandbox' 
                ? 'bg-blue-500 border-blue-700 ring-4 ring-white/30 text-white translate-y-0.5' 
                : 'bg-blue-900/40 border-blue-950/60 text-blue-300 hover:bg-blue-800/40 hover:text-white'
            }`}
          >
            <Compass className="w-7 h-7" />
            <span className="text-[10px] md:text-[11px] font-black mt-1 uppercase tracking-tighter">TABLERO</span>
          </button>

          <button 
            id="nav_chatbot"
            onClick={() => setActiveTab('chatbot')}
            className={`flex flex-col items-center justify-center w-full aspect-square rounded-3xl border-b-8 transition shadow-lg ${
              activeTab === 'chatbot' 
                ? 'bg-yellow-500 border-yellow-700 ring-4 ring-white/30 text-white translate-y-0.5' 
                : 'bg-yellow-900/40 border-yellow-950/60 text-yellow-300 hover:bg-yellow-800/40 hover:text-white'
            }`}
          >
            <MessageSquare className="w-7 h-7" />
            <span className="text-[10px] md:text-[11px] font-black mt-1 uppercase tracking-tighter">DEV CHAT</span>
          </button>

          {/* Display current active visual context footer element inside aside */}
          <div className="mt-auto hidden md:flex flex-col items-center p-2 rounded-2xl bg-black/20 border border-white/5 text-center">
            <span className="text-[8px] opacity-60 tracking-wider">TURNO</span>
            <span className="text-xl font-black text-pink-400 font-mono">1</span>
            <div className="h-[2px] w-full bg-white/10 my-1"></div>
            <span className="text-[8px] opacity-60">ANDROID</span>
          </div>
        </aside>

        {/* WORKSTAGE VIEW */}
        <div className="flex-1 flex flex-col bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border-4 border-white/10 p-4 md:p-6 overflow-hidden shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {/* TAB 1: EL GAME DESIGN DOCUMENT INTERACTIVO */}
            {activeTab === 'gdd' && (
              <motion.div 
                key="gdd_tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* GDD Sub-tab system */}
                <div className="flex gap-2 p-1 overflow-x-auto bg-black/30 rounded-2xl border border-white/5 shrink-0 scrollbar-none mb-4">
                  {[
                    { id: 'vision', label: 'Visión & Unity', icon: Layers },
                    { id: 'board', label: 'Mecánicas & Invocación', icon: Star },
                    { id: 'characters', label: 'Personajes Toon', icon: Users },
                    { id: 'pets', label: 'Mascotas', icon: HelpCircle },
                    { id: 'minigames', label: 'Minijuegos', icon: Gamepad2 },
                    { id: 'economy', label: 'Monetización & Bal.', icon: Coins },
                    { id: 'marketing', label: 'Retención & Market', icon: TrendingUp }
                  ].map((subtab) => {
                    const Icon = subtab.icon;
                    return (
                      <button
                        key={subtab.id}
                        id={`gdd_sub_tab_${subtab.id}`}
                        onClick={() => setGddSubTab(subtab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition shrink-0 ${
                          gddSubTab === subtab.id 
                            ? 'bg-pink-500 text-white shadow-md' 
                            : 'text-pink-200 hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{subtab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-tab scrollable content wrapper */}
                <div className="flex-1 overflow-y-auto pr-1">

                  {/* VISIÓN GENERAL Y UNITY */}
                  {gddSubTab === 'vision' && (
                    <motion.div 
                      key="gdd_vision"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                      className="space-y-6"
                    >
                      <div className="bg-gradient-to-r from-pink-600/30 to-purple-600/30 p-5 rounded-3xl border-2 border-pink-500/20">
                        <span className="text-yellow-400 font-extrabold uppercase tracking-wide text-xs">Propuesta de Valor de la Franquicia</span>
                        <h2 className="text-3xl font-black italic tracking-tight mt-1 mb-3">CLASHTOON PARTY</h2>
                        <p className="text-sm text-slate-200 leading-relaxed font-sans">
                          Clashtoon Party es un <strong className="text-pink-300">Party Game multijugador premium y social para Android</strong> diseñado en base a partidas ágiles e impredecibles de 15 minutos en promedio. Resuelve la fatiga y longitud habitual de los juegos de tableros por turnos mediante el sistema diferenciador de <strong className="text-yellow-300">Invocaciones Divinas</strong>, que altera las rutas físicas de juego dinámicamente. El estilo visual adopta un 3D estilizado de alto impacto similar a Fall Guys con siluetas lúdicas.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-950/40 p-5 rounded-3xl border border-white/5 space-y-3">
                          <div className="flex items-center gap-2 text-indigo-400">
                            <Wrench className="w-5 h-5" />
                            <h3 className="font-black text-lg uppercase tracking-tight text-white">Arquitectura de Motor Unity</h3>
                          </div>
                          <ul className="space-y-2 text-xs md:text-sm text-slate-300 leading-relaxed list-disc list-inside font-sans">
                            <li><strong className="text-slate-100">Modularidad desacoplada</strong> mediante <code className="text-pink-300 font-mono bg-black/40 px-1 py-0.5 rounded">ScriptableObjects</code> para variables de tableros, mascotas e invocaciones.</li>
                            <li><strong className="text-slate-100">Optimización Móvil (URP)</strong>: Universal Render Pipeline de Unity, mallas optimizadas menor de 5k polígonos, agrupamiento estático de texturas, y renderizado dinámico de partículas 3D.</li>
                            <li><strong className="text-slate-100">Administrador de Carga</strong>: Implementación de <code className="text-pink-300 font-mono bg-black/40 px-1 py-0.5 rounded">Unity Addressables</code> para entrega asíncrona de mapas e assets de skins.</li>
                          </ul>
                        </div>

                        <div className="bg-slate-950/40 p-5 rounded-3xl border border-white/5 space-y-3">
                          <div className="flex items-center gap-2 text-pink-400">
                            <Users className="w-5 h-5" />
                            <h3 className="font-black text-lg uppercase tracking-tight text-white">Sistemas Multijugador</h3>
                          </div>
                          <ul className="space-y-2 text-xs md:text-sm text-slate-300 leading-relaxed list-disc list-inside font-sans">
                            <li><strong className="text-slate-100">Conectividad Ágil</strong>: Recomendación e integración técnica con <strong className="text-yellow-300">Photon Fusion (2.0)</strong> en modo Host-Authoritative para partidas de baja latencia con predicción en cliente.</li>
                            <li><strong className="text-slate-100">Matchmaking Flexible</strong>: Filtrado de salas a través de emparejamientos basados en latencia (Ping menor a 90ms) y nivel de Trofeos acumulativos, previniendo abusos competitivos.</li>
                            <li><strong className="text-slate-100">Recuperación Rápida</strong>: Reconexión fluida "Hot-Join" reenganchando al jugador en menos de 5 segundos convirtiendo temporalmente al personaje en bot de IA.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-slate-950/50 p-5 rounded-3xl border border-white/10 space-y-3">
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Activity className="w-5 h-5" />
                          <h3 className="font-black text-base uppercase tracking-tight text-white">Organización de Carpetas (Unity Project Model)</h3>
                        </div>
                        <pre className="bg-black/50 p-4 rounded-xl text-xs font-mono text-green-400 overflow-x-auto leading-normal">
{`Assets/
├── _Project/
│   ├── Animations/      # Clips dinámicos de Toons y Mascotas (FBX)
│   ├── Prefabs/         # Casillas dinámicas, Dados animados, Proyectiles
│   └── Scripts/
│       ├── ScriptableObjects/  # Data inyectable (ToonData, PetData)
│       ├── Core/               # GameLoopState, TurnController, ActionQueue
│       ├── Board/              # CashNodeView, InvocationAnimator
│       ├── Multiplayer/        # NetworkRunnerManager, SessionBroker
│       └── UI/                 # MobileHUD, ShopMenu, ScoreSheet
└── ThirdParty/          # Photon SDK, ReconnectHelpers`}
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {/* TABLERO PRINCIPAL & DADOS & INVOCACIÓN */}
                  {gddSubTab === 'board' && (
                    <motion.div 
                      key="gdd_board"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                      className="space-y-6"
                    >
                      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/40 p-5 rounded-3xl border-2 border-indigo-400/20 shadow-[0_4px_0_rgba(99,102,241,0.2)]">
                        <span className="text-cyan-300 font-extrabold uppercase tracking-wide text-xs">Tablero Inicial Principal</span>
                        <h3 className="text-2xl font-black italic mt-1 text-white uppercase">Valle de los Dioses Perdidos</h3>
                        <p className="text-xs text-slate-300 leading-relaxed mt-2">
                          El Valle de los Dioses Perdidos es un tablero de juego circular compuesto por zonas temáticas complejas. No es un renderizado rígido; cambia físicamente en tiempo de ejecución.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                          {BOARD_SECTORS.map((sector, idx) => (
                            <motion.div 
                              key={idx} 
                              initial={{ scale: 0.85, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 350, damping: 14, delay: idx * 0.05 }}
                              className="bg-black/30 p-3 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-all duration-300"
                            >
                              <span className="text-pink-300 font-extrabold text-xs">Sector #{idx + 1}</span>
                              <h4 className="font-black text-white text-sm tracking-tight">{sector.name}</h4>
                              <p className="text-[11px] text-slate-400 mt-1 leading-normal">{sector.desc}</p>
                              <div className="mt-2 text-[9px] font-bold text-yellow-400 font-mono uppercase">Estética: {sector.aesthetic}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Sistema de Dados Especiales */}
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 15, delay: 0.1 }}
                        className="bg-slate-950/40 p-5 rounded-3xl border border-white/5 space-y-3"
                      >
                        <h4 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                          <span>🎲</span> Sistema de Dados del Valle
                        </h4>
                        <p className="text-xs text-slate-300 leading-normal">
                          Cada jugador tira un dado tradicional de 6 caras al inicio de su turno. No obstante, a diferencia de los juegos lentos clásicos, Clashtoon Party incorpora dados rúnicos reactivos para agilizar el movimiento móvil:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                          <motion.div 
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 15, delay: 0.15 }}
                            className="bg-slate-900 p-3.5 rounded-xl border border-white/5 hover:border-yellow-400/20 transition-all duration-300"
                          >
                            <span className="text-yellow-400 font-black">Dado Doble Rúnico</span>
                            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Adquirido mediante poción de la tienda o activación por mascotas. Permite tirar dos dados sumando resultados.</p>
                          </motion.div>
                          <motion.div 
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 15, delay: 0.2 }}
                            className="bg-slate-900 p-3.5 rounded-xl border border-white/5 hover:border-pink-400/20 transition-all duration-300"
                          >
                            <span className="text-pink-400 font-black">Dado Cargado 1-2-3</span>
                            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Garantiza un avance corto y altamente táctico para forzar el aterrizaje sobre portales sagrados u hospitales.</p>
                          </motion.div>
                          <motion.div 
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 15, delay: 0.25 }}
                            className="bg-slate-900 p-3.5 rounded-xl border border-white/5 hover:border-green-400/20 transition-all duration-300"
                          >
                            <span className="text-green-400 font-black">Dado Trampa del Oponente</span>
                            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Lanzado contra oponentes en casillas adyacentes para limitar su próximo giro a máximo un avance de 2 casillas.</p>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Invocaciones divinas descripción detallada */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-black text-white flex items-center gap-2">
                          <span>🔮</span> Las 5 Invocaciones Divinas de Valle
                        </h4>
                        <div className="space-y-3">
                          {DIVINE_INVOCATIONS.map((invo, index) => (
                            <motion.div 
                              key={invo.id} 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 350, damping: 14, delay: index * 0.05 }}
                              className="bg-gradient-to-br from-indigo-950/60 to-slate-900/60 p-4 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-4 relative hover:border-purple-500/30 transition-all duration-300"
                            >
                              <div className="flex items-center gap-3 md:w-1/4 shrink-0">
                                <span className="text-4xl">{invo.emoji}</span>
                                <div>
                                  <h5 className="font-black text-sm text-yellow-300 md:text-base leading-tight">{invo.name}</h5>
                                  <span className="text-[9px] px-2 py-0.5 bg-pink-500 rounded text-white font-bold inline-block mt-1 uppercase">EVENTO GLOBAL</span>
                                </div>
                              </div>
                              <div className="flex-1 space-y-2 text-xs">
                                <div>
                                  <strong className="text-white block font-bold">Presentación Visual:</strong>
                                  <span className="text-slate-300 leading-normal">{invo.visualEffectDesc}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-white/5">
                                  <div>
                                    <strong className="text-pink-400 block font-bold uppercase tracking-wider text-[9px]">Alteración del Tablero</strong>
                                    <span className="text-[11px] text-slate-400 leading-tight">{invo.boardAlteration}</span>
                                  </div>
                                  <div>
                                    <strong className="text-green-400 block font-bold uppercase tracking-wider text-[9px]">Impacto Económico</strong>
                                    <span className="text-[11px] text-slate-400 leading-tight">{invo.economyImpact}</span>
                                  </div>
                                  <div>
                                    <strong className="text-yellow-400 block font-bold uppercase tracking-wider text-[9px]">Modificación Estratégica</strong>
                                    <span className="text-[11px] text-slate-400 leading-tight">{invo.strategicChange}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PERSONAJES TOONS */}
                  {gddSubTab === 'characters' && (
                    <motion.div 
                      key="gdd_characters"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shrink-0">
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white uppercase">Personal Toon Inicial (10)</h3>
                          <p className="text-xs text-slate-300 leading-normal">Fichas de personajes con un balance 100% equitativo libre de ventajas injustas.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Todos', 'Mascota Mágica', 'Criatura Mitológica', 'Héroe Legendario'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setCharacterFilter(type)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition ${
                                characterFilter === type ? 'bg-pink-500 text-white' : 'bg-black/30 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Buscar héroe por nombre o historia..." 
                          value={characterSearch}
                          onChange={(e) => setCharacterSearch(e.target.value)}
                          className="w-full bg-slate-950/70 border-2 border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 placeholder-slate-500 font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredCharacters.map((char, index) => (
                          <motion.div 
                            key={char.id} 
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 15, delay: index * 0.04 }}
                            className="bg-slate-950/40 p-4 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-pink-500/40 hover:scale-[1.01] transition duration-200"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <h4 className="text-base font-black text-white">{char.name}</h4>
                                <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase ${
                                  char.type === 'Mascota Mágica' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                                  char.type === 'Criatura Mitológica' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                  'bg-green-500/20 text-green-300 border border-green-500/30'
                                }`}>
                                  {char.type}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 leading-normal italic">"{char.story}"</p>
                              <div className="text-xs space-y-1">
                                <p className="text-[11px] text-slate-400"><strong className="text-slate-100">Personalidad:</strong> {char.personality}</p>
                                <p className="text-[11px] text-slate-400"><strong className="text-slate-100">Diseño Visual:</strong> {char.visualDesign}</p>
                              </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center text-[10px]">
                              <span className="text-slate-400 font-mono uppercase">Elemento: <span className="text-yellow-400 font-black">{char.element}</span></span>
                              <span className="text-slate-400 font-mono uppercase">Skin: <span className="text-pink-300 font-black">{char.signatureCosmetic}</span></span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {filteredCharacters.length === 0 && (
                        <div className="text-center py-8 text-xs text-slate-400">
                          No se encontraron personajes para esta búsqueda.
                        </div>
                      )}

                      {/* Tabla de Estadísticas de Balance (Chicle Bomba Edition) */}
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 350, damping: 16, delay: 0.15 }}
                        className="bg-slate-950/60 p-5 rounded-3xl border-2 border-pink-500/30 space-y-4 shadow-[0_6px_0_rgba(236,72,153,0.3)] mt-6"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <div>
                            <span className="text-[9px] font-black uppercase text-pink-400 tracking-wider">Metadatos de Balance en Unity</span>
                            <h4 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2 font-sans">
                              <span>🍬</span> Tabla de Estadísticas: Fuerza y Elasticidad de Chicle
                            </h4>
                          </div>
                          <span className="text-[9px] bg-pink-500 text-white font-black px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-center">
                            Ajuste de Atributos MVP
                          </span>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-white/10">
                          <table className="w-full min-w-[650px] border-collapse bg-black/30 text-left text-xs text-slate-300">
                            <thead>
                              <tr className="bg-slate-900/80 text-slate-400 uppercase font-black text-[9px] border-b border-white/10 tracking-wider">
                                <th className="p-3.5 pl-4">Personaje (Toon)</th>
                                <th className="p-3.5">Categoría GDD</th>
                                <th className="p-3.5">Clase / Elemento</th>
                                <th className="p-3.5">Movilidad 🏃‍♂️</th>
                                <th className="p-3.5">Suerte Dado 🎲</th>
                                <th className="p-3.5">Elasticidad de Chicle 🎈</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {CHARACTERS.map((char) => {
                                const charStats: Record<string, { mob: number, luck: number, elast: number }> = {
                                  ember: { mob: 5, luck: 4, elast: 3 },
                                  lupino: { mob: 4, luck: 3, elast: 4 },
                                  ginkox: { mob: 3, luck: 5, elast: 4 },
                                  valkiria_yuki: { mob: 5, luck: 3, elast: 4 },
                                  totem_tom: { mob: 2, luck: 4, elast: 5 },
                                  capitan_pompom: { mob: 4, luck: 4, elast: 3 },
                                  nekor: { mob: 5, luck: 3, elast: 5 },
                                  anubis_junior: { mob: 3, luck: 5, elast: 3 },
                                  pip_el_fénix: { mob: 5, luck: 4, elast: 5 },
                                  sir_bacon: { mob: 2, luck: 3, elast: 5 },
                                };
                                const stats = charStats[char.id] || { mob: 3, luck: 3, elast: 3 };

                                return (
                                  <tr key={char.id} className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="p-3.5 pl-4 font-black text-white">{char.name}</td>
                                    <td className="p-3.5 text-slate-400 font-semibold">{char.type}</td>
                                    <td className="p-3.5">
                                      <span className="text-[10px] text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20 font-mono font-bold uppercase gallery-badge">
                                        {char.element}
                                      </span>
                                    </td>
                                    <td className="p-3.5">
                                      <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <span 
                                            key={i} 
                                            className={`w-2 h-2 rounded-full ${
                                              i < stats.mob ? 'bg-orange-500 shadow-[0_0_4px_#f97316]' : 'bg-slate-800'
                                            }`} 
                                          />
                                        ))}
                                      </div>
                                    </td>
                                    <td className="p-3.5">
                                      <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <span 
                                            key={i} 
                                            className={`w-2 h-2 rounded-full ${
                                              i < stats.luck ? 'bg-yellow-400 shadow-[0_0_4px_#facc15]' : 'bg-slate-800'
                                            }`} 
                                          />
                                        ))}
                                      </div>
                                    </td>
                                    <td className="p-3.5">
                                      <div className="flex gap-1 items-center">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <span 
                                            key={i} 
                                            className={`w-2.5 h-2.5 rounded-full ${
                                              i < stats.elast ? 'bg-pink-500 text-white shadow-[0_0_6px_#ec4899] font-black animate-pulse' : 'bg-slate-800 text-slate-600'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* MASCOTAS ACOMPAÑANTES */}
                  {gddSubTab === 'pets' && (
                    <motion.div 
                      key="gdd_pets"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white uppercase">Criaturas del Tablero (15 Mascotas)</h3>
                          <p className="text-xs text-slate-300 leading-normal">
                            Equipables tácticos sin desbalancear la equidad del juego competitivo offline/online. Se desvelan sus habilidades.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Todos', 'Común', 'Rara', 'Épica', 'Legendaria'].map((rarity) => (
                            <button
                              key={rarity}
                              onClick={() => setPetFilter(rarity)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition ${
                                petFilter === rarity ? 'bg-pink-500 text-white' : 'bg-black/30 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {rarity}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Buscar mascotas por habilidad, nombre..." 
                          value={petSearch}
                          onChange={(e) => setPetSearch(e.target.value)}
                          className="w-full bg-slate-950/70 border-2 border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 placeholder-slate-500 font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredPets.map((pet, index) => (
                          <motion.div 
                            key={pet.id} 
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 15, delay: index * 0.03 }}
                            className="bg-slate-950/30 p-4 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-indigo-400/30 hover:scale-[1.01] transition duration-200"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-xs text-slate-400 font-mono">ID: {pet.id}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                  pet.rarity === 'Común' ? 'bg-slate-600/30 text-slate-300' :
                                  pet.rarity === 'Rara' ? 'bg-yellow-500/20 text-yellow-300' :
                                  pet.rarity === 'Épica' ? 'bg-purple-500/25 text-purple-300' :
                                  'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}>
                                  {pet.rarity}
                                </span>
                              </div>
                              <h4 className="font-black text-sm text-white">{pet.name}</h4>
                              <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                                <strong className="text-[10px] text-pink-300 block font-black uppercase leading-tight">{pet.abilityName}</strong>
                                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">{pet.abilityDesc}</p>
                              </div>
                            </div>
                            <div className="mt-3 text-[9px] font-bold text-slate-400 flex justify-between items-center uppercase">
                              <span>Categoría:</span>
                              <span className="text-yellow-400">{pet.category}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {filteredPets.length === 0 && (
                        <div className="text-center py-8 text-xs text-slate-400">
                          Ninguna mascota coincide con tus filtros de búsqueda.
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* 11 MINIJUEGOS DETALLADOS */}
                  {gddSubTab === 'minigames' && (
                    <motion.div 
                      key="gdd_minigames"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                      className="space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div>
                          <h3 className="text-lg font-black tracking-tight text-white uppercase">Minijuegos de Lanzamiento (11 obligatorios)</h3>
                          <p className="text-xs text-slate-300 leading-normal">Todos duran un máximo estricto de 90 segundos para agilizar los flujos móviles.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Todos', 'Reflejos', 'Carreras', 'Combate', 'Todos contra todos', '2 vs 3', 'Supervivencia'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setMinigameFilter(cat)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition ${
                                minigameFilter === cat ? 'bg-pink-500 text-white' : 'bg-black/30 text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Buscar minijuego por nombre, mecánica, etc..." 
                          value={minigameSearch}
                          onChange={(e) => setMinigameSearch(e.target.value)}
                          className="w-full bg-slate-950/70 border-2 border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500 placeholder-slate-500 font-sans"
                        />
                      </div>

                      <div className="space-y-3">
                        {filteredMinigames.map((mg, index) => (
                          <motion.div 
                            key={mg.id} 
                            initial={{ scale: 0.88, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 350, damping: 15, delay: index * 0.04 }}
                            className="bg-slate-950/40 p-4 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between gap-4 hover:border-pink-500/30 transition-all duration-300"
                          >
                            <div className="flex-1 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-base font-black text-white">{mg.name}</h4>
                                <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                  {mg.category}
                                </span>
                                <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase">
                                  ⏱️ {mg.duration} Seg
                                </span>
                              </div>
                              <p className="text-xs text-slate-200"><strong className="text-yellow-400">Objetivo:</strong> {mg.objective}</p>
                              
                              <div>
                                <strong className="text-[10px] text-pink-300 block uppercase tracking-wide font-black">Mecánicas de Juego (Unity / Mobile):</strong>
                                <ul className="list-disc list-inside text-[11px] text-slate-400 leading-normal pl-1 space-y-0.5">
                                  {mg.mechanics.map((mech, idx) => (
                                    <li key={idx}>{mech}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="md:w-1/3 bg-black/30 p-3 rounded-2xl border border-white/5 flex flex-col justify-between text-xs space-y-2 shrink-0">
                              <div>
                                <strong className="text-slate-200 block font-bold uppercase text-[9px] tracking-wide">Controles Móviles:</strong>
                                <span className="text-[11px] text-slate-400">{mg.controls}</span>
                              </div>
                              <div>
                                <strong className="text-green-400 block font-bold uppercase text-[9px] tracking-wide">Recompensas Económicas:</strong>
                                <span className="text-[11px] text-slate-300 leading-tight">{mg.rewards}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {filteredMinigames.length === 0 && (
                        <div className="text-center py-8 text-xs text-slate-400">
                          Ningún minijuego coincide con tus filtros.
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ECONOMÍA & MONETIZACIÓN ÉTICA */}
                  {gddSubTab === 'economy' && (
                    <motion.div 
                      key="gdd_economy"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                      className="space-y-6"
                    >
                      <div className="bg-slate-950/45 p-5 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Coins className="w-6 h-6" />
                          <h3 className="font-black text-lg uppercase tracking-tight text-white">Sistemas de Economía de Monedas</h3>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          La economía en Clashtoon Party se basa en dos divisas básicas para evitar fricciones complejas, dividiendo el consumo táctico (dentro del tablero) de la progresión persistente de la cuenta (fuera de la partida):
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 space-y-2">
                            <span className="text-xs font-black uppercase text-yellow-400 block">Monedas de Oro (Gelt) - Divisa del Tablero</span>
                            <ul className="text-xs text-slate-300 leading-relaxed space-y-2 list-decimal list-inside">
                              <li><strong className="text-slate-100">Obtención</strong>: Minijuegos (8 a 15 monedas según desempeño), casillas azules de monedas, y eventos como el Gato de la Fortuna.</li>
                              <li><strong className="text-slate-100">Gasto</strong>: Canje en la Casilla Altar del Trofeo para comprar Trofeos (20 monedas por defecto; 10 bajo el efecto del Dragón), o compra de pociones en la Tienda del Tablero.</li>
                              <li><strong className="text-slate-100">Control</strong>: Reseteo de monedas al final de la partida para prevenir la inflación acumulativa persistente.</li>
                            </ul>
                          </div>

                          <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 space-y-2">
                            <span className="text-xs font-black uppercase text-pink-400 block">Fichas de Confeti (Moneda del Portal) - Divisa Persistente</span>
                            <ul className="text-xs text-slate-300 leading-relaxed space-y-2 list-decimal list-inside">
                              <li><strong className="text-slate-100">Obtención</strong>: Recompensas en el Pase de Temporada, finalización de misiones diarias/semanales, y bonos de regreso.</li>
                              <li><strong className="text-slate-100">Gasto</strong>: Desbloqueo de cosméticos puros (efectos de rastro, skins de personajes, gestos en chat de voz, avatares especiales).</li>
                              <li><strong className="text-slate-100">Proporción</strong>: No altera la velocidad táctica ni los turnos competitivos (Ética Cero Pay To Win).</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Monetización ética de Pase de temporada */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-950/45 p-5 rounded-3xl border border-white/5 space-y-3">
                          <h4 className="text-base font-black text-red-300 uppercase tracking-tight">Estructura del Season Pass Élite</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Pase estructurado en 50 niveles de progresión estacional de 30 días, incentivando el juego cooperativo y la retención cíclica sana sin abusos financieros:
                          </p>
                          <div className="bg-slate-900 p-3 rounded-xl border border-white/5 text-[11px] text-slate-300 leading-normal space-y-1">
                            <p><strong className="text-slate-100">Flujo Gratuito (30 Niveles)</strong>: Desbloquea 3 Mascotas Comunes de soporte, 2 personajes básicos alternativos, gestos y 200 Fichas de Confeti.</p>
                            <p><strong className="text-slate-100">Flujo Premium (50 Niveles)</strong>: Desbloquea Skins exclusivas míticas (p. ej. Lupino de Plata), marcos holográficos para el perfil de cuenta y rastro estético de dados dorados.</p>
                          </div>
                        </div>

                        <div className="bg-slate-950/45 p-5 rounded-3xl border border-white/5 space-y-3">
                          <h4 className="text-base font-black text-green-300 uppercase tracking-tight">Diseño Pro-User y Libre de Pay-To-Win</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Ningún elemento a la venta confiere ventajas competitivas físicas sobre el tablero de juego (velocidad de dados modificada artificialmente o precios de trofeos de victoria rebajados por dinero real).
                          </p>
                          <div className="flex gap-2 p-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <ShieldCheck className="w-8 h-8 text-green-400 shrink-0" />
                            <span className="text-[10px] text-green-300 leading-normal font-black uppercase">
                              POLÍTICA SANA: El talento, la agilidad en los minijuegos y la previsión con las Mascotas deciden el 100% de los torneos de victoria.
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* RETENCIÓN, MERCADO & ROADMAP */}
                  {gddSubTab === 'marketing' && (
                    <motion.div 
                      key="gdd_marketing"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 16 }}
                      className="space-y-6"
                    >
                      <div className="bg-slate-950/45 p-5 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="font-black text-lg uppercase tracking-tight text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-pink-400" />
                          <span>Estrategia de Retención de Usuarios</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="bg-slate-900 p-3.5 rounded-xl border border-white/5 animate-pulse-slow">
                            <span className="text-yellow-400 font-extrabold block">Misiones Diarias</span>
                            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Fáciles de cumplir en un par de partidas de 15 minutos. Ej: 'Lanza 20 dados en cualquier tablero' o 'Roba 5 monedas'.</p>
                          </div>
                          <div className="bg-slate-900 p-3.5 rounded-xl border border-white/5 animate-pulse-slow">
                            <span className="text-pink-400 font-extrabold block">Misiones Semanales</span>
                            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Desafíos de mayor volumen. Ej: 'Gana 3 minijuegos de categoría Combate' o 'Despierta al Lobo Lunar 2 veces'.</p>
                          </div>
                          <div className="bg-slate-900 p-3.5 rounded-xl border border-white/5 animate-pulse-slow">
                            <span className="text-blue-400 font-extrabold block">Eventos de Fin de Semana</span>
                            <p className="text-[11px] text-slate-400 mt-1 leading-normal">Bono del Gato de la Fortuna activo, duplicando transacciones divertidas de cosméticos estacionales.</p>
                          </div>
                        </div>
                      </div>

                      {/* Análisis de Mercado Comparativo */}
                      <div className="bg-slate-950/45 p-5 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="font-black text-lg uppercase tracking-tight text-white flex items-center gap-2">
                          <Compass className="w-5 h-5 text-indigo-400" />
                          <span>Diferenciación y Análisis de Mercado</span>
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="bg-black/20 p-4 rounded-2xl border border-slate-700/50">
                            <h4 className="font-extrabold text-sm text-yellow-300">Vs. Mario Party</h4>
                            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed"><strong className="text-white">Diferencia:</strong> {COMPARATIVE_ANALYSIS.marioParty.differentiation}</p>
                            <p className="text-[10px] text-slate-400 mt-1"><strong className="text-red-400">Barrera MP:</strong> {COMPARATIVE_ANALYSIS.marioParty.weakness}</p>
                          </div>
                          <div className="bg-black/20 p-4 rounded-2xl border border-slate-700/50">
                            <h4 className="font-extrabold text-sm text-pink-300">Vs. Fall Guys</h4>
                            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed"><strong className="text-white">Diferencia:</strong> {COMPARATIVE_ANALYSIS.fallGuys.differentiation}</p>
                            <p className="text-[10px] text-slate-400 mt-1"><strong className="text-red-400">Barrera FG:</strong> {COMPARATIVE_ANALYSIS.fallGuys.weakness}</p>
                          </div>
                          <div className="bg-black/20 p-4 rounded-2xl border border-slate-700/50">
                            <h4 className="font-extrabold text-sm text-cyan-300">Vs. Stumble Guys</h4>
                            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed"><strong className="text-white">Diferencia:</strong> {COMPARATIVE_ANALYSIS.stumbleGuys.differentiation}</p>
                            <p className="text-[10px] text-slate-400 mt-1"><strong className="text-red-400">Barrera SG:</strong> {COMPARATIVE_ANALYSIS.stumbleGuys.weakness}</p>
                          </div>
                        </div>
                      </div>

                      {/* Roadmap de Lanzamiento MVP */}
                      <div className="bg-slate-950/45 p-5 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="font-black text-lg uppercase tracking-tight text-white">Lanzamiento MVP & Hoja de Ruta</h3>
                        <div className="space-y-3 text-xs">
                          <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
                            <span className="font-black text-yellow-400 uppercase tracking-wider block">Fase 1: MVP de Lanzamiento (Mes 1 a 4)</span>
                            <p className="text-slate-300 leading-normal mt-1">
                              Implementación de 1 tablero principal ("Valle de los Dioses Perdidos"), los 11 minijuegos de lanzamiento estables de Unity, 10 personajes iniciales balanced con 15 mascotas y base online para 2 - 5 jugadores de Photon Fusion en Android.
                            </p>
                          </div>
                          <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
                            <span className="font-black text-pink-400 uppercase tracking-wider block">Fase 2: Expansión de Contenido (Mes 5 a 8)</span>
                            <p className="text-slate-300 leading-normal mt-1">
                              Lanzamiento de segundo Tablero temático ("Cumbre Helada del Fénix"), 8 nuevos minijuegos, pase de batalla de segunda temporada, y soporte preliminar para juego local compartido en pantalla de tablet.
                            </p>
                          </div>
                          <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
                            <span className="font-black text-cyan-400 uppercase tracking-wider block">Fase 3: Crossplay & Franquicia (Mes 9+)</span>
                            <p className="text-slate-300 leading-normal mt-1">
                              Soporte técnico para iOS nativo, expansión cruzada PC (Steam), sistema de clanes, y mercado de skins cosméticos licenciadas con marcas reconocidas del universo cósmico.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>
              </motion.div>
            )}

            {/* TAB 2: EL TABLERO INTERACTIVO EN LÍNEA DE PRUEBAS */}
            {activeTab === 'sandbox' && (
              <motion.div 
                key="sandbox_tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col md:flex-row gap-5 overflow-hidden h-full"
              >
                
                {/* Visual Board Stage Arena */}
                <div className="flex-1 flex flex-col justify-between bg-black/40 p-4 rounded-[2rem] border-2 border-white/10 relative overflow-hidden h-full">
                  
                  {/* Dynamic background matching the active invocation color */}
                  <div className={`absolute inset-0 opacity-15 pointer-events-none transition-all duration-700 bg-gradient-to-b ${
                    activeInvocation ? activeInvocation.colorHex : 'from-indigo-900/40 to-transparent'
                  }`} />

                  {/* Header metadata inside simulator panel */}
                  <div className="flex justify-between items-center z-10">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-pink-300">Sandbox Simulator v1.0</span>
                      <h4 className="font-black text-base md:text-lg italic tracking-tight text-white leading-tight">Valle de los Dioses Perdidos</h4>
                    </div>

                    <div className="bg-slate-900/90 py-1.5 px-3 rounded-full border border-white/10 text-[10px] font-black text-yellow-400 uppercase tracking-wider">
                      {activeInvocation ? `INVOCACIÓN: ${activeInvocation.name}` : "Portal Divino Silencioso"}
                    </div>
                  </div>

                  {/* Board Nodes Visualization */}
                  <div className="flex-1 relative flex items-center justify-center min-h-[220px] md:min-h-[280px]">
                    
                    {/* Shadow underneath toons centered */}
                    <div className="absolute w-[180px] md:w-[260px] h-[30px] bg-black/40 rounded-[100%] blur-md bottom-12" />

                    {/* Circular layout of board nodes paths */}
                    <div className="absolute inset-0 flex items-center justify-center p-2">
                      {/* Central Summon Visual indicator */}
                      <div className="text-center z-10 bg-slate-950/70 p-4 rounded-full border-2 border-white/10 w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center overflow-hidden">
                        {activeInvocation ? (
                          <>
                            <span className="text-2xl md:text-4xl animate-bounce">{activeInvocation.emoji}</span>
                            <span className="text-[8px] md:text-[10px] font-black text-yellow-400 mt-1 uppercase text-center leading-tight truncate w-full">{activeInvocation.name}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl md:text-2xl text-slate-500 font-mono">🗿</span>
                            <span className="text-[8px] md:text-[9px] text-slate-400 mt-1 uppercase leading-none font-bold">Sin Evento</span>
                          </>
                        )}
                      </div>

                      {/* Display the circular chain of nodes */}
                      <svg className="w-full h-full absolute" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 50,15 A 35,35 0 1,1 49.9,15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" strokeDasharray="3,3" />
                      </svg>

                      {/* Render sandbox nodes dynamically */}
                      {SANDBOX_BOARD_NODES.map((node) => {
                        const isPlayerHere = currentNodeId === node.id;
                        return (
                          <div
                            key={node.id}
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            className={`absolute w-8 h-8 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 z-20 ${
                              isPlayerHere 
                                ? 'bg-pink-500 text-white scale-125 border-white ring-4 ring-pink-400/50 font-black' 
                                : node.type === 'coin_plus' ? 'bg-blue-600/90 border-blue-400 text-white text-xs' 
                                : node.type === 'coin_minus' ? 'bg-red-600/90 border-red-400 text-white text-xs'
                                : node.type === 'divine_portal' ? 'bg-purple-600/95 border-purple-400 text-white text-xs'
                                : node.type === 'shortcut' ? 'bg-cyan-500/90 border-cyan-300 text-white text-xs'
                                : node.type === 'trophy' ? 'bg-yellow-500/95 border-yellow-300 text-white text-xs animate-pulse'
                                : 'bg-slate-700/90 border-slate-500 text-slate-300 text-xs'
                            }`}
                            title={`${node.name}: ${node.description}`}
                          >
                            {isPlayerHere ? (
                              <span className="text-xs">🦊</span>
                            ) : node.type === 'coin_plus' ? (
                              <span>+</span>
                            ) : node.type === 'coin_minus' ? (
                              <span>-</span>
                            ) : node.type === 'divine_portal' ? (
                              <span>🔮</span>
                            ) : node.type === 'shortcut' ? (
                              <span>⚡</span>
                            ) : node.type === 'trophy' ? (
                              <span>🏆</span>
                            ) : (
                              <span>{node.id}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Active Invocations trigger bar for testing */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 p-2 rounded-2xl border border-white/5 overflow-x-auto max-w-[90%] shrink-0 scrollbar-none z-30">
                      <span className="text-[8px] font-black uppercase text-pink-300 mr-1 tracking-wider whitespace-nowrap">Director:</span>
                      {DIVINE_INVOCATIONS.map((invo) => (
                        <button
                          key={invo.id}
                          onClick={() => handleTriggerManualInvocation(invo)}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded-lg text-[9px] font-black uppercase text-yellow-400 border border-white/10 flex items-center gap-1 shrink-0 transition"
                        >
                          <span>{invo.emoji}</span>
                          <span>{invo.name.split(',')[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dice Rolling Controls */}
                  <div className="flex justify-between items-center bg-black/40 px-4 py-3 rounded-2xl border border-white/10 z-10 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center relative">
                        {isRolling ? (
                          <div className="w-6 h-6 border-4 border-t-pink-500 border-r-pink-500 border-white/10 rounded-full animate-spin" />
                        ) : (
                          <span className="text-2xl font-black text-yellow-400 font-mono italic">
                            {diceResult !== null ? diceResult : "🎲"}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">Resultado Dado</span>
                        <span className="text-xs font-black text-slate-200 mt-1 uppercase">
                          {isRolling ? "Girando..." : diceResult ? `Sacaste un ${diceResult}` : "¡Toca para tirar!"}
                        </span>
                      </div>
                    </div>

                    <button
                      id="action_roll_dice"
                      onClick={handleRollDice}
                      disabled={isRolling}
                      className="px-6 py-2.5 bg-gradient-to-t from-green-600 to-green-400 rounded-xl border-b-4 border-green-800 flex items-center justify-center font-black italic shadow-md hover:from-green-500 text-xs text-white"
                    >
                      TIRAR DADO 🎲
                    </button>
                  </div>
                </div>

                {/* Sidebar Game Controllers */}
                <div className="w-full md:w-80 flex flex-col gap-4 shrink-0 h-full overflow-hidden">
                  
                  {/* Select Character & Pet Panel */}
                  <div className="bg-slate-950/40 p-4 rounded-3xl border border-white/5 space-y-3 shrink-0">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-pink-300 uppercase tracking-widest text-[10px]">Ajustes Sandbox</span>
                      <span className="font-mono text-slate-400 text-[10px]">Android Build</span>
                    </div>

                    {/* Character Select Slider */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-300 font-bold block uppercase tracking-wide">Elegir Personaje Toon:</label>
                      <select 
                        id="sandbox_char_select"
                        value={playerChar.id}
                        onChange={(e) => {
                          const f = CHARACTERS.find(c => c.id === e.target.value);
                          if (f) handleSelectSandboxChar(f);
                        }}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                      >
                        {CHARACTERS.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Pet Select Slider */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-300 font-bold block uppercase tracking-wide">Elegir Acompañante Mascota:</label>
                      <select 
                        id="sandbox_pet_select"
                        value={playerPet.id}
                        onChange={(e) => {
                          const f = PETS.find(p => p.id === e.target.value);
                          if (f) handleSelectSandboxPet(f);
                        }}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                      >
                        {PETS.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.rarity})</option>
                        ))}
                      </select>
                    </div>

                    {/* Dynamic stats preview box */}
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/5 text-[10px] space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Casilla Activa:</span>
                        <span className="text-white font-bold">#{currentNodeId} ( {SANDBOX_BOARD_NODES.find(n => n.id === currentNodeId)?.name} )</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Mascota Activa:</span>
                        <span className="text-pink-300 font-bold">{playerPet.name}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-400">Poder de Mascota:</span>
                        <span className="text-slate-300 font-black italic">{playerPet.abilityName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sandbox Logs */}
                  <div className="flex-1 bg-slate-950/40 p-4 rounded-3xl border border-white/5 flex flex-col overflow-hidden min-h-[120px]">
                    <span className="text-[11px] font-black uppercase text-pink-300 tracking-wider mb-2 shrink-0">Historial de Partida</span>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-[10px] leading-relaxed">
                      {gameLogs.map((log, idx) => (
                        <div key={idx} className={`p-2 rounded-xl text-xs border ${
                          idx === 0 
                            ? 'bg-slate-800/80 text-white border-pink-500/30 font-bold' 
                            : 'bg-black/20 text-slate-400 border-white/5'
                        }`}>
                          <span className="text-[9px] opacity-40 block">Paso {gameLogs.length - idx}</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* TAB 3: DEV BRAINSTORMING ROOM WITH REAL GEMINI STREAMING */}
            {activeTab === 'chatbot' && (
              <motion.div 
                key="chatbot_tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex-1 flex flex-col overflow-hidden h-full"
              >
                
                {/* Chat header explaining roles */}
                <div className="bg-slate-950/50 p-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3 shrink-0 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👥</span>
                      <h4 className="font-black text-sm uppercase tracking-tight text-white leading-tight">Mesa de Debate con la IA (Co-Design Studio)</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal max-w-xl">
                      Pregúntale a los expertos en el estudio para planificar balance, optimizaciones móviles, nuevos minijuegos temáticos y el lanzamiento de Clashtoon Party.
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full text-[9px] font-bold text-yellow-400 uppercase tracking-widest whitespace-nowrap self-start sm:self-center">
                    Gemini 3.5 AI Active
                  </div>
                </div>

                {/* Scrolled chat dialog space */}
                <div className="flex-1 bg-black/40 rounded-[2rem] border-2 border-white/10 p-4 overflow-y-auto space-y-3 pr-2 flex flex-col mb-4">
                  {chatHistory.map((message, index) => {
                    const isUser = message.role === 'user';
                    return (
                      <div 
                        key={index} 
                        className={`flex flex-col max-w-[85%] rounded-2xl p-4 gap-1 ${
                          isUser 
                            ? 'bg-pink-600 border border-pink-500 text-white self-end rounded-br-none' 
                            : 'bg-slate-950/80 border border-white/5 text-slate-200 self-start rounded-bl-none'
                        }`}
                      >
                        {/* Speaker Identifier */}
                        <span className={`text-[9px] font-black uppercase tracking-wider ${
                          isUser ? 'text-pink-200' : 'text-yellow-400'
                        }`}>
                          {isUser ? 'Tú (Director Creativo)' : 'Estudio de Videojuegos Clashtoon'}
                        </span>
                        
                        {/* Text dialog formatted in Markdown parsed elements */}
                        <div className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed space-y-2">
                          {message.text.split('\n\n').map((paragraph, pIdx) => {
                            // Simple parser to make bold headings look magnificent
                            const formattedPara = paragraph.replace(/\*\*(.*?)\*\*/g, '$1');
                            const isBoldHeading = paragraph.startsWith('**');
                            return (
                              <p key={pIdx} className={isBoldHeading ? 'font-bold text-white' : ''}>
                                {paragraph}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* AI Generating Loader */}
                  {isChatLoading && (
                    <div className="bg-slate-950/80 border border-white/5 text-slate-200 self-start rounded-2xl rounded-bl-none p-4 max-w-[85%] flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0s' }} />
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
                      </div>
                      <span className="text-xs text-slate-500">Mesa de desarrollo redactando acta...</span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Form controls to typing message */}
                <form onSubmit={handleSendChatMessage} className="flex gap-3 shrink-0">
                  <input
                    id="chat_message_input"
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Escribe sugerencias de minijuegos, consultas de balances o mecánicas..."
                    className="flex-1 bg-slate-950/70 border-2 border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 font-sans"
                    disabled={isChatLoading}
                  />
                  <button
                    id="chat_send_btn"
                    type="submit"
                    disabled={isChatLoading || !chatMessage.trim()}
                    className="px-5 bg-gradient-to-t from-yellow-600 to-yellow-400 border-b-4 border-yellow-800 hover:from-yellow-500 text-slate-900 rounded-2xl flex items-center justify-center font-black transition disabled:opacity-50"
                  >
                    <Send className="w-5 h-5 text-slate-950" />
                  </button>
                </form>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </main>

      {/* FOOTER BAR - Matching the exact template aesthetics with Online statuses */}
      <footer className="h-12 bg-black/40 flex items-center shrink-0 px-6 border-t border-white/10 justify-between text-[10px] font-bold tracking-widest text-slate-400 uppercase z-10">
        <div className="flex gap-4 md:gap-6 items-center">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span className="text-slate-300">Sala de Redacción [Canal Abierto]</span>
          </div>
          <span className="hidden sm:inline">Personal de Diseño: Activo (7/7)</span>
          <span className="hidden lg:inline text-pink-300 font-black">Android MVP 1.0</span>
        </div>
        <div>Compilado v0.5.1-Beta - Unity Suite</div>
      </footer>

    </div>
  );
}
