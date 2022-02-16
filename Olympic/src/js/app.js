import { Visual } from './visual.js';
import { Img } from './img.js';

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth;
    this.canvas.height = this.stageHeight;

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    window.addEventListener('resize', this.resize.bind(this));

    const img = new Img(this.ctx, this.stageWidth, this.stageHeight);

    img.image.onload = () => {
      const pixeles = img.getDotPos();
      this.resize();

      this.visual = new Visual(pixeles, this.stageWidth, this.stageHeight);
      this.visual.animate(this.ctx);

      window.addEventListener('mousedown', this.onMouseDown.bind(this));
      window.addEventListener('mouseup', this.onMouseUp.bind(this));
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
      requestAnimationFrame(this.animate.bind(this));
    };
  }

  onMouseDown() {
    this.visual.onMouseDown();
  }

  onMouseMove(event) {
    this.visual.onMouseMove(event.clientX, event.clientY);
  }

  onMouseUp() {
    this.visual.onMouseUp();
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  animate(t) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.visual.animate(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};
