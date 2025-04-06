import { CompositeLayer, ImageProject } from "../types";
import { getLayerByID, isCompositeLayer } from "../util/project";

const customFilters = {
    red: () =>
        `<feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0    1 0 0 0 0    1 0 0 0 0    0 0 0 1 0" />`,
    extractRed: () =>
        `<feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0    0 0 0 0 0    0 0 0 0 0    0 0 0 1 0" />`,
    green: () =>
        `<feColorMatrix in="SourceGraphic" type="matrix" values="0 1 0 0 0    0 1 0 0 0    0 1 0 0 0    0 0 0 1 0" />`,
    extractGreen: () =>
        `<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0    0 1 0 0 0    0 0 0 0 0    0 0 0 1 0" />`,
    blue: () =>
        `<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 1 0 0    0 0 1 0 0    0 0 1 0 0    0 0 0 1 0" />`,
    extractBlue: () =>
        `<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0    0 0 0 0 0    0 0 1 0 0    0 0 0 1 0" />`,
    convolve: (m: string) => `<feConvolveMatrix kernelMatrix="${m}" />`,
    emboss: () => `<feConvolveMatrix kernelMatrix="-2 -1 0 -1 1 1 0 1 2" />`,
    edge: () => `<feConvolveMatrix kernelMatrix="0 -1 0 -1 4 -1 0 -1 0" />`,
    edge2: () =>
        `<feConvolveMatrix kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" />`,
    sharpen: () => `<feConvolveMatrix kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" />`,
    threshold: (x: string) => {
        const n = parseInt(x);
        const table = "0 ".repeat(n) + "1 ".repeat(256 - n);
        return `<feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="discrete" tableValues="${table}"/><feFuncG type="discrete" tableValues="${table}"/><feFuncB type="discrete" tableValues="${table}"/></feComponentTransfer>`;
    },
    luminanceToAlpha: () =>
        `<feColorMatrix type="matrix" values="0 0 0 0 0    0 0 0 0 0    0 0 0 0 0    0.2126 0.7152 0.0722 0 0" />`,
    // Implement shorthand filters from here:
    //  https://www.w3.org/TR/filter-effects-1/#ShorthandEquivalents
    grayscale: (x: string) => {
        const n = 1 - parseFloat(x);
        return `<feColorMatrix type="matrix" values="${0.2126 + 0.7874 * n} ${
            0.7152 - 0.7152 * n
        } ${0.0722 - 0.0722 * n} 0 0 ${0.2126 - 0.2126 * n} ${
            0.7152 + 0.2848 * n
        } ${0.0722 - 0.0722 * n} 0 0 ${0.2126 - 0.2126 * n} ${
            0.7152 - 0.7152 * n
        } ${0.0722 + 0.9278 * n} 0 0 0 0 0 1 0"/>`;
    },
    invert: () =>
        `<feComponentTransfer><feFuncR type="table" tableValues="1 0"/><feFuncG type="table" tableValues="1 0"/><feFuncB type="table" tableValues="1 0"/></feComponentTransfer>`,
    brightness: (x: string) => {
        return `<feComponentTransfer><feFuncR type="linear" slope="${x}"/><feFuncG type="linear" slope="${x}"/><feFuncB type="linear" slope="${x}"/></feComponentTransfer>`;
    },
    contrast: (x: string) => {
        const n = parseFloat(x);
        return `<feComponentTransfer><feFuncR type="linear" slope="${n}" intercept="${
            -(0.5 * n) + 0.5
        }"/><feFuncG type="linear" slope="${n}" intercept="${
            -(0.5 * n) + 0.5
        }"/><feFuncB type="linear" slope="${n}" intercept="${
            -(0.5 * n) + 0.5
        }"/></feComponentTransfer>`;
    },
    blur: (x: string) =>
        `<filter id="blur"><feGaussianBlur stdDeviation="${x}" edgeMode="duplicate" ></filter>`,
} as { [name: string]: (...args: string[]) => string };
type CustomFilter = keyof typeof customFilters;

export function renderToCanvas(
    canvas: HTMLCanvasElement,
    layer: CompositeLayer,
    project: ImageProject
) {
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = layer.width;
    canvas.height = layer.height;

    for (const c of layer.inputs) {
        const layer = getLayerByID(project.layers, c.id);
        ctx.globalCompositeOperation = c.operation;

        ctx.filter = makeFilter(c.filter);

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

function makeFilter(filterText: string) {
    if (!filterText) {
        return "none";
    }

    const matches = filterText.matchAll(/([a-z0-9-]+)\(([^)]*)\)/gi);

    return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="filter">${[
        ...matches,
    ]
        .map(([_, name, args]) => {
            if (name in customFilters) {
                const fn = customFilters[name as CustomFilter];
                return fn.apply(null, args.split(","));
            }
            return "";
        })
        .join(" ")}</filter></svg>#filter')`;
}
