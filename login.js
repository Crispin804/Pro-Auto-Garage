function handleAdminLogin(event) {
    event.preventDefault(); 
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorBanner = document.getElementById('error-banner');
    const errorText = document.getElementById('error-text');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (username === "" || password === "") {
        errorText.textContent = "Please fulfill all required access credentials.";
        errorBanner.classList.remove('hidden');
        
        if (username === "") usernameInput.classList.add('border-red-400', 'bg-red-50/30');
        if (password === "") passwordInput.classList.add('border-red-400', 'bg-red-50/30');
        return false;
    }
    
    if (username === "admin" && password === "garage2026") {
        window.location.href = 'admin-dashboard.html';
    } else {
        errorText.textContent = "Invalid username configuration parameters or password mismatch.";
        errorBanner.classList.remove('hidden');
        usernameInput.classList.add('border-red-400');
        passwordInput.classList.add('border-red-400');
    }
}

function clearErrors(inputField) {
    inputField.classList.remove('border-red-400', 'bg-red-50/30');
    const errorBanner = document.getElementById('error-banner');
    if (errorBanner) errorBanner.classList.add('hidden');
}