<?php
header('Content-Type: application/json');

class FileSystem {
    private $rootPath;
    
    public function __construct() {
        $this->rootPath = __DIR__ . '/../../files/';
        if (!file_exists($this->rootPath)) {
            mkdir($this->rootPath, 0777, true);
        }
    }
    
    public function listDirectory($path = '') {
        $fullPath = $this->rootPath . $path;
        $items = [];
        
        if (is_dir($fullPath)) {
            $files = scandir($fullPath);
            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..') {
                    $itemPath = $fullPath . '/' . $file;
                    $items[] = [
                        'name' => $file,
                        'type' => is_dir($itemPath) ? 'directory' : 'file',
                        'size' => is_file($itemPath) ? filesize($itemPath) : 0,
                        'modified' => filemtime($itemPath),
                        'path' => $path . '/' . $file
                    ];
                }
            }
        }
        
        return $items;
    }
    
    public function createDirectory($path) {
        $fullPath = $this->rootPath . $path;
        return mkdir($fullPath, 0777, true);
    }
    
    public function deleteItem($path) {
        $fullPath = $this->rootPath . $path;
        if (is_dir($fullPath)) {
            return $this->deleteDirectory($fullPath);
        } else {
            return unlink($fullPath);
        }
    }
    
    private function deleteDirectory($dir) {
        if (!file_exists($dir)) {
            return true;
        }
        
        if (!is_dir($dir)) {
            return unlink($dir);
        }
        
        foreach (scandir($dir) as $item) {
            if ($item == '.' || $item == '..') {
                continue;
            }
            
            if (!$this->deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
                return false;
            }
        }
        
        return rmdir($dir);
    }
    
    public function moveItem($source, $destination) {
        $sourcePath = $this->rootPath . $source;
        $destPath = $this->rootPath . $destination;
        return rename($sourcePath, $destPath);
    }
    
    public function copyItem($source, $destination) {
        $sourcePath = $this->rootPath . $source;
        $destPath = $this->rootPath . $destination;
        
        if (is_dir($sourcePath)) {
            return $this->copyDirectory($sourcePath, $destPath);
        } else {
            return copy($sourcePath, $destPath);
        }
    }
    
    private function copyDirectory($source, $dest) {
        if (!file_exists($dest)) {
            mkdir($dest, 0777, true);
        }
        
        foreach (scandir($source) as $item) {
            if ($item == '.' || $item == '..') {
                continue;
            }
            
            $sourceItem = $source . '/' . $item;
            $destItem = $dest . '/' . $item;
            
            if (is_dir($sourceItem)) {
                $this->copyDirectory($sourceItem, $destItem);
            } else {
                copy($sourceItem, $destItem);
            }
        }
        
        return true;
    }
    
    public function getItemProperties($path) {
        $fullPath = $this->rootPath . $path;
        if (!file_exists($fullPath)) {
            return null;
        }
        
        return [
            'name' => basename($path),
            'type' => is_dir($fullPath) ? 'directory' : 'file',
            'size' => is_file($fullPath) ? filesize($fullPath) : 0,
            'modified' => filemtime($fullPath),
            'created' => filectime($fullPath),
            'path' => $path
        ];
    }
}

$fs = new FileSystem();
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        $path = $_GET['path'] ?? '';
        echo json_encode($fs->listDirectory($path));
        break;
        
    case 'create':
        $path = $_GET['path'] ?? '';
        echo json_encode(['success' => $fs->createDirectory($path)]);
        break;
        
    case 'delete':
        $path = $_GET['path'] ?? '';
        echo json_encode(['success' => $fs->deleteItem($path)]);
        break;
        
    case 'move':
        $source = $_GET['source'] ?? '';
        $destination = $_GET['destination'] ?? '';
        echo json_encode(['success' => $fs->moveItem($source, $destination)]);
        break;
        
    case 'copy':
        $source = $_GET['source'] ?? '';
        $destination = $_GET['destination'] ?? '';
        echo json_encode(['success' => $fs->copyItem($source, $destination)]);
        break;
        
    case 'properties':
        $path = $_GET['path'] ?? '';
        echo json_encode($fs->getItemProperties($path));
        break;
        
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
} 