class Boss {
    constructor() {
        this.x = 1000;
        this.y = 260;
        this.width = 100;
        this.height = 200;
        this.hp = 100;
        this.maxHp = 100;
        this.active = false;
        this.phase = 1;
        this.speed = 1;
        this.time = 0;
        this.fireTimer = 0;
        this.fireRate = 30;
        this.moveTimer = 0;
        this.targetY = 260;
        this.defeated = false;
        this.points = 5000;
    }

    init() {
        this.x = 1000;
        this.y = 260;
        this.hp = this.maxHp;
        this.active = true;
        this.phase = 1;
        this.time = 0;
        this.defeated = false;
    }

    update(projectilePool) {
        this.time++;
        this.moveTimer++;

        if (this.x > 900) {
            this.x -= 2;
        } else {
            if (this.moveTimer >= 120) {
                this.moveTimer = 0;
                this.targetY = 100 + Math.random() * 400;
            }

            const dy = this.targetY - this.y;
            this.y += dy * 0.02;
        }

        this.y = Math.max(0, Math.min(720 - this.height, this.y));

        const hpPercent = this.hp / this.maxHp;
        if (hpPercent < 0.33 && this.phase < 3) {
            this.phase = 3;
            this.fireRate = 15;
        } else if (hpPercent < 0.66 && this.phase < 2) {
            this.phase = 2;
            this.fireRate = 20;
        }

        this.fireTimer++;
        if (this.fireTimer >= this.fireRate) {
            this.fireTimer = 0;
            
            if (this.phase === 1) {
                const projectile = projectilePool.get();
                projectile.init(this.x, this.y + this.height / 2, false, false);
            } else if (this.phase === 2) {
                for (let i = -1; i <= 1; i++) {
                    const projectile = projectilePool.get();
                    projectile.init(this.x, this.y + this.height / 2 + i * 30, false, false);
                }
            } else if (this.phase === 3) {
                for (let i = 0; i < 5; i++) {
                    const projectile = projectilePool.get();
                    const angle = (i - 2) * 0.3;
                    projectile.init(this.x, this.y + this.height / 2, false, false);
                    projectile.speed = -6 * Math.cos(angle);
                    projectile.y += -6 * Math.sin(angle) * 10;
                }
            }
        }
    }

    draw(ctx) {
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = hpPercent > 0.5 ? '#f00' : (hpPercent > 0.25 ? '#f80' : '#f0f');
        ctx.shadowBlur = 20;
        ctx.shadowColor = ctx.fillStyle;
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#800';
        ctx.fillRect(this.x + 10, this.y + 40, 30, 30);
        ctx.fillRect(this.x + 10, this.y + 130, 30, 30);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        
        ctx.shadowBlur = 0;
        
        const barWidth = 200;
        const barHeight = 20;
        const barX = this.x + this.width / 2 - barWidth / 2;
        const barY = this.y - 30;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = '#f00';
        ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    hit(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.active = false;
            this.defeated = true;
            return true;
        }
        return false;
    }
}
