import SettingsManager from './settings/SettingsManager.js';
import ThemeManager from './settings/ThemeManager.js';
import WallpaperManager from './settings/WallpaperManager.js';
import SystemInfoManager from './settings/SystemInfoManager.js';
import UpdateManager from './settings/UpdateManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    const settingsManager = new SettingsManager();
    const themeManager = new ThemeManager(settingsManager);
    const wallpaperManager = new WallpaperManager(settingsManager);
    const systemInfoManager = new SystemInfoManager(settingsManager);
    const updateManager = new UpdateManager(settingsManager);

    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Theme switching
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            settingsManager.setSetting('theme', theme);
        });
    });

    // Wallpaper switching
    const wallpaperOptions = document.querySelectorAll('.wallpaper-option');
    wallpaperOptions.forEach(option => {
        option.addEventListener('click', () => {
            const wallpaper = option.getAttribute('data-wallpaper');
            settingsManager.setSetting('wallpaper', wallpaper);
        });
    });

    // Custom wallpaper upload
    const customWallpaperInput = document.getElementById('custom-wallpaper-input');
    const customWallpaperBtn = document.querySelector('.custom-wallpaper-btn');

    customWallpaperBtn.addEventListener('click', () => {
        customWallpaperInput.click();
    });

    customWallpaperInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            wallpaperManager.setCustomWallpaper(file)
                .then(() => {
                    settingsManager.setSetting('wallpaper', 'custom');
                })
                .catch(error => {
                    console.error('Error setting custom wallpaper:', error);
                    alert('Error setting custom wallpaper: ' + error.message);
                });
        }
    });

    // Update checking
    const checkUpdatesBtn = document.querySelector('.check-updates');
    checkUpdatesBtn.addEventListener('click', () => {
        checkUpdatesBtn.textContent = 'Checking for updates...';
        checkUpdatesBtn.disabled = true;

        // Simulate update check
        setTimeout(() => {
            checkUpdatesBtn.textContent = 'No updates available';
            checkUpdatesBtn.disabled = false;
        }, 2000);
    });

    // System information
    function updateSystemInfo() {
        const uptime = Math.floor((Date.now() - window.performance.timing.navigationStart) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;

        document.querySelector('.uptime').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Update uptime every second
    setInterval(updateSystemInfo, 1000);
    updateSystemInfo();
}); 