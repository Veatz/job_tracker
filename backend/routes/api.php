<?php

use App\Http\Controllers\API\JobApplicationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::apiResource('jobs', JobApplicationController::class);
});
