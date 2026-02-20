
// NAVIGATION

const sections = ['carousel','calc','clock','temp','pass','todo'];

function showSection(id) {
  sections.forEach(s => {
    document.getElementById('section-' + s).classList.toggle('hidden', s !== id);
    const nav = document.getElementById('nav-' + s);
    if (s === id) {
      nav.className = 'font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-sm border bg-purple-500 text-white border-purple-500 font-bold transition-all';
    } else {
      nav.className = 'font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-sm border border-purple-300 text-purple-400 bg-white hover:border-purple-500 hover:text-pink-400 transition-all';
    }
  });
}




// TASK 1: CAROUSEL SLIDER

const slides     = document.getElementById('slides');
const totalSlides = document.querySelectorAll('#slides > div').length;
const info       = document.getElementById('slide-info');
const thumbs     = document.querySelectorAll('[id^="thumb"]');

const slideTexts = [
  "Slide 1: Beautiful Nature",
  "Slide 2: Cute Animals",
  "Slide 3: Mountain View",
  "Slide 4: Peaceful Lake"
];

let index = 0;
let autoSlide;

function updateSlider() {
  slides.style.transform = `translateX(-${index * 100}%)`;
  info.innerText = slideTexts[index];

  thumbs.forEach(t => {
    t.classList.remove('border-purple-500');
    t.classList.add('border-transparent');
  });
  thumbs[index].classList.remove('border-transparent');
  thumbs[index].classList.add('border-purple-500');
}

function nextSlide() {
  index = (index + 1) % totalSlides;
  updateSlider();
}

function prevSlide() {
  index = (index - 1 + totalSlides) % totalSlides;
  updateSlider();
}

function goToSlide(i) {
  index = i;
  updateSlider();
  resetAutoSlide();
}

document.getElementById('next').addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
document.getElementById('prev').addEventListener('click', () => { prevSlide(); resetAutoSlide(); });

function startAutoSlide() { autoSlide = setInterval(nextSlide, 3000); }
function resetAutoSlide()  { clearInterval(autoSlide); startAutoSlide(); }

startAutoSlide();





// TASK 2: CALCULATOR

const cs = { current: '0', prev: '', op: '', reset: false };

function updateCalcDisplay() {
  document.getElementById('calc-screen').textContent = cs.current;
  const sym = { '+': '+', '-': '-', '*': 'x', '/': '÷' };
  document.getElementById('calc-expr').textContent = cs.prev ? `${cs.prev} ${sym[cs.op] || ''}` : '\u00a0';
}

function calcNum(n) {
  if (cs.reset) { cs.current = n; cs.reset = false; }
  else cs.current = cs.current === '0' ? n : cs.current + n;
  if (cs.current.length > 12) cs.current = cs.current.slice(0, 12);
  updateCalcDisplay();
}
function calcDot() {
  if (cs.reset) { cs.current = '0.'; cs.reset = false; updateCalcDisplay(); return; }
  if (!cs.current.includes('.')) { cs.current += '.'; updateCalcDisplay(); }
}

function calcOp(op) {
  if (cs.prev && !cs.reset) calcEquals(true);
  cs.prev = cs.current; cs.op = op; cs.reset = true;
  updateCalcDisplay();
}

function calcEquals(chain = false) {
  if (!cs.op) return;
  const a = parseFloat(cs.prev), b = parseFloat(cs.current);
  let r;
  if (cs.op === '+') r = a + b;
  else if (cs.op === '-') r = a - b;
  else if (cs.op === '*') r = a * b;
  else if (cs.op === '/') r = b === 0 ? 'Error' : a / b;
  cs.current = r === 'Error' ? 'Error' : parseFloat(r.toFixed(10)).toString();
  if (!chain) { cs.prev = ''; cs.op = ''; }
  cs.reset = true;
  updateCalcDisplay();
}

function calcClear()     { cs.current = '0'; cs.prev = ''; cs.op = ''; cs.reset = false; updateCalcDisplay(); }
function calcBackspace() { if (!cs.reset) { cs.current = cs.current.length > 1 ? cs.current.slice(0,-1) : '0'; updateCalcDisplay(); } }

