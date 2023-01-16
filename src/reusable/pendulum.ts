  //
  // 2023 January Creative Coding Journal
  // https://github.com/carlynorama/2023January-30DaysNatureOfCode/
  //
  // polarmover.ts
  // written by calynorama 2023 Jan 15
  //
  // NOTE: THE PHYSICS IS LIKELY WRONG.

  class Pendulum {
  
    position: Vector; //location relative to the root at zero.
    
    lastPosition:Vector;
    velocity:Vector; //value in meters/second.
    angularVelocity:number; //value in radians/second.
    tetherLength:number;
    tetherTension: number;

    child?:Pendulum;
    

    //Root is always ZERO!
    constructor(position:Vector) {
      
      this.position = position;
      this.lastPosition = position;
      this.velocity = Vector.zero2D();
      this.angularVelocity = 0; 
      this.tetherLength = this.position.length();  //update if add root. 
      this.tetherTension = 0.001;
    }

    static createPendulum(angle:number, magnitude:number) {
      return new Pendulum(Vector.createAngleVector(angle, magnitude));
    }

    static createPendulumStack(angle:number, magnitude:number, child:Pendulum, stack_length:number, current:number):Pendulum {
      if (current == stack_length) { return child }
      let parent = this.createPendulum(angle, magnitude);
      parent.child = child
      return this.createPendulumStack(angle, magnitude, parent, stack_length, current+1);
    }

    updateVelocity() {
      this.velocity = this.position.subtracted(this.lastPosition);
    }

    get heading() { return this.velocity.angle() }
    get x() { return this.position.x }
    get y() { return this.position.y }

    updatePosition(dTheta:number, dMagnitude:number) {
        //createAngleVector can handle negative magnitude
        let change = Vector.createAngleVector(dTheta, dMagnitude);
        this.lastPosition = this.position.copy();
        this.position = this.position.added(change);
        this.updateVelocity();
    }

    setPosition(theta:number, magnitude:number) {
      this.lastPosition = this.position.copy();
      this.position = Vector.createAngleVector(theta, magnitude);
      this.updateVelocity();
    }

    incrementPosition(vector:Vector) {
      this.lastPosition = this.position.copy();
      this.position = this.position.added(vector);
      this.updateVelocity();
    }

    setAngle(theta:number) {
      this.lastPosition = this.position.copy();
      this.position = Vector.createAngleVector(theta, this.position.length());
      this.updateVelocity();
    }

    incrementAngle(theta:number) {
      this.lastPosition = this.position.copy();
      this.position = Vector.createAngleVector(this.position.angle() + theta, this.position.length());
      this.updateVelocity();
    }

    applyGravity(constant:number) {
      let angularAccleration = constant * Math.cos(this.position.angle()) / this.tetherLength;
      this.angularVelocity += angularAccleration;
      // let delta = Vector.createAngleVector(this.position.perpendicularAngle(), );
      this.incrementAngle(this.angularVelocity);
    }

    sumGravity(location:Vector, constant:number) {
      let test = location.added(this.position);
      let angularAccleration = constant * Math.cos(test.angle()) / this.tetherLength;
      this.angularVelocity += angularAccleration;
      // let delta = Vector.createAngleVector(this.position.perpendicularAngle(), );
      this.incrementAngle(this.angularVelocity);
    }

    //TODO: sum the pull from the children?
    sumForces(location:Vector, constant:number, childFactor:number):number {
      let test = location.added(this.position);
      let angularAccleration = constant * Math.cos(test.angle()) / this.tetherLength;

      
      //ADD PULL FROM THE CHILD;

      this.angularVelocity += angularAccleration  + childFactor;
      this.incrementAngle(this.angularVelocity);

      //DIFFERENTCONSTANT
      let myFactor =  this.tetherTension * this.velocity.y / this.tetherLength;  
      return myFactor;
    }

    // walk(constant:number, location:Vector, callback: (location:Vector, pendulum:Pendulum) => void) {
    //   //this.sumForces(location, constant);
      
    //   //this.applyGravity(constant); //<- TODO: how does it know what direction is down in the actual translation? 
    //   let root = location.added(this.position);
      
    //   if (this.child) { 
    //     //this.child.angularVelocity += this.angularVelocity;
    //     this.child.walk(constant, root, callback) 
    //   }
    //   callback(location, this);
      
    // }

    updatePendulum(constant:number, location:Vector, callback: (location:Vector, pendulum:Pendulum) => void):number {
      //this.sumForces(location, constant);
      
      //this.applyGravity(constant); //<- TODO: how does it know what direction is down in the actual translation? 
      let root = location.added(this.position);
      let childFactor = 0;
      if (this.child) { 
        //this.child.angularVelocity += this.angularVelocity;
        childFactor = this.child.updatePendulum(constant, root, callback) 
      }
      let myFactor = this.sumForces(location, constant, childFactor);
      callback(location, this);
      return myFactor;
      
    }

    pretty():string {
      return `TPMover(x:${this.position.x}, y:${this.position.y}, lx:${this.lastPosition.x}, ly:${this.lastPosition.y}, vx:${this.velocity.x}, vy:${this.velocity.y})`
    }



    // force = gravity * cos(angle);
    // angleA = (force) / len;
    // angleV += angleA;
    // angle += angleV;
  
    // attract(mover:Mover) {
    //   let force = this.position.subtracted(mover.position);
    //   let distanceSq = constrain(force.magnitudeSquared(), 100, 1000);
      
    //   let strength = Mover.G * ((this.mass * mover.mass)) / distanceSq;
    //   force = force.withLength(strength);
    //   mover.applyForce(force);
    // }

    // applyForce(force:Vector) {
    //   let f:Vector = Vector.scaledBy(force, 1/this.mass);
    //   this.acceleration = this.acceleration.added(f);
    // }
  
    // update() {
    //   this.velocity = this.velocity.added(this.acceleration);
    //   this.position = this.position.added(this.velocity);
    //   console.log("update", this.pretty());
    //   this.acceleration = Vector.zero2D();
    // }
  
        // needsCartesian(callback: (x: number, y:number, a:number) => void) {
    //   callback(this.position.x, this.position.y, this.velocity.angle());
    // }
    //translatedTo(root:Vector) { return root.added(this.position) } ;
    // translateCartesianT(root:Vector, callback: (x: number, y:number, a:number) => void) {
    //   let location = root.added(this.position);
    //   callback(location.x, location.y, this.velocity.angle());
    //   callback(this.position.x, this.position.y, this.velocity.angle());
    // }

    // get translatedPosition() { return this.origin.added(this.position)} 
    // needsTranslatedCartesian(callback: (x: number, y:number, a:number) => void) {
    //   let location = this.origin.added(this.position);
    //   callback(location.x, location.y, this.velocity.angle());
    // }

       //assumes the zero angle is the one out and to the right of the origin. 
    // applyGravity(constant:number) {
    //   let delta = Vector.createAngleVector(this.position.perpendicularAngle(), constant * Math.cos(this.position.angle()));
    //   this.incrementPosition(delta);
    // }
  }
  