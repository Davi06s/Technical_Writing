class Enemy {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.hp = 1;
        this.active = false;
        this.type = 'basic';
        this.movePattern = 'straight';
        this.time = 0;
        this.amplitude = 50;
        this.frequency = 0.05;
        this.baseY = 0;
        this.fireRate = 60;
        this.fireTimer = 0;
        this.points = 100;
    }

    init(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.active = true;
        this.type = type;
        this.time = 0;
        this.fireTimer = Math.floor(Math.random() * this.fireRate);
        
        if (type === 'basic') {
            this.hp = 1;
            this.speed = 2;
            this.movePattern = 'straight';
            this.points = 100;
        } else if (type === 'sine') {
            this.hp = 2;
            this.speed = 1.5;
            this.movePattern = 'sine';
            this.points = 200;
        } else if (type === 'fast') {
            this.hp = 1;
            this.speed = 4;
            this.movePattern = 'straight';
            this.points = 150;
        }
    }

    update(projectilePool) {
        this.time++;
        
        if (this.movePattern === 'straight') {
            this.x -= this.speed;
        } else if (this.movePattern === 'sine') {
            this.x -= this.speed;
            this.y = this.baseY + Math.sin(this.time * this.frequency) * this.amplitude;
        }

        if (this.x < -this.width - 50) {
            this.active = false;
        }

        this.fireTimer++;
        if (this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            const projectile = projectilePool.get();
            projectile.init(this.x, this.y + this.height / 2, false, false);
        }
    }

    draw(ctx) {
        if (this.type === 'basic') {
            ctx.fillStyle = '#f00';
        } else if (this.type === 'sine') {
            ctx.fillStyle = '#f80';
        } else if (this.type === 'fast') {
            ctx.fillStyle = '#f0f';
        }
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        
        ctx.shadowBlur = 0;
    }

    hit(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.active = false;
            return true;
        }
        return false;
    }
}
