function setup() {

  frameRate(32);

  drawMainLayout();
  updateSliders();

  // CREATE STARTING FOOD
  for (let i = 0; i < food_amt; i++) {
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }

  // CREATE STARTING POISON
  for (let i = 0; i < poison_amt; i++) {
    let x = random(width);
    let y = random(height);
    poison.push(createVector(x, y));
  }

  // CREATE STARTING VEHICLES
  for (let i = 0; i < v_amt; i++) {
    let x = random(width);
    let y = random(height);
    v[i] = new Vehicle(x, y);
  }

  // UPDATE PER SLIDER VALUES
  setTimeout(foodRate, food_rate);
  setTimeout(poisonRate, poison_rate);
  setTimeout(reproductionRate, reproduction_rate);

  // ONCE PER SECOND
  setInterval(healthTick, 1000);
  setInterval(updateStats, 1000);

}

function draw() {
  background(51);

  // DRAW EACH FOOD
  for (let i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, target_radius, target_radius);
  }

  // DRAW EACH POISON
  for (let i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, target_radius, target_radius);
  }

  let bestHealth = 0;
  let thisBestIndex;

  // VEHICLES LOOP
  for (let i = v.length-1; i >= 0; i--) {
    let vhealth = v[i].health;

    // Call the appropriate steering behaviors for our agents
    if (v[i].dead()) {

      if (i == best_health_index) {
        thisBestIndex = 0;
      }

      // Agent is dead
      let x = v[i].position.x;
      let y = v[i].position.y;
      food.push(createVector(x, y));
      v.splice(i, 1);
    }
    else {

      if (vhealth > bestHealth) {
        bestHealth = vhealth;
        thisBestIndex = i;
      }
      // Calculate vehicle's behaviors
      v[i].boundaries();
      v[i].behaviors(food, poison);
      v[i].update();

      // SHOW VEHICLE
      v[i].display(i==best_health_index);
    }
  }

  best_health_index = thisBestIndex;

} // END OF DRAW LOOP
