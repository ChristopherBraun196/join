function getLoginTemplate() {
    return `
        <div class="form-header">
            <h1>Log in</h1>
            <div class="spacer"></div>
        </div>

        <form id="login-signup-form" onsubmit="return false">
            <div class="input-fields">
                <div class="email-input">
                    <input class="form-input" type="email" placeholder="E-Mail" name="email" autocomplete="additional-name" required/>
                    <span><img class="input-icon" src="./assets/icons/mail.svg" alt="Email icon"></span>
                </div>
                <div class="pwd-input">
                    <input class="form-input" type="password" placeholder="Password" name="password" required/>
                    <span><img class="input-icon" id="pwd-icon" src="./assets/icons/lock.svg" alt="Lock icon"></span>
                </div>
            </div>
            <div class="login-btns">
                <button id="login-btn" class="primary-btn btn" type="submit">Log in</button>
                <button id="guest-login-btn" class="regular-btn btn" type="button"><a href="./summary.html">Guest Log in</a></button>
            </div>
        </form>
    `;
}

function getSignupTemplate() {
    return `
    
        <div class="form-header">
            <span onclick="switchToLogin()" class="back"><img src="./assets/icons/arrow-back.svg" /></span>
            <h1>Sign Up</h1>
            <div class="spacer"></div>
        </div>

        <form id="login-signup-form" onsubmit="signup(); return false;">
            <div class="input-fields">
                <div class="name-input">
                    <input class="form-input" type="text" placeholder="Full Name" name="fullname" autocomplete="name" required/>
                    <span><img class="input-icon" src="./assets/icons/person.svg" alt="User icon"></span>
                </div>

                <div class="email-input">
                    <input class="form-input" type="email" placeholder="E-Mail" name="email" autocomplete="email" required/>
                    <span><img class="input-icon" src="./assets/icons/mail.svg" alt="Email icon"></span>
                </div>

                <div class="pwd-input">
                    <input class="form-input" type="password" placeholder="Password" name="password" required/>
                    <span><img class="input-icon" id="pwd-icon" src="./assets/icons/lock.svg" alt="Lock icon"></span>
                </div>

                <div class="pwd-input">
                    <input class="form-input" type="password" placeholder="Confirm Password" name="password_confirm"/>
                    <span><img class="input-icon" id="pwd-confirm-icon" src="./assets/icons/lock.svg" alt="Lock icon"></span>
                </div>
                <div class="accept-input">
                    <input type="checkbox" id="accept-btn" required/><p>I accept the <a class="highlighted" href="./legal.html">Privacy policy</a></p>
                </div>
            </div>

            <div class="login-btns">
                <button id="signup-btn" class="primary-btn btn" type="submit">Sign Up</button>
            </div>
        </form>
    `;
}

function getSidebarTemplate(summary, addtask, board, contact, privacy, legal) {
    return `
        <img src="./assets/img/logo-light.svg" class="logo" />
        <nav>
            <a class="nav-link ${summary}" id="summary-link" href="./summary.html">
                <img src="./assets/icons/summary_icon.svg" class="nav-link-icon ${summary}" />
                Summary
            </a>

            <a class="nav-link ${addtask}" id="addtask-link" href="./addtask.html">
                <img src="./assets/icons/addtask_icon.svg" class="nav-link-icon ${addtask}" />
                Add Task
            </a>

            <a class="nav-link ${board}" id="board-link" href="./board.html">
                <img src="./assets/icons/board_icon.svg" class="nav-link-icon ${board}" />
                Board
            </a>

            <a class="nav-link ${contact}" href="./contacts.html">
                <img src="./assets/icons/contacts_icon.svg" class="nav-link-icon ${contact}" />
                Contacts
            </a>
        </nav>

        <div class="privacy">
            <a class="nav-link ${privacy}" href="privacy.html">Privacy Policy</a>
            <a class="nav-link ${legal}" href="legal.html">Legal notice</a>
        </div>

    `;
}

function getTopbarTemplate() {
    return `
        <a>Kanban Project Management Tool</a>
        <button id="help">
            <a href="help.html"><img src="./assets/icons/help.svg" /></a>
        </button>
    `;
}

