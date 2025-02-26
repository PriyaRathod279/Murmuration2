let flock;
let weatherData; // To store the weather data
let apiURL = "https://api.openweathermap.org/data/2.5/weather?q=Bengaluru&APPID=aacedc9a30cfcbe4d7e237cd5ad4830b";

let currentTemp = 273; // Initial temperature in Kelvin
let targetTemp = 273; // Target temperature
let currentHumidity = 50; // Initial humidity
let targetHumidity = 50;
let daylightValue = 0; // Amount of sunlight
let weatherCondition = ""; // Current weather condition

let daylightSlider; // Slider for controlling daylight
let humiditySlider; // Slider for controlling humidity
let skyConditionSlider; // Slider for controlling sky condition

let murmurationSound; // Sound object for murmuration
let repelSound; // Sound object for repelling effect

let repelPoints = []; // Array to store multiple repelling points

function preload() {
  murmurationSound = loadSound("STARLINGS.mp3"); // Load the murmuration sound
  repelSound = loadSound("FLIGHT.mp3"); // Load the repel sound
}

function setup() {
  createCanvas(1200, 600);
  loadWeatherData();
  setInterval(loadWeatherData, 10000);

// Create heading "Murmured"
let title = createDiv("Murmured");
title.style('font-family', 'Courier, monospace');
title.style('font-size', '36px');
title.style('font-weight', 'bold');
title.style('text-align', 'center');
title.style('margin-bottom', '20px');

// Create description
let description = createDiv(`
  Murmured is an interactive exploration of time and weather, responding to the circadian rhythm. Touch, slide, listen and observe as murmuration patterns shift with the natural rhythm of the day. Reflect on your connection with these feathered sparks of nature. <br><br>
  An exploration by Deeptam Das & Priya Rathod, Interaction Design
`);
description.style('font-family', 'Courier, monospace');
description.style('font-size', '16px');
description.style('text-align', 'center');
description.style('max-width', '800px');
description.style('margin', '0 auto 40px auto'); // Center and add space below


  flock = new Flock();
  
  // Add initial boids
  for (let i = 0; i < 2000; i++) {
    let b = new Boid(width / 2 + random(-50, 50), height / 2 + random(-50, 50));
    flock.addBoid(b);
  }

  // Left side controls container
  // Centered controls container
let leftControls = createDiv('');
leftControls.style('width', '400px'); 
leftControls.style('margin', '0 auto'); // Center horizontally
leftControls.style('text-align', 'center'); // Center the content
leftControls.style('position', 'relative'); // Keep position relative for normal flow


  // Daylight slider with heading and legends
  createP("DAYLIGHT").parent(leftControls)
    .style('font-weight', 'bold')
    .style('margin', '0')
    .style('font-family', 'Arial, sans-serif');
  daylightSlider = createSlider(0, 1, 0.5, 0.01);
  daylightSlider.parent(leftControls);
  let daylightLegends = createDiv('');
  daylightLegends.parent(leftControls);
  daylightLegends.style('width', '200px');
  daylightLegends.style('display', 'flex');
  daylightLegends.style('justify-content', 'space-between');
  daylightLegends.style('font-family', 'Arial, sans-serif');
  daylightLegends.style('font-size', '12px');
  createSpan('Sunrise').parent(daylightLegends);
  createSpan('Sunset').parent(daylightLegends);

  // Sky condition slider with heading and legends
  createP("SKY CONDITION").parent(leftControls)
    .style('font-weight', 'bold')
    .style('margin', '10px 0 0 0')
    .style('font-family', 'Arial, sans-serif');
  skyConditionSlider = createSlider(0, 1, 0.5, 0.01);
  skyConditionSlider.parent(leftControls);
  let skyLegends = createDiv('');
  skyLegends.parent(leftControls);
  skyLegends.style('width', '200px');
  skyLegends.style('display', 'flex');
  skyLegends.style('justify-content', 'space-between');
  skyLegends.style('font-family', 'Arial, sans-serif');
  skyLegends.style('font-size', '12px');
  createSpan('Rainy').parent(skyLegends);
  createSpan('Clear').parent(skyLegends);

  // Humidity slider with heading and legends
  createP("HUMIDITY").parent(leftControls)
    .style('font-weight', 'bold')
    .style('margin', '10px 0 0 0')
    .style('font-family', 'Arial, sans-serif');
  humiditySlider = createSlider(0, 100, 50, 1);
  humiditySlider.parent(leftControls);
  let humidityLegends = createDiv('');
  humidityLegends.parent(leftControls);
  humidityLegends.style('width', '200px');
  humidityLegends.style('display', 'flex');
  humidityLegends.style('justify-content', 'space-between');
  humidityLegends.style('font-family', 'Arial, sans-serif');
  humidityLegends.style('font-size', '12px');
  createSpan('Humid').parent(humidityLegends);
  createSpan('Dry').parent(humidityLegends);

 /* // Right side form container - moved to rightmost end
  let rightControls = createDiv('');
  rightControls.position(width - 220, height + 10); // Moved further right
  rightControls.style('width', '200px'); // Made container narrower
  rightControls.style('font-family', 'Arial, sans-serif');

  // Date of birth input
  createP("DATE OF BIRTH").parent(rightControls)
    .style('font-weight', 'bold')
    .style('margin', '0');
  let dobInput = createInput('', 'date');
  dobInput.parent(rightControls);
  dobInput.style('width', '100%'); // Full width of container
  dobInput.style('margin', '5px 0');
  dobInput.style('padding', '5px');
  dobInput.style('box-sizing', 'border-box');

  // Time of day dropdown
  createP("TIME OF THE DAY").parent(rightControls)
    .style('font-weight', 'bold')
    .style('margin', '10px 0 0 0');
  let timeSelect = createSelect();
  timeSelect.parent(rightControls);
  timeSelect.style('width', '100%'); // Full width of container
  timeSelect.style('margin', '5px 0');
  timeSelect.style('padding', '5px');
  timeSelect.style('box-sizing', 'border-box');
  
  // Add options to dropdown
  timeSelect.option('Morning');
  timeSelect.option('Afternoon');
  timeSelect.option('Evening');
  timeSelect.option('Night');
  
  // Generate button
  let generateButton = createButton('Generate');
  generateButton.parent(rightControls);
  generateButton.style('background-color', 'black');
  generateButton.style('color', 'white');
  generateButton.style('border', 'none');
  generateButton.style('padding', '10px 20px');
  generateButton.style('border-radius', '5px');
  generateButton.style('cursor', 'pointer');
  generateButton.style('margin-top', '15px');
  generateButton.style('width', '100%'); // Full width of container
  generateButton.mousePressed(downloadPattern);*/

  murmurationSound.loop();
}

