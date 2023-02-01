interface BoxConstructor {
  x0: number;
  y0: number;
  width: number;
  height: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default class Box {
  x0: number;
  y0: number;
  #x: number;
  #y: number;
  #vx: number = 0;
  #ax: number = 0;
  width: number;
  height: number;
  mass: number = 2;
  #dx: number = 0;
  k: number = 8;

  #playing: boolean = false;

  canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor({ x0, y0, width, height, canvasRef }: BoxConstructor) {
    this.x0 = x0;
    this.y0 = y0;
    this.width = width;
    this.height = height;
    this.#x = x0;
    this.#y = y0;
    this.canvasRef = canvasRef;
  }

  get x() {
    return this.#x;
  }

  set x(newX: number) {
    this.#x = newX;
    this.detectWalls();
  }

  get vx() {
    return this.#vx;
  }

  set vx(newVx: number) {
    this.#vx = newVx;
  }
  get ax() {
    return this.#ax;
  }

  set ax(newAx: number) {
    this.#ax = newAx;
  }

  get dx() {
    return this.#dx;
  }

  set dx(newDx) {
    this.#dx = newDx;
  }

  get playing() {
    return this.#playing;
  }

  set playing(bool: boolean) {
    this.#playing = bool;
  }

  draw() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textX = `x: ${Math.round(this.x).toString()}`;
    const textV = `v: ${Math.round(this.vx).toString()}`;
    const textA = `a: ${Math.round(this.ax).toString()}`;
    ctx.fillText(textX, this.x, this.y0 + this.height / 2 - 12);
    ctx.fillText(textV, this.x, this.y0 + this.height / 2);
    ctx.fillText(textA, this.x, this.y0 + this.height / 2 + 12);
    ctx.strokeRect(this.x - this.width / 2, this.y0, this.width, this.height);
  }

  detectWalls() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    // Left wall
    if (this.x < this.width / 2) {
      this.x = this.width / 2;
    }
    // Right wall
    if (this.x > canvas.width - this.width / 2) {
      this.x = canvas.width - this.width / 2;
    }
  }

  move(dt: number) {
    if (!this.playing) return;
    this.accelerate(dt);
    this.x += this.vx * dt;
  }

  accelerate(dt: number) {
    if (!this.playing) return;
    this.updateAcceleration();
    this.vx += this.ax * dt;
  }

  updateAcceleration() {
    if (!this.playing) return;
    this.dx = Math.round(this.x0 - this.x);
    this.ax = (this.k / this.mass) * this.dx;
  }
}
