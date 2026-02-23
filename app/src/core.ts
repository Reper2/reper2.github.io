/**
 * Global constant for accessing `music`.
 */
const music = <HTMLAudioElement>document.getElementById("music");

/**
 * Asynchronously fetch the contents of a json file.
 * @param filename Name of json file without extension.
 * @returns Promise with type \<T\> of the parsed json or empty object if error.
 * @throws an error if the json cannot be found or other issue.
 */
async function fetchDB<T>(filename: string): Promise<T> {
  try {
    const res = await fetch(`/app/databases/${filename}.json`);
    const data = await res.text();
    return <T>JSON.parse(data);
  } catch (e) {
    console.error(`Error fetching ${filename}.json: ${e}`);
    return {} as T;
  }
}

/**
 * Flips 0 or 1 to its opposite.
 * @param n Number to be flipped.
 */
function flipNum(n: number): 0 | 1 {
  if (n === 0)
    return 1;
  if (n === 1)
    return 0;
  else throw new ReferenceError("Input must be 0 or 1.");
}

/**
 * Copies link to clipboard.
 * @param url Uniform Resource Locator to be copied to clipboard.
 */
function copyLink(url: string): void {
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

/**
 * Aliases for getting/setting session storage and url parameter data.
 */
class SavUtils {
  /**
	 * Alias of `sessionStorage.getItem()`
	 * @param key Item to get from session storage.
	 * @returns Value of the item.
	 */
  getSS(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  /**
	 * Alias of `sessionStorage.setItem()`
	 * @param key Identifier for the item.
	 * @param value Value of specified item.
	 */
  setSS(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  /**
	 * Alias of `new URL().searchParams.get()`
	 * @param name Name of the parameter to search for in the url.
	 * @returns Value of specified parameter.
	 */
  getParam(name: string): string | null {
    return new URL(window.location.href).searchParams.get(name);
  }

  /**
	 * Alias of `new URL().searchParams.set()`
	 * @param name Name of parameter to search for in the url.
	 * @param value Value to set to the specified parameter.
	 */
  setParam(name: string, value: string): void {
    new URL(window.location.href).searchParams.set(name, value);
  }
}

export { SavUtils, copyLink, fetchDB, flipNum, music };