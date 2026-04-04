<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    /**
     * Upload and update the authenticated user's avatar.
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:4096', // 4MB max
        ]);

        $user = auth('api')->user();

        // Delete old avatar if exists
        if ($user->AvatarPath && Storage::disk('public')->exists($user->AvatarPath)) {
            Storage::disk('public')->delete($user->AvatarPath);
        }

        // Store new file: storage/app/public/avatars/{user_id}_{timestamp}.ext
        $extension = $request->file('avatar')->getClientOriginalExtension();
        $filename  = 'avatars/' . $user->UserID . '_' . time() . '.' . $extension;
        $request->file('avatar')->storeAs('', $filename, 'public');

        // Save the path to the database
        $user->AvatarPath = $filename;
        $user->save();

        // Return the full publicly accessible URL
        $avatarUrl = url('storage/' . $filename);

        return response()->json([
            'message'    => 'Avatar uploaded successfully.',
            'avatar_url' => $avatarUrl,
        ]);
    }

    /**
     * Get the authenticated user's profile with avatar URL resolved.
     */
    public function show()
    {
        $user = auth('api')->user();

        return response()->json([
            'id'         => $user->UserID,
            'name'       => $user->Name,
            'email'      => $user->Email,
            'role'       => $user->Role,
            'phone'      => $user->PhoneNo,
            'avatar_url' => $user->AvatarPath
                            ? url('storage/' . $user->AvatarPath)
                            : null,
        ]);
    }
}
