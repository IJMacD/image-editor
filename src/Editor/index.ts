import { defaultUIState } from "../Store/ui/reducer";

type Point = { x: number, y: number };

export class Editor {
    #canvas: HTMLCanvasElement | null = null;
    #overlayCanvas: HTMLCanvasElement | null = null;

    #tool = "";
    #toolOptions: typeof defaultUIState.toolOptions | null = null;

    #firstPoint: Point = { x: 0, y: 0 };
    #prevPoint: Point = { x: 0, y: 0 };

    setCanvases(canvas: HTMLCanvasElement | null, overlayCanvas: HTMLCanvasElement | null) {
        this.#canvas = canvas;
        this.#overlayCanvas = overlayCanvas;
    }

    setTool(tool: string, toolOptions: typeof defaultUIState.toolOptions) {
        this.#tool = tool;
        this.#toolOptions = toolOptions;
    }

    mouseDown(mousePos: Point) {
        this.#firstPoint = mousePos;
        this.#prevPoint = mousePos;
    }

    mouseMove(mousePos: Point) {
        if (!this.#canvas || !this.#overlayCanvas) {
            return;
        }

        const ctx = this.#canvas.getContext("2d");
        const oCtx = this.#overlayCanvas.getContext("2d");

        if (!ctx || !oCtx) {
            return;
        }

        if (!this.#toolOptions) {
            return;
        }

        const { x: prevX, y: prevY } = this.#prevPoint

        switch (this.#tool) {
            case "pencil": {
                const toolColor = this.#toolOptions.color;
                const toolSize = this.#toolOptions.size;

                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(mousePos.x, mousePos.y);

                ctx.strokeStyle = toolColor;
                ctx.lineWidth = toolSize;
                ctx.lineCap = "round"
                ctx.stroke();
            }
                break;
            case "shapes": {
                const toolColor = this.#toolOptions.color;

                oCtx.clearRect(0, 0, this.#overlayCanvas.width, this.#overlayCanvas.height);

                const { x, y } = this.#firstPoint;

                const dx = x - prevX;
                const dy = y - prevY;

                const r = Math.sqrt(dx * dx + dy * dy);

                oCtx.beginPath();

                oCtx.arc(x, y, r, 0, Math.PI * 2);
                oCtx.fillStyle = toolColor;
                oCtx.fill();
            }

        }


        this.#prevPoint = mousePos;
    }

    mouseUp() {
        if (!this.#canvas || !this.#overlayCanvas) {
            return;
        }

        if (this.#tool === "shapes") {
            const ctx = this.#canvas.getContext("2d");

            if (!ctx) {
                return
            }

            ctx.drawImage(this.#overlayCanvas, 0, 0);
        }

        const { width, height } = this.#overlayCanvas;
        this.#overlayCanvas?.getContext("2d")?.clearRect(0, 0, width, height);
    }
}