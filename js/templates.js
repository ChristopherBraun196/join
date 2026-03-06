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