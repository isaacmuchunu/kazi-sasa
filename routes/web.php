<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// API routes are in routes/api.php under /api/v1 prefix
// All frontend routing is handled by React Router

// SPA Route - Load React App for all non-API routes
Route::get('/{any}', function () {
    return view('spa');
})->where('any', '^(?!api).*$');
