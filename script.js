const PLAYERS = [
  "Ben",
  "Everett",
  "Liam",
  "Bobby",
  "Henry",
  "Giovanni",
  "Mikey",
  "Miguel",
  "Diagoras",
  "Andy",
  "Peter",
  "Caden",
];

const zoneNice = {
  "top-left": "top left",
  "top-center": "top center",
  "top-right": "top right",
  "middle-left": "middle left",
  "middle-center": "middle center",
  "middle-right": "middle right",
  "bottom-left": "bottom left",
  "bottom-center": "bottom center",
  "bottom-right": "bottom right",
};

const hypePhrases = [
  "FSA GOAL!",
  "Foxes strike!",
  "Back of the net!",
  "FSA on the board!",
  "Goal for FSA!",
];

const scorerEl = document.getElementById("scorer");
const assistEl = document.getElementById("assist");
const minuteEl = document.getElementById("minute");
const outputEl = document.getElementById("output");
const copyBtn = document.getElementById("copy");
const generateBtn = document.getElementById("generate");
const zoneLabel = document.getElementById("zoneLabel");

let selectedZone = null;

function populatePlayers() {
  // Scorer options
  PLAYERS.forEach((p) => {
    const o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    scorerEl.appendChild(o);
  });

  // Assist options (None first, then players)
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "None";
  assistEl.appendChild(none);

  PLAYERS.forEach((p) => {
    const o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    assistEl.appendChild(o);
  });
}

function populateMinutes() {
  for (let i = 0; i <= 50; i++) {
    const o = document.createElement("option");
    o.value = String(i);
    o.textContent = String(i);
    minuteEl.appendChild(o);
  }
}

function setupGoalZones() {
  const goal = document.querySelector(".goal");
  const zones = Array.from(goal.querySelectorAll(".zone"));
  zones.forEach((btn) => {
    btn.addEventListener("click", () => {
      zones.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedZone = btn.getAttribute("data-zone");
      zoneLabel.textContent = `Selected: ${zoneNice[selectedZone]}`;
    });
  });
}

function buildSnippet() {
  const scorer = scorerEl.value;
  const assist = assistEl.value;
  const minute = minuteEl.value;

  const hype = hypePhrases[Math.floor(Math.random() * hypePhrases.length)];
  const minutePart = `${minute}'`;
  const assistPart = assist ? ` from ${assist}` : "";

  let placePart = "";
  if (selectedZone && zoneNice[selectedZone]) {
    const z = zoneNice[selectedZone];
    const corner = z.includes("left") || z.includes("right") ? " corner" : "";
    placePart = `${capitalize(z)}${corner}`;
  }

  const attrs = Array.from(
    document.querySelectorAll('#attributes input[type="checkbox"]:checked')
  ).map((c) => c.value);

  let attributesPart = "";
  if (attrs.length === 1) {
    attributesPart = attrs[0];
  } else if (attrs.length > 1) {
    attributesPart = attrs.slice(0, -1).join(", ") + " and " + attrs.slice(-1);
  }

  // Compose concise, lively snippet
  const lines = [];
  lines.push(`${hype} ${minutePart}`);

  let main = `${scorer} scores`;
  if (assistPart) main += assistPart;
  if (placePart) main += `. ${placePart}`;
  main += ".";
  lines.push(main);

  if (attributesPart) {
    lines.push(capitalize(attributesPart) + ".");
  }

  lines.push("Let’s go Foxes! ⚽️");

  return lines.join(" ");
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function onGenerate() {
  const snippet = buildSnippet();
  outputEl.value = snippet;
  copyBtn.disabled = !snippet;
}

async function onCopy() {
  const text = outputEl.value;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
  } catch (_) {
    // Fallback select for manual copy
    outputEl.select();
  }
}

// Init
populatePlayers();
populateMinutes();
setupGoalZones();
generateBtn.addEventListener("click", onGenerate);
copyBtn.addEventListener("click", onCopy);

