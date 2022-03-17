/* script optimisation: ioanm.ro */

$(document).ready(function(){
    const num_images = 45;

    var randomNumber = Math.floor(Math.random() * num_images);
    var link = "bg/" + String(randomNumber).padStart(3, '0') + ".jpg";
    var bgImg = 'url(' + link + ')';

    $('body').css({
        'background-image': bgImg,
        'background-position': 'center center',
        'background-repeat': 'no-repeat no-repeat',
        'background-size': 'cover',
    });

    console.log(`🔀Page background has been randomised to ${bgImg} from refresh!`);
});