(function() {
    'use strict';

    var fs = require('fs');
    var html = fs.readFileSync('./build/templates/septiwatch.tpl.html', 'utf8');
    var countdown,
        cycleEnd,
        cyclePeriod,
        cycleStart,
        elapsedMilliseconds,
        hourInMilliseconds,
        interval,
        lastKnownSeptiStart,
        watch;

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
            var clock,
                display,
                hours,
                minutes,
                seconds,
                timeFormat;

            clock = nextCheckpoint - new Date();
            if (clock <= 0) { // attempting to check when the cycle is over
                nextCheckpoint = getNextCheckpoint();
                clock = nextCheckpoint - new Date();
            }

            hours = Math.floor((clock / (hourInMilliseconds)) % 24);
            minutes = Math.floor((clock / (1000 * 60)) % 60);
            seconds = Math.floor((clock / 1000) % 60);
            timeFormat = '0{h}h : {m}m : {s}s';

            display = timeFormat
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


    document.body.insertAdjacentHTML('afterbegin', html);
    document.querySelector('.ends').innerHTML = cycleEnd;

    watch = document.querySelector('.countdown');
    countdown = new Stopwatch(watch);
    document.querySelector('.close button').addEventListener('click', function() {
        countdown.stop();
        document.querySelector('.septiwatch-container').className += ' collapsed';
    });

    countdown.start();
})();
