import { Particle } from './particle.js';
import { Point } from './point.js';

export class Visual {
  constructor(pixeles, stageWidth, stageHeight, pixelRatio) {
    this.pixeles = pixeles;
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.reversePixelRatio = 3 - pixelRatio;
    this.frame = 100;
    this.acceleration = 1 + 0.00492 * this.reversePixelRatio;
    this.friction = 1 - (0.0038 + 0.005 * this.reversePixelRatio);
    // 0.9912;
    this.isMouseDown = false;

    this.particles = [];

    this.setParticles();
  }

  setParticles() {
    this.pixeles.forEach((pixel) => {
      const particle = new Particle(
        pixel.x,
        pixel.y,
        pixel.color,
        this.stageWidth,
        this.stageHeight,
        this.isMouseDown
      );
      this.particles.push(particle);
    });
  }

  onMouseMove(x, y) {
    if (!this.isMouseDown) {
      const point = new Point(x, y);

      this.particles.forEach((particle) => {
        const dx = point.x - particle.cntX;
        const dy = point.y - particle.cntY;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);

        if (dist < point.radius) {
          const angle = Math.atan2(dy, dx);
          const tx = particle.cntX + Math.cos(angle) * point.radius;
          const ty = particle.cntY + Math.sin(angle) * point.radius;

          const ax = tx - point.x;
          const ay = ty - point.y;

          particle.vx -= ax;
          particle.vy -= ay;

          particle.v = 0.03;
        }
      });
    }
  }

  onMouseDown() {
    this.isMouseDown = true;
    this.particles.forEach((particle) => {
      particle.v = 0.2;
      particle.startX = particle.cntX;
      particle.startY = particle.cntY;
      particle.toOriginDist = Math.sqrt(
        (particle.originX - particle.startX) ** 2 +
          (particle.originY - particle.startY) ** 2
      );
      particle.flying = true;
    });
  }

  onMouseUp() {
    this.isMouseDown = false;
    this.particles.forEach((particle) => {
      particle.v = 0.03;
      particle.startX = particle.cntX;
      particle.startY = particle.cntY;
      particle.toRanDist = Math.sqrt(
        (particle.ranX - particle.startX) ** 2 +
          (particle.ranY - particle.startY) ** 2
      );
      particle.cntColor = particle.lightColor;
    });
  }

  animate(ctx) {
    this.particles.forEach((particle) => {
      if (this.isMouseDown) {
        const dx = particle.originX - particle.cntX;
        const dy = particle.originY - particle.cntY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 3) {
          const gapX = (particle.originX - particle.startX) / this.frame;
          const gapY = (particle.originY - particle.startY) / this.frame;

          if (particle.toOriginDist / 2 < dist) {
            particle.v *= this.acceleration;
          } else {
            particle.v *= this.friction;
          }

          particle.cntX += gapX * particle.v;
          particle.cntY += gapY * particle.v;
        } else {
          particle.cntColor = particle.color;
        }
      } else {
        const dx = particle.ranX - particle.cntX;
        const dy = particle.ranY - particle.cntY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 3) {
          const gapX = (particle.ranX - particle.startX) / this.frame;
          const gapY = (particle.ranY - particle.startY) / this.frame;

          if (particle.toRanDist / 2 < dist) {
            particle.v *= this.acceleration;
          } else {
            particle.v *= this.friction;
          }

          if (particle.v < 0.03) {
            particle.flying = false;
          }

          particle.cntX += gapX * particle.v;
          particle.cntY += gapY * particle.v;
        }
      }
      particle.draw(ctx);
    });
  }
}
