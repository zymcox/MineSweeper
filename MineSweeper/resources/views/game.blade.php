@extends('layouts.app')

@section('content')
<div class="container" ng-app="MineSweeper">
    <div class="row" ng-controller="MinesweeperController">
        <div class="col-lg-9">
            <div >
                <div >
                    <div class="row">
                        
                        <div class="col-lg-4">
                            <h3>Time: <% showtime | date:'mm:ss' %> </h3>
                        </div>
                        <div class=col-lg-8>
                            <div class="col-lg-12">
                                <h3>
                                    <form method="POST" action="/game">
                                        <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                        <input type="hidden" name="time" value="<% showtime | date:'mm:ss' %>">
                                        <input type="hidden" name="won" value="<% isWinMessageVisible %>">
                                        <input type="submit" class="btn btn-success pull-right" value="Restart" >
                                    </form>
                                </h3>
                            </div>
                        </div>
                    </div>
                   
                    <table class="minefield" border="0" oncontextmenu="return false;">
                        <tr ng-repeat="row in minefield.rows">
                            <td ng-repeat="spot in row.spots" ng-mousedown="handleSpot($event, spot)">
                                <img ng-if="spot.isCovered && !spot.isMarked" src="images/Covered.gif" height="32" width="32">
                                <img ng-if="spot.isCovered  && spot.isMarked" src="images/CoveredMarked.gif" height="32" width="32">
                                <img ng-if="!spot.isCovered && spot.content == 'empty'" src="images/empty.gif" height="32" width="32">
                                <img ng-if="!spot.isCovered && spot.content == 'mine'" src="images/mine.gif" height="32" width="32">
                                <img ng-if="!spot.isCovered && spot.content == 1" src="images/number-1.gif" height="32" width="32">
                                <img ng-if="!spot.isCovered && spot.content == 2" src="images/number-2.gif" height="32" width="32">
                                <img ng-if="!spot.isCovered && spot.content == 3" src="images/number-3.gif" height="32" width="32">
                                <img ng-if="!spot.isCovered && spot.content == 4" src="images/number-4.gif" height="32" width="32">
                                <img ng-if="!spot.isCovered && spot.content == 5" src="images/number-5.gif" height="32" width="32">
                                <img ng-if="!spot.isCovered && spot.content == 6" src="images/number-6.gif" height="32" width="32">
                                <img ng-if="!spot.isCovered && spot.content == 7" src="images/number-7.gif" height="32" width="32">
                                <img ng-if="!spot.isCovered && spot.content == 8" src="images/number-8.gif" height="32" width="32">
                            </td>
                        </tr>
                    </table>
                    <div class="row">
                        <div class="col-lg-12">
                            <h3 ng-if="isWinMessageVisible"><% timer %></h3>
                            <h3 ng-if="isLostMessageVisible">You lost!</h3>
                            <h3 ng-if="isWinMessageVisible != true && isLostMessageVisible != true">Number of mines: <% mines %> Marked mines: <% marked %> Mines left: <% mines - marked %></h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-3">
            <div class="row">
                <h3>Best times:</h3>
            </div>
            <div class="row" ng-repeat="score in hiscorelist">
                <h4><% score.name %>: <% score.time.slice(14,19) %></h4>
            </div>
        </div>
    </div>
</div>
@endsection