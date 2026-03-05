function getLoginTemplate() {
    return `
        <div class="form-header">
            <h1>Log in</h1>
            <div class="spacer"></div>
        </div>

        <form id="login-form">
            <div class="input-fields">
                <div class="email-input">
                    <input class="form-input" type="email" placeholder="E-Mail" name="email" autocomplete="additional-name" />
                    <span><img src="./assets/icons/mail.png" alt="Email icon"></span>
                </div>
                <div class="pwd-input">
                    <input class="form-input" type="password" placeholder="Password" name="password"/>
                    <span><img id="pwd-icon" src="./assets/icons/lock.png" alt="Lock icon"></span>
                </div>
            </div>
            <div class="login-btns">
                <button id="login-btn" class="primary-btn btn" type="submit">Log in</button>
                <button id="guest-login-btn" class="regular-btn btn"><a href="./board.html">Guest Log in</a></button>
            </div>
        </form>
    `;
}

function getSignupTemplate() {
    return `
        <span onclick="switchToLogin()" id="back">Back</span>

        <div class="form-header">
        <h1>Sign Up</h1>
            <div class="spacer"></div>
        </div>

        <form id="signup-form">
            <div class="input-fields">
                <div class="name-input">
                    <input class="form-input" type="text" placeholder="Full Name" name="fullname" autocomplete="name" />
                    <span><img src="./assets/icons/person.png" alt="User icon"></span>
                </div>

                <div class="email-input">
                    <input class="form-input" type="email" placeholder="E-Mail" name="email" autocomplete="email" />
                    <span><img src="./assets/icons/mail.png" alt="Email icon"></span>
                </div>

                <div class="pwd-input">
                    <input class="form-input" type="password" placeholder="Password" name="password"/>
                    <span><img id="pwd-icon" src="./assets/icons/lock.png" alt="Lock icon"></span>
                </div>

                <div class="pwd-input">
                    <input class="form-input" type="password" placeholder="Confirm Password" name="password_confirm"/>
                    <span><img id="pwd-confirm-icon" src="./assets/icons/lock.png" alt="Lock icon"></span>
                </div>
            </div>

            <div class="login-btns">
                <button id="signup-btn" class="primary-btn btn" type="submit">Sign Up</button>
            </div>
        </form>
    `;
}