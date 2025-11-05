class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1280;
        this.canvas.height = 720;

        this.keys = {};
        this.gameState = 'menu';
        this.lastState = 'menu';

        this.player = new Player();
        this.boss = null;
        this.scoreManager = new ScoreManager();

        this.projectilePool = new Pool(
            () => new Projectile(),
            (proj) => { proj.active = false; }
        );

        this.enemyPool = new Pool(
            () => new Enemy(),
            (enemy) => { enemy.active = false; }
        );

        this.enemySpawner = new EnemySpawner(this.enemyPool);
        this.backgroundStars = this.generateStars(100);

        this.setupEventListeners();
        this.showScreen('menu-screen');
        this.gameLoop();
    }

    generateStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: 0.5 + Math.random() * 1.5,
                size: 1 + Math.random() * 2
            });
        }
        return stars;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;

            if (e.key === ' ') {
                e.preventDefault();
                if (this.gameState === 'menu') {
                    this.startGame();
                } else if (this.gameState === 'gameover' || this.gameState === 'victory') {
                    this.restartGame();
                }
            }

            if (e.key === 'x' || e.key === 'X') {
                if (this.gameState === 'playing') {
                    this.player.force.toggleAttach();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    }

    startGame() {
        this.gameState = 'playing';
        this.showScreen('game-screen');
        this.resetGame();
    }

    resetGame() {
        this.player = new Player();
        this.boss = null;
        this.scoreManager.reset();
        this.projectilePool.releaseAll();
        this.enemyPool.releaseAll();
        this.enemySpawner.reset();
    }

    restartGame() {
        this.startGame();
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.updateBackground();

        this.player.update(this.keys, this.projectilePool);

        for (let projectile of this.projectilePool.active) {
            projectile.update();
            if (!projectile.active) {
                this.projectilePool.release(projectile);
            }
        }

        const shouldSpawnBoss = this.enemySpawner.update();
        if (shouldSpawnBoss && !this.boss) {
            this.boss = new Boss();
            this.boss.init();
            this.enemySpawner.bossSpawned = true;
        }

        for (let enemy of this.enemyPool.active) {
            enemy.update(this.projectilePool);
            if (!enemy.active) {
                this.enemyPool.release(enemy);
            }
        }

        if (this.boss && this.boss.active) {
            this.boss.update(this.projectilePool);
        }

        CollisionManager.checkCollisions(
            this.player,
            this.projectilePool,
            this.enemyPool,
            this.boss,
            this.scoreManager
        );

        this.updateHUD();

        if (this.player.lives <= 0) {
            this.gameOver();
        }

        if (this.boss && this.boss.defeated) {
            this.victory();
        }
    }

    updateBackground() {
        for (let star of this.backgroundStars) {
            star.x -= star.speed;
            if (star.x < 0) {
                star.x = this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }
        }
    }

    updateHUD() {
        document.getElementById('score').textContent = this.scoreManager.getScore();
        document.getElementById('lives').textContent = this.player.lives;
        document.getElementById('chargeBar').style.width = this.player.getChargePercent() + '%';
    }

    gameOver() {
        this.gameState = 'gameover';
        document.getElementById('finalScore').textContent = this.scoreManager.getScore();
        this.showScreen('gameover-screen');
    }

    victory() {
        this.gameState = 'victory';
        document.getElementById('victoryScore').textContent = this.scoreManager.getScore();
        this.showScreen('victory-screen');
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let star of this.backgroundStars) {
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        }

        if (this.gameState === 'playing') {
            this.player.draw(this.ctx);

            for (let projectile of this.projectilePool.active) {
                projectile.draw(this.ctx);
            }

            for (let enemy of this.enemyPool.active) {
                enemy.draw(this.ctx);
            }

            if (this.boss && this.boss.active) {
                this.boss.draw(this.ctx);
            }
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.addEventListener('load', () => {
    new Game();
});
