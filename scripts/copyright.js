var
    cr = document.getElementById('copyright'),
    cr_content = document.createElement('h3'),
    license = document.createElement('a');

license.target = '_blank';
license.href = 'https://github.com/Reper2/reper2.github.io/blob/master/LICENSE';

cr_content.innerHTML = '(c) 2022 Reper2';

license.appendChild(cr_content);
cr.appendChild(license);

console.log('Added copyright information to page.');