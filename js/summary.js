async function initSummary() {
  const data = await loadData("/tasks");
  if (!data) return;

  const tasks = Object.entries(data).map(([id, task]) => ({ ...task, id }));

  // Zählen nach Status
  const toDoCount     = tasks.filter(t => t.status === "toDo").length;
  const doneCount     = tasks.filter(t => t.status === "done").length;
  const progressCount = tasks.filter(t => t.status === "inProgress").length;
  const feedbackCount = tasks.filter(t => t.status === "await").length;
  const boardCount    = tasks.length;

  // Urgent Tasks (Priorität = urgent)
  const urgentTasks = tasks.filter(t => t.priority === "urgent");
  const urgentCount = urgentTasks.length;

  // Nächste Deadline aus den Urgent Tasks
  const upcomingDeadline = getNextDeadline(urgentTasks);

  // In die HTML-Elemente schreiben
  document.getElementById("todo_count").textContent     = toDoCount;
  document.getElementById("done_count").textContent     = doneCount;
  document.getElementById("progress_count").textContent = progressCount;
  document.getElementById("feedback_count").textContent = feedbackCount;
  document.getElementById("board_count").textContent    = boardCount;
  document.getElementById("urgent_count").textContent   = urgentCount;
  document.getElementById("deadline").textContent       = upcomingDeadline;
}

function getNextDeadline(urgentTasks) {
  const withDeadline = urgentTasks
    .filter(t => t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  if (withDeadline.length === 0) return "No deadline";

  const date = new Date(withDeadline[0].dueDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}