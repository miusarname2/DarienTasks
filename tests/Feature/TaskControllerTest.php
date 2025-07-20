<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    private string $encryptedSample = 'U2FsdGVkX18kEuquNzigcHbSdLybdSMAX2SGejsYb0c=';
    private string $passphrase      = '46|xqPzLjrV5MHm2rK55XZi7hboRNS0Y6rFWb6ApjuT8ec9a4cf';

    /**
     * Helper to invoke protected/private methods for testing.
     */
    private function invokeMethod($object, $methodName, array $parameters = [])
    {
        $reflection = new \ReflectionClass($object);
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);
        return $method->invokeArgs($object, $parameters);
    }

    public function test_index_returns_all_tasks()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Task::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_decrypt_helper_works_end_to_end()
    {
        $controller = new \App\Http\Controllers\api\TaskController();
        $result = $this->invokeMethod(
            $controller,
            'decryptCryptoJS',
            [$this->encryptedSample, $this->passphrase]
        );
        $this->assertEquals('20', $result);
    }

    public function test_show_returns_task_for_authorized_user()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);
        $token   = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $task->id]);
    }

    public function test_show_fails_with_invalid_token()
    {
        $task = Task::factory()->create();

        $response = $this->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_show_fails_when_not_owner()
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $task  = Task::factory()->create(['user_id' => $owner->id]);

        Sanctum::actingAs($other);
        $token = $other->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson("/api/tasks/{$task->id}");

        $response->assertStatus(403)
            ->assertJson(['error' => 'No autorizado']);
    }

    public function test_update_modifies_task_for_owner()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id, 'title' => 'Old']);

        Sanctum::actingAs($user);
        $token = $user->createToken('test')->plainTextToken;

        $payload = ['title' => 'New Title'];
        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/tasks/{$task->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'New Title']);
        $this->assertDatabaseHas('tasks', [
            'id'    => $task->id,
            'title' => 'New Title'
        ]);
    }

    public function test_update_fails_for_non_owner()
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $task  = Task::factory()->create(['user_id' => $owner->id]);

        Sanctum::actingAs($other);
        $token = $other->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/tasks/{$task->id}", ['title' => 'Fail']);

        $response->assertStatus(403)
            ->assertJson(['error' => 'No autorizado']);
    }

    public function test_update_validation_errors()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->putJson("/api/tasks/{$task->id}", ['title' => '']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    public function test_destroy_deletes_task()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = $this->deleteJson("/api/tasks/{$task->id}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Task deleted successfully']);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }


    public function test_destroy_not_found()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/tasks/999');

        $response->assertStatus(404);
    }
}
