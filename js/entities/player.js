class Player {
    constructor() {
        this.x = 100;
        this.y = 360;
        this.width = 40;
        this.height = 20;
        this.speed = 5;
        this.lives = 3;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.invulnerableDuration = 120;
        
        this.fireRate = 8;
        this.fireTimer = 0;
        this.charging = false;
        this.chargeTime = 0;
        this.maxChargeTime = 120;
        this.chargeThreshold = 20;
        
        this.force = new Force();
    }

    update(keys, projectilePool) {
        if (keys['ArrowUp'] || keys['w']) this.y -= this.speed;
        if (keys['ArrowDown'] || keys['s']) this.y += this.speed;
        if (keys['ArrowLeft'] || keys['a']) this.x -= this.speed;
        if (keys['ArrowRight'] || keys['d']) this.x += this.speed;

        this.x = Math.max(0, Math.min(1280 - this.width, this.x));
        this.y = Math.max(0, Math.min(720 - this.height, this.y));

        if (keys[' ']) {
            this.chargeTime = Math.min(this.chargeTime + 1, this.maxChargeTime);
            
            if (this.chargeTime >= this.chargeThreshold) {
                this.charging = true;
            }
            
            if (this.chargeTime < this.chargeThreshold) {
                this.fireTimer++;
                if (this.fireTimer >= this.fireRate) {
                    this.fireTimer = 0;
                    const projectile = projectilePool.get();
                    projectile.init(this.x + this.width, this.y + this.height / 2 - 2, true, false);
                }
            }
        } else {
            if (this.charging && this.chargeTime >= this.maxChargeTime) {
                this.fireWaveCannon(projectilePool);
            }
            this.charging = false;
            this.chargeTime = 0;
            this.fireTimer = 0;
        }

        this.force.update(this, projectilePool);

        if (this.invulnerable) {
            this.invulnerableTimer++;
            if (this.invulnerableTimer >= this.invulnerableDuration) {
                this.invulnerable = false;
                this.invulnerableTimer = 0;
            }
        }
    }

    fireWaveCannon(projectilePool) {
        if (this.chargeTime >= this.maxChargeTime) {
            const projectile = projectilePool.get();
            projectile.init(this.x + this.width, this.y + this.height / 2 - 5, true, true);
        }
    }

    draw(ctx) {
        if (this.invulnerable && Math.floor(this.invulnerableTimer / 10) % 2 === 0) {
            return;
        }

        ctx.fillStyle = '#0f0';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#0f0';
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x + 10, this.y + this.height / 2);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        this.force.draw(ctx);
    }

    hit() {
        if (!this.invulnerable) {
            this.lives--;
            this.invulnerable = true;
            this.invulnerableTimer = 0;
            this.x = 100;
            this.y = 360;
            return true;
        }
        return false;
    }

    getChargePercent() {
        return (this.chargeTime / this.maxChargeTime) * 100;
    }
}
