<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class member_program extends Model
{
    public $timestamps = false;
    use HasFactory;

    public function users()
{
    return $this->belongsToMany(User::class)->withPivot('archived');
}

public function programs()
{
    return $this->belongsToMany(Program::class)->withPivot('archived');
}

}
