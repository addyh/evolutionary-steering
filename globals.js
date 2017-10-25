let v = [];
let food = [];
let poison = [];

let best_health_index = 0;

let show_stats = true;
let target_radius = 4; // radius of food and poison

let v_amt      = 15;  // vehicles at start
let food_amt   = 40; // food at start
let poison_amt = 20; // poison at start

let mutation_rate = 1;

let health_tick = .1; // health lost per second
let reproduction_rate = -5;
let food_rate = 0;
let poison_rate = 0;
let food_value = 1;   // health gained from a food
let poison_value = -2;   // health lost from a poison
let max_speed = 5;
let max_force = 0.5;
let food_attract = 1;
let poison_attract = 1
let food_percept = 50;
let poison_percept = 50;

let border_size = '3px solid black';
let min_div_width = 100;

let sliderdiv;
let dnadiv;
let myconsole;
let canvas;
let controls;
let debug;

let sld_health_tick;
let val_health_tick;

let sld_reproduction_rate;
let val_reproduction_rate;

let sld_food_rate;
let val_food_rate;

let sld_poison_rate;
let val_poison_rate;

let sld_food_value;
let val_food_value;

let sld_poison_value;
let val_poison_value;

let sld_max_speed;
let val_max_speed;

let sld_max_force;
let val_max_force;

let sld_food_attract;
let val_food_attract;

let sld_poison_attract;
let val_poison_attract;

let sld_food_percept;
let val_food_percept;

let sld_poison_percept;
let val_poison_percept;

let btn_add_food;
let btn_add_poison;
let btn_add_vehicle;
let btn_remove_food;
let btn_remove_poison;
let btn_remove_vehicles;

