<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramFlow extends Model
{
    use HasFactory;
    protected $fillable = [
        'event',
        'remarks',
        'time'
    ];
}
