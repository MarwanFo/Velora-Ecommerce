<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * List all users with pagination
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Filter admins
        if ($request->has('role')) {
            if ($request->role === 'admin') {
                $query->where('is_admin', true);
            } elseif ($request->role === 'customer') {
                $query->where('is_admin', false);
            }
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Show a single user
     */
    public function show(User $user)
    {
        // Get user's order stats
        $orderCount = $user->orders()->count();
        $totalSpent = $user->orders()->where('payment_status', 'paid')->sum('total');

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'created_at' => $user->created_at,
                'order_count' => $orderCount,
                'total_spent' => $totalSpent,
            ],
        ]);
    }

    /**
     * Update user
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'is_admin' => 'boolean',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user,
        ]);
    }

    /**
     * Toggle admin status
     */
    public function toggleAdmin(User $user)
    {
        $user->update([
            'is_admin' => !$user->is_admin,
        ]);

        return response()->json([
            'message' => $user->is_admin ? 'User promoted to admin' : 'Admin privileges removed',
            'data' => $user,
        ]);
    }
}