function getAddTaskDialogTemplate() {
    return `
        <section id="add-task">
            <button onclick="closeAddTaskDialog()" id="close-dialog-btn" tabindex="1"><img src="../assets/icons/close.svg"></button>
            <h1>Add Task</h2>

            <form onsubmit="createTask(); return false;" id="add-task-form">
                <div id="left-side-form">
                    <div id="task-title">
                        <label for="title">Title<span class="required">*</span></label>
                        <input type="text" name="title" placeholder="Enter a title" required onblur="validateOnBlur(this, 'Please enter a title')" />
                    </div>
                    <div id="task-description">
                        <label for="description">Description</label>
                        <textarea name="description" id="description" cols="30" rows="5"></textarea>
                    </div>
                    <div id="task-due-date">
                        <label for="due-date">Due Date<span class="required">*</span></label>
                        <input type="date" id="due-date" name="due-date" required onblur="validateOnBlur(this, 'Please pick a due date')" />
                    </div>
                </div>
                <div id="task-spacer"></div>
                <div id="right-side-task">
                    <div id="task-priority">
                        <label for="priority">Priority</label>
                        <div id="task-priority-btns">
                            <button class="priority-btn urgent" onclick="setPriority(this)" type="button">Urgent <span><img src="./assets/icons/priority-urgent.svg" alt="Urgent priority icon"></span></button>
                            <button class="priority-btn medium set" onclick="setPriority(this)" type="button">Medium<span><img src="./assets/icons/priority-medium.svg" alt="Medium priority icon"></span></button>
                            <button class="priority-btn low" onclick="setPriority(this)" type="button">Low<span><img src="./assets/icons/priority-low.svg" alt="Low priority icon"></span></button>
                        </div>
                    </div>
                    <div id="task-assigned-to">
                        <label>Assigned to</label>
                        <div class="custom-select-wrapper" id="assigned-wrapper">
                            <div class="custom-select-trigger" onclick="toggleDropdown('assigned')">
                                <span id="assigned-placeholder">Select contacts to assign</span>
                                <img src="./assets/icons/arrow_drop_down.svg" class="select-arrow">
                            </div>
                            <div class="custom-select-dropdown" id="assigned-dropdown">
                                <div id="custom-select-dropdown-inner">
                                </div>
                            </div>
                        </div>
                        <div id="assigned-badges"></div>
                    </div>
                    <div id="task-category">
                        <label>Category<span class="required">*</span></label>
                        <div class="custom-select-wrapper" id="category-wrapper">
                            <input type="hidden" name="category" required data-error-msg="Please select a category" />
                            <div class="custom-select-trigger" onclick="toggleDropdown('category')">
                                <span id="category-placeholder">Select task category</span>
                                <img src="./assets/icons/arrow_drop_down.svg" class="select-arrow">
                            </div>
                            <div class="custom-select-dropdown" id="category-dropdown">
                                <div class="custom-select-dropdown-inner">
                                    <div class="custom-option" onclick="selectCategory(this)" data-value="technical-task">
                                        <span>Technical Task</span>
                                    </div>
                                    <div class="custom-option" onclick="selectCategory(this)" data-value="user-story">
                                        <span>User Story</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="task-subtasks">
                        <label>Subtasks</label>
                        <div class="subtask-input-wrapper" id="subtask-wrapper">
                            <input 
                                type="text" 
                                id="subtask-input"
                                placeholder="Add new Subtask"
                                oninput="onSubtaskInput()"
                                onkeydown="handleSubtaskKey(event)"
                            />
                            <div class="subtask-actions" id="subtask-actions">
                                <div class="subtask-confirm-btns" id="subtask-confirm-btns">
                                    <button class="subtask-icon-btn" onclick="clearSubtaskInput()" type="button">
                                        <img src="./assets/icons/close.svg" alt="Cancel">
                                    </button>
                                    <div class="subtask-divider"></div>
                                    <button class="subtask-icon-btn" onclick="addSubtask()" type="button">
                                        <img src="./assets/icons/check-dark.svg" alt="Confirm">
                                    </button>
                                </div>
                            </div>
                        </div>
                        <ul id="subtask-list"></ul>
                    </div>
                </div>
            </form>
            <div id="add-task-form-footer">
                <p><span class="required">*</span> This field is required</p>
                <div id="task-btns">
                    <button id="clear-task-form" type="button" onclick="clearAddTaskForm()">Clear <img src="./assets/icons/close.svg" alt="Cross icon"></button>
                    <button id="create-task" class="primary-btn" form="add-task-form" type="submit">Create Task <img src="./assets/icons/check.svg" alt="Check icon"></button>
                </div>
            </div>

        </section>
    `;
}

function getToDoTemplate(element) {
  return `<div draggable="true" ondragstart="startDragging(${element["id"]})" class="todo">${element["title"]}</div>`;
}