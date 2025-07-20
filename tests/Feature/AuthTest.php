<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase; // Limpia la base de datos antes de cada test

    /** @test */
    public function a_user_can_register_successfully()
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test',
            'lastname' => 'User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'created_at', 'updated_at'],
                'token'
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User' // name is combined in controller
        ]);
        $this->assertTrue(Hash::check('password123', User::where('email', 'test@example.com')->first()->password));
    }

    /** @test */
    public function registration_requires_valid_data()
    {
        // Missing fields
        $this->postJson('/api/register', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'lastname', 'email', 'password']);

        // Invalid email
        $this->postJson('/api/register', [
            'name' => 'Test',
            'lastname' => 'User',
            'email' => 'invalid-email',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        // Password not confirmed
        $this->postJson('/api/register', [
            'name' => 'Test',
            'lastname' => 'User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'wrong',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['password']);

        // Weak password (Laravel's default Password::min(8) rule)
        $this->postJson('/api/register', [
            'name' => 'Test',
            'lastname' => 'User',
            'email' => 'test@example.com',
            'password' => 'short',
            'password_confirmation' => 'short',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function registration_prevents_duplicate_emails()
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $this->postJson('/api/register', [
            'name' => 'Test',
            'lastname' => 'User',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function a_user_can_login_successfully()
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email'], // Note: 'password' is hidden
                'token'
            ]);

        $this->assertNotNull($response->json('token'));
        $this->assertEquals($user->id, $response->json('user.id'));
    }

    /** @test */
    public function login_fails_with_invalid_credentials()
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('secret123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Credenciales inválidas']);
    }

    /** @test */
    public function login_requires_valid_email_and_password()
    {
        // Missing email
        $this->postJson('/api/login', [
            'password' => 'password',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        // Missing password
        $this->postJson('/api/login', [
            'email' => 'test@example.com',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['password']);

        // Invalid email format
        $this->postJson('/api/login', [
            'email' => 'invalid-email',
            'password' => 'password',
        ])->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function a_user_can_logout_successfully()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Sesión cerrada correctamente']);

        // Verify the token is revoked (optional, but good practice)
        $this->assertDatabaseMissing('personal_access_tokens', [
            'token' => hash('sha256', $token), // Laravel hashes tokens in DB
        ]);
    }

    /** @test */
    public function logout_fails_without_authentication()
    {
        $this->postJson('/api/logout')
            ->assertStatus(401); // Unauthorized
    }
}
