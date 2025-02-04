---
description: 聽到打上花火就寫了
title: code煙火
pubDate: 2024/3/31 14:51:53
tags:
  -  不知道
categories:
    - Daily
---
- 只是個煙火

- python版本
```python
import pygame
import random
import math

vector = pygame.math.Vector2

gravity = vector(0, 0.3)
DISPLAY_WIDTH = DISPLAY_HEIGHT = 800

trail_colours = [(45, 45, 45), (60, 60, 60), (75, 75, 75), (125, 125, 125), (150, 150, 150)]
dynamic_offset = 1
static_offset = 3

MAX_FIREWORKS = 200
MAX_PARTICLES = 5000

class Firework:
    def __init__(self):
        self.colour = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        self.colours = (
            (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)),
            (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)),
            (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)))
        self.firework = Particle(random.randint(0, DISPLAY_WIDTH), DISPLAY_HEIGHT, True,
                                 self.colour)
        self.exploded = False
        self.particles = []
        self.min_max_particles = (100, 225)

    def uppubDate(self, win):
        if not self.exploded:
            self.firework.apply_force(gravity)
            self.firework.move()
            for tf in self.firework.trails:
                tf.show(win)

            self.show(win)

            if self.firework.vel.y >= 0:
                self.exploded = True
                self.explode()
        else:
            for particle in self.particles:
                particle.apply_force(vector(gravity.x + random.uniform(-1, 1) / 20, gravity.y / 2 + (random.randint(1, 8) / 100)))
                particle.move()
                for t in particle.trails:
                    t.show(win)
                particle.show(win)

    def explode(self):
        amount = random.randint(*self.min_max_particles)
        for i in range(amount):
            self.particles.append(Particle(self.firework.pos.x, self.firework.pos.y, False, self.colours))

    def show(self, win):
        pygame.draw.circle(win, self.colour, (int(self.firework.pos.x), int(self.firework.pos.y)), self.firework.size)

    def remove(self):
        if self.exploded:
            for p in self.particles:
                if p.remove is True:
                    self.particles.remove(p)

            if len(self.particles) == 0:
                return True
            else:
                return False

class Particle:
    def __init__(self, x, y, firework, colour):
        self.firework = firework
        self.pos = vector(x, y)
        self.origin = vector(x, y)
        self.radius = 20
        self.remove = False
        self.explosion_radius = random.randint(5, 18)
        self.life = 0
        self.acc = vector(0, 0)
        self.trails = []
        self.prev_posx = [-10] * 10
        self.prev_posy = [-10] * 10

        if self.firework:
            self.vel = vector(0, -random.randint(17, 20))
            self.size = 5
            self.colour = colour
            for i in range(5):
                self.trails.append(Trail(i, self.size, True))
        else:
            self.vel = vector(random.uniform(-1, 1), random.uniform(-1, 1))
            self.vel.x *= random.randint(3, self.explosion_radius)
            self.vel.y *= random.randint(3, self.explosion_radius)
            self.size = random.randint(2, 4)
            self.colour = random.choice(colour)
            for i in range(5):
                self.trails.append(Trail(i, self.size, False))

    def apply_force(self, force):
        self.acc += force

    def move(self):
        if not self.firework:
            self.vel.x *= 0.9
            self.vel.y *= 0.9
        self.vel += self.acc
        self.pos += self.vel
        self.acc *= 0

        if self.life == 0 and not self.firework:
            distance = math.sqrt((self.pos.x - self.origin.x) ** 2 + (self.pos.y - self.origin.y) ** 2)
            if distance > self.explosion_radius:
                self.remove = True

        if self.vel.length() < 0.5:
            self.remove = True

        self.decay()

        self.trail_uppubDate()

        self.life += 1

    def show(self, win):
        pygame.draw.circle(win, (self.colour[0], self.colour[1], self.colour[2], 0), (int(self.pos.x), int(self.pos.y)),
                           self.size)

    def decay(self):
        if 50 > self.life > 10:
            ran = random.randint(0, 30)
            if ran == 0:
                self.remove = True
        elif self.life > 50:
            ran = random.randint(0, 5)
            if ran == 0:
                self.remove = True

    def trail_uppubDate(self):
        self.prev_posx.pop()
        self.prev_posx.insert(0, int(self.pos.x))
        self.prev_posy.pop()
        self.prev_posy.insert(0, int(self.pos.y))

        for n, t in enumerate(self.trails):
            if t.dynamic:
                t.get_pos(self.prev_posx[n + dynamic_offset], self.prev_posy[n + dynamic_offset])
            else:
                t.get_pos(self.prev_posx[n + static_offset], self.prev_posy[n + static_offset])

class Trail:
    def __init__(self, n, size, dynamic):
        self.pos_in_line = n
        self.pos = vector(-10, -10)
        self.dynamic = dynamic

        if self.dynamic:
            self.colour = trail_colours[n]
            self.size = int(size - n / 2)
        else:
            self.colour = (255, 255, 200)
            self.size = size - 2
            if self.size < 0:
                self.size = 0

    def get_pos(self, x, y):
        self.pos = vector(x, y)

    def show(self, win):
        pygame.draw.circle(win, self.colour, (int(self.pos.x), int(self.pos.y)), self.size)

def uppubDate(win, fireworks):
    to_remove = []
    for fw in fireworks:
        fw.uppubDate(win)
        if fw.remove():
            to_remove.append(fw)

    for fw in to_remove:
        fireworks.remove(fw)

    pygame.display.uppubDate()

def main():
    pygame.init()
    pygame.font.init()
    pygame.display.set_caption("HI")

    win = pygame.display.set_mode((DISPLAY_WIDTH, DISPLAY_HEIGHT))
    clock = pygame.time.Clock()

    fireworks = [Firework() for i in range(2)]
    running = True

    while running:
        clock.tick(60)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_1:
                    if len(fireworks) < MAX_FIREWORKS:
                        fireworks.append(Firework())
                if event.key == pygame.K_2:
                    for i in range(10):
                        if len(fireworks) < MAX_FIREWORKS:
                            fireworks.append(Firework())
                if event.key == pygame.K_3:
                    for i in range(100):
                        if len(fireworks) < MAX_FIREWORKS:
                            fireworks.append(Firework())
        win.fill((20, 20, 30))

        if random.randint(0, 20) == 1 and len(fireworks) < MAX_FIREWORKS:
            fireworks.append(Firework())

        total_particles = sum(len(fw.particles) for fw in fireworks)
        if total_particles > MAX_PARTICLES:
            for fw in fireworks:
                fw.particles = fw.particles[:MAX_PARTICLES // len(fireworks)]

        uppubDate(win, fireworks)

    pygame.quit()
    quit()

if __name__ == '__main__':
    main()

```
- javascript版本
```javascript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const gravity = { x: 0, y: 0.3 };
const DISPLAY_WIDTH = 800;
const DISPLAY_HEIGHT = 800;

const trail_colours = [
    [45, 45, 45],
    [60, 60, 60],
    [75, 75, 75],
    [125, 125, 125],
    [150, 150, 150]
];
const dynamic_offset = 1;
const static_offset = 3;

const MAX_FIREWORKS = 200;
const MAX_PARTICLES = 5000;

class Firework {
    constructor() {
        this.colour = [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        ];
        this.colours = [
            [
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256)
            ],
            [
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256)
            ],
            [
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256),
                Math.floor(Math.random() * 256)
            ]
        ];
        this.firework = new Particle(
            Math.floor(Math.random() * DISPLAY_WIDTH),
            DISPLAY_HEIGHT,
            true,
            this.colour
        );
        this.exploded = false;
        this.particles = [];
        this.min_max_particles = [100, 225];
    }

    uppubDate() {
        if (!this.exploded) {
            this.firework.apply_force(gravity);
            this.firework.move();
            this.firework.show();
            if (this.firework.vel.y >= 0) {
                this.exploded = true;
                this.explode();
            }
        } else {
            for (const particle of this.particles) {
                particle.apply_force({
                    x: gravity.x + (Math.random() - 0.5) / 20,
                    y: gravity.y / 2 + (Math.floor(Math.random() * 8) + 1) / 100
                });
                particle.move();
                particle.show();
            }
        }
    }

    explode() {
        const amount = Math.floor(
            Math.random() * (this.min_max_particles[1] - this.min_max_particles[0] + 1) +
            this.min_max_particles[0]
        );
        for (let i = 0; i < amount; i++) {
            this.particles.push(
                new Particle(this.firework.pos.x, this.firework.pos.y, false, this.colours)
            );
        }
    }

    remove() {
        if (this.exploded) {
            this.particles = this.particles.filter((p) => !p.remove);
            return this.particles.length === 0;
        }
        return false;
    }
}

class Particle {
    constructor(x, y, firework, colour) {
        this.firework = firework;
        this.pos = { x, y };
        this.origin = { x, y };
        this.radius = 20;
        this.remove = false;
        this.explosion_radius = Math.floor(Math.random() * 14) + 5;
        this.life = 0;
        this.acc = { x: 0, y: 0 };
        this.trails = [];
        this.prev_posx = Array(10).fill(-10);
        this.prev_posy = Array(10).fill(-10);

        if (this.firework) {
            this.vel = { x: 0, y: -Math.floor(Math.random() * 4) - 17 };
            this.size = 5;
            this.colour = colour;
            for (let i = 0; i < 5; i++) {
                this.trails.push(new Trail(i, this.size, true));
            }
        } else {
            this.vel = {
                x: (Math.random() - 0.5) * 2 * Math.floor(Math.random() * this.explosion_radius),
                y: (Math.random() - 0.5) * 2 * Math.floor(Math.random() * this.explosion_radius)
            };
            this.size = Math.floor(Math.random() * 3) + 2;
            this.colour = colour[Math.floor(Math.random() * colour.length)];
            for (let i = 0; i < 5; i++) {
                this.trails.push(new Trail(i, this.size, false));
            }
        }
    }

    apply_force(force) {
        this.acc.x += force.x;
        this.acc.y += force.y;
    }

    move() {
        if (!this.firework) {
            this.vel.x *= 0.9;
            this.vel.y *= 0.9;
        }
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.acc.x = 0;
        this.acc.y = 0;

        if (this.life === 0 && !this.firework) {
            const distance = Math.sqrt(
                (this.pos.x - this.origin.x) ** 2 + (this.pos.y - this.origin.y) ** 2
            );
            if (distance > this.explosion_radius) {
                this.remove = true;
            }
        }

        if (Math.abs(this.vel.x) < 0.5 && Math.abs(this.vel.y) < 0.5) {
            this.remove = true;
        }

        this.decay();
        this.trail_uppubDate();
        this.life++;
    }

    show() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.colour[0]}, ${this.colour[1]}, ${this.colour[2]}, 1)`;
        ctx.fill();
    }

    decay() {
        if (this.life > 10 && this.life < 50 && Math.random() < 0.03) {
            this.remove = true;
        } else if (this.life >= 50 && Math.random() < 0.2) {
            this.remove = true;
        }
    }

    trail_uppubDate() {
        this.prev_posx.pop();
        this.prev_posx.unshift(this.pos.x);
        this.prev_posy.pop();
        this.prev_posy.unshift(this.pos.y);

        for (let n = 0; n < this.trails.length; n++) {
            const t = this.trails[n];
            if (t.dynamic) {
                t.get_pos(this.prev_posx[n + dynamic_offset], this.prev_posy[n + dynamic_offset]);
            } else {
                t.get_pos(this.prev_posx[n + static_offset], this.prev_posy[n + static_offset]);
            }
        }
    }
}

