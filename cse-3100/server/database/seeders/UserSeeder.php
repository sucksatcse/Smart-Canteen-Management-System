<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Admin Profile
        User::updateOrCreate(
            ['Email' => 'admin@smartcanteen.com'],
            [
                'Name' => 'Admin User',
                'PasswordHash' => Hash::make('password'),
                'Role' => 'admin',
                'PhoneNo' => '+1234567890',
            ]
        );

        // Staff Profile
        User::updateOrCreate(
            ['Email' => 'staff@smartcanteen.com'],
            [
                'Name' => 'Staff User',
                'PasswordHash' => Hash::make('password'),
                'Role' => 'staff',
                'PhoneNo' => '+1234567891',
            ]
        );

        // Customer Profile
        User::updateOrCreate(
            ['Email' => 'customer@smartcanteen.com'],
            [
                'Name' => 'John Customer',
                'PasswordHash' => Hash::make('password'),
                'Role' => 'customer',
                'PhoneNo' => '+1234567892',
            ]
        );
    }
}
