const music = document.getElementById("music");
async function fetchDB(filename) {
    try {
        const res = await fetch(`/app/databases/${filename}.json`);
        const data = await res.text();
        return JSON.parse(data);
    }
    catch (e) {
        console.error(`Error fetching ${filename}.json: ${e}`);
        return {};
    }
}
function flipNum(n) {
    if (n === 0)
        return 1;
    if (n === 1)
        return 0;
    else
        throw new ReferenceError("Input must be 0 or 1.");
}
function copyLink(url) {
    navigator.clipboard.writeText(url)
        .then(() => {
        console.log("📋Added to clipboard:", url);
        alert(`Copied link: ${url}`);
    })
        .catch(e => {
        console.error("Error copying to clipboard:", e);
        throw e;
    });
}
class SavUtils {
    getSS(key) {
        return sessionStorage.getItem(key);
    }
    setSS(key, value) {
        sessionStorage.setItem(key, value);
    }
    getParam(name) {
        return new URL(window.location.href).searchParams.get(name);
    }
    setParam(name, value) {
        new URL(window.location.href).searchParams.set(name, value);
    }
}
export { SavUtils, copyLink, fetchDB, flipNum, music };
//# sourceMappingURL=core.js.map