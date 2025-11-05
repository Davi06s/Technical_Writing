class Projectile {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 8;
        this.height = 4;
        this.speed = 10;
        this.damage = 1;
        this.active = false;
        this.isPlayerProjectile = true;
        this.isWaveCannon = false;
    }

    init(x, y, isPlayerProjectile = true, isWaveCannon = false) {
        this.x = x;
        this.y = y;
        this.active = true;
        this.isPlayerProjectile = isPlayerProjectile;
        this.isWaveCannon = isWaveCannon;
        
        if (isWaveCannon) {
            this.width = 20;
            this.height = 10;
            this.damage = 5;
            this.speed = 12;
        } else if (isPlayerProjectile) {
            this.width = 8;
            this.height = 4;
            this.damage = 1;
            this.speed = 10;
        } else {
            this.width = 6;
            this.height = 6;
            this.damage = 1;
            this.speed = -6;
        }
    }

    update() {
        if (this.isPlayerProjectile) {
            this.x += this.speed;
        } else {
            this.x += this.speed;
        }

        if (this.x > 1280 || this.x < -50) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (this.isWaveCannon) {
            ctx.fillStyle = '#0ff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0ff';
        } else if (this.isPlayerProjectile) {
            ctx.fillStyle = '#0f0';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#0f0';
        } else {
            ctx.fillStyle = '#f00';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#f00';
        }
        
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }
}
