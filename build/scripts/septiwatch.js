(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
    'use strict';

    
    var html = "<div class=\"septiwatch-container\"><div class=\"content\"><div class=\"close\"> <button title=\"Click to close. Refresh the page to restore.\">X</button></div><div>Next checkpoint in:</div><div class=\"countdown\">00h : 00m : 00s</div><div>Cycle ends: <span class=\"ends\">Thursday May 19, 2014 2:00:00 UTC</span></div></div></div>";
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

},{}]},{},[1]);
