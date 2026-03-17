let currentDraggedElement;

let tasks = [];

async function initBoard(site) {
  init(site);
  const data = await loadData("/tasks");
  tasks = Object.entries(data).map(([id, task]) => ({ ...task, id }));
  renderAll();
}

async function renderAll() {
  await renderSection("toDo");
  await renderSection("inProgress");
  await renderSection("await");
  await renderSection("done");
  updateNoTaskPlaceholders();
}

async function renderSection(section) {
  let taskStatus = tasks.filter((t) => t["status"] == section);
  document.getElementById(section).innerHTML = getDropZoneTemplate(section);
  const dropZone = document.getElementById(`dropzone-${section}`);
  dropZone.innerHTML = "";

  for (let i = 0; i < taskStatus.length; i++) {
    const element = taskStatus[i];
    const [solved, total, visibility] = await getSubtaskData(element);

    dropZone.innerHTML += await getToDoTemplate(
      element,
      solved,
      total,
      visibility,
      calcSubtaskProgress(solved, total),
    );
  }
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
  const dragStatus = task.status;
  if (dragStatus == newStatus) return;
  task.status = newStatus;

  await putData("/tasks/" + task.id, task);
  await renderSection(dragStatus);
  await renderSection(newStatus);
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

async function openDialogBoard(id) {
  const element = tasks.find((t) => t.id === id);
  const assignedContacts = await getAssignedContacts(element.assignedTo);
  const dialogBoard = document.getElementById("openDialogBoard");
  dialogBoard.innerHTML = getDialogBoardTemplate(element, assignedContacts);
  dialogBoard.showModal();
}

async function getAssignedContacts(assignedTo) {
  const data = await loadData("/contacts");
  if (!data || !assignedTo) return [];
  const assignedIds = assignedTo.map(a => a.id.trim());
  const result = Object.entries(data)
    .map(([id, contact]) => ({ ...contact, id }))
    .filter((contact) => assignedIds.includes(contact.id.trim()));
  return result;
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
    members.push(
      `<div class="avatar overflow-badge" title="+${overflow} more">+${overflow}</div>`,
    );
  }
  return members.join("");
}

async function getMemberAvatar(id) {
  const member = await loadData("/contacts/" + id);
  if (!member) return "";

  const name = member.name;
  const htmlTemplate = `<div class="avatar" style="background:${member["avatarColor"]}">${getInitials(name)}</div>`;

  return htmlTemplate;
}

function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function capitalize(fletter) {
  if (!fletter) return "";
  return fletter.charAt(0).toUpperCase() + fletter.slice(1);
}