// Function to download the pattern
function downloadPattern() {
  let timestamp = year() + nf(month(), 2) + nf(day(), 2) + '-' + nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);
  saveCanvas('murmuration-' + timestamp, 'png');
}

function draw() {
  background(255); // Keep the background white at all times

  // Update sliders' values
  daylightValue = daylightSlider.value();
  let skyConditionValue = skyConditionSlider.value();
  currentHumidity = humiditySlider.value();

  if (weatherData) {
    // Smooth transitions for temperature and humidity
    currentTemp = lerp(currentTemp, targetTemp, 0.05);
    currentHumidity = lerp(currentHumidity, targetHumidity, 0.05);

    // Pass weather data to each boid
    for (let boid of flock.boids) {
      boid.updateWeatherEffects(currentTemp, currentHumidity, weatherCondition, daylightValue, skyConditionValue);
    }
  }

  flock.run();
  adjustBoidCount(daylightValue, skyConditionValue); // Adjust number of boids based on time of day and sky condition

  adjustSoundVolumeAndPitch(); // Adjust sound volume and pitch based on flock dynamics

  // Handle repelling points
  if (repelPoints.length > 0) {
    flock.repelMultiple(repelPoints);
  }
}

function mousePressed() {
  // Only add a repelling point if the mouse is within the canvas bounds
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    repelPoints.push(createVector(mouseX, mouseY)); // Add new repelling point
    repelSound.setVolume(0.1); // Reduce sound volume
    repelSound.play(0, 1, 0.2, 0, 1.5); // Play the repel sound for 1-2 seconds
  }
}

function mouseReleased() {
  // Fade out the repel sound when the mouse is released
  if (repelSound.isPlaying()) {
    repelSound.fade(0, 1.5); // Fade out over 1.5 seconds
  }
  repelPoints = []; // Clear repelling points when mouse is released
}

