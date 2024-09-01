<?php
 
namespace Database\Factories;
 
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
 
class UserFactory extends Factory
{
    protected $model = User::class;
   
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ];
    }
 
 
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
 
    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'gost',
            'email' => 'gost@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'guest',
        ]);
    }
}
 