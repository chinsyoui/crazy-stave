import logger from '@/utils/logger.js'

// CanvasRenderingContext2D crc2d
export function WeixinRenderContext(crc2d, width, height) {
    logger.assert(crc2d);
    logger.debug("new WeixinRenderContext: ", crc2d, width, height);

    this.context2D = crc2d;
    this.canvasWidth = width;
    this.canvasHeight = height;

    /**
     * Set all pixels to transparent black rgba(0,0,0,0).
     */
    this.clear = () => {
        // logger.debug("clear");
        this.context2D.clearRect(0, 0, this.canvasWidth, this.canvasWeight);
    };

    // eslint-disable-next-line
    this.openGroup = (cls, id, attrs) => {
        // Containers not implemented.
    };

    this.closeGroup = () => {
        // Containers not implemented.
    };

    // eslint-disable-next-line
    this.add = (child) => {
        // Containers not implemented.
    };

    this.setFillStyle = (style) => {
        // logger.debug("setFillStyle", style);
        this.context2D.fillStyle = style;
        return this;
    };

    /** CanvasContext ignores `setBackgroundFillStyle()`. */
    // eslint-disable-next-line
    this.setBackgroundFillStyle = (style) => {
        // DO NOTHING
        return this;
    };
    
    this.setStrokeStyle = (style) => {
        // logger.debug("setStrokeStyle", style);
        this.context2D.strokeStyle = style;
        return this;
    };

    this.setShadowColor = (color) => {
        // logger.debug("setShadowColor", color);
        this.context2D.shadowColor = color;
        return this;
    };

    this.setShadowBlur = (blur) => {
        // logger.debug("setShadowBlur", blur);

        // CanvasRenderingContext2D does not scale the shadow blur by the current
        // transform, so we have to do it manually. We assume uniform scaling
        // (though allow for rotation) because the blur can only be scaled
        // uniformly anyway.
        const t = this.context2D.getTransform();
        const scale = Math.sqrt(t.a * t.a + t.b * t.b + t.c * t.c + t.d * t.d);
        this.context2D.shadowBlur = scale * blur;
        return this;
    };

    this.setLineWidth = (width) => {
        // logger.debug("setLineWidth", width);
        this.context2D.lineWidth = width;
        return this;
    };

    this.setLineCap = (capType) => {
        // logger.debug("setLineCap", capType);
        this.context2D.lineCap = capType;
        return this;
    };
    
    this.setLineDash = (dash) => {
        // logger.debug("setLineDash", dash);
        this.context2D.setLineDash(dash);
        return this;
    };

    this.scale = (x, y) => {
        // logger.debug("scale", x, y);
        this.context2D.scale(x, y);
        return this;
    };

    this.resize = (width, height) => {
        logger.debug("resize", width, height);
        const canvasElement = this.context2D.canvas;
        const devicePixelRatio = window && window.devicePixelRation ? window.devicePixelRatio : 1;
        // Scale the canvas size by the device pixel ratio clamping to the maximum supported size.
        [width, height] = CanvasContext.sanitizeCanvasDims(width * devicePixelRatio, height * devicePixelRatio);
        // Divide back down by the pixel ratio and convert to integers.
        width = (width / devicePixelRatio) | 0;
        height = (height / devicePixelRatio) | 0;
        canvasElement.width = width * devicePixelRatio;
        canvasElement.height = height * devicePixelRatio;
        canvasElement.style.width = width + 'px';
        canvasElement.style.height = height + 'px';
        return this.scale(devicePixelRatio, devicePixelRatio);
    };

    this.rect = (x, y, width, height) => {
        // logger.debug("rect", x, y, width, height);
        this.context2D.rect(x, y, width, height);
        return this;
    };

    this.fillRect = (x, y, width, height) => {
        // logger.debug("fillRect", x, y, width, height);
        this.context2D.fillRect(x, y, width, height);
        return this;
    };

    /**
     * Set the pixels in a rectangular area to transparent black rgba(0,0,0,0).
     */
    this.clearRect = (x, y, width, height) => {
        this.context2D.clearRect(x, y, width, height);
        return this;
    };

    this.beginPath = () => {
        // logger.debug("beginPath");
        this.context2D.beginPath();
        return this;
    };

    this.moveTo = (x, y) => {
        // logger.debug("moveTo");
        this.context2D.moveTo(x, y);
        return this;
    };

    this.lineTo = (x, y) => {
        // logger.debug("lineTo");
        this.context2D.lineTo(x, y);
        return this;
    };

    this.bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => {
        // logger.debug("bezierCurveTo");
        this.context2D.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        return this;
    };

    this.quadraticCurveTo = (cpx, cpy, x, y) => {
        this.context2D.quadraticCurveTo(cpx, cpy, x, y);
        return this;
    };

    this.arc = (x, y, radius, startAngle, endAngle, counterclockwise) => {
        logger.debug("arc");
        this.context2D.arc(x, y, radius, startAngle, endAngle, counterclockwise);
        return this;
    };

    this.fill = () => {
        // logger.debug("fill");
        this.context2D.fill();
        return this;
    };

    this.stroke = () => {
        // logger.debug("stroke");
        this.context2D.stroke();
        return this;
    };

    this.closePath = () => {
        // logger.debug("closePath");
        this.context2D.closePath();
        return this;
    };

    this.measureText = (text) => {
        // logger.debug("measureText");
        const metrics = this.context2D.measureText(text);
        return {
            width: metrics.width,
            height: this.textHeight,
        };
    };

    this.fillText = (text, x, y) => {
        // logger.debug("fillText");
        this.context2D.fillText(text, x, y);
        return this;
    };

    this.save = () => {
        // logger.debug("save");
        this.context2D.save();
        return this;
    };

    this.restore = () => {
        // logger.debug("restore");
        this.context2D.restore();
        return this;
    };

    this.setFillStyle = (style) => {
        this.context2D.fillStyle = style;
    };

    this.getFillStyle = () => {
        return this.context2D.fillStyle;
    };

    this.setStrokeStyle = (style) => {
        this.context2D.strokeStyle = style;
    };

    this.getStrokeStyle = () => {
        return this.context2D.strokeStyle;
    };

    this.setFont = (family, size, weight) => {
        // logger.debug("setFont", family, size, weight);
        this.context2D.font = (weight || '') + ' ' + size + 'pt ' + family;
        this.textHeight = (size * 4) / 3;
        return this;
    };

    /** Return a string of the form `'italic bold 15pt Arial'` */
    this.getFont = () => {
        return this.context2D.font;
    };

    this.setRawFont = (font) => {
        this.context2D.font = font;
        const fontArray = font.split(' ');
        const size = Number(fontArray[0].match(/\d+/));
        // The font size is specified in points, scale it to canvas units.
        // CSS specifies dpi to be 96 and there are 72 points to an inch: 96/72 == 4/3.
        this.textHeight = (size * 4) / 3;
        return this;
    };

    this.setFont = (value) => {
        this.setRawFont(value);
    };

    this.getFont = () => {
        return this.context2D.font;
    };
};
