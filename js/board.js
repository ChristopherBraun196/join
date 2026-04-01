let currentDraggedElement;
let currentEditTaskId = null;
let tasks = [];

/**
 * Initializes the board by running setup, loading tasks and rendering. 
 * @param {string} site - The current site/page identifier
 * @returns {Promise<void>}
 */

async function initBoard(site) {
  init(site);
  await initTasks();
  renderAll();
}

/**
 * Initializes the tasks by loading them from the database.
 * @returns {Promise<void>}
 */

async function initTasks() {
  const data = await loadData("/tasks");
  tasks = Object.entries(data).map(([id, task]) => ({ ...task, id }));
}

/**
 * Renders all task sections on the board.
 * @returns {Promise<void>}
 */

async function renderAll() {
  await renderSection("toDo");
  await renderSection("inProgress");
  await renderSection("await");
  await renderSection("done");
  updateNoTaskPlaceholders();  
}

/**
 * Render all Tasks and give the status on the Board
 * @param {string} section - The column name (e.g. "toDo", "inProgress")
 * @returns {Promoise<void>} 
 */

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
/**
 * Starts Dragging the selected tasks
 * @param {string} id - The ID of the task being dragged
 */

function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Allows a dragged element to be dropped on this target.
 * @param {DragEvent} ev - The drag event
 */

function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Renders the given columns and updates the placeholders.
 * @param  {...string} columns - Column names to re-render (e.g. "toDo", "done")
 * @returns {Promise<void>}
 */

async function reRenderColumns(...columns) {
  for (const col of columns) await renderSection(col);
  updateNoTaskPlaceholders();
}

/**
 * Moves the dragged task to a new status column.
 * @param {string} newStatus - The target column name (e.g. "toDo", "done")
 * @returns {Promise<void>}
 */

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
/**
 * Highlights the dropzone when hovering over it.
 * @param {string} id - The column ID of the dropzone to highlight
 */

function highlight(id) {
  const dropzone = document.getElementById("dropzone-" + id);
  if (dropzone) dropzone.classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from the dropzone after dragging.
 * @param {string} id - The column ID of the dropzone to unhighlight
 */

function removeHighlight(id) {
  const dropzone = document.getElementById("dropzone-" + id);
  if (dropzone) dropzone.classList.remove("drag-area-highlight");
}

/**
 * * Shows or hides the "no tasks" placeholder for each column.
 */

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

/**
 * Loads and returns all contacts assigned to a task.
 * @param {Array|Object} assignedTo - The assigned contacts as array or object
 * @returns {Promise<Object[]>} Array of matching contact objects
 */

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

/**
 * Handles touch movement for drag-and-drop on mobile devices.
 * @param {TouchEvent} e - The touch move event
 */

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

/**
 * Handles the end of a touch drag-and-drop interaction.
 * @param {TouchEvent} e - The touch end event
 */

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


/**
 *  Filters tasks on the board based on the search input.
 * @returns {Promise<void>}
 */

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

/**
 *  Renders filtered tasks into their respective columns.
 * @param {Object[]} filteredTasks - Array of task objects to render
 * @returns {Promise<void>}
 */

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
        element, solved, total, visibility,
        calcSubtaskProgress(solved, total),
      );
    }
  }
  updateNoTaskPlaceholders();
}

/**
 * Toggles the completed state of a subtask and refreshes the edit dialog.
 * @param {number} subtaskIndex - The index of the subtask in the subtasks array
 * @param {boolean} isCompleted - The current completed state of the subtask
 * @param {string} taskId - The ID of the parent task
 * @returns {Promise<void>}
 */

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

/**
 * Returns the subtask HTML for the edit dialog, or a fallback message.
 * @param {Object[]} subtasks - Array of subtask objects
 * @param {string} taskID - The ID of the parent task
 * @returns {string} HTML string of all subtasks or fallback message
 */

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

/**
 * Builds the HTML for all contact options in the assignment dropdown.
 * @param {Object} allContacts - All contacts from the database
 * @param {string[]} assignedIds - Array of already assigned contact IDs
 * @returns {string} HTML string of all contact option elements
 */

function buildContactOptions(allContacts, assignedIds) {
  return Object.entries(allContacts)
    .map(([id, contact]) => {
      const checked = assignedIds.includes(id) ? "checked" : "";
      return getContactOptionTemplate(id, contact, checked);
    })
    .join("");
}

/**
 * Builds the HTML badges for all assigned contacts.
 * @param {Object} allContacts - All contacts from the database
 * @param {string[]} assignedIds - Array of assigned contact IDs
 * @returns {string} HTML string of contact badge elements
 */

function buildContactBadges(allContacts, assignedIds) {
  return Object.entries(allContacts)
    .filter(([id]) => assignedIds.includes(id))
    .map(([id, contact]) => getContactBadgeTemplate(contact))
    .join("");
}

/**
 * Builds the full assigned contacts section for the edit dialog.
 * @param {Object} allContacts - All contacts from the database
 * @param {string[]} assignedIds - Array of assigned contact IDs
 * @returns {string} HTML string of the assigned contacts edit section
 */

function buildAssignedContactsEdit(allContacts, assignedIds) {
  const optionsHTML = buildContactOptions(allContacts, assignedIds);
  const badgesHTML = buildContactBadges(allContacts, assignedIds);
  return getAssignedContactsEditTemplate(optionsHTML, badgesHTML);
}

/**
 * Handles keyboard input for the subtask field in edit mode.
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} taskId - The ID of the parent task
 */

function handleSubtaskKeyEdit(event, taskId) {
  if (event.key === "Enter") {
    event.preventDefault();
    addSubtaskEdit(taskId);
  }
  if (event.key === "Escape") clearSubtaskInputEdit();
}

/**
 * Switches a subtask list item into editing mode.
 * @param {HTMLElement} span - The subtask span element that was clicked
 */

function editSubtaskEditMode(span) {
  const li = span.closest("li");
  li.innerHTML = getSubtaskEditingStateTemplate(span.textContent);
  li.querySelector("input").focus();
}

/**
 * Confirms the subtask edit and updates the list item.
 * @param {HTMLElement} btn - The confirm button that was clicked
 */

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
