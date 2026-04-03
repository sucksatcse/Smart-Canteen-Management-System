<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class JWTAuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     * Protect routes with the auth:api middleware.
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Register a User.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:Users,Email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:customer,staff,admin',
            'contact_no' => ['required', 'regex:/^\+?[0-9]{7,15}$/'],
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'Name' => $request->name,
            'Email' => $request->email,
            'Role' => $request->role,
            'PhoneNo' => $request->contact_no,
            'PasswordHash' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
    }

    /**
     * Get a JWT via given credentials.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Generate the JWT token mapping the frontend 'email' to DB 'Email' and 'password' literal string
        if (! $token = auth('api')->attempt(['Email' => $request->email, 'password' => $request->password])) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->createNewToken($token);
    }

    /**
     * Get the authenticated User.
     */
    public function me()
    {
        $user = auth('api')->user();
        return response()->json([
            'id'    => $user->UserID,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role,
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     */
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'User successfully signed out']);
    }

    /**
     * Get the token array structure.
     */
    protected function createNewToken($token)
    {
        $user = auth('api')->user();
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user' => [
                'id'    => $user->UserID,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ]);
    }
}
