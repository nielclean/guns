document.addEventListener('DOMContentLoaded', () => {
  const userId = '1355225924018245796'; // ID do usuário Discord

  fetch(`https://api.lanyard.rest/v1/users/${userId}`)
    .then(res => res.json())
    .then(({ data }) => {
      const userLink = `https://discord.com/users/${data.discord_user.id}/`;

      const profileContainer = document.querySelector('.profile-container');
      const profile = createprofile(0, userLink);
      profileContainer.appendChild(profile);

      atualizarprofile(0, data);
    })
    .catch(err => {
      console.error('Erro ao carregar usuário da Lanyard:', err);
    });
});

function atualizarprofile(index, userData) {
  const imgElement = document.getElementById(`avatar${index + 1}`);
  const nameElement = document.getElementById(`name${index + 1}`);
  const tagElement = document.createElement('p');
  const flagsElement = document.getElementById(`flags${index + 1}`);
  const connsElement = document.getElementById(`conns${index + 1}`);

  if (!userData.connected_accounts) userData.connected_accounts = [];
  userData.connected_accounts.push({ type: 'discord', name: `@${userData.discord_user.username}` });

  // Avatar
  const avatarId = userData.discord_user.avatar;
  const userId = userData.discord_user.id;
  let avatarUrl;
  if (avatarId?.startsWith('a_')) {
    avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.gif`;
  } else if (avatarId) {
    avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.png`;
  } else {
    avatarUrl = `https://cdn.discordapp.com/embed/avatars/1.png`;
  }

  tagElement.textContent = `@${userData.discord_user.username}`;
  imgElement.src = avatarUrl;
  nameElement.textContent = userData.discord_user.global_name || userData.discord_user.username || ' ';

  // Badges
  const flags = {
    active_developer: "<img class='flag-icon' title='Desenvolvedor(a) Ativo(a)' src='https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/activedeveloper.svg'>",
    early_supporter: "<img class='flag-icon' src='https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordearlysupporter.svg' alt='Premium Early Supporter' title='Apoiador Inicial'>",
    premium: "<img class='flag-icon' src='https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordnitro.svg' alt='Nitro' title='Nitro'>",
    partner: `<img class='flag-icon' src='https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordpartner.svg' alt='Partner' title='Dono(a) de servidor parceiro'>`,
    bug_hunter_level_2: `<img class='flag-icon' src='https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordbughunter2.svg' alt='BugHunter' title='BugHunter 2'>`,
    verified_developer: `<img class='flag-icon' src='https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordbotdev.svg' alt='Verified Developer' title='Desenvolvedor Verificado de bots Pioneiro'>`,
    certified_moderator: `<img class='flag-icon' src='https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordmod.svg' alt='Moderador' title='Moderator'>`,
  };

  // Interpretar flags do Discord — aqui um exemplo básico, só mostra Nitro se premium_since existe
  let badgesHtml = '';
  if (userData.premium_since) {
    badgesHtml += flags.premium;
  }

  // Exemplo de flags básicos (usar userData.discord_user.flags se quiser interpretar bitfield - fora do escopo aqui)
  // Adicione outros conforme queira

  if (badgesHtml.length === 0) {
    badgesHtml = `<img class='flag-icon' src='https://ogp.wtf/assets/connections/invis.png' alt=' '>`;
  }
  flagsElement.innerHTML = badgesHtml;

  // Connections
  const connections = {
    paypal: { icon: "<img class='conn-icon' src='https://discord.com/assets/c44f32fe60d6657fda9f.svg'>", off: true },
    domain: { icon: "<img class='conn-icon' src='https://ogp.wtf/assets/connections/domain.svg'>", link: 'https://' },
    steam: { icon: "<img class='conn-icon' src='https://ogp.wtf/assets/connections/steam.svg'>", link: 'https://steamcommunity.com/profiles/' },
    spotify: { icon: "<img class='conn-icon' src='https://ogp.wtf/assets/connections/spotify.svg'>", link: 'https://open.spotify.com/user/' },
    facebook: { icon: "<img class='conn-icon' src='https://ogp.wtf/assets/connections/facebook.svg'>", link: 'https://www.facebook.com/@' },
    github: { icon: "<img class='conn-icon'src='https://ogp.wtf/assets/connections/github.svg'>", link: 'https://github.com/', user: true },
    reddit: { icon: "<img class='conn-icon' src='https://ogp.wtf/assets/connections/reddit.svg'>", link: 'https://www.reddit.com/user/', user: true },
    tiktok: { icon: "<img class='conn-icon' src='https://ogp.wtf/assets/connections/tiktok.svg'>", link: 'https://www.tiktok.com/@', user: true },
    twitch: { icon: "<img class='conn-icon' src='https://ogp.wtf/assets/connections/twitch.svg'>", link: 'https://www.twitch.tv/', user: true },
    twitter: { icon: "<img class='conn-icon' src='./assets/twitter.png'>", link: 'https://twitter.com/', user: true },
    instagram: { icon: "<img class='conn-icon' src='./assets/instagram.png'>", link: 'https://www.instagram.com/', user: true },
    discord: { icon: "<img class='conn-icon' src='./assets/discord.svg'>", link: 'https://discord.com/users/', user: true },
  };

  connsElement.innerHTML = (userData.connected_accounts && userData.connected_accounts.length > 0)
    ? userData.connected_accounts.map((conn) => {
      const lowerCaseType = conn.type.toLowerCase();
      if (lowerCaseType in connections) {
        const connection = connections[lowerCaseType];
        if (connection.off) {
          return `<a title="${conn.name || ''}" class="tooltip">${connection.icon}<span class="tooltiptext">${conn.name || ''}</span></a>`;
        }
        if (connection.user) {
          return `<a href="${connection.link}${conn.type === 'discord' ? userData.discord_user.id : conn.name}" target="_blank" class="tooltip">${connection.icon}<span class="tooltiptext">${conn.name || ''}</span></a>`;
        } else {
          return `<a href="${connection.link}" target="_blank" class="tooltip">${connection.icon}<span class="tooltiptext">${conn.name || ''}</span></a>`;
        }
      }
      return '';
    }).join(' ')
    : "<img class='conn-icon' src='https://ogp.wtf/assets/connections/invis.png' alt=' '>";


  nameElement.appendChild(tagElement);

  imgElement.addEventListener('load', () => {
    const profileElement = document.querySelector(`.profile:nth-child(${index + 1})`);
    profileElement.classList.add('loaded');
  });
}

