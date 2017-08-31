<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <title>latenight.moe</title>

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="/assets/css/play.bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/play.style.css">
    <link href="https://vjs.zencdn.net/6.1.0/video-js.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/videojs-resolution-switcher/0.4.2/videojs-resolution-switcher.min.css">
    <script src="https://use.fontawesome.com/b9166ba4e9.js"></script>

    <script>
        // variables
        window.HELP_IMPROVE_VIDEOJS = false;

        var myName;
        var videoUrl;
        var room;

        //var myName = "test";
        //var videoUrl = "test.mkv";
        if (typeof URL == "function") {
            var url = new URL(location.href);
            room = url.searchParams.get("room");
        }
        var cookies = true;
        var lowBandwidth = false;

        var forcedBuffer = false;
        var completedForcedBuffer = false;
    </script>
</head>
<body>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="https://latenight.moe" id="title">Title</a>
            </div>
            <!--
            <ul class="nav navbar-nav navbar-right">
                <li><a href="#"><i class="fa fa-lightbulb-o"></i></a></li>
            </ul>
            -->
        </div>
    </nav>

    <div class="container">
        <div class="container-media">
            <video id="media" class="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered" controls preload="none">
                <p class="vjs-no-js">
                    To view this video please enable JavaScript, and consider upgrading to a web browser that
                    <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                </p>
            </video>
            <div class="container-text scroll">
                <ul id="screen-chat"></ul>
            </div>
        </div>
        <div class="container-chat">
            <input type="text" placeholder="Say something..." id="chatbox" />
        </div>
    </div>
    
    <br />

    <div class="container">
        <ul class="nav nav-tabs">
            <li class="active"><a href="#dashboard" data-toggle="tab" aria-expanded="false">Status</a></li>
            <li class=""><a href="#log" data-toggle="tab" aria-expanded="false">Message Log</a></li>
            <li class=""><a href="#manual" data-toggle="tab" aria-expanded="false">Manual Controls</a></li>
            <li class=""><a href="#settings" data-toggle="tab" aria-expanded="false">Settings</a></li>
        </ul>
        <div id="myTabContent" class="tab-content">
            <div class="tab-pane fade active in" id="dashboard">
                <h1>Player Status</h1>
                <div class="progress progress-striped active">
                    <div class="progress-bar" id="progress-current"></div>
                    <div class="progress-bar progress-bar-success" id="progress-buffered"></div>
                </div>
                <span class="label label-primary" id="progress-current-label" title="Current Position"></span> 
                <span class="label label-success" id="progress-buffered-label" title="Read-ahead Buffer"></span> 
                <span class="label label-default" id="progress-total-label" title="Total Time"></span>
                <br />
                <h1>Connected Users</h1>
                <div id="heartbeat-table"></div>
            </div>
            <div class="tab-pane fade" id="log">
                <div class="container-log scroll">
                    <ul id="log-chat"></ul>
                </div>
                <a href="#" class="btn btn-xs btn-primary" id="btnClearLogs">Clear Log</a>
            </div>
            <div class="tab-pane fade" id="manual">
                <h1>Use this tab to manually control the page, in case the native player controls are not working properly.</h1>
                <span class="btn btn-primary" id="manPlay">Play</span>
            </div>
            <div class="tab-pane fade" id="settings">
                <div class="row">
                    <div class="col-xs-6">
                        <div class="settings-group">
                            <h1>Player</h1>
                            <div class="form-group" title="Changes the background from white to black and vice versa.">
                                <input type="checkbox" id="chkDarkRoom" autocomplete="off" />
                                <div class="btn-group">
                                    <label for="chkDarkRoom" class="btn btn-default">
                                        <i class="fa fa-check"></i>
                                        <i class="fa fa-close"></i>
                                    </label>
                                    <label for="chkDarkRoom" class="btn btn-default active">
                                        Dark Room
                                    </label>
                                </div>
                            </div>
                            <div class="form-group" title="Force video to fully buffer before playing it.">
                                <input type="checkbox" id="chkForceBuffer" autocomplete="off" />
                                <div class="btn-group">
                                    <label for="chkForceBuffer" class="btn btn-primary">
                                        <i class="fa fa-check"></i>
                                        <i class="fa fa-close"></i>
                                    </label>
                                    <label for="chkForceBuffer" class="btn btn-primary active">
                                        Force Buffer
                                    </label>
                                </div>
                                <p><small>Enabling this option will attempt to force the browser to buffer the entire video locally before playing the video. This option may be useful for slower connections.</small></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <div class="settings-group">
                            <h1>Advanced</h1>
                            <div class="form-group" title="Unsync from server.">
                                <input type="checkbox" id="chkUnsync" autocomplete="off" disabled />
                                <div class="btn-group">
                                    <label for="chkUnsync" class="btn btn-warning">
                                        <i class="fa fa-check"></i>
                                        <i class="fa fa-close"></i>
                                    </label>
                                    <label for="chkUnsync" class="btn btn-warning active">
                                        Unsync
                                    </label>
                                </div>
                                <p><small>(currently unavailable)</small></p>
                            </div>
                            <div class="form-group" title="Toggles the debug log output in the message log.">
                                <input type="checkbox" id="chkDebugLog" autocomplete="off" />
                                <div class="btn-group">
                                    <label for="chkDebugLog" class="btn btn-warning">
                                        <i class="fa fa-check"></i>
                                        <i class="fa fa-close"></i>
                                    </label>
                                    <label for="chkDebugLog" class="btn btn-warning active">
                                        Debug Messages
                                    </label>
                                </div>
                            </div>
                            <div class="form-group" title="Enables cookie syncing.">
                                <input type="checkbox" id="chkCookie" autocomplete="off" checked />
                                <div class="btn-group">
                                    <label for="chkCookie" class="btn btn-warning">
                                        <i class="fa fa-check"></i>
                                        <i class="fa fa-close"></i>
                                    </label>
                                    <label for="chkCookie" class="btn btn-warning active">
                                        Enable cookies
                                    </label>
                                </div>
                                <p><small>Settings will not persist throughout sessions if disabled.</small></p>
                            </div>
                            <div class="form-group" title="Enables low bandwidth mode.">
                                <input type="checkbox" id="chkLowBandwidth" autocomplete="off" disabled />
                                <div class="btn-group">
                                    <label for="chkLowBandwidth" class="btn btn-warning">
                                        <i class="fa fa-check"></i>
                                        <i class="fa fa-close"></i>
                                    </label>
                                    <label for="chkLowBandwidth" class="btn btn-warning active">
                                        Low Bandwidth
                                    </label>
                                </div>
                                <p><small>Attempts to call sync handlers at longer intervals, and disables some features such as heartbeat support. May be useful for very unstable or slow connections. (experimental)</small></p>
                                <p><small>(currently unavailable)</small></p>
                            </div>
                            <div class="form-group" title="Load custom URL.">
                                <a href="#" class="btn btn-info" id="btnLoadCustomURL">Load Custom URL</a>
                                <p><small>(experimental)</small></p>
                            </div>
                            <div class="form-group" title="Reset username.">
                                <a href="#" class="btn btn-info" id="btnResetUsername">Reset Username</a>
                                <p><small>(experimental)</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    <?php
    $name = "guest" . mt_rand(10000, 99999);
    $host = "false";
    $src = "";
    $srt = "";
    $title = "";
    $thumb = "";
    if (isset($_POST["name"])) {
        $name = preg_replace("/[^a-zA-Z0-9]+/", "", $_POST["name"]);
        $host = "true";
        $src = $_POST["source"];
        $srt = $_POST["subtitle"];
        $title = strtr($_POST["title"], array('"' => "'"));
        $thumb = $_POST["thumb"];
        $room = $name;
    }
    else {
        $room = $_GET["room"];
    }
    echo "
    var name = '{$name}';
    var host = {$host};
    var src = '{$src}';
    var srt = '{$srt}';
    var title = \"{$title}\";
    var thumb = '{$thumb}';
    var room = '{$room}';
    window.history.replaceState('', 'Play', '/play/{$room}');
    ";
    ?>
    </script>

    <!-- jQuery first, then Bootstrap JS. -->
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    <script src="https://vjs.zencdn.net/6.1.0/video.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/3.7.5/firebase.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-resolution-switcher/0.4.2/videojs-resolution-switcher.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-youtube/2.4.0/Youtube.min.js"></script>
    <script src="/assets/js/play.chat.js"></script>
    <script src="/assets/js/play.play.js"></script>
    <script src="/assets/js/play.sync.js"></script>
    <script src="/assets/js/play.ui.js"></script>
    <script src="/assets/js/play.buffer.js"></script>
    <script src="/assets/js/play.cookie.js"></script>
</body>
</html>