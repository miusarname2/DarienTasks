<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function a_user_can_be_created_with_fillable_attributes()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'password' => 'password123',
        ];

        $user = User::create($userData);

        $this->assertNotNull($user);
        $this->assertEquals($userData['name'], $user->name);
        $this->assertEquals($userData['email'], $user->email);
        $this->assertTrue(Hash::check('password123', $user->password)); // Password should be hashed
        $this->assertTrue($user->exists);
    }

    /** @test */
    public function user_password_attribute_is_hidden_from_serialization()
    {
        $user = User::factory()->create();

        // Convert user to array (simulates serialization)
        $userArray = $user->toArray();

        $this->assertArrayNotHasKey('password', $userArray);
        $this->assertArrayNotHasKey('remember_token', $userArray);
    }

    /** @test */
    public function user_password_attribute_is_cast_to_hashed()
    {
        $password = 'secretPassword';
        $user = User::factory()->create(['password' => $password]);

        // Ensure it's not the plain password
        $this->assertNotEquals($password, $user->password);
        // Ensure it's a valid hash
        $this->assertTrue(Hash::check($password, $user->password));
    }

    /** @test */
    public function user_email_verified_at_attribute_is_cast_to_datetime()
    {
        $user = User::factory()->create();
        $this->assertInstanceOf(\Illuminate\Support\Carbon::class, $user->email_verified_at);

        $user->email_verified_at = null;
        $this->assertNull($user->email_verified_at);
    }
}
