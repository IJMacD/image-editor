import { ImageProject } from "./types";

export class ImageProjectRenderer {
  #cache = new WeakMap();

  renderProject(project: ImageProject) {
    if (!this.#cache.has(project)) {
      this.#cache.set(project, null);
    }

    return this.#cache.get(project);
  }

  renderComposition() {}
}

// export class ImageProject {
//   #nextLayerID = 1;
//   #layers = [] as Layer[];

//   compositions = [] as Composition[];

//   newLayer(name = "") {
//     const id = this.#nextLayerID++;
//     this.#layers.push(new Layer(id, name || `Layer ${id}`));
//   }

//   get layers() {
//     return this.#layers;
//   }

//   get output() {
//     return null;
//   }
// }

// class Layer {
//   id: number;
//   name: string;

//   constructor(id: number, name: string) {
//     this.id = id;
//     this.name = name;
//   }
// }

// class Composition {}
