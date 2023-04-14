<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
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

    public function participants(): HasMany
    {
        return $this->hasMany(ProgramParticipants::class);
    }

    public function partners(): HasMany
    {
        return $this->hasMany(ProgramPartners::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(ProgramFiles::class);
    }

    public function members(): BelongsToMany{
        return $this->belongsToMany(User::class,'member_programs','programId','memberId');
    }
}
