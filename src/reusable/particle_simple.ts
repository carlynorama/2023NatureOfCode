//
// 2023 January Creative Coding Journal
// https://github.com/carlynorama/2023January-30DaysNatureOfCode/
//
// particle_simple.ts
// adapted by calynorama 2023 Jan 16
// from Spring Forces (Spring OOP)
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/160-spring-forces.html
// https://youtu.be/Rr-5HiXquhw
// Spring OOP: https://editor.p5js.org/codingtrain/sketches/9BAoEn4Po

class Particle {
  acceleration: Vector;
  velocity: Vector;
  position: Vector;
  mass: number;
  dampening: number;
    constructor(x:number, y:number) {
      this.acceleration = new Vector(0, 0);
      this.velocity = new Vector(0, 0);
      this.position = new Vector(x, y);
      this.mass = 1; // Let's do something better here!
      this.dampening = 0.99;
    }
  
    get heading()  { return this.velocity.angle }
  
    applyForce(force:Vector) {
      let n = force.scaledBy(1/this.mass);
      this.acceleration = this.acceleration.added(n);
    }
  
    // Method to update position
    update() {
      this.velocity.scaledBy(this.dampening);
      this.velocity = this.velocity.added(this.acceleration);
      this.position = this.position.added(this.velocity);
      this.acceleration = new Vector(0,0);
    }
  
  }
  