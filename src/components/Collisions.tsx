import { useEffect, useRef } from "react";
import clearCanvas from "../utils/clearCanvas";

type CircleConstructor = {
  name: string;
  fill: string;
  x: number;
  y: number;
  radius: number;
  mass: number;
  dx: number;
  dy: number;
};

function square(num: number) {
  return num * num;
}

class Circle {
  name;
  fill;
  x;
  y;
  radius;
  mass;
  dx;
  dy;
  backupFill;
  constructor({ name, fill, x, y, radius, mass, dx, dy }: CircleConstructor) {
    this.name = name;
    this.fill = fill;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.dx = dx;
    this.dy = dy;
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
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${this.mass.toString()}kg`, this.x, this.y - 10);
    ctx.fillText(`dx: ${this.dx.toString()}`, this.x, this.y + 5);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  detectWalls() {
    // Left wall
    if (this.x < this.radius) {
      this.x = 0 + this.radius;
      this.dx = -this.dx;
    }
    // Right wall
    if (this.x + this.radius > canvasWidth) {
      this.x = canvasWidth - this.radius;
      this.dx = -this.dx;
    }
    // Ceiling
    if (this.y < this.radius) {
      this.dy = -this.dy;
    }
    // Floor
    if (this.y + this.radius > canvasHeight) {
      this.dy = -this.dy;
    }
  }

  handleCollision(circles: Circle[]) {
    const efficiency = 7 / 8;
    circles.forEach((circle) => {
      if (this.detectCollision(circle)) {
        const momentum = this.dx * this.mass + circle.dx * circle.mass;
        const circleDx = (momentum - circle.dx * circle.mass) / this.mass;
        if (circleDx < momentum / circle.mass) return;
        circle.dx = circleDx * efficiency;
        this.dx = circleDx * (1 - efficiency);
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
}

const canvasWidth = 401;
const canvasHeight = 64;

// time interval
const dt = 2;

// Component
const Collisions = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const ball1 = new Circle({
    name: "ball1",
    fill: "#ff6745",
    radius: 32,
    mass: 1,
    x: 32,
    y: 32,
    dx: 2,
    dy: 0,
  });

  const ball2 = new Circle({
    name: "ball2",
    fill: "#5145ff",
    radius: 32,
    mass: 2,
    x: 400,
    y: 32,
    dx: 0,
    dy: 0,
  });

  const balls = [ball1, ball2];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      clearCanvas(canvasRef);

      balls.forEach((ball) => {
        ball.move();
        ball.detectWalls();
        const filteredBalls = balls.filter((predicate) => predicate.name !== ball.name);
        ball.handleCollision(filteredBalls);
        ball.draw(ctx);
      });

      setTimeout(() => requestAnimationFrame(gameLoop), dt);
    };

    gameLoop();
    console.log("pause changed in canvas");
  }, [canvasRef]);

  return (
    <div className="flex flex-col items-center gap-6">
      <canvas
        ref={canvasRef}
        className="border border-gray-200"
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  );
};

export default Collisions;
