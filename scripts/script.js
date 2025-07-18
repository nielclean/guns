document.addEventListener('DOMContentLoaded', () => {
  const userId = '1355225924018245796'; // Seu ID do Discord
  const profileContainer = document.querySelector('.profile-container');

  fetch(`https://api.lanyard.rest/v1/users/${userId}`)
    .then(res => res.json())
    .then(({ data }) => {
      // Cria o profile (único)
      const userLink = `https://discord.com/users/${data.discord_user.id}/`;
      const profile = createProfile(0, userLink);
      profileContainer.appendChild(profile);

      // Atualiza o profile com os dados do Lanyard
      updateProfile(0, data);
    })
    .catch(console.error);
});

function updateProfile(index, userData) {
  // Elements
  const imgElement = document.getElementById(`avatar${index + 1}`);
  const nameElement = document.getElementById(`name${index + 1}`);
  const flagsElement = document.getElementById(`flags${index + 1}`);
  const connsElement = document.getElementById(`conns${index + 1}`);

  // Dados básicos do usuário
  const discordUser = userData.discord_user;
  const avatarUrl = discordUser.avatar?.startsWith('a_')
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.gif`
    : discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/1.png`;

  imgElement.src = avatarUrl;
  nameElement.textContent = discordUser.global_name || discordUser.username || ' ';
  
  // Badges — usando as flags do GitHub e algumas da comunidade (adaptadas)
  // Aqui você pode adaptar as badges que quiser (exemplo simplificado)
  const badges = [];

  // Nitro (se usuário tem premium_since != null)
  if(userData.premium_since) {
    badges.push(`<img class='flag-icon' src='https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordnitro.svg' alt='Nitro' title='Nitro'>`);
  }

  // Bot Developer badge (se for bot dev)
  if(userData.discord_user.public_flags && (userData.discord_user.public_flags & 0x00000040)) { // 0x40 é badge "Discord Certified Moderator" exemplo
    badges.push(`<img class='flag-icon' src='https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/discordbotdev.svg' alt='Bot Developer' title='Bot Developer'>`);
  }

  // Adicione outras badges que quiser aqui, por exemplo de GitHub (exemplo abaixo)
  // Exemplo fixo só pra mostrar:
  badges.push(`<img class='flag-icon' src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' alt='GitHub' title='GitHub'>`);

  flagsElement.innerHTML = badges.length > 0 ? badges.join('') : `<img class='flag-icon' src='https://ogp.wtf/assets/connections/invis.png' alt='Nenhuma badge'>`;

  // Conexões (connected_accounts)
  // A API Lanyard não fornece connected_accounts diretamente, você pode querer adicionar manualmente ou ignorar.
  // Aqui vou criar uma conexão Discord e GitHub como exemplo fixo:
  const connections = [
    {
      type: 'discord',
      name: discordUser.username,
      link: `https://discord.com/users/${discordUser.id}`,
      icon: './assets/discord.svg',
      user: true
    },
    {
      type: 'github',
      name: 'githubUser', // você pode modificar para pegar via outra API
      link: 'https://github.com/githubUser',
      icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
      user: true
    }
  ];

  if (connections.length > 0) {
    connsElement.className = 'conn-container';
    connsElement.innerHTML = connections.map(conn => {
      return `<a href="${conn.link}" target="_blank" title="${conn.name}" class="tooltip">
                <img class="conn-icon" src="${conn.icon}" alt="${conn.type}">
                <span class="tooltiptext">${conn.name}</span>
              </a>`;
    }).join(' ');
  } else {
    connsElement.className = 'conn-container no-connections';
    connsElement.innerHTML = `<img class='conn-icon' src='https://ogp.wtf/assets/connections/invis.png' alt='Nenhuma conexão'>`;
  }

  // Tilt init
  const profileElement = document.querySelector(`.profile:nth-child(${index + 1})`);
  if(profileElement) {
    VanillaTilt.init(profileElement, {
      max: 25,
      speed: 1000,
      glare: true,
      "max-glare": 0.2,
      gyroscope: true,
    });
    profileElement.classList.add('loaded');
  }
}

function createProfile(index, userLink) {
  const profile = document.createElement('div');
  profile.className = 'profile';

  const link = document.createElement('a');
  link.href = userLink || `https://discord.com/users/${index + 1}`;
  link.target = "_blank";
  link.title = `Clique para ir para o profile.`;

  const avatar = document.createElement('img');
  avatar.id = `avatar${index + 1}`;
  avatar.alt = 'Avatar do usuário';

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

  return profile;
}
