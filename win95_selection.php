<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Windows 95 Selection Box</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #008080;
            height: 100vh;
            overflow: hidden;
            cursor: default;
        }
        
        .selection-box {
            position: absolute;
            border: 1px dashed #000;
            background-color: rgba(0, 0, 0, 0.1);
            pointer-events: none;
            display: none;
        }

        .desktop-icon {
            position: absolute;
            width: 80px;
            text-align: center;
            padding: 5px;
            cursor: pointer;
            user-select: none;
        }

        .desktop-icon img {
            width: 32px;
            height: 32px;
        }

        .desktop-icon span {
            display: block;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin-top: 5px;
        }

        .selected {
            background-color: rgba(0, 0, 128, 0.3);
        }

        .taskbar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            background: linear-gradient(to right, #000080, #1084d0);
            display: flex;
            align-items: center;
            padding: 0 5px;
        }

        .start-button {
            height: 24px;
            display: flex;
            align-items: center;
            background: linear-gradient(to right, #000080, #1084d0);
            border: 1px solid #fff;
            border-radius: 3px;
            padding: 0 8px;
            cursor: pointer;
            user-select: none;
        }

        .start-button i {
            font-size: 16px;
            margin-right: 5px;
            color: white;
        }

        .start-button span {
            color: white;
            font-family: Arial, sans-serif;
            font-size: 12px;
            font-weight: bold;
        }

        .start-button:active {
            background: linear-gradient(to right, #1084d0, #000080);
            border-color: #000080;
        }
    </style>
</head>
<body>
    <div class="selection-box" id="selectionBox"></div>
    
    <?php
    // Sample desktop icons
    $icons = [
        ['name' => 'My Computer', 'icon' => 'computer.png'],
        ['name' => 'Recycle Bin', 'icon' => 'recycle.png'],
        ['name' => 'My Documents', 'icon' => 'folder.png'],
        ['name' => 'Network', 'icon' => 'network.png']
    ];

    foreach ($icons as $index => $icon) {
        $x = 50 + ($index * 100);
        $y = 50;
        echo "<div class='desktop-icon' style='left: {$x}px; top: {$y}px;'>";
        echo "<img src='images/{$icon['icon']}' alt='{$icon['name']}'>";
        echo "<span>{$icon['name']}</span>";
        echo "</div>";
    }
    ?>

    <div class="taskbar">
        <div class="start-button" id="startButton">
            <i class="fab fa-windows"></i>
            <span>Start</span>
        </div>
    </div>

    <script>
        let isSelecting = false;
        let startX, startY;
        const selectionBox = document.getElementById('selectionBox');
        const desktopIcons = document.querySelectorAll('.desktop-icon');
        const startButton = document.getElementById('startButton');

        document.addEventListener('mousedown', (e) => {
            if (e.button === 0 && !e.target.closest('.start-button')) { // Left mouse button and not on start button
                isSelecting = true;
                startX = e.clientX;
                startY = e.clientY;
                selectionBox.style.display = 'block';
                selectionBox.style.left = startX + 'px';
                selectionBox.style.top = startY + 'px';
                selectionBox.style.width = '0px';
                selectionBox.style.height = '0px';
                
                // Clear previous selections
                desktopIcons.forEach(icon => icon.classList.remove('selected'));
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isSelecting) {
                const currentX = e.clientX;
                const currentY = e.clientY;
                
                const width = Math.abs(currentX - startX);
                const height = Math.abs(currentY - startY);
                
                const left = Math.min(currentX, startX);
                const top = Math.min(currentY, startY);
                
                selectionBox.style.left = left + 'px';
                selectionBox.style.top = top + 'px';
                selectionBox.style.width = width + 'px';
                selectionBox.style.height = height + 'px';

                // Check which icons are within the selection box
                desktopIcons.forEach(icon => {
                    const iconRect = icon.getBoundingClientRect();
                    const isInSelection = 
                        iconRect.left < left + width &&
                        iconRect.left + iconRect.width > left &&
                        iconRect.top < top + height &&
                        iconRect.top + iconRect.height > top;
                    
                    if (isInSelection) {
                        icon.classList.add('selected');
                    } else {
                        icon.classList.remove('selected');
                    }
                });
            }
        });

        document.addEventListener('mouseup', () => {
            isSelecting = false;
            selectionBox.style.display = 'none';
        });

        startButton.addEventListener('click', () => {
            alert('Start menu clicked!');
        });
    </script>
</body>
</html> 