function adjustBoidCount(daylightValue, skyConditionValue) {
  let targetBoidCount = map(daylightValue, 0, 1, 500, 1700); // Fewer boids at night, more during day
  while (flock.boids.length > targetBoidCount) flock.boids.pop(); // Remove excess
  while (flock.boids.length < targetBoidCount) {
    let b = new Boid(width / 2 + random(-100, 100), height / 2 + random(-100, 100));
    flock.addBoid(b);
  }
}

function adjustSoundVolumeAndPitch() {
  let avgSpeed = flock.getAverageSpeed();
  murmurationSound.rate(map(avgSpeed, 2, 7, 0.8, 1.5)); // Adjust pitch based on average speed
  let density = flock.boids.length / 1200; // Normze density between 0 and 1
  murmurationSound.setVolume(density);
}

function loadWeatherData() {
  loadJSON(apiURL, processWeatherData, handleError);
}

function processWeatherData(data) {
  weatherData = data;

  targetTemp = weatherData.main.temp;
  targetHumidity = weatherData.main.humidity;
  weatherCondition = weatherData.weather[0].description;

  let now = millis() / 1000 + weatherData.timezone; // Adjust for timezone
  let sunrise = weatherData.sys.sunrise;
  let sunset = weatherData.sys.sunset;

  if (now < sunrise || now > sunset) {
    daylightValue = 0;
  } else {
    daylightValue = map(now, sunrise, sunset, 0, 1); // Scale daylight between [0, 1]
  }
}

function handleError(err) {
  console.error("Error loading weather data:", err);
}

// Flock class
class Flock {
  constructor() {
    this.boids = [];
  }

  run() {
    for (let boid of this.boids) {
      boid.run(this.boids);
    }
  }

  repelMultiple(points) {
    for (let point of points) {
      for (let boid of this.boids) {
        let distance = p5.Vector.dist(boid.position, point);

        if (distance < 200) {
          let repelForce = p5.Vector.sub(boid.position, point);
          repelForce.setMag(map(distance, 0, 200, boid.maxforce * 20, 0));
          boid.applyForce(repelForce);
        }
      }
    }
  }

  addBoid(b) {
    this.boids.push(b);
  }

  getAverageSpeed() {
    let totalSpeed = 0;
    for (let boid of this.boids) {
      totalSpeed += boid.velocity.mag();
    }
    return totalSpeed / this.boids.length;
  }
}

// Boid class
class Boid {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.r = 1.5;
    this.maxspeed = 3;
    this.maxforce = 0.3;
    this.separationFactor = 20.0;
    this.cohesionFactor = 20.0;
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.borders();
    this.render();
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  updateWeatherEffects(temp, humidity, skyCondition, daylightValue, skyConditionValue) {
    let tempFactor = map(temp, 270, 310, 1.0, 2.0);
    this.cohesionFactor = tempFactor;

    let humidityFactor = map(humidity, 0, 100, 1.0, 3.0);
    this.separationFactor = humidityFactor;

    if (skyConditionValue < 0.5) {
      this.maxspeed = 7;
      this.maxforce = 0.5;
    } else {
      this.maxspeed = 3;
      this.maxforce = 0.3;
    }

    if (daylightValue < 0.2) {
      this.maxspeed = 2;
      this.maxforce = 0.2;
    }
  }

  flock(boids) {
    let sep = this.separate(boids).mult(this.separationFactor || 2.0);
    let ali = this.align(boids).mult(2);
    let coh = this.cohesion(boids).mult(this.cohesionFactor || 1);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  render() {
    let theta = this.velocity.heading() + radians(90);
    fill(50);
    stroke(50);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  borders() {
    let margin = 220;
    if (this.position.x < margin) this.applyForce(createVector(this.maxforce, 0));
    if (this.position.y < margin) this.applyForce(createVector(0, this.maxforce));
    if (this.position.x > width - margin) this.applyForce(createVector(-this.maxforce, 0));
    if (this.position.y > height - margin) this.applyForce(createVector(0, -this.maxforce));
  }

  separate(boids) {
    let desiredSeparation = 20.0;
    let steer = createVector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) steer.div(count);
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  align(boids) {
    let neighborDist = 30;
    let sum = createVector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < neighborDist) {
        sum.add(other.velocity);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    }
    return createVector(0, 0);
  }

  cohesion(boids) {
    let neighborDist = 30;
    let sum = createVector(0, 0);
    let count = 0;

    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < neighborDist) {
        sum.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.sub(this.position);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    }
    return createVector(0, 0);
  }
}
