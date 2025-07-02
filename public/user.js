document.addEventListener('DOMContentLoaded', async () => {
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('usernameDisplay').textContent = username;
  document.getElementById('userHandle').textContent = username.toLowerCase();

  try {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch user data');

    const users = await res.json();
    const userMap = {};
    users.forEach(user => {
      userMap[user.username.toLowerCase()] = user.id;
    });

    const userId = userMap[username.toLowerCase()];
    if (!userId) {
      alert('User ID not found.');
      return;
    }

    document.getElementById('userIdInput').value = userId;
    loadUserImages();
  } catch (error) {
    console.error('Error loading user data:', error);
  }
});

async function loadUserImages() {
  const userId = document.getElementById('userIdInput').value;
  const res = await fetch(`/posts/${userId}`);

  if (res.ok) {
    const posts = await res.json();
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    posts.forEach(post => {
      const link = document.createElement('a');
      link.href = `fashion.html?id=${post.id}&img=${encodeURIComponent(post.image_path)}`;

      const img = document.createElement('img');
      img.src = post.image_path;
      img.className = 'gallery-img';

      link.appendChild(img);
      gallery.appendChild(link);
    });
  } else {
    console.error('Failed to load images');
  }
}

function showTab(tabName) {
  const tabContent = document.getElementById('tabContent');
  switch (tabName) {
    case 'posts':
      tabContent.innerHTML = '<p>Here are your posts.</p>';
      break;
    case 'favorites':
      tabContent.innerHTML = '<p>Your favorite items will appear here.</p>';
      break;
    case 'items':
      tabContent.innerHTML = '<p>These are your owned items.</p>';
      break;
    case 'market':
      tabContent.innerHTML = '<p>Welcome to your flea market listings.</p>';
      break;
    default:
      tabContent.innerHTML = '<p>Select a tab to view content.</p>';
  }
}

document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const res = await fetch('/upload', {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    const { imagePath } = await res.json();
    const gallery = document.getElementById('gallery');
    const imageEl = document.createElement('img');
    imageEl.src = imagePath;
    imageEl.className = 'gallery-img';
    gallery.appendChild(imageEl);
  } else {
    alert('Upload failed.');
  }
});
