class Force {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 30;
        this.height = 30;
        this.attached = true;
        this.attachPosition = 'front';
        this.targetX = 0;
        this.targetY = 0;
        this.speed = 5;
        this.maxDistance = 200;
        this.fireRate = 15;
        this.fireTimer = 0;
    }

    update(player, projectilePool) {
        if (this.attached) {
            if (this.attachPosition === 'front') {
                this.x = player.x + player.width;
                this.y = player.y + player.height / 2 - this.height / 2;
            } else {
                this.x = player.x - this.width;
                this.y = player.y + player.height / 2 - this.height / 2;
            }
        } else {
            const distance = getDistance(this.x, this.y, player.x, player.y);
            
            if (distance > this.maxDistance) {
                const angle = Math.atan2(player.y - this.y, player.x - this.x);
                this.x += Math.cos(angle) * 3;
                this.y += Math.sin(angle) * 3;
            }

            this.fireTimer++;
            if (this.fireTimer >= this.fireRate) {
                this.fireTimer = 0;
                const projectile = projectilePool.get();
                projectile.init(this.x + this.width, this.y + this.height / 2, true, false);
            }
        }
    }

    toggleAttach() {
        this.attached = !this.attached;
        if (this.attached) {
            this.fireTimer = 0;
        }
    }

    togglePosition() {
        if (this.attached) {
            this.attachPosition = this.attachPosition === 'front' ? 'back' : 'front';
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#ff0';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff0';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.strokeStyle = '#f80';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
        
        ctx.shadowBlur = 0;
    }

    blockProjectile(projectile) {
        return !projectile.isPlayerProjectile && 
               checkCollision(this, projectile);
    }
}