function drawMainLayout() {

  sliderdiv = createDiv(' ').addClass('slider-div').mouseMoved(updateSliders).changed(updateSliders);
  createP('<hr />').parent(sliderdiv).addClass('slider-hr');

  // HEALTH TICK SLIDER
  createDiv('Health Tick').parent(sliderdiv).addClass('slider-label');
  val_health_tick = createDiv(' ').parent(sliderdiv).addClass('slider-val red');
  sld_health_tick = createSlider(0, 1, health_tick, .01).parent(sliderdiv).addClass('slider');
  createP('<hr />').parent(sliderdiv).addClass('slider-hr');

  // REPRODUCTION RATE SLIDER
  createDiv('Reproduction Rate').parent(sliderdiv).addClass('slider-label');
  val_reproduction_rate = createDiv(' ').parent(sliderdiv).addClass('slider-val');
  sld_reproduction_rate = createSlider(-10, 9, reproduction_rate, 1).parent(sliderdiv).addClass('slider');
  createP('<hr />').parent(sliderdiv).addClass('slider-hr');

  // FOOD RATE SLIDER
  createDiv('Food Rate').parent(sliderdiv).addClass('slider-label green');
  val_food_rate = createDiv(' ').parent(sliderdiv).addClass('slider-val');
  sld_food_rate = createSlider(-10, 18, food_rate, 1) .parent(sliderdiv).addClass('slider');
  createP('<hr />').parent(sliderdiv).addClass('slider-hr');

  // POISON RATE SLIDER
  createDiv('Poison Rate').parent(sliderdiv).addClass('slider-label red');
  val_poison_rate = createDiv(' ').parent(sliderdiv).addClass('slider-val');
  sld_poison_rate = createSlider(-10, 9, poison_rate, 1).parent(sliderdiv).addClass('slider');
  createP('<hr />').parent(sliderdiv).addClass('slider-hr');

  // FOOD VALUE SLIDER
  createDiv('Food Value').parent(sliderdiv).addClass('slider-label green');
  val_food_value = createDiv(' ').parent(sliderdiv).addClass('slider-val green');
  sld_food_value = createSlider(.1, 5, food_value, .1).parent(sliderdiv).addClass('slider');
  createP('<hr />').parent(sliderdiv).addClass('slider-hr');

  // POISON VALUE SLIDER
  createDiv('Poison Value').parent(sliderdiv).addClass('slider-label red');
  val_poison_value = createDiv(' ').parent(sliderdiv).addClass('slider-val red');
  sld_poison_value = createSlider(-5, -.1, poison_value, .1).parent(sliderdiv).addClass('slider rtl');
  createP('<hr />').parent(sliderdiv).addClass('slider-hr');

  // MAX SPEED SLIDER
  createDiv('Max Speed').parent(sliderdiv).addClass('slider-label');
  val_max_speed = createDiv(' ').parent(sliderdiv).addClass('slider-val');
  sld_max_speed = createSlider(1, 10, max_speed, 1).parent(sliderdiv).addClass('slider');
  createP('<hr />').parent(sliderdiv).addClass('slider-hr');

  // MAX FORCE SLIDER
  createDiv('Max Accel.').parent(sliderdiv).addClass('slider-label');
  val_max_force = createDiv(' ').parent(sliderdiv).addClass('slider-val');
  sld_max_force = createSlider(.1, 1, max_force, .1).parent(sliderdiv).addClass('slider');
  createP('<hr />').parent(sliderdiv).addClass('slider-hr');

  // DNA MUTATION DIV
  createP('DNA Mutation Rates').parent(sliderdiv).addClass('mutation');
  createP('<hr />').parent(sliderdiv).addClass('slider-hr');

  dnadiv = createDiv('<img style="float:left;margin-top: -10px; margin-right: 8px;" src="dna.png" width="40px" height="275px">').parent(sliderdiv);
  createDiv('<img style="float:right;margin-top: -10px; margin-right: 8px;" src="dna.png" width="40px" height="275px">').parent(dnadiv);

  // FOOD ATTRACT SLIDER
  createDiv('Food Attraction Force').parent(dnadiv).addClass('dna-label green');
  sld_food_attract = createSlider(0, 5, food_attract, .5).parent(dnadiv).addClass('dna-slider');
  val_food_attract = createDiv(' ').parent(dnadiv).addClass('dna-val');
  createDiv('<hr />').parent(dnadiv).addClass('dna-hr');

  // POISON ATTRACT SLIDER
  createDiv('Poison Attraction Force').parent(dnadiv).addClass('dna-label red');
  sld_poison_attract = createSlider(0, 5, poison_attract, .5).parent(dnadiv).addClass('dna-slider');
  val_poison_attract = createDiv(' ').parent(dnadiv).addClass('dna-val');
  createDiv('<hr />').parent(dnadiv).addClass('dna-hr');

  // FOOD PERCEPT SLIDER
  createDiv('Food Perception Radius').parent(dnadiv).addClass('dna-label green');
  sld_food_percept = createSlider(0, 200, food_percept, 10).parent(dnadiv).addClass('dna-slider');
  val_food_percept = createDiv(' ').parent(dnadiv).addClass('dna-val');
  createDiv('<hr />').parent(dnadiv).addClass('dna-hr');

  // POISON PRECEPT SLIDER
  createDiv('Poison Perception Radius').parent(dnadiv).addClass('dna-label red');
  sld_poison_percept = createSlider(0, 200, poison_percept, 10).parent(dnadiv).addClass('dna-slider');
  val_poison_percept = createDiv(' ').parent(dnadiv).addClass('dna-val');
  createDiv('<hr />').parent(dnadiv).addClass('dna-hr');

  createDiv('<hr />').parent(dnadiv).addClass('slider-hr');

  // CANVAS
  canvas = createCanvas(640,360).attribute('oncontextmenu','return false;');

  // BUTTONS
  controls = createDiv(' ').addClass('controls');
  debug = createCheckbox('Show Debugging?').parent(controls).addClass('debug');

  // $('button:first').position().top > height

  createP('<br>').parent(controls);
  btn_add_food = createButton('Add Food (Left mouse btn)').addClass('success').parent(controls).mousePressed(addFood);
  createP(' ').parent(controls);
  btn_add_poison = createButton('Add Poison (Right mouse btn)').addClass('success').parent(controls).mousePressed(addPoison);
  createP(' ').parent(controls);
  btn_add_vehicle = createButton('Add Vehicle (Middle mouse btn)').addClass('success').parent(controls).mousePressed(addVehicle);
  createP(' ').parent(controls);
  btn_remove_food = createButton('Remove All Food').addClass('warning').parent(controls).mousePressed(removeFood);
  createP(' ').parent(controls);
  btn_remove_poison = createButton('Remove All Poison').addClass('warning').parent(controls).mousePressed(removePoison);
  createP(' ').parent(controls);
  btn_remove_vehicles = createButton('Remove All Vehicles').addClass('danger').parent(controls).mousePressed(removeVehicles);

  // STATS CONSOLE
  myconsole = createP(' ').addClass('myconsole');
}

