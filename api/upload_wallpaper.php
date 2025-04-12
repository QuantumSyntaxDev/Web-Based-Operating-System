<?php
header('Content-Type: application/json');

// Проверяем, что файл был загружен
if (!isset($_FILES['wallpaper'])) {
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['wallpaper'];

// Проверяем на ошибки загрузки
if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'error' => 'Upload error: ' . $file['error']]);
    exit;
}

// Проверяем тип файла
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(['success' => false, 'error' => 'Invalid file type. Only JPG, PNG and GIF are allowed']);
    exit;
}

// Создаем уникальное имя файла
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'custom_' . time() . '.' . $extension;
$uploadPath = '../wallpapers/' . $filename;

// Создаем директорию, если она не существует
if (!file_exists('../wallpapers')) {
    mkdir('../wallpapers', 0777, true);
}

// Перемещаем файл
if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
    echo json_encode([
        'success' => true,
        'url' => 'wallpapers/' . $filename
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to save file']);
} 