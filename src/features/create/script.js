document.getElementById('registrationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const height = document.getElementById('height').value;

  const user = {
    username,
    email,
    password,
    height
  };

  try {
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      document.getElementById('confirmationMessage').style.display = 'block';
      this.reset();
    } else {
      alert('Failed to create account. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again later.');
  }
});

  


