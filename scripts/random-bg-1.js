$(document).ready(function(){
    var images = [
        'bg/001.jpg',
        'bg/002.jpg',
        'bg/003.jpg',
        'bg/004.jpg',
        'bg/005.jpg',
        'bg/006.jpg',
        'bg/007.jpg',
        'bg/008.jpg',
        'bg/009.jpg',
        'bg/010.jpg',
        'bg/011.jpg',
        'bg/012.jpg',
        'bg/013.jpg',
        'bg/014.jpg',
        'bg/015.jpg',
        'bg/016.jpg',
        'bg/017.jpg',
        'bg/018.jpg',
        'bg/019.jpg',
        'bg/020.jpg',
        'bg/022.jpg',
        'bg/023.jpg',
        'bg/024.jpg',
        'bg/025.jpg',
        'bg/026.jpg',
        'bg/027.jpg',
        'bg/028.jpg',
        'bg/029.jpg',
        'bg/030.jpg',
        'bg/031.jpg',
        'bg/032.jpg',
        'bg/033.jpg',
        'bg/034.jpg',
        'bg/035.jpg',
        'bg/036.jpg',
        'bg/037.jpg',
        'bg/038.jpg',
        'bg/039.jpg',
        'bg/040.jpg',
        'bg/041.jpg',
        'bg/042.jpg',
        'bg/043.jpg',
        'bg/044.jpg',
        'bg/045.jpg',
    ];

    var randomNumber = Math.floor(Math.random() * images.length);
    var bgImg = 'url(' + images[randomNumber] + ')';

    $('body').css({
        'background-image': bgImg,
        'background-position': 'center center',
        'background-repeat': 'no-repeat no-repeat',
        'background-size': 'cover',
    });

    console.log('🔀Page background has been randomised from refresh!');
});