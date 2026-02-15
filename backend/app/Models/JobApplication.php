<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'position',
        'description',
        'status',
        'location',
        'salary_range',
        'applied_date',
        'interview_date',
        'notes',
        'job_url',
        'contact_email',
        'contact_name',
    ];

    protected function casts(): array
    {
        return [
            'applied_date' => 'date',
            'interview_date' => 'date',
        ];
    }
}
