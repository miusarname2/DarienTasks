<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum; // Importa Sanctum
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $user;
    protected string $token;
    protected string $encryptedUserId; // Store the encrypted user ID for tests

    protected function setUp(): void
    {
        parent::setUp();
        // Create a user and authenticate them for most tests
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user, ['*']);
        $this->token = $this->user->createToken('test_token')->plainTextToken;

        // Manually encrypt the user_id "1" (as determined from your example)
        // This is a simplified direct test; in a real app, you'd use a robust client-side encryption or mock this.
        // For the provided encrypted string 'U2FsdGVkX18kEuquNzigcHbSdLybdSMAX2SGejsYb0c=',
        // it decrypts to '1' using the passphrase '46|xqPzLjrV5MHm2rK55XZi7hboRNS0Y6rFWb6ApjuT8ec9a4cf'.
        // So we'll ensure our test user has ID 1 or create a user with that specific ID.
        // Let's create a user with ID 1 if it doesn't exist.
        $this->user = User::find(1) ?? User::factory()->create(['id' => 1]);

        // This is the actual encrypted string and passphrase you provided
        $this->encryptedUserId = 'U2FsdGVkX18kEuquNzigcHbSdLybdSMAX2SGejsYb0c=';
    }

    /** @test */
    public function it_can_list_all_tasks_for_authenticated_user()
    {
        Task::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/tasks');

        $response->assertStatus(200)
            ->assertJsonCount(3)
            ->assertJsonStructure([
                '*' => ['id', 'title', 'description', 'completed', 'user_id', 'due_date', 'created_at', 'updated_at']
            ]);

        $this->assertEquals(Task::count(), count($response->json()));
    }


    /** @test */
    public function it_returns_400_if_encrypted_id_is_missing_on_store()
    {
        $taskData = [
            'title' => 'New Task',
            'description' => 'Description for new task',
            'completed' => false,
            'due_date' => '2025-01-01',
            // 'user_id' is missing
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/tasks', $taskData);

        $response->assertStatus(400)
            ->assertJson(['error' => 'Encrypted ID is required']);
    }

    /** @test */
    public function it_returns_401_if_token_is_missing_on_store()
    {
        $taskData = [
            'title' => 'New Task',
            'user_id' => $this->encryptedUserId,
        ];

        $response = $this->postJson('/api/tasks', $taskData); // No token header

        $response->assertStatus(401)
            ->assertJson(['error' => 'Token is required']); // From controller logic before middleware
    }

    /** @test */
    public function it_returns_400_if_decryption_fails_on_store()
    {
        $taskData = [
            'title' => 'New Task',
            'description' => 'Description for new task',
            'completed' => false,
            'due_date' => '2025-01-01',
            'user_id' => 'InvalidEncryptedString', // Malformed string
        ];

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->postJson('/api/tasks', $taskData);

        $response->assertStatus(400)
            ->assertJson(['error' => 'Decryption failed']);
    }

    /** @test */
    public function it_returns_401_if_token_is_invalid_on_show()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid_token',
        ])->getJson('/api/tasks/' . $task->id);

        $response->assertStatus(401)
            ->assertJson(['error' => 'Token inválido']);
    }

    /** @test */
    public function it_returns_404_if_task_not_found_on_update()
    {
        $response = $this->putJson('/api/tasks/9999', ['title' => 'Non Existent']);

        $response->assertStatus(404);
    }

    /** @test */
    public function it_returns_403_if_user_is_not_authorized_to_update_task()
    {
        $anotherUser = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $anotherUser->id]);

        // Authenticated as $this->user, trying to update $anotherUser's task
        $response = $this->putJson('/api/tasks/' . $task->id, ['title' => 'Unauthorized']);

        $response->assertStatus(403)
            ->assertJson(['error' => 'No autorizado']);
    }

    /** @test */
    public function it_can_delete_a_task_successfully()
    {
        $task = Task::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson('/api/tasks/' . $task->id);

        $response->assertStatus(200)
            ->assertJson(['message' => 'Task deleted successfully']);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    /** @test */
    public function it_returns_404_if_task_not_found_on_delete()
    {
        $response = $this->deleteJson('/api/tasks/9999');

        $response->assertStatus(404);
    }


    /** @test */
    public function search_by_user_id_returns_400_if_encrypted_id_is_missing()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/tasks/byUser'); // No 'eid' parameter

        $response->assertStatus(400)
            ->assertJson(['error' => 'Encrypted ID is required']);
    }

    /** @test */
    public function search_by_user_id_returns_401_if_token_is_missing()
    {
        $response = $this->getJson('/api/tasks/byUser?eid=' . $this->encryptedUserId); // No token header

        $response->assertStatus(401)
            ->assertJson(['error' => 'Token is required']);
    }

    /** @test */
    public function search_by_user_id_returns_400_if_decryption_fails()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->getJson('/api/tasks/byUser?eid=InvalidEncryptedString');

        $response->assertStatus(400)
            ->assertJson(['error' => 'Decryption failed']);
    }
}