class Trail {
    constructor(n, size, dynamic) {
        this.pos_in_line = n;
        this.pos = { x: -10, y: -10 };
        this.dynamic = dynamic;

        if (this.dynamic) {
            this.colour = `rgb(${trail_colours[n][0]}, ${trail_colours[n][1]}, ${trail_colours[n][2]})`;
            this.size = size - n / 2;
        } else {
            this.colour = 'rgb(255, 255, 200)';
            this.size = size - 2;
            if (this.size < 0) {
                this.size = 0;
            }
        }
    }

    get_pos(x, y) {
        this.pos = { x, y };
    }

    show() {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.colour;
        ctx.fill();
    }
}

function uppubDate(fireworks) {
    const to_remove = [];
    fireworks.forEach((fw) => {
        fw.uppubDate();
        if (fw.remove()) {
            to_remove.push(fw);
        }
    });

    to_remove.forEach((fw) => {
        const index = fireworks.indexOf(fw);
        fireworks.splice(index, 1);
    });
}

function main() {
    canvas.width = DISPLAY_WIDTH;
    canvas.height = DISPLAY_HEIGHT;

    const fireworks = Array.from({ length: 2 }, () => new Firework());

    setInterval(() => {
        if (fireworks.length < MAX_FIREWORKS && Math.random() < 0.05) {
            fireworks.push(new Firework());
        }
    }, 100);

    setInterval(() => {
        if (fireworks.length < MAX_FIREWORKS && Math.random() < 0.1) {
            for (let i = 0; i < 10; i++) {
                if (fireworks.length < MAX_FIREWORKS) {
                    fireworks.push(new Firework());
                }
            }
        }
    }, 500);

    setInterval(() => {
        if (fireworks.length < MAX_FIREWORKS && Math.random() < 0.2) {
            for (let i = 0; i < 100; i++) {
                if (fireworks.length < MAX_FIREWORKS) {
                    fireworks.push(new Firework());
                }
            }
        }
    }, 1000);

    function animate() {
        ctx.fillStyle = 'rgba(20, 20, 30, 0.2)';
        ctx.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);
        uppubDate(fireworks);
        requestAnimationFrame(animate);
    }

    animate();
}

main();

```