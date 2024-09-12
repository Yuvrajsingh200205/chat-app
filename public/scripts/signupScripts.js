document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const passwordConstraints = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordConstraints.test(password)) {
        alert('Password must contain at least one uppercase letter, one lowercase letter, one special character, one numeric character, and be at least 8 characters long.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Show the success popup
    const popup = document.getElementById('successPopup');
    popup.style.display = 'flex';

    // Hide the popup after 2 seconds
    setTimeout(function() {
        popup.style.animation = 'fadeOut 0.5s';
        setTimeout(function() {
            popup.style.display = 'none';
            popup.style.animation = ''; y
        }, 500); 
    }, 2000);
});

document.querySelector('.close').addEventListener('click', function() {
    const popup = document.getElementById('successPopup');
    popup.style.animation = 'fadeOut 0.5s';
    setTimeout(function() {
        popup.style.display = 'none';
        popup.style.animation = ''; 
    }, 500); 
    
});




