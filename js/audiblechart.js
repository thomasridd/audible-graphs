/**
 * Created by Tom.Ridd on 15/04/2017.
 */
//
// (function() {
var ac = new AudioContext();
var notes = [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];
var notes2 = [129.9, 121.5, 106.4, 89.2, 74.0, 46.0, 85.6, 98.5, 108.4, 78.1, 70.6, 60.4];
var tempo = 240;
var activePoint = 0;
var activeSeries = 0;

function playTune(tune) {
    var sequence = new AcMusic.Sequence( ac, tempo );

    for(note in tune) {
        frequency = 300.00 + tune[note];
        sequence.push(new AcMusic.Note(frequency + ' q'))
    }
    sequence.loop = false;
    sequence.gain.gain.value = 0.1;
    sequence.play();
}

function playNote(note) {
    frequency = 300.00 + note;
    var sequence = new AcMusic.Sequence( ac, tempo );
    sequence.push(new AcMusic.Note(frequency + ' q'));
    sequence.loop = false;
    sequence.gain.gain.value = 0.1;
    sequence.play();
}

function playSeries(chart, series) {
    var msg = new SpeechSynthesisUtterance(
        'Series ... ' +
        chart.series[series].name + ' ... '
    );
    msg.volume = 1;
    msg.onend = function (event) {
        var sequence = new AcMusic.Sequence( ac, tempo );

        for(point in chart.series[series].points) {
            frequency = 300.00 + chart.series[series].points[point].y;
            sequence.push(new AcMusic.Note(frequency + ' q'))
        }
        sequence.loop = false;
        sequence.gain.gain.value = 0.1;
        sequence.play();
    };

    window.speechSynthesis.speak(msg);


}

function speakPoint(chart, series, point) {
    var msg = new SpeechSynthesisUtterance(
        chart.series[series].data[point].category + ' ... ' +
        chart.series[series].name + ' ... ' +
        chart.series[series].data[point].y
    );
    msg.volume = 1;
    window.speechSynthesis.speak(msg);
}

function checkPoint(chart, series, point) {
    chart.tooltip.refresh(chart.series[series].data[point]);
    playNote(chart.series[series].data[point].y);
}

function drawAudibleChart() {
    return Highcharts.chart('container', {
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            activePoint = this.index;
                            activeSeries = this.series.index;

                            playNote(this.y);
                        }
                    }
                }
            }
        },

        series: [{
            name: 'g.d.p.',
            data: notes
        },{
            name: 'c.p.r.',
            data: notes2
        }]
    }, function(chart){

        $(document).keydown(function(e){

            switch(e.which) {
                case 32:
                    // SPACE
                    speakPoint(chart, activeSeries, activePoint);
                    break;

                case 37:
                    // LEFT
                    if(activePoint>0)
                        activePoint--;
                    checkPoint(chart, activeSeries, activePoint)
                    break;
                case 38:
                    // UP
                    activeSeries = activeSeries - 1;
                    if(activeSeries < 0 ) { activeSeries = chart.series.length - 1; }

                    checkPoint(chart, activeSeries, activePoint);
                    break;

                case 39:
                    // RIGHT
                    if(activePoint+1 < chart.series[activeSeries].data.length)
                        activePoint++;

                    checkPoint(chart, activeSeries, activePoint);
                    break;
                case 40:
                    activeSeries = activeSeries + 1;
                    if(activeSeries >= chart.series.length) { activeSeries = 0; }

                    checkPoint(chart, activeSeries, activePoint);
                    break;

            }

        })


    });
}

function setup() {
    // playTune(notes);
    var chart = drawAudibleChart();
    playSeries(chart, 0);
}

$(document).ready(setup);