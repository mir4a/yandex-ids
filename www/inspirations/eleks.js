/**
 * Solved via JetBrains PhpStorm.
 * User: Miroslav
 * Date: 19.12.12
 * Time: 16:15
 * Description:
 * reference from Eleks company
 * http://eleks.com/company/who-we-are
 *
 * Peace yo!
 **/
function isTouchDevice() {
    return!!("ontouchstart"in window) || !!("onmsgesturechange"in window)
}
function placeholderIsSupported() {
    var n = document.createElement("input");
    return"placeholder"in n
}
function isSelectorExists(n) {
    return typeof $(n)[0] != "undefined"
}
function validateContantUsForm(n) {
    var h = $(n).find(".form_contact input[name='Name']"), o = $(n).find(".form_contact input[name='Email']"), e = $(n).find(".form_contact textarea[name='Message']"), r = $(n).find(".form_contact input[name='Company']"), s = $(n).find(".form_contact input[name='Country']"), i = $(n).find(".attach_name_file"), v = $(n).find(".checkbox_wrap input[name='Type']:checked"), w = /(.pdf|.doc|.docx|.txt|.rtf)$/, b = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, t = !0, f, p, y, l, a, u, c;
    return typeof h[0] != "undefined" && (f = getInputValue(h), f.length > 0 && !isHtml(f) ? h.parent().removeClass("error") : (h.parent().addClass("error"), t = !1)), typeof o[0] != "undefined" && (b.test(getInputValue(o)) ? o.parent().removeClass("error") : (o.parent().addClass("error"), t = !1)), typeof e[0] != "undefined" && (p = getInputValue(e), p.length > 0 && !isHtml(f) ? e.parent().removeClass("error") : (e.parent().addClass("error"), t = !1)), typeof r[0] != "undefined" && (y = getInputValue(r), isHtml(y) ? (r.parent().addClass("error"), t = !1) : r.parent().removeClass("error")), typeof s[0] != "undefined" && (l = getInputValue(s), isHtml(l) ? (s.parent().addClass("error"), t = !1) : s.parent().removeClass("error")), typeof i[0] != "undefined" && typeof v[0] != "undefined" && (a = v.val(), a == vacancyType && (u = i.html(), u.indexOf("span") < 0 && (u.length > 0 && !w.test(u) ? (i.html('<span style="color:red;">Wrong File Format</span>'), t = !1) : (c = parseInt(i.attr("file-size")), !isNaN(c) && c >= 5242880 && i.html('<span style="color:red;">Upload File size must be less than 5 MB</span>'))))), t
}
function getInputValue(n) {
    var t = n.val().trim(), i = n.attr("placeholder");
    return t == i && (t = ""), t
}
function isHtml(n) {
    return n.indexOf("<") >= 0 || n.indexOf(">") >= 0
}
function closePopup() {
    $(".box_popup_wrap .box_popup_content .zone-popup").children().hide(), $(".box_popup_wrap").hide(), $(".popup_bg").hide()
}
function openPopup(n, t) {
    if (closePopup(), screen.width > 640) {
        $(t).removeAttr("href"), $(".popup_bg").show(), $(".box_popup_wrap").css("top", $(window).scrollTop()), $(".box_popup_wrap").show();
        var i = $(".box_popup_wrap .box_popup_content #" + n);
        i.show(), _gaq.push(["_trackEvent", "Case Study", "View", window.location.href]), i.hasClass("case_study_default") && caseStudyEvents(i), $(window).resize(function () {
            i.is(":visible") && caseStudyEvents(i)
        })
    } else $(t).removeAttr("onclick")
}
function caseStudyEvents(n) {
    var i = $(window).width(), t;
    i >= 950 ? (t = n.find(".costumer_description").height(), n.find(".case_img_lined").css("margin-top", -t + "px")) : n.find(".case_img_lined").css("margin-top", "0px")
}
function circle() {
    var c = document.getElementById("canvas_circle_1"), // пошли определять элементы канваса — это  1-й элемент
        v = document.getElementById("canvas_circle_2"),
        l = document.getElementById("canvas_circle_3"),
        a = document.getElementById("canvas_circle_4"); // определили 4 области пичарта
    if (typeof c.getContext != "undefined") { // в случае если браузер понимает функцию getContext
        var s = c.getContext("2d"),
            h = v.getContext("2d"),
            o = l.getContext("2d"),
            i = a.getContext("2d"),
            t = 75,
            n = 75,
            f = 60,
            u = 0,
            r = Math.PI + Math.PI / 150,
            e = !0;

        s.arc(t, n, f, u, r, e), h.arc(t, n, f, u, r, e), o.arc(t, n, f, u, r, e), i.arc(t, n, f, u, r, e), s.strokeStyle = "#7e2b5e", s.lineWidth = 30, s.stroke(), h.strokeStyle = "#113a68", h.lineWidth = 30, h.stroke(), o.strokeStyle = "#4292be", o.lineWidth = 30, o.stroke(), i.strokeStyle = "#0e559e", i.lineWidth = 30, i.stroke()
    }
}
function Query(n) {
    this.query = n, this.getParam = function (t) {
        if (n.length > 0) {
            var f = t.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"), r = "[\\?&]" + f + "=([^&#]*)", u = new RegExp(r), i = u.exec(this.query);
            return i == null ? "" : decodeURIComponent(i[1].replace(/\+/g, " "))
        }
        return""
    }, this.updateParam = function (n, t) {
        var i = new RegExp("([?|&])" + n + "=.*?(&|$)", "i");
        separator = this.query.indexOf("?") !== -1 ? "&" : "?", this.query = this.query.match(i) ? this.query.replace(i, "$1" + n + "=" + t + "$2") : this.query + separator + n + "=" + t
    }, this.removeParam = function (t) {
        if (n.length > 0) {
            var i = new RegExp("([?|&])" + t + "=[a-zA-Z0-9_-]*[&]?", "g");
            this.query = this.query.replace(i, "$1"), this.query = this.query.replace(/[&|?]$/g, "")
        }
    }, this.getQuery = function () {
        return this.query
    }
}
var vacancyType = 1;
$(function () {
    var h, o, u, n, f, e, r;
    if (isSelectorExists("#google_map_wrap")) {
        var t = [
            {coord:new google.maps.LatLng(49.802541245062912, 24.00038480758667), icon:"/Themes/EleksCookiesTheme/Content/img/contact_us/icon_office.png"},
            {coord:new google.maps.LatLng(36.026642, -115.086801), icon:"/Themes/EleksCookiesTheme/Content/img/contact_us/icon_star.png"},
            {coord:new google.maps.LatLng(42.485102, -71.208921), icon:"/Themes/EleksCookiesTheme/Content/img/contact_us/icon_star.png"},
            {coord:new google.maps.LatLng(51.499516, -.015272), icon:"/Themes/EleksCookiesTheme/Content/img/contact_us/icon_star.png"}
        ], l = {zoom:3, center:new google.maps.LatLng(0, 0), mapTypeId:google.maps.MapTypeId.ROADMAP}, s = new google.maps.Map(document.getElementById("google_map_wrap"), l), c = new google.maps.LatLngBounds;
        for (i = 0; i < t.length; i++)h = new google.maps.Marker({position:t[i].coord, icon:t[i].icon, map:s}), google.maps.event.addListener(h, "click", function () {
            this.map.setZoom(10), this.map.setCenter(this.getPosition())
        }), c.extend(t[i].coord);
        s.fitBounds(c)
    }
    isSelectorExists(".contact_us_form_wrap") && ($(".contact_us_form_wrap").each(function () {
        var n = this, t = $(n).find("iframe[name='form-submit']"), r = $(n).find(".checkbox_wrap input[type=radio]"), i = $(n).find(".attach_file_wrap");
        $(this).find(".btn_contact_us input").click(function () {
            var i, e, o, f, r, u;
            return validateContantUsForm(n) && (i = $(n).find(".checkbox_wrap input[name='Type']:checked"), typeof i[0] != "undefined" && (i.val() != vacancyType && t.contents().find("form input[type=file]").remove(), t.contents().find("form input[name='Type']").val(i.val())), e = $(n).find(".form_contact input[name='Name']"), typeof e[0] != "undefined" && t.contents().find("form input[name='Name']").val(getInputValue(e)), o = $(n).find(".form_contact input[name='Email']"), typeof o[0] != "undefined" && t.contents().find("form input[name='Email']").val(getInputValue(o)), f = $(n).find(".form_contact input[name='Company']"), typeof f[0] != "undefined" && t.contents().find("form input[name='Company']").val(getInputValue(f)), r = $(n).find(".form_contact input[name='Country']"), typeof r[0] != "undefined" && t.contents().find("form input[name='Country']").val(getInputValue(r)), u = $(n).find(".form_contact textarea[name='Message']"), typeof u[0] != "undefined" && t.contents().find("form input[name='Message']").val(getInputValue(u)), t.contents().find("form").submit(), $(n).addClass("active")), !1
        }), typeof r[0] != "undefined" && typeof i[0] != "undefined" && (t.load(function () {
            var n = t.contents().find("form input[type=file]");
            n.change(function () {
                var r = i.find(".attach_name_file"), t;
                r.html(this.value.split("\\").pop()), r.removeAttr("file-size"), typeof this.files != "undefined" && (t = this.files[0], typeof t != "undefined" && r.attr("file-size", t.size))
            })
        }), i.find(".buttin_attach").click(function () {
            var n = t.contents().find("form input[type=file]");
            n.click()
        }), r.change(function () {
            $(n).find(".checkbox_wrap input[type=radio]:checked").val() == 1 ? i.show() : i.hide()
        })), typeof r[0] != "undefined" && window.location.pathname.toLowerCase().indexOf("career") != -1 && (r.removeAttr("checked"), $(n).find(".checkbox_wrap input[type=radio][value=1]").attr("checked", "checked"), r.change())
    }), Custom.init()), isSelectorExists("#typeahead") && $("#typeahead").typeahead({source:["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas, The", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", 'Cote d"Ivoire', "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor (see Timor-Leste)", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia, The", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestinian Territories", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"]}), isSelectorExists(".popup_bg") && $(".popup_bg").click(function () {
        closePopup()
    }), isSelectorExists(".box_popup_wrap") && $(".box_popup_wrap").click(function () {
        closePopup()
    }), isSelectorExists(".box_popup_content") && $(".box_popup_content").click(function (n) {
        n.stopPropagation()
    }), isSelectorExists(".box_popup_content .close") && $(".box_popup_content .close").click(function () {
        closePopup()
    }), isSelectorExists(".box_popup_content .top_close") && $(".box_popup_content .top_close").click(function () {
        closePopup()
    }), isSelectorExists(".box_popup_content .bottom_close") && $(".box_popup_content .bottom_close").click(function () {
        closePopup()
    }), isSelectorExists("#canvas_circle_1") && isSelectorExists("#canvas_circle_2") && isSelectorExists("#canvas_circle_3") && isSelectorExists("#canvas_circle_4") && circle(), isSelectorExists(".filter_events") && (o = new Date, u = o.getFullYear(), isSelectorExists(".filter_events select :contains('" + u + "')") || $(".filter_events select option:nth-child(1)").after($("<option>" + u + "</option>")), n = new Query(window.location.search), f = n.getParam("year"), f.length > 0 && $(".filter_events select :contains('" + f + "')").attr("selected", "selected"), $(".filter_events select").change(function (t) {
        var r = $(":selected", t.target).text(), i = parseInt(r);
        isNaN(i) ? n.removeParam("year") : n.updateParam("year", i), n.removeParam("page"), n.getQuery().length > 0 ? window.location.search = n.getQuery() : window.location.href = window.location.href.split("?")[0]
    })), isSelectorExists(".menu_select") && $(".menu_select").click(function () {
        $(".menu_top").hasClass("active") ? ($(".menu_top").removeClass("active"), $(".menu_select").removeClass("active")) : ($(".menu_top").addClass("active"), $(".menu_select").addClass("active")), $(".menu_top_responsiv .last_.search_").removeClass("active")
    }), isSelectorExists(".menu_top_responsiv .last_.search_ a") && $(".menu_top_responsiv .last_.search_ a").click(function () {
        $(".menu_top_responsiv .last_.search_").hasClass("active") ? $(".menu_top_responsiv .last_.search_").removeClass("active") : $(".menu_top_responsiv .last_.search_").addClass("active"), $(".menu_top").removeClass("active"), $(".menu_select").removeClass("active")
    }), isSelectorExists(".b-customer_wrap .btn_customers.dark") && $(".b-customer_wrap .btn_customers.dark").each(function () {
        var t = $(this).find("a"), n;
        t.removeAttr("href"), t.click(function () {
            $(".b-customer_wrap .btn_customers.dark .testimonial_tooltip_wrap").hide(), n.show()
        }), n = $(this).find(".testimonial_tooltip_wrap"), typeof n[0] != "undefined" && n.find(".testimonial_tooltip_close").click(function () {
            n.hide()
        })
    }), isSelectorExists(".zone-content .case_study_default") && (e = $(".zone-content .case_study_default"), caseStudyEvents(e)), placeholderIsSupported() || ($("[placeholder]").focus(function () {
        var n = $(this);
        n.val() == n.attr("placeholder") && (n.val(""), n.removeClass("placeholder"))
    }).blur(function () {
        var n = $(this);
        (n.val() == "" || n.val() == n.attr("placeholder")) && (n.addClass("placeholder"), n.val(n.attr("placeholder")))
    }).blur(), $("[placeholder]").parents("form").submit(function () {
        $(this).find("[placeholder]").each(function () {
            var n = $(this);
            n.val() == n.attr("placeholder") && n.val("")
        })
    })), isTouchDevice() && (r = $(".touch-portlet a"), r.each(function () {
        $(this).click(function () {
            var n = parseInt("0" + $(this).attr("click-count"));
            return r.attr("click-count", "0"), $(this).attr("click-count", n + 1), n >= 1
        })
    }))
});
var checkboxHeight = "25", radioHeight = "25", Custom = {init:function () {
    var n = document.getElementsByTagName("input"), t = Array(), u, r, i;
    for (a = 0; a < n.length; a++)(n[a].type == "checkbox" || n[a].type == "radio") && n[a].className == "styled" && (t[a] = document.createElement("span"), t[a].className = n[a].type, n[a].checked == !0 && (n[a].type == "checkbox" ? (position = "0 -" + checkboxHeight * 2 + "px", t[a].style.backgroundPosition = position) : (position = "0 -" + radioHeight * 2 + "px", t[a].style.backgroundPosition = position)), n[a].parentNode.insertBefore(t[a], n[a]), n[a].onchange = Custom.clear, n[a].getAttribute("disabled") ? t[a].className = t[a].className += " disabled" : (t[a].onmousedown = Custom.pushed, t[a].onmouseup = Custom.check));
    document.onmouseup = Custom.clear
}, pushed:function () {
    element = this.nextSibling, this.style.backgroundPosition = element.checked == !0 && element.type == "checkbox" ? "0 -" + checkboxHeight * 3 + "px" : element.checked == !0 && element.type == "radio" ? "0 -" + radioHeight * 3 + "px" : element.checked != !0 && element.type == "checkbox" ? "0 -" + checkboxHeight + "px" : "0 -" + radioHeight + "px"
}, check:function () {
    if (element = this.nextSibling, element.checked == !0 && element.type == "checkbox")this.style.backgroundPosition = "0 0", element.checked = !1; else {
        if (element.type == "checkbox")this.style.backgroundPosition = "0 -" + checkboxHeight * 2 + "px"; else for (this.style.backgroundPosition = "0 -" + radioHeight * 2 + "px", group = this.nextSibling.name, inputs = document.getElementsByTagName("input"), a = 0; a < inputs.length; a++)inputs[a].name == group && inputs[a] != this.nextSibling && inputs[a].className == "styled" && (inputs[a].previousSibling.style.backgroundPosition = "0 0");
        element.checked = !0
    }
    $(element).change()
}, clear:function () {
    inputs = document.getElementsByTagName("input");
    for (var n = 0; n < inputs.length; n++)inputs[n].type == "checkbox" && inputs[n].checked == !0 && inputs[n].className == "styled" ? inputs[n].previousSibling.style.backgroundPosition = "0 -" + checkboxHeight * 2 + "px" : inputs[n].type == "checkbox" && inputs[n].className == "styled" ? inputs[n].previousSibling.style.backgroundPosition = "0 0" : inputs[n].type == "radio" && inputs[n].checked == !0 && inputs[n].className == "styled" ? inputs[n].previousSibling.style.backgroundPosition = "0 -" + radioHeight * 2 + "px" : inputs[n].type == "radio" && inputs[n].className == "styled" && (inputs[n].previousSibling.style.backgroundPosition = "0 0")
}};
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "")
};
function getCoords(n) {
    var r = n.getBoundingClientRect(), i = document.body, t = document.documentElement, o = window.pageYOffset || t.scrollTop || i.scrollTop, s = window.pageXOffset || t.scrollLeft || i.scrollLeft, h = t.clientTop || i.clientTop || 0, u = t.clientLeft || i.clientLeft || 0, f = r.top + o - h, e = r.left + s - u;
    return{top:Math.round(f), left:Math.round(e)}
}
function isVisible(n) {
    var t = getCoords(n), i = window.pageYOffset || document.documentElement.scrollTop, f = i + document.documentElement.clientHeight, u, r;
    return t.bottom = t.top + n.offsetHeight, u = t.top > i && t.top < f, r = t.bottom < f && t.bottom > i, u || r
}
function showVisible() {
    for (var r = document.getElementsByTagName("div"), n, i, t = 0; t < r.length; t++)(n = r[t], i = n.getAttribute("title"), i) && isVisible(n) && (n.className = n.className + " " + i, n.setAttribute("title", ""))
}
window.onload = showVisible, window.onscroll = showVisible, showVisible();
var $menu = $("#menu_fix");
typeof $menu[0] != "undefined" && (MenuFix = $menu.offset().top, $(window).scroll(function () {
    $(window).scrollTop() >= MenuFix ? $menu.addClass("menu_fix_active") : $menu.removeClass("menu_fix_active")
}));
!function (n) {
    "use strict";
    var t = function (t, i) {
        this.$element = n(t), this.options = n.extend({}, n.fn.typeahead.defaults, i), this.matcher = this.options.matcher || this.matcher, this.sorter = this.options.sorter || this.sorter, this.highlighter = this.options.highlighter || this.highlighter, this.updater = this.options.updater || this.updater, this.$menu = n(this.options.menu).appendTo("body"), this.source = this.options.source, this.shown = !1, this.listen()
    };
    t.prototype = {constructor:t, select:function () {
        var n = this.$menu.find(".active").attr("data-value");
        return this.$element.val(this.updater(n)).change(), this.hide()
    }, updater:function (n) {
        return n
    }, show:function () {
        var t = n.extend({}, this.$element.offset(), {height:this.$element[0].offsetHeight});
        return this.$menu.css({top:t.top + t.height, left:t.left}), this.$menu.show(), this.shown = !0, this
    }, hide:function () {
        return this.$menu.hide(), this.shown = !1, this
    }, lookup:function () {
        var r = this, i, u;
        return(this.query = this.$element.val(), !this.query) ? this.shown ? this.hide() : this : (i = n.grep(this.source, function (n) {
            return r.matcher(n)
        }), i = this.sorter(i), !i.length) ? this.shown ? this.hide() : this : this.render(i.slice(0, this.options.items)).show()
    }, matcher:function (n) {
        return~n.toLowerCase().indexOf(this.query.toLowerCase())
    }, sorter:function (n) {
        for (var u = [], i = [], r = [], t; t = n.shift();)t.toLowerCase().indexOf(this.query.toLowerCase()) ? ~t.indexOf(this.query) ? i.push(t) : r.push(t) : u.push(t);
        return u.concat(i, r)
    }, highlighter:function (n) {
        var t = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
        return n.replace(new RegExp("(" + t + ")", "ig"), function (n, t) {
            return"<strong>" + t + "</strong>"
        })
    }, render:function (t) {
        var i = this;
        return t = n(t).map(function (t, r) {
            return t = n(i.options.item).attr("data-value", r), t.find("a").html(i.highlighter(r)), t[0]
        }), t.first().addClass("active"), this.$menu.html(t), this
    }, next:function () {
        var r = this.$menu.find(".active").removeClass("active"), i = r.next();
        i.length || (i = n(this.$menu.find("li")[0])), i.addClass("active")
    }, prev:function () {
        var i = this.$menu.find(".active").removeClass("active"), t = i.prev();
        t.length || (t = this.$menu.find("li").last()), t.addClass("active")
    }, listen:function () {
        this.$element.on("blur", n.proxy(this.blur, this)).on("keypress", n.proxy(this.keypress, this)).on("keyup", n.proxy(this.keyup, this));
        if (n.browser.webkit || n.browser.msie)this.$element.on("keydown", n.proxy(this.keypress, this));
        this.$menu.on("click", n.proxy(this.click, this)).on("mouseenter", "li", n.proxy(this.mouseenter, this))
    }, keyup:function (n) {
        switch (n.keyCode) {
            case 40:
            case 38:
                break;
            case 9:
            case 13:
                if (!this.shown)return;
                this.select();
                break;
            case 27:
                if (!this.shown)return;
                this.hide();
                break;
            default:
                this.lookup()
        }
        n.stopPropagation(), n.preventDefault()
    }, keypress:function (n) {
        if (this.shown) {
            switch (n.keyCode) {
                case 9:
                case 13:
                case 27:
                    n.preventDefault();
                    break;
                case 38:
                    if (n.type != "keydown")break;
                    n.preventDefault(), this.prev();
                    break;
                case 40:
                    if (n.type != "keydown")break;
                    n.preventDefault(), this.next()
            }
            n.stopPropagation()
        }
    }, blur:function () {
        var t = this;
        setTimeout(function () {
            t.hide()
        }, 150)
    }, click:function (n) {
        n.stopPropagation(), n.preventDefault(), this.select()
    }, mouseenter:function (t) {
        this.$menu.find(".active").removeClass("active"), n(t.currentTarget).addClass("active")
    }}, n.fn.typeahead = function (i) {
        return this.each(function () {
            var u = n(this), r = u.data("typeahead"), f = typeof i == "object" && i;
            r || u.data("typeahead", r = new t(this, f)), typeof i == "string" && r[i]()
        })
    }, n.fn.typeahead.defaults = {source:[], items:8, menu:'<ul class="typeahead dropdown-menu"></ul>', item:'<li><a href="#"></a></li>'}, n.fn.typeahead.Constructor = t, n(function () {
        n("body").on("focus.typeahead.data-api", '[data-provide="typeahead"]', function (t) {
            var i = n(this);
            i.data("typeahead") || (t.preventDefault(), i.typeahead(i.data()))
        })
    })
}(window.jQuery);
var q = null;
window.PR_SHOULD_USE_CONTINUATION = !0, function () {
    function b(n) {
        function s(n) {
            var i = n.charCodeAt(0), t;
            return i !== 92 ? i : (t = n.charAt(1), (i = c[t]) ? i : "0" <= t && t <= "7" ? parseInt(n.substring(1), 8) : t === "u" || t === "x" ? parseInt(n.substring(2), 16) : n.charCodeAt(1))
        }

        function o(n) {
            return n < 32 ? (n < 16 ? "\\x0" : "\\x") + n.toString(16) : (n = String.fromCharCode(n), (n === "\\" || n === "-" || n === "[" || n === "]") && (n = "\\" + n), n)
        }

        function a(n) {
            for (var t, e, f = n.substring(1, n.length - 1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g), n = [], r = [], h = f[0] === "^", i = h ? 1 : 0, u = f.length; i < u; ++i)t = f[i], /\\[bdsw]/i.test(t) ? n.push(t) : (t = s(t), i + 2 < u && "-" === f[i + 1] ? (e = s(f[i + 2]), i += 2) : e = t, r.push([t, e]), e < 65 || t > 122 || (e < 65 || t > 90 || r.push([Math.max(65, t) | 32, Math.min(e, 90) | 32]), e < 97 || t > 122 || r.push([Math.max(97, t) & -33, Math.min(e, 122) & -33])));
            for (r.sort(function (n, t) {
                return n[0] - t[0] || t[1] - n[1]
            }), f = [], t = [NaN, NaN], i = 0; i < r.length; ++i)u = r[i], u[0] <= t[1] + 1 ? t[1] = Math.max(t[1], u[1]) : f.push(t = u);
            for (r = ["["], h && r.push("^"), r.push.apply(r, n), i = 0; i < f.length; ++i)u = f[i], r.push(o(u[0])), u[1] > u[0] && (u[1] + 1 > u[0] && r.push("-"), r.push(o(u[1])));
            return r.push("]"), r.join("")
        }

        function l(n) {
            for (var i, r = n.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g), o = r.length, f = [], t = 0, u = 0; t < o; ++t)i = r[t], i === "(" ? ++u : "\\" === i.charAt(0) && (i = +i.substring(1)) && i <= u && (f[i] = -1);
            for (t = 1; t < f.length; ++t)-1 === f[t] && (f[t] = ++h);
            for (u = t = 0; t < o; ++t)i = r[t], i === "(" ? (++u, f[u] === void 0 && (r[t] = "(?:")) : "\\" === i.charAt(0) && (i = +i.substring(1)) && i <= u && (r[t] = "\\" + f[u]);
            for (u = t = 0; t < o; ++t)"^" === r[t] && "^" !== r[t + 1] && (r[t] = "");
            if (n.ignoreCase && e)for (t = 0; t < o; ++t)i = r[t], n = i.charAt(0), i.length >= 2 && n === "[" ? r[t] = a(i) : n !== "\\" && (r[t] = i.replace(/[A-Za-z]/g, function (n) {
                return n = n.charCodeAt(0), "[" + String.fromCharCode(n & -33, n | 32) + "]"
            }));
            return r.join("")
        }

        for (var t, h = 0, e = !1, r = !1, i = 0, f = n.length; i < f; ++i)if (t = n[i], t.ignoreCase)r = !0; else if (/[a-z]/i.test(t.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi, ""))) {
            e = !0, r = !1;
            break
        }
        for (var c = {b:8, t:9, n:10, v:11, f:12, r:13}, u = [], i = 0, f = n.length; i < f; ++i) {
            if (t = n[i], t.global || t.multiline)throw Error("" + t);
            u.push("(?:" + l(t) + ")")
        }
        return RegExp(u.join("|"), r ? "gi" : "g")
    }

    function k(n) {
        function e(n) {
            switch (n.nodeType) {
                case 1:
                    if (s.test(n.className))break;
                    for (var r = n.firstChild; r; r = r.nextSibling)e(r);
                    r = n.nodeName, ("BR" === r || "LI" === r) && (f[t] = "\n", i[t << 1] = u++, i[t++ << 1 | 1] = n);
                    break;
                case 3:
                case 4:
                    r = n.nodeValue, r.length && (r = o ? r.replace(/\r\n?/g, "\n") : r.replace(/[\t\n\r ]+/g, " "), f[t] = r, i[t << 1] = u, u += r.length, i[t++ << 1 | 1] = n)
            }
        }

        var s = /(?:^|\s)nocode(?:\s|$)/, f = [], u = 0, i = [], t = 0, r, o;
        return n.currentStyle ? r = n.currentStyle.whiteSpace : window.getComputedStyle && (r = document.defaultView.getComputedStyle(n, q).getPropertyValue("white-space")), o = r && "pre" === r.substring(0, 3), e(n), {a:f.join("").replace(/\n$/, ""), c:i}
    }

    function e(n, t, i, r) {
        t && (n = {a:t, d:n}, i(n), r.push.apply(r, n.e))
    }

    function i(n, t) {
        function i(n) {
            for (var h, v, y, w = n.d, p = [w, "pln"], k = 0, g = n.a.match(u) || [], d = {}, b = 0, nt = g.length; b < nt; ++b) {
                var c = g[b], s = d[c], l = void 0, o;
                if (typeof s == "string")o = !1; else {
                    if (h = f[c.charAt(0)], h)l = c.match(h[1]), s = h[0]; else {
                        for (o = 0; o < r; ++o)if (h = t[o], l = c.match(h[1])) {
                            s = h[0];
                            break
                        }
                        l || (s = "pln")
                    }
                    (o = s.length >= 5 && "lang-" === s.substring(0, 5)) && !(l && typeof l[1] == "string") && (o = !1, s = "src"), o || (d[c] = s)
                }
                h = k, k += c.length, o ? (o = l[1], v = c.indexOf(o), y = v + o.length, l[2] && (y = c.length - l[2].length, v = y - o.length), s = s.substring(5), e(w + h, c.substring(0, v), i, p), e(w + h + v, o, a(s, o), p), e(w + h + y, c.substring(y), i, p)) : p.push(w + h, s)
            }
            n.e = p
        }

        var f = {}, u, r;
        return function () {
            for (var i, r, e, h = n.concat(t), s = [], c = {}, o = 0, l = h.length; o < l; ++o) {
                if (i = h[o], r = i[3], r)for (e = r.length; --e >= 0;)f[r.charAt(e)] = i;
                i = i[1], r = "" + i, c.hasOwnProperty(r) || (s.push(i), c[r] = q)
            }
            s.push(/[\S\s]/), u = b(s)
        }(), r = t.length, i
    }

    function t(n) {
        var r = [], t = [], u;
        return n.tripleQuotedStrings ? r.push(["str", /^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/, q, "'\""]) : n.multiLineStrings ? r.push(["str", /^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/, q, "'\"`"]) : r.push(["str", /^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/, q, "\"'"]), n.verbatimStrings && t.push(["str", /^@"(?:[^"]|"")*(?:"|$)/, q]), u = n.hashComments, u && (n.cStyleComments ? (u > 1 ? r.push(["com", /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, q, "#"]) : r.push(["com", /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\n\r]*)/, q, "#"]), t.push(["str", /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/, q])) : r.push(["com", /^#[^\n\r]*/, q, "#"])), n.cStyleComments && (t.push(["com", /^\/\/[^\n\r]*/, q]), t.push(["com", /^\/\*[\S\s]*?(?:\*\/|$)/, q])), n.regexLiterals && t.push(["lang-regex", /^(?:^^\.?|[!+-]|!=|!==|#|%|%=|&|&&|&&=|&=|\(|\*|\*=|\+=|,|-=|->|\/|\/=|:|::|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|[?@[^]|\^=|\^\^|\^\^=|{|\||\|=|\|\||\|\|=|~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\s*(\/(?=[^*/])(?:[^/[\\]|\\[\S\s]|\[(?:[^\\\]]|\\[\S\s])*(?:]|$))+\/)/]), (u = n.types) && t.push(["typ", u]), n = ("" + n.keywords).replace(/^ | $/g, ""), n.length && t.push(["kwd", RegExp("^(?:" + n.replace(/[\s,]+/g, "|") + ")\\b"), q]), r.push(["pln", /^\s+/, q, " \r\n\t "]), t.push(["lit", /^@[$_a-z][\w$@]*/i, q], ["typ", /^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/, q], ["pln", /^[$_a-z][\w$@]*/i, q], ["lit", /^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i, q, "0123456789"], ["pln", /^\\[\S\s]?/, q], ["pun", /^.[^\s\w"-$'./@\\`]*/, q]), i(r, t)
    }

    function v(n, t) {
        function o(n) {
            var t, i, r;
            switch (n.nodeType) {
                case 1:
                    if (a.test(n.className))break;
                    if ("BR" === n.nodeName)s(n), n.parentNode && n.parentNode.removeChild(n); else for (n = n.firstChild; n; n = n.nextSibling)o(n);
                    break;
                case 3:
                case 4:
                    h && (t = n.nodeValue, i = t.match(v), i && (r = t.substring(0, i.index), n.nodeValue = r, (t = t.substring(i.index + i[0].length)) && n.parentNode.insertBefore(f.createTextNode(t), n.nextSibling), s(n), r || n.parentNode.removeChild(n)))
            }
        }

        function s(n) {
            function i(n, t) {
                var e = t ? n.cloneNode(!1) : n, r = n.parentNode, f, u;
                if (r)for (r = i(r, 1), f = n.nextSibling, r.appendChild(e), u = f; u; u = f)f = u.nextSibling, r.appendChild(u);
                return e
            }

            for (; !n.nextSibling;)if (n = n.parentNode, !n)return;
            for (var n = i(n.nextSibling, 0), t; (t = n.parentNode) && t.nodeType === 1;)n = t;
            u.push(n)
        }

        var a = /(?:^|\s)nocode(?:\s|$)/, v = /\r\n?|\n/, f = n.ownerDocument, i, h, u, r, e;
        for (n.currentStyle ? i = n.currentStyle.whiteSpace : window.getComputedStyle && (i = f.defaultView.getComputedStyle(n, q).getPropertyValue("white-space")), h = i && "pre" === i.substring(0, 3), i = f.createElement("LI"); n.firstChild;)i.appendChild(n.firstChild);
        for (u = [i], r = 0; r < u.length; ++r)o(u[r]);
        t === (t | 0) && u[0].setAttribute("value", t), e = f.createElement("OL"), e.className = "linenums";
        for (var l = Math.max(0, t - 1 | 0) || 0, r = 0, c = u.length; r < c; ++r)i = u[r], i.className = "L" + (r + l) % 10, i.firstChild || i.appendChild(f.createTextNode(" ")), e.appendChild(i);
        n.appendChild(e)
    }

    function n(n, t) {
        for (var i, r = t.length; --r >= 0;)i = t[r], f.hasOwnProperty(i) ? window.console && console.warn("cannot override language handler %s", i) : f[i] = n
    }

    function a(n, t) {
        return n && f.hasOwnProperty(n) || (n = /^\s*</.test(t) ? "default-markup" : "default-code"), f[n]
    }

    function y(n) {
        var d = n.g, f, e, u, i, y, h, w;
        try {
            f = k(n.h), e = f.a, n.a = e, n.c = f.c, n.d = 0, a(d, e)(n);
            var it = /\bMSIE\b/.test(navigator.userAgent), d = /\n/g, b = n.a, p = b.length, f = 0, v = n.c, tt = v.length, e = 0, t = n.e, s = t.length, n = 0;
            for (t[s] = p, i = u = 0; i < s;)t[i] !== t[i + 2] ? (t[u++] = t[i++], t[u++] = t[i++]) : i += 2;
            for (s = u, i = u = 0; i < s;) {
                for (var rt = t[i], g = t[i + 1], o = i + 2; o + 2 <= s && t[o + 1] === g;)o += 2;
                t[u++] = rt, t[u++] = g, i = o
            }
            for (t.length = u; e < tt;) {
                var c = v[e + 2] || p, nt = t[n + 2] || p, o = Math.min(c, nt), r = v[e + 1], l;
                r.nodeType !== 1 && (l = b.substring(f, o)) && (it && (l = l.replace(d, "\r")), r.nodeValue = l, y = r.ownerDocument, h = y.createElement("SPAN"), h.className = t[n + 1], w = r.parentNode, w.replaceChild(h, r), h.appendChild(r), f < c && (v[e + 1] = r = y.createTextNode(b.substring(o, c)), w.insertBefore(r, h.nextSibling))), f = o, f >= c && (e += 2), f >= nt && (n += 2)
            }
        } catch (ut) {
            "console"in window && console.log(ut && ut.stack ? ut.stack : ut)
        }
    }

    var r = ["break,continue,do,else,for,if,return,while"], u = [
        [r, "auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],
        "catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"
    ], p = [u, "alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"], o = [u, "abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient"], s = [o, "as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var"], u = [u, "debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN"], l = [r, "and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"], c = [r, "alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"], r = [r, "case,done,elif,esac,eval,fi,function,in,local,set,then,until"], h = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/, d = /\S/, w = t({keywords:[p, s, u, "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END" + l, c, r], hashComments:!0, cStyleComments:!0, multiLineStrings:!0, regexLiterals:!0}), f = {};
    n(w, ["default-code"]), n(i([], [
        ["pln", /^[^<?]+/],
        ["dec", /^<!\w[^>]*(?:>|$)/],
        ["com", /^<\!--[\S\s]*?(?:--\>|$)/],
        ["lang-", /^<\?([\S\s]+?)(?:\?>|$)/],
        ["lang-", /^<%([\S\s]+?)(?:%>|$)/],
        ["pun", /^(?:<[%?]|[%?]>)/],
        ["lang-", /^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i],
        ["lang-js", /^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i],
        ["lang-css", /^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i],
        ["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]
    ]), ["default-markup", "htm", "html", "mxml", "xhtml", "xml", "xsl"]), n(i([
        ["pln", /^\s+/, q, " \t\r\n"],
        ["atv", /^(?:"[^"]*"?|'[^']*'?)/, q, "\"'"]
    ], [
        ["tag", /^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i],
        ["atn", /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
        ["lang-uq.val", /^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/],
        ["pun", /^[/<->]+/],
        ["lang-js", /^on\w+\s*=\s*"([^"]+)"/i],
        ["lang-js", /^on\w+\s*=\s*'([^']+)'/i],
        ["lang-js", /^on\w+\s*=\s*([^\s"'>]+)/i],
        ["lang-css", /^style\s*=\s*"([^"]+)"/i],
        ["lang-css", /^style\s*=\s*'([^']+)'/i],
        ["lang-css", /^style\s*=\s*([^\s"'>]+)/i]
    ]), ["in.tag"]), n(i([], [
        ["atv", /^[\S\s]+/]
    ]), ["uq.val"]), n(t({keywords:p, hashComments:!0, cStyleComments:!0, types:h}), ["c", "cc", "cpp", "cxx", "cyc", "m"]), n(t({keywords:"null,true,false"}), ["json"]), n(t({keywords:s, hashComments:!0, cStyleComments:!0, verbatimStrings:!0, types:h}), ["cs"]), n(t({keywords:o, cStyleComments:!0}), ["java"]), n(t({keywords:r, hashComments:!0, multiLineStrings:!0}), ["bsh", "csh", "sh"]), n(t({keywords:l, hashComments:!0, multiLineStrings:!0, tripleQuotedStrings:!0}), ["cv", "py"]), n(t({keywords:"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END", hashComments:!0, multiLineStrings:!0, regexLiterals:!0}), ["perl", "pl", "pm"]), n(t({keywords:c, hashComments:!0, multiLineStrings:!0, regexLiterals:!0}), ["rb"]), n(t({keywords:u, cStyleComments:!0, regexLiterals:!0}), ["js"]), n(t({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,true,try,unless,until,when,while,yes", hashComments:3, cStyleComments:!0, multilineStrings:!0, tripleQuotedStrings:!0, regexLiterals:!0}), ["coffee"]), n(i([], [
        ["str", /^[\S\s]+/]
    ]), ["regex"]), window.prettyPrintOne = function (n, t, i) {
        var r = document.createElement("PRE");
        return r.innerHTML = n, i && v(r, i), y({g:t, i:i, h:r}), r.innerHTML
    }, window.prettyPrint = function (n) {
        function c() {
            for (var l, f, a, r, s, p, u, w = window.PR_SHOULD_USE_CONTINUATION ? t.now() + 250 : Infinity; i < e.length && t.now() < w; i++)if (l = e[i], f = l.className, f.indexOf("prettyprint") >= 0) {
                if (f = f.match(o), r = !f) {
                    for (r = l, u = void 0, s = r.firstChild; s; s = s.nextSibling)p = s.nodeType, u = p === 1 ? u ? r : s : p === 3 ? d.test(s.nodeValue) ? r : u : u;
                    r = (a = u === r ? void 0 : u) && "CODE" === a.tagName
                }
                for (r && (f = a.className.match(o)), f && (f = f[1]), r = !1, u = l.parentNode; u; u = u.parentNode)if ((u.tagName === "pre" || u.tagName === "code" || u.tagName === "xmp") && u.className && u.className.indexOf("prettyprint") >= 0) {
                    r = !0;
                    break
                }
                r || ((r = (r = l.className.match(/\blinenums\b(?::(\d+))?/)) ? r[1] && r[1].length ? +r[1] : !0 : !1) && v(l, r), h = {g:f, h:l, i:r}, y(h))
            }
            i < e.length ? setTimeout(c, 250) : n && n()
        }

        for (var r, s, t, i, h, o, f = [document.getElementsByTagName("pre"), document.getElementsByTagName("code"), document.getElementsByTagName("xmp")], e = [], u = 0; u < f.length; ++u)for (r = 0, s = f[u].length; r < s; ++r)e.push(f[u][r]);
        f = q, t = Date, t.now || (t = {now:function () {
            return+new Date
        }}), i = 0, o = /\blang(?:uage)?-([\w.]+)(?!\S)/, c()
    }, window.PR = {createSimpleLexer:i, registerLangHandler:n, sourceDecorator:t, PR_ATTRIB_NAME:"atn", PR_ATTRIB_VALUE:"atv", PR_COMMENT:"com", PR_DECLARATION:"dec", PR_KEYWORD:"kwd", PR_LITERAL:"lit", PR_NOCODE:"nocode", PR_PLAIN:"pln", PR_PUNCTUATION:"pun", PR_SOURCE:"src", PR_STRING:"str", PR_TAG:"tag", PR_TYPE:"typ"}
}();
(function (n) {
    n(function () {
        n(document).bind("click", function (t) {
            var i = n(t.target);
            i.parents().hasClass("dropdown") || (n("span.selectbox ul.dropdown").hide().find("li.sel").addClass("selected"), n("span.selectbox").removeClass("focused"))
        }), n("select.styled").each(function () {
            var u = n(this).find("option"), h = n(this).find("option:selected"), l = "", s = n(this).find("option:first").text(), f, c, t, e, r, o;
            for (h.length && (s = h.text()), i = 0; i < u.length; i++)f = "", c = ' class="disabled"', u.eq(i).is(":selected") && (f = ' class="selected sel"'), u.eq(i).is(":disabled") && (f = c), l += "<li" + f + ">" + u.eq(i).text() + "</li>";
            n(this).before('<span class="selectbox" style="display: inline-block; position: relative"><span class="select" style="float: left; position: relative; z-index: 998"><span class="text">' + s + '</span><b class="trigger"><i class="icons-arrow arrow_down"></i></b></span><ul class="dropdown" style="position: absolute; z-index: 997; overflow: auto; overflow-x: hidden; list-style: none">' + l + "</ul></span>").css({position:"absolute", left:-9999}), t = n(this).prev().find("ul"), e = n(this).prev().outerHeight(), t.css("left") == "auto" && t.css({left:0}), t.css("top") == "auto" && t.css({top:e}), r = t.find("li").outerHeight(), o = t.css("top"), t.hide(), n(this).prev().find("span.select").click(function () {
                var u = n(this).parent().offset().top, i = n(window).height() - e - (u - n(window).scrollTop());
                return i < 0 || i < r * 6 ? (t.height("auto").css({top:"auto", bottom:o}), t.outerHeight() > u - n(window).scrollTop() - 20 && t.height(Math.floor((u - n(window).scrollTop() - 20) / r) * r)) : i > r * 6 && (t.height("auto").css({bottom:"auto", top:o}), t.outerHeight() > i - 20 && t.height(Math.floor((i - 20) / r) * r)), n("span.selectbox").css({zIndex:1}).removeClass("focused"), n(this).next("ul").is(":hidden") ? (n("ul.dropdown:visible").hide(), n(this).next("ul").show()) : n(this).next("ul").hide(), n(this).parent().css({zIndex:2}), !1
            }), n(this).prev().find("li:not(.disabled)").hover(function () {
                n(this).siblings().removeClass("selected")
            }).click(function () {
                n(this).siblings().removeClass("selected sel").end().addClass("selected sel").parent().hide().prev("span.select").find("span.text").text(n(this).text()), u.removeAttr("selected").eq(n(this).index()).attr({selected:"selected"}), n(this).parents("span.selectbox").next().change()
            }), n(this).focus(function () {
                n("span.selectbox").removeClass("focused"), n(this).prev().addClass("focused")
            }).keyup(function () {
                n(this).prev().find("span.text").text(n(this).find("option:selected").text()).end().find("li").removeClass("selected sel").eq(n(this).find("option:selected").index()).addClass("selected sel")
            })
        })
    })
})(jQuery);