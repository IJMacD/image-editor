export interface ImageProject {
  layers: Layer[];
  width: number;
  height: number;
  compositions: CompositeLayer[];
}

export interface Layer {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  canvas: HTMLCanvasElement | null;
}

export interface CompositeLayer {
  inputs: (CompositeLayer | number)[];
  operation: GlobalCompositeOperation;
  parameters: object;
}
