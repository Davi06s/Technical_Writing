class CollisionManager {
    static checkCollisions(player, projectilePool, enemyPool, boss, scoreManager) {
        for (let projectile of projectilePool.active) {
            if (!projectile.active) continue;

            if (player.force.blockProjectile(projectile)) {
                projectile.active = false;
                continue;
            }

            if (!projectile.isPlayerProjectile) {
                if (checkCollision(player, projectile)) {
                    projectile.active = false;
                    player.hit();
                }
            } else {
                for (let enemy of enemyPool.active) {
                    if (!enemy.active) continue;
                    
                    if (checkCollision(projectile, enemy)) {
                        projectile.active = false;
                        if (enemy.hit(projectile.damage)) {
                            scoreManager.addScore(enemy.points);
                        }
                        break;
                    }
                }

                if (boss && boss.active) {
                    if (checkCollision(projectile, boss)) {
                        projectile.active = false;
                        if (boss.hit(projectile.damage)) {
                            scoreManager.addScore(boss.points);
                        }
                    }
                }
            }
        }

        for (let enemy of enemyPool.active) {
            if (!enemy.active) continue;
            
            if (checkCollision(player, enemy)) {
                enemy.active = false;
                player.hit();
            }
        }

        if (boss && boss.active) {
            if (checkCollision(player, boss)) {
                player.hit();
            }
        }
    }
}

class ScoreManager {
    constructor() {
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore') || '0');
    }

    addScore(points) {
        this.score += points;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore.toString());
        }
    }

    reset() {
        this.score = 0;
    }

    getScore() {
        return this.score;
    }

    getHighScore() {
        return this.highScore;
    }
}
