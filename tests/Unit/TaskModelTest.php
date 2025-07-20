<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskModelTest extends TestCase
{
    use RefreshDatabase; // Usamos RefreshDatabase para asegurar una base de datos limpia para cada test

    /** @test */
    public function a_task_can_be_created_with_fillable_attributes()
    {
        $user = User::factory()->create();

        $taskData = [
            'title' => 'Test Task Title',
            'description' => 'This is a test description.',
            'completed' => false,
            'user_id' => $user->id,
            'due_date' => '2024-12-31',
        ];

        $task = Task::create($taskData);

        $this->assertNotNull($task);
        $this->assertEquals($taskData['title'], $task->title);
        $this->assertEquals($taskData['description'], $task->description);
        $this->assertFalse($task->completed); // bool cast
        $this->assertEquals($taskData['user_id'], $task->user_id);
        $this->assertEquals($taskData['due_date'], $task->due_date->format('Y-m-d')); // date cast
        $this->assertTrue($task->exists);
    }

    /** @test */
    public function task_due_date_attribute_is_cast_to_date_object()
    {
        $dateString = '2025-01-15';
        $task = Task::factory()->create(['due_date' => $dateString]);

        $this->assertInstanceOf(Carbon::class, $task->due_date);
        $this->assertEquals($dateString, $task->due_date->format('Y-m-d'));
    }

    /** @test */
    public function a_task_belongs_to_a_user()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $task->user);
        $this->assertEquals($user->id, $task->user->id);
    }
}
