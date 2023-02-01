import { canvasWidth, canvasHeight } from "../components/WithEnergy";

type CircleConstructor = {
  name: string;
  fill: string;
  x0: number;
  y0: number;
  radius: number;
  mass: number;
  vx: number;
  vy: number;
};

function square(num: number) {
  return num * num;
}

export default class Circle {
  name;
  fill;
  x0;
  y0;
  x: number;
  y: number;
  radius;
  mass;
  vx;
  vy;
  ax = 0;
  ay = 0;
  backupFill;
  constructor({ name, fill, x0, y0, radius, mass, vx, vy }: CircleConstructor) {
    this.name = name;
    this.fill = fill;
    this.x0 = x0;
    this.y0 = y0;
    this.x = x0;
    this.y = y0;
    this.radius = radius;
    this.mass = mass;
    this.vx = vx;
    this.vy = vy;
    this.backupFill = this.fill;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.fill;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radius, this.radius, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${this.mass.toString()}kg`, this.x, this.y - 10);
    ctx.fillText(`vx: ${Math.round(this.vx).toString()}`, this.x, this.y + 5);
  }

  move(dt: number) {
    this.accelerate(dt);
    this.x += this.vx;
    this.y += this.vy;
  }

  accelerate(dt: number) {
    console.log("ax", this.ax);
    this.vx += this.ax * dt;
    this.vy += this.ay * dt;
  }

  detectWalls() {
    // Left wall
    if (this.x < this.radius) {
      this.x = 0 + this.radius;
      this.vx = -this.vx;
      this.ax = -this.ax;
    }
    // Right wall
    if (this.x + this.radius > canvasWidth) {
      this.x = canvasWidth - this.radius;
      this.vx = -this.vx;
      this.ax = -this.ax;
    }
    // Ceiling
    if (this.y < this.radius) {
      this.vy = -this.vy;
      this.ay = -this.ay;
    }
    // Floor
    if (this.y + this.radius > canvasHeight) {
      this.vy = -this.vy;
      this.ay = -this.ay;
    }
  }

  handleCollision(circles: Circle[]) {
    const k = 0.2;
    circles.forEach((circle) => {
      if (this.detectCollision(circle)) {
        // X Axis
        const v01 = this.vx;
        circle.vx = (2 * this.mass * v01) / (this.mass + circle.mass);
        this.vx = (v01 * (this.mass - circle.mass)) / (this.mass + circle.mass);
        this.ax += -(k / circle.mass) * this.#proximityVector(circle).x;
        circle.ax += -(k / this.mass) * this.#proximityVector(this).x;
        return;
      }
      this.ax = 0;
      circle.ax = 0;
    });
  }

  handleSpring(circles: Circle[]) {
    const k = 50;
    circles.forEach((circle) => {
      if (this.detectCollision(circle)) {
        this.ax = -(k / circle.mass) * this.#proximityVector(circle).x;
        circle.ax = -(k / this.mass) * this.#proximityVector(this).x;
      } else {
        this.ax = 0;
        circle.ax = 0;
      }
    });
  }

  detectCollision(circle: Circle) {
    const colliding = this.#proximity(circle) < this.radius + circle.radius;
    return colliding;
  }

  #proximity(circle: Circle) {
    return Math.sqrt(square(circle.x - this.x) + square(circle.y - this.y));
  }

  #proximityVector(circle: Circle) {
    return { x: circle.x - this.x, y: circle.y - this.y };
  }
}
