//@ts-nocheck
const square = (num: number) => num * num;

interface SpringConstructor {
  x0: number;
  mass: number;
  stiffness: number;
}

export default class SpringPhysics {
  x0;
  mass;
  stiffness;
  amplitude = 0;
  x;
  dx;
  omega: number = 0;
  vx: number = 0;

  constructor({ mass, stiffness, x0 }: SpringConstructor) {
    this.x0 = x0;
    this.x = x0;
    this.dx = 0;
    this.mass = mass;
    this.stiffness = stiffness;
  }

  animate() {
    this.getVelocity(this.x);
    this.x += this.vx;
  }

  getVelocity(x: number) {
    // this.omega = Math.sqrt(this.stiffness / this.mass);
    this.dx = x - this.x0;
    this.vx = -(this.stiffness / this.mass) * this.dx;
    // this.vx = this.omega * Math.sqrt(square(this.amplitude) - square(this.dx));
  }
}
