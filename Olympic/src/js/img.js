export class Img {
  constructor(ctx, stageWidth, stageHeight) {
    this.ctx = ctx;
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.image = new Image();
    this.image.src = './images/olympic.svg';
    this.imageWidth = 900;
    this.imageHeight = 600;
    this.imagePosX = Math.floor((stageWidth - this.imageWidth) / 2);
    this.imagePosY = Math.floor((stageHeight - this.imageHeight) / 2);
    this.density = 8;
  }

  getDotPos() {
    this.ctx.drawImage(
      this.image,
      this.imagePosX,
      this.imagePosY,
      this.imageWidth,
      this.imageHeight
    );

    const imageData = this.ctx.getImageData(
      0,
      0,
      this.stageWidth,
      this.stageHeight
    );

    const particles = [];

    for (let h = 0; h < this.stageHeight; h += this.density) {
      for (let w = 0; w < this.stageWidth; w += this.density) {
        const idx = (h * this.stageWidth + w) * 4;

        const r = imageData.data[idx];
        const g = imageData.data[idx + 1];
        const b = imageData.data[idx + 2];

        if (r != 0) {
          const color = `#${this.decToHex(r)}${this.decToHex(g)}${this.decToHex(
            b
          )}`;

          particles.push({
            x: w,
            y: h,
            color,
          });
        }
      }
    }

    return particles;
  }

  decToHex(dec) {
    const hex = dec.toString(16);

    return hex.length === 1 ? `0${hex}` : hex;
  }
}
