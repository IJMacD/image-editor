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

    mouseDown(mousePos: Point, mouseEvent: MouseEvent) {
        this.#firstPoint = mousePos;
        this.#prevPoint = mousePos;
    }

    mouseMove(mousePos: Point, mouseEvent: MouseEvent) {
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
                const toolStrokeColor = this.#toolOptions.strokeColor;
                const toolSize = this.#toolOptions.size;

                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(mousePos.x, mousePos.y);

                ctx.strokeStyle = toolStrokeColor;
                ctx.lineWidth = toolSize;
                ctx.lineCap = "round"
                ctx.stroke();
            }
                break;
            case "shapes": {
                const toolFillColor = this.#toolOptions.color;
                const toolStrokeColor = this.#toolOptions.strokeColor;
                const toolSize = this.#toolOptions.size;

                const isFill = ["fill", "both"].includes(
                  this.#toolOptions.fillStroke
                );
                const isStroke = ["stroke", "both"].includes(
                  this.#toolOptions.fillStroke
                );
                const shape = this.#toolOptions.shape;

                oCtx.clearRect(
                    0,
                    0,
                    this.#overlayCanvas.width,
                    this.#overlayCanvas.height
                );

                oCtx.fillStyle = toolFillColor;
                oCtx.strokeStyle = toolStrokeColor;
                oCtx.lineWidth = toolSize;

                const { x, y } = mousePos;
                const { x: startX, y: startY } = this.#firstPoint;
                const dx = x - startX;
                const dy = y - startY;

                if (shape === "circle") {
                    const r = Math.sqrt(dx * dx + dy * dy);
                    oCtx.beginPath();

                    if (mouseEvent.shiftKey) {
                        oCtx.arc(startX, startY, r, 0, Math.PI * 2);
                    } else {
                        oCtx.arc(
                            (startX + x) / 2,
                            (startY + y) / 2,
                            r / 2,
                            0,
                            Math.PI * 2
                        );
                    }

                    isFill && oCtx.fill();
                    isStroke && oCtx.stroke();
                } else if (shape === "rectangle") {
                    oCtx.beginPath();
                    if (mouseEvent.shiftKey) {
                        if (mouseEvent.ctrlKey) {
                            const d = (dx + dy) / 2;
                            oCtx.rect(startX - d, startY - d, d * 2, d * 2);
                        } else {
                            oCtx.rect(startX - dx, startY - dy, dx * 2, dy * 2);
                        }
                    } else {
                        if (mouseEvent.ctrlKey) {
                            const d = (dx + dy) / 2;
                            oCtx.rect(startX, startY, d, d);
                        } else {
                            oCtx.rect(startX, startY, dx, dy);
                        }
                    }

                    isFill && oCtx.fill();
                    isStroke && oCtx.stroke();
                } else if (shape === "triangle") {
                    const r = Math.sqrt(dx * dx + dy * dy);
                    const theta = Math.atan2(dy, dx);

                    oCtx.beginPath();

                    if (mouseEvent.shiftKey) {
                        oCtx.moveTo(x, y);

                        const x1 = startX + r * Math.cos(theta + (Math.PI * 2) / 3);
                        const y1 = startY + r * Math.sin(theta + (Math.PI * 2) / 3);
                        oCtx.lineTo(x1, y1);

                        const x2 = startX + r * Math.cos(theta + (Math.PI * 4) / 3);
                        const y2 = startY + r * Math.sin(theta + (Math.PI * 4) / 3);
                        oCtx.lineTo(x2, y2);
                        oCtx.closePath();
                    } else {
                        const x3 = x + r * Math.cos(theta + (Math.PI * 2) / 3);
                        const y3 = y + r * Math.sin(theta + (Math.PI * 2) / 3);
                        oCtx.moveTo(startX, startY);
                        oCtx.lineTo(x, y);
                        oCtx.lineTo(x3, y3);
                        oCtx.closePath();
                    }

                    isFill && oCtx.fill();
                    isStroke && oCtx.stroke();
                }
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
