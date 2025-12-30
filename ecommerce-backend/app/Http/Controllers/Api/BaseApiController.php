<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/**
 * Base API Controller
 * Provides helper methods for consistent API responses
 */
class BaseApiController extends Controller
{
    /**
     * Success response
     */
    protected function success($data, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Error response
     */
    protected function error(string $message, int $code = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Created response
     */
    protected function created($data, string $message = 'Resource created'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    /**
     * No content response
     */
    protected function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }
}
