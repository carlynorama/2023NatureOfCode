"use strict";
//
// 2023 January Creative Coding Journal
// https://github.com/carlynorama/2023January-30DaysNatureOfCode/
//
// vehicle.ts
// written by calynorama 2023 Jan 20
// following https://editor.p5js.org/codingtrain/sketches/Lx3PJMq4m
class Vehicle extends BasicParticle {
    constructor(position, velocity, acceleration, maxSpeed = 3, maxForce = 0.05, dockingDistance = 40) {
        super(position, velocity, acceleration);
        this.startLocation = position;
        this.maxSpeed = maxSpeed;
        this.maxPush = maxForce;
        this.arrived = false;
        this.dockingDistance = dockingDistance;
        this.drag = 1;
    }
    static createStillVehicle(x, y) {
        let acceleration = new Vector(0, 0);
        let velocity = new Vector(0, 0);
        let position = new Vector(x, y);
        return new Vehicle(position, velocity, acceleration);
    }
    static createVehicle(x, y, vx, vy) {
        let acceleration = new Vector(0, 0);
        let velocity = new Vector(vx, vy);
        let position = new Vector(x, y);
        return new Vehicle(position, velocity, acceleration);
    }
    static createRandomVehicle(x, y, max) {
        let acceleration = new Vector(0, 0);
        let velocity = new Vector(Math.random() * max, Math.random() * max);
        let position = new Vector(x, y);
        return new Vehicle(position, velocity, acceleration);
    }
    teleport(newLocation) {
        this._position = newLocation.copy();
    }
    //classic seek
    seek(target) {
        let p_difference = Vector.subtracting(target, this.position);
        let v_difference = Vector.subtracting(p_difference, this.velocity);
        if (v_difference.magnitude() === 0) {
            return Vector.zero2D();
        }
        //@ts-expect-error
        return v_difference.normalized().scaledBy(this.maxSpeed);
    }
    //classic flee 
    flee(target) {
        return this.seek(target).scaledBy(-1);
    }
    evade(vehicle, lead = 10) {
        return this.pursue(vehicle, lead).scaledBy(-1);
    }
    pursue(vehicle, lead = 10) {
        let prediction = vehicle.velocity.scaledBy(lead);
        let target = vehicle.position.addedTo(prediction);
        return this.seek(target);
        //return this.approach(target);
    }
    //slows down as gets nearer
    approach(target) {
        let p_difference = Vector.subtracting(target, this.position);
        let v_difference = Vector.subtracting(p_difference, this.velocity);
        return v_difference;
    }
    //Wants to be the circumference away
    maintainDistance(target, safety) {
        let p_difference = Vector.subtracting(this.position, target);
        if (p_difference.magnitude() === 0) {
            return Vector.zero2D();
        }
        //@ts-expect-error
        let desiredNewLocation = p_difference.normalized().scaledBy(safety).addedTo(target);
        //console.log(p_difference.x, p_difference.y, desiredNewLocation.x, desiredNewLocation.y);
        return this.approach(desiredNewLocation);
    }
    //Moves away when the repulsion is less than a circumference away
    skirt(target, safety) {
        let p_difference = Vector.subtracting(this.position, target);
        let distanceToMove = Math.max(safety - p_difference.magnitude(), 0);
        if (distanceToMove === 0) {
            return Vector.zero2D();
        }
        //@ts-expect-error
        let deltaV = p_difference.normalized().scaledBy(distanceToMove);
        //console.log(deltaV.x, deltaV.y, p_difference.magnitude(), safety-p_difference.magnitude());
        return deltaV;
    }
    //Moves away when the repulsion is less than a circumference away at a right angle. 
    tangentSkirt(target, safety) {
        let p_difference = Vector.subtracting(this.position, target);
        let distanceToMove = Math.max(safety - p_difference.magnitude(), 0);
        if (distanceToMove === 0) {
            return Vector.zero2D();
        }
        let deltaV = Vector.create2DAngleVector(p_difference.perpendicularAngle2D(), distanceToMove);
        //console.log(deltaV.x, deltaV.y, p_difference.magnitude(), safety-p_difference.magnitude());
        return deltaV;
    }
    applyInternalPower(acceleration) {
        //console.log("start", this.acceleration.x, this.acceleration.y);
        let newA = this._acceleration.addedTo(acceleration); //.limited(this.maxPush);
        //console.log("newA", newA.x, newA.y);
        this._acceleration = acceleration.addedTo(acceleration).limited(this.maxPush);
        //console.log("after", this.acceleration.x, this.acceleration.y);
    }
    checkForArrival(target) {
        return this._position.distanceTo(target) < this.dockingDistance;
    }
    //Have to redeclare to add dampening. 
    update() {
        this._velocity = this.velocity.addedTo(this.acceleration).scaledBy(this.drag);
        this._velocity = this._velocity.limited(this.maxSpeed);
        this._position = this._position.addedTo(this.velocity);
        this._acceleration = new Vector(0, 0);
    }
    wallBounce(canvas_w, canvas_h, inset, rebound) {
        return this.worldEdgeBounce(0, 0, canvas_w, canvas_h, 20 + inset, rebound);
    }
    wallWrap(canvas_w, canvas_h) {
        let result = this.edgeWrapResult(0, 0, canvas_w, canvas_h, this.dockingDistance);
        this.teleport(result.newPosition);
        return result.edgeCrossed;
    }
}
