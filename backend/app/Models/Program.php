<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'title',
        'description',
        'focus_and_excellence',
        'icon_or_image',
        'order',
    ];
}