function createprofile(index, userLink) {
  const profile = document.createElement('div');
  profile.className = 'profile';

  const link = document.createElement('a');
  link.href = userLink || `https://discord.com/users/${index + 1}`;
  link.target = "_blank";
  link.title = `Clique para ir para o profile.`;

  const avatar = document.createElement('img');
  avatar.id = `avatar${index + 1}`;
  avatar.alt = '';

  const nameContainer = document.createElement('div');
  nameContainer.className = 'name-container';

  const nameParagraph = document.createElement('p');
  nameParagraph.id = `name${index + 1}`;
  nameParagraph.textContent = ' ';

  const flagsParagraph = document.createElement('p');
  flagsParagraph.id = `flags${index + 1}`;
  flagsParagraph.innerHTML = ' ';

  const connsParagraph = document.createElement('p');
  connsParagraph.id = `conns${index + 1}`;
  connsParagraph.innerHTML = ' ';

  link.appendChild(avatar);
  nameContainer.appendChild(nameParagraph);
  nameContainer.appendChild(flagsParagraph);
  nameContainer.appendChild(connsParagraph);

  profile.appendChild(link);
  profile.appendChild(nameContainer);

  avatar.addEventListener('load', () => {
    VanillaTilt.init(profile, {
      max: 25,
      speed: 1000,
      glare: true,
      "max-glare": 0.2,
      gyroscope: true,
    });
  });

  return profile;
}

function removeOverlay() {
  var overlay = document.querySelector('.black-overlay');
  Musica();
  overlay.style.transition = 'opacity 1s';
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 1000);
}

function Musica() {
  const audio = document.getElementById('audio');
  audio.muted = false;
  audio.volume = 0.3;
  audio.play();
}

function getKey(e) {
  var n = e.keyCode;
  if (console.log(n), 16 != n && 17 != n || (mode = 2), 1 == mode) {
    if (123 == n)
      return !1;
  } else {
    if (73 == n || 74 == n || 85 == n)
      return !1;
    if (123 == n)
      return !1;
  }
}
var rev = "fwd";
function titlebar(t) {
  var e = "urso.cc",
    i = t,
    r = (e = "" + e).length;
  if ("fwd" == rev)
    i < r ? (i += 1,
      scroll = e.substr(0, i),
      document.title = scroll,
      timer = window.setTimeout("titlebar(" + i + ")", 145)) : (rev = "bwd",
        timer = window.setTimeout("titlebar(" + i + ")", 145));
  else if (i > 0) {
    var a = r - (i -= 1);
    scrol = e.substr(a, r),
      document.title = scrol,
      timer = window.setTimeout("titlebar(" + i + ")", 145);
  } else
    rev = "fwd",
      timer = window.setTimeout("titlebar(" + i + ")", 145);
}
//titlebar(0);

let mode = 1;
document.oncontextmenu = new Function("return false;");
// window.onkeydown = getKey;

document.querySelector('.profile-container').onmousemove = e => {
  for (const profile of document.querySelectorAll('.profile')) {
    const rect = profile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
  }
};

document.addEventListener("DOMContentLoaded", async function () {
  var audio = document.getElementById("audio");
  var muteButton = document.getElementById("muteButton");
  var muteIcon = document.getElementById("muteIcon");
  var unmuteIcon = document.getElementById("unmuteIcon");

  if (!audio.muted) {
    muteIcon.style.display = "none";
    unmuteIcon.style.display = "inline-block";
  }
  let views = await fetch(`https://ogp.wtf/api/starsviews`, { method: 'POST' }).then(res => res.json());
  document.getElementById("views").innerHTML = views.views;
  muteButton.addEventListener("click", function () {
    if (audio.muted) {
      audio.muted = false;
      muteIcon.style.display = "none";
      unmuteIcon.style.display = "inline-block";
    } else {
      audio.muted = true;
      muteIcon.style.display = "inline-block";
      unmuteIcon.style.display = "none";
    }
  });
});
