<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    /**
     * Create a new AuthController instance.
     * Protect routes with the auth:api middleware.
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Retrieve all posts for the authenticated user.
     */
    public function index()
    {
        $posts = auth('api')->user()->posts()->get();
        return response()->json(['success' => true, 'data' => $posts], 200);
    }

    /**
     * Store a newly created post for the authenticated user.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $post = auth('api')->user()->posts()->create([
            'title' => $request->title,
            'content' => $request->content
        ]);

        return response()->json(['success' => true, 'data' => $post], 201);
    }

    /**
     * Display a specific post of the authenticated user.
     */
    public function show($id)
    {
        $post = auth('api')->user()->posts()->find($id);

        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Post not found or unauthorized'], 404);
        }

        return response()->json(['success' => true, 'data' => $post], 200);
    }

    /**
     * Update the authenticated user's post.
     */
    public function update(Request $request, $id)
    {
        $post = auth('api')->user()->posts()->find($id);

        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Post not found or unauthorized'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $post->update($request->only('title', 'content'));

        return response()->json(['success' => true, 'data' => $post], 200);
    }

    /**
     * Delete the authenticated user's post.
     */
    public function destroy($id)
    {
        $post = auth('api')->user()->posts()->find($id);

        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Post not found or unauthorized'], 404);
        }

        $post->delete();

        return response()->json(['success' => true, 'message' => 'Post deleted successfully'], 200);
    }
}
