// MIRACLE ENGINEERING — core quest deck, v0.1
// Shared by index.html (prototype) and the rulebook. Add quests via the Quest Forge
// (see prompts/quest-forge.md) using the same shape.
//
// Resources: LEG Legitimacy · ATT Attention · CAP Capital · TEC Technology · ACC Access · IMA Imagination
// Miracle:   { n: name, r: [resources that can feed it], d: difficulty 1–3 (successes needed), kind?: "lateral" | "reframe" }
// Tier:      { t: "I"|"II"|"III"|"IV", name, need: [miracle indices], pts }
//            I = Full Miracle · II = Ultra (next best thing) · III = Lateral (sideways win) · IV = Reframe (change the meaning)
// facts:     real-world notes, kept separate from invention. Checked as of 2026; verify before quoting.

window.RESOURCES = {
  LEG: "Legitimacy", ATT: "Attention", CAP: "Capital",
  TEC: "Technology", ACC: "Access", IMA: "Imagination"
};

window.QUESTS = [
  // ───────────────────────── ROLE QUESTS (A) ─────────────────────────
  {
    id: "shah", type: "role", title: "Become the Shah of Iran",
    flavor: "The legendary quest. Also available as SHARK OF IRAN.",
    facts: "Iran's monarchy was abolished in 1979. A Pahlavi claimant already exists, so the literal route runs through a restoration Iranians would have to choose, and through him.",
    miracles: [
      { n: "Learn Persian history, language and poetry well enough to be taken seriously", r: ["IMA", "ACC"], d: 1 },
      { n: "Build a real following in the Iranian diaspora", r: ["ATT", "ACC"], d: 2 },
      { n: "Iranians vote for a constitutional monarchy", r: ["LEG"], d: 3 },
      { n: "The existing claimant's line declines the throne", r: ["ACC"], d: 3 },
      { n: "A constituent assembly nominates you", r: ["LEG"], d: 3 },
      { n: "Other states recognise the coronation", r: ["LEG", "ACC"], d: 2 },
      { n: "Get crowned 'Shah of Nowruz' by a Persian new-year festival", r: ["ATT", "IMA"], d: 1, kind: "lateral" },
      { n: "Publish enough original Shark of Iran material to own the search results", r: ["ATT", "IMA"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Shah of Iran", need: [0, 1, 2, 3, 4, 5], pts: 10 },
      { t: "II", name: "Royal adviser to a restored monarchy", need: [0, 1, 2], pts: 6 },
      { t: "III", name: "Shah of Nowruz", need: [0, 6], pts: 4 },
      { t: "IV", name: "The internet's canonical Shark of Iran", need: [7], pts: 2 }
    ],
    power: "Divan — once per round, add 2 Legitimacy dice to any other player's attempt at no cost.",
    burden: "Crown's weight — every deal you make is announced to the table."
  },
  {
    id: "pope", type: "role", title: "Become Pope",
    flavor: "White smoke is a dependency graph resolving.",
    facts: "Any baptised Catholic man is technically eligible. In practice every pope since Urban VI (1378) was already a cardinal. The Archbishop of Canterbury leads a different church, so it is a sideways move, not a step down.",
    miracles: [
      { n: "Baptism, confirmation and serious theological training", r: ["IMA", "LEG"], d: 1 },
      { n: "Ordination as a priest", r: ["LEG"], d: 2 },
      { n: "Made a bishop", r: ["LEG", "ACC"], d: 2 },
      { n: "Created a cardinal", r: ["ACC"], d: 3 },
      { n: "A deadlocked conclave looks for an outsider", r: ["ACC", "IMA"], d: 3 },
      { n: "Two-thirds of the conclave votes for you", r: ["LEG"], d: 3 },
      { n: "Chosen as Archbishop of Canterbury (different church, different rules)", r: ["LEG", "ACC"], d: 3, kind: "lateral" },
      { n: "Found the lay Order of Miracle Engineers; the table elects you its Pontiff", r: ["IMA"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Pope", need: [0, 1, 2, 3, 4, 5], pts: 10 },
      { t: "II", name: "Cardinal", need: [0, 1, 2, 3], pts: 6 },
      { t: "III", name: "Archbishop of Canterbury", need: [0, 6], pts: 4 },
      { t: "IV", name: "Pontiff of the Order of Miracle Engineers", need: [7], pts: 2 }
    ],
    power: "Urbi et Orbi — once per game, every player may reroll one failed attempt this round. Also: you may waive a Saint's five-year rule.",
    burden: "Vows — you cannot give or receive Capital."
  },
  {
    id: "king", type: "role", title: "Become King of England",
    flavor: "A title nobody has technically held since 1707. Vacancy!",
    facts: "The Acts of Union (1707) replaced 'King of England' with the UK crown. Succession is by descent (Succession to the Crown Act 2013); Parliament has changed the line before (Act of Settlement 1701). Marrying in makes you a consort, never the monarch. The current senior royals are all married, so the marriage route in this deck is generic.",
    miracles: [
      { n: "Become a British citizen and public figure", r: ["LEG", "ATT"], d: 1 },
      { n: "Knighted for services to education", r: ["LEG", "ATT"], d: 2 },
      { n: "A constitutional crisis reopens the succession", r: ["LEG"], d: 3 },
      { n: "Parliament passes an Act naming you heir, as it did in 1701", r: ["LEG"], d: 3 },
      { n: "Every Commonwealth realm agrees", r: ["ACC"], d: 3 },
      { n: "Accession and coronation", r: ["LEG", "ATT"], d: 2 },
      { n: "Marry into a reigning royal family, anywhere", r: ["ACC"], d: 3, kind: "lateral" },
      { n: "Revive the vacant title: King of England of a book, a festival or a pub quiz league", r: ["IMA", "ATT"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "King of England (well, the UK)", need: [0, 2, 3, 4, 5], pts: 10 },
      { t: "II", name: "Sir / Dame", need: [0, 1], pts: 6 },
      { t: "III", name: "Royal consort", need: [6], pts: 4 },
      { t: "IV", name: "King of the revived title", need: [7], pts: 2 }
    ],
    power: "Royal Warrant — once per round, one of your Legitimacy dice on another player's attempt counts as an automatic success.",
    burden: "Above politics — you cannot help either side of a Reconcile quest until it resolves."
  },
  {
    id: "mars", type: "role", title: "Become President of Mars",
    flavor: "Prototype path by a player who changed his name to Mars.",
    facts: "Nobody lives on Mars yet. The Outer Space Treaty (1967) bars any nation from claiming it, so the office is open to invention. Mars analogue habitats on Earth (Utah, Hawaii, Antarctica) are real.",
    miracles: [
      { n: "A permanent human settlement on Mars", r: ["TEC", "CAP"], d: 3 },
      { n: "The settlement adopts a constitution with a presidency", r: ["LEG", "IMA"], d: 2 },
      { n: "You get there", r: ["TEC", "CAP"], d: 3 },
      { n: "You win the first election", r: ["ATT", "LEG"], d: 2 },
      { n: "Command a Mars analogue mission on Earth", r: ["TEC", "ACC"], d: 3 },
      { n: "Design the education system the first Martians learn to read with", r: ["IMA", "TEC"], d: 2, kind: "lateral" },
      { n: "Change your name to Mars and sign every reading book 'President Mars'", r: ["IMA"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "President of Mars", need: [0, 1, 2, 3], pts: 10 },
      { t: "II", name: "Commander of a Mars analogue base", need: [4], pts: 6 },
      { t: "III", name: "Minister of Martian Education", need: [5], pts: 4 },
      { t: "IV", name: "President Mars (by name and by book)", need: [6], pts: 2 }
    ],
    power: "New Jurisdiction — once per game, strike one Legitimacy miracle from another player's quest; they host it on Mars.",
    burden: "Light delay — you always act last in the round."
  },
  {
    id: "rabbi", type: "role", title: "Become Chief Rabbi",
    flavor: "First question: chief of where?",
    facts: "There is no single world Chief Rabbi. Israel has two (Ashkenazi and Sephardi); the UK, France and others each have their own. Choosing the jurisdiction is part of the puzzle.",
    miracles: [
      { n: "Jewish upbringing or conversion, then years of Torah study", r: ["IMA", "LEG"], d: 2 },
      { n: "Semikhah (rabbinic ordination)", r: ["LEG"], d: 2 },
      { n: "Lead a congregation well for a decade", r: ["ATT", "ACC"], d: 2 },
      { n: "Selected by a national body", r: ["LEG", "ACC"], d: 3 },
      { n: "Serve a community so small it has no rabbi at all", r: ["ACC"], d: 1, kind: "lateral" },
      { n: "Start a commentary tradition on this game's rules; be its first chief interpreter", r: ["IMA"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Chief Rabbi", need: [0, 1, 2, 3], pts: 10 },
      { t: "II", name: "Rabbi of a leading congregation", need: [0, 1, 2], pts: 6 },
      { t: "III", name: "Chief Rabbi of the smallest community on Earth", need: [0, 1, 4], pts: 4 },
      { t: "IV", name: "Chief interpreter of the rules", need: [5], pts: 2 }
    ],
    power: "Responsa — your vote counts double when the table judges a reframe or compression.",
    burden: "Sabbath — you take no actions in round 7 (Blitz: round 3)."
  },
  {
    id: "unsg", type: "role", title: "Become Secretary-General of the UN",
    flavor: "Five vetoes stand between you and a very large desk.",
    facts: "Appointed by the General Assembly on the Security Council's recommendation; any of the five permanent members can block a candidate. Regional rotation is a strong convention, not a rule.",
    miracles: [
      { n: "A senior diplomatic career", r: ["LEG", "ACC"], d: 2 },
      { n: "Your government nominates you", r: ["LEG"], d: 2 },
      { n: "Regional rotation favours your region", r: ["ACC"], d: 3 },
      { n: "No permanent member vetoes you", r: ["LEG", "ACC"], d: 3 },
      { n: "The General Assembly appoints you", r: ["LEG"], d: 1 },
      { n: "Appointed head of a UN agency", r: ["ACC", "LEG"], d: 3 },
      { n: "Secretary-General of an international sports or science federation", r: ["ACC"], d: 2, kind: "lateral" },
      { n: "Secretary-General of this table: you chair every vote for the rest of the game", r: ["ACC"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Secretary-General", need: [0, 1, 2, 3, 4], pts: 10 },
      { t: "II", name: "Head of a UN agency", need: [0, 5], pts: 6 },
      { t: "III", name: "Federation Secretary-General", need: [6], pts: 4 },
      { t: "IV", name: "Secretary-General of the table", need: [7], pts: 2 }
    ],
    power: "Good Offices — once per round, convene an attempt: every player who helps adds +1 bonus die.",
    burden: "Impartiality — your other Role quest caps at Tier II."
  },
  {
    id: "saint", type: "role", title: "Become a Saint",
    flavor: "The only quest where 'miracles required' is literal canon law.",
    facts: "Catholic canonisation normally needs a documented life of heroic virtue, a five-year wait after death (a pope can waive it, as John Paul II did for Mother Teresa), one verified miracle for beatification and a second for sainthood.",
    miracles: [
      { n: "A life of heroic virtue, documented by witnesses", r: ["LEG", "ATT"], d: 2 },
      { n: "The five-year rule passes, or a Pope waives it", r: ["LEG"], d: 3 },
      { n: "A diocese opens your cause", r: ["LEG", "ACC"], d: 2 },
      { n: "First verified miracle: Blessed", r: ["IMA"], d: 3 },
      { n: "Second verified miracle: Saint", r: ["IMA"], d: 3 },
      { n: "A shrine people visit without anyone's permission: folk saint", r: ["ATT"], d: 2, kind: "lateral" },
      { n: "The table declares you patron saint of something oddly specific", r: ["IMA"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Saint", need: [0, 1, 2, 3, 4], pts: 10 },
      { t: "II", name: "Blessed", need: [0, 1, 2, 3], pts: 6 },
      { t: "III", name: "Folk saint", need: [5], pts: 4 },
      { t: "IV", name: "Patron saint of something oddly specific", need: [6], pts: 2 }
    ],
    power: "Intercession — once per game, declare any failed attempt a success.",
    burden: "Saints don't haggle — you earn no Bonds for helping; you still give them."
  },

  // ───────────────────────── OUTCOME QUESTS (B) ─────────────────────────
  {
    id: "nobel2", type: "outcome", title: "Win two Nobel Prizes in the same year",
    flavor: "A genuine never-been-done.",
    facts: "Never happened. Four people have won two over a lifetime: Marie Curie (1903, 1911), Linus Pauling (1954, 1962), John Bardeen (1956, 1972), Frederick Sanger (1958, 1980).",
    miracles: [
      { n: "Prize-level work in field A", r: ["TEC", "IMA"], d: 3 },
      { n: "Prize-level work in field B", r: ["IMA", "TEC"], d: 3 },
      { n: "Both committees ripen on the same schedule", r: ["ACC"], d: 3 },
      { n: "Nominated in both", r: ["ACC", "LEG"], d: 2 },
      { n: "Win the first", r: ["LEG"], d: 2 },
      { n: "Win the second the same October", r: ["LEG"], d: 3 },
      { n: "Win an Ig Nobel (research that makes people laugh, then think)", r: ["IMA", "ATT"], d: 1, kind: "lateral" },
      { n: "Found a prize, then win it twice in one year", r: ["IMA", "CAP"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Double laureate, same year", need: [0, 1, 2, 3, 4, 5], pts: 10 },
      { t: "II", name: "Nobel laureate", need: [0, 3, 4], pts: 6 },
      { t: "III", name: "Ig Nobel laureate", need: [6], pts: 4 },
      { t: "IV", name: "Two-time winner of your own prize", need: [7], pts: 2 }
    ],
    power: "Laureate — your Imagination dice succeed on 4+ instead of 5+.",
    burden: "Lecture circuit — you draw one fewer resource card each round."
  },
  {
    id: "country", type: "outcome", title: "Found a new country",
    flavor: "Declaring is easy. Being recognised is the miracle.",
    facts: "South Sudan (2011) is the most recent widely recognised new state. In practice recognition by other states matters more than meeting the Montevideo criteria (territory, population, government, capacity for relations).",
    miracles: [
      { n: "Territory", r: ["CAP", "ACC"], d: 3 },
      { n: "A permanent population", r: ["ATT"], d: 2 },
      { n: "A government that actually governs", r: ["LEG"], d: 2 },
      { n: "A constitution", r: ["IMA", "LEG"], d: 1 },
      { n: "Recognised by one UN member", r: ["ACC"], d: 3 },
      { n: "UN membership", r: ["LEG", "ACC"], d: 3 },
      { n: "A micronation with passports, flag and anthem", r: ["IMA", "ATT"], d: 1, kind: "lateral" },
      { n: "The table ratifies your constitution as its own", r: ["IMA"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Founder of a UN member state", need: [0, 1, 2, 3, 4, 5], pts: 10 },
      { t: "II", name: "Founder of a recognised state", need: [0, 1, 2, 3, 4], pts: 6 },
      { t: "III", name: "Micronation founder", need: [3, 6], pts: 4 },
      { t: "IV", name: "Author of the table's constitution", need: [7], pts: 2 }
    ],
    power: "Sovereignty — once per game, reduce any Legitimacy miracle for any player by 1 difficulty, permanently.",
    burden: "Foreign policy — you must publicly declare one ally and one rival each session."
  },
  {
    id: "moon", type: "outcome", title: "Get something onto the Moon",
    flavor: "Anything. A book. A seed. A small sign that says 'hi'.",
    facts: "Commercial landers now fly paying payloads; early published prices were around a million dollars per kilogram. Several recent landers crashed or tipped over, so landing intact is the hard part.",
    miracles: [
      { n: "Design a payload worth sending", r: ["IMA", "TEC"], d: 1 },
      { n: "Fund it", r: ["CAP"], d: 2 },
      { n: "Sign a contract with a lander company", r: ["ACC", "CAP"], d: 2 },
      { n: "The lander launches", r: ["TEC"], d: 2 },
      { n: "The lander touches down intact", r: ["TEC"], d: 3 },
      { n: "Get your object to orbit or a space station instead", r: ["TEC", "ACC"], d: 2, kind: "lateral" },
      { n: "Put your name, not your object, on a Moon-bound list", r: ["ATT"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Something of yours is on the Moon", need: [0, 1, 2, 3, 4], pts: 10 },
      { t: "II", name: "Launched toward the Moon", need: [0, 1, 2, 3], pts: 6 },
      { t: "III", name: "In orbit", need: [0, 5], pts: 4 },
      { t: "IV", name: "Your name went to the Moon", need: [6], pts: 2 }
    ],
    power: "Payload Bay — once per game, complete any Technology miracle for another player outright.",
    burden: "Launch window — your power only works in even-numbered rounds."
  },
  {
    id: "phenom", type: "outcome", title: "Create a global cultural phenomenon",
    flavor: "The world hums your tune without knowing where it came from.",
    facts: "Most global phenomena spread through remix and imitation rather than through their creators. Crossing a language barrier is the usual bottleneck.",
    miracles: [
      { n: "Make something original", r: ["IMA"], d: 2 },
      { n: "Your first thousand true fans", r: ["ATT"], d: 2 },
      { n: "A trusted voice amplifies it", r: ["ACC", "ATT"], d: 2 },
      { n: "It crosses a language barrier", r: ["IMA", "ATT"], d: 3 },
      { n: "Strangers remix it without you", r: ["ATT"], d: 3 },
      { n: "It survives its first backlash", r: ["LEG"], d: 2 },
      { n: "People still quote it ten years later: cult classic", r: ["ATT", "IMA"], d: 2, kind: "lateral" },
      { n: "The table adopts your phrase for the rest of the game", r: ["IMA"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Global phenomenon", need: [0, 1, 2, 3, 4, 5], pts: 10 },
      { t: "II", name: "Viral once", need: [0, 1, 2], pts: 6 },
      { t: "III", name: "Cult classic", need: [0, 1, 6], pts: 4 },
      { t: "IV", name: "Table catchphrase", need: [7], pts: 2 }
    ],
    power: "Megaphone — once per round, give 2 Attention dice to any attempt.",
    burden: "Fame — your hidden quests are revealed to everyone."
  },
  {
    id: "reconcile", type: "outcome", title: "Get two incompatible factions to cooperate",
    flavor: "On one thing. Just one. That's the miracle.",
    facts: "Negotiation research keeps finding the same pattern: back channels, one shared concrete goal, and protection from each side's hardliners.",
    miracles: [
      { n: "Earn trust on side A", r: ["ACC", "LEG"], d: 2 },
      { n: "Earn trust on side B", r: ["ACC", "LEG"], d: 2 },
      { n: "Find the one goal both actually want", r: ["IMA"], d: 2 },
      { n: "A private meeting happens", r: ["ACC"], d: 3 },
      { n: "Neither side's hardliners sink it", r: ["LEG"], d: 3 },
      { n: "A public joint action", r: ["ATT"], d: 2 },
      { n: "Reconcile two feuding families, clubs or departments", r: ["ACC", "IMA"], d: 1, kind: "lateral" },
      { n: "Two rival players at this table co-sign a deal you brokered", r: ["ACC"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Peacemaker", need: [0, 1, 2, 3, 4, 5], pts: 10 },
      { t: "II", name: "A back channel that works", need: [0, 1, 2, 3], pts: 6 },
      { t: "III", name: "Local peacemaker", need: [2, 6], pts: 4 },
      { t: "IV", name: "Table broker", need: [7], pts: 2 }
    ],
    power: "Back Channel — once per round, broker a three-way deal; all three players gain a Bond with each other.",
    burden: "Honest broker — you cannot make secret deals."
  },
  {
    id: "institution", type: "outcome", title: "Create an institution that outlives you",
    flavor: "The final boss of founders: your own absence.",
    facts: "Most organisations do not survive their founder's departure; the transfer of leadership and funding is where they usually fail.",
    miracles: [
      { n: "A mission people care about", r: ["IMA"], d: 1 },
      { n: "A founding team better than you", r: ["ACC"], d: 2 },
      { n: "Sustainable funding", r: ["CAP"], d: 3 },
      { n: "A legal form and real governance", r: ["LEG"], d: 2 },
      { n: "It survives a founder crisis", r: ["LEG", "ACC"], d: 3 },
      { n: "A successor leads it without you", r: ["LEG"], d: 3 },
      { n: "A tradition instead: an annual event others organise", r: ["ATT", "IMA"], d: 2, kind: "lateral" },
      { n: "A rule you invented enters next game's rulebook", r: ["IMA"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Institution builder", need: [0, 1, 2, 3, 4, 5], pts: 10 },
      { t: "II", name: "Runs a year without you", need: [0, 1, 2, 3], pts: 6 },
      { t: "III", name: "Founder of a tradition", need: [0, 6], pts: 4 },
      { t: "IV", name: "Rulesmith", need: [7], pts: 2 }
    ],
    power: "Endowment — once per round, give one resource card of any type from the supply to any player.",
    burden: "Board oversight — another player must agree before you use any power."
  },

  // ───────────────────────── ENABLER QUESTS (C) ─────────────────────────
  // Checkable conditions rather than dice miracles (d: 0 = mark it when it's true).
  {
    id: "kingmaker", type: "enabler", title: "Kingmaker",
    flavor: "Make the player on your left reach something extraordinary.",
    facts: "",
    miracles: [
      { n: "Learn their hidden quests", r: ["ACC"], d: 1 },
      { n: "Help on three of their attempts", r: [], d: 0 },
      { n: "They claim a Tier II", r: [], d: 0 },
      { n: "They claim a Tier I", r: [], d: 0 },
      { n: "They claim any tier with your help", r: [], d: 0, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Kingmaker", need: [0, 1, 3], pts: 10 },
      { t: "II", name: "Power behind the throne", need: [0, 1, 2], pts: 6 },
      { t: "IV", name: "Useful friend", need: [4], pts: 2 }
    ],
    power: "Whisper — once per round, move one of your Bonds to another player.",
    burden: "Shadow — you can't claim a Tier I of your own in the same round they do."
  },
  {
    id: "cascade", type: "enabler", title: "Cascade Architect",
    flavor: "One move. Half the board lights up.",
    facts: "",
    miracles: [
      { n: "Map the board: name every player's bottleneck out loud", r: ["IMA"], d: 1 },
      { n: "Hold Bonds with three different players", r: [], d: 0 },
      { n: "One of your actions triggers two powers in a row", r: [], d: 0 },
      { n: "One of your actions completes miracles for three or more players", r: [], d: 0 },
      { n: "One of your actions completes a miracle for every player", r: [], d: 0 },
      { n: "One of your actions completes miracles for two players", r: [], d: 0, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Cascade Architect", need: [0, 1, 2, 4], pts: 10 },
      { t: "II", name: "Chain-reaction engineer", need: [0, 2, 3], pts: 6 },
      { t: "IV", name: "Double-tap", need: [5], pts: 2 }
    ],
    power: "Domino — when your help completes a miracle, the owner may immediately attempt another.",
    burden: "Load-bearing — if you pass a round without helping, you lose a Bond."
  },
  {
    id: "compressor", type: "enabler", title: "Make the impossible trivial",
    flavor: "Take someone's scariest chain and shrink it.",
    facts: "",
    miracles: [
      { n: "Pick a Tier I chain of five or more miracles belonging to someone else", r: [], d: 0 },
      { n: "Get one compression of it accepted", r: ["IMA"], d: 2 },
      { n: "Get a second compression accepted", r: ["IMA"], d: 2 },
      { n: "Get a third compression accepted", r: ["IMA"], d: 3 },
      { n: "They claim Tier I on the compressed chain", r: [], d: 0 },
      { n: "Invent a new tier for someone and have the table ratify it", r: ["IMA"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Miracle Compressor", need: [0, 1, 2, 3, 4], pts: 10 },
      { t: "II", name: "Dependency surgeon", need: [0, 1, 2], pts: 6 },
      { t: "IV", name: "Tier inventor", need: [5], pts: 2 }
    ],
    power: "Occam — your compressions need only one Insight instead of two.",
    burden: "Show your work — every compression you pitch must be explained in under a minute."
  },
  {
    id: "alliance", type: "enabler", title: "The unlikely alliance",
    flavor: "Three players with nothing in common. One deal.",
    facts: "",
    miracles: [
      { n: "Find three players who share no Bonds", r: ["ACC"], d: 1 },
      { n: "Design a deal where each gives and each gets", r: ["IMA"], d: 2 },
      { n: "All three sign", r: ["ACC"], d: 2 },
      { n: "The deal completes a miracle for each of them", r: [], d: 0 },
      { n: "Broker any deal between two players who share no Bonds", r: ["ACC"], d: 1, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Coalition engineer", need: [0, 1, 2, 3], pts: 10 },
      { t: "II", name: "Treaty-maker", need: [0, 1, 2], pts: 6 },
      { t: "IV", name: "Matchmaker", need: [4], pts: 2 }
    ],
    power: "Signatory — deals you broker cannot be broken by Miracle Cards.",
    burden: "Guarantor — if a deal you brokered fails, you lose a Bond with each party."
  },
  {
    id: "lastmile", type: "enabler", title: "The last mile",
    flavor: "Be the one who carries the final player over the line.",
    facts: "",
    miracles: [
      { n: "Help the player with the fewest claimed tiers", r: [], d: 0 },
      { n: "Help them again in a later round", r: [], d: 0 },
      { n: "They claim their first tier", r: [], d: 0 },
      { n: "You add the decisive die in Full Miracle Engineering Mode", r: [], d: 0 },
      { n: "Give away your best resource card to whoever is furthest behind", r: [], d: 0, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "The Last Mile", need: [0, 1, 3], pts: 10 },
      { t: "II", name: "Rearguard", need: [0, 1, 2], pts: 6 },
      { t: "IV", name: "Open hand", need: [4], pts: 2 }
    ],
    power: "Second wind — once per game, the player furthest behind takes an extra action.",
    burden: "Never first — you can't claim a Tier I while anyone has no tier at all."
  },
  {
    id: "impossible", type: "enabler", title: "Make another player's impossible possible",
    flavor: "Pick the quest everyone laughed at. Don't laugh.",
    facts: "",
    miracles: [
      { n: "Name the quest at the table with the most unresolved miracles", r: [], d: 0 },
      { n: "Remove one of its miracles by any means", r: ["IMA", "ACC"], d: 2 },
      { n: "Remove a second", r: ["IMA", "ACC"], d: 2 },
      { n: "Its owner claims Tier II or better", r: [], d: 0 },
      { n: "Its owner claims Tier I", r: [], d: 0 },
      { n: "Its owner claims any tier", r: [], d: 0, kind: "reframe" }
    ],
    tiers: [
      { t: "I", name: "Miracle Engineer", need: [0, 1, 2, 4], pts: 10 },
      { t: "II", name: "Possibility maker", need: [0, 1, 3], pts: 6 },
      { t: "IV", name: "Believer", need: [5], pts: 2 }
    ],
    power: "Improbability drive — once per game, set any miracle's difficulty to 1 for one attempt.",
    burden: "Stake — if that player ends with no tier, you lose 5 points."
  }
];

// Miracle Cards: improbable external events drawn at the end of each round.
window.MIRACLE_CARDS = [
  { n: "Unexpected Introduction", e: "Choose two players who share no Bond. They each gain a Bond with the other." },
  { n: "Public Attention", e: "Pick one quest. Its Attention miracles are 1 easier this round." },
  { n: "Technological Breakthrough", e: "Strike one Technology miracle from any quest, permanently." },
  { n: "Institutional Crisis", e: "A window opens: every Legitimacy miracle attempted this round is difficulty 1. It closes at round end." },
  { n: "Change of Rules", e: "The table votes to disable one power for the rest of the session. Its owner picks any unclaimed power from a completed quest instead." },
  { n: "Scandal", e: "The player with the most Bonds chooses: lose one Bond, or skip their next attempt." },
  { n: "Funding Winter", e: "Capital miracles are 1 harder for the next two rounds." },
  { n: "The Algorithm Smiles", e: "Any one Tier IV reframe may be claimed right now if the majority laughs at the pitch." },
  { n: "Succession Crisis", e: "Every Role quest may attempt one Tier I miracle at 1 easier this round." },
  { n: "Hidden Link", e: "The Miracle Master names two players whose quests share a resource bottleneck. One attempt this round counts for both." },
  { n: "Burnout", e: "Anyone holding four or more Bonds gives one to the player with the fewest." },
  { n: "Black Swan", e: "Every player may redraw one unfinished quest. Progress on it is lost; claimed tiers stay." },
  { n: "Golden Hour", e: "The player with the fewest completed miracles gets +3 dice on their next attempt." },
  { n: "Rival Claimant", e: "Any player may contest another's Role quest this round. If both succeed on the same miracle, both mark it." },
  { n: "Open Source", e: "One player publishes their full hand of quests. Everyone who helps them this round gains two Bonds instead of one." },
  { n: "Lucky Break", e: "Every player gains one Insight." }
];

// ───────────────────────── LIVING DECK ─────────────────────────
// Reality moves, so the deck moves. See RULES.md §12 and REALITY_LOG.md.
// A quest can carry:
//   since:   edition it entered the deck, e.g. "2026.1"
//   reality: [{ date, m: miracle index, note }] steps reality resolved for everyone (struck at every table)
//   retired: { date, note } when someone in the real world does the whole Tier I. The quest leaves the
//            wheel and moves to the Hall of Accomplished Impossibles. Codex entries for it are kept forever.
window.QUESTS.push({
  id: "perks", type: "outcome", since: "2026.2", title: "Make the real world honour a title",
  flavor: "Get an actual café to give an actual discount to the Shark of Iran.",
  facts: "Venues offer perks when they get foot traffic back. Big-brand NFT loyalty schemes have closed (Starbucks Odyssey ran 2022 to 2024), so most working loyalty schemes use ordinary accounts and QR codes. See docs/COLLECTIBLES.md.",
  miracles: [
    { n: "Write a one-page offer a venue can say yes to in five minutes", r: ["IMA"], d: 1 },
    { n: "The first venue honours a Miracle Engineering title with a perk", r: ["ACC"], d: 2 },
    { n: "Five venues in one city", r: ["ACC", "ATT"], d: 2 },
    { n: "A venue in another country", r: ["ACC"], d: 3 },
    { n: "A stranger you have never met redeems a perk", r: ["ATT"], d: 2 },
    { n: "A national chain signs on", r: ["CAP", "ACC"], d: 3 },
    { n: "An institution honours a title instead: a library, school or museum", r: ["LEG", "ACC"], d: 2, kind: "lateral" },
    { n: "A friend's kitchen issues the first perk: 10% off tea for any Shark of Iran", r: ["IMA"], d: 1, kind: "reframe" }
  ],
  tiers: [
    { t: "I", name: "Perk network founder", need: [0, 1, 2, 3, 4, 5], pts: 10 },
    { t: "II", name: "City perk network", need: [0, 1, 2], pts: 6 },
    { t: "III", name: "Institutionally recognised", need: [6], pts: 4 },
    { t: "IV", name: "Kitchen-table perk", need: [7], pts: 2 }
  ],
  power: "Perk network — once per round, any one player takes a resource card of their choice from the supply.",
  burden: "Customer service — whenever a Miracle Card hurts another player, you skip your next action."
});

window.QUESTS.push({
  id: "tycoon", type: "outcome", since: "2026.3", title: "Become a Title Tycoon",
  flavor: "You didn't climb Everest. You own the shirt, the summit Trophy and the gift shop.",
  facts: "Trophies are tradable collectibles minted from earned titles. A bought Trophy counts as a Tier IV Reframe on its quest and never adds CP. See docs/COLLECTIBLES.md.",
  miracles: [
    { n: "Buy your first Trophy from a stranger", r: ["CAP"], d: 1 },
    { n: "Own a Trophy from every quest type: Role, Outcome and Enabler", r: ["CAP", "ACC"], d: 2 },
    { n: "Own a venue-attested Tier I Trophy", r: ["CAP"], d: 3 },
    { n: "Own a reality-attested Trophy", r: ["CAP", "ATT"], d: 3 },
    { n: "Sell a Trophy to someone who later earns that title themselves", r: ["ATT"], d: 2 },
    { n: "Curate the collection into a public exhibition: the Hall of Bought Impossibles", r: ["IMA", "ACC"], d: 2, kind: "lateral" },
    { n: "Wear a T-shirt saying 'My friend became Pope and all I got was this Trophy'", r: ["IMA"], d: 1, kind: "reframe" }
  ],
  tiers: [
    { t: "I", name: "Title Tycoon", need: [0, 1, 2, 3, 4], pts: 10 },
    { t: "II", name: "Serious collector", need: [0, 1, 2], pts: 6 },
    { t: "III", name: "Curator of the Impossible", need: [5], pts: 4 },
    { t: "IV", name: "Wearer of the shirt", need: [6], pts: 2 }
  ],
  power: "Market maker — whenever another player claims Tier I or II, you give them one resource card of your choice.",
  burden: "Provenance — you can't claim Tier I or II on any quest whose Trophy you bought. You'd only be buying the climb."
});

// The main quest. The page features it above the wheel (see ARCHETYPES below).
window.QUESTS.push({
  id: "peace", type: "role", since: "2026.4", title: "Unify humanity as the Ambassador of Peace",
  flavor: "Eight names everyone on Earth has heard of. Get them to agree on one sentence.",
  facts: "Rough reach, as of 2025 to 2026: about 1.4 billion Catholics; Cristiano Ronaldo reported passing 1 billion combined social followers in 2024; Lionel Messi has about 500 million Instagram followers; MrBeast runs the most-subscribed YouTube channel (400 million+); Elon Musk has the most-followed account on X (200 million+); the US has about 340 million people and North Korea about 26 million. The Dalai Lama won the Nobel Peace Prize in 1989. Audiences overlap, so the total is far less than the sum. Nobody named here is affiliated with this game or has endorsed it.",
  miracles: [
    { n: "MrBeast makes the peace video", r: ["ATT", "CAP"], d: 2 },
    { n: "Cristiano Ronaldo posts it", r: ["ATT"], d: 2 },
    { n: "Lionel Messi posts it too, in the same week", r: ["ATT"], d: 2 },
    { n: "The Dalai Lama gives his blessing", r: ["LEG"], d: 2 },
    { n: "Elon Musk amplifies it instead of arguing with it", r: ["TEC", "ATT"], d: 2 },
    { n: "The Pope signs", r: ["LEG", "ACC"], d: 3 },
    { n: "Donald Trump signs, and calls it the best peace", r: ["LEG", "ACC"], d: 3 },
    { n: "Kim Jong Un signs", r: ["ACC"], d: 3 },
    { n: "Make peace somewhere small and real: two feuding groups in your town sign one page", r: ["ACC", "IMA"], d: 2, kind: "lateral" },
    { n: "Eight friends play the eight archetypes at your table and sign the peace in character", r: ["IMA"], d: 1, kind: "reframe" }
  ],
  tiers: [
    { t: "I", name: "Ambassador of Peace", need: [0, 1, 2, 3, 4, 5, 6, 7], pts: 10 },
    { t: "II", name: "Four archetypes on board", need: [0, 1, 2, 3], pts: 6 },
    { t: "III", name: "Local peacemaker", need: [8], pts: 4 },
    { t: "IV", name: "Table-top peace treaty", need: [9], pts: 2 }
  ],
  power: "Open door — once per round, any player may reroll one failed die on a miracle that needs Access or Legitimacy.",
  burden: "Neutral ground — you can't play a Miracle Card that hurts another player."
});

// The eight archetypes of the main quest: names everyone has heard of.
window.ARCHETYPES = [
  { name: "MrBeast", role: "The Giver" },
  { name: "Cristiano Ronaldo", role: "The Champion" },
  { name: "Lionel Messi", role: "The Artist" },
  { name: "The Dalai Lama", role: "The Sage" },
  { name: "Elon Musk", role: "The Builder" },
  { name: "The Pope", role: "The Shepherd" },
  { name: "Donald Trump", role: "The Dealmaker" },
  { name: "Kim Jong Un", role: "The Fortress" }
];

window.DECK = { edition: "2026.4", asof: "2026-11-12" };
window.QUESTS.forEach(q => { q.since = q.since || "2026.1"; });

window.REALITY_LOG = [
  { date: "2026-11-12", edition: "2026.4", note: "Release. New main quest: Unify humanity as the Ambassador of Peace, with eight archetypes to bring on board." },
  { date: "2026-10-15", edition: "2026.3", note: "Titles become tradable Trophies (the T-shirt rule: you can buy the shirt, not the climb). New quest: Become a Title Tycoon." },
  { date: "2026-10-13", edition: "2026.2", note: "New quest: Make the real world honour a title (real-world perks). Design notes in docs/COLLECTIBLES.md." },
  { date: "2026-09-30", edition: "2026.1", note: "First edition: 19 quests, 16 Miracle Cards. Facts checked as of this date." }
];
