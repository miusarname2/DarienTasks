<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Función helper para replicar en PHP el descifrado de CryptoJS
     *
     * @param  string  $base64String  El string cifrado (Base64) que viene de CryptoJS
     * @param  string  $passphrase    La “clave” que usaste en front (tu token)
     * @return string|null            El texto original, o null si algo falla
     */
    private function decryptCryptoJS(string $base64String, string $passphrase): ?string
    {
        // 1) Decodificamos Base64
        $data = base64_decode($base64String);
        if (substr($data, 0, 8) !== 'Salted__') {
            return null; // no es un payload válido de CryptoJS/OpenSSL
        }

        // 2) Extraemos la sal y el ciphertext
        $salt = substr($data, 8, 8);
        $ciphertext = substr($data, 16);

        // 3) Derivamos key e IV con EVP_BytesToKey (MD5 iterativo)
        $rounds = 3;
        $data00 = $passphrase . $salt;
        $md5Hash = '';
        $prev = '';

        for ($i = 0; $i < $rounds; $i++) {
            $prev = md5($prev . $data00, true);
            $md5Hash .= $prev;
        }

        $key = substr($md5Hash, 0, 32);  // AES-256 → 32 bytes de clave
        $iv  = substr($md5Hash, 32, 16); // 16 bytes de IV

        // 4) Desciframos con AES‑256‑CBC
        $plain = openssl_decrypt(
            $ciphertext,
            'AES-256-CBC',
            $key,
            OPENSSL_RAW_DATA,
            $iv
        );

        return $plain === false ? null : $plain;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $tasks = Task::all();
        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'nullable|boolean',
            'user_id' => 'required|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create($validated);
        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $task = Task::findOrFail($id);
        return response()->json($task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'nullable|boolean',
            'user_id' => 'sometimes|exists:users,id',
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);
        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }

    /**
     * Search tasks by id_user.
     */
    public function searchByUserId(Request $request)
    {
        $encryptedId = $request->input('eid');
        if (! $encryptedId) {
            return response()->json(['error' => 'Encrypted ID is required'], 400);
        }

        $token = $request->bearerToken();
        if (! $token) {
            return response()->json(['error' => 'Token is required'], 401);
        }

        $userId = $this->decryptCryptoJS($encryptedId, $token);
        if (! $userId) {
            return response()->json(['error' => 'Decryption failed'], 400);
        }

        $tasks = Task::where('user_id', $userId)->get();
        return response()->json($tasks);
    }
}
