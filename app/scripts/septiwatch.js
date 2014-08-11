(function() {
    'use strict';

    console.log('septiwatch.js :: start');

    var countdown,
        cycleEnd,
        cyclePeriod,
        cycleStart,
        elapsedMilliseconds,
        hourInMilliseconds,
        interval,
        lastKnownSeptiStart,
        template,
        watch;


    template = [
        '<div class="septiwatch-container">',
        '   <div class="content">',
        '       <div class="close">',
        '           <button title="Click to close. Refresh the page to restore.">X</button>',
        '       </div>',
        '       <div>Next checkpoint in:</div>',
        '       <div class="countdown">00h : 00m : 00s</div>',
        '       <div>Cycle ends: ',
        '           <span class="ends">Thursday May 19, 2014 2:00:00 UTC</span>',
        '       </div>',
        '   </div>',
        '</div>'
    ].join('');

    hourInMilliseconds = 60 * 60 * 1000;
    lastKnownSeptiStart = new Date('Thu Aug 07 2014 16:00:00 GMT+0200 (CEST)');
    cyclePeriod = 175 * hourInMilliseconds;
    elapsedMilliseconds = Date.now() - lastKnownSeptiStart.valueOf();
    cycleStart = new Date(lastKnownSeptiStart.valueOf() + ((Math.floor(elapsedMilliseconds / cyclePeriod)) * cyclePeriod));
    cycleEnd = new Date(cycleStart.valueOf() + cyclePeriod);

    function Stopwatch(elem) {
        var nextCheckpoint;

        function getNextCheckpoint() {
            return new Date(Date.now() + ((((cycleEnd.valueOf() - Date.now()) / hourInMilliseconds) % 5) * hourInMilliseconds));
        }

        function start() {
            nextCheckpoint = getNextCheckpoint();
            if (!interval) {
                interval = setInterval(update, 1000);
            }
        }

        function update() {
            var clock = nextCheckpoint - new Date();
            var hours = Math.floor((clock / (hourInMilliseconds)) % 24);
            var minutes = Math.floor((clock / (1000 * 60)) % 60);
            var seconds = Math.floor((clock / 1000) % 60);
            var timeFormat = '0{h}h : {m}m : {s}s';
            var display = timeFormat
                .replace('{h}', hours)
                .replace('{m}', minutes > 9 ? minutes : '0' + minutes)
                .replace('{s}', seconds > 9 ? seconds : '0' + seconds);

            elem.innerHTML = display;
        }

        function stop() {
            clearInterval(interval);
        }

        this.start = start;
        this.stop = stop;
    }


    document.body.insertAdjacentHTML('afterbegin', template);
    document.querySelector('.ends').innerHTML = cycleEnd;

    watch = document.querySelector('.countdown');
    countdown = new Stopwatch(watch);
    document.querySelector('.close button').addEventListener('click', function() {
        countdown.stop();
        document.querySelector('.septiwatch-container').className += ' collapsed';
    });

    countdown.start();
})();
