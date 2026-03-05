function getLoginTemplate() {
    return `
        <div class="form-header">
            <h1>Log in</h1>
            <div class="spacer"></div>
        </div>

        <form id="login-form">
            <div class="input-fields">
                <div class="email-input">
                    <input class="form-input" type="email" placeholder="E-Mail" name="email" autocomplete="additional-name" required />
                    <span><img src="./assets/icons/mail.png" alt="Email icon"></span>
                </div>
                <div class="pwd-input">
                    <input class="form-input" type="password" placeholder="Password" name="password" required/>
                    <span><img id="pwd-icon" src="./assets/icons/lock.png" alt="Lock icon"></span>
                </div>
            </div>
            <div class="login-btns">
                <button id="login-btn" class="primary-btn btn" type="submit">Log in</button>
                <button id="guest-login-btn" class="regular-btn btn">Guest Log in</button>
            </div>
        </form>
    `;
}

function getSignupTemplate() {
    return `
        <div class="form-header">
            <h1>Sign up</h1>
            <div class="spacer"></div>
        </div>
        <button onclick="switchToLogin()">Back</button>
    `;
}