import { defaultUIState } from "../Store/ui/reducer";

type Point = { x: number, y: number };

export class Editor {
    #targetCanvas: HTMLCanvasElement | null = null;
    #workingCanvas: HTMLCanvasElement | null = null;

    #tool = "";
    #toolOptions = defaultUIState.toolOptions;

    #firstPoint: Point = { x: 0, y: 0 };
    #prevPoint: Point = { x: 0, y: 0 };

    #currentPath: Point[] = [];

    #transform = new DOMMatrix([1, 0, 0, 1, 0, 0]) as DOMMatrix2DInit;

    setCanvases(
        targetCanvas: HTMLCanvasElement | null,
        workingCanvas: HTMLCanvasElement | null
    ) {
        this.#targetCanvas = targetCanvas;
        this.#workingCanvas = workingCanvas;
    }

    setTransform(transform: DOMMatrix2DInit) {
        this.#transform = transform;
    }

    setTool(tool: string, toolOptions: typeof defaultUIState.toolOptions) {
        this.#tool = tool;
        this.#toolOptions = toolOptions;
    }

    mouseDown(mousePos: Point) {
        this.#firstPoint = mousePos;
        this.#prevPoint = mousePos;

        if (this.#tool === "line") {
            this.#currentPath = [mousePos];
        }
    }

