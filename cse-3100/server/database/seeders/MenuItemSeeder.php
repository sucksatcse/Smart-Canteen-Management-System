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
            ['Name' => 'Chicken Rice Bowl', 'Price' => 120.00, 'Category' => 'main'],
            ['Name' => 'Beef Burger', 'Price' => 150.00, 'Category' => 'main'],
            ['Name' => 'Vegetable Fried Rice', 'Price' => 90.00, 'Category' => 'main'],
            ['Name' => 'French Fries', 'Price' => 60.00, 'Category' => 'snack'],
            ['Name' => 'Spring Rolls', 'Price' => 50.00, 'Category' => 'snack'],
            ['Name' => 'Mango Lassi', 'Price' => 45.00, 'Category' => 'drinks'],
            ['Name' => 'Fresh Orange Juice', 'Price' => 55.00, 'Category' => 'drinks'],
            ['Name' => 'Mineral Water', 'Price' => 20.00, 'Category' => 'drinks'],
            ['Name' => 'Chocolate Cake Slice', 'Price' => 70.00, 'Category' => 'dessert'],
            ['Name' => 'Fruit Salad', 'Price' => 65.00, 'Category' => 'dessert'],
        ];

        foreach ($items as $item) {
            MenuItem::updateOrCreate(
                ['Name' => $item['Name']],
                array_merge($item, [
                    'CanteenID' => 1,
                    'IsAvailable' => true,
                    'StockQuantity' => 100,
                    'ImageURL' => null,
                ])
            );
        }
    }
}
