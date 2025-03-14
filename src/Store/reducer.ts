import { CompositeLayer, ImageProject } from "../types";
import {
  Action,
  NEW_COMPOSITION,
  NEW_DOCUMENT,
  NEW_LAYER,
  EDIT_LAYER,
  EDIT_COMPOSITE_LAYER,
} from "./actions";

type T = { project: ImageProject | null };

export function rootReducer(state: T, action: Action): T {
  console.log(action.type);
  switch (action.type) {
    case NEW_DOCUMENT:
      if (!state.project) {
        return {
          ...state,
          project: {
            layers: [],
            compositions: [
              { inputs: [], operation: "source-over", parameters: {} },
            ],
            width: 512,
            height: 512,
          },
        };
      }
      break;
    case NEW_LAYER:
      if (state.project) {
        const id = getNextLayerID(state.project);

        const { width, height } = state.project;

        const newLayer = {
          id,
          name: `Layer ${id}`,
          x: 0,
          y: 0,
          width,
          height,
          ...action.payload,
        };

        const compositions = [
          {
            ...state.project.compositions[0],
            inputs: [...state.project.compositions[0].inputs, id],
          },
          ...state.project.compositions.slice(1),
        ];

        return {
          ...state,
          project: {
            ...state.project,
            layers: [
              ...state.project.layers,
              {
                ...newLayer,
                canvas: null,
              },
            ],
            compositions,
          },
        };
      }
      break;
    case NEW_COMPOSITION:
      return {
        ...state,
        project: state.project && {
          ...state.project,
          compositions: [
            ...state.project.compositions,
            { inputs: [], operation: "source-over", parameters: {} },
          ],
        },
      };

    case EDIT_LAYER:
      return {
        ...state,
        project: state.project && {
          ...state.project,
          layers: state.project.layers.map((l) =>
            l.id === action.payload.layerID
              ? {
                  ...l,
                  ...action.payload.properties,
                }
              : l
          ),
        },
      };

    case EDIT_COMPOSITE_LAYER:
      return {
        ...state,
        project: state.project && {
          ...state.project,
          compositions: replaceComposition(
            state.project.compositions,
            action.payload.compositeLayer,
            action.payload.properties
          ),
        },
      };
  }
  return state;
}

function getNextLayerID(project: ImageProject) {
  return Math.max(...project.layers.map((l) => l.id), 0) + 1;
}

function replaceComposition(
  compositions: CompositeLayer[],
  compositeLayer: CompositeLayer,
  properties: Partial<Omit<CompositeLayer, "inputs">>
): CompositeLayer[] {
  return compositions.map((c) => {
    if (c === compositeLayer) {
      return { ...compositeLayer, ...properties };
    }
    return {
      ...c,
      inputs: replaceCompositionInner(c.inputs, compositeLayer, properties),
    };
  });
}

function replaceCompositionInner(
  compositions: (CompositeLayer | number)[],
  compositeLayer: CompositeLayer,
  properties: Partial<Omit<CompositeLayer, "inputs">>
): (CompositeLayer | number)[] {
  return compositions.map((c) => {
    if (typeof c === "number") {
      return c;
    }
    if (c === compositeLayer) {
      return { ...compositeLayer, ...properties };
    }
    return {
      ...c,
      inputs: replaceCompositionInner(c.inputs, compositeLayer, properties),
    };
  });
}
