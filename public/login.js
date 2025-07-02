document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    const data = await res.json(); // expecting { id, username, email, ... }

    // Store both username and userId
    localStorage.setItem('username', data.username);
    localStorage.setItem('userId', data.id);

    location.href = 'user.html'; // redirect to profile page
  } else {
    alert('Login failed. Please check your email and password.');
  }
});
