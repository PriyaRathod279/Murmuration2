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

  // Title and description
  createDiv("<h1>Murmured</h1>")
    .style('font-family', 'Courier, monospace')
    .style('text-align', 'center');
  createDiv(`
    Murmured is an interactive exploration of time and weather, responding to the circadian rhythm. 
    Touch, slide, listen and observe as murmuration patterns shift with the natural rhythm of the day. 
    Reflect on your connection with these feathered sparks of nature.<br><br>
    An exploration by Deeptam Das & Priya Rathod, Interaction Design.
  `)
    .style('font-family', 'Courier, monospace')
    .style('text-align', 'center')
    .style('max-width', '800px')
    .style('margin', 'auto');

  // Flock initialization
  flock = new Flock();
  for (let i = 0; i < 2000; i++) {
    let b = new Boid(width / 2 + random(-50, 50), height / 2 + random(-50, 50));
    flock.addBoid(b);
  }

  // Left side controls
  let leftControls = createDiv('').style('text-align', 'center');

  // Daylight slider
  createP("DAYLIGHT").parent(leftControls);
  daylightSlider = createSlider(0, 1, 0.5, 0.01).parent(leftControls);
  createDiv('Sunrise | Sunset').parent(leftControls);

  // Sky condition slider
  createP("SKY CONDITION").parent(leftControls);
  skyConditionSlider = createSlider(0, 1, 0.5, 0.01).parent(leftControls);
  createDiv('Rainy | Clear').parent(leftControls);

  // Humidity slider
  createP("HUMIDITY").parent(leftControls);
  humiditySlider = createSlider(0, 100, 50, 1).parent(leftControls);
  createDiv('Humid | Dry').parent(leftControls);

  murmurationSound.loop();
}

function draw() {
  background(255);

  daylightValue = daylightSlider.value();
  let skyConditionValue = skyConditionSlider.value();
  currentHumidity = humiditySlider.value();

  if (weatherData) {
    currentTemp = lerp(currentTemp, targetTemp, 0.05);
    currentHumidity = lerp(currentHumidity, targetHumidity, 0.05);

    for (let boid of flock.boids) {
      boid.updateWeatherEffects(currentTemp, currentHumidity, weatherCondition, daylightValue, skyConditionValue);
    }
  }

  flock.run();
  adjustBoidCount(daylightValue, skyConditionValue);
  adjustSoundVolumeAndPitch();

  if (repelPoints.length > 0) {
    flock.repelMultiple(repelPoints);
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    repelPoints.push(createVector(mouseX, mouseY));
    repelSound.setVolume(0.1);
    repelSound.play(0, 1, 0.2, 0, 1.5);
  }
}

function mouseReleased() {
  if (repelSound.isPlaying()) {
    repelSound.fade(0, 1.5);
  }
  repelPoints = [];
}

function adjustBoidCount(daylightValue, skyConditionValue) {
  let targetBoidCount = map(daylightValue, 0, 1, 500, 1700);
  while (flock.boids.length > targetBoidCount) flock.boids.pop();
  while (flock.boids.length < targetBoidCount) {
    let b = new Boid(width / 2 + random(-100, 100), height / 2 + random(-100, 100));
    flock.addBoid(b);
  }
}

function adjustSoundVolumeAndPitch() {
  let avgSpeed = flock.getAverageSpeed();
  murmurationSound.rate(map(avgSpeed, 2, 7, 0.8, 1.5));
  murmurationSound.setVolume(flock.boids.length / 1200);
}

function loadWeatherData() {
  loadJSON(apiURL, processWeatherData, handleError);
}

function processWeatherData(data) {
  weatherData = data;

  targetTemp = weatherData.main.temp;
  targetHumidity = weatherData.main.humidity;
  weatherCondition = weatherData.weather[0].description;

  let now = millis() / 1000 + weatherData.timezone;
  let sunrise = weatherData.sys.sunrise;
  let sunset = weatherData.sys.sunset;

  daylightValue = (now < sunrise || now > sunset) ? 0 : map(now, sunrise, sunset, 0, 1);
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
    return this.boids.reduce((sum, b) => sum + b.velocity.mag(), 0) / this.boids.length;
  }
}

// Boid class (inherits weather effects)
class Boid {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.position = createVector(x, y);
    this.maxspeed = 3;
    this.maxforce = 0.3;
  }

  run(boids) {
    this.update();
    this.borders();
    this.render();
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  render() {
    fill(50);
    noStroke();
    ellipse(this.position.x, this.position.y, 2, 2);
  }

  borders() {
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y > height) this.position.y = 0;
  }
}
