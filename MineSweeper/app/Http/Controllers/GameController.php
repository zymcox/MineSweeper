<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\HiScore;
use App\User;
use Auth;

class GameController extends Controller
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
       return view('game');
    }

    public function store(Request $req)
    {
        return view('game');
    }
}
