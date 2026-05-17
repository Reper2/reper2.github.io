# Frosty Volcano Summit
![logo](/images/logo.png)  

My website includes a library of all my publically realeased software, lots of customisation features to enhance your experience on the website, a bit of info about me, a handful of key binds for your accessibility, Easter eggs to find and collect, and a couple of social links.

## Easter Eggs! [26.5.0 Beta]
![eggbox](/images/hidden_block.png)
I have started hiding Easter eggs across my websites. For now, there is no pleasing reward yet when you find them all, but you can have some fun clicking them. I have made it as hard as possible to cheat/hack, and designed it so it would be faster for you to collect all the eggs than to learn and cheat the system. More info on this will be available when it is finished. My Animal Crossing website is still yet to have a massive update and a Tomodachi Life project will be released in a few months. ACNH apps will have eggs added to a few pages.
The eggs system is made up of canonical strings, which are hashed and used to attempt to decrypt the reward. The final object of all eggs being collected is the encryption/decryption key, with the auth tag of course. The compiled JavaScript is obfuscated so that it is almost impossible to hack on the website itself. The code is compact and self-defending. Any tricks to prettify the code will cause it to crash or enter an infinite loop.
Regions of the website with eggs currently hidden: base website, Desktop Clock, Mobile Clock

## Clocks
I have published [mobile](https://github.com/Reper2/mobile-clock) and [desktop](https://github.com/Reper2/desktop-clock) clocks. Try them out! The mobile clock is really nice to have in the background when you're working as it uses real photos I've taken on holidays, and besides the gradient animation on the text, the clock is unlikely to distract you. The desktop clock on the other hand can be great to use on your tv or monitor while you're gaming. Unless you are immune to wanting to play video games when you see video game content, it's best not to use this one when you're focusing.

## Backgrounds
The backgrounds on this website, among some of my others, are fetched from [switch-album](https://github.com/Reper2/switch-album)

## Progressive Web App functionality
If your browser supports it, you can install the web app and hop on the website offline. Only cached backgrounds will load without an internet connection though, as they are fetched, rather than pre-cached in the service worker.

## Music
All soundtracks and Animal Crossing terrain textures present on the website are owned by [Nintendo](https://www.nintendo.com/au/).