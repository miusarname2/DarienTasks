<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_fillable_properties()
    {
        $task = new Task();
        $this->assertEquals(
            ['title', 'description', 'completed', 'user_id', 'due_date'],
            $task->getFillable()
        );
    }

    public function test_casts()
    {
        $task = Task::factory()->make([
            'completed' => 1,
            'due_date' => '2025-07-25',
        ]);

        $this->assertIsBool($task->completed);
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $task->due_date);
    }

    public function test_user_relationship()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($task->user()->is($user));
    }
}
