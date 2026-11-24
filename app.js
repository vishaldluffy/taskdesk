const storageKey = "taskdesk.tasks";
const form = document.querySelector("#form");
const input = document.querySelector("#task");
const list = document.querySelector("#list");
const filters = document.querySelector("#filters");
const clear = document.querySelector("#clear");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");
const status = document.querySelector("#storage-status");

let tasks = load();
let filter = "all";

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!Array.isArray(saved)) return [];
    const ids = new Set();
    return saved.filter((task) => {
      if (!task || !Number.isSafeInteger(task.id) || ids.has(task.id) ||
          typeof task.text !== "string" || !task.text.trim() ||
          typeof task.done !== "boolean") return false;
      ids.add(task.id);
      return true;
    });
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    status.hidden = true;
  } catch {
    status.textContent = "Browser storage is unavailable. Changes may be lost on reload.";
    status.hidden = false;
  }
}

function render() {
  const visible = tasks.filter((task) => filter === "all" || task.done === (filter === "done"));
  list.replaceChildren(...visible.map(createRow));
  const remaining = tasks.filter((task) => !task.done).length;
  count.textContent = remaining === 1 ? "1 task left" : `${remaining} tasks left`;
  clear.disabled = remaining === tasks.length;
  empty.hidden = visible.length > 0;
  empty.textContent = { all: "No tasks yet.", active: "No active tasks.", done: "No completed tasks." }[filter];
  for (const button of filters.children) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === filter));
  }
}

function createRow(task) {
  const row = document.createElement("li");
  row.dataset.id = task.id;
  row.classList.toggle("done", task.done);
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  const name = document.createElement("span");
  name.textContent = task.text;
  label.append(checkbox, name);

  const remove = document.createElement("button");
  remove.type = "button";
  remove.textContent = "Delete";
  remove.setAttribute("aria-label", `Delete ${task.text}`);
  row.append(label, remove);
  return row;
}

function update() {
  save();
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  let id = Date.now();
  while (tasks.some((task) => task.id === id)) id += 1;
  tasks.push({ id, text, done: false });
  if (filter === "done") filter = "all";
  form.reset();
  update();
  input.focus();
});

list.addEventListener("click", (event) => {
  const control = event.target;
  if (!control.matches("input, button")) return;
  const row = control.closest("li");
  const index = [...list.children].indexOf(row);
  const id = Number(row.dataset.id);
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  const toggled = control.matches("input");
  if (toggled) task.done = control.checked;
  else tasks = tasks.filter((item) => item.id !== id);
  update();

  const sameRow = list.querySelector(`[data-id="${id}"]`);
  const nextRow = sameRow ?? list.children[index] ?? list.lastElementChild;
  const nextControl = nextRow?.querySelector(toggled ? "input" : "button");
  (nextControl ?? input).focus();
});

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  filter = button.dataset.filter;
  render();
});

clear.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  update();
  filters.querySelector('[aria-pressed="true"]').focus();
});

render();

