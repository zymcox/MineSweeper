<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use App\HiScore;
use App\User;
use Auth;

class ScoreController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //hämta hiscorelistan från databasen
        $hiscores = HiScore::join('users', 'users.id', '=', 'hi_scores.user_id')
        ->orderBy('time')
        ->select('name', 'time')
        ->take(12)
        ->getQuery()
        ->get();
        return ['hiscorelist' => $hiscores];
    }

    public function store(Request $req)
    {
        //lägg till ny hiscore
        $time = request('time');
        $time = "1970-01-02 00:".$time;
        $user_id = Auth::id();
        HiScore::create(['time' => $time, 'user_id' => $user_id]);
        return;
    }
}
