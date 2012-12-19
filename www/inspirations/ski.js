/**
 *  Референс взят из http://www.snowbird.com/mountain-report/
* Очень понравилась инфографика с помощью канваса
* Яваскрипт впечатлил
*/

Events = {registry:{}, dispatch:function (a, c) {
    var d = a.uid;
    this.register(d, c.name);
    for (var d = this.registry[d][c.name], f = 0; f < d.length; f++)d[f](c)
}, addListener:function (a, c, d) {
    d && (a = a.uid, this.register(a, c), this.registry[a][c].push(d))
}, removeListener:function (a, c, d) {
    a = this.registry[a.uid][c];
    for (c = 0; c < a.length; c++)d == a[c] && a.splice(c, 1)
}, register:function (a, c) {
    this.registry[a] || (this.registry[a] = {});
    this.registry[a][c] || (this.registry[a][c] = [])
}, destroy:function (a, c) {
    this.registry[a.uid][c] = !1
}, showRegistry:function () {
    console.log(this.registry)
}};
GlobalEvent = function (a, c) {
    this.name = a;
    this.data = c
};
GlobalEvent.RENDER_FRAME = "global_event_render_frame";
GlobalEvent.EVAL_MOUSE = "global_event_eval_mouse";
GlobalEvents = {registry:{}, dispatch:function (a) {
    this.register(a.name);
    for (var c = this.registry[a.name], d = 0; d < c.length; d++)c[d](a)
}, addListener:function (a, c) {
    this.register(a);
    this.registry[a].push(c)
}, removeListener:function (a, c) {
    var d = this.registry[a];
    if (!d)return!1;
    for (var f = 0; f < d.length; f++)c == d[f] && d.splice(f, 1)
}, register:function (a) {
    this.registry[a] || (this.registry[a] = [])
}, destroy:function (a) {
    this.registry[a] = !1
}};
MouseEvent = function (a, c) {
    this.name = a;
    this.data = c
};
MouseEvent.ROLL_OVER = "mouse_event_roll_over";
MouseEvent.ROLL_OUT = "mouse_event_roll_out";
MouseEvent.MOUSE_UP = "mouse_event_mouse_up";
MouseEvent.MOUSE_DOWN = "mouse_event_mouse_down";
MouseEvent.CLICK = "mouse_event_click";
var Stage = function (a) {
    var c = this;
    this.canvas = a;
    this.context;
    this.children;
    this.mouseColors = {};
    this.mouseCanvas;
    this.mouseContext;
    this.mouseOver = !1;
    this.mouseFocus = void 0;
    this.mouseEnabled = !1;
    this.layerX;
    this.layerY;
    this.__construct__ = function () {
        this.children = [];
        this.uid = Stage.getUniqueID();
        this.context = this.canvas.getContext("2d");
        this.mouseCanvas = document.createElement("canvas");
        this.mouseContext = this.mouseCanvas.getContext("2d");
        this.mouseCanvas.width = this.canvas.width;
        this.mouseCanvas.height = this.canvas.height;
        Stage.globalContext = this.context
    };
    this.enableMouse = function () {
        if (this.mouseEnabled)return!1;
        this.canvas.onmousemove = this.onMouseMove;
        this.canvas.onmouseover = this.onMouseOver;
        this.canvas.onmouseout = this.onMouseOut;
        this.canvas.onmousedown = this.onMouseDown;
        this.canvas.onmouseup = this.onMouseUp;
        this.canvas.onclick = this.onMouseClick;
        this.mouseEnabled = !0
    };
    this.disableMouse = function () {
        if (!this.mouseEnabled)return!1;
        this.canvas.onmousemove = void 0;
        this.canvas.onmouseover = void 0;
        this.canvas.onmouseout = void 0;
        this.canvas.onmousedown = void 0;
        this.canvas.onmouseup = void 0;
        this.canvas.onclick = void 0;
        this.mouseEnabled = !1;
        this.mouseFocus = void 0;
        this.mouseOver = !1;
        for (var c = 0; c < this.children.length; c++)this.children[c].resetMouse()
    };
    this.refreshCanvas = function () {
        c.canvas.width -= 1;
        c.canvas.width += 1
    };
    this.refreshMouseCanvas = function () {
    };
    this.startRendering = function () {
        c.rendering || (GlobalEvents.addListener(GlobalEvent.RENDER_FRAME, this.render), GlobalEvents.addListener(GlobalEvent.MOUSE_EVAL, this.evaluateMouse), c.rendering = !0)
    };
    this.stopRendering = function () {
        c.rendering && (GlobalEvents.removeListener(GlobalEvent.RENDER_FRAME, this.render), GlobalEvents.removeListener(GlobalEvent.MOUSE_EVAL, this.evaluateMouse), c.rendering = !1)
    };
    this.render = function () {
        c.refreshCanvas();
        c.mouseEnabled && c.refreshMouseCanvas();
        for (var a = 0; a < c.children.length; a++) {
            var f = c.children[a];
            f.render(c.context);
            c.mouseEnabled && (f.render(c.mouseContext, !0), c.dispatchMouseEvents())
        }
    };
    this.dispatchMouseEvents = function () {
        if (this.mouseOver) {
            try {
                var c = this.mouseContext.getImageData(this.layerX,
                    this.layerY, 1, 1).data
            } catch (a) {
                return!1
            }
            c = (new RGBColor(c[0], c[1], c[2])).getHEX().value;
            c = this.mouseColors[c];
            if (c != this.mouseFocus) {
                if (this.mouseFocus)for (var g = this.mouseFocus.getUncommonAncestors(c), l = 0; l < g.length; l++)g[l].dispatchRollOut();
                if (c) {
                    g = c.getAncestry();
                    for (l = 0; l < g.length; l++)g[l].dispatchRollOver()
                }
                this.mouseFocus = c;
                this.evaluateMouse()
            }
        }
    };
    this.evaluateMouse = function () {
        for (var a = "", f = c.mouseFocus; f;) {
            if (f.buttonMode) {
                a = "pointer";
                break
            }
            f = f.mother
        }
        this.canvas.style.cursor = a;
        window.blur();
        window.focus()
    };
    this.onMouseDown = function () {
        c.mouseFocus && c.mouseFocus.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_DOWN))
    };
    this.onMouseUp = function () {
        c.mouseFocus && c.mouseFocus.dispatchEvent(new MouseEvent(MouseEvent.MOUSE_UP))
    };
    this.onMouseClick = function () {
        c.mouseFocus && c.mouseFocus.dispatchEvent(new MouseEvent(MouseEvent.CLICK))
    };
    this.onMouseOver = function () {
        c.canvas.onmousemove = c.onMouseMove;
        c.mouseOver = !0
    };
    this.onMouseOut = function () {
        if (c.mouseFocus)for (var a = c.mouseFocus.getAncestry(), f = 0; f < a.length; f++)a[f].dispatchRollOut();
        c.canvas.onmousemove = void 0;
        c.mouseFocus = !1;
        c.mouseOver = !1
    };
    this.onMouseMove = function (a) {
        c.layerX = void 0 == a.offsetX ? a.layerX : a.offsetX;
        c.layerY = void 0 == a.offsetY ? a.layerY : a.offsetY
    };
    this.addChild = function (c) {
        this.children.push(c);
        c.setStage(this);
        c.mother = this
    };
    this.removeChild = function (c) {
        var a = this.children.indexOf(c);
        if (-1 == a)throw c + " is not a child of " + this;
        this.children.splice(a, 1);
        c.setStage(null);
        c.mother = null
    };
    this.addMouseColor = function (c) {
        this.mouseColors[c.mouseColor.value] = c
    };
    this.removeMouseColor =
        function (c) {
            delete this.mouseColors[c.mouseColor.value]
        };
    this.dispatchEvent = function (c) {
        Events.dispatch(this, c)
    };
    this.addEventListener = function (c, a) {
        Events.addListener(this, c, a)
    };
    this.removeEventListener = function (c, a) {
        Events.removeListener(this, c, a)
    };
    this.dispatchRollOver = function () {
        !this.over && this.mouseEnabled && (this.dispatchEvent(new MouseEvent(MouseEvent.ROLL_OVER)), this.over = !0)
    };
    this.dispatchRollOut = function () {
        this.over && this.mouseEnabled && (this.dispatchEvent(new MouseEvent(MouseEvent.ROLL_OUT)),
            this.over = !1)
    };
    this.toString = function () {
        return"[object Stage]"
    };
    this.__construct__()
};
Stage.r = 0;
Stage.g = 0;
Stage.b = 0;
Stage.uid = 0;
Stage.renderEvent = new GlobalEvent(GlobalEvent.RENDER_FRAME);
Stage.getUniqueID = function () {
    return++Stage.uid
};
Stage.getMouseColor = function () {
    Stage.r += 1;
    255 < Stage.r && (Stage.r = 0, Stage.g++);
    255 < Stage.g && (Stage.r = 0, Stage.g = 0, Stage.b++);
    return(new RGBColor(Stage.r, Stage.g, Stage.b)).getHEX()
};
Stage.init = function (a) {
    Stage.framerate = a;
    a = Math.round(1E3 * (1 / a));
    Stage.renderInterval = setInterval(Stage.renderFrame, a)
};
Stage.renderFrame = function () {
    GlobalEvents.dispatch(Stage.renderEvent)
};
Stage.suspend = function () {
    clearInterval(Stage.renderInterval)
};
var Sprite = function () {
    this.stage;
    this.height = this.width = this.y = this.x = 0;
    this.scaleY = this.scaleX = 1;
    this.rotation = 0;
    this.alpha = 1;
    this.visible = !0;
    this.uid = Stage.getUniqueID();
    this.mouseColor = Stage.getMouseColor();
    this.mouseString = this.mouseColor.toStringCSS();
    this.mouseEnabled = !1;
    this.children = [];
    this.mother;
    this.render = function (a, c) {
        if (this.stage && this.visible) {
            a.save();
            a.translate(this.x, this.y);
            a.scale(this.scaleX, this.scaleY);
            a.rotate(this.rotation * (Math.PI / 180));
            c ? this.mouseEnabled && this.mouseDraw(a) :
                (a.globalAlpha *= this.alpha, this.draw(a));
            for (var d = 0; d < this.children.length; d++)this.children[d].render(a, c);
            a.restore()
        }
    };
    this.setStage = function (a) {
        a && !this.stage ? a.addMouseColor(this) : !a && this.stage && this.stage.removeMouseColor(this);
        this.stage = a;
        for (var c = 0; c < this.children.length; c++)this.children[c].setStage(a)
    };
    this.dispatchEvent = function (a) {
        Events.dispatch(this, a)
    };
    this.addEventListener = function (a, c) {
        Events.addListener(this, a, c)
    };
    this.removeEventListener = function (a, c) {
        Events.removeListener(this,
            a, c)
    };
    this.dispatchRollOver = function () {
        !this.mouseOver && this.mouseEnabled && (this.dispatchEvent(new MouseEvent(MouseEvent.ROLL_OVER)), this.mouseOver = !0)
    };
    this.dispatchRollOut = function () {
        this.mouseOver && this.mouseEnabled && (this.dispatchEvent(new MouseEvent(MouseEvent.ROLL_OUT)), this.mouseOver = !1)
    };
    this.resetMouse = function () {
        this.mouseOver = !1;
        for (var a = 0; a < this.children.length; a++)this.children[a].resetMouse()
    };
    this.addChild = function (a) {
        this.children.push(a);
        a.setStage(this.stage);
        a.mother = this
    };
    this.removeChild =
        function (a) {
            var c = this.getChildIndex(a);
            this.children.splice(c, 1);
            a.setStage(null);
            a.mother = null;
            a.resetMouse()
        };
    this.setChildIndex = function (a, c) {
        var d = this.getChildIndex(a);
        this.children.splice(d, 1);
        this.children.splice(c, 0, a)
    };
    this.getChildIndex = function (a) {
        var c = this.children.indexOf(a);
        if (-1 == c)throw a + " is not a child of " + this;
        return c
    };
    this.isChildOf = function (a) {
        return!a ? !1 : a == this.mother ? !0 : this.isChildOf(a.mother)
    };
    this.getAncestry = function () {
        for (var a = this, c = [this]; a.mother;)c.push(a.mother),
            a = a.mother;
        return c
    };
    this.getProgeny = function () {
        for (var a = [this], c = 0; c < this.children.length; c++)a.concat(this.children[c].getProgeny());
        return a
    };
    this.getUncommonAncestors = function (a) {
        if (!a)return this.getAncestry();
        for (var c = this.getAncestry(), a = a.getAncestry(), d = 0; d < a.length; d++) {
            var f = c.indexOf(a[d]);
            -1 != f && c.splice(f, 1)
        }
        return c
    };
    this.draw = function () {
    };
    this.mouseDraw = function () {
    };
    this.toString = function () {
        return"[object Sprite]"
    }
}, TraditionalSprite = function (a, c) {
    this.element = c;
    this.data = a;
    this.currentFrame =
        1;
    this.totalFrames = a.length;
    this.startFrame;
    this.endFrame;
    this.repeat = null;
    this.count = 0;
    this.playing = !1;
    var d = this;
    this.progress = function () {
        var c = d.startFrame > d.endFrame ? -1 : 1;
        if (d.currentFrame == d.endFrame)return d.repeat !== d.count ? (d.currentFrame = d.startFrame, d.count++, d.update()) : (d.stop(d.endFrame), d.count = 0), !1;
        d.currentFrame += c;
        d.update()
    };
    this.update = function () {
        var c = d.data[d.currentFrame - 1].textureRect;
        d.element.style.backgroundPosition = -c.x + "px " + -c.y + "px"
    };
    this.play = function (c, a, d) {
        this.playing ||
        (this.repeat = c, this.startFrame = a || this.currentFrame, this.endFrame = d || this.totalFrames, GlobalEvents.addListener(GlobalEvent.RENDER_FRAME, this.progress), this.playing = !0)
    };
    this.stop = function (c) {
        this.currentFrame = c = c || this.currentFrame;
        this.update();
        GlobalEvents.removeListener(GlobalEvent.RENDER_FRAME, this.progress);
        this.playing = !1
    }
}, SpriteLink = function (a, c) {
    var d = this;
    this.link = c;
    this.sprite;
    this.__construct__ = function () {
        this.sprite = new TraditionalSprite(a, this.link);
        this.link.onmouseover = this.mouseOver;
        this.link.onmouseout = this.mouseOut
    };
    this.mouseOver = function () {
        d.sprite.stop();
        d.sprite.play(0, 2);
        return!1
    };
    this.mouseOut = function () {
        d.sprite.stop();
        d.sprite.play(0, null, 1);
        return!1
    };
    this.__construct__()
};
function Ajax(a) {
    var c = this;
    c.request = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
    c.request.onreadystatechange = function () {
        if (4 == c.request.readyState && 200 == c.request.status) {
            var d = c.request.getResponseHeader("Content-Type");
            d.match(/xml/gi) ? d = c.request.responseXML : d.match(/json/gi) ? (eval("var qqq=" + c.request.responseText), d = qqq) : d = c.request.responseText;
            if (a.onComplete)a.onComplete(d)
        } else if (4 == c.request.readyState && 200 != c.request.status && a.onFailure)a.onFailure({text:c.request.responseText,
            code:c.request.status})
    };
    var d = "";
    if (a.params)if (a.params.substr)d = a.params; else {
        for (param in a.params)d += "&" + encodeURIComponent(param) + "=" + encodeURIComponent(a.params[param]);
        d = d.substr(1)
    }
    "GET" == a.method ? (d && (d = "?" + d), c.request.open("GET", a.path + d, !0), c.request.setRequestHeader("X-Requested-With", "XMLHttpRequest"), c.request.send(null)) : (c.request.open("POST", a.path, !0), c.request.setRequestHeader("X-Requested-With", "XMLHttpRequest"), c.request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
        c.request.send(d));
    c.abort = function () {
        c.request.onreadystatechange = null;
        c.request.abort();
        if (a.onFailure)a.onFailure({text:c.request.responseText, code:c.request.status})
    }
}
var Tween = function (a, c, d) {
    this.ease = function (c, a, d, f) {
        return d * c / f + a
    };
    this.onComplete = function () {
    };
    this.onUpdate = function () {
    };
    this.running = null;
    this.prefix = this.units = "";
    this.delay = 0;
    this.begin = {};
    var f = this;
    this.__construct__ = function () {
        this.time = c;
        this.obj = a;
        this.id = Tween.getId();
        Tween.tweens[this.id] = this;
        d.onComplete && (this.onComplete = d.onComplete, delete d.onComplete);
        d.onUpdate && (this.onUpdate = d.onUpdate, delete d.onUpdate);
        d.ease && (this.ease = d.ease, delete d.ease);
        d.delay && (this.delay = d.delay,
            delete d.delay);
        for (prop in d)this.begin[prop] = a[prop];
        this.playTimeout = setTimeout(function () {
            f.play()
        }, this.delay)
    };
    this.play = function () {
        Tween.tweens[a] || (Tween.tweens[a] = []);
        Tween.tweens[a].push(this);
        this.endAt = (new Date).getTime() + this.time;
        GlobalEvents.addListener(GlobalEvent.RENDER_FRAME, this.mechanism)
    };
    this.stop = function () {
        clearTimeout(f.playTimeout);
        GlobalEvents.removeListener(GlobalEvent.RENDER_FRAME, f.mechanism);
        f.stopped = !0
    };
    this.mechanism = function () {
        if (f.stopped)return!1;
        var c = f.endAt -
            (new Date).getTime();
        0 >= c ? (f.stop(), f.advanceFrame(1, 1), f.onUpdate(), f.onComplete()) : (f.advanceFrame(f.time - c, f.time), f.onUpdate())
    };
    this.advanceFrame = function (c, f) {
        for (prop in d)b = this.begin[prop], e = d[prop], m = e - b, a[prop] = this.ease(c, b, m, f)
    };
    this.__construct__()
};
Tween.id = 0;
Tween.tweens = {};
Tween.killTweensOf = function (a) {
    for (var c in Tween.tweens) {
        var d = Tween.tweens[c];
        d.obj == a && d.stop()
    }
};
Tween.getId = function () {
    return++Tween.id
};
Ease = {linear:function (a, c, d, f) {
    return d * a / f + c
}, easeOut:{quad:function (a, c, d, f) {
    return-d * (a /= f) * (a - 2) + c
}, cubic:function (a, c, d, f) {
    return d * (Math.pow(a / f - 1, 3) + 1) + c
}, quart:function (a, c, d, f) {
    return-d * (Math.pow(a / f - 1, 4) - 1) + c
}, quint:function (a, c, d, f) {
    return d * (Math.pow(a / f - 1, 5) + 1) + c
}, sine:function (a, c, d, f) {
    return d * Math.sin(a / f * (Math.PI / 2)) + c
}, expo:function (a, c, d, f) {
    return d * (-Math.pow(2, -10 * a / f) + 1) + c
}, circ:function (a, c, d, f) {
    return d * Math.sqrt(1 - (a = a / f - 1) * a) + c
}, bounce:function (a, c, d, f) {
    return(a /= f) < 1 / 2.75 ?
        d * 7.5625 * a * a + c : a < 2 / 2.75 ? d * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + c : a < 2.5 / 2.75 ? d * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + c : d * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + c
}, back:function (a, c, d, f, g) {
    void 0 == g && (g = 1.70158);
    return d * ((a = a / f - 1) * a * ((g + 1) * a + g) + 1) + c
}}, easeIn:{quad:function (a, c, d, f) {
    return d * (a /= f) * a + c
}, cubic:function (a, c, d, f) {
    return d * Math.pow(a / f, 3) + c
}, quart:function (a, c, d, f) {
    return d * Math.pow(a / f, 4) + c
}, quint:function (a, c, d, f) {
    return d * Math.pow(a / f, 5) + c
}, sine:function (a, c, d, f) {
    return d * (1 - Math.cos(a / f * (Math.PI /
        2))) + c
}, expo:function (a, c, d, f) {
    return d * Math.pow(2, 10 * (a / f - 1)) + c
}, circ:function (a, c, d, f) {
    return d * (1 - Math.sqrt(1 - (a /= f) * a)) + c
}, bounce:function (a, c, d, f) {
    return d - Ease._out.bounce(f - a, 0, d, f) + c
}, back:function (a, c, d, f, g) {
    void 0 == g && (g = 1.70158);
    return d * (a /= f) * a * ((g + 1) * a - g) + c
}}, easeInOut:{quad:function (a, c, d, f) {
    return 1 > (a /= f / 2) ? d / 2 * a * a + c : -d / 2 * (--a * (a - 2) - 1) + c
}, cubic:function (a, c, d, f) {
    return 1 > (a /= f / 2) ? d / 2 * Math.pow(a, 3) + c : d / 2 * (Math.pow(a - 2, 3) + 2) + c
}, quart:function (a, c, d, f) {
    return 1 > (a /= f / 2) ? d / 2 * Math.pow(a,
        4) + c : -d / 2 * (Math.pow(a - 2, 4) - 2) + c
}, quint:function (a, c, d, f) {
    return 1 > (a /= f / 2) ? d / 2 * Math.pow(a, 5) + c : d / 2 * (Math.pow(a - 2, 5) + 2) + c
}, sine:function (a, c, d, f) {
    return d / 2 * (1 - Math.cos(Math.PI * a / f)) + c
}, expo:function (a, c, d, f) {
    return 1 > (a /= f / 2) ? d / 2 * Math.pow(2, 10 * (a - 1)) + c : d / 2 * (-Math.pow(2, -10 * --a) + 2) + c
}, circ:function (a, c, d, f) {
    return 1 > (a /= f / 2) ? d / 2 * (1 - Math.sqrt(1 - a * a)) + c : d / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + c
}, bounce:function (a, c, d, f) {
    return a < f / 2 ? 0.5 * Ease._in.bounce(2 * a, 0, d, f) + c : 0.5 * Ease._out.bounce(2 * a - f, 0, d, f) + 0.5 * d + c
}, back:function (a, c, d, f, g) {
    void 0 == g && (g = 1.70158);
    return 1 > (a /= f / 2) ? d / 2 * a * a * (((g *= 1.525) + 1) * a - g) + c : d / 2 * ((a -= 2) * a * (((g *= 1.525) + 1) * a + g) + 2) + c
}}};
var Utils = {getCoords:function () {
        for (var a = 0, c = 0; null != el; a += el.offsetLeft, c += el.offsetTop, el = el.offsetParent);
        return{x:a, y:c}
    }, isChild:function (a, c) {
        if (!c.parentNode)return!1;
        pn = c.parentNode;
        return pn == a ? !0 : Utils.isChild(a, pn)
    }, getWindowSize:function () {
        var a = 0, c = 0;
        if ("number" == typeof window.innerWidth)a = window.innerWidth, c = window.innerHeight; else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))a = document.documentElement.clientWidth, c = document.documentElement.clientHeight;
        else if (document.body && (document.body.clientWidth || document.body.clientHeight))a = document.body.clientWidth, c = document.body.clientHeight;
        return{width:a, height:c}
    }, getWindowScroll:function () {
        var a = 0, c = 0;
        if ("number" == typeof window.pageYOffset)c = window.pageYOffset, a = window.pageXOffset; else if (document.body && (document.body.scrollLeft || document.body.scrollTop))c = document.body.scrollTop, a = document.body.scrollLeft; else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop))c =
            document.documentElement.scrollTop, a = document.documentElement.scrollLeft;
        return{x:a, y:c}
    }}, FormSerializer = function (a) {
        var c = this;
        this.form = a;
        this.__construct__ = function () {
        };
        this.getObject = function () {
            for (var c = {}, f = a.getElementsByTagName("input"), g = 0; g < f.length; g++)c[f[g].name] = f[g].value;
            f = a.getElementsByTagName("select");
            for (g = 0; g < f.length; g++)c[f[g].name] = f[g].value;
            return c
        };
        this.getParamString = function () {
            var a = c.getObject(), f = "", g;
            for (g in a)a[g] && ("" != f && (f += "&"), f += g + "=" + a[g]);
            return f
        };
        this.__construct__()
    },
    ActivityIndicator = function () {
        var a = this;
        this.logo;
        this.activityCount = 0;
        this.removeTimeout = this.outTimeout = this.inTimeout = this.indicator = null;
        this.__constructor__ = function () {
        };
        this.incrementActivity = function () {
            a.activityCount++;
            window.clearTimeout(a.outTimeout);
            window.clearTimeout(a.removeTimeout);
            a.logo || (a.logo = document.getElementById("logo"));
            a.logo.className = "loading"
        };
        this.decrementActivity = function (c) {
            a.activityCount--;
            a.activityCount || (c ? a.outTimeout = window.setTimeout(a.hideIndicator, 500) : a.hideIndicator())
        };
        this.hideIndicator = function () {
            a.activityCount || (a.logo.className = "");
            a.outTimeout = null
        };
        this.__constructor__()
    };
