declare namespace Database {
  /**
   * Typings for objects within the contents array of background databses.
   */
  interface File {
    readonly type: string;
    readonly name: string;
  }
  /**
   * Typings for the parent object in databases where there are multiple directories.
   */
  interface ParentObj {
    readonly type: string;
    readonly name: string;
    contents: Obj1[];
  }
  /**
   * Typings for the parent object (if exists) in databases.
   * @see Database.File for info about the contents array.
   */
  interface Obj1 {
    readonly type: string;
    readonly name: string;
    contents: File[];
  }
  /**
   * Typings for the secondary parent object in databases (unused).
   */
  interface Obj2 {
    readonly type: string;
    readonly directories: number;
    readonly files: number;
  }
}

export namespace Background {
  /**
   * Terminal-generarted tree structure for background databases using `tree [directory_path] -J > [output_path]` command.
   * The key is the name of the directory, and the value is an array of two objects:
   * the first is the parent object containing the contents array,
   * and the second is an object containing metadata about the directory.
   */
  type DatabaseStructure = { [key: string]: [Database.Obj1, Database.Obj2] };

  /**
   * The configuration object for the background object.
   * Contains the element to which the background will be applied, the database of backgrounds,
   * and the list of branch names from switch-album that match the database keys.
   * @see DatabaseStructure for info about database structure.  haha
   */
  interface Config {
    /**
     * The element to which the background will be applied; the `body` element of the page.
     */
    elem: HTMLBodyElement;
    /**
     * The database of backgrounds, generated from the terminal command `tree [directory_path] -J > [output_path]` and imported as a JSON file.
     */
    db: DatabaseStructure;
    /**
     * The list of branch names from switch-album that match the database keys.
     * This is used to determine which backgrounds to display for each branch.
     */
    game: (keyof DatabaseStructure)[];
  }
}

export namespace Music {
  /**
   * Terminal-generarted tree structure for the music database using `tree [directory_path] -J > [output_path]` command.
   * The key is the name of the directory, and the value is an array of two objects:
   * the first is the parent object containing the contents array,
   * and the second is an object containing metadata about the directory.
   */
  type DatabaseStructure = [Database.ParentObj, Database.Obj2];
  /**
   * The configuration object for the music object.
   * Contains the element to which the audio will be applied, the database of soundtracks,
   * and the list of option groups in the music select element.
   * @see DatabaseStructure for info about database structure.  haha
   */
  interface Config {
    _: HTMLOptGroupElement[],
    elem: HTMLAudioElement,
    srcElem: HTMLSourceElement,
    sav: {
      ss: string,
      param: string
    },
    db: DatabaseStructure,
    opt: OptSignature
  }
}

/**
 * Makes it easier to control all of the groups of option elements.
 */
type OptSignature = HTMLOptionElement[][];

export namespace Grass {
  interface Config {
    elem: HTMLDivElement,
    sav: {
      ss: string,
      param: string
    },
    db: {
      src: string[],
      name: string[]
    },
    opt: HTMLOptionElement[]
  }
}