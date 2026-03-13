let addTaskDialog;

function openAddTaskDialog() {
    let main = document.querySelector('main');
    let dialogSection = document.createElement("dialog");
    dialogSection.id = "add-task-dialog";
    main.appendChild(dialogSection);
    dialogSection.innerHTML = getAddTaskDialogTemplate();
    dialogSection.showModal();
    addTaskDialog = dialogSection;
    renderContacts();
}

function closeAddTaskDialog() {
    addTaskDialog.close();
    addTaskDialog.remove();
}

function clearAddTaskForm() {
    
}

function setPriority(clickedButton) {
    const buttons = document.querySelectorAll('#task-priority-btns .priority-btn');
    buttons.forEach(btn => {
        btn.classList.remove('set');
    });
    clickedButton.classList.add('set');
}


async function loadContacts() {
    return [
        { id: "xK9mP2qRtL8vNjW3", name: "David Eisenberg",  color: "#FFBB2B" },
        { id: "aB3cD4eF5gH6iJ7k", name: "David Müller",     color: "#FF5733" },
        { id: "cD5eF6gH7iJ8kL9m", name: "Sarah König",      color: "#29ABE2" },
        { id: "eF7gH8iJ9kL0mN1o", name: "Max Mustermann",   color: "#7AE229" },
        { id: "gH9iJ0kL1mN2oP3q", name: "Lisa Schneider",   color: "#C300C3" },
    ];
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

async function renderContacts() {
    const contacts = await loadContacts();
    const container = document.getElementById('custom-select-dropdown-inner');

    container.innerHTML = contacts.map(contact => `
        <div class="custom-option" 
             onclick="toggleContact(this)" 
             data-id="${contact.id}">
            <div class="contact-avatar" style="background:${contact.color}">
                ${getInitials(contact.name)}
            </div>
            <span>${contact.name}</span>
            <input type="checkbox">
        </div>
    `).join('');
}

function toggleDropdown(id) {
    const wrapper = document.getElementById(`${id}-wrapper`);
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const dropdown = document.getElementById(`${id}-dropdown`);
    const isOpen = dropdown.classList.contains('open');

    document.querySelectorAll('.custom-select-dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.custom-select-trigger.open').forEach(t => t.classList.remove('open'));

    if (!isOpen) {
        dropdown.classList.add('open');
        trigger.classList.add('open');
    } else if (id === 'category') {
        const hiddenInput = wrapper.querySelector('input[name="category"]');
        if (hiddenInput) validateOnBlur(hiddenInput, 'Please select a category');
    }
}

function selectCategory(option) {
    document.querySelectorAll('#category-dropdown .custom-option')
        .forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');

    const placeholder = document.getElementById('category-placeholder');
    placeholder.textContent = option.querySelector('span').textContent;
    placeholder.style.color = '#2a3647';

    const hiddenInput = document.querySelector('#category-wrapper input[name="category"]');
    hiddenInput.value = option.dataset.value;
    clearFieldError(hiddenInput);

    toggleDropdown('category');
}

function toggleContact(option) {
    const checkbox = option.querySelector('input[type="checkbox"]');
    const isSelected = option.classList.toggle('selected');
    checkbox.checked = isSelected;
    updateAssignedBadges();
}

function updateAssignedBadges() {
    const badges = document.getElementById('assigned-badges');
    badges.innerHTML = '';

    document.querySelectorAll('#assigned-dropdown .custom-option.selected').forEach(opt => {
        const avatar = opt.querySelector('.contact-avatar');
        const badge = document.createElement('div');
        badge.className = 'badge-avatar';
        badge.style.background = avatar.style.background;
        badge.textContent = avatar.textContent;
        badges.appendChild(badge);
    });
}

function renderSelectedAvatars() {
    const container = document.getElementById('selected-avatars');
    if (!container) return;
    container.innerHTML = selectedContacts.map(c => `
        <div class="contact-avatar" style="background:${c.color}" title="${c.name}">
            ${getInitials(c.name)}
        </div>
    `).join('');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select-wrapper')) {
        document.querySelectorAll('.custom-select-dropdown.open').forEach(d => {
            d.classList.remove('open');

            const wrapper = d.closest('.custom-select-wrapper');
            const hiddenInput = wrapper?.querySelector('input[name="category"]');
            if (hiddenInput) validateOnBlur(hiddenInput, 'Please select a category');
        });
        document.querySelectorAll('.custom-select-trigger.open').forEach(t => t.classList.remove('open'));
    }
});

