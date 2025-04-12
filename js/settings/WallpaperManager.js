class WallpaperManager {
    constructor(settingsManager) {
        this.settingsManager = settingsManager;
        this.wallpapers = {
            'default': 'images/wallpeper.jpg',
            'blue': 'wallpapers/blue.jpg',
            'green': 'wallpapers/green.jpg',
            'custom': null
        };
        this.initialize();
    }

    initialize() {
        // Apply saved wallpaper
        const savedWallpaper = this.settingsManager.getSetting('wallpaper');
        this.applyWallpaper(savedWallpaper);

        // Listen for wallpaper changes
        this.settingsManager.addListener('wallpaper', (wallpaper) => {
            this.applyWallpaper(wallpaper);
        });

        // Listen for custom wallpaper changes
        this.settingsManager.addListener('customWallpaper', (url) => {
            this.wallpapers.custom = url;
            this.applyWallpaper('custom');
        });
    }

    applyWallpaper(wallpaper) {
        const desktop = document.querySelector('.desktop');
        const wallpaperUrl = this.wallpapers[wallpaper] || this.wallpapers.default;
        
        if (wallpaperUrl) {
            desktop.style.backgroundImage = `url('${wallpaperUrl}')`;
            desktop.style.backgroundSize = 'cover';
            desktop.style.backgroundPosition = 'center';
            desktop.style.backgroundRepeat = 'no-repeat';
        }
    }

    async setCustomWallpaper(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('File must be an image'));
                return;
            }

            const formData = new FormData();
            formData.append('wallpaper', file);

            fetch('api/upload_wallpaper.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.wallpapers.custom = data.url;
                    this.settingsManager.setSetting('customWallpaper', data.url);
                    resolve();
                } else {
                    reject(new Error(data.error || 'Failed to upload wallpaper'));
                }
            })
            .catch(error => {
                reject(error);
            });
        });
    }

    getAvailableWallpapers() {
        return Object.keys(this.wallpapers);
    }
}

export default WallpaperManager; 