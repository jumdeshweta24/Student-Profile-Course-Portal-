(function(){
  const PAGES = {
    INDEX: 'index',
    QUIZ: 'quiz',
    RESULTS: 'results',
  };

  const STORAGE_KEYS = {
    score: 'iqm_score',
    total: 'iqm_total',
    index: 'iqm_index',
    started: 'iqm_started'
  };

  const questions = [
    {
      question: 'Which JavaScript method converts a JSON string into an object?',
      options: ['JSON.stringify()', 'JSON.parse()', 'Object.fromJSON()', 'parseInt()'],
      correctAnswer: 1,
    },
    {
      question: 'Which keyword declares a block-scoped variable in JavaScript?',
      options: ['var', 'let', 'define', 'const var'],
      correctAnswer: 1,
    },
    {
      question: 'What does Array.prototype.map() return?',
      options: ['A new array', 'The same array', 'A number', 'An iterator'],
      correctAnswer: 0,
    },
    {
      question: 'Which operator spreads the elements of an array?',
      options: ['...', '=>', '??', '&&'],
      correctAnswer: 0,
    },
    {
      question: 'Which statement is true about const in JavaScript?',
      options: ['The value cannot be changed', 'The binding cannot be reassigned', 'It is function-scoped', 'It hoists like var'],
      correctAnswer: 1,
    },
    {
      question: 'Which method adds one or more elements to the end of an array?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correctAnswer: 0,
    },
    {
      question: 'What is the result of typeof null?',
      options: ['"object"', '"null"', '"undefined"', '"number"'],
      correctAnswer: 0,
    },
    {
      question: 'Which of the following is NOT a primitive type?',
      options: ['symbol', 'boolean', 'object', 'bigint'],
      correctAnswer: 2,
    },
    {
      question: 'How do you create a promise that resolves immediately?',
      options: ['new Promise()', 'Promise.resolve()', 'Promise.create()', 'async () => {}'],
      correctAnswer: 1,
    },
    {
      question: 'Which statement stops the current loop iteration and continues with the next?',
      options: ['break', 'stop', 'continue', 'return'],
      correctAnswer: 2,
    },
  ];

  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  function getPage(){ return document.body.dataset.page; }
  function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
  function load(k){ try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }
  function clearProgress(){ Object.values(STORAGE_KEYS).forEach(k=>localStorage.removeItem(k)); }

  function initIndex(){
    const btn = $('#startBtn');
    if (btn) {
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        clearProgress();
        save(STORAGE_KEYS.started, true);
        window.location.href = './quiz.html';
      });
    }
  }

  function renderQuiz(){
    const wrap = $('#quiz-app');
    if (!wrap) return;
    const idx = load(STORAGE_KEYS.index) ?? 0;
    const score = load(STORAGE_KEYS.score) ?? 0;

    wrap.innerHTML = '' +
      `<div class="quiz-wrap">
        <div class="progress" aria-label="Progress"><span style="width:${(idx/questions.length)*100}%"></span></div>
        <div class="q-card">
          <h2 class="q-title">Question ${idx+1} of ${questions.length}</h2>
          <p style="margin:0 0 12px 0;font-size:20px">${questions[idx].question}</p>
          <div class="options" role="group" aria-label="Options"></div>
        </div>
        <div style="display:flex;justify-content:space-between;color:hsl(240 6% 70%)">
          <span>Score: <strong style="color:white">${score}</strong></span>
          <span>Remaining: ${questions.length - idx - 1}</span>
        </div>
      </div>`;

    const opts = $('.options', wrap);
    questions[idx].options.forEach((opt, i)=>{
      const b = document.createElement('button');
      b.className = 'option-btn';
      b.type = 'button';
      b.innerHTML = `<span style="opacity:.7">${String.fromCharCode(65+i)}.</span> <span>${opt}</span>`;
      b.addEventListener('click', ()=>handleAnswer(i));
      opts.appendChild(b);
    });
  }

  function handleAnswer(selected){
    let idx = load(STORAGE_KEYS.index) ?? 0;
    let score = load(STORAGE_KEYS.score) ?? 0;
    const correct = questions[idx].correctAnswer;

    const buttons = $all('.option-btn');
    buttons.forEach((b, i)=>{
      b.disabled = true;
      if (i === correct) b.classList.add('correct');
      if (i === selected && selected !== correct) b.classList.add('wrong');
    });

    if (selected === correct) score++;
    save(STORAGE_KEYS.score, score);

    setTimeout(()=>{
      idx++;
      save(STORAGE_KEYS.index, idx);
      if (idx >= questions.length){
        save(STORAGE_KEYS.total, questions.length);
        window.location.href = './results.html';
      } else {
        renderQuiz();
      }
    }, 650);
  }

  function initQuiz(){
    if (!load(STORAGE_KEYS.started)) save(STORAGE_KEYS.started, true);
    if (load(STORAGE_KEYS.index) == null) save(STORAGE_KEYS.index, 0);
    if (load(STORAGE_KEYS.score) == null) save(STORAGE_KEYS.score, 0);
    renderQuiz();
  }

  function initResults(){
    const score = load(STORAGE_KEYS.score);
    const total = load(STORAGE_KEYS.total);
    const resultEl = $('#finalScore');
    const restartBtn = $('#restartBtn');

    if (typeof score !== 'number' || typeof total !== 'number'){
      resultEl.textContent = 'No results available. Start a new quiz.';
      restartBtn.textContent = 'Start Quiz';
      restartBtn.addEventListener('click', ()=>{
        clearProgress();
        window.location.href = './quiz.html';
      });
      return;
    }

    resultEl.textContent = `You got ${score} out of ${total} correct!`;

    restartBtn.addEventListener('click', ()=>{
      clearProgress();
      window.location.href = './quiz.html';
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const page = getPage();
    if (page === PAGES.INDEX) initIndex();
    if (page === PAGES.QUIZ) initQuiz();
    if (page === PAGES.RESULTS) initResults();
  });
})();
