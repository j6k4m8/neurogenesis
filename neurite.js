/*

A new version, c2021, for use with p5js.org

*/

Config = {
  style: {
    color: [255],
    alpha: 100,
  },

  neuron: {
    // The size of the cell body
    somaSize: 25,

    // The number of neurites to start with (branches from cell body)
    startingNeurites: 4,

    // The maximum number of neurites PER NEURON to simulate
    maxNeurites: 512,
  },

  neurite: {
    // Larger values are straighter. Smaller values are curlier.
    curliness: 0.5,

    // Smaller values are less branchy. Values closer to 1 may explode
    branchiness: 0.5,

    // Simulation scale
    scale: 2,

    // Default neurite radius for non-axons:
    defaultRadius: 10,
    // Default axon radius:
    defaultAxonRadius: 15,

    // Values over 1 bias toward vertical movement. Under 1 biases more horizontal
    verticalBias: 0.997,

    // Minimum size of a neurite before it's terminated:
    terminalRadius: 3,
  },
};

class Neurite {
  constructor(
    x,
    y,
    r = Config.neurite.defaultRadius,
    initialVelocity = undefined,
    branchiness = Config.neurite.branchiness
  ) {
    this.loc = createVector(x, y);
    this.radius = r;
    this.vel = initialVelocity || createVector(0, 0);
    this.isGrowing = true;
    this.branchiness = branchiness;
  }

  frame() {
    if (this.radius < Config.neurite.terminalRadius) {
      this.isGrowing = false;
      return;
    }

    fill(...Config.style.color, Config.style.alpha);
    ellipse(this.loc.x, this.loc.y, this.radius, this.radius);
    this.loc = this.loc.add(this.vel);

    this.vel.x += random(
      (-10 / this.radius) * Config.neurite.curliness,
      (10 / this.radius) * Config.neurite.curliness
    );
    this.vel.y += random(
      (-10 / this.radius) * Config.neurite.curliness,
      (10 / this.radius) * Config.neurite.curliness
    );
    this.radius *= random(0.98, 1.01);

    this.vel.limit(this.radius / 2);
    this.vel.y *= Config.neurite.verticalBias;

    return this.branch();
  }

  branch() {
    if (random() * 50 <= this.branchiness) {
      this.radius *= 0.9;
      return new Neurite(this.loc.x, this.loc.y, this.radius);
    }
  }
}

class Neuron {
  constructor(x, y) {
    // Create the neuron at the given start position.
    this.loc = createVector(x, y);
    this.neurites = [];
    this.age = 0;

    // Create some small number of starting neurites:
    let procs = round(1 + random() * Config.neuron.startingNeurites);

    for (let i = 0; i < procs; i++) {
      let degree = random(0, 2 * PI);
      // Spawn a new neurite at some rotation from the soma:
      this.neurites.push(
        new Neurite(
          x + (Config.neuron.somaSize / 2) * cos(degree),
          y + (Config.neuron.somaSize / 2) * sin(degree)
        )
      );
    }

    // And add the axon:
    let degree = random(0, 2 * PI);
    this.neurites.push(
      new Neurite(
        x + (Config.neuron.somaSize / 2) * cos(degree),
        y + (Config.neuron.somaSize / 2) * sin(degree),
        Config.neurite.defaultAxonRadius,
        createVector(0, -3),
        0.2
      )
    );

    this.neurites = this.neurites.slice(0, Config.neuron.maxNeurites);
  }

  frame() {
    if (this.age == 0) {
      fill(...Config.style.color, Config.style.alpha + 200);
      ellipse(
        this.loc.x,
        this.loc.y,
        Config.neuron.somaSize,
        Config.neuron.somaSize
      );
    }

    let keepAlive = false;
    for (let neurite of this.neurites) {
      if (neurite.isGrowing) {
        keepAlive = true;
      }

      let n = neurite.frame();
      if (!!n) {
        this.neurites.push(n);
      }
    }
    this.age++;
  }
}

let neurons = [];

function setup() {
  createCanvas(1500, 800);
  noStroke();
  background(0);
}

function draw() {
  for (let neuron of neurons) {
    neuron.frame();
  }
}

function mouseClicked() {
  neurons.push(new Neuron(mouseX, mouseY));
}