// Did we click inside the canvas?
function inCanvas() {
  return (mouseX > 0
        && mouseX < width
        && mouseY > 0
        && mouseY < height);
}

// Add food, poison, vehicle on click
function mousePressed() {
  if (inCanvas()) {
    if (mouseButton == LEFT)
      food.push(createVector(mouseX, mouseY));
    if (mouseButton == CENTER)
      v.push(new Vehicle(mouseX, mouseY));
    if (mouseButton == RIGHT)
      poison.push(createVector(mouseX, mouseY));

    return false;
  }
}

// Add food, poison, vehicle on drag
function mouseDragged() {
  if (inCanvas()) {
    if (mouseButton == LEFT)
      food.push(createVector(mouseX, mouseY));
    if (mouseButton == CENTER)
      v.push(new Vehicle(mouseX, mouseY));
    if (mouseButton == RIGHT)
      poison.push(createVector(mouseX, mouseY));

    return false;
  }
}

// HEALTH SLIDER
function healthTick() {
  for (let i = 0; i < v.length; i++) {
    v[i].health -= health_tick;
  }
}

// FOOD RATE SLIDER
function foodRate() {
  let x = random(width);
  let y = random(height);
  if (food_rate != 0) {
    food.push(createVector(x, y));
  }
  setTimeout(foodRate, food_rate);
}

// POISON RATE SLIDER
function poisonRate() {
  let x = random(width);
  let y = random(height);
  if (poison_rate != 0) {
    poison.push(createVector(x, y));
  }
  setTimeout(poisonRate, poison_rate);
}

// REPRODUCTION RATE SLIDER
function reproductionRate() {
  let random_v = floor(random(v.length));
  if (v.length > 0 && reproduction_rate != 0 && v[random_v]) {
    let newVehicle = v[random_v].clone();
    v.push(newVehicle);
  }
  setTimeout(reproductionRate, reproduction_rate);
}

// MAX SPEED SLIDER
function updateMaxSpeed() {
  max_speed = sld_max_speed.value();
}

// MAX FORCE SLIDER
function updateMaxForce() {
  max_force = sld_max_force.value();
}

// Give all vehicles the same health
function setHealth(h) {
  for (let i = 0; i < v.length; i++) {
    v[i].health = h;
  }
}

// ADD FOOD BUTTON
function addFood() {
  food.push(createVector(random(width), random(height)));
}

// ADD POISON BUTTON
function addPoison() {
  poison.push(createVector(random(width), random(height)));
}

// ADD VEHICLE BUTTON
function addVehicle() {
  v.push(new Vehicle(random(width), random(height)));
}

// REMOVE FOOD BUTTON
function removeFood() {
  food = [];
}

// REMOVE POISON BUTTON
function removePoison() {
  poison = [];
}

// REMOVE VEHICLES BUTTON
function removeVehicles() {
  v = [];
}

// Expand the slider's values to allow different ranges in one
function inflateSliderValue(n) {
  if (n >= 10 && n <= 18) {
    n = (n-10+2)*10;              // 10 to 18 are really 20 to 100
  }
  else if (n >= 0 && n <= 9) {
    n += 1;                       // 0 to 9 ----> 1 to 10
  }
  else if (n >= -9 && n <= 1) {
    n = (10 + n)/10;              // -9 to 1 ----> .1 to .9
  }
  // else if (n >= -18 && n <= -10) {
  //   n = (9-(-1*(n + 10)))/100;         // -18 to -10 ----> .01 to .09
  // }
  else if (n == -10) {
    n = 0;
  }
  return n;
}

