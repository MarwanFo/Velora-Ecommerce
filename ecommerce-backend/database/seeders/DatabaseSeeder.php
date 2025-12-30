<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed categories first (products depend on them)
        $this->call([
            CategorySeeder::class,
            ProductSeeder::class,
        ]);

        // Create a test admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@velora.com',
        ]);
    }
}
