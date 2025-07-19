<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::all()->each(function (User $user) {
            Task::factory()
                ->count(rand(3, 7))
                ->create(['user_id' => $user->id]);
        });

        Task::factory()->count(10)->create([
            'user_id' => null,
        ]);
    }
}
