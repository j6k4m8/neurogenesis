class Neuron {
    ArrayList<Process> ps = new ArrayList<Process>();
    PVector loc;
    float somaSize = 25;
    boolean firstFrame = true, keepAlive = true;

    Neuron(int x, int y) {
        loc = new PVector(x, y);
        int procs = (int)random(2, 2);
        for (int i = 0; i < procs; i++) {
            float deg = random(0, 2*PI);
            ps.add(new Process(
                    x+(int)(somaSize/4 * cos(deg)),
                    y+(int)(somaSize/4 * sin(deg)), somaSize / 1.5));
        }
        float deg = random(0, 2*PI);
        ps.add(new Process(true,
                    x+(int)(somaSize/4 * cos(deg)),
                    y+(int)(somaSize/4 * sin(deg)), somaSize));
    }


    void frame() {
        if (firstFrame) {
            fill(255, 50);
            ellipse(this.loc.x, this.loc.y, this.somaSize, this.somaSize);
            firstFrame = false;
        }
        ArrayList<Process> toAdd = new ArrayList<Process>();
        keepAlive = false;
        for (Process p : ps) {
            Process n = p.frame();
            if (p.isGrowing) {
                keepAlive = true;
            }
            if (n != null) {
                toAdd.add(n);
            }
        }
        for (Process p : toAdd) {
            ps.add(p);
        }

    }
}

class Process {
    PVector loc, v;
    float rad;
    float weight = 20;
    boolean isAxon = false;
    boolean isGrowing = true;

    Process(float x, float y, float r) {
        loc = new PVector(x, y);
        v = new PVector(0, 0);
        rad = r;
    }

    Process(boolean a, float x, float y, float r) {
        isAxon = a;
        loc = new PVector(x, y);
        v = new PVector(0, 0);
        rad = r;
    }

    Process(float x, float y, float vx, float vy, float r) {
        loc = new PVector(x, y);
        v = new PVector(vx, vy);
        rad = r;
    }

    Process frame() {
        if (rad > 0.5) {
            fill(255, 10);
            ellipse(loc.x, loc.y, rad, rad);
                fill(255, 20);
                ellipse(loc.x, loc.y, rad/1.2, rad/1.2);
                    fill(255, 50);
                    ellipse(loc.x, loc.y, rad/1.52, rad/1.52);
            loc.x += v.x;
            loc.y += v.y;
            if (!isAxon) {
                v.x += random(-10/weight, 10/weight);
                v.y += random(-10/weight, 10/weight);
                rad /= random(1.01, 1.02);
            } else {
                v.x += random(-5/weight, 5/weight);
                v.y += random(-5/weight, 5/weight);
                rad -= random(0.1, 0.3);
            }
        } else {
            isGrowing = false;
        }
        return branch();
    }

    Process branch() {
        Process n = null;
        if ((int)random(50) == 42) {
            this.rad /= 1.1;
            rotate(v, random(-1 * QUARTER_PI, QUARTER_PI));
            n = new Process(loc.x, loc.y, v.x, v.y, rad);
            rotate(v, random(-1 * HALF_PI, HALF_PI));
        }
        return n;
    }
}

ArrayList<Neuron> ns = new ArrayList<Neuron>();

void setup() {
    background(0);
    size(screen.width, screen.height);
    noStroke();
}

void draw() {
    for (Neuron n : ns) {
        if (n.keepAlive)
            n.frame();
    }
    //rect(0, 0, width, height);
}

void mouseClicked() {
    ns.add(new Neuron(mouseX, mouseY));
}

void rotate2D(PVector v, float theta) {
  float xTemp = v.x;
  v.x = v.x*cos(theta) - v.y*sin(theta);
  v.y = xTemp*sin(theta) + v.y*cos(theta);
}