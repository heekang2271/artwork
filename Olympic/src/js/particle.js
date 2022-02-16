const FRICTION = 0.46;

export class Particle {
  constructor(x, y, color, stageWidth, stageHeight) {
    this.radius = 5;
    this.color = color;
    this.lightColor = '#E9ECD6';
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.cntColor = this.lightColor;
    this.originX = x;
    this.originY = y;
    this.ranX = this.getRandomPos(stageWidth);
    this.ranY = this.getRandomPos(stageHeight);

    this.startX = this.ranX;
    this.startY = this.ranY;

    this.cntX = this.ranX;
    this.cntY = this.ranY;

    this.toOriginDist = Math.sqrt(
      (this.originX - this.startX) ** 2 + (this.originY - this.startY) ** 2
    );
    this.toRanDist = Math.sqrt(
      (this.originX - this.startX) ** 2 + (this.originY - this.startY) ** 2
    );

    this.light = this.random(0, 255);
    this.lightOn = this.random(0, 1);
    this.flying = false;

    this.v = 0.2;

    this.vx = 0;
    this.vy = 0;
  }

  draw(ctx) {
    ctx.beginPath();

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    if (this.lightOn === 1) {
      if (this.light < 255) {
        this.light += 1;
      } else {
        this.lightOn = 0;
      }
    } else {
      if (this.light > 0) {
        this.light -= 1;
      } else {
        this.lightOn = 1;
      }
    }

    if (
      (Math.abs(this.vx) > 0 && Math.abs(this.vx) < 0.001) ||
      (Math.abs(this.vy) > 0 && Math.abs(this.vy) < 0.001)
    ) {
      this.startX = this.cntX;
      this.startY = this.cntY;
      this.toRanDist = Math.sqrt(
        (this.ranX - this.startX) ** 2 + (this.ranY - this.startY) ** 2
      );
      this.vx = 0;
      this.vy = 0;
    }

    this.cntX += this.vx;
    this.cntY += this.vy;

    const g = ctx.createRadialGradient(
      this.cntX,
      this.cntY,
      this.radius * 0.2,
      this.cntX,
      this.cntY,
      this.radius
    );

    if (this.flying) {
      g.addColorStop(0, this.cntColor + 'ff');
      g.addColorStop(1, this.lightColor + '51');
    } else {
      g.addColorStop(0, this.cntColor + this.decToHex(this.light));
      g.addColorStop(
        1,
        this.lightColor + this.decToHex(Math.floor(this.light / 5))
      );
    }
    ctx.fillStyle = g;

    // ctx.fillStyle = '#E9ECD6';
    ctx.arc(this.cntX, this.cntY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  random(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  getRandomPos(stageSize) {
    const padding = stageSize / 1;

    return this.random(-padding, stageSize + padding);
  }

  decToHex(dec) {
    const hex = dec.toString(16);

    return hex.length === 1 ? `0${hex}` : hex;
  }
}
