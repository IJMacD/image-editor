import { CompositeLayer, ImageProject } from "../types";
import { getLayerByID, isCompositeLayer } from "../util/project";

const builtinFilterTypes = [
    "url",
    "blur",
    "brightness",
    "contrast",
    "drop-shadow",
    "grayscale",
    "hue-rotate",
    "invert",
    "opacity",
    "saturate",
    "sepia",
    "none",
] as const;
type BuiltinFilterType = (typeof builtinFilterTypes)[number];

const customFilters = {
    red: () =>
        `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="red"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0    1 0 0 0 0    1 0 0 0 0    0 0 0 1 0" /></svg>#red')`,
    green: () =>
        `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="green"><feColorMatrix in="SourceGraphic" type="matrix" values="0 1 0 0 0    0 1 0 0 0    0 1 0 0 0    0 0 0 1 0" /></svg>#green')`,
    blue: () =>
        `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="blue"><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 1 0 0    0 0 1 0 0    0 0 1 0 0    0 0 0 1 0" /></svg>#blue')`,
    convolve: (m: string) =>
        `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="convolve"><feConvolveMatrix kernelMatrix="${m}" /></svg>#convolve')`,
    emboss: () =>
        `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="emboss"><feConvolveMatrix kernelMatrix="-2 -1 0 -1 1 1 0 1 2" /></svg>#emboss')`,
    edge: () =>
        `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="edge"><feConvolveMatrix kernelMatrix="0 -1 0 -1 4 -1 0 -1 0" /></svg>#edge')`,
    edge2: () =>
        `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="edge2"><feConvolveMatrix kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" /></svg>#edge2')`,
    sharpen: () =>
        `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="sharpen"><feConvolveMatrix kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" /></svg>#sharpen')`,
    threshold: (x: string) => {
        const n = parseInt(x);
        const table = "0 ".repeat(n) + "1 ".repeat(100 - n);
        return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="threshold"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="discrete" tableValues="${table}"/><feFuncG type="discrete" tableValues="${table}"/><feFuncB type="discrete" tableValues="${table}"/></feComponentTransfer></svg>#threshold')`;
    },
} as { [name: string]: (...args: string[]) => string };
type CustomFilter = keyof typeof customFilters;

export function renderToCanvas(
    canvas: HTMLCanvasElement,
    layer: CompositeLayer,
    project: ImageProject
) {
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    for (const c of layer.inputs) {
        const layer = getLayerByID(project.layers, c.id);
        ctx.globalCompositeOperation = c.operation;

        ctx.filter = c.filter
            ? c.filter.replace(
                  /([a-z0-9-]+)\(([^)]*)\)/g,
                  (filter, name, args) => {
                      if (name in customFilters) {
                          const fn = customFilters[name as CustomFilter];
                          return fn.apply(null, args.split(","));
                      }
                      return filter;
                  }
              )
            : "none";

        ctx.setTransform(c.transform);

        if (c.enabled && layer) {
            if (isCompositeLayer(layer)) {
                const subCanvas = document.createElement("canvas");
                subCanvas.width = layer.width;
                subCanvas.height = layer.height;
                renderToCanvas(subCanvas, layer, project);
                ctx.drawImage(subCanvas, 0, 0);
            } else if (layer.canvas) {
                ctx.drawImage(layer.canvas, 0, 0);
            }
        }
    }
}

function isBuiltinFilter(filter: string): filter is BuiltinFilterType {
    // return builtinFilterTypes.includes(filter);
    return builtinFilterTypes.some((f) => f === filter);
}
