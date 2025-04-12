class Window95 {
    constructor() {
        this.windows = [];
        this.activeWindow = null;
        this.startMenuVisible = false;
        this.contextMenuVisible = false;
        this.selectedItems = new Set();
        this.initialize();
    }

    initialize() {
        // Initialize start menu
        const startButton = document.querySelector('.start-button');
        const startMenu = document.querySelector('.start-menu');

        startButton.addEventListener('click', () => {
            this.toggleStartMenu();
        });

        // Add keyboard event listeners
        document.addEventListener('keydown', (e) => {
            // Windows key (Meta key) to toggle start menu
            if (e.key === 'Meta' || e.key === 'Win') {
                e.preventDefault();
                this.toggleStartMenu();
            }
            // Alt + F4 to close active window
            else if (e.key === 'F4' && e.altKey) {
                e.preventDefault();
                if (this.activeWindow) {
                    this.closeWindow(this.activeWindow);
                }
            }
            // Alt + Tab to switch between windows
            else if (e.key === 'Tab' && e.altKey) {
                e.preventDefault();
                if (this.windows.length > 0) {
                    const currentIndex = this.windows.indexOf(this.activeWindow);
                    const nextIndex = (currentIndex + 1) % this.windows.length;
                    this.setActiveWindow(this.windows[nextIndex]);
                }
            }
        });

        // Initialize desktop icons
        const icons = document.querySelectorAll('.icon');
        icons.forEach(icon => {
            icon.addEventListener('dblclick', () => {
                const windowType = icon.getAttribute('data-window');
                this.openWindow(windowType);
            });
        });

        // Update clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
                this.hideStartMenu();
            }
        });

        // Initialize context menu
        this.createContextMenu();
        
        // Initialize file operations
        this.initializeFileOperations();
        
        // Initialize taskbar
        this.initializeTaskbar();
    }

    toggleStartMenu() {
        const startMenu = document.querySelector('.start-menu');
        this.startMenuVisible = !this.startMenuVisible;
        startMenu.style.display = this.startMenuVisible ? 'block' : 'none';
    }

    hideStartMenu() {
        const startMenu = document.querySelector('.start-menu');
        this.startMenuVisible = false;
        startMenu.style.display = 'none';
    }

    updateClock() {
        const clock = document.querySelector('.clock');
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        clock.textContent = `${hours}:${minutes}`;
    }

    openWindow(type) {
        const window = this.createWindow(type);
        this.windows.push(window);
        this.setActiveWindow(window);
        this.updateTaskbar();
    }

    createWindow(type) {
        const window = document.createElement('div');
        window.className = 'window';
        window.style.left = '100px';
        window.style.top = '100px';
        window.style.zIndex = this.windows.length;
        window.setAttribute('data-type', type);

        const title = this.getWindowTitle(type);
        const content = this.getWindowContent(type);

        window.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="fas ${this.getWindowIcon(type)}"></i>
                    <span>${title}</span>
                </div>
                <div class="window-controls">
                    <div class="window-control minimize" title="Minimize">
                        <i class="fas fa-minus"></i>
                    </div>
                    <div class="window-control maximize" title="Maximize">
                        <i class="fas fa-square"></i>
                    </div>
                    <div class="window-control close" title="Close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
            <div class="window-content">
                ${content}
            </div>
            <!-- Resize handles -->
            <div class="window-resize-handle n"></div>
            <div class="window-resize-handle s"></div>
            <div class="window-resize-handle e"></div>
            <div class="window-resize-handle w"></div>
            <div class="window-resize-handle ne"></div>
            <div class="window-resize-handle nw"></div>
            <div class="window-resize-handle se"></div>
            <div class="window-resize-handle sw"></div>
        `;

        document.querySelector('.desktop').appendChild(window);

        // Add window controls
        const header = window.querySelector('.window-header');
        const closeBtn = window.querySelector('.close');
        const minimizeBtn = window.querySelector('.minimize');
        const maximizeBtn = window.querySelector('.maximize');

        // Make window draggable
        this.makeDraggable(window, header);

        // Add resize functionality
        this.initializeResizeHandles(window);

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(window);
        });

        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(window);
        });

        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.maximizeWindow(window);
        });

        return window;
    }

    makeDraggable(window, header) {
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - window.offsetLeft;
            offsetY = e.clientY - window.offsetTop;
            this.setActiveWindow(window);
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                window.style.left = (e.clientX - offsetX) + 'px';
                window.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    setActiveWindow(window) {
        if (this.activeWindow) {
            this.activeWindow.style.zIndex = this.windows.indexOf(this.activeWindow);
        }
        this.activeWindow = window;
        window.style.zIndex = 1000;
    }

    closeWindow(window) {
        const index = this.windows.indexOf(window);
        if (index > -1) {
            this.windows.splice(index, 1);
        }
        window.remove();
        this.updateTaskbar();
    }

    minimizeWindow(window) {
        window.style.display = 'none';
        this.updateTaskbar();
    }

    maximizeWindow(window) {
        if (window.style.width === '100%') {
            window.style.width = '300px';
            window.style.height = '200px';
            window.style.left = '100px';
            window.style.top = '100px';
            window.querySelector('.maximize i').className = 'fas fa-square';
        } else {
            window.style.width = '100%';
            window.style.height = 'calc(100% - 40px)';
            window.style.left = '0';
            window.style.top = '0';
            window.querySelector('.maximize i').className = 'fas fa-clone';
        }
        this.updateTaskbar();
    }

    getWindowTitle(type) {
        const titles = {
            'my-computer': 'My Computer',
            'recycle-bin': 'Recycle Bin'
        };
        return titles[type] || type;
    }

    getWindowContent(type) {
        switch (type) {
            case 'my-computer':
                return `
                    <div class="file-explorer">
                        <div class="file-item" data-path="C:/">
                            <i class="fas fa-hdd"></i>
                            <span>Local Disk (C:)</span>
                        </div>
                        <div class="file-item" data-path="D:/">
                            <i class="fas fa-hdd"></i>
                            <span>Local Disk (D:)</span>
                        </div>
                    </div>
                `;
            case 'settings':
                return `
                    <div class="settings-content">
                        <div class="settings-section">
                            <h3>Theme</h3>
                            <div class="theme-options">
                                <div class="theme-option" data-theme="classic">
                                    <i class="fas fa-palette"></i>
                                    <span>Classic</span>
                                </div>
                                <div class="theme-option" data-theme="dark">
                                    <i class="fas fa-moon"></i>
                                    <span>Dark</span>
                                </div>
                                <div class="theme-option" data-theme="light">
                                    <i class="fas fa-sun"></i>
                                    <span>Light</span>
                                </div>
                            </div>
                        </div>
                        <div class="settings-section">
                            <h3>Wallpaper</h3>
                            <div class="wallpaper-options">
                                <div class="wallpaper-option" data-wallpaper="default">
                                    <img src="wallpapers/default.jpg" alt="Default" onerror="this.src='wallpapers/default.jpg'">
                                    <span>Default</span>
                                </div>
                                <div class="wallpaper-option" data-wallpaper="blue">
                                    <img src="wallpapers/blue.jpg" alt="Blue" onerror="this.src='wallpapers/default.jpg'">
                                    <span>Blue</span>
                                </div>
                                <div class="wallpaper-option" data-wallpaper="green">
                                    <img src="wallpapers/green.jpg" alt="Green" onerror="this.src='wallpapers/default.jpg'">
                                    <span>Green</span>
                                </div>
                            </div>
                            <div class="custom-wallpaper">
                                <input type="file" id="custom-wallpaper-input" accept="image/*" style="display: none;">
                                <button class="custom-wallpaper-btn">
                                    <i class="fas fa-upload"></i>
                                    <span>Upload Custom Wallpaper</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            case 'recycle-bin':
                return `
                    <div class="recycle-bin-content">
                        <p>Recycle Bin is empty</p>
                    </div>
                `;
            case 'calculator':
                return `
                    <iframe src="calculator.html" frameborder="0" style="width: 100%; height: 100%;"></iframe>
                `;
            default:
                return `<p>Window content for ${type}</p>`;
        }
    }

    getWindowIcon(type) {
        const icons = {
            'my-computer': 'fa-desktop',
            'recycle-bin': 'fa-trash',
            'network': 'fa-network-wired',
            'properties': 'fa-info-circle',
            'folder': 'fa-folder',
            'file': 'fa-file',
            'calculator': 'fa-calculator',
            'settings': 'fa-cog'
        };
        return icons[type] || 'fa-window-maximize';
    }

    createContextMenu() {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="new-folder">
                <i class="fas fa-folder-plus"></i>
                <span>New Folder</span>
            </div>
            <div class="context-menu-item" data-action="delete">
                <i class="fas fa-trash"></i>
                <span>Delete</span>
            </div>
            <div class="context-menu-item" data-action="rename">
                <i class="fas fa-edit"></i>
                <span>Rename</span>
            </div>
            <div class="context-menu-item" data-action="properties">
                <i class="fas fa-info-circle"></i>
                <span>Properties</span>
            </div>
        `;
        document.body.appendChild(contextMenu);

        // Handle context menu clicks
        contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleContextMenuAction(action);
                this.hideContextMenu();
            });
        });

        // Show context menu on right-click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });

        // Hide context menu on click outside
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });
    }

    showContextMenu(x, y) {
        const contextMenu = document.querySelector('.context-menu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
        this.contextMenuVisible = true;
    }

    hideContextMenu() {
        const contextMenu = document.querySelector('.context-menu');
        contextMenu.style.display = 'none';
        this.contextMenuVisible = false;
    }

    handleContextMenuAction(action) {
        switch (action) {
            case 'new-folder':
                this.createNewFolder();
                break;
            case 'delete':
                this.deleteSelectedItems();
                break;
            case 'rename':
                this.renameSelectedItem();
                break;
            case 'properties':
                this.showProperties();
                break;
        }
    }

    initializeFileOperations() {
        // Handle file selection
        document.addEventListener('mousedown', (e) => {
            if (!e.ctrlKey && !e.target.closest('.file-item')) {
                this.clearSelection();
            }
        });

        // Handle drag and drop
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const target = e.target.closest('.file-item, .icon');
            if (target) {
                this.handleDrop(target, e.dataTransfer);
            }
        });
    }

    initializeTaskbar() {
        const taskbarItems = document.querySelector('.taskbar-items');
        
        // Update taskbar when windows change
        this.updateTaskbar = () => {
            taskbarItems.innerHTML = '';
            this.windows.forEach((window, index) => {
                const taskbarItem = document.createElement('div');
                taskbarItem.className = 'taskbar-item';
                if (window === this.activeWindow) {
                    taskbarItem.classList.add('active');
                }
                
                const title = window.querySelector('.window-title span').textContent;
                const type = window.getAttribute('data-type');
                taskbarItem.innerHTML = `
                    <i class="fas ${this.getWindowIcon(type)}"></i>
                    <span>${title}</span>
                `;
                
                taskbarItem.addEventListener('click', () => {
                    if (window.style.display === 'none') {
                        window.style.display = 'block';
                    }
                    this.setActiveWindow(window);
                    this.updateTaskbar();
                });
                
                taskbarItems.appendChild(taskbarItem);
            });
        };
    }

    createNewFolder() {
        const currentPath = this.getCurrentPath();
        fetch(`api/file_system.php?action=create&path=${encodeURIComponent(currentPath + '/New Folder')}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.refreshFileExplorer();
                }
            });
    }

    deleteSelectedItems() {
        this.selectedItems.forEach(item => {
            const path = item.getAttribute('data-path');
            fetch(`api/file_system.php?action=delete&path=${encodeURIComponent(path)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.refreshFileExplorer();
                    }
                });
        });
        this.clearSelection();
    }

    renameSelectedItem() {
        const selectedItem = Array.from(this.selectedItems)[0];
        if (selectedItem) {
            const newName = prompt('Enter new name:');
            if (newName) {
                const oldPath = selectedItem.getAttribute('data-path');
                const newPath = oldPath.substring(0, oldPath.lastIndexOf('/')) + '/' + newName;
                fetch(`api/file_system.php?action=move&source=${encodeURIComponent(oldPath)}&destination=${encodeURIComponent(newPath)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            this.refreshFileExplorer();
                        }
                    });
            }
        }
    }

    showProperties() {
        const selectedItem = Array.from(this.selectedItems)[0];
        if (selectedItem) {
            const path = selectedItem.getAttribute('data-path');
            // Show properties window with file information
            this.openWindow('properties', { path });
        }
    }

    clearSelection() {
        const fileItems = document.querySelectorAll('.file-item.selected');
        fileItems.forEach(item => {
            item.classList.remove('selected');
        });
        this.selectedItems.clear();
    }

    toggleSelection(item) {
        if (!item.classList.contains('file-item')) return;
        
        if (this.selectedItems.has(item)) {
            item.classList.remove('selected');
            this.selectedItems.delete(item);
        } else {
            item.classList.add('selected');
            this.selectedItems.add(item);
        }
    }

    refreshFileExplorer() {
        const currentPath = this.getCurrentPath();
        fetch(`api/file_system.php?action=list&path=${encodeURIComponent(currentPath)}`)
            .then(response => response.json())
            .then(data => {
                this.updateFileExplorer(data);
            });
    }

    updateFileExplorer(items) {
        const fileExplorer = document.querySelector('.file-explorer');
        fileExplorer.innerHTML = '';
        
        items.forEach(item => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.setAttribute('data-path', item.path);
            fileItem.innerHTML = `
                <i class="fas ${item.type === 'directory' ? 'fa-folder' : 'fa-file'}"></i>
                <span>${item.name}</span>
            `;
            
            fileItem.addEventListener('click', (e) => {
                if (e.ctrlKey) {
                    this.toggleSelection(fileItem);
                } else {
                    this.clearSelection();
                    this.toggleSelection(fileItem);
                }
            });
            
            fileExplorer.appendChild(fileItem);
        });
    }

    initializeResizeHandles(window) {
        const handles = window.querySelectorAll('.window-resize-handle');
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        
        handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = window.offsetWidth;
                startHeight = window.offsetHeight;
                
                const handleClass = handle.className.split(' ')[1];
                
                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
                
                function resize(e) {
                    if (!isResizing) return;
                    
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    
                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    
                    switch(handleClass) {
                        case 'e':
                            newWidth = Math.max(300, startWidth + deltaX);
                            break;
                        case 'w':
                            newWidth = Math.max(300, startWidth - deltaX);
                            window.style.left = (window.offsetLeft + deltaX) + 'px';
                            break;
                        case 's':
                            newHeight = Math.max(200, startHeight + deltaY);
                            break;
                        case 'n':
                            newHeight = Math.max(200, startHeight - deltaY);
                            window.style.top = (window.offsetTop + deltaY) + 'px';
                            break;
                        case 'se':
                            newWidth = Math.max(300, startWidth + deltaX);
                            newHeight = Math.max(200, startHeight + deltaY);
                            break;
                        case 'sw':
                            newWidth = Math.max(300, startWidth - deltaX);
                            newHeight = Math.max(200, startHeight + deltaY);
                            window.style.left = (window.offsetLeft + deltaX) + 'px';
                            break;
                        case 'ne':
                            newWidth = Math.max(300, startWidth + deltaX);
                            newHeight = Math.max(200, startHeight - deltaY);
                            window.style.top = (window.offsetTop + deltaY) + 'px';
                            break;
                        case 'nw':
                            newWidth = Math.max(300, startWidth - deltaX);
                            newHeight = Math.max(200, startHeight - deltaY);
                            window.style.left = (window.offsetLeft + deltaX) + 'px';
                            window.style.top = (window.offsetTop + deltaY) + 'px';
                            break;
                    }
                    
                    window.style.width = newWidth + 'px';
                    window.style.height = newHeight + 'px';
                }
                
                function stopResize() {
                    isResizing = false;
                    document.removeEventListener('mousemove', resize);
                    document.removeEventListener('mouseup', stopResize);
                }
            });
        });
    }
}

// Initialize the OS
document.addEventListener('DOMContentLoaded', () => {
    window.myOS = new Window95();
}); 