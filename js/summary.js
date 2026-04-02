/**
 * Initializes the summary page by loading tasks and updating all counters.
 * @returns {Promise<void>}
 */
async function initSummary() {
  const data = await loadData("/tasks");
  if (!data) return;

  const tasks = Object.entries(data).map(([id, task]) => ({ ...task, id }));

  const toDoCount     = tasks.filter(t => t.status === "toDo").length;
  const doneCount     = tasks.filter(t => t.status === "done").length;
  const progressCount = tasks.filter(t => t.status === "inProgress").length;
  const feedbackCount = tasks.filter(t => t.status === "await").length;
  const boardCount    = tasks.length;

  const urgentTasks = tasks.filter(t => t.priority === "urgent");
  const urgentCount = urgentTasks.length;

  const upcomingDeadline = getNextDeadline(urgentTasks);

  document.getElementById("todo_count").textContent     = toDoCount;
  document.getElementById("done_count").textContent     = doneCount;
  document.getElementById("progress_count").textContent = progressCount;
  document.getElementById("feedback_count").textContent = feedbackCount;
  document.getElementById("board_count").textContent    = boardCount;
  document.getElementById("urgent_count").textContent   = urgentCount;
  document.getElementById("deadline").textContent       = upcomingDeadline;

  if (window.innerWidth <= 1200) {
    const welcomeMsg = document.querySelector('.welcome_msg');
    if (!welcomeMsg) return;

    setTimeout(() => {
      welcomeMsg.classList.add('fade-out');

      welcomeMsg.addEventListener('transitionend', () => {
        welcomeMsg.classList.add('hidden');
      }, { once: true });
    }, 1000);
  }
}

/**
 * Returns the nearest upcoming deadline from a list of urgent tasks.
 * @param {Object[]} urgentTasks - Array of urgent task objects
 * @returns {string} The formatted deadline date or "No deadline"
 */
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