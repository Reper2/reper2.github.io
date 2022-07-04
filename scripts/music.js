const
    music = document.getElementById('music'),
	musicSrc = document.createElement('source');
music.controls = 'true';
music.autoplay = 'true';
music.loop = 'true';
music.preload = 'auto';
music.style.display = 'none';
if (music.paused) {
    music.play();
};
musicSrc.type = 'audio/mpeg';

var
    num = Math.floor(Math.random() * 50),
    link = `/assets/music/${String(num).padStart(2, '0')}.mp3`;
if (num == 0) {
    console.log('Returned 0, reloading page...');
    window.location.reload;
} else {
    $(document).ready(function () {
        musicSrc.src = link;
        music.appendChild(musicSrc);
        console.log('Added music to page.');
    })
};