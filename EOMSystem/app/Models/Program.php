<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Program extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = [
        'title',
        'start-date',
        'end-date',
        'place',
        'lead',
        'flow',
        'additionalDetail'
    ];

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

    public function members(){
        return $this->belongsTo(User::class,'member_program','program_id','member_id');
    }
}
