let currentDraggedElement;
let currentEditTaskId = null;

let tasks = [];

async function initBoard(site) {
  init(site);
  await initTasks();
  renderAll();
}

async function initTasks() {
  const data = await loadData("/tasks");
  tasks = Object.entries(data).map(([id, task]) => ({ ...task, id }));
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
  updateNoTaskPlaceholders();
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
  await initTasks();
  const element = tasks.find((t) => t.id === id);
  const assignedContacts = await getAssignedContacts(element.assignedTo);
  const dialogBoard = document.getElementById("openDialogBoard");
  dialogBoard.innerHTML = getDialogBoardTemplate(
    element,
    assignedContacts,
    element.subtasks,
  );
  dialogBoard.showModal();
}

async function getAssignedContacts(assignedTo) {
  const data = await loadData("/contacts");
  if (!data || !assignedTo) return [];

  const assignedArray = Array.isArray(assignedTo)
    ? assignedTo
    : Object.values(assignedTo);

  const assignedIds = assignedArray.map((a) => a.id.trim());
  const result = Object.entries(data)
    .map(([id, contact]) => ({ ...contact, id }))
    .filter((contact) => assignedIds.includes(contact.id.trim()));
  return result;
}

async function closeDialogBoard(section) {
  const dialogBoard = document.getElementById("openDialogBoard");
  dialogBoard.close();
  await renderSection(section);
}

async function deleteTask(id) {
  showMessage("Task wurde gelöscht");
  await deleteData(`/tasks/${id}`);
  closeDialogBoard();
  const data = await loadData("/tasks");
  tasks = Object.entries(data).map(([id, task]) => ({ ...task, id }));
  renderAll();
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

function checkIfSubtaskActive(subtaskCompleted) {
  if (subtaskCompleted == true) {
    return "checked";
  } else {
    return "";
  }
}

async function toggleSubtask(subtaskIndex, isSubtaskCompleted, taskID) {
  if (isSubtaskCompleted) {
    await putData(
      "/tasks/" + taskID + "/subtasks/" + subtaskIndex + "/completed",
      false,
    );
  }
  if (isSubtaskCompleted == false) {
    await putData(
      "/tasks/" + taskID + "/subtasks/" + subtaskIndex + "/completed",
      true,
    );
  }
  await openDialogBoard(taskID);
}

function checkIfSubtasksAvaiable(subtasks, taskID) {
  if (subtasks) {
    return subtasks
      .map((s, index) => getSubtasksTemplate(s, taskID, index))
      .join("");
  } else {
    return "<p>No Subtask avaiable in this Task</p>";
  }
}

async function findTask() {
  const query = document.getElementById("searchTask").value.toLowerCase();

  if (query.length < 1) {
    renderAll();
    return;
  }

  const matches = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query),
  );

  await renderFilteredTasks(matches);
}

