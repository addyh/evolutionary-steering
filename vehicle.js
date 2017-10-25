// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The "Vehicle" class
function Vehicle(x, y, dna) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(0,-2);
  this.position = createVector(x,y);
  this.r = 3;
  this.health = 2;
  this.age = round(millis()/1000);

  if (dna === undefined) {
    this.dna = [
      random(-2, 2),  // food weight
      random(-2, 2),  // poison weight
      random(0, 100), // food perception
      random(0, 100)  // poison perception
    ];
  }
  else {
    this.dna = [
      random(1)<mutation_rate?dna[0] + random(-food_attract, food_attract):dna[0],
      random(1)<mutation_rate?dna[1] + random(-poison_attract, poison_attract):dna[1],
      random(1)<mutation_rate?dna[2] + random(-food_percept, food_percept):dna[2],
      random(1)<mutation_rate?dna[3] + random(-poison_percept, poison_percept):dna[3]
    ];
  }

}

// Method to update location
Vehicle.prototype.update = function() {

  //this.health -= health_tick;

  // Update velocity, and limit it
  this.velocity.add(this.acceleration);
  this.velocity.limit(max_speed);

  // Update position, and limit it
  this.position.add(this.velocity);
  this.position.x = constrain(this.position.x, 0, width);
  this.position.y = constrain(this.position.y, 0, height);

  // Reset accelerationelertion to 0 each cycle
  this.acceleration.mult(0);
}

Vehicle.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

Vehicle.prototype.behaviors = function(good, bad) {
  // Get the steering forces from eat, which gets them from seek
  let attraction = this.eat(good, food_value, this.dna[2]);
  let repulsion = this.eat(bad, poison_value, this.dna[3]);

  // Scale the steering forces via. DNA
  attraction.mult(this.dna[0]);
  repulsion.mult(this.dna[1]);

  this.applyForce(attraction);
  this.applyForce(repulsion);
}

Vehicle.prototype.clone = function () {
  return new Vehicle(this.position.x, this.position.y, this.dna);
}

Vehicle.prototype.eat = function(targets, nutrition, perception) {
  let record = Infinity;
  let closest = null;

  // Loop through all targets
  for (let i = targets.length-1; i >= 0; i--) {
    let d = this.position.dist(targets[i]);
    // Moment of eating
    if (d < max_speed) {
      // Destroy target, and apply nutrition factor
      targets.splice(i, 1);
      this.health += nutrition;
    }
    // Find the closest target that can be perceived
    else if (d < record && d < perception) {
      record = d;
      closest = targets[i];
    }
  }

  if (closest != null) {
    // Steer towards that target
    return this.seek(closest);
  }

  // Target not found, etc.
  return createVector(0, 0);
}

// A method that calculates a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Vehicle.prototype.seek = function(target) {

  let desired = p5.Vector.sub(target, this.position);  // A vector pointing from the location to the target

  // Scale to maximum speed
  desired.setMag(max_speed);

  // Steering = Desired minus velocity
  let steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(max_force);  // Limit to maximum steering force

  return steer;
  //this.applyForce(steer);
}

Vehicle.prototype.dead = function() {
  return (this.health < 0);
}

// Draw a triangle rotated in the direction of velocity
Vehicle.prototype.display = function(isBest) {

  let dna_food_attract = this.dna[0]*20;
  let dna_poison_attract = this.dna[1]*20;
  let dna_food_percept = this.dna[2]*2;
  let dna_poison_percept = this.dna[3]*2;
    
  let theta = this.velocity.heading() + PI/2;
  let rd = color(255, 0, 0);
  let grn = color(0, 255, 0);
  let purp = color(255, 0, 255);
  let deadColor = isBest?color(0):rd;
  let aliveColor = isBest?color(255):grn;
  let col = lerpColor(deadColor, aliveColor, this.health);

  push();

  fill(col);
  stroke(0);
  strokeWeight(1);
  translate(this.position.x,this.position.y);

  if (debug.checked()) {
    textSize(9);
    text(this.health.toFixed(2) + '', 10, 10)
  }

  rotate(theta);
  beginShape();
  vertex(0, -this.r*2);
  vertex(-this.r, this.r*2);
  vertex(this.r, this.r*2);
  endShape(CLOSE);

  if (debug.checked()) {
    dna_food_percept = dna_food_percept<0? 0 : dna_food_percept;
    dna_poison_percept = dna_poison_percept<0? 0 : dna_poison_percept;
    
    stroke(grn);
    strokeWeight(1);
    line(-1, -1, -1, -dna_food_attract);
    noFill();
    ellipse(0, 0, dna_food_percept);
    stroke(rd);
    strokeWeight(1);
    line(1, 1, 1, -dna_poison_attract);
    ellipse(0, 0, dna_poison_percept);
  }

  if (isBest) {
    noStroke();
    fill(0, 255, 0, 20);
    ellipse(0, 0, dna_food_percept);
    fill(255, 0, 0, 20);
    ellipse(0, 0, dna_poison_percept);
  }

  pop();
}

Vehicle.prototype.boundaries = function() {

  let d = 1;
  let desired = null;

  if (this.position.x < d) {
    desired = createVector(max_speed, this.velocity.y);
  }
  else if (this.position.x > width -d) {
    desired = createVector(-max_speed, this.velocity.y);
  }

  if (this.position.y < d) {
    desired = createVector(this.velocity.x, max_speed);
  }
  else if (this.position.y > height-d) {
    desired = createVector(this.velocity.x, -max_speed);
  }

  if (desired !== null) {
    desired.normalize();
    desired.mult(max_speed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(max_force);
    this.applyForce(steer);
  }
}
