import { Character, Pet, Minigame, DivineInvocation, SandboxNode } from "./types";

export const CHARACTERS: Character[] = [
  {
    id: "ember",
    name: "Ember, el Zorro Solar",
    type: "Mascota Mágica",
    story: "Ember es la última chispa viviente de la Fogata Cósmica Ancestral. Rescatado por los monjes del Templo del Sol, ahora viaja de tablero en tablero buscando diversión y dándole calor a los aventureros desprevenidos.",
    personality: "Alegre, dinámico e hiperactivo. No soporta estar quieto y gesticula exageradamente cada vez que saca un número alto.",
    visualDesign: "Pelaje naranja brillante con puntas amarillas vibrantes que emiten vapor, ojos esmeralda expresivos, colita esponjosa de fuego fatuo y un collar de cuentas sagradas alrededor de su cuello.",
    element: "Fuego",
    signatureCosmetic: "Sombrero de Copa de Llamas Verdes (Skin Legendaria)"
  },
  {
    id: "lupino",
    name: "Lupino, Guardián de Plata",
    type: "Criatura Mitológica",
    story: "Nacido bajo la luz de la luna llena de cristal, Lupino patrullaba las Ruinas Mitológicas protegiendo los antiguos tótems del eclipse eterno. Decidió unirse al festival de Clashtoon para conocer rivales fuertes.",
    personality: "Noble, un poco reservado y serio, pero con un lado de cachorro juguetón cuando gana un minijuego.",
    visualDesign: "Lobo de pelaje blanco níveo con patrones rúnicos de luz cian en el lomo, orejas largas y puntiagudas con aretes plateados, y una gema lunar incrustada en su frente.",
    element: "Luna / Cristal",
    signatureCosmetic: "Armadura Celestial de Gladiador (Skin Épica)"
  },
  {
    id: "ginkox",
    name: "Ginkox, el Sabio Bromista",
    type: "Criatura Mitológica",
    story: "Una deidad menor del Bosque Encantado que tomó forma de panda rojo gigante. Tras dormir por 300 años, despertó con antojo de bambú de regaliz y risas interminables.",
    personality: "Glotón, perezoso, pero de mente aguda. Le encanta sorprender a otros jugadores robándoles monedas mediante astutas trampas.",
    visualDesign: "Panda rojo de proporciones rechonchas estilo chibby, con una gran hoja de ginkgo dorada flotando en su cabeza, cejas pobladas blancas y un pergamino sagrado a la cintura.",
    element: "Naturaleza",
    signatureCosmetic: "Traje de Chef de Bambú (Skin Rara)"
  },
  {
    id: "valkiria_yuki",
    name: "Yuki, la Espada de Escarcha",
    type: "Héroe Legendario",
    story: "Una joven guerrera del norte que domesticó a los Espíritus de Hielo del Glaciar del Fin del Mundo. Es la campeona y representante elegida por los clanes nórdicos en el torneo de los Dioses.",
    personality: "Valiente, competitiva y apasionada por los desafíos físicos. Siempre choca las manos al comenzar minijuegos cooperativos.",
    visualDesign: "Guerrera pequeña con trenzas de color azul claro, corona vikinga pequeña con alitas doradas, armadura de placas redondeadas de un blanco perlado y espada de espuma de hielo indestructible.",
    element: "Hielo / Viento",
    signatureCosmetic: "Capa de Auroras Pulsantes (Efecto Visual)"
  },
  {
    id: "totem_tom",
    name: "Tótem Tom",
    type: "Criatura Mitológica",
    story: "Un fragmento animado de la columna sagrada del Templo Antiguo. Tom cobró vida cuando un jugador distraído derramó poción de hiperactividad sobre las runas de piedra del sótano.",
    personality: "Impulsivo, ruidoso y sumamente protector con los cofres de trofeos. Habla con efectos de sonido de percusión y madera.",
    visualDesign: "Bloque cilíndrico flotante de madera ancestral tallada con caras caricaturescas apilables. Cambia su rostro activo (Feliz, Enojado, Sorprendido) según su posición en el tablero.",
    element: "Tierra / Runa",
    signatureCosmetic: "Manta Festiva Hawaiana y Flores de Hibisco (Skin Rara)"
  },
  {
    id: "capitan_pompom",
    name: "Capitán PomPom",
    type: "Héroe Legendario",
    story: "El corsario peluche más temido del Kraken Celestial. PomPom navegaba por los océanos de mermelada y nubes antes de naufragar en el Valle de los Dioses Perdidos y enamorarse de su comida.",
    personality: "Audaz y dramático. Cree firmemente que es una bestia temible, a pesar de que todos lo consideran extremadamente tierno.",
    visualDesign: "Pingüino pirata de felpa negra, con un parche de estrella en el ojo izquierdo, un gorro de almirante inflable que le queda grande y una mini-espada de plástico inflable.",
    element: "Agua / Viento",
    signatureCosmetic: "Parche Holográfico de Calavera de Neón (Cosmético)"
  },
  {
    id: "nekor",
    name: "NekoR, el Gato de Silicio",
    type: "Mascota Mágica",
    story: "Un felino cibernético venido de una dimensión futurista donde el festival Clashtoon se convirtió en un e-sport intergaláctico. Viajó en el tiempo para competir en las raíces originales del Valle.",
    personality: "Curioso, sarcástico y sumamente analítico. Duerme sobre un cojín de píxeles flotantes cuando no es su turno.",
    visualDesign: "Gato negro holográfico con líneas de circuitos cian brillantes, cola en forma de rayo pixelado y visera LED que muestra caritas animadas de emojis (^.^) en lugar de ojos.",
    element: "Tecnología",
    signatureCosmetic: "Visera Cyberpunk RGB Flotante (Cosmético)"
  },
  {
    id: "anubis_junior",
    name: "Anubis Junior",
    type: "Criatura Mitológica",
    story: "El joven heredero de la balanza mística del inframundo de caricatura. Cansado de pesar almas aburridas, escapó de sus deberes reales para pasar el fin de semana jugando y coleccionando muñecos.",
    personality: "Travieso, parlanchín y un poco presumido. Le encanta posar ante la cámara cuando gana monedas.",
    visualDesign: "Pequeño chacal de color azul marino y oro egipcio, vistiendo un tocado Nemes de tela brillante, un collar de escarabajo turquesa y brazaletes de oro mágico.",
    element: "Sombra / Oro",
    signatureCosmetic: "Máscara de Faraón de Oro Puro (Skin Legendaria)"
  },
  {
    id: "pip_el_fénix",
    name: "Pip, el Polluelo Ígneo",
    type: "Criatura Mitológica",
    story: "Una cría de Fénix Dorado que es demasiado pequeña para volar largas distancias, así que prefiere rodar o rebotar. Su mayor sueño es quemar el manual de reglas para poder tirar el dado dos veces.",
    personality: "Entusiasta, despistado e impredecible. A menudo estornuda soltando confeti de chispas ardientes.",
    visualDesign: "Pequeña bola de plumas amarillas y rosadas esponjosas, con ojos redondos enormes, patitas rojas cortas y una pequeña coronita de laurel flotante sobre las plumas de su cabeza.",
    element: "Fuego Sagrado",
    signatureCosmetic: "Auriculares Gamer de Chispas (Skin Épica)"
  },
  {
    id: "sir_bacon",
    name: "Sir Bacon, el Caballero Porcino",
    type: "Héroe Legendario",
    story: "Un porcino de noble cuna que juró proteger la Gran Cacerola de los Dioses. Se unió al Clashtoon Party para demostrar que su brillante armadura de aluminio no es solo para lucirse.",
    personality: "Pomposo, caballeroso y extremadamente cortés con los rivales, disculpándose antes de empujarlos en las plataformas.",
    visualDesign: "Cerdito rosa robusto embutido en una armadura metálica hiperestilizada brillante con un yelmo redondo del que sobresale una pluma de plátano verde, sosteniendo un escudo de galleta gruesa.",
    element: "Metal / Masa",
    signatureCosmetic: "Efecto de rastro de migajas de oro al caminar (Efecto Visual)"
  }
];

