<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\UploadedFile;

class FileController extends Controller
{
    public function uploadResume(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'resume' => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('resume');
            $user = Auth::user();
            
            // Only candidates can upload resumes
            if (!$user->isCandidate()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only candidates can upload resumes'
                ], 403);
            }

            // Delete old resume if exists
            if ($user->candidateProfile && $user->candidateProfile->resume) {
                Storage::disk('public')->delete($user->candidateProfile->resume);
            }

            $path = $file->store('resumes', 'public');
            $filename = $file->getClientOriginalName();
            
            // Update candidate profile
            if ($user->candidateProfile) {
                $user->candidateProfile->update([
                    'resume' => $path,
                    'resume_filename' => $filename,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Resume uploaded successfully',
                'data' => [
                    'path' => $path,
                    'filename' => $filename,
                    'url' => Storage::url($path),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload resume: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('logo');
            $user = Auth::user();
            
            // Only employers can upload logos
            if (!$user->isEmployer()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only employers can upload company logos'
                ], 403);
            }

            // Check if user has a company
            if (!$user->company) {
                return response()->json([
                    'success' => false,
                    'message' => 'You must have a company profile first'
                ], 403);
            }

            // Delete old logo if exists
            if ($user->company->logo) {
                Storage::disk('public')->delete($user->company->logo);
            }

            $path = $file->store('company-logos', 'public');
            
            $user->company->update([
                'logo' => $path
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Logo uploaded successfully',
                'data' => [
                    'path' => $path,
                    'url' => Storage::url($path),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload logo: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadDocument(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|file|mimes:pdf,doc,docx,txt,jpg,jpeg,png,gif|max:10240',
            'type' => 'required|string|in:portfolio,certification,other',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('document');
            $type = $request->input('type');
            
            $folder = $type === 'portfolio' ? 'portfolio' : 'documents';
            $path = $file->store($folder, 'public');
            
            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'data' => [
                    'path' => $path,
                    'filename' => $file->getClientOriginalName(),
                    'url' => Storage::url($path),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'type' => $type
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload document: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('image');
            $path = $file->store('images', 'public');
            
            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => [
                    'path' => $path,
                    'url' => Storage::url($path),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteFile(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string',
            'type' => 'required|string|in:resume,logo,profile_image,document',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $path = $request->input('path');
            $type = $request->input('type');
            $user = Auth::user();

            // Verify ownership based on file type
            if (!$this->userOwnsFile($user, $path, $type)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: You do not own this file'
                ], 403);
            }

            // Prevent path traversal attacks
            $path = basename($path);
            $allowedDirectories = ['resumes', 'company-logos', 'profile-images', 'documents', 'portfolio'];
            $directory = dirname($request->input('path'));

            if (!in_array($directory, $allowedDirectories)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid file path'
                ], 400);
            }

            $fullPath = $directory . '/' . $path;

            if (Storage::disk('public')->exists($fullPath)) {
                Storage::disk('public')->delete($fullPath);

                // Update the corresponding model to remove the file reference
                $this->updateModelAfterDeletion($user, $type);
            }

            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify that the user owns the file they are trying to delete.
     */
    private function userOwnsFile($user, string $path, string $type): bool
    {
        switch ($type) {
            case 'resume':
                if (!$user->isCandidate() || !$user->candidateProfile) {
                    return false;
                }
                return $user->candidateProfile->resume === $path;

            case 'logo':
                if (!$user->isEmployer() || !$user->company) {
                    return false;
                }
                return $user->company->logo === $path;

            case 'profile_image':
                return $user->profile_image === $path;

            case 'document':
                // For documents, check if the path contains user ID or is in their documents
                return str_contains($path, (string) $user->id) ||
                       ($user->candidateProfile && in_array($path, $user->candidateProfile->documents ?? []));

            default:
                return false;
        }
    }

    /**
     * Update the model after file deletion to remove the file reference.
     */
    private function updateModelAfterDeletion($user, string $type): void
    {
        switch ($type) {
            case 'resume':
                if ($user->candidateProfile) {
                    $user->candidateProfile->update(['resume' => null, 'resume_filename' => null]);
                }
                break;

            case 'logo':
                if ($user->company) {
                    $user->company->update(['logo' => null]);
                }
                break;

            case 'profile_image':
                $user->update(['profile_image' => null]);
                break;
        }
    }
}
