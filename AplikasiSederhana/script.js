window.onload = () => {
  loadTasks();
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  // Transisi saat buka halaman
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity = 1;
  }, 100);
};

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const deadlineInput = document.getElementById('deadlineInput');
  const text = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (text && deadline) {
    const task = { text, deadline, done: false };
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
    renderTasks();
    taskInput.value = '';
    deadlineInput.value = '';
    showPopup('Tugas ditambahkan ✅');
  }
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  const tasks = getTasks();

  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = getDeadlineClass(task.deadline);
    if (task.done) li.classList.add('done');

    const taskMain = document.createElement('div');
    taskMain.className = 'task-main';
    taskMain.innerHTML = `<strong>${task.text}</strong><div class="task-deadline">${formatDate(task.deadline)}</div>`;
    li.appendChild(taskMain);

    const btns = document.createElement('div');
    btns.className = 'btns';

    const checkBtn = document.createElement('button');
    checkBtn.textContent = '✔️';
    checkBtn.onclick = () => {
      tasks[index].done = !tasks[index].done;
      saveTasks(tasks);
      renderTasks();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️';
    deleteBtn.onclick = () => {
      li.classList.add('removing');
      setTimeout(() => {
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
        showPopup('Tugas dihapus 🗑️');
      }, 400);
    };

    btns.appendChild(checkBtn);
    btns.appendChild(deleteBtn);
    li.appendChild(btns);
    taskList.appendChild(li);
  });
}

function formatDate(datetime) {
  const date = new Date(datetime);
  return date.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' });
}

function getDeadlineClass(deadline) {
  const now = new Date();
  const date = new Date(deadline);
  const diff = (date - now) / (1000 * 60 * 60);

  if (diff < 0) return 'deadline-red';
  if (diff < 24) return 'deadline-orange';
  return 'deadline-green';
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function showPopup(message) {
  const popup = document.getElementById('popup');
  popup.textContent = message;
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 2500);
}
