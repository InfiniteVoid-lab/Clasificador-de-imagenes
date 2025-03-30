<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

Route::post('/predict/text', function (Request $request) {
    $response = Http::post('http://127.0.0.1:8000/api/predict/text', [
        'text' => $request->input('text'),
    ]);

    return $response->json();
});