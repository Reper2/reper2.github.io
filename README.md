# Frosty Volcano Summit
![logo](/images/logo.png)  

My website includes a library of all my publically realeased software, lots of customisation features to enhance your experience on the website, a bit of info about me, a handful of key binds for your accessibility, Easter eggs to find and collect, and a couple of social links.

## 🎨 NEW Zelda Theme
A Zelda theme is now available by default, and you can tap the Toggle Theme button to revert to the original theme. The original theme is much more relaxed and readable, however the new sound effects are exclusive to the Zelda theme. Try out the Random button, the Set button and clicking some eggs, for examples of these sound effects! The original theme is set by default when you find all the eggs, as the premium version of the website was made for the original theme, and does not overlap with the Zelda theme well. You can still toggle back to the Zelda theme, but the buttons will be rectangle blocks instead of nice rounded buttons.

## 🥚 Easter Eggs! [26.5.0 Beta]
I have started hiding Easter eggs across my websites. If you find all the eggs, you will unlock a premium version of the website that shows off Frosty Volcano Summit's true personality. As more eggs are added, your access to the premium version will be revoked until you find the new ones. I have made it as hard as possible to cheat/hack, and designed it so it would be faster for you to collect all the eggs than to learn and cheat the system. More info on this will be available when it is finished. My Animal Crossing website is still yet to have a massive update and a Tomodachi Life project will be released in a few months. ACNH apps will have eggs added to a few pages.
The eggs system is made up of canonical strings, which are hashed and used to attempt to decrypt the reward. The final object of all eggs being collected is the encryption/decryption key, with the auth tag of course. The compiled JavaScript is obfuscated so that it is almost impossible to hack on the website itself. The code is compact and self-defending. Any tricks to prettify the code will cause it to crash or enter an infinite loop.
Regions of the website with eggs currently hidden: base website, Desktop Clock, Mobile Clock

## ⌨️ Accessibility & Keybinds

The website features native desktop shortcut mapping to streamline navigation, trigger interactions, and manage application controls globally:

| Key Binding | Action Triggered |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>/</kbd> | Open Keybind List |
| <kbd>Alt</kbd> + <kbd>S</kbd> | Show Audio Controls |
| <kbd>Alt</kbd> + <kbd>H</kbd> | Hide Audio Controls |
| <kbd>Ctrl</kbd> + <kbd>I</kbd> | Install Web App (PWA) |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | Copy Site Link |
| <kbd>Alt</kbd> + <kbd>L</kbd> | View Project License |
| <kbd>Enter</kbd> | Confirm Current Selection |
| <kbd>Alt</kbd> + <kbd>R</kbd> | Reset Current Selection |
| <kbd>?</kbd> | Randomize Selection |
| <kbd>X</kbd> | Open Source Code Repository |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | Reset All Found Easter Eggs |

*Note: Some regions of the keybind screen may contain hidden anomalies. Keep an eye out for hidden blocks while browsing your shortcuts!*

## 📱 Progressive Web App Functionality
If your browser supports it, you can install the web app and hop on the website offline. Only cached backgrounds will load without an internet connection though, as they are fetched, rather than pre-cached in the service worker.

## 🖼️ Backgrounds
The backgrounds on this website, among some of my others, are fetched from [switch-album](https://github.com/Reper2/switch-album)

## Music Architecture & Streaming Engine

To maintain high-fidelity audio without bloating the initial application bundle or overwhelming server bandwidth, the soundtrack is archived within a single **1.49GB** compressed file located at `/assets/music.zip`. 

### On-Demand Extraction
Instead of downloading and decompressing the entire ZIP archive into memory (which would cause mobile and desktop browsers to crash), the application utilizes a surgical streaming interface powered by `@zip.js/zip.js`. 

1. **HTTP Range Requests:** When a user selects a track, an `HttpReader` targets the precise byte coordinates of that specific file within the central directory of the remote ZIP.
2. **Runtime Slicing:** Only the requested byte fragments are pulled over the network.
3. **Blob Mapping:** The raw decompressed audio bytes are converted into an isolated in-memory `Blob` and exposed via `URL.createObjectURL()` for immediate playback.

### Optimal Audio Caching
To ensure flawless performance and offline capability, caching is split into a cooperative network-and-application layer configuration:

* **Service Worker Layer (Workbox):** The Service Worker is explicitly configured with a `CacheFirst` strategy that targets `/assets/music.zip`. Crucially, it includes a `RangeRequestsPlugin` and supports HTTP `206 Partial Content` statuses. This allows the browser to safely cache and reuse the exact byte segments already fetched by the player.
* **Storage Optimization:** To prevent user storage from being overwhelmed, a strict expiration policy retains a maximum of **5 distinct range chunk structures** at any given time, automatically recycling the oldest entries to keep the application footprint lean.

## ⏰ Clocks
I have published [mobile](https://github.com/Reper2/mobile-clock) and [desktop](https://github.com/Reper2/desktop-clock) clocks. Try them out! The mobile clock is really nice to have in the background when you're working as it uses real photos I've taken on holidays, and besides the gradient animation on the text, the clock is unlikely to distract you. The desktop clock on the other hand can be great to use on your tv or monitor while you're gaming. Unless you are immune to wanting to play video games when you see video game content, it's best not to use this one when you're focusing.

## ⚖️ Legal & Disclaimer
This is a non-commercial, fan-made passion project. 
* All game soundtracks, character assets, and Animal Crossing terrain textures present on this website are properties and intellectual intellectual property of **[Nintendo Co., Ltd.](https://www.nintendo.com/)**
* No copyright infringement is intended. All original source materials belong to their respective owners.