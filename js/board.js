let currentDraggedElement;

let tasks = [];

async function initBoard(site) {
  init(site);
  const data = await loadData("/tasks");
  tasks = Object.entries(data).map(([id, task]) => ({ ...task, id }));
  renderAll();
}

function renderAll() {
  renderToDo();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
  updateNoTaskPlaceholders();
}

function renderToDo() {
  let toDo = tasks.filter((t) => t["status"] == "todo");
  document.getElementById("toDo").innerHTML = "";

  for (let i = 0; i < toDo.length; i++) {
    const element = toDo[i];
    document.getElementById("toDo").innerHTML += getToDoTemplate(element);
  }
  document.getElementById("toDo").innerHTML += getDropZoneTemplate("toDo");
}

function renderInProgress() {
  let progress = tasks.filter((t) => t["status"] == "inProgress");
  document.getElementById("inProgress").innerHTML = "";

  for (let i = 0; i < progress.length; i++) {
    const element = progress[i];
    document.getElementById("inProgress").innerHTML += getToDoTemplate(element);
  }
  document.getElementById("inProgress").innerHTML +=
    getDropZoneTemplate("inProgress");
}

function renderAwaitFeedback() {
  let awaitFeedback = tasks.filter((t) => t["status"] == "await");
  document.getElementById("await").innerHTML = "";

  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    document.getElementById("await").innerHTML += getToDoTemplate(element);
  }
  document.getElementById("await").innerHTML += getDropZoneTemplate("await");
}

function renderDone() {
  let done = tasks.filter((t) => t["status"] == "done");
  document.getElementById("done").innerHTML = "";

  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    document.getElementById("done").innerHTML += getToDoTemplate(element);
  }
  document.getElementById("done").innerHTML += getDropZoneTemplate("done");
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(newStatus) {
  const task = tasks.find((t) => t.id === currentDraggedElement);
  if (!task) return;
  task.status = newStatus;

  await putData("/tasks/" + task.id, task);
  renderAll();
}

function highlight(id) {
  const dropzone = document.getElementById("dropzone-" + id);
  if (dropzone) dropzone.classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  const dropzone = document.getElementById("dropzone-" + id);
  if (dropzone) dropzone.classList.remove("drag-area-highlight");
}

function updateNoTaskPlaceholders() {
  const columns = ["toDo", "inProgress", "await", "done"];

  for (let i = 0; i < columns.length; i++) {
    const column = document.getElementById(columns[i]);
    const placeholder = document.getElementById("placeholder-" + columns[i]);
    const hasTasks = column.querySelector(".task-card") !== null;
    placeholder.style.display = hasTasks ? "none" : "flex";
  }
}

function openDialogBoard(id) {
  const element = tasks.find((t) => t.id === id);
  const dialogBoard = document.getElementById("openDialogBoard");
  dialogBoard.innerHTML = getDialogBoardTemplate(element);
  dialogBoard.showModal();
}

function closeDialogBoard() {
  const dialogBoard = document.getElementById("openDialogBoard");
  dialogBoard.close();
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  const column = target?.closest("#toDo, #inProgress, #await, #done");

  const columns = ["toDo", "inProgress", "await", "done"];
  for (let i = 0; i < columns.length; i++) {
    removeHighlight(columns[i]);
  }

  if (column) highlight(column.id);
}

function handleTouchEnd(e) {
  const touch = e.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  const column = target?.closest("#toDo, #inProgress, #await, #done");

  const columns = ["toDo", "inProgress", "await", "done"];
  for (let i = 0; i < columns.length; i++) {
    removeHighlight(columns[i]);
  }

  if (column) moveTo(column.id);
}