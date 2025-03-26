export interface ImageProject {
    layers: Layer[];
    width: number;
    height: number;
    compositions: number[];
}

export type Layer = BaseLayer | CompositeLayer;

export interface BaseLayer {
    id: number;
    name: string;
    width: number;
    height: number;
    canvas: HTMLCanvasElement | null;
    history: {
        canvases: HTMLCanvasElement[];
        index: number;
    };
}

export interface InputProperties {
    id: number;
    enabled: boolean;
    transform: DOMMatrix2DInit;
    operation: GlobalCompositeOperation;
    filter: string;
    parameters: object;
}

export interface CompositeLayer {
    id: number;
    name: string;
    width: number;
    height: number;
    inputs: InputProperties[];
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
        selectedPath: number[];
    };
};