export const PETS: Pet[] = [
  {
    id: "p1",
    name: "Chispa de Fuego",
    rarity: "Común",
    style: "text-orange-500 bg-orange-950/40 border-orange-700/60",
    abilityName: "Empujoncito Ígneo",
    abilityDesc: "Al caer en una casilla de 'Avanzar/Atajo', hay un 25% de probabilidad de avanzar 1 casilla adicional.",
    category: "Movilidad"
  },
  {
    id: "p2",
    name: "Monedín",
    rarity: "Común",
    style: "text-yellow-500 bg-yellow-950/40 border-yellow-700/60",
    abilityName: "Interés de Calderilla",
    abilityDesc: "Otorga +1 moneda adicional cada vez que recibes monedas en casillas normales de obtención.",
    category: "Monedas"
  },
  {
    id: "p3",
    name: "Burbujita de Coral",
    rarity: "Común",
    style: "text-blue-500 bg-blue-950/40 border-blue-700/60",
    abilityName: "Cúpula de Espuma",
    abilityDesc: "Protege una única vez de la pérdida de hasta 2 monedas al caer en casillas de penalización roja.",
    category: "Soporte"
  },
  {
    id: "p4",
    name: "Slime Saltador",
    rarity: "Común",
    style: "text-green-500 bg-green-950/40 border-green-700/60",
    abilityName: "Salto Pegajoso",
    abilityDesc: "Visual: Deja un rastro de moco verde divertido al saltar. No otorga ventajas competitivas de combate.",
    category: "Especial"
  },
  {
    id: "p5",
    name: "Gatito de la Suerte",
    rarity: "Rara",
    style: "text-amber-500 bg-amber-950/40 border-amber-700/60",
    abilityName: "Zarpazo de la Fortuna",
    abilityDesc: "Si quedas en último lugar en un minijuego, hay un 40% de recibir una compensación de +3 monedas.",
    category: "Monedas"
  },
  {
    id: "p6",
    name: "Gromito de la Cueva",
    rarity: "Rara",
    style: "text-amber-700 bg-amber-950/50 border-amber-900/60",
    abilityName: "Buscador de Pepitas",
    abilityDesc: "Al caer en casillas neutrales simples, desentierra +2 monedas en un 30% de los turnos.",
    category: "Monedas"
  },
  {
    id: "p7",
    name: "Nube Veloz",
    rarity: "Rara",
    style: "text-cyan-400 bg-cyan-950/40 border-cyan-700/60",
    abilityName: "Viento de Cola",
    abilityDesc: "Añade un dado especial '1-2' que se puede usar una vez por partida para movimientos cortos controlados.",
    category: "Movilidad"
  },
  {
    id: "p8",
    name: "Sombrerito de Seta",
    rarity: "Rara",
    style: "text-teal-400 bg-teal-950/40 border-teal-700/60",
    abilityName: "Spora Sanadora",
    abilityDesc: "Inmunidad temporal de 1 turno contra trampas de ralentización colocadas por otros personajes en el tablero.",
    category: "Soporte"
  },
  {
    id: "p9",
    name: "Lobo Estelar Infantil",
    rarity: "Épica",
    style: "text-indigo-400 bg-indigo-950/40 border-indigo-700/60",
    abilityName: "Sincronía Lunar",
    abilityDesc: "Durante el evento global de 'Lobo Lunar', duplica los puntos de atajo conseguidos en casillas mágicas.",
    category: "Movilidad"
  },
  {
    id: "p10",
    name: "Mini-Fénix de Cenizas",
    rarity: "Épica",
    style: "text-rose-500 bg-rose-950/40 border-rose-700/60",
    abilityName: "Renacer Dorado",
    abilityDesc: "Evita perder un turno cuando la casilla del Volcán entra en erupción y te desplaza hacia atrás.",
    category: "Soporte"
  },
  {
    id: "p11",
    name: "Tentaculín de Nubes",
    rarity: "Épica",
    style: "text-pink-400 bg-pink-950/40 border-pink-700/60",
    abilityName: "Tinta Brillantina",
    abilityDesc: "Reduce el coste de compra de pociones en la Tienda del Tablero en 2 monedas permanentes.",
    category: "Monedas"
  },
  {
    id: "p12",
    name: "Cactín Desertor",
    rarity: "Épica",
    style: "text-emerald-500 bg-emerald-950/40 border-emerald-700/60",
    abilityName: "Espina Escudo",
    abilityDesc: "Cuando un oponente intente robarte monedas directamente en el tablero, recibe un contra-daño de 1 moneda.",
    category: "Soporte"
  },
  {
    id: "p13",
    name: "Dragón Miniatura Imperial",
    rarity: "Legendaria",
    style: "text-yellow-400 bg-yellow-950/60 border-yellow-500/60 ring-2 ring-yellow-400/30",
    abilityName: "Favor de la Dinastía",
    abilityDesc: "Otorga un dado extra de 3 caras (1, 2, 3) que se suma a tu dado principal de forma permanente cuando vas de último.",
    category: "Movilidad"
  },
  {
    id: "p14",
    name: "Gato Espectral de Jade",
    rarity: "Legendaria",
    style: "text-green-400 bg-green-950/60 border-green-500/60 ring-2 ring-green-400/30",
    abilityName: "Jade de la Fortuna",
    abilityDesc: "Al ganar cualquier minijuego individual, multiplica la recompensa de monedas recibidas un x1.5.",
    category: "Monedas"
  },
  {
    id: "p15",
    name: "Espíritu de las Runas",
    rarity: "Legendaria",
    style: "text-purple-400 bg-purple-950/60 border-purple-500/60 ring-2 ring-purple-400/30",
    abilityName: "Resonancia Divina",
    abilityDesc: "Duplica la efectividad de las Invocaciones Divinas si resultas beneficiado por su efecto aleatorio de tablero.",
    category: "Soporte"
  }
];

