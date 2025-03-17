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