// Update all slider values whenever one is changed
function updateSliders() {
  //let scrollbar = (window.innerWidth-$(window).width());
  //let dropDiv = (windowWidth < width+min_div_width);
  //let wid = dropDiv?'100%':windowWidth-width-scrollbar+'px';
  //let hgt = dropDiv?'':height+'px';
  //div.style('width', wid);
  //div.style('min-height', hgt);
  //div.style('border-left', dropDiv?'0':border_size);
  //div.style('border-top', dropDiv?border_size:'0');
  //myconsole.style('height', windowHeight-height+'px');

  // HEALTH TICK
  health_tick = sld_health_tick.value();
  val_health_tick.html('-' + health_tick.toFixed(2) + ' health/sec');

  // FOOD RATE
  food_rate = inflateSliderValue(sld_food_rate.value());
  val_food_rate.html('+'+food_rate + ' food/sec');
  food_rate = (food_rate==0)?0:1000/food_rate;

  // POISON RATE
  poison_rate = inflateSliderValue(sld_poison_rate.value());
  val_poison_rate.html('+'+poison_rate + ' poison/sec');
  poison_rate = (poison_rate==0)?0:1000/poison_rate;

  // REPRODUCTION RATE
  reproduction_rate = inflateSliderValue(sld_reproduction_rate.value());
  val_reproduction_rate.html(reproduction_rate +
    (reproduction_rate==1?' time/sec':'  times/sec'));
  reproduction_rate = (reproduction_rate==0)?0:1000/reproduction_rate;

  // FOOD VALUE
  food_value = sld_food_value.value();
  val_food_value.html('+' + food_value.toFixed(2) + ' health');

  // POISON VALUE
  poison_value = sld_poison_value.value();
  val_poison_value.html(poison_value.toFixed(2) + ' health');

  // MAX SPEED
  max_speed = sld_max_speed.value();
  val_max_speed.html(max_speed + ' px/frame');

  // MAX FORCE
  max_force = sld_max_force.value();
  val_max_force.html(max_force + ' px/frame&sup2;');

  // FOOD ATTRACT
  food_attract = sld_food_attract.value();
  val_food_attract.html('&plusmn; ' + food_attract + ' <span class="small">px/frame&sup2;/generation</span>');

  // POISON ATTRACT
  poison_attract = sld_poison_attract.value();
  val_poison_attract.html('&plusmn; ' + poison_attract + ' <span class="small">px/frame&sup2;/generation</span>');

  // FOOD PERCEPT
  food_percept = sld_food_percept.value();
  val_food_percept.html('&plusmn; ' + food_percept + ' px <span class="small">/ generation</span>');

  // POISON PERCEPT
  poison_percept = sld_poison_percept.value();
  val_poison_percept.html('&plusmn; ' + poison_percept + ' px <span class="small">/ generation</span>');
}

function updateStats() {
  if (show_stats) {
    let consoledata = '';

    for (let i = 0; i < v.length; i++) {
      colorMode(RGB);
      let grn = color(0, 255, 0);
      let rd = color(255, 0, 0);
      let col = lerpColor(rd, grn, v[i].health);
      let r = col.levels[0].toString(16);
      let g = col.levels[1].toString(16);
      let b = col.levels[2].toString(16);
      r = (r.length==1?'0'+r:r);
      g = (g.length==1?'0'+g:g);
      b = (b.length==1?'0'+b:b);
      let age = (round(millis()/1000) - v[i].age);

      if (i == best_health_index) {
        consoledata += '<span style="background-color:#555555">';
      }

      consoledata += '  v: ' + i +
      '\tage: '+ floor(age/60) + 'm ' + age%60 + 's' +
      '\thealth: <span style="font-weight:bold;color:#'+r+g+b+ '">' +
      v[i].health.toFixed(2) + '</span>' +
      '\tfood_attract:  '  +v[i].dna[0].toFixed(2) +
      '\tpoison_attract:  '+v[i].dna[1].toFixed(2) +
      '\tfood_percept:    '+floor(v[i].dna[2]) +
      '\tpoison_percept:  '+floor(v[i].dna[3]) +
      '  \n';

      if (i == best_health_index) {
        consoledata += '</span>';
      }

    }

    consoledata += '\ngameplay: ' +
                   floor(millis()/1000/60) + ' mins ' +
                   floor(millis()/1000)%60 + ' secs';
    // let tab = '';
    // for (let i = 1; i < 9; i++) {
    //   tab += ' ';
    // }
    // tab += '|';
    // let word = '';
    // for (let i = 0; i < 17; i++) {
    //   word += tab;
    // }
    myconsole.html('<pre>'+consoledata+'</pre>');
  }
}
