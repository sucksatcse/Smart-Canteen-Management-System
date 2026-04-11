<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * GET /api/admin/dashboard
     * Returns KPI data, chart data, popular items, and recent orders.
     */
    public function dashboard()
    {
        try {
            $today = date('Y-m-d');

            // KPI: Today's revenue + orders
            $todayStats = DB::table('Orders')
                ->whereRaw("DATE(CreatedAt) = ?", [$today])
                ->selectRaw('COUNT(*) as todayOrders, COALESCE(SUM(TotalAmount),0) as todayRevenue')
                ->first();

            // KPI: Active orders (pending + preparing)
            $activeOrders = DB::table('Orders')
                ->whereIn('Status', ['pending', 'preparing'])
                ->count();

            // KPI: Completed orders total
            $completedOrders = DB::table('Orders')
                ->where('Status', 'completed')
                ->count();

            // KPI: Low stock count
            $lowStock = DB::table('Menu')
                ->where('StockQuantity', '<', 10)
                ->count();

            // Chart: Last 7 days revenue
            $chartData = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = date('Y-m-d', strtotime("-$i days"));
                $dayRevenue = DB::table('Orders')
                    ->whereRaw("DATE(CreatedAt) = ?", [$date])
                    ->where('Status', '!=', 'cancelled')
                    ->sum('TotalAmount');
                $dayOrders = DB::table('Orders')
                    ->whereRaw("CAST(CreatedAt AS DATE) = ?", [$date])
                    ->count();
                $chartData[] = [
                    'date' => date('M j', strtotime($date)),
                    'sales' => (float)($dayRevenue ?? 0),
                    'orders' => (int)$dayOrders
                ];
            }

            // Popular items: top 5 by quantity sold
            $popularItems = DB::table('OrderItems')
                ->join('Menu', 'OrderItems.ItemID', '=', 'Menu.ItemID')
                ->selectRaw('Menu.Name as name, SUM(OrderItems.Quantity) as orders')
                ->groupBy('Menu.ItemID', 'Menu.Name')
                ->orderByRaw('SUM(OrderItems.Quantity) DESC')
                ->limit(5)
                ->get();

            // Recent orders
            $recentOrders = DB::table('Orders')
                ->join('Users', 'Orders.CustomerID', '=', 'Users.UserID')
                ->select('Orders.OrderID as id', 'Users.Name as customerName',
                    'Orders.TotalAmount as totalAmount', 'Orders.Status as status',
                    'Orders.CreatedAt as createdAt')
                ->orderBy('Orders.CreatedAt', 'desc')
                ->limit(10)
                ->get()
                ->map(function($o) {
                    $items = DB::table('OrderItems')
                        ->where('OrderID', $o->id)
                        ->count();
                    return [
                        'id' => 'ORD-' . str_pad($o->id, 3, '0', STR_PAD_LEFT),
                        'customerName' => $o->customerName,
                        'totalAmount' => (float)$o->totalAmount,
                        'status' => $o->status,
                        'createdAt' => $o->createdAt,
                        'itemsCount' => $items
                    ];
                });

            return response()->json([
                'kpi' => [
                    'todaySales' => (float)($todayStats->todayRevenue ?? 0),
                    'todayOrders' => (int)($todayStats->todayOrders ?? 0),
                    'activeOrders' => (int)$activeOrders,
                    'completedOrders' => (int)$completedOrders,
                    'lowStockItems' => (int)$lowStock,
                ],
                'chartData' => $chartData,
                'popularItems' => $popularItems,
                'recentOrders' => $recentOrders,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * GET /api/admin/staff
     * Returns all staff and admin users with salary details.
     */
    public function getStaff()
    {
        $staff = DB::table('Users')
            ->leftJoin('StaffDetails', 'StaffDetails.StaffID', '=', 'Users.UserID')
            ->whereIn('Users.Role', ['staff', 'admin', 'Staff', 'Admin'])
            ->select(
                'Users.UserID',
                'Users.Name',
                'Users.Email',
                'Users.Role',
                'StaffDetails.StaffID',
                'StaffDetails.HourlyRate',
                'StaffDetails.WorkingHours'
            )
            ->get()
            ->map(function($user) {
                $hourlyRate    = (float)($user->HourlyRate ?? 0);
                $workingHours  = (float)($user->WorkingHours ?? 0);
                return [
                    'id'           => (string)($user->StaffID ?? $user->UserID),
                    'userId'       => (string)$user->UserID,
                    'name'         => $user->Name,
                    'email'        => $user->Email,
                    'role'         => strtolower($user->Role),
                    'hourlyRate'   => $hourlyRate,
                    'workingHours' => $workingHours,
                    'totalSalary'  => round($hourlyRate * $workingHours, 2),
                    'joinedDate'   => date('Y-m-d'),
                ];
            });

        return response()->json($staff);
    }

    public function deleteStaff($userId)
    {
        try {
            // Remove StaffDetails first (FK constraint)
            DB::table('StaffDetails')->where('StaffID', $userId)->delete();
            
            // Detach staff from any orders they were assigned to
            DB::table('Orders')->where('AssignedStaffID', $userId)->update(['AssignedStaffID' => null]);
            
            // Remove the user
            $deleted = DB::table('Users')->where('UserID', $userId)->delete();
            if (!$deleted) {
                return response()->json(['error' => 'User not found'], 404);
            }
            return response()->json(['message' => 'Staff member deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * PUT /api/admin/staff/{id}
     * Updates staff salary details (hourly rate and working hours).
     */
    public function updateStaffSalary(Request $request, $id)
    {
        $request->validate([
            'hourlyRate'   => 'required|numeric|min:0',
            'workingHours' => 'required|numeric|min:0',
            'userId'       => 'required|string',
        ]);

        $userId = $request->userId;

        // Try to find an existing StaffDetails row by StaffID (which maps to UserID)
        $existing = DB::table('StaffDetails')->where('StaffID', $id)->first();
        if (!$existing) {
            $existing = DB::table('StaffDetails')->where('StaffID', $userId)->first();
        }

        if ($existing) {
            DB::table('StaffDetails')
                ->where('StaffID', $existing->StaffID)
                ->update([
                    'HourlyRate'    => $request->hourlyRate,
                    'WorkingHours'  => $request->workingHours
                ]);
        } else {
            // No StaffDetails row yet — insert one
            $user = DB::table('Users')->where('UserID', $userId)->first();
            if ($user) {
                DB::table('StaffDetails')->insert([
                    'StaffID'       => $user->UserID,
                    'CanteenID'     => 1,
                    'HourlyRate'    => $request->hourlyRate,
                    'WorkingHours'  => $request->workingHours,
                ]);
            }
        }

        return response()->json(['message' => 'Staff payroll updated successfully']);
    }

    /**
     * GET /api/admin/users
     * Returns all users with order counts.
     */
    public function getUsers()
    {
        $users = DB::table('Users')
            ->select('UserID as id', 'Name as name', 'Email as email', 'Role as role',
                'PhoneNo as phone', 'CreatedAt as createdAt')
            ->orderBy('CreatedAt', 'desc')
            ->get()
            ->map(function($u) {
                $orderCount = DB::table('Orders')->where('CustomerID', $u->id)->count();
                return array_merge((array)$u, ['orderCount' => $orderCount]);
            });

        return response()->json($users);
    }

    /**
     * GET /api/admin/orders
     * Returns all orders with item details for admin view.
     */
    public function getAllOrders()
    {
        try {
            $orders = DB::table('Orders')
                ->join('Users', 'Orders.CustomerID', '=', 'Users.UserID')
                ->select('Orders.*', 'Users.Name as CustomerName')
                ->orderBy('Orders.CreatedAt', 'desc')
                ->get();

            $items = DB::table('OrderItems')
                ->join('Menu', 'OrderItems.ItemID', '=', 'Menu.ItemID')
                ->select('OrderItems.OrderID', 'Menu.Name as FoodName', 'OrderItems.Quantity',
                    'OrderItems.UnitPrice', 'Menu.ImageURL', 'Menu.Price')
                ->get();

            $formatted = $orders->map(function($order) use ($items) {
                $orderItems = $items->where('OrderID', $order->OrderID)->values()->map(function($i) {
                    return [
                        'name'     => $i->FoodName,
                        'quantity' => $i->Quantity,
                        'price'    => (float)$i->Price,
                        'image'    => $i->ImageURL
                    ];
                });
                return [
                    'id'           => 'ORD-' . str_pad($order->OrderID, 3, '0', STR_PAD_LEFT),
                    'rawId'        => $order->OrderID,
                    'customerName' => $order->CustomerName,
                    'totalAmount'  => (float)$order->TotalAmount,
                    'status'       => $order->Status,
                    'createdAt'    => $order->CreatedAt,
                    'items'        => $orderItems,
                ];
            });

            return response()->json($formatted);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
