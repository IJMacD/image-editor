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
}

export interface CompositeLayer {
  id: number;
  name: string;
  width: number;
  height: number;
  inputs: {
    id: number;
    x: number;
    y: number;
    enabled: boolean;
    operation: GlobalCompositeOperation;
    parameters: object;
  }[];
}