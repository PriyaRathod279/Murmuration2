let birds = [];
let slider1, slider2, slider3;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Initialize sliders
    slider1 = select('#slider1');
    slider2 = select('#slider2');
    slider3 = select('#slider3');

    // Create flock of birds
    for (let i = 0; i < 200; i++) {
        birds.push(new Bird(random(width * 0.4, width * 0.6), random(height * 0.4, height * 0.6)));
    }
}

function draw() {
    background(255);

    // Update and display all birds
    for (let bird of birds) {
        bird.flock(birds);
        bird.update();
        bird.show();
    }
}

// Resize canvas dynamically
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Bird class for movement
class Bird {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector();
        this.maxSpeed = 4;
        this.maxForce = 0.1;
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        // Wrap edges for continuous movement
        this.edges();
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    flock(birds) {
        let alignment = this.align(birds);
        let cohesion = this.cohere(birds);
        let separation = this.separate(birds);

        // Use slider values to influence behavior
        alignment.mult(slider1.value() / 100);
        cohesion.mult(slider2.value() / 100);
        separation.mult(slider3.value() / 100);

        this.applyForce(alignment);
        this.applyForce(cohesion);
        this.applyForce(separation);
    }

    align(birds) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of birds) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohere(birds) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        for (let other of birds) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separate(birds) {
        let perceptionRadius = 30;
        let steering = createVector();
        let total = 0;
        for (let other of birds) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    edges() {
        if (this.position.x > width) this.position.x = 0;
        if (this.position.x < 0) this.position.x = width;
        if (this.position.y > height) this.position.y = 0;
        if (this.position.y < 0) this.position.y = height;
    }

    show() {
        stroke(0);
        strokeWeight(2);
        fill(50);
        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        triangle(0, -5, 10, 0, 0, 5);
        pop();
    }
}
