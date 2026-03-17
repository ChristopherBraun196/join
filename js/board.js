let currentDraggedElement;

let tasks = [];

async function initBoard(site) {
  init(site);
  const data = await loadData("/tasks");
  tasks = Object.entries(data).map(([id, task]) => ({ ...task, id }));
  renderAll();
}

async function renderAll() {
  await renderToDo();
  await renderInProgress();
  await renderAwaitFeedback();
  await renderDone();
  updateNoTaskPlaceholders();
}

async function renderToDo() {
  let toDo = tasks.filter((t) => t["status"] == "todo");
  document.getElementById("toDo").innerHTML = "";

  for (let i = 0; i < toDo.length; i++) {
    const element = toDo[i];
    const [solved, total, visibility] = await getSubtaskData(element);

    document.getElementById("toDo").innerHTML += await getToDoTemplate(
      element,
      solved,
      total,
      visibility,
      calcSubtaskProgress(solved, total),
    );
  }
  document.getElementById("toDo").innerHTML += getDropZoneTemplate("toDo");
}

async function renderInProgress() {
  let progress = tasks.filter((t) => t["status"] == "inProgress");
  document.getElementById("inProgress").innerHTML = "";

  for (let i = 0; i < progress.length; i++) {
    const element = progress[i];
    const [solved, total, visibility] = await getSubtaskData(element);
    document.getElementById("inProgress").innerHTML += await getToDoTemplate(
      element,
      solved,
      total,
      visibility,
      calcSubtaskProgress(solved, total),
    );
  }
  document.getElementById("inProgress").innerHTML +=
    getDropZoneTemplate("inProgress");
}

async function renderAwaitFeedback() {
  let awaitFeedback = tasks.filter((t) => t["status"] == "await");
  document.getElementById("await").innerHTML = "";

  for (let i = 0; i < awaitFeedback.length; i++) {
    const element = awaitFeedback[i];
    const [solved, total, visibility] = await getSubtaskData(element);
    document.getElementById("await").innerHTML += await getToDoTemplate(
      element,
      solved,
      total,
      visibility,
      calcSubtaskProgress(solved, total),
    );
  }
  document.getElementById("await").innerHTML += getDropZoneTemplate("await");
}

async function renderDone() {
  let done = tasks.filter((t) => t["status"] == "done");
  document.getElementById("done").innerHTML = "";

  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    const [solved, total, visibility] = await getSubtaskData(element);
    document.getElementById("done").innerHTML += await getToDoTemplate(
      element,
      solved,
      total,
      visibility,
      calcSubtaskProgress(solved, total),
    );
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

async function getSubtaskData(element) {
  const solved = await getAmountSolvedSubtasks(element["id"]);
  const total = await getNumberOfSubtasks(element["id"]);
  let visibility = "";
  if (total != 0) visibility = "show";
  return [solved, total, visibility];
}

async function getAmountSolvedSubtasks(taskID) {
  const task = await loadData("/tasks/" + taskID);
  if (task.subtasks === undefined) return 0;
  let amount = 0;
  for (let i = 0; i < task.subtasks.length; i++) {
    if (task.subtasks[i]["completed"] == true) amount++;
  }
  return String(amount);
}

async function getNumberOfSubtasks(taskID) {
  const task = await loadData("/tasks/" + taskID);
  if (task.subtasks === undefined) return 0;

  return task.subtasks.length;
}

function calcSubtaskProgress(solved, total) {
  return (solved / total) * 100;
}

async function getAssignedToAvatars(allMembersOfThisTask) {
  let members = [];
  if (allMembersOfThisTask == undefined) return "";  
  const limit = 3;
  const totalMembers = allMembersOfThisTask.length;
  const displayCount = Math.min(totalMembers, limit);

  for (let i = 0; i < displayCount; i++) {
    const memberID = allMembersOfThisTask[i].id;
    members.push(await getMemberAvatar(memberID));
  }

  if (totalMembers > limit) {
    const overflow = totalMembers - limit;
    members.push(`<div class="avatar overflow-badge" title="+${overflow} more">+${overflow}</div>`);
  }
  return members.join("");
}

async function getMemberAvatar(id) {
  const member = await loadData("/contacts/"+id);
  if (!member) return "";
  
  const name = member.name;
  const htmlTemplate = `<div class="avatar" style="background:${member["avatarColor"]}">${getInitials(name)}</div>`;
  
  return htmlTemplate;
}