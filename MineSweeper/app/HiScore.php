<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HiScore extends Model
{
    protected $table = "hi_scores";
    protected $fillable = ['user_id', 'time'];
}