document.addEventListener('keydown', e => {
  if (document.getElementById('section-calc').classList.contains('hidden')) return;
  if (e.key >= '0' && e.key <= '9') calcNum(e.key);
  else if (e.key === '.') calcDot();
  else if (e.key === '+') calcOp('+');
  else if (e.key === '-') calcOp('-');
  else if (e.key === '*') calcOp('*');
  else if (e.key === '/') { e.preventDefault(); calcOp('/'); }
  else if (e.key === 'Enter' || e.key === '=') calcEquals();
  else if (e.key === 'Backspace') calcBackspace();
  else if (e.key === 'Escape') calcClear();
});





// TASK 3: DIGITAL CLOCK

function updateClock() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  //exact time aa jaye ga now se aur usko 2 digits me convert kar ke display karna hai
  document.getElementById('clock-h').textContent = pad(now.getHours());
  document.getElementById('clock-m').textContent = pad(now.getMinutes());
  document.getElementById('clock-s').textContent = pad(now.getSeconds());
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('clock-date').textContent =
    `${days[now.getDay()]} // ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}
updateClock();
setInterval(updateClock, 1000);






// TASK 4: TEMPERATURE CONVERTER

var tempMode = 'CtoF';

function convertTemp(side) {
  const L = document.getElementById('temp-left');
  const R = document.getElementById('temp-right');
  const val = parseFloat(side === 'left' ? L.value : R.value);
  if (isNaN(val)) { (side === 'left' ? R : L).value = ''; return; }
  if (tempMode === 'CtoF') {
    if (side === 'left') R.value = parseFloat((val * 9/5 + 32).toFixed(4));
    else L.value = parseFloat(((val - 32) * 5/9).toFixed(4));
  } else {
    if (side === 'left') R.value = parseFloat(((val - 32) * 5/9).toFixed(4));
    else L.value = parseFloat((val * 9/5 + 32).toFixed(4));
  }
}

function swapTemp() {
  tempMode = tempMode === 'CtoF' ? 'FtoC' : 'CtoF';
  const isCtoF = tempMode === 'CtoF';
  document.getElementById('label-left').textContent  = isCtoF ? 'CELSIUS (°C)' : 'FAHRENHEIT (°F)';
  document.getElementById('label-right').textContent = isCtoF ? 'FAHRENHEIT (°F)' : 'CELSIUS (°C)';
  document.getElementById('temp-formula').textContent = isCtoF
    ? 'Formula: °F = (°C × 9/5) + 32'
    : 'Formula: °C = (°F − 32) × 5/9';
  document.getElementById('temp-left').value  = '';
  document.getElementById('temp-right').value = '';
}



// TASK 5: PASSWORD GENERATOR

const CHARS = {
  upper:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower:   'abcdefghijklmnopqrstuvwxyz',
  num:     '0123456789',
  special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Use the custom password typed by the user
function useCustomPassword() {
  const input = document.getElementById('custom-pass-input');
  const val   = input.value.trim();
  if (!val) return;
  document.getElementById('pass-output').textContent = val;
  // Reset strength bar since it's a manual password
  for (let i = 1; i <= 4; i++) {
    document.getElementById('sb' + i).className = 'h-1.5 flex-1 rounded bg-purple-100';
  }
  document.getElementById('pass-strength-label').textContent = 'Strength: Custom';
  input.value = '';
}

function generatePassword() {
  const length = parseInt(document.getElementById('pass-length').value);
  const sets   = [];
  if (document.getElementById('inc-upper').checked)   sets.push(CHARS.upper);
  if (document.getElementById('inc-lower').checked)   sets.push(CHARS.lower);
  if (document.getElementById('inc-num').checked)     sets.push(CHARS.num);
  if (document.getElementById('inc-special').checked) sets.push(CHARS.special);
  if (!sets.length) {
    document.getElementById('pass-output').textContent = 'Select at least one character type.';
    return;
  }
  const pool = sets.join('');
  let pw = sets.map(s => s[Math.floor(Math.random() * s.length)]).join('');
  for (let i = pw.length; i < length; i++) pw += pool[Math.floor(Math.random() * pool.length)];
  pw = pw.split('').sort(() => Math.random() - 0.5).join('');
  document.getElementById('pass-output').textContent = pw;
  updateStrength(sets.length, length);
}

function updateStrength(sets, length) {
  const score  = Math.min(4, Math.max(1, sets - 1 + (length >= 16 ? 1 : 0) + (length >= 24 ? 1 : 0)));
  const colors = { 1: 'bg-red-400', 2: 'bg-orange-400', 3: 'bg-purple-400', 4: 'bg-pink-400' };
  const labels = { 1: 'Weak', 2: 'Fair', 3: 'Strong', 4: 'Very Strong' };
  for (let i = 1; i <= 4; i++) {
    document.getElementById('sb' + i).className = 'h-1.5 flex-1 rounded ' + (i <= score ? colors[score] : 'bg-purple-100');
  }
  document.getElementById('pass-strength-label').textContent = 'Strength: ' + labels[score];
}

function copyPassword() {
  const text = document.getElementById('pass-output').textContent;
  if (!text || text.includes('Select') || text.includes('Click')) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn  = document.getElementById('copy-btn');
    const orig = btn.className;
    btn.textContent = 'Copied!';
    btn.className = 'bg-transparent border border-pink-400 text-pink-400 font-mono text-xs tracking-widest uppercase rounded-lg px-5 transition-all';
    setTimeout(() => { btn.textContent = 'Copy'; btn.className = orig; }, 1500);
  });
}




// BONUS: TO-DO LIST

let todos      = JSON.parse(localStorage.getItem('jsTasks_todos') || '[]');
let todoFilter = 'all';

function saveTodos() { localStorage.setItem('jsTasks_todos', JSON.stringify(todos)); }

function addTodo() {
  const input = document.getElementById('todo-input');
  const text  = input.value.trim();
  if (!text) return;
  todos.unshift({ id: Date.now(), text, done: false });
  input.value = '';
  saveTodos(); renderTodos();
}

function toggleTodo(id) {
  const t = todos.find(t => t.id === id);
  if (t) t.done = !t.done;
  saveTodos(); renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos(); renderTodos();
}

function startEdit(id) {
  const t = todos.find(t => t.id === id);
  if (!t) return;
  const textEl = document.querySelector(`[data-id="${id}"] .todo-text`);
  if (!textEl) return;
  const inp = document.createElement('input');
  inp.value     = t.text;
  inp.className = 'flex-1 bg-transparent border-b border-purple-400 text-purple-900 text-sm outline-none pb-0.5';
  textEl.replaceWith(inp);
  inp.focus();
  const save = () => { if (inp.value.trim()) t.text = inp.value.trim(); saveTodos(); renderTodos(); };
  inp.addEventListener('blur', save);
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') inp.blur();
    if (e.key === 'Escape') { inp.value = t.text; inp.blur(); }
  });
}

function setFilter(f) {
  todoFilter = f;
  ['all','active','done'].forEach(x => {
    document.getElementById('filter-' + x).className = x === f
      ? 'font-mono text-xs tracking-widest uppercase px-3 py-1.5 rounded-sm border border-purple-500 text-purple-500 transition-all'
      : 'font-mono text-xs tracking-widest uppercase px-3 py-1.5 rounded-sm border border-transparent text-purple-300 hover:text-purple-500 transition-all';
  });
  renderTodos();
}

function clearDone()
 { 
    todos = todos.filter(t => !t.done); saveTodos(); renderTodos();
 }

function escapeHtml(s) 
{
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderTodos() {
  const list   = document.getElementById('todo-list');
  const empty  = document.getElementById('todo-empty');
  const filtered = todos.filter(t =>
    todoFilter === 'active' ? !t.done : todoFilter === 'done' ? t.done : true
  );
  document.getElementById('todo-count').textContent = `${todos.filter(t => !t.done).length} remaining`;
  if (!filtered.length) { list.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  list.innerHTML = filtered.map(t => `
    <div class="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-3" data-id="${t.id}">
      <button onclick="toggleTodo(${t.id})"
        class="flex-shrink-0 w-5 h-5 flex items-center justify-center border-2 rounded-sm transition-all ${t.done ? 'bg-purple-500 border-purple-500' : 'border-purple-300 hover:border-purple-500'}">
        ${t.done ? `<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}
      </button>
      <span class="todo-text flex-1 text-sm ${t.done ? 'line-through text-purple-300' : 'text-purple-900'}">${escapeHtml(t.text)}</span>
      <button onclick="startEdit(${t.id})"  class="text-purple-300 hover:text-purple-500 text-sm transition-colors px-1" title="Edit">✎</button>
      <button onclick="deleteTodo(${t.id})" class="text-purple-300 hover:text-pink-400  text-sm transition-colors px-1" title="Delete">✕</button>
    </div>
  `).join('');
}

renderTodos();