Function.prototype.bind || (Function.prototype.bind = function (a) {
    if ("function" !== typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    var c = Array.prototype.slice.call(arguments, 1), d = this, f = function () {
    }, g = function () {
        return d.apply(this instanceof f && a ? this : a, c.concat(Array.prototype.slice.call(arguments)))
    };
    f.prototype = this.prototype;
    g.prototype = new f;
    return g
});
SNBRD = {loadHandlers:[], domReadyHandlers:[], alsoSeeOn:!1, renderEvent:new GlobalEvent(GlobalEvent.RENDER_FRAME), firstScript:document.getElementsByTagName("script")[0], isMobile:"ontouchstart"in document.documentElement, isDesktop:!this.isMobile, isRetina:1 < window.devicePixelRatio, removeClass:function (a, c) {
    var d = a.className.replace(RegExp(c, "g"), "");
    a.className = d.replace(/\s+/g, " ")
}, loadScriptAsync:function (a) {
    var c = document.createElement("script");
    c.src = a;
    SNBRD.firstScript.parentNode.insertBefore(c, SNBRD.firstScript)
},
    getElementsByClassName:function (a, c, d) {
        null == d && (d = document);
        if (d.getElementsByClassName)return d.getElementsByClassName(a);
        var f = [];
        null == c && (c = "*");
        c = d.getElementsByTagName(c);
        d = c.length;
        a = RegExp("(^|\\s)" + a + "(\\s|$)");
        for (j = i = 0; i < d; i++)a.test(c[i].className) && (f[j] = c[i], j++);
        return f
    }, getCoords:function (a) {
        for (var c = 0, d = 0; null != a; c += a.offsetLeft, d += a.offsetTop, a = a.offsetParent);
        return{x:c, y:d}
    }, isChild:function (a, c) {
        if (!c.parentNode)return!1;
        pn = c.parentNode;
        return pn == a ? !0 : Utils.isChild(a, pn)
    },
    getWindowSize:function () {
        var a = 0, c = 0;
        if ("number" == typeof window.innerWidth)a = window.innerWidth, c = window.innerHeight; else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))a = document.documentElement.clientWidth, c = document.documentElement.clientHeight; else if (document.body && (document.body.clientWidth || document.body.clientHeight))a = document.body.clientWidth, c = document.body.clientHeight;
        return{width:a, height:c}
    }, getWindowScroll:function () {
        var a =
            0, c = 0;
        if ("number" == typeof window.pageYOffset)c = window.pageYOffset, a = window.pageXOffset; else if (document.body && (document.body.scrollLeft || document.body.scrollTop))c = document.body.scrollTop, a = document.body.scrollLeft; else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop))c = document.documentElement.scrollTop, a = document.documentElement.scrollLeft;
        return{x:a, y:c}
    }, onDomReady:function () {
        for (var a = 0; a < SNBRD.domReadyHandlers.length; a++)SNBRD.domReadyHandlers[a]();
        SNBRD.domReadyHandlers = []
    }, onWindowLoad:function () {
        SNBRD.ignorePop = !0;
        for (var a = 0; a < SNBRD.loadHandlers.length; a++)SNBRD.loadHandlers[a]()
    }, onAjaxSuccess:function (a) {
        SNBRD.ajax = null;
        a.modal ? (SNBRD.activityIndicator.decrementActivity(), new Modal(a.modal, self.dismissPath, document.title), document.title = a.title) : (document.title = a.title, new PageTransition(a.content, a.sidebar))
    }, onAjaxFailure:function () {
        SNBRD.ajax = null;
        SNBRD.activityIndicator.decrementActivity();
        window.history.forward()
    }, onPopState:function () {
        if (SNBRD.ignorePop)return SNBRD.ignorePop = !1;
        if (SNBRD.modal)SNBRD.modal.onDismiss(); else {
            var a = {path:window.location.pathname, method:"GET", onComplete:SNBRD.onAjaxSuccess, onFailure:SNBRD.onAjaxFailure};
            SNBRD.activityIndicator.incrementActivity();
            SNBRD.ajax && SNBRD.ajax.abort();
            SNBRD.ajax = new Ajax(a)
        }
    }, startRendering:function () {
        if (!SNBRD.rendering) {
            var a = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
            a ? function d() {
                a(d);
                SNBRD.renderFrame()
            }() : setInterval(SNBRD.renderFrame,
                1E3 / 60);
            SNBRD.rendering = !0
        }
    }, renderFrame:function () {
        GlobalEvents.dispatch(SNBRD.renderEvent)
    }, padContent:function () {
        setTimeout(function () {
            var a = SNBRD.getWindowSize(), c = document.getElementById("bgLeftContent");
            document.getElementById("bgRightContent");
            var c = document.getElementById("overflow"), d = c.offsetHeight;
            c.offsetHeight < a.height && (d = a.height);
            bgLeftContent.style.height = d + "px";
            bgRightContent.style.height = d + "px";
            c = document.getElementById("bgLeftExtension");
            c.className = SNBRD.alsoSeeOn ? "also-see-present" :
                ""
        }, 0)
    }, alsoSeePresent:function (a) {
        SNBRD.alsoSeeOn = a;
        SNBRD.transition || (document.getElementById("bgLeftExtension").className = a ? "also-see-present" : "")
    }, getDirectDescendants:function (a, c) {
        for (var d = [], f = a.getElementsByTagName(c), g = 0; g < f.length; g++) {
            var l = f[g];
            l.parentNode == a && d.push(l)
        }
        return d
    }, findSnowbirdLinks:function () {
        for (var a = document.getElementsByTagName("a"), c = 0; c < a.length; c++)new SnowbirdLink(a[c], window.location.pathname)
    }};
