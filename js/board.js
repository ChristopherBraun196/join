let currentDraggedElement;

let todos = [
  {
    id: 0,
    title: "toDo",
    category: "toDo",
  },
  {
    id: 1,
    title: "todo2",
    category: "toDo",
  },
  {
    id: 2,
    title: "inProgress",
    category: "inProgress",
  },
  {
    id: 3,
    title: "Await",
    category: "await",
  },
  {
    id: 4,
    title: "Done",
    category: "done",
  },
];

function updateHTML() {
  toDo();
  inProgress();
  awaitFeedback();
  done();
}

function toDo() {
  let toDo = todos.filter((t) => t["category"] == "toDo");
  document.getElementById("toDo").innerHTML = "";

  for (let i = 0; i < toDo.length; i++) {
    const element = toDo[i];
    document.getElementById("toDo").innerHTML += generateToDoHTML(element);
  }
}

function inProgress() {
  let progress = todos.filter((t) => t["category"] == "inProgress");
  document.getElementById("inProgress").innerHTML = "";

  for (let i = 0; i < progress.length; i++) {
    const element = progress[i];
    document.getElementById("inProgress").innerHTML +=
      generateToDoHTML(element);
  }
}

function awaitFeedback() {
  let awaitFeedback = todos.filter((t) => t["category"] == "await");
  document.getElementById("await").innerHTML = "";

  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    document.getElementById("await").innerHTML += generateToDoHTML(element);
  }
}

function done() {
  let done = todos.filter((t) => t["category"] == "done");
  document.getElementById("done").innerHTML = "";

  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    document.getElementById("done").innerHTML += generateToDoHTML(element);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

// This is the template 
function generateToDoHTML(element) {
  return `<div draggable="true" ondragstart="startDragging(${element["id"]})" class="todo">${element["title"]}</div>`;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(category) {
  todos[currentDraggedElement]["category"] = category;
  updateHTML();
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}
