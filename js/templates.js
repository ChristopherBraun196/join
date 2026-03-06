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
                <img src="./assets/icons/summary_icon.svg" />
                Summary
            </a>

            <a class="nav-link ${addtask}" id="addtask-link" href="./addtask.html">
                <img src="./assets/icons/addtask_icon.svg" />
                Add Task
            </a>

            <a class="nav-link ${board}" id="board-link" href="./board.html">
                <img src="./assets/icons/board_icon.svg" class="highlighted-icon" />
                Board
            </a>

            <a class="nav-link ${contact}" href="./contacts.html">
                <img src="./assets/icons/contacts_icon.svg" />
                Contacts
            </a>
        </nav>

        <div class="privacy">
            <a class="nav-link ${privacy}" href="privacy.html">Privacy Policy</a>
            <a class="nav-link ${legal}" href="legal.html">Legal notice</a>
        </div>

    `;
}

function getAddTaskTemplate() {
    return `
        <section id="add-task">
            <h1>Add Task</h2>

            <form onsubmit="return false">
                <div id="left-side-form">
                    <div id="task-title">
                        <label for="title">Title<span class="required">*</span></label>
                        <input type="text" name="title" placeholder="Enter a title" required/>
                    </div>
                    <div id="task-description">
                        <label for="description">Description</label>
                        <textarea name="description" id="description" cols="30" rows="5"></textarea>
                    </div>
                    <div id="task-due-date">
                        <label for="due-date">Due Date<span class="required">*</span></label>
                        <input type="date" id="due-date" required/>
                    </div>
                </div>
                <div id="task-spacer"></div>
                <div id="right-side-task">
                    <div id="task-priority">
                        <label for="priority">Priority</label>
                        <div id="task-priority-btns">
                            <button class="priority" type="button">Urgent <span><img src="./assets/icons/priority-urgent.svg" alt="Urgent priority icon"></span></button>
                            <button class="priority" type="button">Medium<img src="./assets/icons/priority-medium.svg" alt="Medium priority icon"></span></button>
                            <button class="priority" type="button">Low<img src="./assets/icons/priority-low.svg" alt="Low priority icon"></span></button>
                        </div>
                    </div>
                    <div id="task-assigned-to">
                        <label for="assigned">Assigned to</label>
                        <select name="assigned" id="assigned">
                            <option value="assign">Select contacts to assign</option>
                        </select>
                    </div>
                    <div id="task-category">
                        <label for="category">Category<span class="required">*</span></label>
                        <select name="category" id="category">
                            <option value="category">Select task category</option>
                        </select>
                    </div>
                    <div id="task-subtasks">
                        <label for="due-date">Subtasks</label>
                        <input type="text" placeholder="Add new Subtasks"/>
                    </div>
                </div>
            </form>
            <div id="add-task-form-footer">
                <p><span class="required">*</span> This field is required</p>
                <div id="task-btns">
                    <button id="clear-task-form" type="button" onclick="clearAddTaskForm()">Clear <img src="./assets/icons/close.svg" alt="Cross icon"></button>
                    <button id="create-task" class="primary-btn" type="submit">Create Task <img src="./assets/icons/check.svg" alt="Check icon"></button>
                </div>
            </div>

        </section>
    `;
}