window.onpopstate = SNBRD.onPopState;
window.onload = SNBRD.onWindowLoad;
SNBRD.activityIndicator = new ActivityIndicator;
SNBRD.startRendering();
var NavBarSearch = function () {
    var a = this;
    this.div;
    this.form;
    this.formSerializer;
    this.searchNavLink;
    this.searchInput;
    this.initialValue;
    this.hidden = this.fresh = !0;
    this.hideTimeout;
    this.init = function () {
        this.div = document.getElementById("nav-search-overlay");
        this.form = document.getElementById("nav-search-form");
        this.formSerializer = new FormSerializer(this.form);
        this.searchInput = document.getElementById("nav-search-input");
        this.searchNavLink = document.getElementById("search");
        this.initialValue = this.searchInput.value;
        this.searchNavLink.onclick = this.searchClickHandler;
        this.searchInput.onkeydown = this.searchKeyDownHandler;
        this.searchInput.onblur = this.searchBlurHandler;
        this.searchInput.onclick = this.inputClickHandler;
        return this
    };
    this.show = function () {
        this.hidden && (this.div.className += " show", this.searchInput.value = this.initialValue, this.searchInput.focus(), this.hidden = !1)
    };
    this.hide = function () {
        this.hidden || (SNBRD.removeClass(this.div, "show"), this.searchInput.blur(), this.fresh = this.hidden = !0)
    };
    this.onResponse = function (c) {
        SNBRD.ajax =
            null;
        window.history && window.history.pushState && window.history.pushState(null, a.form.getAttribute("action"), a.form.getAttribute("action"));
        a.hide();
        c.modal ? (SNBRD.activityIndicator.decrementActivity(), new Modal(c.modal, a.dismissPath, document.title), document.title = c.title) : (document.title = c.title, new PageTransition(c.content, c.sidebar))
    };
    this.onFailure = function () {
        SNBRD.ajax = null;
        SNBRD.activityIndicator.decrementActivity()
    };
    this.searchKeyDown = function (c) {
        c = c || window.event;
        c = window.event ? c.which : c.keyCode;
        this.fresh && (this.searchInput.value = "", this.fresh = !1);
        if (SNBRD.IE)return!0;
        if (13 == c)return c = {path:this.form.getAttribute("action"), method:"POST", params:this.formSerializer.getParamString(), onComplete:this.onResponse, onFailure:this.onFailure}, SNBRD.activityIndicator.incrementActivity(), SNBRD.ajax && SNBRD.ajax.abort(), SNBRD.ajax = new Ajax(c), !1
    };
    this.searchClick = function () {
        clearTimeout(this.hideTimeout);
        this.hidden ? (this.show(), this.searchInput.value = this.searchInput.value) : this.searchBlur();
        return!1
    };
    this.inputClick = function () {
        this.fresh && (this.searchInput.value = "", this.fresh = !1)
    };
    this.searchBlur = function () {
        var c = this;
        this.hideTimeout = setTimeout(function () {
            c.hide()
        }, 125)
    };
    this.inputClickHandler = this.inputClick.bind(this);
    this.searchClickHandler = this.searchClick.bind(this);
    this.searchKeyDownHandler = this.searchKeyDown.bind(this);
    this.searchBlurHandler = this.searchBlur.bind(this)
}, PaginationPage = function () {
    this.span;
    this.pagination;
    this.selected = !1;
    this.init = function (a, c) {
        this.span = c;
        this.pagination =
            a;
        this.span.onclick = this.clickHandler;
        /\s?selected/.test(this.span.className) && (this.selected = !0);
        return this
    };
    this.select = function () {
        this.selected || (this.span.className += " selected", this.selected = !0)
    };
    this.deselect = function () {
        this.selected && (SNBRD.removeClass(this.span, "selected"), this.selected = !1)
    };
    this.click = function () {
        this.selected || this.pagination.pageChange(this)
    };
    this.clickHandler = this.click.bind(this)
}, Pagination = function () {
    this.pages;
    this.slideshow;
    this.init = function (a, c) {
        this.div = c;
        this.slideshow =
            a;
        this.pages = [];
        for (var d = c.getElementsByTagName("span"), f = 0; f < d.length; f++) {
            var g = d[f];
            this.pages.push((new PaginationPage).init(this, g))
        }
        this.pages.reverse();
        return this
    };
    this.selectPageAtIndex = function (a) {
        for (var c = 0; c < this.pages.length; c++)this.pages[c].deselect();
        this.pages[a].select()
    };
    this.pageChange = function (a) {
        for (var c = 0; c < this.pages.length; c++)if (this.pages[c] == a) {
            this.slideshow.gotoPage(c);
            this.selectPageAtIndex(c);
            break
        }
    }
}, Slideshow = function () {
    this.mouseDownY = this.mouseDownX = 0;
    this.mouseDownAt;
    this.mouseDownTarget;
    this.startY = this.startX = this.offsetY = this.offsetX = this.finalY = this.finalX = this.lastY = this.lastX = 0;
    this.velocityX = -30;
    this.velocityY = 0;
    this.boundaryLeft;
    this.boundaryRight;
    this.animating = !1;
    this.div;
    this.items = [];
    this.index = this.itemWidth = 0;
    this.pagination;
    this.ItemClass = SlideshowItem;
    this.VideoClass = SlideshowVideoItem;
    this.photoLoadedIndex = 0;
    this.init = function (a) {
        if (!a.scripted) {
            a.scripted = !0;
            for (var c = a.getElementsByTagName("*"), d = 0; d < c.length; d++)c[d].setAttribute("unselectable",
                "on");
            this.div = SNBRD.getElementsByClassName("slideshow-content", "div", a)[0];
            c = SNBRD.getElementsByClassName("slideshow-photo", "div", a);
            d = SNBRD.getElementsByClassName("position-indicators", "div", a)[0];
            this.pagination = (new Pagination).init(this, d);
            for (d = 0; d < c.length; d++)a = c[d], a.getAttribute("data-video") ? this.items.push((new this.VideoClass).init(this, a)) : this.items.push((new this.ItemClass).init(this, a)), this.itemWidth = a.offsetWidth;
            this.boundaryLeft = 0;
            this.boundaryRight = this.items.length * this.itemWidth -
                this.itemWidth;
            SNBRD.isMobile ? this.div.ontouchstart = this.mouseDownHandler : this.div.onmousedown = this.mouseDownHandler;
            this.items[this.photoLoadedIndex++].load();
            return this
        }
    };
    this.transitionStart = function () {
        GlobalEvents.removeListener(PageTransition.TRANSITION_START, this.transitionStartHandler);
        GlobalEvents.removeListener(PageTransition.TRANSITION_COMPLETE, this.transitionCompleteHandler)
    };
    this.transitionComplete = function () {
        this.items[this.photoLoadedIndex++].load()
    };
    this.mouseDown = function (a) {
        var a =
            a || window.event, c, d;
        if (a.touches) {
            if (1 < a.touches.length) {
                this.stopDragging();
                return
            }
            1 == a.touches.length && (a = a.touches[0], c = a.pageX, d = a.pageY)
        } else c = a.clientX, d = a.clientY;
        this.velocityX = 0;
        this.mouseDownX = c;
        this.mouseDownY = d;
        this.mouseDownAt = new Date;
        SNBRD.isMobile ? (window.ontouchmove = this.mouseMoveHandler, window.ontouchend = this.mouseUpHandler) : (document.body.className += " unselectable dragging slideshowdrag", document.onselectstart = function () {
            return!1
        }, document.onmousemove = this.mouseMoveHandler, document.onmouseup =
            this.mouseUpHandler)
    };
    this.mouseMove = function (a) {
        var a = a || window.event, c, d;
        if (a.touches) {
            if (1 < a.touches.length) {
                this.stopDragging();
                return
            }
            1 == a.touches.length && (d = a.touches[0], c = d.pageX, d = d.pageY)
        } else c = a.clientX, d = a.clientY;
        if (!this.dragging) {
            if (SNBRD.isDesktop)return this.startDragging(), !0;
            c = Math.abs(c - this.mouseDownX);
            10 < Math.abs(d - this.mouseDownY) ? this.stopDragging() : 15 < c && this.startDragging();
            return!0
        }
        this.finalX = -(this.mouseDownX - this.startX - c);
        this.finalY = -(this.mouseDownY - this.startY - d);
        this.finalX > this.boundaryRight ? (a = this.finalX - this.boundaryRight, this.finalX = this.boundaryRight + a / 3) : this.finalX < this.boundaryLeft && (a = this.finalX - this.boundaryLeft, this.finalX = this.boundaryLeft + a / 3);
        this.velocityX = c - this.lastX;
        this.velocityY = d - this.lastY;
        this.lastX = c;
        this.lastY = d;
        return!1
    };
    this.mouseUp = function () {
        this.dragging ? (this.finalX = 0 < this.velocityX ? Math.ceil(this.offsetX / this.itemWidth) * this.itemWidth : Math.floor(this.offsetX / this.itemWidth) * this.itemWidth, this.finalX < this.boundaryLeft ? this.finalX =
            this.boundaryLeft : this.finalX > this.boundaryRight && (this.finalX = this.boundaryRight), this.updatePagination(), this.stopDragging()) : (this.stopDragging(), this.tap())
    };
    this.tap = function () {
        if (this.mouseDownTarget)for (var a = 0; a < this.items.length; a++) {
            var c = this.items[a];
            if (c == this.mouseDownTarget) {
                if (this.index == a) {
                    c.click();
                    break
                }
                this.finalX = a * this.itemWidth;
                this.finalX > this.boundaryRight && (this.finalX = this.boundaryRight);
                this.updatePagination();
                this.startAnimating();
                break
            }
        }
    };
    this.startDragging = function () {
        this.startX =
            this.offsetX;
        this.startY = this.offsetY;
        this.finalX = this.offsetX;
        this.finalY = this.offsetY;
        this.velocityY = this.velocityX = 0;
        SNBRD.isMobile ? (window.ontouchmove = this.mouseMoveHandler, window.ontouchend = this.mouseUpHandler) : (document.onmousemove = this.mouseMoveHandler, document.onmouseup = this.mouseUpHandler);
        this.startAnimating();
        this.dragging = !0
    };
    this.stopDragging = function () {
        this.dragging = !1;
        SNBRD.isMobile ? (window.ontouchmove = null, window.ontouchend = null) : (document.onmousemove = null, document.onmouseup = null);
        SNBRD.isMobile || (document.onselectstart = null, SNBRD.removeClass(document.body, "dragging"), SNBRD.removeClass(document.body, "unselectable"), SNBRD.removeClass(document.body, "slideshowdrag"));
        for (var a = 0; a < this.items.length; a++) {
            var c = this.items[a];
            c.pauseVideo && c.pauseVideo()
        }
    };
    this.startAnimating = function () {
        this.animating || (GlobalEvents.addListener(GlobalEvent.RENDER_FRAME, this.animateFrameHandler), this.animating = !0)
    };
    this.stopAnimating = function () {
        this.animating && (GlobalEvents.removeListener(GlobalEvent.RENDER_FRAME,
            this.animateFrameHandler), this.animating = !1)
    };
    this.animateFrame = function () {
        var a = 0.16 * (this.finalX - this.offsetX);
        !this.dragging && 0.01 > Math.abs(a) ? (this.loadMe && this.loadMe.load(), this.offsetX = Math.round(this.finalX), this.stopAnimating()) : this.offsetX += a;
        this.updateCSS()
    };
    this.updatePagination = function () {
        this.index = Math.ceil(this.finalX / this.itemWidth);
        this.pagination.selectPageAtIndex(this.index)
    };
    this.updateCSS = function () {
        this.div.style.msTransform = "translate(" + this.offsetX + "px)";
        this.div.style.MozTransform =
            "translate(" + this.offsetX + "px)";
        this.div.style.webkitTransform = "translate3d(" + this.offsetX + "px,0,0)";
        SNBRD.IE && 9 > SNBRD.IE && (this.div.style.marginRight = -this.offsetX + "px")
    };
    this.gotoPage = function (a) {
        this.index = a;
        this.finalX = a * this.itemWidth;
        this.finalX > this.boundaryRight && (this.finalX = this.boundaryRight);
        this.startAnimating()
    };
    this.photoLoaded = function () {
        (this.loadMe = this.items[this.photoLoadedIndex++]) && !this.animating && this.loadMe.load()
    };
    this.transitionStartHandler = this.transitionStart.bind(this);
    this.transitionCompleteHandler = this.transitionComplete.bind(this);
    this.animateFrameHandler = this.animateFrame.bind(this);
    this.mouseMoveHandler = this.mouseMove.bind(this);
    this.mouseDownHandler = this.mouseDown.bind(this);
    this.mouseUpHandler = this.mouseUp.bind(this)
};
function SlideshowItem() {
    this.div;
    this.slideshow;
    this.loaded = !1;
    this.init = function (a, c) {
        this.div = c;
        this.slideshow = a;
        this.url = this.div.getAttribute("data-url");
        this.src = this.div.getAttribute("data-img");
        this.srcRetina = this.div.getAttribute("data-img-retina");
        this.imgWidth = this.div.getAttribute("data-img-width");
        this.imgHeight = this.div.getAttribute("data-img-height");
        SNBRD.isMobile ? this.div.ontouchstart = this.mouseDownHandler : this.div.onmousedown = this.mouseDownHandler;
        return this
    };
    this.load = function () {
        this.img ||
        (this.img = new Image, this.img.width = this.imgWidth, this.img.height = this.imgHeight, this.img.src = SNBRD.isRetina ? this.srcRetina : this.src, this.img.onload = this.loadCompleteHandler, this.img.onmousedown = function () {
            return!1
        }, this.div.appendChild(this.img))
    };
    this.loadComplete = function () {
        this.slideshow.photoLoaded(this)
    };
    this.mouseDown = function () {
        this.slideshow.mouseDownTarget = this
    };
    this.click = function () {
        if (this.url) {
            SNBRD.IE && (window.location = this.url);
            "/" != this.url.substr(0, 1) && window.open(this.link.href, "_blank");
            var a = {path:this.url, method:"GET", onComplete:this.responseHandler, onFailure:this.failureHandler};
            SNBRD.activityIndicator.incrementActivity();
            SNBRD.ajax && SNBRD.ajax.abort();
            SNBRD.ajax = new Ajax(a)
        }
    };
    this.response = function (a) {
        SNBRD.ajax = null;
        window.history && window.history.pushState && window.history.pushState(null, this.url, this.url);
        a.modal ? (SNBRD.activityIndicator.decrementActivity(), new Modal(a.modal, this.dismissPath, document.title)) : new PageTransition(a.content, a.sidebar);
        document.title = a.title
    };
    this.failure =
        function () {
            SNBRD.ajax = null;
            SNBRD.activityIndicator.decrementActivity()
        };
    this.clickHandler = this.click.bind(this);
    this.mouseDownHandler = this.mouseDown.bind(this);
    this.loadCompleteHandler = this.loadComplete.bind(this);
    this.responseHandler = this.response.bind(this);
    this.failureHandler = this.failure.bind(this)
}
SlideshowVideoItem.prototype = new SlideshowItem;
SlideshowVideoItem.prototype.constructor = SlideshowVideoItem;
function SlideshowVideoItem() {
    SlideshowItem.call(this);
    this.div;
    this.src;
    this.video;
    this.slideshow;
    this.videoHolder;
    this.videoId;
    this.player;
    this.ready;
    this.init = function (a, c) {
        SlideshowVideoItem.prototype.init.call(this, a, c);
        this.videoHolder = SNBRD.getElementsByClassName("video-holder", "div", c)[0];
        this.videoId = c.getAttribute("data-video");
        return this
    };
    this.click = function () {
        this.player && this.ready && !this.slideshow.animating ? this.player.playVideo() : this.player || (this.player = new YT.Player(this.videoHolder,
            {width:"670", height:"350", videoId:this.videoId, events:{onReady:this.playerReadyHandler, onStateChange:this.playerStateChangeHandler}}))
    };
    this.playerReady = function () {
        this.ready = !0;
        this.slideshow.animating || this.player.playVideo()
    };
    this.playerStateChange = function () {
    };
    this.pauseVideo = function () {
        try {
            this.player && this.player.pauseVideo()
        } catch (a) {
        }
    };
    this.clickHandler = this.click.bind(this);
    this.playerStateChangeHandler = this.playerStateChange.bind(this);
    this.playerReadyHandler = this.playerReady.bind(this)
}
var BirdsNestPagination = function () {
    this.list;
    this.pages;
    this.nextButton;
    this.prevButton;
    this.index = 0;
    this.controller;
    this.prevDisabled = this.nextDisabled = this.selected = !1;
    this.init = function (a, c) {
        this.controller = a;
        this.list = c;
        this.pages = [];
        var d = this.list.getElementsByTagName("li");
        this.nextButton = d[0];
        this.prevButton = d[d.length - 1];
        this.nextButton.onclick = this.nextClickHandler;
        this.prevButton.onclick = this.prevClickHandler;
        for (var f = 1; f < d.length - 1; f++) {
            var g = d[f], g = (new BirdsNestPaginationPage).init(this,
                g);
            this.pages.push(g)
        }
        return this
    };
    this.select = function () {
        if (!this.selected) {
            this.list.className += " selected";
            for (var a = 0; a < this.pages.length; a++)this.pages[a].load();
            this.index = 0;
            this.pages[0].select();
            this.selected = !0
        }
    };
    this.deselect = function () {
        if (this.selected) {
            SNBRD.removeClass(this.list, "selected");
            for (var a = 0; a < this.pages.length; a++)this.pages[a].deselect();
            this.index = 0;
            this.selected = !1
        }
    };
    this.pageChange = function (a) {
        for (var c = 0; c < this.pages.length; c++)if (this.pages[c] == a) {
            this.controller.selectPageAtIndex(c,
                this);
            break
        }
    };
    this.selectPageAtIndex = function (a) {
        for (var c = 0; c < this.pages.length; c++)this.pages[c].deselect();
        this.index = a;
        this.pages[a].select()
    };
    this.prevClick = function () {
        if (!this.prevDisabled && this.selected)return this.controller.selectPageAtIndex(this.index + 1, this), !1
    };
    this.nextClick = function () {
        if (!this.nextDisabled && this.selected)return this.controller.selectPageAtIndex(this.index - 1, this), !1
    };
    this.disableNext = function () {
        this.nextDisabled || (this.nextButton.className += " disabled", this.nextDisabled = !0)
    };
    this.disablePrev = function () {
        this.prevDisabled || (this.prevButton.className += " disabled", this.prevDisabled = !0)
    };
    this.enableNext = function () {
        this.nextDisabled && (SNBRD.removeClass(this.nextButton, "disabled"), this.nextDisabled = !1)
    };
    this.enablePrev = function () {
        this.prevDisabled && (SNBRD.removeClass(this.prevButton, "disabled"), this.prevDisabled = !1)
    };
    this.nextClickHandler = this.nextClick.bind(this);
    this.prevClickHandler = this.prevClick.bind(this)
}, BirdsNestPaginationPage = function () {
    this.item;
    this.pagination;
    this.selected = !1;
    this.init = function (a, c) {
        this.item = c;
        this.link = c.getElementsByTagName("a")[0];
        this.pagination = a;
        var d = this;
        this.link.onclick = function () {
            d.click();
            return!1
        };
        /\s?selected/.test(this.item.className) && (this.selected = !0);
        return this
    };
    this.select = function () {
        this.selected || (this.item.className += " selected", this.selected = !0)
    };
    this.deselect = function () {
        this.selected && (SNBRD.removeClass(this.item, "selected"), this.selected = !1)
    };
    this.click = function () {
        this.selected || this.pagination.pageChange(this)
    };
    this.load = function () {
    };
    this.clickHandler = this.click.bind(this)
}, BirdsNestPaginationController = function () {
    this.div;
    this.index;
    this.pagination;
    this.pagesPerGroup = 8;
    this.init = function (a, c) {
        this.div = c;
        this.pagination = [];
        this.slideshow = a;
        for (var d = c.getElementsByTagName("ul"), f = 0; f < d.length; f++) {
            var g = d[f], g = (new BirdsNestPagination).init(this, g);
            this.pagination.push(g)
        }
        this.pagination[0].select();
        this.pagination[0].disableNext();
        this.index = 0;
        return this
    };
    this.selectPageInGroup = function (a, c) {
        for (var d =
            0; d < this.pagination.length; d++)if (this.pagination[d] == c) {
            groupIndex = d;
            break
        }
        8 == a && (modIndex = a - 8, groupIndex++);
        0 > a && (modIndex = 8 + a, groupIndex--)
    };
    this.selectPageAtIndex = function (a, c) {
        var d = Math.floor(a / this.pagesPerGroup), f = a % this.pagesPerGroup;
        if (c) {
            for (var g = 0; g < this.pagination.length; g++)if (this.pagination[g] == c) {
                d = g;
                break
            }
            8 == a ? (f = a - this.pagesPerGroup, d++) : -1 == a && (f = a + this.pagesPerGroup, d--)
        }
        var g = this.pagination.length - 1, l = this.pagination[g].pages.length - 1;
        0 == d && 0 == f ? (this.pagination[0].disableNext(),
            this.pagination[g].enablePrev()) : d == g && f == l ? (this.pagination[0].enableNext(), this.pagination[g].disablePrev()) : (this.pagination[0].enableNext(), this.pagination[g].enablePrev());
        d != this.index && (this.pagination[this.index].deselect(), this.pagination[d].select(), this.index = d, this.div.style.marginRight = -670 * d + "px");
        this.pagination[d].selectPageAtIndex(f);
        this.slideshow.gotoPage(8 * d + f)
    }
};
BirdsNestSlideshow.prototype = new Slideshow;
BirdsNestSlideshow.prototype.constructor = BirdsNestSlideshow;
function BirdsNestSlideshow() {
    Slideshow.call(this);
    this.init = function (a) {
        if (!a.scripted) {
            a.scripted = !0;
            this.div = SNBRD.getElementsByClassName("slideshow-content", "div", a)[0];
            var c = SNBRD.getElementsByClassName("slideshow-photo", "div", a), a = SNBRD.getElementsByClassName("thumbnails", "div", a)[0];
            this.pagination = (new BirdsNestPaginationController).init(this, a);
            for (a = 0; a < c.length; a++) {
                var d = c[a];
                d.getAttribute("data-video") ? this.items.push((new this.VideoClass).init(this, d)) : this.items.push((new this.ItemClass).init(this,
                    d));
                this.itemWidth = d.offsetWidth
            }
            this.boundaryLeft = 0;
            this.boundaryRight = this.items.length * this.itemWidth - this.itemWidth;
            SNBRD.isMobile ? this.div.ontouchstart = this.mouseDownHandler : this.div.onmousedown = this.mouseDownHandler;
            this.items[this.photoLoadedIndex++].load();
            return this
        }
    }
}
MountainCamSlideshowItem.prototype = new SlideshowItem;
MountainCamSlideshowItem.prototype.constructor = MountainCamSlideshowItem;
function MountainCamSlideshowItem() {
    SlideshowItem.call(this);
    this.click = function () {
        var a = this.div.getAttribute("data-url");
        window.location = a
    };
    this.clickHandler = this.click.bind(this)
}
MountainCamSlideshow.prototype = new Slideshow;
MountainCamSlideshow.prototype.constructor = MountainCamSlideshow;
function MountainCamSlideshow() {
    Slideshow.call(this);
    this.ItemClass = MountainCamSlideshowItem;
    this.init = function (a) {
        MountainCamSlideshow.prototype.init.call(this, a);
        this.items.length % 2 && (this.boundaryRight -= this.itemWidth);
        for (a = 0; a < this.items.length; a++)for (var c = this.items[a].div.getElementsByTagName("div"), d = 0; d < c.length; d++)c[d].onmousedown = function () {
            return!1
        };
        return this
    };
    this.tap = function () {
        if (this.mouseDownTarget)for (var a = 0; a < this.items.length; a++) {
            var c = this.items[a];
            if (c == this.mouseDownTarget) {
                if (this.index ==
                    a || this.index == a - 1) {
                    c.click();
                    break
                }
                this.finalX = a * this.itemWidth;
                this.finalX > this.boundaryRight && (this.finalX = this.boundaryRight);
                this.updatePagination();
                this.startAnimating();
                break
            }
        }
    }
}
var HorizontalDraggable = function (a) {
    var c = this;
    this.labelDiv = this.html = a;
    this.dragging = !1;
    this.onRelease = this.onUpdate = this.onPress = null;
    this.leftBound = 0;
    this.rightBound = 999;
    this.value = null;
    this.__construct__ = function () {
        c.html.onmousedown = c.mouseDown;
        c.html.ontouchstart = c.mouseDown
    };
    this.getCenterX = function () {
        return c.html.offsetLeft + c.html.clientWidth / 2
    };
    this.setCenterX = function (a) {
        c.html.style.left = a - c.html.clientWidth / 2 + "px"
    };
    this.getWidth = function () {
        return c.html.clientWidth
    };
    this.setWidth = function (a) {
        c.html.style.width =
            a + "px"
    };
    this.setLeftBound = function (a) {
        c.leftBound = a
    };
    this.setRightBound = function (a) {
        c.rightBound = a
    };
    this.setValue = function (a) {
        c.value = a;
        c.labelDiv.innerHTML = a
    };
    this.getValue = function () {
        return c.value
    };
    this.mouseDown = function () {
        SNBRD.isMobile ? (window.ontouchend = c.mouseUp, window.ontouchmove = c.mouseMove) : (document.onmouseup = c.mouseUp, document.onmousemove = c.mouseMove);
        c.dragging = !0;
        document.body.className += " dragging";
        if (c.onPress)c.onPress();
        return!1
    };
    this.mouseUp = function () {
        SNBRD.isMobile ? (window.onmouseup =
            null, window.onmousemove = null) : (document.onmouseup = null, document.onmousemove = null);
        c.dragging = !1;
        document.body.className = document.body.className.split("dragging").join("");
        if (c.onRelease)c.onRelease()
    };
    this.mouseMove = function (a) {
        a = a || window.event;
        if (c.dragging && (a = c.extractMouseX(a), a < c.leftBound ? a = c.leftBound : a > c.rightBound && (a = c.rightBound), c.setCenterX(a), c.onUpdate))c.onUpdate()
    };
    this.extractMouseX = function (a) {
        a = a.pageX;
        SNBRD.IE && 9 > SNBRD.IE && (a = event.clientX + document.documentElement.scrollLeft);
        return a - c.html.parentNode.parentNode.offsetLeft - c.html.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.offsetLeft
    };
    this.__construct__()
}, RangeFilter = function () {
    var a = this;
    this.leftBound = null;
    this.dataSetLeftBoundValue = this.leftBoundValue = 0;
    this.rightBound = null;
    this.dataSetRightBoundValue = this.rightBoundValue = 0;
    this.rangeChoices = this.rangeSelection = null;
    this.choiceLocations = [];
    this.leftBoundingPosition = 0;
    this.rightBoundingPosition = 999;
    this.onChange = null;
    this.__construct__ = function () {
        a.leftBound =
            new HorizontalDraggable(document.getElementById("range-filter-left-bound"));
        document.getElementById("range-filter-left-bound").id += "-scripted";
        a.leftBound.onUpdate = a.boundMoved;
        a.leftBound.onRelease = a.boundReleased;
        a.rightBound = new HorizontalDraggable(document.getElementById("range-filter-right-bound"));
        document.getElementById("range-filter-right-bound").id += "-scripted";
        a.rightBound.onUpdate = a.boundMoved;
        a.rightBound.onRelease = a.boundReleased;
        a.rangeSelection = document.getElementById("range-filter-selection-range");
        a.rangeSelection.id += "-scripted";
        a.rangeChoices = document.getElementById("range-filter-choices").getElementsByTagName("span");
        document.getElementById("range-filter-choices").id += "-scripted";
        a.cacheChoicePositions();
        a.arrangeContainedValues();
        a.leftBoundingPosition = a.choiceLocations[0];
        a.rightBoundingPosition = a.choiceLocations[a.choiceLocations.length - 1]
    };
    this.setLeftBound = function (c, d) {
        a.leftBoundValue = c - 1;
        a.dataSetLeftBoundValue = a.leftBoundValue;
        var f = a.rangeChoices[c - 1];
        f.className = "range-choice selected left";
        d ? (f.className = "range-choice selected left animated", a.leftBoundValue == a.rightBoundValue ? (singleDayTweenObj = {center:a.leftBound.getCenterX()}, new Tween(singleDayTweenObj, 150, {center:a.choiceLocations[a.rightBoundValue] - a.rightBound.getWidth(), onUpdate:function () {
            a.leftBound.setCenterX(singleDayTweenObj.center);
            a.updateSliderBounds();
            a.updateSelectionRange()
        }}), a.leftBound.setValue("&nbsp;")) : (leftTweenObj = {center:a.leftBound.getCenterX(), value:a.leftBound.getValue()}, "&nbsp;" == leftTweenObj.value &&
            (leftTweenObj.value = a.rightBound.getValue()), new Tween(leftTweenObj, 150, {center:a.choiceLocations[c - 1], value:c, onUpdate:function () {
            a.leftBound.setCenterX(leftTweenObj.center);
            a.leftBound.setValue(Math.round(leftTweenObj.value));
            a.updateSelectionRange()
        }})), a.updateSliderBounds()) : (a.leftBoundValue == a.rightBoundValue ? (a.leftBound.setCenterX(a.rightBound.getCenterX() - a.leftBound.getWidth()), a.leftBound.setValue("&nbsp;")) : (a.leftBound.setCenterX(a.choiceLocations[a.leftBoundValue]), a.leftBound.setValue(c)),
            a.updateSliderBounds(), a.updateSelectionRange());
        a.arrangeContainedValues()
    };
    this.setRightBound = function (c, d) {
        a.rightBoundValue = c - 1;
        this.dataSetRightBoundValue = a.rightBoundValue;
        var f = a.rangeChoices[c - 1];
        f.className = "range-choice selected right";
        d ? (f.className = "range-choice selected right animated", rightTweenObj = {center:a.rightBound.getCenterX(), value:a.rightBound.getValue()}, new Tween(rightTweenObj, 150, {center:a.choiceLocations[c - 1], value:c, onUpdate:function () {
            a.rightBound.setCenterX(rightTweenObj.center);
            a.rightBound.setValue(Math.round(rightTweenObj.value));
            a.updateSliderBounds();
            a.updateSelectionRange()
        }})) : (a.rightBound.setCenterX(a.choiceLocations[a.rightBoundValue]), a.rightBound.setValue(c), a.updateSliderBounds(), a.updateSelectionRange());
        a.arrangeContainedValues()
    };
    this.getLeftBound = function () {
        return a.leftBoundValue + 1
    };
    this.getRightBound = function () {
        return a.rightBoundValue + 1
    };
    this.reset = function () {
        a.rangeChoices = document.getElementById("range-filter-choices-scripted").getElementsByTagName("span");
        a.leftBoundValue = Math.min(a.leftBoundValue, a.rangeChoices.length - 1);
        a.rightBoundValue = Math.min(a.rightBoundValue, a.rangeChoices.length - 1);
        a.cacheChoicePositions();
        a.arrangeContainedValues()
    };
    this.choiceClicked = function () {
        for (var c = 0; c < a.rangeChoices.length && this != a.rangeChoices[c]; c++);
        if (Math.abs(a.rightBoundValue - c) < Math.abs(c - a.leftBoundValue)) {
            a.rangeChoices[a.rightBoundValue].className = "range-choice animated";
            for (var d = a.leftBoundValue + 1; d < c; d++) {
                var f = a.rangeChoices[d];
                f.className = "range-choice animated"
            }
            a.setRightBound(c +
                1, !0)
        } else {
            a.rangeChoices[a.leftBoundValue].className = "range-choice animated";
            for (d = c + 1; d < a.rightBoundValue; d++)f = a.rangeChoices[d], f.className = "range-choice animated";
            a.setLeftBound(c + 1, !0)
        }
        if (a.onChange)a.onChange()
    };
    this.updateSelectionRange = function () {
        SNBRD.IE && 9 > SNBRD.IE || (a.rangeSelection.style.left = a.leftBound.getCenterX() + 6 + "px", a.rangeSelection.style.width = a.rightBound.getCenterX() - a.leftBound.getCenterX() - 12 + "px")
    };
    this.updateSliderBounds = function () {
        a.leftBound.setLeftBound(a.leftBoundingPosition);
        a.leftBound.setRightBound(a.rightBound.getCenterX() - a.rightBound.getWidth());
        a.rightBound.setLeftBound(a.leftBound.getCenterX() + a.leftBound.getWidth() - 1);
        a.rightBound.setRightBound(a.rightBoundingPosition)
    };
    this.boundMoved = function () {
        a.updateSelectionRange();
        a.updateSliderBounds();
        var c = a.getValueForPosition(this.getCenterX());
        this.setValue(c + 1);
        if (this == a.leftBound) {
            if (c == a.leftBoundValue)return;
            a.rangeChoices[a.leftBoundValue].className = "range-choice animated";
            a.leftBoundValue = c
        } else {
            if (c == a.rightBoundValue)return;
            a.rangeChoices[a.rightBoundValue].className = "range-choice animated";
            a.rightBoundValue = c
        }
        a.rangeChoices[a.leftBoundValue].className = "range-choice selected left animated";
        a.rangeChoices[a.rightBoundValue].className = "range-choice selected right animated";
        for (c = a.leftBoundValue + 1; c < a.rightBoundValue; c++)a.rangeChoices[c].className = "range-choice animated";
        a.arrangeContainedValues()
    };
    this.boundReleased = function () {
        a.updateSelectionRange();
        a.updateSliderBounds();
        var c = a.getValueForPosition(this.getCenterX());
        this.setValue(c + 1);
        if (this == a.leftBound) {
            var d = a.choiceLocations[c];
            d > a.rightBound.getCenterX() - a.rightBound.getWidth() && (d = a.rightBound.getCenterX() - a.rightBound.getWidth());
            a.rangeChoices[a.leftBoundValue].className = "range-choice animated";
            a.leftBoundValue = c;
            a.rangeChoices[a.leftBoundValue].className = "range-choice selected left animated";
            tweenObj = {center:a.leftBound.getCenterX()};
            new Tween(tweenObj, 150, {center:d, onUpdate:function () {
                a.leftBound.setCenterX(tweenObj.center);
                a.updateSelectionRange();
                a.updateSliderBounds()
            }})
        } else d = a.choiceLocations[c], d < a.leftBound.getCenterX() + a.leftBound.getWidth() - 1 && (d = a.leftBound.getCenterX() + a.leftBound.getWidth() - 1), a.rangeChoices[a.rightBoundValue].className = "range-choice animated", a.rightBoundValue = c, a.rangeChoices[a.rightBoundValue].className = "range-choice selected right animated", tweenObj = {center:a.rightBound.getCenterX()}, new Tween(tweenObj, 150, {center:d, onUpdate:function () {
            a.rightBound.setCenterX(tweenObj.center);
            a.updateSelectionRange();
            a.updateSliderBounds()
        }});
        a.arrangeContainedValues();
        if (a.onChange)a.onChange()
    };
    this.cacheChoicePositions = function () {
        a.choiceLocations = [];
        for (var c = 0; c < a.rangeChoices.length; c++) {
            var d = a.rangeChoices[c];
            a.choiceLocations.push(d.offsetLeft + d.clientWidth / 2)
        }
        for (c = 0; c < a.rangeChoices.length; c++)d = a.rangeChoices[c], d.style.position = "absolute", d.style.left = a.choiceLocations[c] - d.clientWidth / 2 + "px", d.onclick = a.choiceClicked
    };
    this.arrangeContainedValues = function () {
        for (var c = 0; c <= this.leftBoundValue; c++) {
            var d = a.rangeChoices[c];
            d.style.left =
                a.choiceLocations[c] - d.clientWidth / 2 + "px"
        }
        if (2 < this.rightBoundValue - this.leftBoundValue)for (c = this.leftBoundValue + 1; c < this.rightBoundValue; c++); else for (c = this.leftBoundValue + 1; c < this.rightBoundValue; c++)d = a.rangeChoices[c], d.style.left = a.choiceLocations[c] - d.clientWidth / 2 + "px";
        for (c = this.rightBoundValue; c < a.rangeChoices.length; c++)d = a.rangeChoices[c], d.style.left = a.choiceLocations[c] - d.clientWidth / 2 + "px"
    };
    this.getValueForPosition = function (c) {
        var d = Math.round(c / (a.rightBoundingPosition - a.leftBoundingPosition) *
            (a.rangeChoices.length - 1)), f = d, g = d;
        if (c > a.choiceLocations[d])for (g = f + 1; c > a.choiceLocations[g] && g < a.choiceLocations.length - 1;)f += 1, g += 1; else if (c < a.choiceLocations[d] && 0 < d)for (f = g - 1; c < a.choiceLocations[f] && 1 <= f;)f -= 1, g -= 1; else return d;
        return a.choiceLocations[g] - c < c - a.choiceLocations[f] ? g : f
    };
    this.__construct__()
}, Filter = function (a) {
    var c = this;
    this.html = a;
    this.choices = this.nub = null;
    this.choiceLocations = [];
    this.leftBoundingPosition = this.selectedIndex = 0;
    this.rightBoundingPosition = 999;
    this.onChange = null;
    this.__construct__ = function () {
        c.html.id += "-scripted";
        for (var d = c.html.getElementsByTagName("*"), f = 0; f < d.length; f++)d[f].unselectable = "on";
        c.nub = new HorizontalDraggable(a.children[0].children[1]);
        c.nub.labelDiv = a.children[0].children[1].children[0].children[0].children[0];
        c.nub.onPress = c.nubPressed;
        c.nub.onUpdate = c.nubMoved;
        c.nub.onRelease = c.nubReleased;
        c.choices = a.children[0].children[0].getElementsByTagName("span");
        for (f = 0; f < c.choices.length; f++)c.choiceLocations.push(c.choices[f].offsetLeft + c.choices[f].clientWidth /
            2), c.choices[f].onclick = c.choiceClicked;
        c.leftBoundingPosition = c.choiceLocations[0];
        c.rightBoundingPosition = c.choiceLocations[c.choiceLocations.length - 1];
        c.nub.setLeftBound(c.leftBoundingPosition);
        c.nub.setRightBound(c.rightBoundingPosition)
    };
    this.reset = function () {
        c.nub.html.className = "filter-selection-background";
        c.choiceLocations = [];
        for (var a = 0; a < c.choices.length; a++)c.choiceLocations.push(c.choices[a].offsetLeft + c.choices[a].clientWidth / 2);
        c.leftBoundingPosition = c.choiceLocations[0];
        c.rightBoundingPosition =
            c.choiceLocations[c.choiceLocations.length - 1];
        c.nub.setLeftBound(c.leftBoundingPosition);
        c.nub.setRightBound(c.rightBoundingPosition);
        c.setSelected(c.selectedIndex)
    };
    this.setSelected = function (a) {
        c.selectedIndex = a;
        a = c.choices[c.selectedIndex];
        c.nub.setValue(a.innerHTML);
        c.nub.setWidth(a.clientWidth + 29);
        c.nub.setCenterX(c.choiceLocations[c.selectedIndex])
    };
    this.getSelected = function () {
        return c.selectedIndex
    };
    this.choiceClicked = function () {
        for (var a = 0; a < c.choices.length && this != c.choices[a]; a++);
        var f =
            Math.abs(c.selectedIndex - a);
        c.nub.html.className = "filter-selection-background animated";
        c.selectedIndex = a;
        var g = c.choices[a];
        c.nub.setWidth(g.clientWidth + 29);
        c.nub.setValue(g.innerHTML);
        tweenObj = {center:c.nub.getCenterX()};
        new Tween(tweenObj, Math.max(50 * f, 150), {center:c.choiceLocations[a], ease:Ease.easeInOut.cubic, onUpdate:function () {
            c.nub.setCenterX(tweenObj.center)
        }});
        if (c.onChange)c.onChange()
    };
    this.nubPressed = function () {
        c.nub.html.className = "filter-selection-background animated dragging";
        var a =
            c.choices[c.getIndexForPosition(c.nub.getCenterX())];
        c.nub.setWidth(a.clientWidth + 29);
        c.nub.setValue(a.innerHTML)
    };
    this.nubMoved = function () {
        var a = c.choices[c.getIndexForPosition(c.nub.getCenterX())];
        c.nub.setWidth(a.clientWidth + 29);
        c.nub.setValue(a.innerHTML)
    };
    this.nubReleased = function () {
        c.nub.html.className = "filter-selection-background animated";
        var a = c.getIndexForPosition(c.nub.getCenterX());
        c.selectedIndex = a;
        var f = c.choices[a];
        c.nub.setWidth(f.clientWidth + 29);
        c.nub.setValue(f.innerHTML);
        tweenObj =
        {center:c.nub.getCenterX()};
        new Tween(tweenObj, 150, {center:c.choiceLocations[a], ease:Ease.easeOut.cubic, onUpdate:function () {
            c.nub.setCenterX(tweenObj.center)
        }});
        if (c.onChange)c.onChange()
    };
    this.getIndexForPosition = function (a) {
        var f = Math.round((a - c.leftBoundingPosition) / (c.rightBoundingPosition - c.leftBoundingPosition) * (c.choices.length - 1)), g = f, l = f;
        if (a > c.choiceLocations[f])for (l = g + 1; a > c.choiceLocations[l] && l < c.choiceLocations.length - 1;)g += 1, l += 1; else if (a < c.choiceLocations[f] && 0 < f)for (g = l - 1; a < c.choiceLocations[g] &&
            1 <= g;)g -= 1, l -= 1; else return f;
        return c.choiceLocations[l] - a < a - c.choiceLocations[g] ? l : g
    };
    this.__construct__()
}, Toggle = function (a) {
    var c = this;
    this.html = a;
    this.choices = null;
    this.selectedIndex = 0;
    this.onChange = null;
    this.__construct__ = function () {
        c.html.id += "-scripted";
        c.choices = c.html.getElementsByTagName("a");
        for (var a = 0; a < c.choices.length; a++)c.choices[a].onclick = c.toggleClicked, c.choices[a].onmouseover = c.toggleHovered
    };
    this.getSelected = function () {
        return c.selectedIndex
    };
    this.setSelected = function (a) {
        c.selectedIndex =
            a;
        for (a = 0; a < c.choices.length; a++)c.choices[a].className = a == c.selectedIndex ? "filters-category selected" : "filters-category deselected";
        if (c.onChange)c.onChange()
    };
    this.toggleHovered = function () {
        "filters-category deselected" == this.className && (this.className = "filters-category")
    };
    this.toggleClicked = function () {
        for (var a = 0; a < c.choices.length && this != c.choices[a]; a++);
        a != c.selectedIndex && c.setSelected(a);
        return!1
    };
    this.__construct__()
}, Modal = function (a, c, d) {
    var f = this;
    this.modal = this.modalHolder = this.modalBack =
        this.overflow = null;
    this.dismissPath = c;
    this.dismissTitle = d;
    this.pageContentHeight = this.pageYOffset = 0;
    "string" == typeof a ? this.innerHTML = a : this.html = a;
    this.__construct__ = function () {
        SNBRD.modal = this;
        var a = SNBRD.getWindowSize();
        f.storedOffset = SNBRD.getWindowScroll().y;
        if (f.innerHTML) {
            f.overflow = document.getElementById("overflow");
            f.overflow.className = "modalled";
            f.overflow.style.height = a.height + "px";
            f.overflow.scrollTop = f.storedOffset;
            f.bg = document.getElementById("bg");
            f.bg.style.height = a.height + "px";
            f.bg.className =
                "modalled";
            f.modalBack = document.createElement("div");
            f.modalBack.setAttribute("id", "modal-fade");
            f.modalBack.style.height = a.height + "px";
            document.body.appendChild(f.modalBack);
            f.modalHolder = document.createElement("div");
            f.modalHolder.setAttribute("id", "modal-holder");
            document.body.appendChild(f.modalHolder);
            f.modal = document.createElement("div");
            f.modal.setAttribute("id", "modal");
            f.modal.setAttribute("class", "detail");
            f.modal.innerHTML = f.innerHTML;
            f.modal.onclick = function (a) {
                if (SNBRD.IE) {
                    var c = event.currentTarget ?
                        event.currentTarget : event.srcElement, d = c.getAttribute("href");
                    d && "#" != d && window.open(c.href, "_blank")
                }
                a = a || window.event;
                a.cancelBubble = !0;
                a.stopPropagation()
            };
            f.modalHolder.appendChild(f.modal);
            f.modalHeight = f.modalHolder.offsetHeight;
            window.scrollTo(0, 0);
            f.modalHeight = f.modalHolder.offsetHeight;
            a.height > f.modalHeight && (f.modalHolder.style.height = a.height + "px");
            f.modal.style.visibility = "visible";
            f.setTransform(a.height);
            var c = {modalOffset:a.height};
            new Tween(c, 400, {modalOffset:0, ease:Ease.easeOut.cubic,
                onUpdate:function () {
                    f.setTransform(c.modalOffset)
                }});
            f.modal.getElementsByTagName("a")[0].onclick = f.onDismiss;
            f.modalHolder.onclick = f.onDismiss;
            for (var d = f.modal.getElementsByTagName("script"), a = 0; a < d.length; a++)eval(d[a].innerHTML);
            SNBRD.onDomReady()
        } else f.overflow = document.getElementById("overflow"), f.overflow.className = "modalled", f.overflow.style.height = a.height + "px", f.overflow.scrollTop = f.storedOffset, f.bg = document.getElementById("bg"), f.bg.style.height = a.height + "px", f.bg.className = "modalled",
            f.modalHolder = document.getElementById("modal-holder"), f.modalBack = document.getElementById("modal-fade"), f.modal = document.getElementById("modal"), f.modal.style.visibility = "visible", f.modal.onclick = function (a) {
            if (SNBRD.IE) {
                var c = event.currentTarget ? event.currentTarget : event.srcElement, d = c.getAttribute("href");
                d && "#" != d && window.open(c.href, "_blank")
            }
            a = a || window.event;
            a.cancelBubble = !0;
            a.stopPropagation()
        }, f.modalHeight = f.modalHolder.offsetHeight, a.height > f.modalHeight && (f.modalHolder.style.height = a.height +
            "px"), f.modal.getElementsByTagName("a")[0].onclick = f.onDismiss, f.modalHolder.onclick = f.onDismiss;
        for (var d = f.modal.getElementsByTagName("a")[0], h = f.modal.getElementsByTagName("a"), a = 0; a < h.length; a++)h[a] != d && new SnowbirdLink(h[a], window.location.pathname);
        window.onresize = f.onResize;
        f.resizeForPhoto()
    };
    this.resizeForPhoto = function () {
        SNBRD.getElementsByClassName("content", "div", f.modalHolder);
        var a = SNBRD.getElementsByClassName("birds-nest-photo", "div", f.modalHolder);
        if (a.length) {
            var a = a[0], c = SNBRD.getElementsByClassName("left-column",
                "div", f.modalHolder)[0], a = a.getElementsByTagName("img")[0].width;
            590 < a && (c.style.width = a - 200 - 40 + "px", f.modal.style.width = a + 80 + "px")
        }
    };
    this.onDismiss = function () {
        var a = SNBRD.getWindowSize(), c = SNBRD.getWindowScroll().y;
        tweenObj = {modalOffset:0};
        new Tween(tweenObj, 400, {opacity:0, modalOffset:a.height + c, ease:Ease.easeIn.cubic, onUpdate:function () {
            f.setTransform(tweenObj.modalOffset)
        }, onComplete:function () {
            f.overflow.style.height = "";
            f.overflow.className = "";
            f.bg.style.height = "";
            f.bg.className = "";
            f.modalHolder.parentNode.removeChild(f.modalHolder);
            f.modalBack = document.getElementById("modal-fade");
            f.modalBack.parentNode.removeChild(f.modalBack);
            f.modal.style.visibility = "";
            window.scrollTo(0, f.storedOffset);
            window.history && window.history.pushState && (f.dismissPath && window.history.pushState(null, f.dismissPath, f.dismissPath), f.dismissTitle && (document.title = f.dismissTitle));
            SNBRD.padContent()
        }});
        window.onresize = null;
        SNBRD.modal = null;
        return!1
    };
    this.onResize = function () {
        var a = SNBRD.getWindowSize();
        f.bg.style.height = a.height + "px";
        f.overflow.style.height =
            a.height + "px";
        f.modalBack.style.height = a.height + "px";
        f.modalHolder.style.height = a.height > f.modalHeight ? a.height + "px" : ""
    };
    this.setTransform = function (a) {
        f.modal.style.msTransform = "translate(0," + a + "px)";
        f.modal.style.MozTransform = "translate3d(0," + a + "px,0)";
        f.modal.style.webkitTransform = "translate3d(0," + a + "px,0)"
    };
    this.__construct__()
}, SnowbirdLink = function (a, c) {
    var d = this;
    this.html = a;
    this.dismissPath = c;
    this.__construct__ = function () {
        d.html && (!d.html.onclick && !SNBRD.IE) && ("#" == d.html.getAttribute("href") ?
            "close" != d.html.className && "subscribe-button" != d.html.id && (d.html.onclick = function () {
                return!1
            }) : d.html.onclick = d.onClick)
    };
    this.onResponse = function (a) {
        SNBRD.ajax = null;
        console.log("HEYYYYYYYYYYYYYYYY", a);
        window.history && window.history.pushState && window.history.pushState(null, d.html.getAttribute("href"), d.html.getAttribute("href"));
        a.modal ? (SNBRD.activityIndicator.decrementActivity(), new Modal(a.modal, d.dismissPath, document.title), document.title = a.title) : (document.title = a.title, new PageTransition(a.content,
            a.sidebar))
    };
    this.onFailure = function () {
        SNBRD.activityIndicator.decrementActivity();
        SNBRD.ajax = null
    };
    this.onClick = function (a) {
        if (a.metaKey || "/" != d.html.getAttribute("href").substr(0, 1) || /.pdf$/.test(d.html.href))return!0;
        SNBRD.activityIndicator.incrementActivity();
        a = {path:d.html.getAttribute("href"), method:"GET", onComplete:d.onResponse, onFailure:d.onFailure};
        SNBRD.ajax && SNBRD.ajax.abort();
        SNBRD.ajax = new Ajax(a);
        return!1
    };
    this.__construct__()
}, RelevantContentItem = function () {
    var a = this;
    this.div;
    this.link;
    this.header;
    this.focusTimeout;
    this.selected = !1;
    this.init = function (a, d) {
        this.relevantContent = a;
        this.div = d;
        this.div.style.height = this.div.parentNode.offsetHeight - 80 + "px";
        var f = SNBRD.getElementsByClassName("thumbnail-mask", "div", this.div)[0];
        this.sprite = new TraditionalSprite(ThumbnailSpriteData(), f);
        /selected/.test(this.div.className) && (this.selected = !0);
        this.header = d.getElementsByTagName("h2")[0];
        if (this.link = this.header.getElementsByTagName("a")[0])this.header.innerHTML = this.link.innerHTML;
        SNBRD.isMobile ?
            this.div.ontouchstart = this.mouseDownHandler : (this.div.onmousedown = this.mouseDownHandler, this.div.onmouseover = this.divOverHandler, this.div.onmouseout = this.divOutHandler);
        GlobalEvents.addListener(this.showPosition, 50);
        return this
    };
    this.showPosition = function () {
        a.header.innerHTML = a.backgroun
    };
    this.select = function () {
        this.selected || (SNBRD.isDesktop && (this.div.className += " selected"), this.selected = !0)
    };
    this.deselect = function () {
        this.selected && (SNBRD.isDesktop && SNBRD.removeClass(this.div, "selected"), this.selected = !1)
    };
    this.response = function (a) {
        SNBRD.ajax = null;
        window.history && window.history.pushState && window.history.pushState(null, this.link.getAttribute("href"), this.link.getAttribute("href"));
        a.modal ? (SNBRD.activityIndicator.decrementActivity(), new Modal(a.modal, this.dismissPath, document.title)) : new PageTransition(a.content, a.sidebar);
        document.title = a.title
    };
    this.failure = function () {
        SNBRD.ajax = null;
        SNBRD.activityIndicator.decrementActivity()
    };
    this.click = function () {
        if ("#" != this.link.getAttribute("href")) {
            this.focus();
            clearTimeout(this.focusTimeout);
            SNBRD.IE && (window.location = this.link.href);
            "/" != this.link.getAttribute("href").substr(0, 1) && window.open(this.link.href, "_blank");
            var a = {path:this.link.getAttribute("href"), method:"GET", onComplete:this.responseHandler, onFailure:this.failureHandler};
            SNBRD.activityIndicator.incrementActivity();
            SNBRD.ajax && SNBRD.ajax.abort();
            SNBRD.ajax = new Ajax(a)
        }
    };
    this.mouseDown = function () {
        this.relevantContent.mouseDownTarget = this;
        SNBRD.isMobile && this.selected && (this.focusTimeout = setTimeout(this.focusHandler,
            120))
    };
    this.focus = function () {
        this.focused || (this.div.className += " focused", this.focused = !0)
    };
    this.unfocus = function () {
        this.focused && (SNBRD.removeClass(this.div, "focused"), this.focused = !1)
    };
    this.divOver = function () {
        !this.relevantContent.dragging && this.selected && (SNBRD.isDesktop && !SNBRD.isRetina) && (this.sprite.stop(), this.sprite.play(0, 2))
    };
    this.divOut = function () {
        SNBRD.isDesktop && !SNBRD.isRetina && (this.sprite.stop(), this.sprite.play(0, null, 1))
    };
    this.clickHandler = this.click.bind(this);
    this.mouseDownHandler =
        this.mouseDown.bind(this);
    this.focusHandler = this.focus.bind(this);
    this.unfocusHandler = this.unfocus.bind(this);
    this.divOverHandler = this.divOver.bind(this);
    this.divOutHandler = this.divOut.bind(this);
    this.responseHandler = this.response.bind(this);
    this.failureHandler = this.failure.bind(this)
}, RelevantContent = function () {
    this.mouseDownY = this.mouseDownX = 0;
    this.mouseDownAt;
    this.mouseDownTarget;
    this.startY = this.startX = this.offsetY = this.offsetX = this.finalY = this.finalX = this.lastY = this.lastX = 0;
    this.velocityX = -30;
    this.velocityY = 0;
    this.boundaryLeft;
    this.boundaryRight;
    this.animating = !1;
    this.div;
    this.items = [];
    this.index = this.itemWidth = 0;
    this.mask;
    this.rotating = !1;
    this.rotationInterval;
    this.init = function (a) {
        if (!a.scripted) {
            a.scripted = !0;
            this.div = a;
            for (var c = SNBRD.getElementsByClassName("relevant-content-item", "div", this.div), d = a.getElementsByTagName("*"), a = 0; a < d.length; a++)d[a].setAttribute("unselectable", "on");
            for (a = 0; a < c.length; a++)d = c[a], this.itemWidth = d.offsetWidth, this.items.push((new RelevantContentItem).init(this,
                d));
            this.boundaryLeft = -(this.items.length * this.itemWidth - this.itemWidth);
            this.boundaryRight = 0;
            SNBRD.isMobile ? this.div.ontouchstart = this.mouseDownHandler : this.div.onmousedown = this.mouseDownHandler;
            GlobalEvents.addListener(PageTransition.TRANSITION_START, this.stopRotatingHandler);
            this.startRotating();
            return this
        }
    };
    this.startRotating = function () {
        this.rotating || (this.rotationInterval = setInterval(this.rotateHandler, 7500), this.rotating = !0)
    };
    this.stopRotating = function () {
        this.rotating && (clearInterval(this.rotationInterval),
            this.rotating = !1)
    };
    this.mouseDown = function (a) {
        var a = a || window.event, c, d;
        if (a.touches) {
            if (1 < a.touches.length) {
                this.stopDragging();
                return
            }
            1 == a.touches.length && (a = a.touches[0], c = a.pageX, d = a.pageY)
        } else c = a.clientX, d = a.clientY;
        this.velocityX = 0;
        this.mouseDownX = c;
        this.mouseDownY = d;
        this.mouseDownAt = new Date;
        SNBRD.isMobile ? (window.ontouchmove = this.mouseMoveHandler, window.ontouchend = this.mouseUpHandler) : (document.body.className += " unselectable dragging relevantdrag", document.onselectstart = function () {
            return!1
        },
            document.onmousemove = this.mouseMoveHandler, document.onmousemove = this.mouseMoveHandler, document.onmouseup = this.mouseUpHandler);
        this.stopRotating()
    };
    this.mouseMove = function (a) {
        var a = a || window.event, c, d;
        if (a.touches) {
            if (1 < a.touches.length) {
                this.stopDragging();
                return
            }
            1 == a.touches.length && (d = a.touches[0], c = d.pageX, d = d.pageY)
        } else c = a.clientX, d = a.clientY;
        if (!this.dragging)return c = Math.abs(c - this.mouseDownX), 10 < Math.abs(d - this.mouseDownY) ? this.stopDragging() : 15 < c && this.startDragging(), !0;
        this.finalX = -(this.mouseDownX -
            this.startX - c);
        this.finalY = -(this.mouseDownY - this.startY - d);
        this.finalX > this.boundaryRight ? (a = this.finalX - this.boundaryRight, this.finalX = this.boundaryRight + a / 3) : this.finalX < this.boundaryLeft && (a = this.finalX - this.boundaryLeft, this.finalX = this.boundaryLeft + a / 3);
        this.velocityX = c - this.lastX;
        this.velocityY = d - this.lastY;
        this.lastX = c;
        this.lastY = d;
        return!1
    };
    this.mouseUp = function () {
        this.dragging ? (this.finalX = 0 < this.velocityX ? Math.ceil(this.offsetX / this.itemWidth) * this.itemWidth : Math.floor(this.offsetX / this.itemWidth) *
            this.itemWidth, this.finalX < this.boundaryLeft ? this.finalX = this.boundaryLeft : this.finalX > this.boundaryRight && (this.finalX = this.boundaryRight), this.mouseDownTarget = null, this.updateSelectedItems(), this.stopDragging()) : (this.tap(), this.stopDragging(), this.updateSelectedItems(), this.mouseDownTarget = null)
    };
    this.tap = function () {
        if (this.mouseDownTarget)if (this.mouseDownTarget.selected)this.mouseDownTarget.unfocus(), this.mouseDownTarget.click(); else for (var a = 0; a < this.items.length; a++)if (this.items[a] == this.mouseDownTarget) {
            this.finalX =
                -a * this.itemWidth;
            this.startAnimating();
            break
        }
    };
    this.startDragging = function () {
        this.startX = this.offsetX;
        this.startY = this.offsetY;
        this.finalX = this.offsetX;
        this.finalY = this.offsetY;
        this.velocityY = this.velocityX = 0;
        this.mouseDownTarget && (clearTimeout(this.mouseDownTarget.focusTimeout), this.mouseDownTarget.unfocusHandler());
        SNBRD.isMobile ? (window.ontouchmove = this.mouseMoveHandler, window.ontouchend = this.mouseUpHandler) : (document.onmousemove = this.mouseMoveHandler, document.onmouseup = this.mouseUpHandler);
        for (var a =
            0; a < this.items.length; a++)this.items[a].divOut();
        this.startAnimating();
        this.dragging = !0
    };
    this.clearFocus = function () {
        clearTimeout(this.mouseDownTarget.focusTimeout);
        this.mouseDownTarget.unfocusHandler()
    };
    this.stopDragging = function () {
        SNBRD.isMobile ? (window.ontouchmove = null, window.ontouchend = null) : (document.onmousemove = null, document.onmouseup = null);
        this.mouseDownTarget && (clearTimeout(this.mouseDownTarget.focusTimeout), this.mouseDownTarget.unfocusHandler());
        SNBRD.isMobile || (document.onselectstart = null,
            SNBRD.removeClass(document.body, "dragging"), SNBRD.removeClass(document.body, "unselectable"), SNBRD.removeClass(document.body, "relevantdrag"));
        this.dragging = !1
    };
    this.startAnimating = function () {
        this.animating || (GlobalEvents.addListener(GlobalEvent.RENDER_FRAME, this.animateFrameHandler), this.animating = !0)
    };
    this.stopAnimating = function () {
        this.animating && (GlobalEvents.removeListener(GlobalEvent.RENDER_FRAME, this.animateFrameHandler), this.animating = !1)
    };
    this.animateFrame = function () {
        var a = 0.16 * (this.finalX -
            this.offsetX);
        !this.dragging && 0.01 > Math.abs(a) && (this.offsetX = this.finalX, this.stopAnimating(), this.startRotating());
        this.offsetX += a;
        this.updateCSS()
    };
    this.updateSelectedItems = function () {
        this.index = -(this.finalX / this.itemWidth);
        for (var a = 0; a < this.items.length; a++)this.items[a].deselect();
        this.items[this.index].select()
    };
    this.updateCSS = function () {
        this.div.style.msTransform = "translate(" + this.offsetX + "px)";
        this.div.style.MozTransform = "translate3d(" + this.offsetX + "px,0,0)";
        this.div.style.webkitTransform =
            "translate3d(" + this.offsetX + "px,0,0)";
        9 > SNBRD.IE && (this.div.style.marginLeft = this.offsetX + "px")
    };
    this.rotate = function () {
    };
    this.animateFrameHandler = this.animateFrame.bind(this);
    this.mouseMoveHandler = this.mouseMove.bind(this);
    this.mouseDownHandler = this.mouseDown.bind(this);
    this.mouseUpHandler = this.mouseUp.bind(this);
    this.stopRotatingHandler = this.stopRotating.bind(this);
    this.startRotatingHandler = this.startRotating.bind(this);
    this.rotateHandler = this.rotate.bind(this)
};
FeaturedContentItem.prototype = new RelevantContentItem;
FeaturedContentItem.prototype.constructor = FeaturedContentItem;
function FeaturedContentItem() {
    RelevantContentItem.call(this)
}
FeaturedContent.prototype = new RelevantContent;
FeaturedContent.prototype.constructor = FeaturedContent;
function FeaturedContent() {
    RelevantContent.call(this);
    this.init = function (a) {
        a.featured || (a.featured = !0, FeaturedContent.prototype.init.call(this, a), this.itemsPerGroup = this.items.length / 3, this.groupWidth = this.itemsPerGroup * this.itemWidth, this.boundaryLeft = 0, this.boundaryRight = 2 * this.groupWidth, this.finalX = this.offsetX = this.groupWidth, this.updateSelectedItems(), this.updateCSS())
    };
    this.rotate = function () {
        this.finalX += this.itemWidth;
        this.updateSelectedItems();
        this.startAnimating()
    };
    this.updateSelectedItems =
        function () {
            var a = this.finalX;
            a <= this.boundaryLeft ? a += this.groupWidth : a >= this.boundaryRight && (a -= this.groupWidth);
            this.index = a / this.itemWidth;
            for (a = 0; a < this.items.length; a++)this.items[a].deselect();
            var a = this.items.length, c = this.itemsPerGroup;
            this.items[this.index].select();
            this.items[(this.index + 2 * c) % a].select();
            this.items[this.index + 1] && this.items[this.index + 1].select();
            this.items[(this.index + 2 * c) % a + 1] && this.items[(this.index + 2 * c) % a + 1].select()
        };
    this.tap = function () {
        if (this.mouseDownTarget)if (this.mouseDownTarget.selected)this.mouseDownTarget.unfocus(),
            this.mouseDownTarget.click(); else for (var a = 0; a < this.items.length; a++)if (this.items[a] == this.mouseDownTarget) {
            this.finalX = a * this.itemWidth - this.itemWidth;
            this.startAnimating();
            break
        }
    };
    this.mouseMove = function (a) {
        var a = a || window.event, c, d;
        if (a.touches) {
            if (1 < a.touches.length) {
                this.stopDragging();
                return
            }
            1 == a.touches.length && (d = a.touches[0], c = d.pageX, d = d.pageY)
        } else c = a.clientX, d = a.clientY;
        if (!this.dragging)return c = Math.abs(c - this.mouseDownX), 10 < Math.abs(d - this.mouseDownY) ? this.stopDragging() : 15 < c && this.startDragging(),
            !0;
        this.finalX = -(this.mouseDownX - this.startX - c);
        this.finalY = -(this.mouseDownY - this.startY - d);
        this.velocityX = c - this.lastX;
        this.velocityY = d - this.lastY;
        this.lastX = c;
        this.lastY = d;
        return!1
    };
    this.animateFrame = function () {
        this.finalX <= this.boundaryLeft ? (this.startX += this.groupWidth, this.finalX += this.groupWidth, this.offsetX += this.groupWidth, this.updateCSS()) : this.finalX >= this.boundaryRight && (this.startX -= this.groupWidth, this.finalX -= this.groupWidth, this.offsetX -= this.groupWidth, this.updateCSS());
        var a = 0.16 *
            (this.finalX - this.offsetX);
        !this.dragging && 0.01 > Math.abs(a) && (this.offsetX = this.finalX, this.stopAnimating(), this.startRotating());
        this.offsetX += a;
        this.updateCSS()
    };
    this.updateCSS = function () {
        this.div.style.msTransform = "translate(" + this.offsetX + "px)";
        this.div.style.MozTransform = "translate3d(" + this.offsetX + "px,0,0)";
        this.div.style.webkitTransform = "translate3d(" + this.offsetX + "px,0,0)";
        SNBRD.IE && 9 > SNBRD.IE && (this.div.style.marginRight = -this.offsetX + "px")
    };
    this.animateFrameHandler = this.animateFrame.bind(this);
    this.mouseMoveHandler = this.mouseMove.bind(this);
    this.rotateHandler = this.rotate.bind(this)
}
var SimplexNoise = function (a) {
    void 0 == a && (a = Math);
    this.grad3 = [
        [1, 1, 0],
        [-1, 1, 0],
        [1, -1, 0],
        [-1, -1, 0],
        [1, 0, 1],
        [-1, 0, 1],
        [1, 0, -1],
        [-1, 0, -1],
        [0, 1, 1],
        [0, -1, 1],
        [0, 1, -1],
        [0, -1, -1]
    ];
    this.p = [];
    for (var c = 0; 256 > c; c++)this.p[c] = Math.floor(256 * a.random());
    this.perm = [];
    for (c = 0; 512 > c; c++)this.perm[c] = this.p[c & 255];
    this.simplex = [
        [0, 1, 2, 3],
        [0, 1, 3, 2],
        [0, 0, 0, 0],
        [0, 2, 3, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 2, 3, 0],
        [0, 2, 1, 3],
        [0, 0, 0, 0],
        [0, 3, 1, 2],
        [0, 3, 2, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 3, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 2, 0, 3],
        [0, 0, 0, 0],
        [1, 3, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 3, 0, 1],
        [2, 3, 1, 0],
        [1, 0, 2, 3],
        [1, 0, 3, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 3, 1],
        [0, 0, 0, 0],
        [2, 1, 3, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [2, 0, 1, 3],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [3, 0, 1, 2],
        [3, 0, 2, 1],
        [0, 0, 0, 0],
        [3, 1, 2, 0],
        [2, 1, 0, 3],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [3, 1, 0, 2],
        [0, 0, 0, 0],
        [3, 2, 0, 1],
        [3, 2, 1, 0]
    ]
};
SimplexNoise.prototype.dot = function (a, c, d) {
    return a[0] * c + a[1] * d
};
SimplexNoise.prototype.noise = function (a, c) {
    var d, f, g;
    g = 0.5 * (Math.sqrt(3) - 1);
    g *= a + c;
    var l = Math.floor(a + g), k = Math.floor(c + g), h = (3 - Math.sqrt(3)) / 6;
    g = (l + k) * h;
    d = a - (l - g);
    var n = c - (k - g), r, p;
    d > n ? (r = 1, p = 0) : (r = 0, p = 1);
    f = d - r + h;
    var q = n - p + h;
    g = d - 1 + 2 * h;
    var h = n - 1 + 2 * h, t = l & 255, k = k & 255, l = this.perm[t + this.perm[k]] % 12;
    r = this.perm[t + r + this.perm[k + p]] % 12;
    p = this.perm[t + 1 + this.perm[k + 1]] % 12;
    k = 0.5 - d * d - n * n;
    0 > k ? d = 0 : (k *= k, d = k * k * this.dot(this.grad3[l], d, n));
    n = 0.5 - f * f - q * q;
    0 > n ? f = 0 : (n *= n, f = n * n * this.dot(this.grad3[r], f, q));
    q = 0.5 - g *
        g - h * h;
    0 > q ? g = 0 : (q *= q, g = q * q * this.dot(this.grad3[p], g, h));
    return 70 * (d + f + g)
};
SimplexNoise.prototype.noise3d = function (a, c, d) {
    var f, g, l, k = (a + c + d) * (1 / 3), h = Math.floor(a + k), n = Math.floor(c + k), r = Math.floor(d + k), k = 1 / 6;
    l = (h + n + r) * k;
    f = a - (h - l);
    g = c - (n - l);
    var p = d - (r - l), q, t, w, v, s, x;
    f >= g ? g >= p ? (q = 1, w = t = 0, s = v = 1, x = 0) : (f >= p ? (q = 1, w = t = 0) : (t = q = 0, w = 1), v = 1, s = 0, x = 1) : g < p ? (t = q = 0, w = 1, v = 0, x = s = 1) : f < p ? (q = 0, t = 1, v = w = 0, x = s = 1) : (q = 0, t = 1, w = 0, s = v = 1, x = 0);
    var u = f - q + k, A = g - t + k, B = p - w + k;
    l = f - v + 2 * k;
    var a = g - s + 2 * k, C = p - x + 2 * k, d = f - 1 + 3 * k, c = g - 1 + 3 * k, k = p - 1 + 3 * k, h = h & 255, y = n & 255, z = r & 255, n = this.perm[h + this.perm[y + this.perm[z]]] % 12,
        r = this.perm[h + q + this.perm[y + t + this.perm[z + w]]] % 12;
    v = this.perm[h + v + this.perm[y + s + this.perm[z + x]]] % 12;
    h = this.perm[h + 1 + this.perm[y + 1 + this.perm[z + 1]]] % 12;
    s = 0.6 - f * f - g * g - p * p;
    0 > s ? f = 0 : (s *= s, f = s * s * this.dot(this.grad3[n], f, g, p));
    g = 0.6 - u * u - A * A - B * B;
    0 > g ? g = 0 : (g *= g, g = g * g * this.dot(this.grad3[r], u, A, B));
    u = 0.6 - l * l - a * a - C * C;
    0 > u ? l = 0 : (u *= u, l = u * u * this.dot(this.grad3[v], l, a, C));
    a = 0.6 - d * d - c * c - k * k;
    0 > a ? d = 0 : (a *= a, d = a * a * this.dot(this.grad3[h], d, c, k));
    return 32 * (f + g + l + d)
};
var MountainPoint = function (a, c) {
    this.x = 0;
    this.y = 10;
    this.previousX = 0;
    this.previousY = 10;
    this.nextX = 0;
    this.nextY = 10;
    this.next = this.previous = null;
    this.anchor = !1;
    this.simplex = new SimplexNoise;
    this.index = 0;
    this.__construct__ = function (a, c) {
        this.x = a;
        this.nextY = this.previousY = this.y = c
    };
    this.getDisplacement = function () {
        return 3.5 * this.simplex.noise(2 + 1E-8 * a, 2 + 1E-8 * c)
    };
    this.__construct__(a, c)
}, Mountains = function (a) {
    var c = this;
    this.canvas = a;
    this.context = null;
    this.particles = [];
    this.anchors = [];
    this.tween = this.rightRightOfSelected =
        this.leftLeftOfSelected = this.rightOfSelected = this.leftOfSelected = this.selected = null;
    this.__construct__ = function () {
        SNBRD.IE && 9 > SNBRD.IE || (c.scale = 1, window.devicePixelRatio ? c.scale = window.devicePixelRatio : window.matchMedia && window.matchMedia("(-moz-device-pixel-ratio: 2.0)").matches && (c.scale = 2), c.canvas.width = c.canvas.clientWidth * c.scale, c.canvas.height = c.canvas.clientHeight * c.scale, c.context = c.canvas.getContext("2d"), c.createParticles(c.canvas.clientWidth, 100), c.y = c.canvas.clientHeight)
    };
    this.createParticles =
        function (a, c) {
            for (var g = 0; g < c; g++) {
                var l = new MountainPoint(g * (a / (c - 1)), 30);
                if (0 == g || g == c - 1)l.anchor = !0;
                l.id = "id" + g;
                l.index = g;
                0 < g && (l.previous = this.particles[g - 1], l.previous.next = l);
                this.particles.push(l)
            }
        };
    this.registerAnchor = function (a) {
        var a = a - c.x, f = c.getTarget(a);
        if (0 < c.anchors.length) {
            var g = c.anchors[c.anchors.length - 1];
            c.anchors.push(c.getTarget(g.x + (a - g.x) / 4));
            c.anchors[c.anchors.length - 1].anchorIndex = c.anchors.length - 1;
            c.context.arc(c.anchors[c.anchors.length - 1].x, 2, 2, 0, 2 * Math.PI);
            c.anchors.push(c.getTarget(g.x +
                (a - g.x) / 2));
            c.anchors[c.anchors.length - 1].anchorIndex = c.anchors.length - 1;
            c.context.arc(c.anchors[c.anchors.length - 1].x, 2, 2, 0, 2 * Math.PI);
            c.anchors.push(c.getTarget(g.x + 3 * (a - g.x) / 4));
            c.anchors[c.anchors.length - 1].anchorIndex = c.anchors.length - 1;
            c.context.arc(c.anchors[c.anchors.length - 1].x, 2, 2, 0, 2 * Math.PI)
        }
        c.anchors.push(f);
        c.anchors[c.anchors.length - 1].anchorIndex = c.anchors.length - 1
    };
    this.setSelected = function (a, f) {
        c.selected = c.setTarget(a - c.x, 12, f);
        c.leftOfSelected = c.anchors[c.selected.anchorIndex -
            1];
        c.setTarget(c.leftOfSelected.x, 5, f);
        c.rightOfSelected = c.anchors[c.selected.anchorIndex + 1];
        c.setTarget(c.rightOfSelected.x, 5, f);
        c.leftLeftOfSelected = c.anchors[c.selected.anchorIndex - 2];
        c.setTarget(c.leftLeftOfSelected.x, 2, f);
        c.rightRightOfSelected = c.anchors[c.selected.anchorIndex + 2];
        c.setTarget(c.rightRightOfSelected.x, 2, f);
        (c.selected == c.hovered || !c.hovered) && c.clearHover(f);
        c.layoutPoints(f);
        f || c.draw(c.context)
    };
    this.clearSelected = function (a) {
        c.selected = null;
        c.leftOfSelected = null;
        c.rightOfSelected =
            null;
        c.leftLeftOfSelected = null;
        c.rightRightOfSelected = null;
        c.clearHover(a)
    };
    this.clearAnchor = function (a) {
        a != c.particles[0] && a != c.particles[c.particles.length - 1] && (a.anchor = !1)
    };
    this.setHover = function (a) {
        c.clearHover(!0);
        var a = a - c.x, f = c.getTarget(a), g = 8;
        c.selected || (g = 9);
        c.selected != f && (c.hovered = c.setTarget(a, g, !0), c.setTarget(c.anchors[c.hovered.anchorIndex - 1].x, 2 * g / 3, !0), c.setTarget(c.anchors[c.hovered.anchorIndex + 1].x, 2 * g / 3, !0), c.setTarget(c.anchors[c.hovered.anchorIndex - 2].x, g / 3, !0), c.setTarget(c.anchors[c.hovered.anchorIndex +
            2].x, g / 3, !0));
        c.pullInnerAnchors();
        c.layoutPoints(!0);
        c.tween && c.tween.stop();
        var l = {value:0};
        c.tween = new Tween(l, 500, {value:1, ease:Ease.easeInOut.circ, onUpdate:function () {
            for (var a = 0; a < c.particles.length; a++) {
                var d = c.particles[a];
                d.y = d.previousY + (d.nextY - d.previousY) * l.value
            }
            c.draw(c.context)
        }})
    };
    this.clearHover = function (a) {
        for (var f = 0; f < c.anchors.length; f++) {
            var g = c.anchors[f];
            g != c.selected && (g != c.leftOfSelected && g != c.rightOfSelected && g != c.leftLeftOfSelected && g != c.rightRightOfSelected) && c.clearAnchor(g)
        }
        c.hovered =
            null;
        c.layoutPoints(a);
        if (a) {
            c.tween && c.tween.stop();
            var l = {value:0};
            c.tween = new Tween(l, 250, {value:1, delay:250, ease:Ease.easeInOut.cubic, onUpdate:function () {
                for (var a = 0; a < c.particles.length; a++) {
                    var d = c.particles[a];
                    d.y = d.previousY + (d.nextY - d.previousY) * l.value
                }
                c.draw(c.context)
            }})
        } else c.draw(c.context)
    };
    this.getTarget = function (a) {
        a = Math.round(a / c.canvas.clientWidth * (c.particles.length - 1));
        a = Math.min(a, c.particles.length - 1);
        a = Math.max(a, 0);
        return c.particles[a]
    };
    this.setTarget = function (a, f, g) {
        f =
            c.y - f;
        a = c.getTarget(a);
        a.anchor = !0;
        g ? (a.nextY = f, a.previousY = a.y) : (a.y = f, a.nextY = f, a.previousY = f);
        return a
    };
    this.pullInnerAnchors = function () {
        if (c.hovered && c.selected) {
            var a, f;
            c.hovered.anchorIndex < c.selected.anchorIndex ? (a = c.hovered, f = c.selected) : (a = c.selected, f = c.hovered);
            for (a = a.anchorIndex + 1; a < f.anchorIndex; a++)c.anchors[a].anchor = !0, c.anchors[a].nextY = Math.min(c.y - 3, c.anchors[a].nextY)
        }
    };
    this.layoutPoints = function (a) {
        for (var f = 0; f < c.particles.length; f++) {
            var g = c.particles[f];
            if (!g.anchor) {
                for (var l =
                    g.previous; !l.anchor;)l = l.previous;
                for (var k = g.next; !k.anchor;)k = k.next;
                a ? (g.nextY = l.nextY + (k.nextY - l.nextY) * (g.index - l.index) / (k.index - l.index), g.nextY += Math.min(g.index - l.index, k.index - g.index), g.previousY = g.y) : (g.y = l.y + (k.y - l.y) * (g.index - l.index) / (k.index - l.index), g.y += Math.min(g.index - l.index, k.index - g.index), g.previousY = g.y, g.nextY = g.y)
            }
            g.previousY = g.y
        }
    };
    this.draw = function (a) {
        a.clearRect(0, 0, c.canvas.clientWidth * c.scale, c.canvas.clientHeight * c.scale);
        a.fillStyle = "#77cdec";
        a.strokeStyle = "#77cdec";
        a.beginPath();
        var f = c.particles[0];
        for (a.moveTo(f.x * c.scale, (f.y + f.getDisplacement()) * c.scale); f.next;) {
            var g = (f.x + f.next.x) / 2 * c.scale, l = (f.y + f.getDisplacement() + f.next.y + f.next.getDisplacement()) / 2, l = l * c.scale;
            a.quadraticCurveTo(f.x * c.scale, f.y * c.scale, g, l);
            f = f.next
        }
        a.lineTo(f.x * c.scale, 30 * c.scale);
        a.lineTo(this.particles[0].x * c.scale, 30 * c.scale);
        a.fill();
        a.stroke();
        a.closePath()
    };
    this.__construct__()
}, TopNav = function (a) {
    var c = this;
    this.html = a;
    this.mountains = null;
    this.__construct__ = function () {
        if (!(SNBRD.IE &&
            9 > SNBRD.IE)) {
            c.mountains = new Mountains(document.getElementById("nav-mountains"));
            c.mountains.x = c.mountains.canvas.offsetLeft - c.html.offsetLeft;
            var a = c.html.getElementsByTagName("a");
            c.mountains.registerAnchor(c.mountains.x);
            c.mountains.registerAnchor(a[0].offsetLeft + a[0].clientWidth / 2);
            for (var f = 1; f < a.length; f++)c.mountains.registerAnchor(a[f].offsetLeft + a[f].clientWidth / 2), a[f].onmouseover = c.linkOver, a[f].onmouseout = c.linkOut;
            c.mountains.registerAnchor(c.mountains.canvas.clientWidth)
        }
    };
    this.setSelected =
        function (a, f) {
            if (!(SNBRD.IE && 9 > SNBRD.IE)) {
                for (var g = c.html.getElementsByTagName("a"), l = !1, k = 0; k < g.length; k++)g[k].innerHTML == a ? (l = !0, g[k].className = "selected", c.mountains && c.mountains.setSelected(g[k].offsetLeft + g[k].clientWidth / 2, f)) : g[k].className = "";
                l || c.mountains.clearSelected(f)
            }
        };
    this.linkOver = function () {
        c.mountains.setHover(this.offsetLeft + this.clientWidth / 2);
        return!1
    };
    this.linkOut = function () {
        c.mountains.clearHover(!0);
        return!1
    };
    this.__construct__()
}, StatusGraph = function (a, c, d, f, g, l) {
    var k = this;
    this.canvas = a; //инициализация полотна
    this.primaryColor = c; // основной цвет
    this.secondaryColor = d; // второй цвет
    this.subtotal = f; // итого в этом секторе
    this.total = g; // всего
    this.delay = l; // задержка анимации
    this.subtotalDisplay = this.context = null;
    this.__construct__ = function () {
        for (var a = k.canvas; a.nextSibling;) if (a = a.nextSibling, "open-number" == a.className) {
            k.subtotalDisplay = a;
            k.subtotalDisplay.innerHTML = "00";
            break
        }
        k.canvas.parentNode.parentNode.id += "-scripted";
        var c = 1;
        window.devicePixelRatio ? c = window.devicePixelRatio : window.matchMedia && window.matchMedia("(-moz-device-pixel-ratio: 2.0)").matches && (c = 2);
        k.canvas.width = 177 * c;
        k.canvas.height = 177 * c;
        k.context = k.canvas.getContext("2d");
        k.context.beginPath();
        k.context.lineWidth = 7 * c;
        k.context.strokeStyle = k.secondaryColor;
        k.context.arc(177 * c / 2, 177 * c / 2, 177 * c / 2 - 26 * c, 0, 2 * Math.PI);
        k.context.stroke();
        k.context.closePath();
        var f = {value:0};
        new Tween(f, 1E3, {value:1, delay:k.delay, ease:Ease.easeInOut.cubic, onUpdate:function () {
            k.context.clearRect(0, 0, 177 * c, 177 * c);
            k.context.beginPath();
            k.context.lineWidth = 18 * c;
            k.context.strokeStyle = k.primaryColor;
            k.context.arc(177 *
                c / 2, 177 * c / 2, 177 * c / 2 - 9 * c, -Math.PI / 2, 2 * f.value * Math.PI * (k.subtotal / k.total) - Math.PI / 2);
            k.context.stroke();
            k.context.closePath();
            k.context.beginPath();
            k.context.lineWidth = 7 * c;
            k.context.strokeStyle = k.secondaryColor;
            k.context.arc(177 * c / 2, 177 * c / 2, 177 * c / 2 - 26 * c, 0, 2 * Math.PI);
            k.context.stroke();
            k.context.closePath();
            if (k.subtotalDisplay) {
                var a = Math.round(k.subtotal * f.value);
                k.subtotalDisplay.innerHTML = 10 > a ? "0" + a : a
            }
        }})
    };
    this.__construct__()
}, MiniStatusGraph = function (a, c, d, f, g, l) {
    var k = this;
    this.canvas = a;
    this.primaryColor =
        c;
    this.secondaryColor = d;
    this.subtotal = f;
    this.total = g;
    this.delay = l;
    this.subtotalDisplay = this.tween = this.context = null;
    this.__construct__ = function () {
        k.setup()
    };
    this.setup = function () {
        for (var a = k.canvas; a.nextSibling;)if (a = a.nextSibling, "open-number" == a.className) {
            k.subtotalDisplay = a;
            k.subtotalDisplay.innerHTML = "00";
            break
        }
        k.canvas.parentNode.parentNode.id += "-scripted";
        a = 1;
        window.devicePixelRatio ? a = window.devicePixelRatio : window.matchMedia && window.matchMedia("(-moz-device-pixel-ratio: 2.0)").matches && (a =
            2);
        k.canvas.width = 90 * a;
        k.canvas.height = 90 * a;
        k.context = k.canvas.getContext("2d");
        k.context.beginPath();
        k.context.lineWidth = 3 * a;
        k.context.strokeStyle = k.secondaryColor;
        k.context.arc(90 * a / 2, 90 * a / 2, 90 * a / 2 - 14.5 * a, 0, 2 * Math.PI);
        k.context.stroke();
        k.context.closePath()
    };
    this.update = function (a, c, f) {
        k.canvas = a;
        k.subtotal = c;
        k.total = f;
        k.setup()
    };
    this.animate = function () {
        k.subtotalDisplay && (k.subtotalDisplay.innerHTML = "00");
        var a = 1;
        window.devicePixelRatio ? a = window.devicePixelRatio : window.matchMedia && window.matchMedia("(-moz-device-pixel-ratio: 2.0)").matches &&
            (a = 2);
        k.context.clearRect(0, 0, 90 * a, 90 * a);
        k.context.beginPath();
        k.context.lineWidth = 3 * a;
        k.context.strokeStyle = k.secondaryColor;
        k.context.arc(90 * a / 2, 90 * a / 2, 90 * a / 2 - 14.5 * a, 0, 2 * Math.PI);
        k.context.stroke();
        k.context.closePath();
        k.tween && k.tween.stop();
        var c = {value:0};
        k.tween = new Tween(c, 1E3, {value:1, delay:k.delay, ease:Ease.easeInOut.cubic, onUpdate:function () {
            k.context.clearRect(0, 0, 90 * a, 90 * a);
            k.context.beginPath();
            k.context.lineWidth = 9 * a;
            k.context.strokeStyle = k.primaryColor;
            k.context.arc(90 * a / 2, 90 * a / 2,
                90 * a / 2 - 4.5 * a, -Math.PI / 2, 2 * c.value * Math.PI * (k.subtotal / k.total) - Math.PI / 2);
            k.context.stroke();
            k.context.closePath();
            k.context.beginPath();
            k.context.lineWidth = 3 * a;
            k.context.strokeStyle = k.secondaryColor;
            k.context.arc(90 * a / 2, 90 * a / 2, 90 * a / 2 - 14.5 * a, 0, 2 * Math.PI);
            k.context.stroke();
            k.context.closePath();
            if (k.subtotalDisplay) {
                var f = Math.round(k.subtotal * c.value);
                k.subtotalDisplay.innerHTML = 10 > f ? "0" + f : f
            }
        }})
    };
    this.__construct__()
}, SearchInput = function (a, c) {
    var d = this;
    this.input = a;
    this.form = c;
    this.formSerializer;
    this.initialValue;
    this.init = function () {
        this.input.setAttribute("id", this.input.getAttribute("id") + "-scripted");
        this.form.setAttribute("id", this.form.getAttribute("id") + "-scripted");
        this.formSerializer = new FormSerializer(this.form);
        this.initialValue = this.input.value;
        this.input.onfocus = this.focusHandler;
        this.input.onblur = this.blurHandler;
        this.input.onkeydown = this.searchKeyDownHandler
    };
    this.focus = function () {
        this.input.value == this.initialValue && (this.input.value = "")
    };
    this.blur = function () {
        /^\s*$/.test(this.input.value) &&
        (this.input.value = this.initialValue)
    };
    this.onResponse = function (a) {
        SNBRD.ajax = null;
        window.history.pushState(null, d.form.getAttribute("action"), d.form.getAttribute("action"));
        a.modal ? (SNBRD.activityIndicator.decrementActivity(), new Modal(a.modal, d.dismissPath, document.title), document.title = a.title) : (document.title = a.title, new PageTransition(a.content, a.sidebar))
    };
    this.onFailure = function () {
        SNBRD.ajax = null;
        SNBRD.activityIndicator.decrementActivity()
    };
    this.searchKeyDown = function (a) {
        if (13 == a.keyCode)return a =
        {path:this.form.getAttribute("action"), method:"POST", params:this.formSerializer.getParamString(), onComplete:this.onResponse, onFailure:this.onFailure}, SNBRD.ajax && SNBRD.ajax.abort(), SNBRD.ajax = new Ajax(a), this.input.blur(), SNBRD.activityIndicator.incrementActivity(), !1
    };
    this.focusHandler = this.focus.bind(this);
    this.blurHandler = this.blur.bind(this);
    this.searchKeyDownHandler = this.searchKeyDown.bind(this)
}, ScrollHandler = function () {
    var a = this;
    this.nav = null;
    this.borderThreshhold = 1;
    this.__construct__ = function () {
        window.onscroll =
            a.onScroll;
        SNBRD.isMobile && (window.addEventListener("gesturechange", a.onScroll, !1), window.addEventListener("touchmove", a.onScroll, !1));
        window.onhashchange = a.onHashChange;
        a.nav = document.getElementById("nav");
        window.location.hash && (a.hashed = !0);
        this.borderThreshhold = document.getElementById("content").getElementsByTagName("div")[0].getElementsByTagName("div")[0].clientHeight
    };
    this.updateThreshhold = function (c) {
        if (c)this.borderThreshhold = 0; else for (var c = document.getElementById("content").children, d = 0; d <
            c.length; d++)if ("main-column transition-in-end" == c[d].className && this.borderThreshhold != c[d].children[0].clientHeight) {
            this.borderThreshhold = c[d].children[0].clientHeight;
            break
        }
        a.onScroll()
    };
    this.isScrolledPastThreshhold = function () {
        return window.pageYOffset >= a.borderThreshhold
    };
    this.onScroll = function () {
        a.hashed && window.pageYOffset && (a.hashed = !1, window.scroll(0, window.pageYOffset - 76));
        a.nav.className = Math.max(window.pageYOffset, 0) >= a.borderThreshhold ? "scrolled" : ""
    };
    this.onHashChange = function () {
        window.scroll(0,
            window.pageYOffset - 76)
    };
    this.__construct__()
}, PageTransition = function (a, c) {
    var d = this;
    this.newContent;
    this.oldContent;
    this.spacer;
    this.fader;
    this.tween;
    this.timeout;
    this.newSidebarContent;
    this.loaded = 0;
    this.__construct__ = function (a, c) {
        this.sidebarHTML = c;
        this.contentHTML = a;
        SNBRD.transition && (SNBRD.transition.tween && SNBRD.transition.tween.stop(), SNBRD.transition.img && (SNBRD.transition.img.onload = function () {
        }), SNBRD.transition.completeTransition());
        GlobalEvents.dispatch(new GlobalEvent(PageTransition.TRANSITION_START));
        SNBRD.transition = this;
        var l = document.createElement("div");
        l.innerHTML = a;
        var k = document.getElementById("content").getElementsByTagName("div")[0];
        this.newContent = l = l.getElementsByTagName("div")[0];
        var h = document.createElement("div");
        h.appendChild(document.createElement("div"));
        h.className = "main-column transition-element spacer";
        h.style.height = k.clientHeight + "px";
        var n = document.createElement("div");
        n.appendChild(document.createElement("div"));
        n.className = "main-column transition-element fader";
        n.style.height =
            k.clientHeight + "px";
        n.children[0].style.width = window.innerWidth + "px";
        n.children[0].style.height = k.clientHeight + "px";
        k.parentNode.insertBefore(l, k.nextSibling);
        k.parentNode.insertBefore(h, k);
        SNBRD.isMobile || k.parentNode.insertBefore(n, l);
        for (var r = l.getElementsByTagName("script"), p = 0; p < r.length; p++)eval(r[p].innerHTML);
        r = l.getElementsByTagName("a");
        for (p = 0; p < r.length; p++)new SnowbirdLink(r[p], window.location.pathname);
        h.style.zIndex = 5;
        n.style.zIndex = 15;
        n.style.position = "absolute";
        this.setElementTransform(l,
            "translate3d(0,0,0)");
        this.newContent = l;
        this.oldContent = k;
        this.spacer = h;
        this.fader = n;
        this.newContent.className = "main-column transition-in-start";
        this.oldContent.className = "main-column transition-out-start";
        k = SNBRD.getElementsByClassName("masthead-photo-content", "div", l);
        k.length ? (k = k[0], l = k.getAttribute("data-img"), h = k.getAttribute("data-img-retina"), this.img = new Image, this.img.width = k.getAttribute("data-width"), this.img.height = k.getAttribute("data-height"), this.img.src = SNBRD.isRetina ? h : l, this.img.onload =
            function () {
                d.executeTransition()
            }, k.appendChild(this.img)) : this.executeTransition()
    };
    this.executeTransition = function () {
        d.timeout = setTimeout(function () {
            d.setElementTransform(d.newContent, "translate3d(" + (-window.innerWidth / 2 - 169) + "px,0,0)");
            setTimeout(d.startTransition, 0)
        }, 500)
    };
    this.replaceSidebar = function () {
        for (var a = document.getElementById("sidebar-ajax-content"); a.firstChild;)a.removeChild(a.firstChild);
        var c = document.createElement("div");
        c.innerHTML = this.sidebarHTML;
        a.appendChild(c);
        for (var d =
            a.getElementsByTagName("script"), c = 0; c < d.length; c++)eval(d[c].innerHTML);
        a = a.getElementsByTagName("a");
        for (c = 0; c < a.length; c++)new SnowbirdLink(a[c], window.location.pathname);
        SNBRD.onDomReady()
    };
    this.startTransition = function () {
        d.spacer.style.height = d.oldContent.clientHeight + "px";
        d.fader.style.height = d.oldContent.clientHeight + "px";
        var a = 0;
        window.location.hash && (a = document.getElementById(window.location.hash.replace("#", "")).offsetTop);
        if (window.pageYOffset == a)d.slideIn(); else {
            var c = {pageYOffset:window.pageYOffset};
            d.tween = new Tween(c, 300, {pageYOffset:a, ease:Ease.easeOut.sine, onComplete:d.slideIn, onUpdate:function () {
                window.scrollTo(0, c.pageYOffset)
            }})
        }
    };
    this.slideIn = function () {
        d.newContent.className = "main-column transition-in-end";
        d.oldContent.className = "main-column transition-out-end";
        d.fader.className += " animation-end";
        d.setElementTransform(d.newContent, "translate3d(0px,0,0)");
        d.spacer.style.height = d.newContent.clientHeight + "px";
        if (d.oldContent.offsetHeight > d.newContent.offsetHeight) {
            var a = SNBRD.getWindowSize(),
                c = document.getElementById("footer");
            d.newContent.clientHeight + c.clientHeight + 75 < a.height && (d.oldContent.style.height = d.newContent.offsetHeight + "px", d.oldContent.style.overflow = "hidden")
        }
        d.setElementTransform(d.oldContent, "translate3d(0,0,0) perspective(2500) rotate3d(0,1,0," + (d.oldContent.clientHeight * (1 / 153.333) - 60.5) + "deg)");
        d.timeout = setTimeout(d.completeTransition, 600);
        d.replaceSidebar();
        SNBRD.padContent()
    };
    this.completeTransition = function () {
        SNBRD.activityIndicator.decrementActivity();
        window.clearTimeout(d.timeout);
        d.newContent.className = "main-column";
        d.newContent.removeAttribute("style");
        d.spacer.parentElement.removeChild(d.spacer);
        SNBRD.isMobile || d.fader.parentElement.removeChild(d.fader);
        d.oldContent.parentElement.removeChild(d.oldContent);
        GlobalEvents.dispatch(new GlobalEvent(PageTransition.TRANSITION_COMPLETE));
        SNBRD.transition = null
    };
    this.setElementTransform = function (a, c) {
        a.style.webkitTransform = c;
        a.style.MozTransform = c;
        a.style.oTransform = c;
        a.style.transform = c
    };
    this.setElementTransformOrigin = function (a, c) {
        a.style.webkitTransformOrigin = c;
        a.style.MozTransformOrigin = c;
        a.style.oTransformOrigin = c;
        a.style.transformOrigin = c
    };
    this.__construct__(a, c)
};
PageTransition.TRANSITION_START = "global_event_transition_start";
PageTransition.TRANSITION_COMPLETE = "global_event_transition_complete";
var ItemPair = function (a) {
    for (; 1 == a.children.length;)a = a.children[0];
    if ("item" != a.className) {
        var c = Math.max(a.children[0].clientHeight, a.children[1].clientHeight);
        a.children[0].style.height = c - 128 + "px";
        a.children[1].style.height = c - 128 + "px"
    }
}, MultiSelectionFilter = function (a, c, d) {
    var f = this;
    this.html = a;
    this.buttons = [];
    this.selected = [];
    this.slugs = d;
    this.dataLists = [];
    this.allButton = null;
    this.__construct__ = function (a) {
        f.html.id += "-scripted";
        var c = f.html.getElementsByTagName("span");
        a && (f.allButton = c[0]);
        for (a = 0; a < c.length; a++)f.buttons.push(c[a]), "selected" == f.buttons[a].className && f.selected.push(a), f.buttons[a].onclick = f.buttonClick;
        f.buttons.length > f.slugs.length && f.slugs.splice(0, 0, "all")
    };
    this.setSelected = function () {
    };
    this.registerDataList = function (a) {
        f.dataLists.push(a)
    };
    this.buttonClick = function () {
        if (this == f.allButton)f.selected = [0]; else {
            var a = f.buttons.indexOf(this), c = f.selected.indexOf(a);
            -1 == c ? f.allButton && -1 != f.selected.indexOf(0) ? f.selected = [a] : f.selected.push(a) : 1 < f.selected.length &&
                f.selected.splice(c, 1)
        }
        f.updateSelected();
        f.filterLists()
    };
    this.updateSelected = function () {
        for (var a = 0; a < f.buttons.length; a++)f.buttons[a].className = -1 != f.selected.indexOf(a) ? "selected" : ""
    };
    this.filterLists = function () {
        for (var a = 0; a < f.dataLists.length; a++)for (var c = f.dataLists[a], d = 0; d < c.length; d++)if ("labels" != c[d].className)if (f.allButton && -1 != f.selected.indexOf(0))c[d].className = ""; else {
            for (var h = 0, n = 0; n < f.selected.length; n++)h += parseInt(c[d].getAttribute(f.slugs[f.selected[n]]));
            c[d].className =
                h ? "" : "hidden"
        }
        SNBRD.padContent()
    };
    this.__construct__(c)
}, WeatherRefresher = function (a) {
    var c = this;
    this.holder = a;
    this.miniReport = this.interval = null;
    this.__construct__ = function () {
        SNBRD.isDesktop && (c.miniReport = new MiniReport(c.holder));
        c.interval = window.setTimeout(c.reload, 3E5)
    };
    this.ajaxComplete = function (a) {
        if (!c.miniReport || c.miniReport.canBeReplaced()) {
            c.holder.innerHTML = a;
            for (var f = c.holder.getElementsByTagName("a"), a = 0; a < f.length; a++)new SnowbirdLink(f[a]);
            f = c.holder.getElementsByTagName("script");
            for (a = 0; a < f.length; a++)eval(f[a].innerHTML);
            SNBRD.onDomReady();
            c.miniReport && c.miniReport.replace();
            c.interval = window.setTimeout(c.reload, 3E5)
        } else c.interval = window.setTimeout(c.reload, 15E3)
    };
    this.reload = function () {
        new Ajax({path:"/sidebar-mountain-report/", method:"GET", onComplete:c.ajaxComplete})
    };
    this.__construct__()
}, DatePicker = function (a, c, d) {
    var f = this;
    this.button = a;
    this.field = c;
    this.holder = d;
    this.picker = null;
    this.__construct__ = function () {
        f.button && (f.button.onclick = f.onButtonClick, f.button.parentElement.id +=
            "-scripted");
        f.field.id += "-scripted";
        f.holder && (f.holder.id += "-scripted")
    };
    this.onDateSelected = function () {
        var a = f.picker.getSelectedDates()[0];
        f.field.value = a.getMonth() + 1 + "/" + a.getDate() + "/" + a.getFullYear() % 2E3;
        f.setError(!1);
        f.holder.style.display = "none";
        document.body.onclick = null;
        document.getElementById("lodging-landing").removeAttribute("style")
    };
    this.deselect = function (a) {
        var c, d;
        c = f.holder;
        for (var h = d = 0; c && !isNaN(c.offsetLeft) && !isNaN(c.offsetTop);)d += c.offsetLeft - c.scrollLeft, h += c.offsetTop -
            c.scrollTop, c = c.offsetParent;
        c = h;
        a.clientX > d && a.clientX < d + f.holder.clientWidth && a.clientY > c && a.clientY < c + f.holder.clientHeight || (f.holder.style.display = "none", document.body.onclick = null, document.getElementById("lodging-landing").removeAttribute("style"))
    };
    this.getDate = function () {
        var a = null;
        if ("" != f.field.value) {
            var c = f.field.value.split("/");
            if (!c || 3 != c.length)c = f.field.value.split("-");
            if (3 == c.length) {
                12 < c[0] && (a = c[0], c[0] = c[1], c[1] = c[2], c[2] = a);
                var d = parseInt(c[0]) - 1, h = parseInt(c[1]), a = parseInt(c[2]);
                100 > a && (a += 2E3);
                a = new Date(a, d, h)
            }
        }
        return a
    };
    this.setError = function (a) {
        f.field.parentNode.className = a ? "input error" : "input"
    };
    this.onButtonClick = function () {
        var a = f.getDate();
        f.picker ? "none" == f.holder.style.display ? (a && (f.picker.cfg.setProperty("pagedate", a.getMonth() + 1 + "/" + a.getFullYear(), !1), f.picker.cfg.setProperty("selected", a.getMonth() + 1 + "/" + a.getDate() + "/" + a.getFullYear(), !1), f.picker.render()), f.holder.style.display = "block", setTimeout(function () {
            document.body.onclick = f.deselect
        }, 100), f.setElementTransform(document.getElementById("lodging-landing"),
            "none")) : (f.holder.style.display = "none", f.setElementTransform(document.getElementById("lodging-landing"), "")) : (f.holder.style.display = "block", f.picker = new YAHOO.widget.Calendar(f.holder), a && (f.picker.cfg.setProperty("pagedate", a.getMonth() + 1 + "/" + a.getFullYear(), !1), f.picker.cfg.setProperty("selected", a.getMonth() + 1 + "/" + a.getDate() + "/" + a.getFullYear(), !1)), f.picker.render(), f.picker.selectEvent.subscribe(f.onDateSelected), setTimeout(function () {
            document.body.onclick = f.deselect
        }, 100), f.setElementTransform(document.getElementById("lodging-landing"),
            "none"));
        return!1
    };
    this.setElementTransform = function (a, c) {
        a.style.webkitTransform = c;
        a.style.MozTransform = c;
        a.style.oTransform = c;
        a.style.transform = c
    };
    this.__construct__()
}, DropDown = function (a) {
    var c = this;
    this.list = a;
    this.selected = 0;
    this.input = null;
    this.lockedOpen = this.moved = !1;
    this.__construct__ = function () {
        c.list.onmousedown = c.onMouseDown;
        c.items = c.list.getElementsByTagName("li");
        for (var a = 0; a < c.items.length; a++)c.list.children[a].onmouseover = function () {
            /expanded/.test(this.parentNode.className) &&
            (this.className += " selected", c.itemSelect(this))
        }, c.list.children[a].onmouseout = function () {
            /expanded/.test(this.parentNode.className) && (this.className = "")
        };
        c.list.id += "-scripted"
    };
    this.setHiddenInput = function (a) {
        c.input = a;
        c.input.onchange = c.onInputChange
    };
    this.onInputChange = function () {
        c.selected = c.input.selectedIndex;
        for (var a = c.list.getElementsByTagName("li"), f = 0; f < a.length; f++)a[f].className = f == c.selected ? "selected" : ""
    };
    this.setError = function (a) {
        c.list.className = a ? "drop-down unselectable error" :
            "drop-down unselectable"
    };
    this.itemSelect = function (a) {
        for (var f = 0; f < c.items.length; f++)if (a == c.items[f]) {
            c.selected = f;
            break
        }
    };
    this.onMouseDown = function () {
        !document.onmouseup && !c.lockedOpen && (c.list.className = "drop-down unselectable expanded", c.list.style.top = -38 * c.selected + "px", document.onmouseup || (document.onmouseup = c.onMouseUp), document.onmousemove || (document.onmousemove = c.onMouseMove), document.onselectstart = function () {
            return!1
        }, c.moved = !1)
    };
    this.onMouseUp = function () {
        c.moved || c.lockedOpen ? (c.list.className =
            "drop-down unselectable", c.list.style.top = 0, c.items[c.selected].className += " selected", document.onmousedown = null, document.onmouseup = null, document.onmousemove = null, document.onselectstart = null, c.moved = !0) : document.onmousedown = c.onMouseDown;
        c.lockedOpen = !c.moved
    };
    this.onMouseMove = function () {
        c.moved = !0
    };
    this.__construct__()
}, BookingWidget = function () {
    var a = this;
    this.propertyValues = this.propertyDropDown = this.childDropDown = this.youthDropDown = this.adultDropDown = this.checkOutDatePicker = this.checkInDatePicker =
        null;
    this.__construct__ = function () {
        a.checkInDatePicker = new DatePicker(document.getElementById("check-in-date").getElementsByTagName("a")[0], document.getElementById("check-in"), document.getElementById("check-in-picker"));
        a.checkOutDatePicker = new DatePicker(document.getElementById("check-out-date").getElementsByTagName("a")[0], document.getElementById("check-out"), document.getElementById("check-out-picker"));
        a.adultDropDown = new DropDown(document.getElementById("num-adults"));
        a.youthDropDown = new DropDown(document.getElementById("num-youth"));
        a.childDropDown = new DropDown(document.getElementById("num-child"));
        a.propertyDropDown = new DropDown(document.getElementById("property-selection"));
        document.getElementById("check-rates-button").onclick = a.checkRates;
        document.getElementById("check-rates-button").id += "-scripted"
    };
    this.registerHiddenInputs = function () {
        a.adultDropDown.setHiddenInput(document.getElementById("hidden-adults"));
        a.youthDropDown.setHiddenInput(document.getElementById("hidden-youth"));
        a.childDropDown.setHiddenInput(document.getElementById("hidden-child"));
        a.propertyDropDown.setHiddenInput(document.getElementById("hidden-property"))
    };
    this.setPropertyValues = function (c) {
        a.propertyValues = c
    };
    this.checkRates = function () {
        var c = document.getElementById("rates-form"), d = a.checkInDatePicker.getDate(), f = a.checkOutDatePicker.getDate(), g = !0;
        d ? a.checkInDatePicker.setError(!1) : (g = !1, a.checkInDatePicker.setError(!0));
        f ? a.checkOutDatePicker.setError(!1) : (g = !1, a.checkOutDatePicker.setError(!0));
        a.adultDropDown.selected ? a.adultDropDown.setError(!1) : (g = !1, a.adultDropDown.setError(!0));
        if (!g)return!1;
        c.arrival.value = a.getDateString(d);
        c.departure.value = a.getDateString(f);
        c.property.value = a.propertyValues[a.propertyDropDown.selected];
        c.adults.value = a.adultDropDown.selected;
        c.youth.value = a.youthDropDown.selected;
        c.children.value = a.childDropDown.selected;
        c.group_code.value = document.getElementById("group-code").value;
        c.submit();
        return!1
    };
    this.getDateString = function (a) {
        var d = "", d = 10 > a.getMonth() + 1 ? "0" + (a.getMonth() + 1) : d + (a.getMonth() + 1), d = d + "-", d = 10 > a.getDate() ? d + ("0" + a.getDate()) : d +
            a.getDate();
        return d = d + "-" + a.getFullYear()
    };
    this.__construct__()
};
function ThumbnailSpriteData() {
    return[
        {name:"comp_00000.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:2, y:2, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00001.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:154, y:2, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00002.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:306,
            y:2, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00003.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:2, y:154, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00004.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:154, y:154, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00005.png",
            spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:306, y:154, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00006.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:2, y:306, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00007.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:154, y:306, width:150, height:150}, spriteSourceSize:{width:150,
            height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00008.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:306, y:306, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00009.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:2, y:458, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00010.png", spriteColorRect:{x:0, y:0, width:150, height:150},
            textureRect:{x:154, y:458, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00011.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:306, y:458, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00012.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:2, y:610, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00013.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:2, y:762, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00014.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:154, y:610, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00015.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:306, y:610, width:150, height:150},
            spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00016.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:154, y:762, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1},
        {name:"comp_00017.png", spriteColorRect:{x:0, y:0, width:150, height:150}, textureRect:{x:306, y:762, width:150, height:150}, spriteSourceSize:{width:150, height:150}, spriteTrimmed:!0, textureRotated:!1}
    ]
}
var MiniReport = function (a) {
    function c() {
        h.leftColumn.children[h.leftColumn.children.length - 1].style.visibility = "hidden";
        h.removeListener(h.leftColumn, c);
        h.animatingIn = !1;
        h.open = !0
    }

    function d() {
        h.middleColumn.children[h.middleColumn.children.length - 1].style.visibility = "hidden";
        h.removeListener(h.middleColumn, d);
        h.leftColumn.className = "left-column mini-report-column open";
        h.addListener(h.leftColumn, c)
    }

    function f() {
        h.rightColumn.children[h.rightColumn.children.length - 1].style.visibility = "hidden";
        h.removeListener(h.rightColumn,
            f);
        h.middleColumn.className = "middle-column mini-report-column open";
        h.addListener(h.middleColumn, d)
    }

    function g() {
        h.removeListener(h.rightColumn, g);
        h.rightColumn.className = "right-column mini-report-column";
        h.html.className = "";
        h.animatingOut = !1;
        h.open = !1;
        h.forceClosed = !1
    }

    function l() {
        h.removeListener(h.middleColumn, l);
        h.middleColumn.className = "middle-column mini-report-column";
        h.rightColumn.className = "right-column mini-report-column closing";
        h.addListener(h.rightColumn, g);
        h.rightColumn.children[h.rightColumn.children.length -
            1].style.visibility = "visible"
    }

    function k() {
        h.removeListener(h.leftColumn, k);
        h.leftColumn.className = "left-column mini-report-column";
        h.middleColumn.className = "middle-column mini-report-column closing";
        h.addListener(h.middleColumn, l);
        h.middleColumn.children[h.middleColumn.children.length - 1].style.visibility = "visible"
    }

    var h = this;
    h.html = a;
    h.open = !1;
    h.animatingIn = !1;
    h.animatingOut = !1;
    h.hoverCount = 0;
    h.hoverCountTimeout = null;
    h.showTimeout = null;
    h.forceClosed = !1;
    h.leftColumn = document.getElementById("mini-report-left-column");
    h.middleColumn = document.getElementById("mini-report-middle-column");
    h.rightColumn = document.getElementById("mini-report-right-column");
    this.__construct__ = function () {
        !(SNBRD.IE && 10 > SNBRD.IE) && !SNBRD.isMobile && (h.html.onmouseout = h.onMouseOut, h.html.onmouseover = h.onMouseOver, document.getElementById("mini-report-close").onclick = h.hide)
    };
    this.replace = function () {
        h.leftColumn = document.getElementById("mini-report-left-column");
        h.middleColumn = document.getElementById("mini-report-middle-column");
        h.rightColumn =
            document.getElementById("mini-report-right-column");
        document.getElementById("mini-report-close").onclick = h.hide
    };
    this.canBeReplaced = function () {
        return!h.open && !h.animatingIn && !h.animatingOut
    };
    this.onMouseOver = function () {
        window.clearTimeout(h.hoverCountTimeout);
        h.hoverCount = 1;
        !h.open && (!h.animatingIn && !h.forceClosed) && (h.html.className = "mini-report-open", h.showTimeout = window.setTimeout(h.show, 10))
    };
    this.onMouseOut = function () {
        window.clearTimeout(h.showTimeout);
        h.hoverCount = 0;
        h.hoverCountTimeout = window.setTimeout(h.checkHover,
            10)
    };
    this.checkHover = function () {
        0 == h.hoverCount && h.hide()
    };
    this.show = function () {
        !h.open && !h.animatingIn && !h.animatingOut ? (h.animatingIn = !0, h.rightColumn.className = "right-column mini-report-column open", h.addListener(h.rightColumn, f), SNBRD.miniLiftStatus.animate(), SNBRD.miniTrailStatus.animate()) : h.animatingOut && (h.animatingOut = !1, h.animatingIn = !0, "left-column mini-report-column closing" == h.leftColumn.className ? (h.removeListener(h.leftColumn, k), h.leftColumn.className = "left-column mini-report-column open",
            h.addListener(h.leftColumn, c)) : "middle-column mini-report-column closing" == h.middleColumn.className ? (h.removeListener(h.middleColumn, l), h.middleColumn.className = "middle-column mini-report-column open", h.addListener(h.middleColumn, d)) : "right-column mini-report-column closing" == h.rightColumn.className && (h.removeListener(h.rightColumn, g), h.rightColumn.className = "right-column mini-report-column open", h.addListener(h.rightColumn, f)))
    };
    this.hide = function (a) {
        a && (h.forceClosed = !0);
        h.open && !h.animatingIn && !h.animatingOut ? (h.open = !1, h.animatingOut = !0, h.leftColumn.className = "left-column mini-report-column closing", h.addListener(h.leftColumn, k), h.leftColumn.children[h.leftColumn.children.length - 1].style.visibility = "visible") : h.animatingIn && (h.open = !1, h.animatingIn = !1, h.animatingOut = !0, "left-column mini-report-column open" == h.leftColumn.className ? (h.removeListener(h.leftColumn, c), h.leftColumn.className = "left-column mini-report-column closing", h.addListener(h.leftColumn, k), h.leftColumn.children[h.leftColumn.children.length -
            1].style.visibility = "visible") : "middle-column mini-report-column open" == h.middleColumn.className ? (h.removeListener(h.middleColumn, d), h.middleColumn.className = "middle-column mini-report-column closing", h.addListener(h.middleColumn, l), h.middleColumn.children[h.middleColumn.children.length - 1].style.visibility = "visible") : "right-column mini-report-column open" == h.rightColumn.className && (h.removeListener(h.rightColumn, f), h.rightColumn.className = "right-column mini-report-column closing", h.addListener(h.rightColumn,
            g), h.rightColumn.children[h.rightColumn.children.length - 1].style.visibility = "visible"));
        return!1
    };
    this.addListener = function (a, c) {
        a.addEventListener("webkitTransitionEnd", c, !0);
        a.addEventListener("msTransitionEnd", c, !0);
        a.addEventListener("transitionend", c, !0);
        a.addEventListener("otransitionend", c, !0)
    };
    this.removeListener = function (a, c) {
        a.removeEventListener("webkitTransitionEnd", c, !0);
        a.removeEventListener("msTransitionEnd", c, !0);
        a.removeEventListener("transitionend", c, !0);
        a.removeEventListener("otransitionend",
            c, !0)
    };
    this.__construct__()
};
