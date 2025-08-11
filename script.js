// Charge la banque de questions depuis questions.json et gère le quiz

const TOTAL_QUESTIONS = 20;
const TIME_LIMIT_SEC = 30 * 60;

let QUESTIONS = [];
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

async function loadQuestions() {
  try {
    const resp = await fetch("questions.json");
    if (!resp.ok) throw new Error("Erreur chargement questions");
    QUESTIONS = await resp.json();
  } catch (e) {
    alert("Impossible de charger les questions. Vérifie le fichier questions.json");
  }
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
    alert("Les questions ne sont pas chargées. Recharge la page.");
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

window.onload = loadQuestions;