export const MINIGAMES: Minigame[] = [
  {
    id: "reflex_1",
    name: "¡Esquiva la Ola Celestial!",
    category: "Reflejos",
    objective: "Mantenlo en pie sobre una balsa oscilante mientras esquivas olas e impactos de agua lanzados desde el fondo del escenario por el Kraken Celestial.",
    mechanics: [
      "Plataforma inestable movilizada por físicas de oleaje.",
      "Aparición de indicadores circulares de impacto 0.8 seg antes de que caigan chorros de agua.",
      "El agua empuja hacia atrás en lugar de eliminar, permitiendo remontadas divertidas."
    ],
    duration: 60,
    controls: "Botones Virtuales Izquierda/Derecha o Joystick Virtual táctil, botón de salto para superar olas rasas.",
    rewards: "1er Lugar: 10 monedas | 2do Lugar: 6 monedas | 3er Lugar: 4 monedas | 4to Lugar: 2 monedas"
  },
  {
    id: "race_2",
    name: "Autopista de Auroras",
    category: "Carreras",
    objective: "Llegar a la línea de meta en un tobogán hecho enteramente de luz cósmica, recolectando turbos de estrellas.",
    mechanics: [
      "Velocidad constante con aceleración por derrapes en las curvas.",
      "Suelo con paneles de velocidad verdes (aceleración temporal) y obstáculos de nieve lentos.",
      "Uso de atajos curvos flotantes arriesgados."
    ],
    duration: 75,
    controls: "Deslizar el dedo lateralmente (Swipe) para girar o inclinar la pantalla con el giroscopio flotante.",
    rewards: "1er Lugar: 12 monedas | 2do Lugar: 7 monedas | 3er Lugar: 5 monedas | Otros: 2 monedas"
  },
  {
    id: "combat_3",
    name: "¡Boleto de Despegue Toon!",
    category: "Combate",
    objective: "Sacar a los oponentes de una arena flotante usando martillos inflables gigantes que rebotan.",
    mechanics: [
      "Cada golpe acumula 'Porcentaje de Rebote' en las víctimas, similar a Super Smash Bros.",
      "A mayor porcentaje, los personajes vuelan más lejos tras el impacto.",
      "Caídas aleatorias de martillos especiales gigantes de oro por tiempo limitado."
    ],
    duration: 90,
    controls: "Joystick táctil izquierdo para movimiento; botón derecho 'GOLPE' para golpear, botón 'DASH' de recarga rápida.",
    rewards: "Cada jugador derrotado da +2 monedas al ejecutor. El sobreviviente final recibe 10 monedas."
  },
  {
    id: "ffa_4",
    name: "Lluvia de Monedas del Fénix",
    category: "Todos contra todos",
    objective: "Atrapar la mayor cantidad de monedas y plumas de oro puro que llueven desde el cielo en un templo sagrado.",
    mechanics: [
      "Plumas doradas de alto puntaje flotan en zigzag, requiriendo saltos calculados.",
      "Monedas negras falsas caen de broma y te restan monedas si las tocas.",
      "Aparición de un super-cofre en los últimos 15 segundos que requiere múltiples golpes."
    ],
    duration: 60,
    controls: "Joystick visual clásico de arrastre táctil amplio, botón flotante 'SALTAR' y 'DESLIZARSE'.",
    rewards: "Las monedas acumuladas durante el minijuego se suman de inmediato al presupuesto personal del jugador (Cap. 15)."
  },
  {
    id: "two_vs_three_5",
    name: "Tiradores de Totems",
    category: "2 vs 3",
    objective: "El equipo de 2 controla tótems de piedra fijos que lanzan pelotas de pintura de neón, el equipo de 3 debe esquivarlas y activar los interruptores del suelo.",
    mechanics: [
      "Equipo de 2: Vista aérea tipo torreta, disparan pelotas de colores.",
      "Equipo de 3: Vista en tercera persona, se mueven en cuadrícula buscando activar 3 interruptores gigantes.",
      "Los interruptores requieren estar parados encima durante 3 segundos continuos sin recibir impactos de pelotas."
    ],
    duration: 80,
    controls: "Equipo de 2: Toques táctiles reactivos directos en la celda donde disparar. Equipo de 3: Controles de movimiento 2D joystick.",
    rewards: "Equipo Ganador: 8 monedas a cada integrante | Equipo Perdedor: 3 monedas a cada uno"
  },
  {
    id: "survival_6",
    name: "Lava de la Erupción Sagrada",
    category: "Supervivencia",
    objective: "Sobrevivir en una cuadrícula de plataformas de piedra flotante que se sumergen lentamente en lava caliente.",
    mechanics: [
      "Cuadrícula de 6x6 paneles de piedra flotantes tallados.",
      "Los paneles tiemblan y se encienden en rojo 1.5 seg antes de hundirse por completo por vapor.",
      "Los sobrevivientes se mueven a zonas sanas. Pequeño rebote físico si dos jugadores se paran en el mismo panel."
    ],
    duration: 90,
    controls: "Joystick táctil ultra-sensible para corregir pequeños deslices, botón de salto para cruzar huecos vacíos.",
    rewards: "10 monedas a todos los sobrevivientes que sigan de pie tras los 90 segundos completados."
  },
  {
    id: "reflex_7",
    name: "Pase de Chicle Bomba",
    category: "Todos contra todos",
    objective: "Pasar la bomba de chicle inflado a los oponentes antes de que estalle y te deje inmovilizado en resina rosa dulce.",
    mechanics: [
      "La bomba se pasa haciendo contacto directo chocando cuerpo a cuerpo con otro jugador.",
      "La bomba simula un inflado continuo visual, cambiando de velocidad de pitido.",
      "Obstáculos en la sala como corrientes de aire o barriles empujables."
    ],
    duration: 60,
    controls: "Joystick táctil izquierdo, doble toque rápido para impulsar hacia adelante (Dash) y embestir al blanco.",
    rewards: "El jugador derrotado por la explosión pierde 4 monedas. El sobreviviente restante gana 8 monedas de bonificación."
  },
  {
    id: "race_8",
    name: "Deslizamiento del Volcán",
    category: "Carreras",
    objective: "Descender por una rampa de lodo ardiente y obsidiana pulida sorteando géiseres de vapor ruidosos.",
    mechanics: [
      "Física de inercia y arrastre en declive pronunciado.",
      "Obstáculos móviles como piedras rodantes que dañan el impulso.",
      "Anillos de velocidad que otorgan multiplicadores de velocidad instantáneos."
    ],
    duration: 70,
    controls: "Inclinación por giroscopio del móvil para giros fluidos u opción alternativa de botones laterales flotantes amplios.",
    rewards: "1er Lugar: 11 monedas | 2do Lugar: 6 monedas | 3er Lugar: 4 monedas | 4to Lugar: 1 moneda"
  },
  {
    id: "survival_9",
    name: "Simón Dice Divino",
    category: "Reflejos",
    objective: "Imitar los movimientos rúnicos que el Lobo Lunar proyecta en el cielo nocturno del Bosque Sagrado.",
    mechanics: [
      "El lobo dibuja una secuencia de runas de colores (Azul, Amarillo, Rojo, Verde) en constelaciones.",
      "Los jugadores deben pararse rápidamente en los paneles rúnicos correspondientes en el orden exacto.",
      "El tiempo disponible para pulsar las runas disminuye un 15% en cada ronda exitosa."
    ],
    duration: 85,
    controls: "Joystick de movimiento rápido para cruzar paneles, botón de activación para sellar la secuencia.",
    rewards: "Cada secuencia correcta otorga +2 monedas de bonificación directa. Sobrevivir toda la ronda otorga 8 extra."
  },
  {
    id: "combat_10",
    name: "¡Pánico en el Puente de Cuerdas!",
    category: "Combate",
    objective: "Mantener el equilibrio en un puente colgante estrecho que se tambalea mientras utilizas cojines mágicos para empujar a los demás.",
    mechanics: [
      "El puente tiene torsión física ajustable por el movimiento colectivo de los jugadores.",
      "Ataques débiles que desestabilizan pero no tiran, ataques fuertes con retardo de recarga de 2.5 seg.",
      "Presencia de cuervos míticos de cartón que roban trofeos menores si te golpean."
    ],
    duration: 80,
    controls: "Teclado / Táctil: Joystick para equilibrio interno, botón rápido de golpe suave y botón de empuje fuerte.",
    rewards: "1er Lugar: 10 monedas | 2do Lugar: 5 monedas | Otros: 2 monedas"
  },
  {
    id: "two_vs_three_11",
    name: "Transportes de Monedas Sagradas",
    category: "2 vs 3",
    objective: "El equipo de 3 transporta un saco pesado de monedas a través de un laberinto en ruinas de templos antiguos, el equipo de 2 maneja trampas de fuego a distancia.",
    mechanics: [
      "Equipo de 3: Debe coordinarse cargando un saco gigante que reduce la velocidad de movimiento individual un 40%.",
      "Equipo de 2: Dispone de consola holográfica para activar ventiladores, trampas de pinchos y rejas móviles por turnos.",
      "Las monedas que caigan del saco por trampas quedan tiradas para robo inmediato."
    ],
    duration: 90,
    controls: "Controles táctiles clásicos y botones de alerta rápida para coordinar el relevo en el saco de oro místico.",
    rewards: "Monedas guardadas con éxito en el cofre del laberinto se suman al balance de monedas acumulables del equipo ganador."
  }
];

