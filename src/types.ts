export interface ImageProject {
    layers: Layer[];
    inputs: InputProperties[];
    width: number;
    height: number;
    compositions: number[];
}

type Point = [number, number];

export type Layer = BaseLayer | CompositeLayer;

export interface BaseLayer {
    id: number;
    name: string;
    width: number;
    height: number;
    canvas: HTMLCanvasElement | null;
}

export type Quad = [Point, Point, Point, Point];

export interface InputProperties {
    inputID: number;
    id: number;
    enabled: boolean;
    transform: DOMMatrix2DInit;
    operation: GlobalCompositeOperation;
    filter: string;
    parameters: object;
    nonLinear: Quad;
}

export interface CompositeLayer {
    id: number;
    name: string;
    width: number;
    height: number;
    inputs: number[];
}

export interface ToolOptions {
    color: string;
    fillAlpha: number;
    strokeColor: string;
    strokeAlpha: number;
    fillStroke: "fill" | "stroke" | "both";
    size: number;
    shape: "circle" | "rectangle" | "triangle";
    lineCap: CanvasLineCap;
}

export type UIState = {
    tool: string;
    toolOptions: ToolOptions;
    ribbon: {
        selectedTabID: string;
    };
    layers: {
        activeLayerID: number;
    };
    inputs: {
        selectedInput: number;
    };
};