let currentEditPriority = null;

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

async function closeDialogBoard(section) {
  const dialogBoard = document.getElementById("openDialogBoard");
  dialogBoard.close();
  await renderSection(section);
}

async function deleteTask(id) {
  if (isGuest()) return showMessage("Als Gast nicht möglich.");
  try {
    await deleteData(`/tasks/${id}`);
    showMessage("Task wurde gelöscht");
    closeDialogBoard();
    const data = await loadData("/tasks");
    tasks = Object.entries(data).map(([id, task]) => ({ ...task, id }));
    renderAll();
  } catch (error) {}
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

function calcSubtaskProgress(solved, total) {
  return (solved / total) * 100;
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

function checkIfSubtasksAvaiable(subtasks, taskID) {
  if (subtasks) {
    return subtasks
      .map((s, index) => getSubtasksTemplate(s, taskID, index))
      .join("");
  } else {
    return "<p>No Subtask avaiable in this Task</p>";
  }
}

async function openEditTask(taskId) {
  if (isGuest()) return showMessage("Als Gast nicht möglich.");
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
  if (isGuest()) return showMessage("Als Gast nicht möglich.");
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

function setEditPriority(event, priority) {
  currentEditPriority = priority;
  document
    .querySelectorAll(".prio-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");
}

function getSubtasksEditTemplate(subtasks, taskId) {
  if (!subtasks) return "";
  return subtasks
    .map((s, i) => getSubtaskEditItemTemplate(s, taskId, i))
    .join("");
}

function onSubtaskInputEdit() {
  const input = document.getElementById("new-subtask-input");
  const btns = document.getElementById("subtask-confirm-btns-edit");
  btns.classList.toggle("visible", input.value.trim().length > 0);
}

function clearSubtaskInputEdit() {
  document.getElementById("new-subtask-input").value = "";
  onSubtaskInputEdit();
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
