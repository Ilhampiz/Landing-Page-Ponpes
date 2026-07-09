<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\PpdbController;
use App\Http\Controllers\Api\SettingController;

// =====================
// PUBLIC ROUTES
// =====================
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{slug}', [NewsController::class, 'show']);
Route::post('/ppdb', [PpdbController::class, 'store']);

// =====================
// ADMIN ROUTES (perlu token)
// =====================
Route::prefix('admin')->group(function () {

    // Auth
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

    // Protected
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // News
        Route::get('/news', [NewsController::class, 'adminIndex']);
        Route::post('/news', [NewsController::class, 'store']);
        Route::put('/news/{id}', [NewsController::class, 'update']);
        Route::delete('/news/{id}', [NewsController::class, 'destroy']);

        // Gallery
        Route::get('/gallery', [GalleryController::class, 'index']);
        Route::post('/gallery', [GalleryController::class, 'store']);
        Route::put('/gallery/{id}', [GalleryController::class, 'update']);
        Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);
        Route::post('/upload', [GalleryController::class, 'upload']);

        // Programs
        Route::get('/programs', [ProgramController::class, 'index']);
        Route::post('/programs', [ProgramController::class, 'store']);
        Route::put('/programs/{id}', [ProgramController::class, 'update']);
        Route::delete('/programs/{id}', [ProgramController::class, 'destroy']);

        // PPDB
        Route::get('/ppdb', [PpdbController::class, 'index']);
        Route::put('/ppdb/{id}/status', [PpdbController::class, 'updateStatus']);

        // Settings
        Route::get('/settings', [SettingController::class, 'index']);
        Route::put('/settings', [SettingController::class, 'update']);
    });
});