export const DIVINE_INVOCATIONS: DivineInvocation[] = [
  {
    id: "dragon_ancestral",
    name: "Dragón Ancestral",
    title: "¡Ira del Dragón Ancestral!",
    visualEffectDesc: "Los cielos se oscurecen, nubes rojas giran en espiral y una silueta gigante de dragón oriental sobrevuela el escenario, dejando caer un rayo de energía espiritual dorada que altera los caminos.",
    boardAlteration: "Reorganiza las casillas de atajos. Rutas normales de un bosque denso se bloquean con rocas y se abren túneles secretos excavados de lava con casillas de bonificación de dados extra.",
    economyImpact: "Reduce el precio del Trofeo de Victoria en un 50% de forma temporal durante los siguientes 3 turnos (de 20 a 10 monedas de costo).",
    strategicChange: "Los jugadores apresuran su marcha hacia la actual casilla del Cohete de Trofeo. Quienes vayan retrasados priorizan casillas de atajos dorados abiertos por las llamaradas mágicas.",
    colorHex: "from-red-600 to-orange-500",
    emoji: "🐲"
  },
  {
    id: "fenix_dorado",
    name: "Fénix Dorado",
    title: "¡Resplandor de Ceniza del Fénix Dorado!",
    visualEffectDesc: "La pantalla se inunda de plumas llameantes de color oro y fucsia. El Fénix Dorado se posa en la cima del Volcán Sagrado, haciendo que brille con un fulgor místico.",
    boardAlteration: "Transforma 8 casillas rojas de penalización normales en casillas de 'Cofre del Fénix' donde los jugadores reciben un reembolso doble de lo perdido e intercambian pociones.",
    economyImpact: "Otorga inmediatamente +5 monedas a los dos jugadores con los balances de tesorería más bajos de la partida (mecanismo asistido de control anti-monopolio).",
    strategicChange: "Los jugadores modifican sus rutas para caer voluntariamente en casillas antes peligrosas, generando un desvío masivo hacia la falda del volcán sagrado.",
    colorHex: "from-yellow-500 to-rose-500",
    emoji: "🐦"
  },
  {
    id: "lobo_lunar",
    name: "Lobo Lunar",
    title: "¡Eclipse Cósmico del Lobo Lunar!",
    visualEffectDesc: "Un eclipse lunar cubre el sol, sumiendo el tablero en un ambiente nocturno brillante con luces de neón cian. Un aullido místico resuena en todo el Valle.",
    boardAlteration: "Invierte por completo el sentido de la marcha del tablero para todos los jugadores durante 2 turnos completos. Caminar de reversa permite revisar casillas saltadas.",
    economyImpact: "Detiene por completo las transacciones de robo directo de monedas en casillas trampa; toda moneda robada se deposita en una bolsa mística flotante al centro.",
    strategicChange: "Los jugadores se enfocan en asediar la casilla del perdedor para robar la bolsa mística gigante que contiene todas las monedas silenciadas por el eclipse lunar.",
    colorHex: "from-blue-600 to-indigo-900",
    emoji: "🐺"
  },
  {
    id: "kraken_celestial",
    name: "Kraken Celestial",
    title: "¡Diluvio y Tormenta del Kraken!",
    visualEffectDesc: "Rayos de agua brillante caen de nubes esponjosas, chorros y tentáculos de agua translúcidos emergen del Templo Antiguo, agitando los puentes flotantes rústicos.",
    boardAlteration: "Inunda los caminos bajos del Valle de los Dioses Perdidos, obligando a los jugadores a avanzar únicamente por las sendas aéreas que cuentan con dados de salto de precisión.",
    economyImpact: "Resta -3 monedas a los jugadores que caigan al agua por sacar números impares en su dado convencional.",
    strategicChange: "Uso inmediato de objetos y mascotas de movilidad (Nube Veloz o Chispa) para forzar giros de dados pares y evitar caídas absurdas por el agua del Kraken.",
    colorHex: "from-blue-400 to-teal-500",
    emoji: "🦑"
  },
  {
    id: "gato_fortuna",
    name: "Gato de la Fortuna",
    title: "¡Lluvia del Gato de la Fortuna!",
    visualEffectDesc: "Un simpático gato gigante de porcelana de estilo Maneki-Neko aparece en el centro, saludando rítmicamente con su patita dorada para hacer llover lingotes de chocolate dorado.",
    boardAlteration: "Sustituye temporalmente el 50% de las casillas neutrales del tablero por 'Casillas del Gato' con multiplicador de dados dobles por 1 turno.",
    economyImpact: "Cada jugador que saque un número par de movimientos recibe de inmediato un bono masivo de +8 monedas de chocolate canjeables por ítems cósmicos.",
    strategicChange: "Los dados cargados y pociones adquieren máxima prioridad táctica para asegurar aterrizajes perfectos en las casillas del Gato de la Fortuna.",
    colorHex: "from-amber-400 to-yellow-300",
    emoji: "🐱"
  }
];

