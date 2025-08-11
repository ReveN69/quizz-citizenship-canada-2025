const TOTAL_QUESTIONS = 20;
const TIME_LIMIT_SEC = 30 * 60;

const QUESTIONS = [
  {
    q: "Quelle fleur est traditionnellement portée le jour du Souvenir?",
    opts: ["La tulipe", "Le coquelicot", "La marguerite", "La rose"],
    a: 1,
    expl: "Le coquelicot est porté pour se souvenir du sacrifice des Canadiens pendant les guerres."
  },
  {
    q: "Combien de provinces y a-t-il au Canada?",
    opts: ["10", "13", "9", "11"],
    a: 0,
    expl: "Le Canada compte 10 provinces et 3 territoires."
  },
  {
    q: "Qui est le chef de l'État au Canada?",
    opts: ["Le Premier ministre", "Le gouverneur général", "La Reine / le Roi", "Le Président"],
    a: 2,
    expl: "La Reine (ou le Roi) est le chef d'État constitutionnel; le gouverneur général la représente au Canada."
  },
  {
    q: "Que signifie la devise 'A Mari Usque Ad Mare'?",
    opts: ["D'un océan à l'autre", "Force et honneur", "Unité et paix", "Terre de liberté"],
    a: 0,
    expl: "'D'un océan à l'autre' est la devise du Canada."
  },
  {
    q: "Quel est le rôle du Parlement?",
    opts: ["Faire les lois", "Nommer la Cour suprême", "Gérer les écoles", "Organiser les élections"],
    a: 0,
    expl: "Le Parlement adopte les lois fédérales."
  },
  {
    q: "Quel est l'âge minimum pour voter aux élections fédérales?",
    opts: ["16 ans", "18 ans", "21 ans", "17 ans"],
    a: 1,
    expl: "Au Canada, il faut avoir 18 ans pour voter aux élections fédérales."
  },
  {
    q: "Quel est le nom du drapeau du Canada?",
    opts: ["L'Union Jack", "L'Unifolié (Maple Leaf)", "Le Tricolore", "La Bannière Royale"],
    a: 1,
    expl: "Le drapeau national est souvent appelé 'l'Unifolié' ou 'Maple Leaf'."
  },
  {
    q: "Que doivent faire les citoyens quand ils sont appelés à servir comme jurés?",
    opts: ["Refuser si occupé", "Se présenter au tribunal", "Payer une amende", "Se retirer du pays"],
    a: 1,
    expl: "Le service de jury est une responsabilité civique au Canada."
  },
  {
    q: "Quelle langue est une des langues officielles du Canada?",
    opts: ["Espagnol", "Français", "Allemand", "Italien"],
    a: 1,
    expl: "Le Canada a deux langues officielles : l'anglais et le français."
  },
  {
    q: "Qui est responsable des écoles primaires et secondaires?",
    opts: ["Le gouvernement fédéral", "Les provinces et territoires", "Le Parlement", "Le Premier ministre"],
    a: 1,
    expl: "L'éducation est une compétence provinciale/territoriale."
  },
  {
    q: "Que représente la feuille d'érable sur le drapeau?",
    opts: ["L'unité nationale", "La Monnaie", "La nature seulement", "La royauté"],
    a: 0,
    expl: "La feuille d'érable est un symbole d'unité et d'identité canadienne."
  },
  {
    q: "Que veut dire 'responsabilité civique'?",
    opts: ["Exercer des droits seulement", "Ignorer les lois", "Participer à la société (p.ex. voter)", "Gagner plus d'impôts"],
    a: 2,
    expl: "Les responsabilités civiques incluent voter, respecter la loi et servir comme juré si appelé."
  },
  {
    q: "Quel est le rôle du Premier ministre?",
    opts: [
      "Exécuter les lois",
      "Diriger le gouvernement",
      "Présider le Sénat",
      "Nommer les juges"
    ],
    a: 1,
    expl: "Le Premier ministre dirige le gouvernement fédéral."
  },
  {
    q: "Quelle est la capitale du Canada?",
    opts: ["Toronto", "Montréal", "Ottawa", "Vancouver"],
    a: 2,
    expl: "Ottawa est la capitale du Canada."
  },
  {
    q: "Que représente la balance dans la justice?",
    opts: ["La loi", "L'équité", "La force", "Le droit"],
    a: 1,
    expl: "La balance symbolise l'équité dans la justice."
  },
  {
    q: "Quelle est la monnaie officielle du Canada?",
    opts: ["Dollar canadien", "Euro", "Dollar américain", "Franc canadien"],
    a: 0,
    expl: "Le dollar canadien est la monnaie officielle."
  },
  {
    q: "Quelle est la plus grande province du Canada en superficie?",
    opts: ["Ontario", "Québec", "Alberta", "Colombie-Britannique"],
    a: 1,
    expl: "Le Québec est la plus grande province en superficie."
  },
  {
    q: "Combien de langues officielles y a-t-il au Canada?",
    opts: ["1", "2", "3", "4"],
    a: 1,
    expl: "Le Canada a deux langues officielles : l'anglais et le français."
  },
  {
    q: "Qui peut devenir citoyen canadien?",
    opts: [
      "Toute personne née au Canada",
      "Les résidents permanents ayant vécu au Canada plusieurs années",
      "Les touristes",
      "Les étudiants étrangers"
    ],
    a: 1,
    expl: "Les résidents permanents qui respectent les conditions peuvent demander la citoyenneté."
  },
  {
    q: "Quelle est la fête nationale du Canada?",
    opts: ["Jour de la Confédération", "Jour de la Victoire", "Noël", "Fête du Travail"],
    a: 0,
    expl: "Le 1er juillet est la fête nationale, appelée Jour de la Confédération."
  }
];

