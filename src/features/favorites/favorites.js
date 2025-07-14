// Handle favorite buttons
document.addEventListener('DOMContentLoaded', function() {
  // Get userId from localStorage (set this during login)
  const userId = localStorage.getItem('userId');
  
  // Add event listeners to all favorite buttons
  document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('favorite-btn')) {
      const btn = e.target;
      const outfitId = btn.dataset.outfitId;
      
      try {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            outfitId: outfitId
          })
        });
        
        const result = await response.json();
        btn.classList.toggle('active', result.isFavorite);
        
        // If on favorites page and un-favorited, remove the post
        if (window.location.pathname.includes('favorites.html') && !result.isFavorite) {
          btn.closest('.post').remove();
          
          // Show message if no favorites left
          if (document.querySelectorAll('.post').length === 0) {
            document.getElementById('favoritesFeed').innerHTML = 
              '<p>No favorite outfits yet. Start by clicking the heart on outfits you like!</p>';
          }
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('Failed to update favorite. Please try again.');
      }
    }
  });
});