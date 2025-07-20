<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('tasks', function () {
        return Inertia::render('tasks');
    })->name('tasks');

    Route::get('tasks/create', function () {
        return Inertia::render('taskCreate');
    })->name('taskCreate');

    Route::get('tasks/edit', function () {
        return Inertia::render('taskEdit');
    })->name('taskEdit');

    Route::get('tasks/detail', function () {
        return Inertia::render('taskDetail');
    })->name('taskDetail');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
