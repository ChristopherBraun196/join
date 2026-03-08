let currentDraggedElement;

let todos = [
  {
    id: 0,
    title: "Putzen",
    category: "toDo",
  },
  {
    id: 1,
    title: "Kochen",
    category: "toDo",
  },
  {
    id: 2,
    title: "Einkaufen",
    category: "inProgress",
  },
];

function updateHTML() {
  let open = todos.filter((t) => t["category"] == "toDo");
  document.getElementById("toDo").innerHTML = "";

  for (let i = 0; i < open.length; i++) {
    const element = open[i];
    document.getElementById("toDo").innerHTML += generateToDoHTML(element);
  }

  let closed = todos.filter((t) => t["category"] == "inProgress");
  document.getElementById("inProgress").innerHTML = "";

  for (let i = 0; i < closed.length; i++) {
    const element = closed[i];
    document.getElementById("inProgress").innerHTML +=
      generateToDoHTML(element);
  }
}

function startDragging(id) {
  currentDraggedElement = id;
}

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
