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

async function reRenderColumns(...columns) {
  for (const col of columns) await renderSection(col);
  updateNoTaskPlaceholders();
}

async function moveTo(newStatus) {
  const task = tasks.find((t) => t.id === currentDraggedElement);
  if (!task) return;
  const oldStatus = task.status;
  if (oldStatus == newStatus) return;

  task.status = newStatus;
  try {
    await putData("/tasks/" + task.id, task);
  } catch {
    task.status = oldStatus;
  }
  await reRenderColumns(oldStatus, newStatus);
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
    if (!hasTasks) {
      placeholder.classList.remove("hidden");
    } else {
      placeholder.classList.add("hidden");
    }
  }
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

function handleSubtaskKeyEdit(event, taskId) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSubtaskEdit(taskId);
  }
  if (event.key === "Escape") clearSubtaskInputEdit();
}

function editSubtaskEditMode(span) {
  const li = span.closest("li");
  li.innerHTML = getSubtaskEditingStateTemplate(span.textContent);
  li.querySelector("input").focus();
}

function confirmSubtaskEditMode(btn) {
  const li = btn.closest("li");
  const text = li.querySelector(".subtask-edit-input").value.trim();
  if (!text) {
    li.remove();
    return;
  }
  li.outerHTML = getSubtaskEditItemTemplate(
    { title: text },
    li.dataset.taskId,
    li.dataset.index,
  );
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
