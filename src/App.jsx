<?php

namespace App\Http\Controllers;

use App\Models\Provincia;
use App\Models\Lista;
use App\Models\Resultado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

namespace App\Http\Controllers;

use App\Models\Provincia;
use Illuminate\Http\Request;

class ProvinciaController extends Controller
{
    // Listar todos
    public function index()
    {
        $provincias = Provincia::all();
        
        return response()->json([
            'total' => $provincias->count(),
            'provincias' => $provincias
        ]);
    }

  // Crear
    public function store(Request $request)
    {
        $validated = $request->validate([
            // QUITAR 'idProvincia' de la validación.
            'nombre' => 'required|string|max:255|unique:provincias,nombre', // Usar nombre de tabla minúsculas
            'codigo' => 'nullable|string|max:10',
            'region' => 'nullable|string|max:100',
        ]);
        
        // Laravel asignará automáticamente el idProvincia si lo configuras como clave primaria.
        $provincia = Provincia::create($validated);

        return response()->json([
            'mensaje' => 'Provincia creada exitosamente',
            'provincia' => $provincia
        ], 201);
    }

    // Mostrar uno
    public function show($id)
    {
        $provincia = Provincia::findOrFail($id);
        
        return response()->json($provincia);
    }

    // Actualizar
    public function update(Request $request, $id)
    {
        $provincia = Provincia::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255|unique:Provincia,nombre,' . $id . ',idProvincia',
            'codigo' => 'nullable|string|max:10',
            'region' => 'nullable|string|max:100',
        ]);

        $provincia->update($validated);

        return response()->json([
            'mensaje' => 'Provincia actualizada exitosamente',
            'provincia' => $provincia
        ]);
    }

    // Eliminar
    public function destroy($id)
    {
        $provincia = Provincia::findOrFail($id);
        
        // Verificar si tiene listas o mesas
        if ($provincia->listas()->exists() || $provincia->mesas()->exists()) {
            return response()->json([
                'error' => 'No se puede eliminar la provincia porque tiene registros asociados'
            ], 400);
        }

        $provincia->delete();

        return response()->json([
            'mensaje' => 'Provincia eliminada correctamente'
        ]);
    }
}
