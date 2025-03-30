<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class PredictController extends Controller
{
    public function predict(Request $request)
    {
        // Validar que el texto esté presente
        $request->validate([
            'text' => 'required|string',
        ]);

        // Obtener el texto del request
        $text = $request->input('text');

        // Ruta al script de Python
        $pythonScriptPath = base_path('scripts/predict.py');

        // Ejecutar el script de Python
        $process = new Process(['python3', $pythonScriptPath, $text]);
        $process->run();

        // Verificar si la ejecución fue exitosa
        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        // Obtener la salida del script de Python
        $output = $process->getOutput();

        // Devolver la categoría predicha
        return response()->json([
            'category' => trim($output),
        ]);
    }
}