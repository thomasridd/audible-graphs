/**
 * Created by Tom.Ridd on 15/04/2017.
 */
//
// (function() {
var ac = new AudioContext();
var notes = [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4];
var tempo = 240;
var activePoint = 0;

function playTune(tune) {
    var sequence = new AcMusic.Sequence( ac, tempo );
    for(note in tune) {
        frequency = 300.00 + tune[note];
        sequence.push(new AcMusic.Note(frequency + ' q'))
    }
    sequence.loop = false;
    sequence.play();
}

function playNote(note) {
    frequency = 300.00 + note;
    var sequence = new AcMusic.Sequence( ac, tempo );
    sequence.push(new AcMusic.Note(frequency + ' q'));
    sequence.loop = false;
    sequence.play();
}

function drawAudibleChart() {
    Highcharts.chart('container', {
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: function () {
                            playNote(this.y);
                        }
                    }
                }
            }
        },

        series: [{
            name: 'g.d.p.',
            data: notes
        }]
    }, function(chart){

        $(document).keydown(function(e){

            switch(e.which) {
                case 37:
                    if(activePoint>0)
                        activePoint--;
                    break;
                case 39:
                    if(activePoint+1 < chart.series[0].data.length)
                        activePoint++;
                    break;
            }
            chart.tooltip.refresh(chart.series[0].data[activePoint]);
            playNote(chart.series[0].data[activePoint].y);
        })


    });
}

function setup() {
    playTune(notes);
    drawAudibleChart();
}

$(document).ready(setup);