let selectedSet = [];
let answers = {};
let currentIndex = 0;
let timer = null;
let timeLeft = TIME_LIMIT_SEC;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function pickQuestions() {
  const idxs = Array.from(QUESTIONS.keys());
  for (let i = idxs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  return idxs.slice(0, TOTAL_QUESTIONS);
}

function renderQuestion(pos) {
  const container = document.getElementById("questionsContainer");
  container.innerHTML = "";
  const qIdx = selectedSet[pos];
  const item = QUESTIONS[qIdx];
  document.getElementById("qCount").innerText = `Question ${pos + 1} / ${TOTAL_QUESTIONS}`;

  const qdiv = document.createElement("div");
  qdiv.className = "question";
  const qt = document.createElement("div");
  qt.className = "q-text";
  qt.innerText = item.q;
  qdiv.appendChild(qt);

  const opts = document.createElement("div");
  opts.className = "options";

  item.opts.forEach((opt, i) => {
    const op = document.createElement("div");
    op.className = "option";
    op.tabIndex = 0;
    op.innerText = opt;
    if (answers[qIdx] === i) op.style.background = "rgba(96,165,250,0.12)";
    op.addEventListener("click", () => {
      answers[qIdx] = i;
      renderQuestion(pos);
    });
    opts.appendChild(op);
  });

  qdiv.appendChild(opts);
  container.appendChild(qdiv);
}

function startTimer() {
  clearInterval(timer);
  timeLeft = TIME_LIMIT_SEC;
  document.getElementById("timer").innerText = formatTime(timeLeft);
  document.getElementById("timeLeft").innerText = formatTime(timeLeft);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = formatTime(timeLeft);
    document.getElementById("timeLeft").innerText = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitTest();
    }
  }, 1000);
}

function startTest() {
  if (QUESTIONS.length === 0) {
    alert("Les questions ne sont pas chargées.");
    return;
  }
  selectedSet = pickQuestions();
  answers = {};
  currentIndex = 0;
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("quizArea").classList.remove("hidden");
  document.getElementById("resultArea").classList.add("hidden");
  renderQuestion(currentIndex);
  startTimer();
}

function prevQ() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion(currentIndex);
  }
}
function nextQ() {
  if (currentIndex < TOTAL_QUESTIONS - 1) {
    currentIndex++;
    renderQuestion(currentIndex);
  }
}

function submitTest() {
  clearInterval(timer);
  let correct = 0;
  const incorrectList = [];
  for (let i = 0; i < selectedSet.length; i++) {
    const qIdx = selectedSet[i];
    const item = QUESTIONS[qIdx];
    const ans = answers[qIdx];
    if (ans === item.a) correct++;
    else
      incorrectList.push({
        pos: i + 1,
        q: item.q,
        chosen: ans == null ? null : item.opts[ans],
        correct: item.opts[item.a],
        expl: item.expl,
      });
  }
  showResults(correct, incorrectList);
}

function showResults(score, incorrectList) {
  document.getElementById("quizArea").classList.add("hidden");
  const area = document.getElementById("resultArea");
  area.classList.remove("hidden");
  document.getElementById("scoreText").innerText = `Score : ${score} / ${TOTAL_QUESTIONS}`;
  const pass = score >= 15;
  document.getElementById("passText").innerText = pass
    ? "Réussi — tu obtiens la note minimale requise (15/20)."
    : "Non réussi — objectif : 15/20 pour réussir.";

  const review = document.getElementById("reviewList");
  review.innerHTML = "";
  if (incorrectList.length === 0) {
    review.innerHTML = "<p class='small'>Toutes les réponses sont correctes. Bravo !</p>";
  } else {
    incorrectList.forEach((it) => {
      const block = document.createElement("div");
      block.className = "explain incorrect";
      block.innerHTML = `<strong>Q${it.pos} :</strong> ${it.q}<br><em>Ta réponse :</em> ${
        it.chosen === null ? '<span style="color:var(--muted)">Aucune réponse</span>' : it.chosen
      }<br><em>Bonne réponse :</em> ${it.correct}<div style="margin-top:6px;color:#cdeeff">${it.expl}</div>`;
      review.appendChild(block);
    });
  }
  const dl = document.createElement("div");
  dl.className = "small";
  dl.style.marginTop = "12px";
  dl.innerHTML = "<em>Tu peux relancer un test pour t'entraîner davantage. Les questions changent à chaque essai.</em>";
  review.appendChild(dl);
}

document.getElementById("startBtn").addEventListener("click", startTest);
document.getElementById("prevBtn").addEventListener("click", prevQ);
document.getElementById("nextBtn").addEventListener("click", nextQ);
document.getElementById("submitBtn").addEventListener("click", () => {
  if (confirm("Es-tu sûr de vouloir terminer le test ?")) submitTest();
});
document.getElementById("retryBtn").addEventListener("click", startTest);
document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Réinitialiser tout et revenir à l'introduction ?")) {
    clearInterval(timer);
    document.getElementById("intro").classList.remove("hidden");
    document.getElementById("quizArea").classList.add("hidden");
    document.getElementById("resultArea").classList.add("hidden");
  }
});
