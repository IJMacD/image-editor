import { ImageProject, Layer } from "../types";
import {
    getCompositeLayerByID,
    getLayerByID,
    isCompositeLayer,
} from "./project";

export function pathsEqual<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

export function getInputByID(project: ImageProject | null, id: number) {
    return project?.inputs.find((input) => input.inputID === id);
}

export function getLayerByPath(project: ImageProject | null, path: number[]) {
    if (!project) {
        return undefined;
    }

    const ids = pathToIDs(project, path);

    if (!ids) {
        return undefined;
    }

    return getLayerByID(project.layers, ids[ids.length - 1]);
}

export function isLayerOnPath(
    project: ImageProject | null,
    path: number[],
    layer: Layer | undefined
) {
    if (!project || !layer) {
        return false;
    }

    const ids = pathToIDs(project, path) || [];

    return ids.includes(layer.id);
}

export function getPathParentAndIndex(
    project: ImageProject | null,
    path: number[]
): { id: number | undefined; index: number | undefined } {
    if (!project) {
        return { id: undefined, index: undefined };
    }

    const ids = pathToIDs(project, path);

    if (!ids) {
        return { id: undefined, index: undefined };
    }

    const parentID = ids[ids.length - 2];
    const index = path[path.length - 1];

    return { id: parentID, index };
}

export function pathToIDs(project: ImageProject | null, path: number[]) {
    if (!project) {
        return undefined;
    }

    // Check top level compositions first
    const [compositionIndex, ...p] = path;

    const id =
        typeof compositionIndex === "number" &&
        project.compositions[compositionIndex];

    if (typeof id !== "number") {
        return undefined;
    }

    const out = [id];

    let currentLayer = getLayerByID(project.layers, id);

    if (!isCompositeLayer(currentLayer)) {
        return undefined;
    }

    for (const index of p) {
        if (isCompositeLayer(currentLayer)) {
            const id = currentLayer.inputs[index]?.id;

            out.push(id);

            currentLayer = getLayerByID(project.layers, id);
        }
    }

    return out;
}
