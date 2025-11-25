let verbs = [];
let currentIndex = 0;
let score = 0;
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const scoreEl = document.getElementById('score');

fetch('verbs.json')
  .then(response => response.json())
  .then(data => {
    verbs = shuffle(data);
    loadQuestion();
  });

function loadQuestion() {
  feedbackEl.textContent = '';
  nextBtn.style.display = 'none';
  const currentVerb = verbs[currentIndex];
  questionEl.textContent = `¿Cuál es la forma correcta del verbo "${currentVerb.es}" en inglés?`;

  const options = shuffle([currentVerb.en, ...getRandomDistractors(currentVerb.en)]);

  optionsEl.innerHTML = '';
  options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.onclick = () => checkAnswer(btn, option, currentVerb.en);
    optionsEl.appendChild(btn);
  });

  updateProgress();
}

function checkAnswer(button, selected, correct) {
  const buttons = optionsEl.querySelectorAll('button');
  buttons.forEach(b => b.disabled = true);

  if (selected === correct) {
    feedbackEl.textContent = '✅ ¡Correcto!';
    button.classList.add('correct');
    score++;
  } else {
    feedbackEl.textContent = `❌ Incorrecto. La respuesta correcta es: ${correct}`;
    button.classList.add('incorrect');
  }
  nextBtn.style.display = 'block';
}

nextBtn.onclick = () => {
  currentIndex++;
  if (currentIndex < verbs.length) {
    loadQuestion();
  } else {
    showFinalScore();
  }
};

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function getRandomDistractors(correct) {
  const distractors = verbs.map(v => v.en).filter(en => en !== correct);
  return shuffle(distractors).slice(0, 3);
}

function updateProgress() {
  const progress = ((currentIndex) / verbs.length) * 100;
  progressBar.style.width = progress + '%';
}

function showFinalScore() {
  questionEl.textContent = '¡Quiz terminado!';
  optionsEl.innerHTML = '';
  nextBtn.style.display = 'none';
  feedbackEl.textContent = '';
  progressBar.style.width = '100%';
  scoreEl.textContent = `Puntuación final: ${score} de ${verbs.length}`;
}