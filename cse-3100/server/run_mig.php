<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

try {
    $kernel->call('migrate:fresh', ['--seed' => true]);
    echo Illuminate\Support\Facades\Artisan::output();
} catch(\Exception $e) {
    echo $e->getMessage();
}
