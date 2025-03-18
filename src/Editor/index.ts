import { defaultUIState } from "../Store/ui/reducer";

type Point = { x: number, y: number };

export class Editor {
    #canvas: HTMLCanvasElement | null = null;
    #overlayCanvas: HTMLCanvasElement | null = null;

    #tool = "";
    #toolOptions = defaultUIState.toolOptions;

    #firstPoint: Point = { x: 0, y: 0 };
    #prevPoint: Point = { x: 0, y: 0 };

    #currentPath: Point[] = [];

    setCanvases(
        canvas: HTMLCanvasElement | null,
        overlayCanvas: HTMLCanvasElement | null
    ) {
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

        if (this.#tool === "line") {
            this.#currentPath = [mousePos];
        }
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

        switch (this.#tool) {
            case "pencil":
                this.#pencil(ctx, mousePos);
                break;
            case "shapes":
                this.#shapes(ctx, oCtx, mousePos, mouseEvent);
                break;
            case "line":
                this.#line(ctx, oCtx, mousePos, mouseEvent);
                break;
        }

        this.#prevPoint = mousePos;
    }

    mouseUp() {
        if (!this.#canvas || !this.#overlayCanvas) {
            return;
        }

        if (this.#tool === "shapes" || this.#tool === "line") {
            const ctx = this.#canvas.getContext("2d");

            if (!ctx) {
                return;
            }

            ctx.drawImage(this.#overlayCanvas, 0, 0);
        }

        const { width, height } = this.#overlayCanvas;
        this.#overlayCanvas?.getContext("2d")?.clearRect(0, 0, width, height);
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
        ctx: CanvasRenderingContext2D,
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
        ctx: CanvasRenderingContext2D,
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

    static #filter(canvas: HTMLCanvasElement, filter: string) {
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }

        ctx.filter = filter;
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
    }

    static invert(canvas: HTMLCanvasElement, fraction: number) {
        this.#filter(canvas, `invert(${fraction})`);
    }

    static greyscale(canvas: HTMLCanvasElement, fraction: number) {
        this.#filter(canvas, `grayscale(${fraction})`);
    }

    static blur(canvas: HTMLCanvasElement, radius: number) {
        this.#filter(canvas, `blur(${radius}px)`);
    }
}
