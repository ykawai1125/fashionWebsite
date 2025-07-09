document.addEventListener('DOMContentLoaded', () => {
  // Get parameters from URL
  const urlParams = new URLSearchParams(window.location.search);
  const imgPath = urlParams.get('img');
  const postId = urlParams.get('id');

  // Immediately display the image from URL parameter
  const outfitImage = document.getElementById('outfitImage');
  if (imgPath) {
    outfitImage.src = decodeURIComponent(imgPath);
    outfitImage.onerror = () => {
      outfitImage.src = 'placeholder.jpg'; // Fallback if image fails to load
    };
  }

  if (postId) {
    fetch(`/post/${postId}`)
      .then(res => res.json())
      .then(post => {
        document.getElementById('username').textContent = post.username || 'Unknown';
        document.getElementById('height').textContent = post.height ? `${post.height}cm` : '';
      })
      .catch(console.error);
  }
});