export const BOARD_SECTORS = [
  {
    name: "El Bosque Encantado",
    desc: "Un sendero tupido con raíces brillantes y árboles que parpadean. Ideal para jugadores iniciales por su abundancia de casillas de monedas de color verde.",
    aesthetic: "Místico, verde esmeralda y violeta neón."
  },
  {
    name: "El Templo Antiguo",
    desc: "Plataformas flotantes de piedra labrada donde reside el mercader cósmico. Se conecta a través de puentes de cuerda que reaccionan con las invocaciones del Kraken Celestial.",
    aesthetic: "Histórico, dorado místico, piedra caliza pulida."
  },
  {
    name: "Las Ruinas Mitológicas",
    desc: "Un anfiteatro destruido donde el Lobo Lunar suele invocar su eclipse cósmico. Contiene casillas con atajos secretos ocultos bajo baldosas con runas sagradas.",
    aesthetic: "Solemne, azul plateado, tótems tallados."
  },
  {
    name: "El Volcán Dormido",
    desc: "Ruta de alto riesgo / alta recompensa que rodea la chimenea de vapor del Valle. En cualquier momento puede entrar en erupción por el Fénix de Cenizas, enviándote de vuelta.",
    aesthetic: "Peligroso, obsidiana, lavas bermellón brillantes."
  },
  {
    name: "Las Zonas Secretas de los Dioses",
    desc: "Solo accesibles cayendo en la casilla mística de 'Portal Divino' con la mascota adecuada. Aquí residen cofres de trofeos de victoria libres de cuotas raras.",
    aesthetic: "Cósmico y celestial, nubes esponjosas color rosa chicle."
  }
];