async function renderFilteredTasks(filteredTasks) {
  const sections = ["toDo", "inProgress", "await", "done"];

  for (const section of sections) {
    const container = document.getElementById(section);
    document.getElementById(section).innerHTML = getDropZoneTemplate(section);
    const dropZone = document.getElementById(`dropzone-${section}`);
    dropZone.innerHTML = "";

    const sectionTasks = filteredTasks.filter((t) => t.status === section);

    for (const element of sectionTasks) {
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

  updateNoTaskPlaceholders();
}

async function openEditTask(taskId) {
  currentEditTaskId = taskId;
  const element = tasks.find((t) => t.id === taskId);
  const assignedContacts = await getAssignedContacts(element.assignedTo);
  const allContacts = await loadData("/contacts");
  const assignedTo = element.assignedTo
    ? Array.isArray(element.assignedTo)
      ? element.assignedTo
      : Object.values(element.assignedTo)
    : [];
  const assignedIds = assignedTo.map((a) => a.id);
  const priorityButtons = getPriorityButtonsTemplate(element.priority);
  const assignedHTML = buildAssignedContactsEdit(allContacts, assignedIds);
  const subtasksHTML = getSubtasksEditTemplate(element.subtasks, taskId);

  document.getElementById("openDialogBoard").innerHTML =
    getDialogBoardEditTemplate(
      element,
      priorityButtons,
      assignedHTML,
      subtasksHTML,
    );
}

async function saveEditTask(taskId) {
  const element = tasks.find((t) => t.id === taskId);
  const updatedData = {
    ...element,
    title: document.getElementById("edit-title").value,
    description: document.getElementById("edit-description").value,
    dueDate: document.getElementById("edit-due-date").value,
    priority: currentEditPriority ?? element.priority,
  };

  await putData("/tasks/" + taskId, updatedData);

  const index = tasks.findIndex((t) => t.id === taskId);
  tasks[index] = updatedData;

  await closeDialogBoard(element.status);
}

let currentEditPriority = null;

function setEditPriority(event, priority) {
  currentEditPriority = priority;
  document
    .querySelectorAll(".prio-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");
}

async function toggleSubtaskEdit(subtaskIndex, isCompleted, taskId) {
  await putData(
    "/tasks/" + taskId + "/subtasks/" + subtaskIndex + "/completed",
    !isCompleted,
  );
  await initTasks();
  const element = tasks.find((t) => t.id === taskId);
  const assignedContacts = await getAssignedContacts(element.assignedTo);
  openEditTask(taskId);
}

function checkIfSubtasksAvaiableEdit(subtasks, taskID) {
  if (subtasks) {
    return subtasks
      .map((s, index) =>
        getSubtasksTemplate(s, taskID, index, "toggleSubtaskEdit"),
      )
      .join("");
  } else {
    return "<p>No Subtask available</p>";
  }
}

function buildContactOptions(allContacts, assignedIds) {
  return Object.entries(allContacts)
    .map(([id, contact]) => {
      const checked = assignedIds.includes(id) ? "checked" : "";
      return getContactOptionTemplate(id, contact, checked);
    })
    .join("");
}

function buildContactBadges(allContacts, assignedIds) {
  return Object.entries(allContacts)
    .filter(([id]) => assignedIds.includes(id))
    .map(([id, contact]) => getContactBadgeTemplate(contact))
    .join("");
}

function buildAssignedContactsEdit(allContacts, assignedIds) {
  const optionsHTML = buildContactOptions(allContacts, assignedIds);
  const badgesHTML = buildContactBadges(allContacts, assignedIds);
  return getAssignedContactsEditTemplate(optionsHTML, badgesHTML);
}

function getSubtasksEditTemplate(subtasks, taskId) {
  if (!subtasks) return "<p>No Subtasks available</p>";
  return subtasks
    .map(
      (s, index) => `
    <li class="subtask-edit-item">
      <span>• ${s.title}</span>
      <div class="subtask-item-actions">
        <button class="subtask-icon-btn" onclick="deleteSubtaskEdit('${taskId}', ${index})">🗑</button>
      </div>
    </li>
  `,
    )
    .join("");
}

function getPriorityButtonsTemplate(currentPriority) {
  return ["urgent", "medium", "low"]
    .map((p) => {
      const active = currentPriority === p ? "active" : "";
      return `<button class="prio-btn ${active}" data-priority="${p}" onclick="setEditPriority(event, '${p}')">
      ${capitalize(p)} <img src="./assets/icons/priority-${p}.svg" />
    </button>`;
    })
    .join("");
}

async function toggleAssignedContact(event, contactId) {
  const checkbox = event.currentTarget.querySelector("input[type='checkbox']");

  if (event.target !== checkbox) {
    checkbox.checked = !checkbox.checked;
  }

  const taskId = currentEditTaskId;
  const element = tasks.find((t) => t.id === taskId);
  let assignedTo = element.assignedTo
    ? Array.isArray(element.assignedTo)
      ? [...element.assignedTo]
      : Object.values(element.assignedTo)
    : [];

  if (checkbox.checked) {
    assignedTo.push({ id: contactId });
  } else {
    assignedTo = assignedTo.filter((a) => a.id !== contactId);
  }

  await putData("/tasks/" + taskId + "/assignedTo", assignedTo);
  await initTasks();

  const allContacts = await loadData("/contacts");
  const assignedIds = assignedTo.map((a) => a.id);
  document.getElementById("edit-assigned-badges").innerHTML =
    buildContactBadges(allContacts, assignedIds);
}

async function addSubtaskEdit(taskId) {
  const input = document.getElementById("new-subtask-input");
  const title = input.value.trim();
  if (!title) return;
  const element = tasks.find((t) => t.id === taskId);
  const subtasks = element.subtasks ? [...element.subtasks] : [];
  subtasks.push({ title, completed: false });
  await putData("/tasks/" + taskId + "/subtasks", subtasks);
  await initTasks();
  await openEditTask(taskId);
}

async function deleteSubtaskEdit(taskId, subtaskIndex) {
  const element = tasks.find((t) => t.id === taskId);
  const subtasks = [...element.subtasks];
  subtasks.splice(subtaskIndex, 1);
  await putData("/tasks/" + taskId + "/subtasks", subtasks);
  await initTasks();
  await openEditTask(taskId);
}

function toggleEditDropdown() {
  const dropdown = document.getElementById("edit-assigned-dropdown");
  const trigger = dropdown.previousElementSibling;
  dropdown.classList.toggle("open");
  trigger.classList.toggle("open");
}
