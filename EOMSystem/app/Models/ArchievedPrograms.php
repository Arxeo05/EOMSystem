<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class ArchievedPrograms extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'title',
        'startDate',
        'endDate',
        'place',
        'leaderId',
        'flow',
        'additionalDetail'
    ];

    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