export const SANDBOX_BOARD_NODES: SandboxNode[] = [
  { id: 1, type: 'neutral', x: 10, y: 50, name: "Salida", description: "Punto de partida del Valle de los Dioses Perdidos." },
  { id: 2, type: 'coin_plus', x: 20, y: 35, name: "Casilla Solar", description: "Otorga +3 monedas de oro." },
  { id: 3, type: 'coin_plus', x: 30, y: 25, name: "Casilla Solar", description: "Otorga +3 monedas de oro." },
  { id: 4, type: 'coin_minus', x: 42, y: 30, name: "Trampa de Lava", description: "Resta -3 monedas de oro por calor." },
  { id: 5, type: 'shortcut', x: 50, y: 15, name: "Ruta de Viento", description: "Te permite saltar directo a la Casilla 8 si usas mascota voladora." },
  { id: 6, type: 'divine_portal', x: 55, y: 40, name: "Portal Divino", description: "Despierta a una Invocación Divina aleatoria de forma instantánea." },
  { id: 7, type: 'coin_plus', x: 65, y: 28, name: "Senda del Bosque", description: "Otorga +3 monedas de oro místico." },
  { id: 8, type: 'coin_minus', x: 74, y: 45, name: "Pantano Pegajoso", description: "Resta -2 monedas de oro." },
  { id: 9, type: 'trophy', x: 88, y: 52, name: "Altar del Trofeo", description: "¡Cofre del Trofeo Cósmico! Cuesta 20 monedas comprar el Trofeo de la Victoria aquí." },
  { id: 10, type: 'neutral', x: 92, y: 70, name: "Casilla de Descanso", description: "No pasa absolutamente nada, ideal para recuperar fuerzas de manera casual." }
];

