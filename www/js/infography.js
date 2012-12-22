/**
 * Solved via JetBrains PhpStorm.
 * User: Miroslav
 * Date: 19.12.12
 * Time: 12:07
 * Description:
 * Specially coded for School of Interface Developmend by Yandex.
 * Do all the canvas infography elements, calculate and animate them.
 *
 * Peace yo!
 **/

// Set up!
//var a_canvas = document.getElementById("ark");
//var context = a_canvas.getContext("2d");
//
//// Draw the face
//context.fillStyle = "yellow";
//context.beginPath();
//context.arc(95, 85, 40, 0, 2*Math.PI);
//context.closePath();
//context.fill();
//context.lineWidth = 2;
//context.stroke();
//context.filhe lStyle = "black";
//
//// Draw the left eye
//context.beginPath();
//context.arc(75, 75, 5, 0, 2*Math.PI);
//context.closePath();
//context.fill();
//
//// Draw the right eye
//context.beginPath();
//context.arc(114, 75, 5, 0, 2*Math.PI);
//context.closePath();
//context.fill();
//
//// Draw the mouth
//context.beginPath();
//context.arc(95, 90, 26, Math.PI, 2*Math.PI, true);
//context.closePath();
//context.fill();
//
//// Write "Hello, World!"
//context.font = "30px Garamond";
//context.fillText("Hello, World!",15,175);
var pl = $('.i-projects .b-list'); // селектор для списка проектов
var pli = ""; // переменная для записи списка проектов

$.getJSON('projects.json', function(data) {
    var items = [];

    $.each(data, function(key, val) {
        items.push(val);
    });

        for (i = 0; i < items.length; i++) {
            var d = new Date();
            var dd = items[i].date;
            d.setTime(Date.parse(dd));
//            console.log(d);
//            console.log(items[i].url);
            pli = pli+ '<li class="b-list__item"><a href="'+items[i].url+'" target="_blank" data-anons="'+items[i].description+'" data-complete-date="'+d+'">'+items[i].name+'</a></li>';
//            console.log(pli);
        }

    pl.append(pli);

    });

//console.log(pli);

function circle() {
    var subtotal = 89;
    var mp = (2 * subtotal)/100;
    var c = document.getElementById("ark"); // пошли определять элементы канваса — это  1-й элемент
    if (typeof c.getContext != "undefined") { // в случае если браузер понимает функцию getContext
        var s = c.getContext("2d"),
            tt = c.getContext("2d"),
            t = 75,
            n = 75,
            f = 60,
            u = 0,
//            r = Math.PI + Math.PI / 200,
            r = Math.PI*mp,
//            ri = Math.PI + mp,
            e = false,
            g = true;
        tt.beginPath();
        tt.strokeStyle = "rgba(255,255,255,0.85)";
        tt.arc(t, n, f, r, u, g);
        tt.lineWidth = 7;
        tt.stroke();
        tt.closePath();

        s.beginPath();
        s.strokeStyle = "rgba(255,0,120,0.25)";
        s.arc(t, n, f, r, u, e);
        s.lineWidth = 7;
        s.stroke();
        s.closePath();

//        s.hover( function(){
//            $(this).strokeStyle = "#fff";
//        });
//        s.hover(function(){
//            $(this).strokeStyle = "rgba(255,0,120,0.25)";
//        });
    }
}

circle();
