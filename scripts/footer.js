let
    footer = document.getElementById('footer'),
    hashLink = document.createElement('a'),
    content = document.createElement('h3'),
    br = document.createElement('br'),

    dis = document.createElement('a'),
    yt = document.createElement('a'),
    gh = document.createElement('a'),

    disLogo = document.createElement('img'),
    ytLogo = document.createElement('img'),
    ghLogo = document.createElement('span');

hashLink.href = '#footer';

dis.target = '_blank';
dis.href = '/reper2niverse/?utm_source=reper2-site&utm_medium=social-link';
disLogo.src = '/assets/social-logos/discord.svg';
disLogo.style.width = '12vmin';
dis.appendChild(disLogo);
content.appendChild(dis);

content.append('\u00A0');

yt.target = '_blank';
yt.href = 'https://www.youtube.com/channel/UCofCDfLjs_TkiC-p0-k_9XA';
ytLogo.src = '/assets/social-logos/youtube.svg';
ytLogo.style.width = '15vmin';
yt.appendChild(ytLogo);
content.appendChild(yt);

content.append('\u00A0');

gh.target = '_blank';
gh.href = 'https://github.com/Reper2';
ghLogo.className = 'iconify';
ghLogo.dataset.icon = 'octicon:mark-github-16';
ghLogo.dataset.width = '50';
gh.appendChild(ghLogo);
content.appendChild(gh);

hashLink.appendChild(content);
footer.appendChild(hashLink);

console.log('Added social links to page.');