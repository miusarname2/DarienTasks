<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->wantsJson() && $request->is('api/*')) {
            // Establece la cabecera 'Accept' para que Laravel trate la solicitud como una de JSON
            $request->headers->set('Accept', 'application/json');
        }

        return $next($request);
    }
}