function focusSubtaskInput() {
    document.getElementById('subtask-input').focus();
}

function clearSubtaskInput() {
    document.getElementById('subtask-input').value = '';
    onSubtaskInput();
}

function handleSubtaskKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSubtask();
    }
    if (event.key === 'Escape') {
        clearSubtaskInput();
    }
}

function onSubtaskInput() {
    const input = document.getElementById('subtask-input');
    const confirmBtns = document.getElementById('subtask-confirm-btns');
    const hasText = input.value.trim().length > 0;
    confirmBtns.classList.toggle('visible', hasText);
}

function clearSubtaskInput() {
    document.getElementById('subtask-input').value = '';
    onSubtaskInput();
}

function handleSubtaskKey(event) {
    if (event.key === 'Enter') { event.preventDefault(); addSubtask(); }
    if (event.key === 'Escape') clearSubtaskInput();
}

function addSubtask() {
    const input = document.getElementById('subtask-input');
    const text = input.value.trim();
    if (!text) return;

    const list = document.getElementById('subtask-list');
    const li = createSubtaskItem(text);
    list.appendChild(li);
    clearSubtaskInput();
}

function createSubtaskItem(text) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="subtask-text" onclick="editSubtask(this)">${text}</span>
        <div class="subtask-item-actions">
            <button class="subtask-icon-btn" onclick="removeSubtask(this)" type="button">
                <img src="./assets/icons/close.svg" alt="Delete">
            </button>
        </div>
    `;
    return li;
}

function editSubtask(span) {
    const li = span.closest('li');
    const currentText = span.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'subtask-edit-input';
    li.replaceChild(input, span);
    input.focus();
    input.select();

    const actions = li.querySelector('.subtask-item-actions');
    actions.innerHTML = `
        <button class="subtask-icon-btn" onclick="removeSubtask(this)" type="button">
            <img src="./assets/icons/delete.svg" alt="Delete">
        </button>
        <div class="subtask-divider"></div>
        <button class="subtask-icon-btn" onclick="confirmEditSubtask(this)" type="button">
            <img src="./assets/icons/check-dark.svg" alt="Confirm">
        </button>
    `;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmEditSubtask(actions.querySelector('[alt="Confirm"]').closest('button'));
        if (e.key === 'Escape') cancelEditSubtask(input, currentText);
    });
}

function confirmEditSubtask(btn) {
    const li = btn.closest('li');
    const input = li.querySelector('.subtask-edit-input');
    const newText = input.value.trim();
    if (!newText) { li.remove(); return; }

    const newLi = createSubtaskItem(newText);
    li.replaceWith(newLi);
}

function cancelEditSubtask(input, originalText) {
    const li = input.closest('li');
    const newLi = createSubtaskItem(originalText);
    li.replaceWith(newLi);
}

function removeSubtask(btn) {
    btn.closest('li').remove();
}

function generateTaskJson(taskID) {
    const task = {
        id: taskID,
        title: getTaskTitle(),
        description: getTaskDescription(),
        dueDate: getTaskDueDate(),
        priority: getTaskPriority(),
        category: getTaskCategory(),
        assignedTo: [
            // { id: "xK9mP2qRtL8vNjW3", name: "David Eisenberg", color: "#FFBB2B" }
        ],
        subtasks: [
            // { id: crypto.randomUUID(), title: "Subtask text", completed: false }
        ],
        status: "todo",
    };

    return task;
}

function getTaskTitle() {
    return document.querySelector('input[name="title"]').value.trim();
}

function getTaskDescription() {
    return document.querySelector('textarea[name="description"]').value.trim();
}

function getTaskDueDate() {
    return document.querySelector('input[name="due-date"]').value.trim();
}

function getTaskPriority() {
    const priorityBtn = document.querySelector('.priority-btn.set');
    const priority = ['urgent', 'medium', 'low'].find(p => priorityBtn.classList.contains(p));
    return priority;
}

function getTaskCategory() {
    return document.querySelector('input[name="category"]').value.trim();
}

async function createTask() {
    const taskID = crypto.randomUUID();
    await putData("/tasks/task-"+taskID, generateTaskJson(taskID));
    location.href = "./board.html";
}