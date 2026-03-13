let currentDraggedElement;

let tasks = [];

async function initBoard(site) {
  init(site);
  const data = await loadData("/tasks");
  tasks = Object.entries(data).map(([id, task]) => ({ ...task, id }));
  renderToDo();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
  
}

function renderToDo() {
  let toDo = tasks.filter((t) => t["status"] == "todo");
  document.getElementById("toDo").innerHTML = "";

  for (let i = 0; i < toDo.length; i++) {
    const element = toDo[i];
    document.getElementById("toDo").innerHTML += getToDoTemplate(element);
  }
}

function renderInProgress() {
  let progress = tasks.filter((t) => t["status"] == "in-progress");
  document.getElementById("inProgress").innerHTML = "";

  for (let i = 0; i < progress.length; i++) {
    const element = progress[i];
    document.getElementById("inProgress").innerHTML +=
      getToDoTemplate(element);
  }
}

function renderAwaitFeedback() {
  let awaitFeedback = tasks.filter((t) => t["status"] == "await");
  document.getElementById("await").innerHTML = "";

  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    document.getElementById("await").innerHTML += getToDoTemplate(element);
  }
}

function renderDone() {
  let done = tasks.filter((t) => t["status"] == "done");
  document.getElementById("done").innerHTML = "";

  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    document.getElementById("done").innerHTML += getToDoTemplate(element);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  tasks[currentDraggedElement]["category"] = category;
  updateHTML();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}