export const COMPARATIVE_ANALYSIS = {
  marioParty: {
    strength: "Marca icónica consolidada, robustez cooperativa presencial offline.",
    weakness: "Mecánica de partidas pesadas y largas (45-90 min), nula progresión persistente de skins de mascotas en consolas fijas cerradas, barrera de entrada económica de hardware Nintendo Switch.",
    differentiation: "Nuestra propuesta dura un promedio ágil de 15 minutos en móviles (perfecto para niños y adultos sobre la marcha), e integra Invocaciones Divinas de gran impacto que cambian físicamente el tablero en vivo."
  },
  fallGuys: {
    strength: "Mecánicas de carreras multitudinarias y mucha comedia de físicas ridículas.",
    weakness: "Carece de componente estratégico de tableros por turnos, no fomenta coleccionismo de mascotas con habilidades tácticas complementarias, alta exigencia de destreza refleja mecánica pura.",
    differentiation: "Fusión de mecánicas de tablero tradicionales con controles ágiles y accesibilidad táctil total."
  },
  stumbleGuys: {
    strength: "Rápido emparejamiento móvil y skins de alto impacto comercial viral.",
    weakness: "Nula profundidad táctica colectiva secundaria, modo de juego puramente competitivo repetitivo sin tableros interactivos.",
    differentiation: "Invocaciones Divinas que introducen eventos de fantasía que cambian rutas, además de mascotas táctiles coleccionables sin esquemas Pay-To-Win dañinos."
  }
};
