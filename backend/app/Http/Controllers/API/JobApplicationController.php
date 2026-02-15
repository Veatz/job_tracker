<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class JobApplicationController extends Controller
{
    public function index(): JsonResponse
    {
        $jobs = JobApplication::orderBy('applied_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $jobs
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'company_name' => 'required|string|max:255',
                'position' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'nullable|string|in:applied,interview,offer,rejected,accepted',
                'location' => 'nullable|string|max:255',
                'salary_range' => 'nullable|string|max:255',
                'applied_date' => 'required|date',
                'interview_date' => 'nullable|date',
                'notes' => 'nullable|string',
                'job_url' => 'nullable|url',
                'contact_email' => 'nullable|email',
                'contact_name' => 'nullable|string|max:255',
            ]);

            $job = JobApplication::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Job application created successfully',
                'data' => $job
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function show($id): JsonResponse
    {
        $jobApplication = JobApplication::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $jobApplication
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'company_name' => 'sometimes|required|string|max:255',
                'position' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'nullable|string|in:applied,interview,offer,rejected,accepted',
                'location' => 'nullable|string|max:255',
                'salary_range' => 'nullable|string|max:255',
                'applied_date' => 'sometimes|required|date',
                'interview_date' => 'nullable|date',
                'notes' => 'nullable|string',
                'job_url' => 'nullable|url',
                'contact_email' => 'nullable|email',
                'contact_name' => 'nullable|string|max:255',
            ]);

            $jobApplication = JobApplication::findOrFail($id);
            $jobApplication->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Job application updated successfully',
                'data' => $jobApplication->fresh()
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy($id): JsonResponse
    {
        $jobApplication = JobApplication::findOrFail($id);
        $jobApplication->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job application deleted successfully'
        ]);
    }
}
