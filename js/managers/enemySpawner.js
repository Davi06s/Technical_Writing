class EnemySpawner {
    constructor(enemyPool) {
        this.enemyPool = enemyPool;
        this.spawnTimer = 0;
        this.spawnRate = 120;
        this.waveTimer = 0;
        this.currentWave = 0;
        this.bossSpawned = false;
    }

    update() {
        this.waveTimer++;
        this.spawnTimer++;

        if (this.waveTimer > 3600 && !this.bossSpawned) {
            return true;
        }

        if (this.spawnTimer >= this.spawnRate) {
            this.spawnTimer = 0;
            this.spawnEnemy();
            
            if (this.waveTimer > 1800) {
                this.spawnRate = 60;
            } else if (this.waveTimer > 900) {
                this.spawnRate = 90;
            }
        }

        return false;
    }

    spawnEnemy() {
        const enemy = this.enemyPool.get();
        const types = ['basic', 'sine', 'fast'];
        let type;
        
        if (this.waveTimer < 600) {
            type = 'basic';
        } else if (this.waveTimer < 1200) {
            type = Math.random() < 0.7 ? 'basic' : 'sine';
        } else {
            type = types[Math.floor(Math.random() * types.length)];
        }
        
        const y = 50 + Math.random() * 620;
        enemy.init(1300, y, type);
    }

    reset() {
        this.spawnTimer = 0;
        this.waveTimer = 0;
        this.currentWave = 0;
        this.bossSpawned = false;
        this.spawnRate = 120;
    }
}