    mouseMove(mousePos: Point, mouseEvent: MouseEvent) {
        if (!this.#workingCanvas) {
            return;
        }

        const oCtx = this.#workingCanvas.getContext("2d");

        if (!oCtx) {
            return;
        }

        switch (this.#tool) {
            case "pencil":
                this.#pencil(oCtx, mousePos);
                break;
            case "shapes":
                this.#shapes(oCtx, mousePos, mouseEvent);
                break;
            case "line":
                this.#line(oCtx, mousePos, mouseEvent);
                break;
        }

        // Show indicative layer outline on working canvas
        oCtx.save()
        oCtx.setTransform(this.#transform);
        oCtx.beginPath();
        oCtx.rect(-4, -4, this.#workingCanvas.width + 8, this.#workingCanvas.height + 8);
        oCtx.strokeStyle = "#666666";
        oCtx.lineWidth = 1;
        oCtx.setLineDash([4, 4]);
        oCtx.stroke();
        oCtx.restore();

        this.#prevPoint = mousePos;
    }

    commit() {
        let returnVal = this.#targetCanvas;

        if (!this.#workingCanvas) {
            return returnVal;
        }

        if (this.#tool === "pencil" || this.#tool === "shapes" || this.#tool === "line") {
            // Create a new canvas for this commit
            const newCanvas = document.createElement("canvas");
            newCanvas.width = this.#workingCanvas.width;
            newCanvas.height = this.#workingCanvas.height;

            const ctx = newCanvas.getContext("2d");

            if (!ctx) {
                return;
            }

            // For the first drawing operation the target canvas might be null
            if (this.#targetCanvas) {
                // copy the target canvas to the new canvas
                ctx.drawImage(this.#targetCanvas, 0, 0);
            }

            // Apply the inverse transformation (which corrects the transformation if editing a composited base layer)
            const transform = DOMMatrix.fromMatrix(this.#transform).inverse()
            ctx.setTransform(transform);

            // Commit drawing from working canvas to new canvas
            ctx.drawImage(this.#workingCanvas, 0, 0);

            returnVal = newCanvas;
        }

        // Clear Working canvas
        const { width, height } = this.#workingCanvas;
        this.#workingCanvas?.getContext("2d")?.clearRect(0, 0, width, height);

        return returnVal;
    }

    #setFillAndStroke(ctx: CanvasRenderingContext2D) {
        const { color, fillAlpha, strokeColor, strokeAlpha } =
            this.#toolOptions;

        ctx.fillStyle =
            color +
            Math.floor(fillAlpha * 255)
                .toString(16)
                .padStart(2, "0");
        ctx.strokeStyle =
            strokeColor +
            Math.floor(strokeAlpha * 255)
                .toString(16)
                .padStart(2, "0");
    }

    #pencil(ctx: CanvasRenderingContext2D, pos: Point) {
        const toolSize = this.#toolOptions.size;
        const { x: prevX, y: prevY } = this.#prevPoint;

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(pos.x, pos.y);

        this.#setFillAndStroke(ctx);

        ctx.lineWidth = toolSize;
        ctx.lineCap = "round";
        ctx.stroke();
    }

    #shapes(
        oCtx: CanvasRenderingContext2D,
        pos: Point,
        mouseEvent: MouseEvent
    ) {
        const toolSize = this.#toolOptions.size;

        const isFill = ["fill", "both"].includes(this.#toolOptions.fillStroke);
        const isStroke = ["stroke", "both"].includes(
            this.#toolOptions.fillStroke
        );
        const shape = this.#toolOptions.shape;

        oCtx.clearRect(0, 0, oCtx.canvas.width, oCtx.canvas.height);

        this.#setFillAndStroke(oCtx);

        oCtx.lineWidth = toolSize;

        const { x, y } = pos;
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

            if (isFill) oCtx.fill();
            if (isStroke) oCtx.stroke();
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

            if (isFill) oCtx.fill();
            if (isStroke) oCtx.stroke();
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

            if (isFill) oCtx.fill();
            if (isStroke) oCtx.stroke();
        }
    }

    #line(
        oCtx: CanvasRenderingContext2D,
        pos: Point,
        mouseEvent: MouseEvent
    ) {
        const { size, lineCap } = this.#toolOptions;

        // const isFill = ["fill", "both"].includes(this.#toolOptions.fillStroke);
        // const isStroke = ["stroke", "both"].includes(
        //     this.#toolOptions.fillStroke
        // );

        oCtx.clearRect(0, 0, oCtx.canvas.width, oCtx.canvas.height);

        this.#setFillAndStroke(oCtx);

        oCtx.lineWidth = size;
        oCtx.lineCap = lineCap;

        oCtx.clearRect(0, 0, oCtx.canvas.width, oCtx.canvas.height);

        oCtx.beginPath();

        const { x, y } = this.#firstPoint;
        oCtx.moveTo(x, y);

        // for (const { x, y } of this.#currentPath) {
        //     oCtx.lineTo(x, y);
        // }

        if (mouseEvent.shiftKey) {
            const { x: prevX, y: prevY } = this.#currentPath.slice(-1)[0];
            const dx = pos.x - prevX;
            const dy = pos.y - prevY;
            const theta = Math.atan2(dy, dx);
            const twelfthPi = Math.PI / 12;
            const lockedTheta = Math.round(theta / twelfthPi) * twelfthPi;
            const r = Math.sqrt(dx * dx + dy * dy);
            const x = prevX + r * Math.cos(lockedTheta);
            const y = prevY + r * Math.sin(lockedTheta);
            oCtx.lineTo(x, y);
        } else {
            oCtx.lineTo(pos.x, pos.y);
        }

        oCtx.stroke();
    }

    static #filter(sourceCanvas: HTMLCanvasElement, filter: string) {
        const canvas = document.createElement("canvas");
        canvas.width = sourceCanvas.width;
        canvas.height = sourceCanvas.height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return sourceCanvas;
        }

        ctx.filter = filter;
        ctx.drawImage(sourceCanvas, 0, 0);
        ctx.filter = "none";

        return canvas;
    }

    static invert(canvas: HTMLCanvasElement, fraction: number) {
        return this.#filter(canvas, `invert(${fraction})`);
    }

    static greyscale(canvas: HTMLCanvasElement, fraction: number) {
        return this.#filter(canvas, `grayscale(${fraction})`);
    }

    static blur(canvas: HTMLCanvasElement, radius: number) {
        return this.#filter(canvas, `blur(${radius}px)`);
    }
}
