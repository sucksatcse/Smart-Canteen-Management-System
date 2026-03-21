<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuItem;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $items = [
            ['name' => 'Chicken Rice Bowl', 'description' => 'Grilled chicken with steamed rice and vegetables', 'price' => 120.00, 'category' => 'main'],
            ['name' => 'Beef Burger', 'description' => 'Juicy beef patty with lettuce, tomato and cheese', 'price' => 150.00, 'category' => 'main'],
            ['name' => 'Vegetable Fried Rice', 'description' => 'Stir-fried rice with seasonal vegetables', 'price' => 90.00, 'category' => 'main'],
            ['name' => 'French Fries', 'description' => 'Crispy golden fries with dipping sauce', 'price' => 60.00, 'category' => 'snack'],
            ['name' => 'Spring Rolls', 'description' => 'Crispy rolls filled with mixed vegetables', 'price' => 50.00, 'category' => 'snack'],
            ['name' => 'Mango Lassi', 'description' => 'Chilled yogurt drink blended with fresh mango', 'price' => 45.00, 'category' => 'drinks'],
            ['name' => 'Fresh Orange Juice', 'description' => 'Freshly squeezed orange juice', 'price' => 55.00, 'category' => 'drinks'],
            ['name' => 'Mineral Water', 'description' => 'Chilled mineral water (500ml)', 'price' => 20.00, 'category' => 'drinks'],
            ['name' => 'Chocolate Cake Slice', 'description' => 'Rich moist chocolate cake slice', 'price' => 70.00, 'category' => 'dessert'],
            ['name' => 'Fruit Salad', 'description' => 'Seasonal fresh fruit mix with honey drizzle', 'price' => 65.00, 'category' => 'dessert'],
        ];

        foreach ($items as $item) {
            MenuItem::updateOrCreate(['name' => $item['name']], $item);
        }
    }
}
