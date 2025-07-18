// Estrelas animadas
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    dx: (Math.random() - 0.5) * 0.2,
    dy: (Math.random() - 0.5) * 0.2
  });
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    star.x += star.dx;
    star.y += star.dy;

    // Rebote nas bordas
    if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
    if (star.y < 0 || star.y > canvas.height) star.dy *= -1;
  });
  requestAnimationFrame(drawStars);
}
drawStars();

// Contador de views
let views = localStorage.getItem("views");
views = views ? parseInt(views) + 1 : 1;
localStorage.setItem("views", views);
document.getElementById("viewCount").textContent = views;

// ID do Discord
const userId = "1355225924018245796";

fetch(`https://api.lanyard.rest/v1/users/${userId}`)
  .then(res => res.json())
  .then(({ data }) => {
    const user = data.discord_user;
    const username = user.username;
    const discriminator = user.discriminator;
    const avatarHash = user.avatar;
    const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${avatarHash}.png?size=512`;

    document.querySelector(".username").textContent = `@${username}`;
    document.getElementById("avatar").src = avatarURL;

    // Status
    const status = data.discord_status;
    const statusText = {
      online: "🟢 Online",
      idle: "🌙 Ausente",
      dnd: "⛔ Ocupado",
      offline: "⚫ Offline"
    }[status] || "⚫ Desconhecido";

    // Adiciona embaixo do nome
    const statusEl = document.createElement("div");
    statusEl.textContent = statusText;
    statusEl.style.fontSize = "12px";
    statusEl.style.marginTop = "4px";
    statusEl.style.opacity = "0.8";
    document.querySelector(".username").after(statusEl);
  })
  .catch(err => {
    console.error("Erro ao carregar Lanyard:", err);
  });

