
/**
 * Solved via JetBrains PhpStorm.
 * User: Miroslav
 * Date: 19.12.12
 * Time: 12:07
 * Description:
 * Task for School of Interface Developmend by Yandex.
 * Do all the canvas infography elements.
 *
 **/
var pl = $('.i-projects .b-list'); // селектор для списка проектов
var pli = ""; // переменная для записи списка проектов
var steps_handlers = $(".i-steps"); // это переключалки этапов, из них я буду подтягивать периоды времени и идентификатор контетна
var steps_data = []; // в этот массив будет записаны даты начала и конца каждого этапа
var items = []; // это массив, в который будет записаны данные из json-файла, данные о проектах
var pr_data = []; // в этот массив будут записаны данные о количестве проектов на каждом этапе
var pr_date = []; // в этот массив будут записаны данные о дате каждого проекта
var canv_pr = $("#projects_canv"),
    prog_data = [1,21,7,17,54],
    os_data = [1,0,0,5,94],
    team_data = [1,0,0,15,84],
    git_data = [1,0,0,20,79];

//<editor-fold desc="эта функция проходит по массиву переключалок и записывает данные в переменную">
function info_data(obj){
    obj.each(function(){
        var date = [];
        var sd = new Date();
        var ed = new Date();
        sd = Date.parse($(this).attr("data-start-date"));
        ed = Date.parse($(this).attr("data-end-date"));
        date.push(sd);
        date.push(ed);
        steps_data.push(date);
    });
}
//</editor-fold>

info_data(steps_handlers);

//console.log(steps_data);


//<editor-fold desc="Функция считывает данные из json-файла, формирует элементы списка (DOM) и записывает их в родительский <ul>">
$.getJSON('projects.json', function(data) {
    $.each(data, function(key, val) {
        items.push(val);
    });

    for (i = 0; i < items.length; i++) {
            var d = new Date();
            var dd = items[i].date;

            d.setTime(Date.parse(dd));
            pr_date.push(d);
            pli = pli+ '<li class="b-list__item"><a href="'+items[i].url+'" target="_blank" data-anons="'+items[i].description+'" data-complete-date="'+d+'">'+items[i].name+'</a></li>';


        }
    pl.append(pli);
    steps_handlers.steps(canv_pr,canv_prog);
    });
//</editor-fold>

var canv = document.getElementById("projects_canv");
var canv_prog = document.getElementById("prog_canv");
var canv_os = document.getElementById("os_canv");
var canv_team = document.getElementById("team_canv");
var canv_git = document.getElementById("git_canv");




//$.fn.steps = function(canv1,canv2,canv3,canv4) {
$.fn.steps = function(canv1) {
    var pj = $(".i-projects .b-list__item"); // кеширую список проектов

    for (i=0; i < steps_data.length; i++){

        var pr_count = 0;

        for (j = 0; j < items.length; j++){
            var d = new Date();
            var dd = items[j].date;
            d.setTime(Date.parse(dd));

            if (d > steps_data[i][0] && d < steps_data[i][1]) {
                pr_count++
                pr_data[i] = pr_count;
            } else {
            }
        }
    }



    this.each(function(index){
        $(this).attr("data-index", index);
    });


    canv1.circle(pr_data, canv, 0);
    canv1.circle(prog_data, canv_prog, 0);
    canv1.circle(os_data, canv_os, 0);
    canv1.circle(team_data, canv_team, 0);
    canv1.circle(git_data, canv_git, 0);

    var sDate = new Date();
    var eDate = new Date();
    this.on("click", function(e){

        var _this = $(this);
        var index = _this.attr("data-index");
        canv1.circle(pr_data, canv, index);
        canv1.circle(prog_data, canv_prog, index);
        canv1.circle(os_data, canv_os, index);
        canv1.circle(team_data, canv_team, index);
        canv1.circle(git_data, canv_git, index);


        e.preventDefault();
        _this.parent().addClass("active").siblings().removeClass("active");
        var href = _this.attr("href");
        var id = href.substr(1);

        var sD = _this.attr("data-start-date");
        var eD = _this.attr("data-end-date");
        sDate = (Date.parse(sD));
        eDate = (Date.parse(eD));

        for (i = 0; i < pj.length; i++) {
            if (Date.parse(items[i].date) > sDate && Date.parse(items[i].date) < eDate) {
                pj.eq(i).addClass("active");
            } else {
                pj.eq(i).removeClass("active");
            }

        }



        $("#"+id).addClass("active").siblings().removeClass("active");

    });
};

var step_content = $(".b-description__item");




$.fn.circle = function(subtotal, canvas, index) {

//    canvas.width = canvas.width; // перерисовываю канвас

    var total = 0;
    var st = 0;
    for (i=0; i < subtotal.length; i++){
        total += subtotal[i];
    }

    for (j = 0; j <= index; j++){
        st += subtotal[j];
    }

    var x = (st*100)/total;
    var sub_total = Math.round(x);
    var mp = (2 * sub_total)/100;
    if (typeof canvas.getContext != "undefined") { // в случае если браузер понимает функцию getContext
        var s = canvas.getContext("2d"),
            tt = canvas.getContext("2d"),
            inn = canvas.getContext("2d"),
            clear = canvas.getContext("2d"),
            t = canvas.width / 2,
            n = canvas.height / 2,
            f = 60,
            u = 0,
            r = Math.PI*mp,
            e = false,
            g = true;

        clear.clearRect(0, 0, 300, 150);
        tt.beginPath();
        tt.strokeStyle = "rgba(255,255,255,0.75)";
        tt.arc(t, n, f, r, u, g);
        tt.lineWidth = 7;
        tt.stroke();
        tt.closePath();


        if (st < 100) {
            s.beginPath();
            s.strokeStyle = "rgba(255,0,120,0.25)";
            s.arc(t, n, f, r, u, e);
            s.lineWidth = 7;
            s.stroke();
            s.closePath();
        }

        inn.beginPath();
        inn.strokeStyle = "rgba(255,255,255,0.85)";
        inn.arc(t, n, 50, 0, 2*Math.PI, g);
        inn.lineWidth = 1;
        inn.stroke();
        inn.closePath();

        if (document.all && document.querySelector && !document.addEventListener) { //детект IE8, подсовываем ему данные в див с позиционированием, проблемы с реализацией текста в канвасе
//            alert('IE8');

            if (total === 100) {
                $(canvas).parent().find(".i-iefix").html(st+"%");
            } else {
                $(canvas).parent().find(".i-iefix").html(st);
            }

        } else {
            inn.font = "56px Yeseva One";
            inn.textAlign = 'center';
            inn.fillStyle = "#fff";
            if (total === 100) {
                inn.font = "30px Yeseva One";
                inn.fillText(st + "%",t,n+10);
            } else {

                inn.fillText(st,t,n+20);
            }
        }


    } else {
//        alert("error");
    }
};

