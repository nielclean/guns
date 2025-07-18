document.addEventListener('DOMContentLoaded', () => {
  const userId = '1355225924018245796';
  const card = document.getElementById('card');

  // Discord Info
  fetch(`https://api.lanyard.rest/v1/users/${userId}`)
    .then(res => res.json())
    .then(({ data }) => {
      const { username } = data.discord_user;
      const avatarURL = `https://cdn.discordapp.com/avatars/${userId}/${data.discord_user.avatar}.png?size=512`;
      document.getElementById('username').textContent = `@${username}`;
      document.getElementById('status').textContent =
        data.discord_status === 'online' ? '🟢 Online' : `⚫ ${data.discord_status}`;
      document.getElementById('avatar').src = avatarURL;
    });

  // View Counter
  let views = localStorage.getItem('guns_views');
  views = views ? parseInt(views) + 1 : 1;
  localStorage.setItem('guns_views', views);
  document.getElementById('viewCount').textContent = views;

  // Parallax Effect
  document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 40;
    const y = (window.innerHeight / 2 - e.pageY) / 40;
    card.style.transform = `translate(-50%, -50%) rotateY(${x}deg) rotateX(${y}deg)`;
  });

  // Load particles
  particlesJS.load('particles-js', 'particles.json');
});
