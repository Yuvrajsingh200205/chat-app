
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Login successful!');
        // Example: window.location.href = '/dashboard';
      } else {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = data.message;
        setTimeout(() => {
          errorMessage.textContent = '';
        }, 3000); // Clear error message after 3 seconds
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  