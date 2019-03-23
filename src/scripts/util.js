var _dragTransfer = null;

function isChrome() {
  var isChromium = window.chrome,
      winNav = window.navigator,
      vendorName = winNav.vendor,
      isOpera = winNav.userAgent.indexOf("OPR") > -1,
      isIEedge = winNav.userAgent.indexOf("Edge") > -1,
      isIOSChrome = winNav.userAgent.match("CriOS");

  if(isIOSChrome){
     // is Google Chrome on IOS
     return true;
  } else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
     // is Google Chrome
     return true;
  } else {
     // not Google Chrome
     return false;
  }
}

String.prototype.formatTime = function(cull) {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) {
    hours = "0"+hours;
    if (cull) {
      if (cull >= 2) {
        hours = hours;
        if (!hours) {
          hours = "";
        }
        else {
          hours = hours + ":";
        }
      }
      else {
        hours = "";
      }
    }
    else {
      hours = hours + ":";
    }
  }
  if (minutes < 10) {
    minutes = "0"+minutes;
    if (cull) {
      if (cull >= 1) {
        minutes = minutes;
        if (!minutes) {
          minutes = "";
        }
        else {
          minutes = minutes + ":";
        }
      }
      else {
        minutes = "";
      }
    }
    else {
      minutes = minutes + ":";
    }
  }
  else {
    minutes = minutes + ":";
  }
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+minutes+seconds;
}

String.prototype.valid = function() {
  if (this.length <= 0 || this.trim().length <= 0) {
    return;
  }
  return this.trim();
}

String.prototype.remove = function(valueToRemove) {
  if (!this.valid()) {
    return this.valid();
  }
  var arr = JSON.parse("[" + this + "]");

  for (var index in arr) {
    if (arr[index] == valueToRemove) {
      arr.splice(index, 1);
    }
  }
  return arr.toString();
}

String.prototype.push = function(value) {
  var arr;
  if (!this.valid()) {
    arr = [];
  }
  else {
    arr = JSON.parse("[" + this + "]");
  }
  arr.push(value);

  return arr.toString();
}

String.prototype.valid = function () {
  if (this.length <= 0 || this.trim().length <= 0) {
    return;
  }
  return this.trim();
}

var util = {};
util.lerp = function(start, end, amt){
  return (1-amt)*start+amt*end;
}

util.insert = function(array, index, value) {
  var spliced = [];
  for (var i=array.length-1; i>=index; i--) {
    spliced.push(array[i]);
    array.splice(i, 1);
  }
  array.push(value);
  for (var i=spliced.length-1; i>=0; i--) {
    array.push(spliced[i]);
  }
  return index;
}

util.contains = function(array, value) {
  for (var index in array) {
    if (array[index] == value) {
      return true;
    }
  }
  return false;
}

util.find = function(array, value) {
  for (var index in array) {
    if (array[index] == value) {
      return index;
    }
  }
  return false;
}

util.swap = function(array, index, newIndex) {
  var temp = array[index];
  array[index] = array[newIndex];
  array[newIndex] = temp;
}

util.remove = function(array, value) {
  for (var index in array) {
    if (array[index] == value) {
      return array.splice(index, 1);
    }
  }
}

util.hslToRgb = function(h, s, l){
  var r, g, b;

  if (s == 0){
    r = g = b = l; // achromatic
  }
  else{
    var hue2rgb = function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

util.HSL_RGB = function(h, s, l, a){
  var r, g, b;

  if (s == 0){
    r = g = b = l; // achromatic
  }
  else{
    var hue2rgb = function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a || 1];
}

util.RGB_HSL = function (r, g, b, a){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
    h = s = 0; // achromatic
  }
  else{
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l, a || 1];
}


util.HEX_TEXT = function(hexx){
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

util.RGB_HEX = function(rgb){
  rgb = (rgb || "#000000").match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  var res = (rgb && rgb.length === 4) ? "" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  return parseInt(res, 16);
}

util.RGB_ALPHA = function(rgb){
  if (rgb == "transparent") {
    rgb = "rgba(0,0,0,0)";
  }
  rgb = (rgb || "rgba(0,0,0,0)").match(/(\(.*)\)/i);
  if (rgb && rgb[1].split(",").length == 4) {
    return Number(rgb[1].split(",")[3]);
  }
  return 1;
}

var _offset = 0;
function dateCorrected(padding) {
  // padding in milliseconds;
  var amt = Number(Date.now()-Math.floor(_offset));
  if (padding)
    return amt + Number(padding);
  return amt;
}

function getCookies() {
  var pairs = document.cookie.split(";");
  var cookies = {};
  for (var i=0; i<pairs.length; i++){
    var pair = pairs[i].split("=");
    cookies[pair[0]] = unescape(pair[1]);
  }
  return cookies;
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  exdays = (exdays || 1);
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function easeNumber(obj, expected, speed, callback) {
  var points = expected;
  var amt = Number(obj.text());
  if (points != amt) {
    var diff = points-amt;
    var s = Math.sign(diff);

    diff = Math.abs(diff);

    if (diff < 50) {
      amt = amt + s * 1;
    }
    else if (diff/100 > 1) {
      for (var i = 0; i<Math.floor(Math.log10(diff)); i++) {
        amt = amt + s * Math.pow(speed, i);
      }
    }
    else {
      amt = amt + s * 5;
    }
    obj.text(amt);
    setTimeout(function(){easeNumber(obj, expected, speed, callback)}, 20);
    return;
  }
  else {
    if (callback) {
      callback();
    }
  }
  obj.text(points);
}

function duplicate(obj) {
  if (!obj) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

function merge(source, object, override) {
  for (var key in object) {
    if (object[key] instanceof Object) {
      if (source[key] instanceof Object) {
        merge(source[key], object[key], override);
      }
      else {
        if (override) {
          source[key] = object[key];
        }
        else {
          if (source[key] == null) {
            source[key] = object[key];
          }
        }
      }
    }
    else {
      if (override) {
        source[key] = object[key];
      }
      else {
        if (source[key] == null) {
          source[key] = object[key];
        }
      }
    }
  }
}

function combine(source, object) {
  for (var key in object) {
    if (object[key] instanceof Object) {
      if (source[key] instanceof Object) {
        if (Array.isArray(source[key])) {
          if (!Array.isArray(object[key])) {
            for (var index in object[key]) {
              combine(source[key][index], object[key][index]);
            }
          }
          else {
            source[key].concat(object[key]);
          }
        }
        else {
          combine(source[key], object[key]);
        }
      }
      else {
        if (source[key] == null) {
          source[key] = object[key];
        }
      }
    }
    else {
      source[key] = object[key];
    }
  }
}

function purge(str) {
  // clean from html injection
  var mrClean = /(<[^>]*>)/igm;
  var ex = mrClean.exec(str);
  while (ex) {
    str = str.replace(ex[1], "|#%#|"+ex[1].substring(1,ex[1].length-1)+"|#$#|");
    ex = mrClean.exec(str);
  }
  return str;
}

function unpurge(str) {
  // clean from html injection
  /*var mrClean = /(\|#%#\|([^`]]*)|#$#\|)/igm;
  var ex = mrClean.exec(str);
  while (ex) {
    if (ex[2] != "script") {
      str = str.replace(ex[1], "<"+ex[1].substring(1,ex[1].length-1)+">");
    }
    ex = mrClean.exec(str);
  }*/
  return replaceAll(replaceAll((str || "") ,"|#$#|", ">"), "|#%#|", "<");
}

function hasSecurity(userID, priv, obj) {
  if (game.players && game.players.data && !(game.config && game.config.data.offline)) {
    var players = game.players.data;
    if (!players[userID]) {
      players = game.config.data.players || {};
    }
    if (players[userID]) {
      if (priv != null && obj && obj["_s"] && (obj["_s"][userID] && obj["_s"][userID] <= game.templates.security.object[priv])) {
        return true;
      }
      if (priv != null && players[userID].rank <= game.templates.security.player[priv]) {
        return true;
      }
      if (obj && obj["_s"] && obj["_s"].default && obj["_s"].default != 0) {
        if (obj["_s"].default == 1) {
          return true;
        }
        var result = sync.eval(obj["_s"].default, sync.defaultContext());
        if (priv != null) {
          if (result && (result <= game.templates.security.object[priv]) || result <= game.templates.security.player[priv]) {
            return true;
          }
        }
        else if (result) {
          return true;
        }
      }
    }
  }
  else {
    return true;
  }
  return false;
}

function mergeName(ent, userID) {
  if (game.players) {
    var pData = game.players.data[userID];
    var name = pData.displayName;
    if (ent && hasSecurity(userID, "Rights", ent.data)) {
      name = sync.rawVal(ent.data.info.name) + "("+name+")";
    }
    return name;
  }
  return "";
}


function getPlayerCharacter(userID) {
  var userID = userID || getCookie("UserID");
  var pData = game.players.data[userID];
  if (pData && pData.entity && game.entities.data[pData.entity]) {
    return game.entities.data[pData.entity];
  }
  return {};
}

function getPlayerCharacterID(userID) {
  var userID = userID || getCookie("UserID");
  var pData = game.players.data[userID];
  return pData.entity;
}

function getPlayerCharacterName(userID) {
  var userID = userID || getCookie("UserID");
  var pData = game.players.data[userID];
  var name = "";
  if (pData && pData.entity && game.entities.data[pData.entity]) {
    name = sync.rawVal(game.entities.data[pData.entity].data.info.name);
  }
  return name || "";
}

function getPlayerName(userID) {
  var userID = userID || getCookie("UserID");
  var pData = game.players.data[userID];
  if (pData) {
    var name = pData.displayName;
    return name || "";
  }
  return "";
}

function getEnt(id) {
  // does all the comparisons to determine the origin of the entity
  if (id instanceof Object) {
    id = id[0];
  }
  if (id != null) {
    if (isNaN(id) && id.match("_") && id[0] != "_") {
      if (game.locals["storage"].data.s[id]) {
        return game.locals["storage"].data.s[id];
      }
      else {
        var split = id.split("_");
        // this is a cloud entity by the user
        if (split[0] == getCookie("UserID")) {
          for (var j in game.entities.data) {
            var sEnt = game.entities.data[j];
            if (sEnt.data._uid == split[1] && sEnt.data._c == getCookie("UserID")) {
              return game.entities.data[j];
            }
          }
          return game.locals["storage"].data.s[split[1]];
        }
        else {
          if (game.locals["storage"].data.s[id]) {
            return game.locals["storage"].data.s[id];
          }
          else {
            var placeholder = sync.obj(id);
            placeholder.data = {};

            function getAsset(id) {
              $.ajax({
                url: '/retrieveAsset?id='+id,
                error: function(code) {
                  console.log(code);
                },
                dataType: 'json',
                success: function(data) {
                  game.locals["storage"].data.s[id] = placeholder;
                  var storageData = game.locals["storage"].data;
                  var reg = /"_t"[ ]*:[ ]*"([\w]*)"/;
                  var match = data.data.match(reg);
                  if (match[1]) {
                    placeholder.update(JSON.parse(data.data));
                  }
                  game.locals["storage"].data.s[id] = placeholder;
                },
                type: 'GET'
              });
            }
            getAsset(id);
            return placeholder;
          }
        }
      }
    }
    else {
      return game.entities.data[id];
    }
  }
  return;
}

util.dockReveal = function(overlay) {
  if (overlay.attr("docked")) {
    var max = util.getMaxZ(".ui-popout");
    overlay.css("z-index", max+1);
    overlay.css("transition", "left 0.1s, top 0.1s, opacity 0.1s");
    if (overlay.attr("fadeHide")) {
      overlay.css("opacity", 1);
    }
    if (overlay.attr("docked") == "left") {
      overlay.css("left", 0);
    }
    else if (overlay.attr("docked") == "right") {
      overlay.css("left", $(window).width() - overlay.width());
    }
    else if (overlay.attr("docked") == "top") {
      overlay.css("top", 0);
    }
    else if (overlay.attr("docked") == "bottom") {
      overlay.css("top", $(window).height() - overlay.height());
    }
    if (overlay.attr("fadeHide")) {
      overlay.css("opacity", "1");
    }
  }
  else {
    overlay.css("transition", "opacity 0.1s");
  }
}

util.dockHide = function(overlay) {
  if (overlay.attr("docked") && !overlay.is(":hover")) {
    overlay.css("z-index", overlay.attr("docked-z"));
    overlay.css("transition", "left 0.1s, top 0.1s, opacity 0.1s");
    if (overlay.attr("docked") == "left") {
      overlay.css("left", -1 * overlay.width() + 20);
    }
    else if (overlay.attr("docked") == "right") {
      overlay.css("left", $(window).width() - 20);
    }
    else if (overlay.attr("docked") == "top") {
      overlay.css("top", -1 * overlay.height() + 20);
    }
    else if (overlay.attr("docked") == "bottom") {
      overlay.css("top", $(window).height() - 20);
    }
    if (overlay.attr("fadeHide")) {
      overlay.css("opacity", "0");
    }
  }
  else {
    overlay.css("transition", "opacity 0.1s");
  }
}

util.getMaxZ = function(selector){
  return Math.max.apply(null, $(selector).map(function(){
      var z;
      return isNaN(z = parseInt($(this).css("z-index"), 10)) ? 0 : z;
  }));
};

util.getMinZ = function(selector){
  return Math.min.apply(null, $(selector).map(function(){
      var z;
      return isNaN(z = parseInt($(this).css("z-index"), 10)) ? 0 : z;
  }));
};


// yea w.e its ugly, I didnt feel like thinking of my own solution.
// TY stack overflow
util.intersect = function(x1,y1,x2,y2, x3,y3,x4,y4) {
  var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
  var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
  if (isNaN(x)||isNaN(y)) {
      return false;
  } else {
      if (x1>=x2) {
          if (!(x2<=x&&x<=x1)) {return false;}
      } else {
          if (!(x1<=x&&x<=x2)) {return false;}
      }
      if (y1>=y2) {
          if (!(y2<=y&&y<=y1)) {return false;}
      } else {
          if (!(y1<=y&&y<=y2)) {return false;}
      }
      if (x3>=x4) {
          if (!(x4<=x&&x<=x3)) {return false;}
      } else {
          if (!(x3<=x&&x<=x4)) {return false;}
      }
      if (y3>=y4) {
          if (!(y4<=y&&y<=y3)) {return false;}
      } else {
          if (!(y3<=y&&y<=y4)) {return false;}
      }
  }
  return true;
}

util.sortPointO = function(x1, y1, x2, y2, ox, oy) {
  if (x1 - ox >= 0 && x2 - ox < 0)
      return true;
  if (x1 - ox < 0 && x2 - ox >= 0)
      return false;
  if (x1 - ox == 0 && x2 - ox == 0) {
      if (y1 - oy >= 0 || y2 - oy >= 0)
          return y1 > y2;
      return y2 > y1;
  }

  // compute the cross product of vectors (center -> a) x (center -> b)
  var det = (x1 - ox) * (y2 - oy) - (x2 - ox) * (y1 - oy);
  if (det < 0)
      return true;
  if (det > 0)
      return false;

  // points a and b are on the same line from the center
  // check which point is closer to the center
  var d1 = (x1 - ox) * (x1 - ox) + (y1 - oy) * (y1 - oy);
  var d2 = (x2 - ox) * (x2 - ox) + (y2 - oy) * (y2 - oy);
  return d1 > d2;
}

util.intersectRay = function(x1,x2,y1,y2, x,y,r_dx,r_dy) {
  var s_dx = x2-x1;
  var s_dy = y2-y1;

  var s_px = x1;
  var s_py = y1;

  var r_px = x;
  var r_py = y;

  var t2 = (r_dx*(s_py-r_py) + r_dy*(r_px-s_px))/(s_dx*r_dy - s_dy*r_dx);
  // Plug the value of T2 to get T1
  var t1 = (s_px+s_dx*t2-r_px)/r_dx;
  if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
    return [s_px + s_dx * t2, s_py + s_dy * t2, t1, t2];
    // collision
  }
  return null;
}


util.intersectBox = function(x1,y1,x2,y2, x,y,w,h) {
  if (util.intersect(x1,y1,x2,y2, x, y, x + w, y)) {
    return true;
  }
  else if (util.intersect(x1,y1,x2,y2, x, y, x, y + h)) {
    return true;
  }
  else if (util.intersect(x1,y1,x2,y2, x + w, y, x + w, y + h)) {
    return true;
  }
  else if (util.intersect(x1,y1,x2,y2, x, y + h, x + w, y + h)) {
    return true;
  }
  return false;
}

util.intersectLine = function(x1,y1,x2,y2, x3,y3,x4,y4) {
  var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
  var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
  if (isNaN(x)||isNaN(y)) {
    return false;
  } else {
    if (x1>=x2) {
        if (!(x2<=x&&x<=x1)) {return false;}
    } else {
        if (!(x1<=x&&x<=x2)) {return false;}
    }
    if (y1>=y2) {
        if (!(y2<=y&&y<=y1)) {return false;}
    } else {
        if (!(y1<=y&&y<=y2)) {return false;}
    }
    if (x3>=x4) {
        if (!(x4<=x&&x<=x3)) {return false;}
    } else {
        if (!(x3<=x&&x<=x4)) {return false;}
    }
    if (y3>=y4) {
        if (!(y4<=y&&y<=y3)) {return false;}
    } else {
        if (!(y3<=y&&y<=y4)) {return false;}
    }
  }
  return true;
}

util.target = function(index){
  $(".application[ui-name='ui_board']").each(function(){
    var app = $(this);
    var board = getEnt(app.attr("index"));
    for (var lid in board.data.layers) {
      var layerData = board.data.layers[lid];
      for (var pInd in layerData.p) {
        var pieceData = layerData.p[pInd];
        if (pieceData.eID == index) {
          if (pieceData.x != null && pieceData.y != null) {
            boardApi.scrollTo(app, pieceData.x + pieceData.w/2, pieceData.y + pieceData.h/2);
          }
          var pieceWrap = boardApi.lookup(lid, "p", pInd, app);
          pieceWrap.select();
        }
      }
    }
  });
}

util.untarget = function(index){
  if (boardApi.selections) {
    for (var i in boardApi.selections) {
      boardApi.selections[i].selected.visible = false;
      delete boardApi.selections[i];
      // scroll to?
    }
  }
}

util.getTargets = function(noSelected) {
  var targetList = []; //list of IDs
  $(".card-selected").each(function(){
    var index = $(this).attr("index");
    if (index && ($(this).is(":visible") || layout.mobile)) {
      var ent = getEnt(index);
      if (ent && ent.data._t == "c") {
        if (!util.contains(targetList, index)) {
          targetList.push(index);
        }
      }
    }
  });
  if (!noSelected) {
    for (var i in boardApi.selections) {
      var selectData = boardApi.selections[i];
      var board = getEnt(selectData.board);
      if (board && board.data && selectData.type == "p" && board.data.layers[selectData.layer]) {
        var pieceData = board.data.layers[selectData.layer][selectData.type][selectData.index];
        if (pieceData && pieceData.eID && getEnt(pieceData.eID).data) {
          targetList.push(pieceData.eID);
        }
      }
    }
  }

  return targetList;
}

util.dist = function(x1, x2, y1, y2){
  return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

util.windowBound = function(overlay) {
  // keep within screen boundries
  var x = overlay.offset().left;
  var y = overlay.offset().top;
  if (x+overlay.outerWidth() > $(window).outerWidth()) {
    x = x - ((x+overlay.outerWidth())-$(window).outerWidth());
  }
  if (x < 0) {
    x = 0;
  }
  if (y+overlay.outerHeight() > $(window).outerHeight()) {
    y = y - ((y+overlay.outerHeight())-$(window).outerHeight());
  }
  if (y < 0) {
    y = 0;
  }
  overlay.css("left", x);
  overlay.css("top", y);
}

util.unSelectTargets = function(noSelected) {
  $(".card-selected").removeClass(".card-selected");
  if (!noSelected) {
    for (var uid in boardApi.selections) {
      if ($("#"+uid).is(":visible")) {
        // loop through
        for (var lid in boardApi.selections[uid]) {
          var piece = boardApi.selections[uid][lid];
          if (piece && piece.data && piece.data.board != null) {
            $(".board-"+piece.data.board).each(function(){
              boardApi.unselect($(this), lid);
            });
          }
        }
      }
    }
  }
}


// works out tags, and their effects, as well as calcdata
util.resolveCalc = function(calcList, ctx) {
  var result;
  if (Array.isArray(calcList)) {
    result = [];
    for (var calcID in calcList) {
      var calcData = duplicate(calcList[calcID]);
      if (calcData.cond == null || sync.eval(calcData.cond, ctx)) {
        delete calcData.cond;
        calcData.eq = sync.eval(calcData.eq, ctx);
        if (calcData.target.substring(0, Math.min(calcData.target.length, 4)) == "tags") {
          // apply/remove tag effects
          if (calcData.eq) {
            calcData.eq = 1;
            var val = calcData.target.split(".");
            if (val.length > 0 && val[1]) {
              val = val[1];
              // apply tag effects
              if (game.templates.tags[val]) {
                var effects = game.templates.tags[val].calc;
                // resolve effect
                for (var eid in effects) {
                  if (!effects[eid].cond || sync.eval(effects[eid].cond, ctx)) {
                    result.push({target : effects[eid].target, eq : sync.eval(effects[eid].eq, ctx), hide : true});
                  }
                }
              }
            }
          }
          else {
            // remove the tag
            calcData.eq = 0;
            var val = calcData.target.split(".");
            if (val.length > 0 && val[1]) {
              val = val[1];
              // apply tag effects
              if (game.templates.tags[val]) {
                var effects = game.templates.tags[val].calc;
                // resolve effect
                for (var eid in effects) {
                  if (effects[eid].target.match(".modifiers")) {
                    result.push({target : effects[eid].target, eq : ""});
                  }
                }
              }
            }
          }
        }
        result.push(calcData);
      }
    }
  }
  else if (calcData) {
    var calcData = duplicate(calcList);
    if (calcData.cond == null || sync.eval(calcData.cond, ctx)) {
      delete calcData.cond;
      calcData.eq = sync.eval(calcData.eq, ctx);
    }
    return calcData;
  }
  return result;
}

util.injectContext = function(str, ctx, options) {
  var final = "";
  var vMatch = variableRegex.exec(str);
  // save localVaribles
  var cmps = /([\/><\!\~\=])/;
  var context = sync.context(str, ctx, true);
  for (var key in options) {
    context.context[key] = sync.newValue(null, options[key]);
  }
  while (vMatch) {
    if (vMatch[2] && vMatch[4] && vMatch[4][0] == "=") {
      var stack = [0];
      for (var i=1; i<vMatch[4].length; i++) {
        if (vMatch[4][i] == "=" && !((vMatch[4][i-1] || "").match(cmps) || (vMatch[4][i+1] || "").match(cmps))) {
          stack.push(i);
        }
        else if (vMatch[4][i] == ";") {
          stack.pop();
          if (stack.length == 0) {
            stack = i+1; // record the successful index
            break;
          }
        }
      }
    }
    if (!(stack instanceof Object)) {
      var newStr = vMatch[1]+(vMatch[2] || "");
      if (context.context[vMatch[2]]) {
        newStr += "="+sync.val(context.context[vMatch[2]])+";"
      }
      else {
        newStr += vMatch[4].substring(0, stack);
      }
      final += newStr;
      vMatch[0] = (vMatch[1] || "") +(vMatch[2] || "") + (vMatch[3] || "") + vMatch[4].substring(0, stack);
    }
    str = str.replace(vMatch[0], "");
    vMatch = variableRegex.exec(str);
  }
  for (var i in context.context) {
    if (!final.match(i)) {
      final += "$"+i+"="+sync.val(context.context[i])+";";
    }
  }
  final += context.str;
  return final;
}

util.slideshow = function(media, title) {
  var applied = false;
  $(".application[ui-name='ui_display']").each(function(){
    if (!applied && $(this).attr("tabKey") != null) {
      applied = true;
      game.state.data.tabs[$(this).attr("tabKey")].data = game.state.data.tabs[$(this).attr("tabKey")].data || {};
      game.locals["imgHistory"] = game.locals["imgHistory"] || sync.obj();
      game.locals["imgHistory"].data = game.locals["imgHistory"].data || []
      var imgHistory = game.locals["imgHistory"].data;
      if (game.state.data.tabs[$(this).attr("tabKey")].data.media) {
        if (!util.contains(imgHistory, game.state.data.tabs[$(this).attr("tabKey")].data.media)) {
          imgHistory.push(game.state.data.tabs[$(this).attr("tabKey")].data.media);
        }
        else {
          var push;
          for (var i in imgHistory) {
            if (imgHistory[i] == game.state.data.tabs[$(this).attr("tabKey")].data.media) {
              push = imgHistory.splice(i, 1);
              break;
            }
          }
          imgHistory.push(game.state.data.tabs[$(this).attr("tabKey")].data.media);
        }
      }
      game.locals["imgHistory"].update();
      game.state.data.tabs[$(this).attr("tabKey")].data.media = media;
      game.state.sync("updateState");
    }
  });
  if (!applied) {
    if ($(".application[ui-name='ui_displayTabs']").length) {
      game.state.data.tabs.push({name : title || "Narrative Display", data : {media : media}});
      game.state.sync("updateState");
    }
    else {
      sendAlert({text : "No valid viewports"});
    }
  }
}

util.matchYoutube = function(link) {
  if (link && (link.match("youtu.be") || link.match("www.youtube.com"))) {
    var reg = /(v=)([^&]*)/;
    var reg1 = /[^\/]*([^&^?\/]*)$/;
    var time = /[^?]*t=([^&^?]*)$/;
    var list = /[^?]*list=([^&^?]*)$/;
    var index = /[^?]*index=([^&^?]*)$/;
    var returnData = {};
    var res = reg.exec(link);
    if (res) {
      returnData.video = res[2];
    }
    else {
      var res = reg1.exec(link);
      if (res) {
        returnData.video = res[0].split("?")[0];
      }
    }
    var timeReg = time.exec(link);
    if (timeReg) {
      returnData.time = timeReg[1];
    }
    /*var listReg = list.exec(video.val());
    console.log(listReg);
    if (listReg) {
      returnData.list = listReg[1];
    }
    returnData.list = "LFgquLnL59ak-4CpDgS6u0eXKtz_VgGfX";
    var indexReg = index.exec(video.val());
    console.log(indexReg);
    if (indexReg) {
      returnData.index = indexReg[1];
    }
    console.log(returnData);*/
    return returnData;
  }
  return false;
}

util.shareYoutube = function(link) {
  var matchYoutube = util.matchYoutube(link);
  if (matchYoutube && hasSecurity(getCookie("UserID"), "Assistant Master")) {
    runCommand("media", {cmd : "update", data : matchYoutube});
  }
}

util.art = {
  Tokens : [
    {src : "/content/bluesword/tokens/human.png"},
    {src : "/content/bluesword/tokens/abo.png"},
    {src : "/content/bluesword/tokens/abo_blue.png"},
    {src : "/content/bluesword/tokens/abo_demon.png"},
    {src : "/content/bluesword/tokens/abo_orange.png"},
    {src : "/content/bluesword/tokens/abomonination_green.png"},
    {src : "/content/bluesword/tokens/abomonination_red.png"},
    {src : "/content/bluesword/tokens/black_monster.png"},
    {src : "/content/bluesword/tokens/black_monster_demon.png"},
    {src : "/content/bluesword/tokens/blue_monster.png"},
    {src : "/content/bluesword/tokens/cyan_monster.png"},
    {src : "/content/bluesword/tokens/bop.png"},
    {src : "/content/bluesword/tokens/bop_demon.png"},
    {src : "/content/bluesword/tokens/hawk.png"},
    {src : "/content/bluesword/tokens/bug.png"},
    {src : "/content/bluesword/tokens/bug_cyan.png"},
    {src : "/content/bluesword/tokens/bug_green.png"},
    {src : "/content/bluesword/tokens/bug_pink.png"},
    {src : "/content/bluesword/tokens/bug_green.png"},
    {src : "/content/bluesword/tokens/bug_red.png"},
    {src : "/content/bluesword/tokens/bug_large_blue.png"},
    {src : "/content/bluesword/tokens/bug_large_cyan.png"},
    {src : "/content/bluesword/tokens/bug_large_green.png"},
    {src : "/content/bluesword/tokens/bug_large_pink.png"},
    {src : "/content/bluesword/tokens/bug_large_red.png"},
    {src : "/content/bluesword/tokens/caveinsert_cyan.png"},
    {src : "/content/bluesword/tokens/caveinsert_green.png"},
    {src : "/content/bluesword/tokens/caveinsert_pink.png"},
    {src : "/content/bluesword/tokens/caveinsert_red.png"},
    {src : "/content/bluesword/tokens/darkdragon.png"},
    {src : "/content/bluesword/tokens/demondragon.png"},
    {src : "/content/bluesword/tokens/emeralddragon.png"},
    {src : "/content/bluesword/tokens/flamedragon.png"},
    {src : "/content/bluesword/tokens/magmadragon.png"},
    {src : "/content/bluesword/tokens/saphiredragon.png"},
    {src : "/content/bluesword/tokens/stonedragon.png"},
    {src : "/content/bluesword/tokens/stonedragon_wyrm.png"},
    {src : "/content/bluesword/tokens/red_tribal_monster.png"},
    {src : "/content/bluesword/tokens/green_tribal_monster.png"},
    {src : "/content/bluesword/tokens/freybug.png"},
    {src : "/content/bluesword/tokens/freybug_fire.png"},
    {src : "/content/bluesword/tokens/freybugdemon.png"},
    {src : "/content/bluesword/tokens/freybugdemon_fire.png"},
    {src : "/content/bluesword/tokens/freybugspirit.png"},
    {src : "/content/bluesword/tokens/freybugspirit_fire.png"},
    {src : "/content/bluesword/tokens/frostgiant.png"},
    {src : "/content/bluesword/tokens/crystalgiant.png"},
    {src : "/content/bluesword/tokens/gemstonegiant.png"},
    {src : "/content/bluesword/tokens/frostyeti.png"},
    {src : "/content/bluesword/tokens/demonyeti.png"},
    {src : "/content/bluesword/tokens/mountaingoat.png"},
    {src : "/content/bluesword/tokens/worm_insert.png"},
    {src : "/content/bluesword/tokens/worm_insect_blue.png"},
    {src : "/content/bluesword/tokens/worm_insect_cyan.png"},
    {src : "/content/bluesword/tokens/worm_insect_green.png"},
    {src : "/content/bluesword/tokens/worm_insect_pink.png"},
    {src : "/content/bluesword/tokens/worm_insect_red.png"},
    {src : "/content/bluesword/tokens/lizard.png"},
    {src : "/content/bluesword/tokens/lizard2.png"},
    {src : "/content/bluesword/tokens/snake.png"},
    {src : "/content/bluesword/tokens/snake2.png"},
    {src : "/content/bluesword/tokens/scorpion.png"},
    {src : "/content/bluesword/tokens/scorpion2.png"},
    {src : "/content/bluesword/tokens/scorpion3.png"},
  ],
  Nouns : [
    {src : "/content/nouns/skull.png"},
    {src : "/content/nouns/demon.png"},
    {src : "/content/nouns/flag.png"},
    {src : "/content/nouns/house.png"},
    {src : "/content/nouns/castletower.png"},
    {src : "/content/nouns/gas.png"},
    {src : "/content/nouns/angel.png"},
    {src : "/content/nouns/chalice.png"},
    {src : "/content/nouns/cross.png"},
    {src : "/content/nouns/church.png"},
    {src : "/content/nouns/vatican.png"},
    {src : "/content/nouns/castle.png"},
    {src : "/content/nouns/pentagram.png"},
    {src : "/content/nouns/bank.png"},
    {src : "/content/nouns/library.png"},
    {src : "/content/nouns/bridge.png"},
    {src : "/content/nouns/factory.png"},
    {src : "/content/nouns/arch.png"},
    {src : "/content/nouns/obilisk.png"},
    {src : "/content/nouns/minecart.png"},
    {src : "/content/nouns/minecart_empty.png"},
    {src : "/content/nouns/track_paw.png"},
    {src : "/content/nouns/crate.png"},
    {src : "/content/nouns/gravestone.png"},
    {src : "/content/nouns/fire.png"},
    {src : "/content/nouns/leaf.png"},
    {src : "/content/nouns/rain.png"},
    {src : "/content/nouns/snow.png"},
    {src : "/content/nouns/thunder.png"},
    {src : "/content/nouns/d20.png"},
    {src : "/content/nouns/diamond.png"},
    {src : "/content/nouns/spacefighter1.png"},
    {src : "/content/nouns/spacefighter2.png"},
    {src : "/content/nouns/spacefighter3.png"},
    {src : "/content/nouns/squaretarget.png"},
    {src : "/content/nouns/jetfighter.png"},
    {src : "/content/nouns/jail.png"},
    {src : "/content/nouns/compass.png"},
    {src : "/content/nouns/tank.png"},
    {src : "/content/nouns/bike.png"},
    {src : "/content/nouns/boat.png"},
    {src : "/content/nouns/truck.png"},
    {src : "/content/nouns/flame.png"},
    {src : "/content/nouns/target.png"},
    {src : "/content/nouns/tree.png"},
    {src : "/content/nouns/conifer.png"},
    {src : "/content/nouns/satelite.png"},
    {src : "/content/nouns/car.png"},
    {src : "/content/nouns/jeep.png"},
    {src : "/content/nouns/plane.png"},
    {src : "/content/nouns/mountain.png"},
    {src : "/content/nouns/palm.png"},
    {src : "/content/nouns/port.png"},
    {src : "/content/nouns/island.png"},
    {src : "/content/nouns/clue.png"},
    {src : "/content/nouns/globe.png"},
    {src : "/content/nouns/bullseye.png"},
    {src : "/content/nouns/radar.png"},
    {src : "/content/nouns/turbine.png"},
    {src : "/content/nouns/drill.png"},
    {src : "/content/nouns/canister.png"},
    {src : "/content/nouns/paw.png"},
    {src : "/content/nouns/claw.png"},
    {src : "/content/nouns/coffin.png"},
    {src : "/content/nouns/pirate.png"},
  ],
  Effects : [
    {src : "/content/effects/skull.png"},
    {src : "/content/effects/cripple.png"},
    {src : "/content/effects/dazed.png"},
    {src : "/content/effects/flame.png"},
    {src : "/content/effects/bullseye.png"},
    {src : "/content/effects/flag.png"},
    {src : "/content/effects/pill.png"},
    {src : "/content/effects/power.png"},
    {src : "/content/effects/silence.png"},
    {src : "/content/effects/snare.png"},
    {src : "/content/effects/snow.png"},
    {src : "/content/effects/strength.png"},
    {src : "/content/effects/target.png"},
  ],
  Icons : [
    "Amulet1000p.png",
    "Anvil1000p.png",
    "Arrows1000p.png",
    "Axe1000p.png",
    "Backpack1000p.png",
    "BanditArmor1000p.png",
    "BattleAxe1000p.png",
    "Battlehammer1000p.png",
    "BeltPouch1000p.png",
    "blankchar.png",
    "Book1000p.png",
    "Bow1000p.png",
    "Bracelet1000p.png",
    "Chainmail1000p.png",
    "Chest1000p.png",
    "Cloak1000p.png",
    "Club1000p.png",
    "CommonClothes1000p.png",
    "Crossbow1000p.png",
    "Crowbar1000p.png",
    "Glaive1000p.png",
    "GrapplingHook1000p.png",
    "Halberd1000p.png",
    "Hammer1000p.png",
    "Key1000p.png",
    "Knife1000p.png",
    "Lance1000p.png",
    "Mace1000p.png",
    "MaceRounded1000p.png",
    "Maul1000p.png",
    "MedKit1000p.png",
    "PictureFrame1000p.png",
    "PlateMail1000p.png",
    "Pouch1000p.png",
    "QuarterStaff1000p.png",
    "Rapier1000p.png",
    "Ring1000p.png",
    "Robes1000p.png",
    "rpot_L1000p.png",
    "rpot_M1000p.png",
    "rpot_S1000p.png",
    "Scalemail1000p.png",
    "Scimitar1000p.png",
    "Scroll1000p.png",
    "Shield1000p.png",
    "ShieldOutline1000p.png",
    "Slingshot1000p.png",
    "Spear1000p.png",
    "SpikedClub1000p.png",
    "spot_L1000p.png",
    "spot_M1000p.png",
    "spot_S1000p.png",
    "Staff1000p.png",
    "Sword1000p.png",
    "Tent1000p.png",
    "Toolbox1000p.png",
    "Warhammer1000p.png",
  ],
  "Sci-fi" : [
    {src : "/content/peter/basement.png"},
    {src : "/content/peter/controlroom.png"},
    {src : "/content/peter/dockingbay.png"},
  ],
  "Area" : [
    {src : "/content/bluesword/island_cottage_gridless.jpg"},
    {src : "/content/bluesword/pyramid_gridless.jpg"},
    {src : "/content/bluesword/red_gridless_camp.jpg"},
    {src : "/content/bluesword/ash.png"},
    {src : "/content/bluesword/dirt.png"},
    {src : "/content/bluesword/grass.png"},
    {src : "/content/bluesword/plains.png"},
    {src : "/content/bluesword/snow.png"}
  ],
  "Dungeons" : [
    {src : "/content/etc/122abyssalengine-grid.jpg"},
    {src : "/content/etc/jinxedsapphire-grid.jpg"},
    {src : "/content/etc/sirhaggardscrypt-dm-grid.jpg"},
  ],
  "Worldmaps" : [
    {src : "/content/worldmap_full.jpg"}
  ]

};

util.mediaType = function(src) {
  var types = ["img", "video", "audio"];
  if (src) {
    if (util.matchYoutube(src)) {
      return util.matchYoutube(src);
    }
    for (var i in types) {
      var type = types[i];
      for (var j in assetTypes[type].files) {
        if (src.split(".").pop() == assetTypes[type].files[j]) {
          return type;
        }
      }
    }
    return src.split(".").pop();
  }
}

util.buildActions = function(roll) {
  var defContext = sync.defaultContext();
  var pChar = getPlayerCharacter(getCookie("UserID"));
  if (pChar && pChar.data) {
    defContext[pChar.data._t] = duplicate(pChar.data);
  }
  function buildActions(list) {
    var actionList;
    if (list) {
      actionList = [];
    }
    for (var i in list) {
      if (list[i].uCond == null || sync.eval(list[i].uCond, defContext)) {
        var fn;
        if (list[i].cCond == null || sync.eval(list[i].cCond, defContext)) {
          fn = function(ev, ui) {
            var targets = util.getTargets();
            if (!targets.length && pChar && pChar.data) {
              targets.push(pChar.id());
              sendAlert({text : "Targeting yourself"});
            }
            if (targets.length) {
              var targetData = {};
              var effID = ui.attr("index");
              var ctx = sync.defaultContext();
              if (roll) {
                ctx["pool"] = duplicate(roll.eventData.pool);
                ctx["loc"] = duplicate(roll.eventData.loc);
                ctx["var"] = duplicate(roll.eventData.var);
                delete ctx.location;
              }
              for (var i in targets) {
                var index = targets[i];
                var ent = getEnt(targets[i]);
                if (list[effID].cond == null || sync.eval(list[effID].cond, ctx)) {
                  ctx[ent.data._t] = duplicate(ent.data);
                  targetData[index] = util.resolveCalc(list[effID].calc, ctx);
                }
                else {
                  sendAlert({text : sync.rawVal(ent.data.info.name) + " is not eligible"});
                }
              }
              runCommand("applyCheck", {flavor : sync.eval((list[effID].msg || "0"), ctx), color : "rgb(235,235,228)", effects : targetData});
              util.unSelectTargets();
            }
            else {
              sendAlert({text : "Target a character by ctrl + clicking them or selecting their token"});
            }
            _dragTransfer = null;
          }
        }
        actionList.push({
          name : list[i].name,
          attr : {index : i},
          submenu : buildActions(list[i].submenu),
          click : fn
        });
      }
    }
    return actionList;
  }
  return buildActions(game.templates.effects) || [];
}

util.pages = {
  "White" : {},
  "Grey Parchement" : {
    "background-image": "url('/content/sheet1.png')",
    "background-size": "100% auto"
  },
  "Faded Parchment" : {
    "background-image": "url('/content/sheet2.png')",
    "background-size": "100% auto"
  },
  "Lively Parchment" : {
    "background-image": "url('/content/sheet3.png')",
    "background-size": "100% auto",
  },
}

util.processEvent = function(equation, overMessage, href, ic, whisper, eID){
  layout.coverlay("select-entity");
  var ctx = sync.defaultContext();
  if (ic) {
    var ent = getPlayerCharacter(getCookie("UserID"));
    if (ent && ent.data) {
      ctx[ent.data._t] = duplicate(ent.data);
    }
  }
  var eqs = equation.split("/r");
  var eqReg = /(~[^;]*~)? *(&[^;]*&)? *(%[^%]*%)? *(.+)/i;
  for (var i in eqs) {
    var match = eqReg.exec(eqs[i].trim());
    if (match) {
      var msg = match[1];
      if (msg) {
        msg = msg.substring(1, msg.length-1);
      }
      var ui = match[2];
      if (ui) {
        ui = ui.substring(1, ui.length-1);
      }
      var varTableStr = match[3];
      var varTable;
      if (varTableStr) {
        varTableStr = varTableStr.substring(1, varTableStr.length-1).split(";");
        varTable = {};
        var varMatchReg = /(\w*)=(.*)/
        for (var key in varTableStr) {
          var varMatch = varTableStr[key].match(varMatchReg);
          if (varMatch) {
            if (isNaN(varMatch[2])) {
              varTable[varMatch[1]] = varMatch[2];
            }
            else {
              varTable[varMatch[1]] = Number(varMatch[2]);
            }
          }
        }
      }
      var str = match[4];
      var evData = {
        icon : (ic!=null)?(href):(null),
        flavor : sync.eval(msg || overMessage || "@me.name+' rolled'", ctx),
        person : ic,
        eID : (ic!=null)?(eID || getPlayerCharacterID()):(eID),
        p : whisper,
        eventData : sync.executeQuery(str, ctx),
        color : game.players.data[getCookie("UserID")].color,
      }
      evData.eventData.var = varTable;
      evData.eventData.ui = ui;
      runCommand("chatEvent", evData);
    }
  }
}

var _lastChat = [];
var _lastIndex;

util.chatEvent = function(textInput, chatType, permissions, parentUI, href, ic, eID) {
  layout.coverlay("select-entity");
  var textArray = [textInput];
  for (var i in textArray) {
    var text = textArray[i];
    _lastChat.push(text);
    _lastIndex = null;
    if (text.length) {
      if (text.match("http") && text.match("http").index == 0) {
        if (!util.matchYoutube(text)) {
          ui_processLink(text, function(link, newLink, exists){
            runCommand("reaction", newLink);
          });
        }
        else {
          runCommand("reaction", text);
        }
      }
      else if (text.match("/r") && text.match("/r").index == 0) {
        var val = text.replace("/r", "").trim();

        util.processEvent(val, chatType, href, (ic != null)?(chatType):(null));
      }
      else if (text.match("/w") && text.match("/w").index == 0) {
        var content = $("<div>");
        content.addClass("flexcolumn");
        content.append("<b>Send Message To...</b>");
        content.css("width", parentUI.width());

        var playerList = $("<div>").appendTo(content);
        playerList.addClass("flexcolumn lrpadding outline subtitle");

        for (var i in game.players.data) {
          var button = $("<button>").appendTo(playerList);
          if (hasSecurity(i, "Assistant Master") || _whisperTargets[i]) {
            button.addClass("highlight alttext");
            _whisperTargets[i] = true;
          }
          button.attr("index", i);
          button.append(game.players.data[i].displayName);
          button.click(function(){
            if ($(this).hasClass("highlight")) {
              $(this).removeClass("highlight alttext");
              delete _whisperTargets[$(this).attr("index")];
            }
            else {
              $(this).addClass("highlight alttext");
              _whisperTargets[$(this).attr("index")] = true;
            }
          });
        }

        var whisper = $("<button>").appendTo(content);
        whisper.append("Send Whisper");
        whisper.click(function(){
          _whisperTargets[getCookie("UserID")] = true;
          var chatData = {
            text : text,
            person : chatType,
            eID : (ic!=null)?(eID || getPlayerCharacterID()):(eID),
            p : _whisperTargets,
            icon : href,
            color : game.players.data[getCookie("UserID")].color
          };
          runCommand("chatEvent", chatData);
          layout.coverlay("whisper-helper");
        });

        var pop = ui_popOut({
          target : parentUI,
          id : "whisper-helper",
        }, content);
        content.append("<div style='font-size:0.8em' class='flexmiddle'><i>Press Enter/Click to Send Message</i></div>");
        whisper.focus();
      }
      else {
        var chatData = {
          text : text,
          person : chatType,
          eID : (ic!=null)?(eID || getPlayerCharacterID()):(eID),
          icon : href,
          color : game.players.data[getCookie("UserID")].color
        };
        runCommand("chatEvent", chatData);
      }
    }
  }
}

util.hotIcons = {
  "ui_actions" : "warning-sign",
  "ui_roll" : "registration-mark",
  "ui_fullRoller" : "registration-mark",
  "ui_displayManager" : "modal-window",
  "ui_display" : "eye-open",
  "ui_board" : "globe",
  "ui_gameCtrl" : "wrench",
  "ui_boardListener" : "picture",
  "ui_homebrew" : "edit",
  "ui_textBox" : "list",
  "ui_boxes" : "inbox",
  "ui_planner" : "book",
  "ui_contentList" : "unchecked",
  "ui_pageList" : "duplicate",
  "ui_editPage" : "file",
  "ui_pdf" : "folder-open",
  "ui_assetManager" : "tasks",
  "ui_assetOrganizer" : "list-alt",
  "ui_characterList" : "user",
  "ui_combatManager" : "fire",
  "ui_library" : "envelope",
  "ui_fileBrowser" : "inbox",
  "ui_resourcePage" : "asterisk",
};

util.decks = {
  "Standard" : [
    {src : "/content/cards/cardclubs2.png"},
    {src : "/content/cards/carddiamonds2.png"},
    {src : "/content/cards/cardhearts2.png"},
    {src : "/content/cards/cardspades2.png"},

    {src : "/content/cards/cardclubs3.png"},
    {src : "/content/cards/carddiamonds3.png"},
    {src : "/content/cards/cardhearts3.png"},
    {src : "/content/cards/cardspades3.png"},

    {src : "/content/cards/cardclubs4.png"},
    {src : "/content/cards/carddiamonds4.png"},
    {src : "/content/cards/cardhearts4.png"},
    {src : "/content/cards/cardspades4.png"},

    {src : "/content/cards/cardclubs5.png"},
    {src : "/content/cards/carddiamonds5.png"},
    {src : "/content/cards/cardhearts5.png"},
    {src : "/content/cards/cardspades5.png"},

    {src : "/content/cards/cardclubs6.png"},
    {src : "/content/cards/carddiamonds6.png"},
    {src : "/content/cards/cardhearts6.png"},
    {src : "/content/cards/cardspades6.png"},

    {src : "/content/cards/cardclubs7.png"},
    {src : "/content/cards/carddiamonds7.png"},
    {src : "/content/cards/cardhearts7.png"},
    {src : "/content/cards/cardspades7.png"},

    {src : "/content/cards/cardclubs8.png"},
    {src : "/content/cards/carddiamonds8.png"},
    {src : "/content/cards/cardhearts8.png"},
    {src : "/content/cards/cardspades8.png"},

    {src : "/content/cards/cardclubs9.png"},
    {src : "/content/cards/carddiamonds9.png"},
    {src : "/content/cards/cardhearts9.png"},
    {src : "/content/cards/cardspades9.png"},

    {src : "/content/cards/cardclubs10.png"},
    {src : "/content/cards/carddiamonds10.png"},
    {src : "/content/cards/cardhearts10.png"},
    {src : "/content/cards/cardspades10.png"},

    {src : "/content/cards/cardclubsj.png"},
    {src : "/content/cards/carddiamondsj.png"},
    {src : "/content/cards/cardheartsj.png"},
    {src : "/content/cards/cardspadesj.png"},

    {src : "/content/cards/cardclubsq.png"},
    {src : "/content/cards/carddiamondsq.png"},
    {src : "/content/cards/cardheartsq.png"},
    {src : "/content/cards/cardspadesq.png"},

    {src : "/content/cards/cardclubsk.png"},
    {src : "/content/cards/carddiamondsk.png"},
    {src : "/content/cards/cardheartsk.png"},
    {src : "/content/cards/cardspadesk.png"},

    {src : "/content/cards/cardclubsa.png"},
    {src : "/content/cards/carddiamondsa.png"},
    {src : "/content/cards/cardheartsa.png"},
    {src : "/content/cards/cardspadesa.png"},
  ],
  "Jokers" : [
    {src : "/content/cards/cardclubs2.png"},
    {src : "/content/cards/carddiamonds2.png"},
    {src : "/content/cards/cardhearts2.png"},
    {src : "/content/cards/cardspades2.png"},

    {src : "/content/cards/cardclubs3.png"},
    {src : "/content/cards/carddiamonds3.png"},
    {src : "/content/cards/cardhearts3.png"},
    {src : "/content/cards/cardspades3.png"},

    {src : "/content/cards/cardclubs4.png"},
    {src : "/content/cards/carddiamonds4.png"},
    {src : "/content/cards/cardhearts4.png"},
    {src : "/content/cards/cardspades4.png"},

    {src : "/content/cards/cardclubs5.png"},
    {src : "/content/cards/carddiamonds5.png"},
    {src : "/content/cards/cardhearts5.png"},
    {src : "/content/cards/cardspades5.png"},

    {src : "/content/cards/cardclubs6.png"},
    {src : "/content/cards/carddiamonds6.png"},
    {src : "/content/cards/cardhearts6.png"},
    {src : "/content/cards/cardspades6.png"},

    {src : "/content/cards/cardclubs7.png"},
    {src : "/content/cards/carddiamonds7.png"},
    {src : "/content/cards/cardhearts7.png"},
    {src : "/content/cards/cardspades7.png"},

    {src : "/content/cards/cardclubs8.png"},
    {src : "/content/cards/carddiamonds8.png"},
    {src : "/content/cards/cardhearts8.png"},
    {src : "/content/cards/cardspades8.png"},

    {src : "/content/cards/cardclubs9.png"},
    {src : "/content/cards/carddiamonds9.png"},
    {src : "/content/cards/cardhearts9.png"},
    {src : "/content/cards/cardspades9.png"},

    {src : "/content/cards/cardclubs10.png"},
    {src : "/content/cards/carddiamonds10.png"},
    {src : "/content/cards/cardhearts10.png"},
    {src : "/content/cards/cardspades10.png"},

    {src : "/content/cards/cardclubsj.png"},
    {src : "/content/cards/carddiamondsj.png"},
    {src : "/content/cards/cardheartsj.png"},
    {src : "/content/cards/cardspadesj.png"},

    {src : "/content/cards/cardclubsq.png"},
    {src : "/content/cards/carddiamondsq.png"},
    {src : "/content/cards/cardheartsq.png"},
    {src : "/content/cards/cardspadesq.png"},

    {src : "/content/cards/cardclubsk.png"},
    {src : "/content/cards/carddiamondsk.png"},
    {src : "/content/cards/cardheartsk.png"},
    {src : "/content/cards/cardspadesk.png"},

    {src : "/content/cards/cardclubsa.png"},
    {src : "/content/cards/carddiamondsa.png"},
    {src : "/content/cards/cardheartsa.png"},
    {src : "/content/cards/cardspadesa.png"},

    {src : "/content/cards/cardJokerB.png"},
    {src : "/content/cards/cardJoker.png"},
  ],
};

util.settings = {
  time : {
    "Dawn" : "/content/weather/dawn.png",
    "Sunrise" : "/content/weather/sunrise.png",
    "Day" : "/content/weather/day.png",
    "Sunset" : "/content/weather/sunset.png",
    "Dusk"  : "/content/weather/dusk.png",
    "Night" : "/content/weather/night.png",
    "Full Moon" : "/content/weather/fullmoon.png",
  },
  weather : {
    //"Cloudy" : "/content/weather/cloudy.png",
    //"Windy" : "/content/weather/windy.png",
    "Snowy" : "/content/weather/snowy.png",
    "Light Rain" : "/content/weather/lightrain.png",
    "Rain"  : "/content/weather/rain.png",
    "Heavy Rain" : "/content/weather/heavyrain.png",
    //"Hail" : "/content/weather/hail.png",
    //"Foggy" : "/content/weather/foggy.png",
    //"Stormy" : "/content/weather/stormy.png",
    //"Tornado" : "/content/weather/tornado.png",
    //"Strange" : "/content/weather/strange.png"
  },
  temp : {
    "Hot" : "/content/weather/hot.png",
    "Warm" : "/content/weather/warm.png",
    "Cold" : "/content/weather/cold.png",
  }
}

util.nameBank = [
  "Lindon Bost",
  "Dilly Dally",
  "Ezekiel Khaine",
  "Lorhanna",
  "Karneck Glostenvele",
  "Anne Oldman",
  "Lord Alfonse Ignatius von Carmichael the Third",
  "Guiseppe Markhov",
  "Tyrius Arlyeon",
  "Miranda Stonehenge",
  "Fatih Carpathian",
  "Leonon Silentread",
  "Naivara Naïlo",
  "Kookens",
  "Mathazar Mundrarko",
  "Greg",
  "Hallam Storey",
  "Lograine Gentrillio",
  "Ashlein O'Buirns",
  "Irissa-Thallia Ra",
  "Mikahail Taldirseer",
  "Arthreas Darandis",
  "Verister Milkina",
  "Prescot of House Histle",
  "Lerissas D'Origna",
  "Swoops McGee",
  "Rosco McQueen",
  "Sir Pimpered Nickles",
  'Soyka "Molotov" Soleski',
  "Barinth Lockingjaw",
  "Danarhys Tobyn",
  "Enitos Tor'tulus",
  "Caol Dol Amroth",
  "Ralph B'begly",
  "Orrus Gargongheist",
  "Tyrannus Oculi",
  "Big McLargehuge",
  "Malkin Falimede",
  "Val Daro",
  "Ignatius Fignuton",
  "Malec Kurtwin",
  "Kaleb Charington",
  "Gurqarinnel Tinkenblaster",
  "Grogdar Hilden",
  "Stargin Donter",
  "Shyla Bluff",
  "Gordma Galeic",
  "Laura Mann",
  "Zalban Masset",
  "Ardwen Swifthammer",
  "Michael Ohl",
  "THE Donnie",
  "Thagmor Dankil",
  "Steinvith Lothbrok",
  "Heboric Shatterspear",
  "Kasuko Raza",
  "Lardo",
  "Margalit Kaufman",
  "Eborg",
  "Grax Waddik",
  "Moshi Chojiro",
  "Naesala Des Montagnes",
  "Bramimond",
  "Lora Mannn",
  "Arsheviere",
  "Vyros Osbyrn",
  "Lan Athrawes",
  "Felix Landstander",
  "Mani Droak",
  "The Precious One",
  'Elarith "Rekha" Glastim',
  "Xerxses the Spellborn",
  "Romeo",
  "Ulrin Lightbringer",
  "Farsat",
  "Mïorwen Saithseren",
  "Glorp-Glorp",
  "Jayne Corbec",
  "Franklin Cho"
];


util.parse = {
  character : function(str){
    var characterData = duplicate(game.templates.character || {});
    maxify(str, characterData, game.templates);
    return characterData;
  }
}


util.resourceTypes = {
  "Rich Text" : {},
  "Deck of Cards" : {
    edit : function(obj, app, scope, parent) {
      var tableData = [];

      if (sync.rawVal(obj.data.info.notes) && sync.rawVal(obj.data.info.notes)[0] == "[") {
        try {
          tableData = JSON.parse(sync.rawVal(obj.data.info.notes));
        }
        catch (e) {
          tableData = [];
        }
      }
      parent.addClass("flexmiddle");

      var cardList = $("<div>").appendTo(parent);
      cardList.addClass("flexrow flexwrap");
      cardList.sortable({
        connectWith : ".dropContent",
        update : function(){obj.update();}
      });

      var optionsBar = $("<div>").appendTo(parent);
      optionsBar.addClass("flexcolumn fit-x subtitle");

      var total = $("<b>").appendTo(optionsBar);
      total.text(tableData.length + " Cards");

      var newDeck = genIcon("plus", "Create Deck").appendTo(optionsBar);
      newDeck.click(function(){
        game.state.data.cards = game.state.data.cards || {}
        game.state.data.cards.decks = game.state.data.cards.decks || [];

        // shuffle
        var deckData = {type : tableData, pool : [], players : {}};
        var start = duplicate(deckData.type);
        while (start.length) {
          var index = Math.floor(Math.random() * start.length);
          var val = start.splice(index, 1)[0];
          deckData.pool.push(val);
        }
        game.state.data.cards.decks.push(deckData);

        game.state.sync("updateState");
      });

      var newCard = genIcon("", "Add Unique Card").appendTo(optionsBar);
      newCard.click(function(){
        var content = sync.render("ui_filePicker")(obj, app, {change : function(ev, ui, val){
          tableData.push({src : val});
          sync.rawVal(obj.data.info.notes, JSON.stringify(tableData));
          obj.sync("updateAsset");
          if (!down[17]) {
            layout.coverlay("image-selection");
          }
        }});

        var pop = ui_popOut({
          target : app,
          prompt : true,
          id : "image-selection",
          style : {"width" : assetTypes["filePicker"].width, "height" : assetTypes["filePicker"].height}
        }, content);
        pop.resizable();
      });

      var unsorted = {};
      for (var i in tableData) {
        var cardData = duplicate(tableData[i]);
        unsorted[cardData.src] = unsorted[cardData.src] || 0;
        unsorted[cardData.src]++;
      }

      var uniqueTypes = {};
      Object.keys(unsorted).sort().forEach(function(key) {
        uniqueTypes[key] = unsorted[key];
      });

      for (var i in uniqueTypes) {
        var cardData = {src : i, flipped : true};

        var card = sync.render("ui_card")({data : cardData}, app, scope).appendTo(cardList);
        card.addClass("hover2");
        card.attr("key", i);
        card.click(function(){
          $(this).contextmenu();
        });
        card.contextmenu(function(){
          var cardID = $(this).attr("key");
          var src = $(this).attr("cardSrc");
          var actionsList = [
            {
              name : "Announce Card",
              click : function(){
                runCommand("reaction", src);
              }
            },
            {
              name : "View Card",
              click : function(ev, ui){
                assetTypes["img"].preview(ev, ui, src);
              }
            },
            {
              name : "DELETE CARDS",
              submenu : [
                {
                  name : "Confirm",
                  click : function(ev, ui){
                    for (var k=tableData.length-1; k>=0; k--) {
                      if (tableData[k].src == src) {
                        tableData.splice(k, 1);
                      }
                    }
                    sync.rawVal(obj.data.info.notes, JSON.stringify(tableData));
                    obj.sync("updateAsset");
                  }
                }
              ]
            }
          ];

          ui_dropMenu($(this), actionsList, {id : "card-menu"});
          return false;
        });

        var cardRow = genInput({
          parent : card,
          classes : "subtitle bold middle lrmargin",
          value : uniqueTypes[i],
          src : i,
          min : 1,
          style : {"width" : "40px", "color" : "#333"}
        });
        cardRow.click(function(ev){
          ev.stopPropagation();
        });
        cardRow.change(function(){
          for (var k=tableData.length-1; k>=0; k--) {
            if (tableData[k].src == $(this).attr("src")) {
              tableData.splice(k, 1);
            }
          }
          for (var k=0; k<parseInt($(this).val()); k++) {
            tableData.push({src : $(this).attr("src")});
          }
          sync.rawVal(obj.data.info.notes, JSON.stringify(tableData));
          obj.sync("updateAsset");
        });
      }
    },
    view : function(obj, app, scope, parent) {
      var tableData = [];

      if (sync.rawVal(obj.data.info.notes) && sync.rawVal(obj.data.info.notes)[0] == "[") {
        try {
          tableData = JSON.parse(sync.rawVal(obj.data.info.notes));
        }
        catch (e) {
          tableData = [];
        }
      }
      parent.addClass("flexmiddle");

      var cardList = $("<div>").appendTo(parent);
      cardList.addClass("flexrow flexwrap");
      cardList.sortable({
        connectWith : ".dropContent",
        update : function(){obj.update();}
      });

      var optionsBar = $("<div>").appendTo(parent);
      optionsBar.addClass("flexcolumn fit-x subtitle");

      var total = $("<b>").appendTo(optionsBar);
      total.text(tableData.length + " Cards");

      if (hasSecurity(getCookie("UserID"), "Assistant Master")) {
        var newDeck = genIcon("plus", "Create Deck").appendTo(optionsBar);
        newDeck.click(function(){
          game.state.data.cards = game.state.data.cards || {}
          game.state.data.cards.decks = game.state.data.cards.decks || [];

          // shuffle
          var deckData = {type : tableData, pool : [], players : {}};
          var start = duplicate(deckData.type);
          while (start.length) {
            var index = Math.floor(Math.random() * start.length);
            var val = start.splice(index, 1)[0];
            deckData.pool.push(val);
          }
          game.state.data.cards.decks.push(deckData);

          game.state.sync("updateState");
        });
      }
      if (tableData.length) {
        var newDeck = genIcon("", "Random Card").appendTo(optionsBar);
        newDeck.click(function(){
          game.state.data.cards.players = game.state.data.cards.players || {};
          game.state.data.cards.players[getCookie("UserID")] = game.state.data.cards.players[getCookie("UserID")] || [];
          game.state.data.cards.players[getCookie("UserID")].push(duplicate(tableData[Math.floor(tableData.length * Math.random())]));

          game.state.sync("updateState");
        });
      }

      var cardData = {src : "null"};

      var card = sync.render("ui_card")({data : cardData}, app, scope).appendTo(cardList);
      card.addClass("hover2");
    }
  },
  "HTML" : {
    // edit is hard coded for the HTML + Rich Text editor
    view : function(obj, app, scope, parent) {
      var wrap = $("<div>").appendTo(parent);
      wrap.addClass("fit-xy flexcolumn scroll-xy").css("position", "relative");
      sync.render("ui_processUI")(obj, app, {display : sync.rawVal(obj.data.info.notes) || ""}).css("position", "absolute").appendTo(wrap);
      /*setTimeout(function(){
        if (parent.is(":visible")) {
          var newFrame = $("<iframe>").appendTo(parent);
          newFrame.attr("width", parent.width());
          newFrame.attr("height", parent.height());
          var str = sync.rawVal(obj.data.info.notes) || "";
          var reg = /{{{@(\w*)}}}/i;
          if (sync.modifier(obj.data.info.mode, "macro")) {
            var ctx = sync.defaultContext();
            merge(ctx, {c : duplicate(obj.data)});

            var context = sync.context(sync.modifier(obj.data.info.mode, "macro"), ctx).context;
            merge(context, ctx);
            var match = str.match(reg);
            var max = 1000;
            var count = 0;
            while (match) {
              str = replaceAll(str, match[0], (sync.rawVal(context[match[1]]) || ""));
              match = str.match(reg);
              count++;
              if (count > max) {
                break;
              }
            }
          }
          //str = replaceAll(str, "href=", "nolinks=");
          str = replaceAll(str, "iframe", "div");
          str = replaceAll(str, "alert(", "noalerts");
          newFrame.attr("sandbox", "");
          newFrame.css("border", "none");
          newFrame.css("outline", "none");
          var idocument = newFrame[0].contentDocument;
          idocument.open();
          idocument.write(str);
          idocument.close();
        }
      }, 1);*/
    }
  },
  "Image" : {
    edit : function(obj, app, scope, parent) {
      scope.lookup = "info.img";
      parent.addClass("smooth outline white");
      sync.render("ui_image")(obj, app, scope).appendTo(parent);
    },
    view : function(obj, app, scope, parent) {
      scope.lookup = "info.img";
      scope.viewOnly = true;
      parent.css("position", "relative");

      var imgContainer = $("<div>").appendTo(parent);
      imgContainer.addClass("flexcolumn flexmiddle flex scroll-xy");

      var media = $("<img>").appendTo(imgContainer);
      media.attr("src", sync.rawVal(obj.data.info.img) || "/content/icons/Scroll1000p.png");
      media.on("load", function(){
        console.log("Here");
        var aspect = this.naturalWidth/this.naturalHeight;

        var imageWidth = this.naturalWidth;
        var imageHeight = this.naturalHeight;
        var areaHeight = imgContainer.outerWidth();
        var areaWidth = imgContainer.outerHeight();

        if (aspect >= 1) { // landscape
          imageWidth = areaWidth;
          imageHeight = imageWidth / aspect;
          if (imageHeight > areaHeight) {
            imageHeight = areaHeight;
            imageWidth = areaHeight * aspect;
          }
        }
        else { // portrait
          imageHeight = areaHeight;
          imageWidth = imageHeight * aspect;
          if (imageWidth > areaWidth) {
            imageWidth = areaWidth;
            imageHeight = areaWidth / aspect;
          }
        }

        media.attr("width", imageWidth);
        media.attr("height", imageHeight);
      });
      media.contextmenu(function(ev){
        assetTypes["img"].contextmenu(ev, $(this), $(this).attr("srcImg"));
        ev.stopPropagation();
        ev.preventDefault();
        return false;
      });

      var zoom = 100;

      var zoomContainer = $("<div>").appendTo(parent);
      zoomContainer.addClass("flexcolumn flexmiddle");
      zoomContainer.css("width", "auto");
      zoomContainer.css("position", "absolute");
      zoomContainer.css("left", "10%");
      zoomContainer.css("bottom", "10%");

      var maxZoom = 200;
      var typeI = "range";
      if (layout.mobile) {
        maxZoom = 1000;
        typeI = "number";
      }
      var zoomRange = genInput({
        parent : zoomContainer,
        type : typeI,
        min : 25,
        value : 100,
        step : 5,
        style : {"width": "100px", color : "black"},
        max : maxZoom
      }, 1);
      zoomRange.val(zoom);
      zoomRange.bind("input", function(){
        zoom = $(this).val();
        media.css("zoom", zoom + "%");
        media.css("margin-top", "100px");
        media.css("margin-bottom", "100px");
      });
    }
  },
  "Roll Table" : {
    edit : function(obj, app, scope, parent) {
      var tableData;

      if (sync.rawVal(obj.data.info.notes) && sync.rawVal(obj.data.info.notes)[0] == "{") {
        try {
          tableData = JSON.parse(sync.rawVal(obj.data.info.notes));
        }
        catch (e) {
          tableData = {headers : [], contents : []};
        }
      }
      else {
        tableData = {headers : [], contents : []};
      }

      var tableOptions = $("<div>").appendTo(parent);
      tableOptions.addClass("flexcolumn foreground alttext");

      var tableConfig = $("<div>").appendTo(tableOptions);

      var headers = $("<div>").appendTo(tableOptions);
      headers.addClass("flexrow flexbetween");

      if (tableData.headers.length < 2) {
        tableData.headers = [{name : "d20"}, {name : "Rolled Value"}];
      }

      for (var i=0; i<tableData.headers.length; i++) {
        var headerData = tableData.headers[i];

        var headerWrap = $("<div>").appendTo(headers);
        headerWrap.addClass("flexcolumn flexmiddle flex");
        if (i == 0) {
          headerWrap.removeClass("flex");
          headerWrap.append("<b class='subtitle dull'>Dice to Roll</b>");
        }
        else {
          headerWrap.append("<b class='subtitle dull'>Description</b>");
        }

        var headerInput = genInput({
          parent : headerWrap,
          classes : "line middle lrmargin",
          value : headerData.name,
          index : i
        });
        headerInput.change(function(){
          tableData.headers[$(this).attr("index")].name = $(this).val();
          sync.rawVal(obj.data.info.notes, JSON.stringify(tableData));
          obj.sync("updateAsset");
        });
      }

      var tableContent = $("<div>").appendTo(parent);
      tableContent.addClass("flex");
      tableContent.css("overflow", "auto");

      for (var i=0; i<tableData.contents.length; i++) {
        var contentData = tableData.contents[i];

        var headerWrap = $("<div>").appendTo(tableContent);
        headerWrap.addClass("flexrow fit-x");

        var headerInput = genInput({
          parent : headerWrap,
          classes : "line middle lrmargin",
          value : contentData.name,
          placeholder : "Dice Range (ex. 32-46)",
          index : i
        });
        headerInput.change(function(){
          tableData.contents[$(this).attr("index")].name = $(this).val();
          sync.rawVal(obj.data.info.notes, JSON.stringify(tableData));
          obj.sync("updateAsset");
        });

        var valueInput = genInput({
          parent : headerWrap,
          classes : "line middle flex lrmargin",
          value : contentData.value,
          index : i
        });
        valueInput.change(function(){
          tableData.contents[$(this).attr("index")].value = $(this).val();
          sync.rawVal(obj.data.info.notes, JSON.stringify(tableData));
          obj.sync("updateAsset");
        });

        var remove = genIcon("remove").appendTo(headerWrap);
        remove.addClass("destroy");
        remove.attr("index", i);
        remove.click(function(){
          tableData.contents.splice($(this).attr("index"), 1);
          sync.rawVal(obj.data.info.notes, JSON.stringify(tableData));
          obj.sync("updateAsset");
        });
      }

      var newRow = genIcon("plus", "New Row("+tableData.contents.length+")");
      newRow.appendTo(parent);
      newRow.addClass("fit-x flexmiddle subtitle bold");
      newRow.click(function(){
        tableData.contents.push({});
        sync.rawVal(obj.data.info.notes, JSON.stringify(tableData));
        obj.update();
      });
    },
    view : function(obj, app, scope, parent) {
      var tableData;

      if (sync.rawVal(obj.data.info.notes) && sync.rawVal(obj.data.info.notes)[0] == "{") {
        try {
          tableData = JSON.parse(sync.rawVal(obj.data.info.notes));
        }
        catch (e) {
          tableData = {headers : [], contents : []};
        }
      }
      else {
        tableData = {headers : [], contents : []};
      }

      var tableContent = $("<div>").appendTo(parent);

      for (var i=0; i<tableData.contents.length; i++) {
        var contentData = tableData.contents[i];

        var headerWrap = $("<div>").appendTo(tableContent);
        headerWrap.addClass("flexrow fit-x outlinebottom");

        var rollButton = $("<button>").appendTo(headerWrap);
        rollButton.addClass("subtitle");
        rollButton.attr("index", i);
        rollButton.css("width", "100px");
        rollButton.text(contentData.name);
        rollButton.click(function(){
          var msg = "Selected "+tableData.contents[$(this).attr("index")].name+" on " + sync.rawVal(obj.data.info.name);
          sendAlert({text : msg});
          util.chatEvent(msg, null, null, $("<input>"), null, true);
          util.chatEvent(tableData.contents[$(this).attr("index")].value, null, null, $("<input>"), null, true);
          $("#chat-button").click();
        });

        headerWrap.append("<p class='flex spadding'>"+(contentData.value || "")+"</p>");
      }

      var tableOptions = $("<div>").appendTo(parent);
      tableOptions.addClass("flexrow subtitle fit-x flexmiddle");

      var rollButton = $("<button>").appendTo(tableOptions);
      rollButton.addClass("bold flexmiddle button spadding flex");
      rollButton.text("Roll");
      rollButton.click(function(){
        var result = sync.eval(tableData.headers[0].name, {});
        var rangeRegex = /(\d+)-(\d+)/i;
        for (var i=0; i<tableData.contents.length; i++) {
          var contentName = tableData.contents[i].name;
          var rangeMatch = contentName.match(rangeRegex);
          if (rangeMatch) {
            if (Number(rangeMatch[1]) > Number(rangeMatch[2])) {
              var temp = Number(rangeMatch[1]);
              rangeMatch[1] = Number(rangeMatch[2]);
              rangeMatch[2] = temp;
            }
            if (Number(rangeMatch[1]) <= result && Number(rangeMatch[2]) >= result) {
              var msg = "Rolled "+result+" on " + sync.rawVal(obj.data.info.name);
              sendAlert({text : msg});
              util.chatEvent(msg, null, null, $("<input>"), null, true);
              util.chatEvent(tableData.contents[i].value, null, null, $("<input>"), null, true);
              $("#chat-button").click();
              return;
            }
          }
          else if (!isNaN(contentName) && contentName == result) {
            var msg = "Rolled "+result+" on " + sync.rawVal(obj.data.info.name);
            sendAlert({text : msg});
            util.chatEvent(msg, null, null, $("<input>"), null, true);
            util.chatEvent(tableData.contents[i].value, null, null, $("<input>"), null, true);
            $("#chat-button").click();
            return;
          }
        }
      });

      var rollButton = $("<button>").appendTo(tableOptions);
      rollButton.addClass("bold flexmiddle background alttext spadding flex");
      rollButton.text("Roll Private");
      rollButton.click(function(){
        var result = sync.eval(tableData.headers[0].name, {});
        var rangeRegex = /(\d+)-(\d+)/i;
        for (var i=0; i<tableData.contents.length; i++) {
          var contentName = tableData.contents[i].name;
          var rangeMatch = contentName.match(rangeRegex);
          if (rangeMatch) {
            if (Number(rangeMatch[1]) > Number(rangeMatch[2])) {
              var temp = Number(rangeMatch[1]);
              rangeMatch[1] = Number(rangeMatch[2]);
              rangeMatch[2] = temp;
            }
            if (Number(rangeMatch[1]) <= result && Number(rangeMatch[2]) >= result) {
              var whisper = {};
              whisper[getCookie("UserID")] = 1;
              var msg = "Rolled "+result+" on " + sync.rawVal(obj.data.info.name);
              sendAlert({text : msg});
              util.chatEvent(msg, null, whisper, $("<input>"), null, true);
              util.chatEvent(tableData.contents[i].value, null, whisper, $("<input>"), null, true);
              $("#chat-button").click();
              return;
            }
          }
          else if (!isNaN(contentName) && contentName == result) {
            var whisper = {};
            whisper[getCookie("UserID")] = 1;
            var msg = "Rolled "+result+" on " + sync.rawVal(obj.data.info.name);
            sendAlert({text : msg});
            util.chatEvent(msg, null, whisper, $("<input>"), null, true);
            util.chatEvent(tableData.contents[i].value, null, whisper, $("<input>"), null, true);
            $("#chat-button").click();
            return;
          }
        }
      });
    }
  },
  "Website" : {
    edit : function(obj, app, scope, parent) {
      parent.addClass("smooth outline white");

      var urlInput = genInput({
        parent : parent,
        classes : "fit-x",
        placeholder : "Website URL",
        value : sync.rawVal(obj.data.info.notes),
      });
      urlInput.change(function(){
        sync.rawVal(obj.data.info.notes, $(this).val());
        obj.sync("updateAsset");
      });
    },
    view : function(obj, app, scope, parent) {
      setTimeout(function(){
        if (parent.is(":visible")) {
          var newFrame = $("<iframe>").appendTo(parent);
          newFrame.attr("width", parent.width());
          newFrame.attr("height", parent.height());
          newFrame.attr("src", sync.rawVal(obj.data.info.notes));
          newFrame.css("border", "none");
          newFrame.css("outline", "none");
          newFrame.css("border", "none");
        }
      }, 1);
    }
  },
}

util.processPage = function(pageData, obj, app, scope) {
  scope = scope || {};
  app = app || $("<div>");
  obj = obj || sync.dummyObj();
  obj.data = obj.data || {};

  var preview = $("<div>");

  var cols = {};
  var colCounter = 0;
  var colList = [
    "#00538A", // Strong Blue
    "#C10020", // Vivid Red
    "#CEA262", // Grayish Yellow
    "#817066", // Medium Gray
    "#007D34", // Vivid Green
    "#FFB300", // Vivid Yellow
    "#803E75", // Strong Purple
    "#FF6800", // Vivid Orange
    "#F6768E", // Strong Purplish Pink
    "#A6BDD7", // Very Light Blue
    "#FF7A5C", // Strong Yellowish Pink
    "#53377A", // Strong Violet
    "#FF8E00", // Vivid Orange Yellow
    "#B32851", // Strong Purplish Red
    "#F4C800", // Vivid Greenish Yellow
    "#7F180D", // Strong Reddish Brown
    "#93AA00", // Vivid Yellowish Green
    "#593315", // Deep Yellowish Brown
    "#F13A13", // Vivid Reddish Orange
    "#232C16", // Dark Olive Green
  ]

  /*for (var i in colList) {
    content.append("<div style='background-color:"+colList[i]+";' class='padding'><div>");
  }*/

  var textData = unpurge(pageData);
  var lineRegex = /(<p[^>]*?>)(.*?)(?=(<\/p>))/igm;
  var convoReg = /(.*)(&nbsp;)*\s*:\s*(&nbsp;)*(".*")/im;
  var noteReg = /\*\*\*([^\*]*)\*\*\*/im;
  var lines = lineRegex.exec(textData);
  while (lines) {
    var text = lines[2];
    var isConvo = text.match(convoReg);
    var isNote = text.match(noteReg);
    if (isConvo) {
      var correctedID = replaceAll(isConvo[1], "&nbsp;", "");
      if (!cols[correctedID]) {
        // register a new color
        cols[correctedID] = colList[colCounter];
        colCounter = colCounter + 1;
      }
      // use the color
      var sec1 = "<div class='chatName spadding smooth fit-x' style='font-size : 1.2em; background-color:"+cols[correctedID]+";'>"+isConvo[1]+"</div>";
      var sec2 = "<div class='chatCmd outline smooth white padding fit-x' style='border-bottom-left-radius : 8px; border-bottom-right-radius : 8px; color : #333; text-shadow : none;'>"+isConvo[4].substring(1,isConvo[4].length-1)+"</div>";
      var rep = "<div class='flexwrap alttext spadding smooth hover2 conversation'>"+sec1+sec2+"</div>";
      textData = textData.replace(text, rep);
    }
    if (isNote) {
      var rep = "<div class='subtitle padding' style='background-color: rgb(235,235,228);'><b style='display : block'>GM's Note : </b>"+isNote[1]+"</div>";
      if (!hasSecurity(getCookie("UserID"), "Assistant Master")) {
        rep = "";
      }
      textData = textData.replace(text, rep);
    }
    lines = lineRegex.exec(textData);
  }
  preview.append(textData);

  if (sync.modifier(obj.data.info.notes, "HR")) {
    preview.find("hr").css("background", sync.modifier(obj.data.info.notes, "HR"));
  }
  if (sync.modifier(obj.data.info.notes, "HR1")) {
    preview.find("hr.h1").css("background", sync.modifier(obj.data.info.notes, "HR1"));
  }
  if (sync.modifier(obj.data.info.notes, "HR2")) {
    preview.find("hr.h2").css("background", sync.modifier(obj.data.info.notes, "HR2"));
  }
  if (sync.modifier(obj.data.info.notes, "H1F")) {
    preview.find("h1").css("font-family", sync.modifier(obj.data.info.notes, "H1F"));
  }
  if (sync.modifier(obj.data.info.notes, "H1FS")) {
    preview.find("h1").css("font-size", sync.modifier(obj.data.info.notes, "H1FS")+"em");
  }
  if (sync.modifier(obj.data.info.notes, "H1C")) {
    preview.find("h1").css("color", sync.modifier(obj.data.info.notes, "H1C"));
  }
  if (sync.modifier(obj.data.info.notes, "H1S")) {
    preview.find("h1").css("text-shadow", sync.modifier(obj.data.info.notes, "H1S"));
  }
  if (sync.modifier(obj.data.info.notes, "H2F")) {
    preview.find("h2").css("font-family", sync.modifier(obj.data.info.notes, "H2F"));
  }
  if (sync.modifier(obj.data.info.notes, "H2FS")) {
    preview.find("h2").css("font-size", sync.modifier(obj.data.info.notes, "H2FS")+"em");
  }
  if (sync.modifier(obj.data.info.notes, "H2C")) {
    preview.find("h2").css("color", sync.modifier(obj.data.info.notes, "H2C"));
  }
  if (sync.modifier(obj.data.info.notes, "H2S")) {
    preview.find("h2").css("text-shadow", sync.modifier(obj.data.info.notes, "H2S"));
  }

  preview.find("table").each(function(){
    if (!$(this).attr("width")) {
      $(this).addClass("fit-x");
    }
    $(this).addClass("smooth");
    var alt = false;
    $(this).find("tr").addClass("outlinebottom lrpadding subtitle").each(function(){
      alt = !alt;
      if (alt) {
        $(this).addClass("inactive");
      }
    });
    $(this).find("tr").children().addClass("lrpadding lightoutline");
    $($(this).find("tr")[0]).addClass("bold").removeClass("subtitle lightoutline inactive");
    $($(this).find("tr")[0]).children().addClass("lrpadding outlinebottom smooth").removeClass("lightoutline").css("border-color", "rgba(0,0,0,0.2)");

    var tableContents = $(this).find("tr");
    var header = $(tableContents[0]);
    header.addClass("bold");
    var head = $(header.children()[0]);
    if (!scope.noInteractions) {
      if (head.text().match(diceRegex) && header.children().length == 2) {
        $(this).addClass("link");
        $(this).click(function(){
          $(this).contextmenu();
        });
        $(this).contextmenu(function(){
          var actionsList = [
            {
              name : "Roll",
              click : function(ev, ui){
                var result = sync.eval(head.text(), {});
                var rangeRegex = /(\d+)-(\d+)/i;
                for (var i=1; i<tableContents.length; i++) {
                  var contentName = $($(tableContents[i]).children()[0]).text();
                  var rangeMatch = contentName.match(rangeRegex);
                  if (rangeMatch) {
                    if (Number(rangeMatch[1]) > Number(rangeMatch[2])) {
                      var temp = Number(rangeMatch[1]);
                      rangeMatch[1] = Number(rangeMatch[2]);
                      rangeMatch[2] = temp;
                    }
                    if (Number(rangeMatch[1]) <= result && Number(rangeMatch[2]) >= result) {
                      var whisper = null
                      var msg = "Rolled "+result+" on " + sync.rawVal(obj.data.info.name);
                      sendAlert({text : msg});
                      util.chatEvent(msg, null, whisper, $("<input>"), null, true);
                      util.chatEvent($($(tableContents[i]).children()[1]).text(), null, whisper, $("<input>"), null, true);
                      $("#chat-button").click();
                      return;
                    }
                  }
                  else if (!isNaN(contentName) && contentName == result) {
                    var whisper = null
                    var msg = "Rolled "+result+" on " + sync.rawVal(obj.data.info.name);
                    sendAlert({text : msg});
                    util.chatEvent(msg, null, whisper, $("<input>"), null, true);
                    util.chatEvent($($(tableContents[i]).children()[1]).text(), null, whisper, $("<input>"), null, true);
                    $("#chat-button").click();
                    return;
                  }
                }
              }
            },
            {
              name : "Roll Private",
              click : function(ev, ui){
                var result = sync.eval(head.text(), {});
                var rangeRegex = /(\d+)-(\d+)/i;
                for (var i=1; i<tableContents.length; i++) {
                  var contentName = $($(tableContents[i]).children()[0]).text();
                  var rangeMatch = contentName.match(rangeRegex);
                  if (rangeMatch) {
                    if (Number(rangeMatch[1]) > Number(rangeMatch[2])) {
                      var temp = Number(rangeMatch[1]);
                      rangeMatch[1] = Number(rangeMatch[2]);
                      rangeMatch[2] = temp;
                    }
                    if (Number(rangeMatch[1]) <= result && Number(rangeMatch[2]) >= result) {
                      var whisper = {};
                      whisper[getCookie("UserID")] = 1;
                      var msg = "Rolled "+result+" on " + sync.rawVal(obj.data.info.name);
                      sendAlert({text : msg});
                      util.chatEvent(msg, null, whisper, $("<input>"), null, true);
                      util.chatEvent($($(tableContents[i]).children()[1]).text(), null, whisper, $("<input>"), null, true);
                      $("#chat-button").click();
                      return;
                    }
                  }
                  else if (!isNaN(contentName) && contentName == result) {
                    var whisper = {};
                    whisper[getCookie("UserID")] = 1;
                    var msg = "Rolled "+result+" on " + sync.rawVal(obj.data.info.name);
                    sendAlert({text : msg});
                    util.chatEvent(msg, null, whisper, $("<input>"), null, true);
                    util.chatEvent($($(tableContents[i]).children()[1]).text(), null, whisper, $("<input>"), null, true);
                    $("#chat-button").click();
                    return;
                  }
                }
              }
            }
          ];
          ui_dropMenu($(this), actionsList, {id : "roll-list"});
          return false;
        });
      }
    }
  });

  preview.find(".conversation").each(function(){
    var convo = $(this);
    $(this).contextmenu(function(ev){
      var convo = $(this);
      var name = $(this).find(".chatName").text();
      var chatText = $(this).find(".chatCmd").text();
      var actionsList = [
      {
        name : "As ...",
        submenu : [
          {
            name : "Custom",
            click : function(){
              ui_prompt({
                target : convo,
                inputs : {"Name" : ""},
                click : function(ev, ui){
                  convo.removeClass("alttext");
                  convo.addClass("dull");
                  convo.find(".chatCmd").css("color", "#333");
                  var href;
                  var entID;
                  convo.find(".chatName").find("a").each(function(){
                    var link = $(this);
                    var reg = /\|asset\|=([\w-\d]+)/;
                    var hreff = decodeURI(link.attr("href"));
                    var match = hreff.match(reg);
                    if (match) {
                      var ent = getEnt(match[1]);
                      if (ent && ent.data) {
                        entID = ent.id();
                        href = sync.rawVal(ent.data.info.img);
                      }
                    }
                  });
                  util.chatEvent(chatText, "Stranger", _whisperTargets, convo, href, true, entID);
                }
              });
            }
          },
          {
            name : "Stranger",
            click : function(){
              convo.removeClass("alttext");
              convo.addClass("dull");
              convo.find(".chatCmd").css("color", "#333");
              var href;
              var entID;
              convo.find(".chatName").find("a").each(function(){
                var link = $(this);
                var reg = /\|asset\|=([\w-\d]+)/;
                var hreff = decodeURI(link.attr("href"));
                var match = hreff.match(reg);
                if (match) {
                  var ent = getEnt(match[1]);
                  if (ent && ent.data) {
                    entID = ent.id();
                    href = sync.rawVal(ent.data.info.img);
                  }
                }
              });
              util.chatEvent(chatText, "Stranger", _whisperTargets, convo, href, true, entID);
            }
          },
          {
            name : "Anonymous",
            click : function(){
              convo.removeClass("alttext");
              convo.addClass("dull");
              convo.find(".chatCmd").css("color", "#333");
              util.chatEvent(chatText, "Anonymous", _whisperTargets, convo, null, true);
            }
          },
          {
            name : "Out of Character",
            click : function(){
              convo.removeClass("alttext");
              convo.addClass("dull");
              convo.find(".chatCmd").css("color", "#333");
              util.chatEvent(chatText, name, _whisperTargets, convo, null, true);
            }
          },
        ]
      },
      {
        name : "With Image",
        click : function(ev, ui){
          var content = sync.render("ui_filePicker")(obj, app, {change : function(ev, ui, val){
            convo.removeClass("alttext");
            convo.addClass("dull");
            convo.find(".chatCmd").css("color", "#333");
            util.chatEvent(chatText, name, _whisperTargets, convo, val, true);
            layout.coverlay("image-selection");
          }});

          var pop = ui_popOut({
            target : ui,
            prompt : true,
            id : "image-selection",
            style : {"width" : assetTypes["filePicker"].width, "height" : assetTypes["filePicker"].height}
          }, content);
          pop.resizable();
        }
      }];

      if (!convo.hasClass("alttext")) {
        actionsList.push({
          name : "Refresh Command",
          click : function(){
            convo.addClass("alttext");
            convo.removeClass("dull");
            convo.find(".chatCmd").css("color", "#333");
          }
        });
      }
      else {
        actionsList.push({
          name : "Exhaust Command",
          click : function(){
            convo.removeClass("alttext");
            convo.addClass("dull");
            convo.find(".chatCmd").css("color", "#333");
          }
        });
      }

      ui_dropMenu($(this), actionsList, {id : "roll-menu"});
      ev.stopPropagation();
      ev.preventDefault();
      return false;
    });
    $(this).find(".chatName").find("a").each(function(){
      var link = $(this);
      var reg = /\|asset\|=([\w-\d]+)/;
      var hreff = decodeURI(link.attr("href"));
      var match = hreff.match(reg);
      if (match) {
        var ent = getEnt(match[1]);
        if (ent && ent.data) {
          var href = sync.rawVal(ent.data.info.img) || "/content/icons/blankchar.png";
          if (convo.find(".chatName").find("img").length == 0) {
            var img = $("<img>");
            img.addClass("round outline white");
            img.attr("width", "35px");
            img.attr("height", "35px");
            img.css("width", "35px");
            img.css("height", "35px");
            img.attr("src", href);

            convo.find(".chatName").prepend(img);
          }
        }
      }
    });
    if (!scope.noInteractions) {
      $(this).click(function(ev){
        if (!convo.hasClass("alttext")) {
          $(this).addClass("alttext");
          $(this).removeClass("dull");
        }
        else {
          $(this).removeClass("alttext");
          $(this).addClass("dull");
          var name = $(this).find(".chatName").text();
          var chatText = $(this).find(".chatCmd").text();
          var href;
          var entID;
          $(this).find(".chatName").find("a").each(function(){
            var link = $(this);
            var reg = /\|asset\|=([\w-\d]+)/;
            var hreff = decodeURI(link.attr("href"));
            var match = hreff.match(reg);
            if (match) {
              ent = getEnt(match[1]);
              if (ent && ent.data) {
                entID = ent.id();
                href = sync.rawVal(ent.data.info.img);
                if (convo.find(".chatName").find("img").length == 0) {
                  var img = $("<img>");
                  img.addClass("round outline white");
                  img.attr("width", "25px");
                  img.attr("height", "25px");
                  img.css("width", "25px");
                  img.css("height", "25px");
                  img.attr("src", href);

                  convo.find(".chatName").prepend(img);
                }
              }
            }
          });
          $(this).find(".chatName").find("img").each(function(){
            href = $(this).attr("src");
          });
          util.chatEvent(chatText, name, _whisperTargets, $(this), href, true, entID);
        }
        ev.stopPropagation();
        ev.preventDefault();
      });
    }
    $(this).find(".chatName").find("img").each(function(){
      $(this).addClass("round outline white lrmargin");
      $(this).attr("width", "25px");
      $(this).attr("height", "25px");
      $(this).css("width", "25px");
      $(this).css("height", "25px");
    });
  });
  preview.sortable({
    handle : ".charContent",
    connectWith : ".dropContent",
  });

  function enhancePage(page, margins) {
    var context = sync.defaultContext();
    var pc = getPlayerCharacter(getCookie("UserID"));
    if (pc && pc.data) {
      context[pc.data._t] = duplicate(pc.data);
    }


    preview.find("img").each(function(){
      var val = $(this).attr("src");
      if (!scope.noInteractions) {
        $(this).contextmenu(function(ev){
          assetTypes["img"].contextmenu(ev, $(this), val);
          ev.stopPropagation();
          ev.preventDefault();
          return false;
        });
      }
      $(this)[0].onload = function(){
        if (!$(this).attr("width") || $(this).attr("width") > preview.width()) {
          var width = $(this).attr("width") || $(this).width();
          var height = $(this).attr("height") || $(this).height();
          if ($(this).attr("width") == 0) {
            width = $(this).width();
          }
          if ($(this).attr("height") == 0) {
            height = $(this).height();
          }
          var aspect = width/height;
          width = Math.min(width, preview.width());
          height = Math.ceil(width/aspect);

          $(this).attr("width", width);
          $(this).css("width", width);

          $(this).attr("height", height);
          $(this).css("height", height);
        }
      }

    });

    setTimeout(function(){
      preview.find("audio").each(function(){
        if ($(this).attr("width") > preview.width()) {
          var width = $(this).attr("width") || $(this).width();
          var height = $(this).attr("height") || $(this).height();
          var aspect = width/height;
          width = Math.min(width, preview.width());
          height = Math.ceil(width/aspect);

          $(this).attr("width", width);
          $(this).css("width", width);

          $(this).attr("height", height);
          $(this).css("height", height);
        }
      });
      preview.find("video").each(function(){
        if ($(this).attr("width") > preview.width()) {
          var width = $(this).attr("width") || $(this).width();
          var height = $(this).attr("height") || $(this).height();
          var aspect = width/height;
          width = Math.min(width, preview.width());
          height = Math.ceil(width/aspect);

          $(this).attr("width", width);
          $(this).css("width", width);

          $(this).attr("height", height);
          $(this).css("height", height);
        }
      });
      preview.find("iframe").each(function(){
        if ($(this).attr("width") > preview.width()) {
          var width = $(this).attr("width") || $(this).width();
          var height = $(this).attr("height") || $(this).height();
          var aspect = width/height;
          width = Math.min(width, preview.width());
          height = Math.ceil(width/aspect);

          $(this).attr("width", width);
          $(this).css("width", width);

          $(this).attr("height", height);
          $(this).css("height", height);
        }
      });
    }, 10);

    preview.find("img").each(function(){
      $(this).addClass("hover2 lightoutline");
      var img = $(this);
      if (!scope.noInteractions) {
        $(this).click(function(ev){
          var applied = false;
          $(".application[ui-name='ui_display']").each(function(){
            if (!applied && $(this).attr("tabKey") != null) {
              applied = true;
            }
          });
          if (hasSecurity(getCookie("UserID"), "Assistant Master") && applied) {
            util.slideshow($(this).attr("src"));
          }
          else {
            assetTypes["img"].preview(ev, $(this), $(this).attr("src"));
          }
          if (!$(this).parent().parent().hasClass("conversation")) {
            ev.stopPropagation();
          }
          ev.preventDefault();
        });
      }
    });
    preview.find("div").each(function(){
      if (!$(this).attr("data") || ($(this).attr("data") && sync.eval($(this).attr("data"), context))) {
        $(this).show();
        if ($(this).attr("data")) {
          $(this).addClass("lpadding smooth");
          $(this).css("border", "1px dashed rgba(0,0,0,0.4)");
        }
      }
      else {
        $(this).hide();
      }
    });
    preview.find("video").each(function(){
      $(this).addClass("hover2 lightoutline");
      $(this).css("padding", "32px");
      if (!scope.noInteractions) {
        $(this).click(function(){
          util.slideshow($(this).attr("src"));
        });
      }
    });

    preview.find("iframe").each(function(){
      $(this).addClass("hover2 lightoutline");
      $(this).css("padding", "32px");
      if (!scope.noInteractions) {
        $(this).click(function(){
          var reg = /(embed\/)(.*)/;
          runCommand("media", {cmd : "update", data : {video : reg.exec($(this).attr("src"))[2], time : 0}});
        });
      }
    });
    preview.find("a").each(function(){
      var link = $(this);
      link.attr("target", "_");
      var reg = /\|asset\|=([\w-\d]+)/;
      var href = decodeURI(link.attr("href"));
      var match = href.match(reg);
      if (util.matchYoutube(href)) {
        link.addClass("alttext subtitle spadding background smooth");
        link.append(genIcon({raw : true, icon : "play"}).css("padding-left", "2px"));
        link.css("color", "white");
        link.attr("src", href);
        if (!scope.noInteractions) {
          link.click(function(ev){
          var reg = /(v=)([^&]*)/;
          var reg1 = /[^\/]*([^&^?\/]*)$/;
          var time = /[^?]*t=([^&^?]*)$/;
          var vid = $(this).attr("src");
          function getData() {
            var returnData = {};
            var res = reg.exec(vid);
            if (res) {
              returnData.video = res[2];
            }
            else {
              var res = reg1.exec(vid);
              if (res) {
                returnData.video = res[0].split("?")[0];
              }
            }
            var timeReg = time.exec(vid);
            if (timeReg) {
              returnData.time = timeReg[1];
            }

            return returnData;
          }
          runCommand("media", {cmd : "update", data : getData()});
          ev.stopPropagation();
          ev.preventDefault();
          return false;
        });
        }
        link.removeAttr("href");
      }
      else if (match) {
        var ent = getEnt(match[1]);
        if (!scope.noInteractions) {
          if (ent && ent.data) {
            link.attr("index", match[1]);
            link.append(genIcon({raw : true, icon : assetTypes[ent.data._t].i}).css("padding-left", "2px"));
            link.contextmenu(function(ev){
              var href = decodeURI($(this).attr("href"));
              var match = href.match(reg);
              var ent = getEnt(match[1]);
              assetTypes.contextmenu(ev, $(this), ent, app, scope);

              ev.preventDefault();
              ev.stopPropagation();
            });

            link.click(function(ev){
              var href = decodeURI(link.attr("href"));
              var match = href.match(reg);
              var ent = getEnt(match[1]);
              assetTypes[ent.data._t].preview(ent, $(this));
              ev.preventDefault();
              ev.stopPropagation();
            });
          }
          else {
            link.removeAttr("href");
          }
        }
      }
      else if (href.match("sound")) {
        link.addClass("alttext subtitle spadding background smooth");
        link.append(genIcon({raw : true, icon : "volume-up"}).css("padding-left", "2px"));
        link.css("color", "white");
        link.removeAttr("href");
        link.attr("src", href.replace("sound", ""));
        if (!scope.noInteractions) {
          link.click(function(ev){
            sendAlert({"text" : "Sharing Audio"});
            runCommand("music", {src : $(this).attr("src")});
          });
        }
      }
      else if (href.match("effect_")) {
        link.addClass("subtitle spadding smooth foreground alttext");
        link.append(genIcon({raw : true, icon : "sunglasses"}).css("padding-left", "2px"));
        link.removeAttr("href");
        link.attr("src", href.replace("effect_", ""));
        link.click(function(ev){
          var effect = $(this).attr("src");
          $(".displayApp").each(function(){
            runCommand("effect", {effect : effect, tab : $(this).attr("currentTab")});
          });
        });
      }
      else if (href.match("setting")) {
        var enablePlate = $("<div>");
        enablePlate.addClass("flexcolumn flexmiddle spadding background fit-x hover2");
        enablePlate.attr("data", href.replace("setting", ""));
        if (!scope.noInteractions) {
          enablePlate.click(function(){
            if (hasSecurity(getCookie("UserID"), "Assistant Master")) {
              game.state.data.setting = JSON.parse($(this).attr("data")).setting;
              game.state.sync("updateState");
            }
          });
        }

        var settingObj = sync.dummyObj();
        settingObj.data = JSON.parse(href.replace("setting", ""));

        sync.render("ui_setting")(settingObj, enablePlate, {viewOnly : true}).appendTo(enablePlate);

        link.replaceWith(enablePlate);
      }
      else if (href.match("combat")) {
        var enablePlate = $("<div>");
        enablePlate.addClass("flexcolumn fit-x hover2");
        enablePlate.attr("data", href.replace("combat", ""));
        if (!scope.noInteractions) {
          enablePlate.click(function(){
            game.locals["turnOrder"] = game.locals["turnOrder"] || sync.obj();
            game.locals["turnOrder"].update(JSON.parse($(this).attr("data")));

            $("#combat-button").click();

            for (var index in game.players.data) {
              if (game.players.data[index].entity) {
                game.locals["turnOrder"].data.combat.engaged[game.players.data[index].entity] = {};
              }
            }
            game.locals["turnOrder"].update();
            game.state.update();
          });
        }

        var enableWrap = $("<div>").appendTo(enablePlate);
        enableWrap.addClass("flexcolumn flexmiddle fit-x");
        enableWrap.append(genIcon("fire", "Combat"));

        var combatObj = sync.dummyObj();
        combatObj.data = JSON.parse(href.replace("combat", ""));

        var newApp = sync.newApp("ui_combat").appendTo(enablePlate);
        newApp.addClass("smooth subtitle");
        newApp.attr("viewOnly", true);
        newApp.attr("minimized", true);
        newApp.css("color", "#333");
        combatObj.addApp(newApp);

        link.replaceWith(enablePlate);
      }
      else if (href.match("macro")) {
        var button = $("<button>");
        button.addClass("highlight alttext subtitle flexrow");
        button.attr("macro", link.text());
        button.attr("title", link.text());
        button.text(link.text());

        function loadWrap(button, macro) {
          setTimeout(function(){
            button.append(sync.render("ui_diceVisual")(obj, app, {eq : macro, diceSize : button.height() || "15px", classes : "flexrow flexwrap"}).css("font-size", "0.6em"));
          }, 100);
        }
        loadWrap(button, link.text());
        if (!scope.noInteractions) {
          button.click(function(ev){
            var context = sync.defaultContext();
            var pc = getPlayerCharacter(getCookie("UserID"));
            if (pc && pc.data) {
              context[pc.data._t] = duplicate(pc.data);
            }
            context[obj.data._t] = duplicate(obj.data);
            var macro = $(this).attr("macro");
            var actionsList = [
              {
                name : "Roll",
                click : function(){
                  util.processEvent(macro);
                }
              },
              {
                name : "Roll private",
                click : function(){
                  var priv = {};
                  priv[getCookie("UserID")] = true;
                  util.processEvent(macro, null, null, null, priv);
                }
              }
            ];

            ui_dropMenu($(this), actionsList, {id : "macro-roll"});

            ev.stopPropagation();
            ev.preventDefault();
            return false;
          });
        }
        link.replaceWith(button);
      }
    });
  }
  enhancePage(preview, true);

  return preview;
}

util.effects = {
  "Lightning" : true,
  "Shake" : true,
  "Black" : true,
  "Fade In" : true,
  "Fade Out" : true,
  "Invert" : true,
  "Reset" : true,
}

util.playEffect = function(cmd) {
  var target = $(".displayApp[currentTab='"+cmd.tab+"']");
  var effects = {};
  if (cmd.tab) {
    game.state.data.tabs[cmd.tab].data = game.state.data.tabs[cmd.tab].data || {};
    game.state.data.tabs[cmd.tab].data.options = game.state.data.tabs[cmd.tab].data.options || {};
    game.state.data.tabs[cmd.tab].data.options.effects = game.state.data.tabs[cmd.tab].data.options.effects = {};
    game.state.data.tabs[cmd.tab].data.options.effects = game.state.data.tabs[cmd.tab].data.options.effects || {};
    effects = game.state.data.tabs[cmd.tab].data.options.effects;
  }

  if (cmd.effect == "Lightning") {
    if (target.length) {
      target.css("transition", "filter 0.1s");
      target.css("filter", "brightness(100)");
      setTimeout(function(){target.css("filter", "brightness(0)");}, 100);
      setTimeout(function(){target.css("filter", "brightness(10)");}, 250);
      setTimeout(function(){target.css("filter", "brightness(0)");}, 350);
      setTimeout(function(){target.css("filter", "");}, 450);
    }
    effects = {};
  }
  else if (cmd.effect == "Shake") {
    if (target.length) {
      target.css("transition", "transform 0.1s");
      target.css("transform", "translateX(0px)");
      setTimeout(function(){target.css("transform", "translateX(-50px)");}, 100);
      setTimeout(function(){target.css("transform", "translateX(50px)");}, 150);
      setTimeout(function(){target.css("transform", "translateX(-50px)");}, 200);
      setTimeout(function(){target.css("transform", "translateX(50px)");}, 250);
      setTimeout(function(){target.css("transform", "translateX(-50px)");}, 300);
      setTimeout(function(){target.css("transform", "translateX(50px)");}, 350);
      setTimeout(function(){target.css("transform", "translateX(-50px)");}, 400);
      setTimeout(function(){target.css("transform", "");}, 450);
    }
    effects = {};
  }
  else if (cmd.effect == "Black") {
    if (target.length) {
      target.css("transition", "");
      target.css("filter", "brightness(0)");
    }
    effects["brightness"] = 0;
  }
  else if (cmd.effect == "Fade In") {
    if (target.length) {
      target.css("transition", "filter 3.0s");
      target.css("filter", "brightness(0)");
      setTimeout(function(){target.css("filter", "brightness(1)");}, 100);
    }
    delete effects["Brightness"];
  }
  else if (cmd.effect == "Fade Out") {
    if (target.length) {
      target.css("transition", "filter 3.0s");
      target.css("filter", "brightness(1)");
      setTimeout(function(){target.css("filter", "brightness(0)");}, 100);
    }
    effects["Brightness"] = 0;
  }
  else if (cmd.effect == "Invert") {
    if (target.length) {
      target.css("transition", "filter 0.1s");
      target.css("filter", "invert(1)");
      setTimeout(function(){target.css("filter", "invert(0)");}, 150);
      setTimeout(function(){target.css("filter", "invert(1)");}, 450);
      setTimeout(function(){target.css("filter", "invert(0)");}, 550);
      setTimeout(function(){target.css("filter", "");}, 650);
    }
    effects = {};
  }
  else {
    if (target.length) {
      target.css("transition", "");
      target.css("filter", "");
    }
    effects = {};
  }
}

util._undo = [];
util._maxUndo = 10;
util._redo = [];
util.addUndo = function(obj, data, cmd){
  util._undo.push({obj : obj, data : duplicate(data), cmd : cmd});
  if (util._undo.length > util._maxUndo) {
    util._undo.splice(0, 1);
  }
}

util.undo = function(cmd){
  var undoData = util._undo.splice(util._undo.length-1, 1)[0];
  if (undoData) {
    undoData.obj.data = undoData.data;
    if (cmd || undoData.cmd) {
      undoData.obj.sync(cmd || undoData.cmd);
    }
    else {
      undoData.obj.update();
    }
  }
  sendAlert({text : "Undone"});
}

util.fonts = [
  '"Arial Black", Gadget, sans-serif',
  '"Comic Sans MS", cursive, sans-serif',
  'Columbus',
  'Celestia',
  'Impact, Charcoal, sans-serif',
  '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
  'Tahoma, Geneva, sans-serif',
  '"Trebuchet MS", Helvetica, sans-serif',
  'Verdana, Geneva, sans-serif',
  '"Courier New", Courier, monospace',
  '"Lucida Console", Monaco, monospace',
  '"Times New Roman", Times, serif',
  'LifeCraft',
  'StarJedi',
  'Bookinsanity',
  'Nodesto Caps Condensed',
  'Scaly Sans',
  'Zatanna Misdirection',

];

util.pageSamples = [
  {
    H1F : "Nodesto Caps Condensed",
    H1FS : 2.7,
    H2C : "rgba(51,1,0,1)",
    H2F : "Nodesto Caps Condensed",
    H2FS : 2.1,
    H2S : null,
    HR : "rgba(190,4,15,1.0)",
    HR2 : "rgba(91,1,0,1)",
    style : {
      "background-image": "url('/content/sheet3.png')",
      "background-size": "100% auto",
      "font-family": "Bookinsanity",
      "font-size": "1.15em"
    },
    bgStyle : {

    }
  },
  {
    HR : "rgba(5,200,5,1)",
    style : {
      "font-family": "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif",
      "background": "linear-gradient(rgba(0,255,0,0.2),  rgba(0,0,0,0.0), rgba(0,255,0,0.2))",
      "background-size": "100% 4px",
      "font-size": "1.0em",
      "color": "rgb(5, 200, 5)",
      "text-shadow": "0 0 8px rgb(5, 200, 5)",
      "font-weight": "bolder",
      "padding": "3em"
    },
    bgStyle : {
      "background": "radial-gradient(rgb(35,65,35), rgb(0,30,0))"
    }
  },
  {
    HR : "rgb(0, 115, 130)",
    style : {
      "padding": "2em",
      "margin-top": "43px",
      "margin-bottom": "73px",
      "margin-left": "2.75em",
      "margin-right": "3em",
      "color": "rgb(0, 230, 230)",
      "text-shadow": "0em 0em 4px rgb(0, 230, 230)",
      "overflow": "auto",
      "max-height": "640px",
      "display": "block"
    },
    bgStyle : {
      "background-image": "url('/content/tablet.png')",
      "background-size": "contain",
      "background-repeat": "no-repeat",
      "background-position": "center",
      "font-size": "1.2em"
    }
  }

];

util.interfaces = {
  "Organization" : {
    "Column" : {
      content : {
        classes : "flexcolumn flex flexbetween flexcontainer",
        display : [],
      },
    },
    "Row" : {
      content : {
        classes : "flexrow flex flexbetween flexcontainer",
        display : [],
      },
    },
  },
  "Inputs" : {
    "Field" : {
      content : {
        classes : "flexrow",
        target : "%Target%",
        edit : {classes : "line lrmargin"}
      },
      arguments : {
        "%Target%" : {
          datalist : "character",
        }
      }
    },
    "Min-Max Field" : {
      content : {
        classes : "flexrow flexaround bold flexcontainer", display : [
          {classes : "bold", name : "R@c.%Target%.name"},
          {classes : "flexrow flexaround flexcontainer", display : [
            {name : "", target : "%Target%", edit : {classes : "line", style : {width : "24px", "text-align" : "center"}}},
            {classes : "lrmargin bold", value : "/"},
            {name : "", target : "%Target%", edit : {classes : "line", style : {width : "24px", "text-align" : "center"}, raw : "max"}},
          ]}
        ]
      },
      arguments : {
        "%Target%" : {
          datalist : "character",
        }
      }
    },
    "Bar" : {
      content : {
        classes : "flexrow",
        target : "%Target%",
        ui : "ui_progressBar"
      },
      arguments : {
        "%Target%" : {
          datalist : "character",
        }
      }
    },
    "Image" : {
      content : {
        classes : "flexcolumn flex flexcontainer smooth outline white margin",
        style : {"position" : "relative"},
        display : [
          {
            classes : "flexcolumn flex",
            ui : "ui_image",
            target : "info.img",
            style : {"min-width" : "100px", "min-height" : "100px"},
          },
          {style : {"position" : "absolute", "right" : "0", "bottom" : "0"}, title : "Map Token", target : "info.img", ui : "ui_token", scope : {classes : "smooth outline white"}}
        ]
      },
    },
    "Label" : {
      content : {
        classes : "bold flexmiddle",
        value : "%Value%",
      },
      arguments : {
        "%Value%" : {
          value : "Label",
        }
      }
    },
    "Notes" : {
      content : {
        classes : "flexcolumn flex padding white smooth outline",
        ui : "ui_rawNotes",
      }
    },
  },
  "Lists" : {
    "Stat List" : {
      content : {
        classes : "flexrow flexaround flexwrap flex",
        target : "stats",
        datalist : {
          classes : "spadding flexcolumn flexmiddle lrmargin bold outline inactive flex",
          display : [
            {classes : "flexrow flexmiddle subtitle", display : [
              {classes : "flexmiddle", ui : "ui_link", scope : {name : "@c.%dataTarget%.name", icon : "'list-alt'", click : "ui_modifiers", lookup : "@applyTarget", attr : {"modsOnly" : true}}},
            ]},
            {classes : "flexrow flexmiddle lrmargin bold", display : [
              {
                name : "", target : "%dataTarget%", edit : {classes : "bold white outline flexmiddle fit-x", style : {"width" : "70px", "height" : "40px"}, raw : "1"},
              },
            ]},
          ]
        }
      },
    },
    "Inventory" : {
      content : {
        classes : "flexcolumn flex padding", display : [
          {classes : "flexrow underline", style : {"font-size" : "1.4em"}, display : [
            {classes : "bold lrmargin", name : "Inventory"},
            {
              classes : "bold flexmiddle create subtitle lrmargin",
              style : {"cursor" : "pointer"},
              icon : "plus",
              click : {create : "inventory"}
            }
          ]},
          {
            classes : "flex spadding white outline smooth",
            style : {"text-align" : "left", "overflow-y" : "auto"},
            scrl : "inv",
            ui : "ui_entryList",
            scope : {
              drop : "inventoryDrop",
              connectWith : ".inventoryDrop",
              reposition : true,
              lookup : "inventory",
              applyUI : {classes : "flexrow flex subtitle", display : [
                {
                  classes : "flexcolumn",
                  ui : "ui_image",
                  target : "@applyTarget.info.img",
                  style : {"width" : "15px", "height" : "15px"},
                  scope : {def : "/content/icons/Backpack1000p.png"},
                },
                {name : "", target : "@applyTarget.info.quantity", edit : {classes : "lrmargin line middle", title : "Quantity", style : {"width" : "24px"}, raw : "1"}},
                {classes : "flex lrpadding", name : "", target : "@applyTarget.info.name", edit : {classes : "lrpadding line flex", style : {"min-width" : "70px"}, raw : "1"}},
                {classes : "bold hover2 spadding white outline smooth flexrow flexmiddle subtitle",
                  value : "(@c.@applyTarget.tags.equipped==0)?('Equip'):('Un-equip')", style : {"white-space" : "nowrap"},
                  click : {calc : [{target : "@applyTarget.tags.equipped", cond : "@c.@applyTarget.tags.equipped==0", eq : "1"},{target : "@applyTarget.tags.equipped", cond : "@c.@applyTarget.tags.equipped==1", eq : "0"}]}
                },
                {name : "", target : "@applyTarget.info.weight", edit : {classes : "lrmargin line middle",title : "Weight", style : {"width" : "24px"}, raw : "1"}},
                {
                  classes : "flexmiddle",
                  name : "",
                  link : "edit",
                  target : "@applyTarget",
                  click : {edit : "@applyTarget"}
                },
                {
                  classes : "flexmiddle destroy lrmargin",
                  name : "",
                  link : "trash",
                  click : {delete : true, target : "@applyTarget"}
                },
              ]}
            }
          },
        ]
      },
    },
    "Spellbook" : {
      content : {
        classes : "flexcolumn flex padding", display : [
          {classes : "flexrow underline", style : {"font-size" : "1.4em"}, display : [
            {classes : "bold lrmargin", name : "Spellbook"},
            {
              classes : "bold flexmiddle create subtitle lrmargin",
              style : {"cursor" : "pointer"},
              icon : "plus",
              click : {create : "spellbook"}
            }
          ]},
          {
            classes : "flex spadding white outline smooth",
            style : {"text-align" : "left", "overflow-y" : "auto"},
            scrl : "spl",
            ui : "ui_entryList",
            scope : {
              drop : "spellbookDrop",
              connectWith : ".spellbookDrop",
              reposition : true,
              lookup : "spellbook",
              applyUI : {classes : "flexrow flex subtitle", display : [
                {
                  classes : "flexcolumn",
                  ui : "ui_image",
                  target : "@applyTarget.info.img",
                  style : {"width" : "15px", "height" : "15px"},
                  scope : {def : "/content/icons/Backpack1000p.png"},
                },
                {name : "", target : "@applyTarget.info.quantity", edit : {classes : "lrmargin line middle", title : "Quantity", style : {"width" : "24px"}, raw : "1"}},
                {classes : "flex lrpadding", name : "", target : "@applyTarget.info.name", edit : {classes : "lrpadding line flex", style : {"min-width" : "70px"}, raw : "1"}},
                {name : "", target : "@applyTarget.info.weight", edit : {classes : "lrmargin line middle",title : "Weight", style : {"width" : "24px"}, raw : "1"}},
                {
                  classes : "flexmiddle",
                  name : "",
                  link : "edit",
                  target : "@applyTarget",
                  click : {edit : "@applyTarget"}
                },
                {
                  classes : "flexmiddle destroy lrmargin",
                  name : "",
                  link : "trash",
                  click : {delete : true, target : "@applyTarget"}
                },
              ]}
            }
          },
        ]
      },
    },
    "Talents" : {
      content : {
        classes : "flexcolumn flex spadding",
        display : [
          {
            "classes": "flexcolumn lrmargin",
            "display": [
              {
                "classes": "flexrow outlinebottom lrpadding",
                "display": [
                  {
                    "classes": "bold",
                    "name": "New Talent"
                  },
                  {
                    "classes": "bold flexmiddle create lrmargin",
                    "style": {
                      "cursor": "pointer"
                    },
                    "icon": "plus",
                    "click": {
                      "create": "talents"
                    }
                  }
                ]
              },
              {
                "target": "talents",
                "classes" : "spadding scroll-y",
                "scrl" : "tlnt",
                "datalist": {
                  "classes": "flexrow flexbetween",
                  "display": [
                    {
                      "classes": "link flex",
                      "title": "@%dataTarget%",
                      "name": "",
                      "target": "%dataTarget%",
                      "value": "@c.%dataTarget%.name",
                      "click": {
                        "view": "talents"
                      }
                    },
                    {
                      "classes": "flexmiddle",
                      "name": "",
                      "target": "%dataTarget%",
                      "link": "edit",
                      "click": {
                        "edit": "talents"
                      }
                    },
                    {
                      "classes": "flexmiddle destroy",
                      "name": "",
                      "link": "trash",
                      "click": {
                        "delete": true,
                        "target": "%dataTarget%"
                      }
                    }
                  ]
                }
              },
            ]
          }
        ]
      }
    },
    "Special Rules" : {
      content : {
        classes : "flexcolumn flex spadding",
        display : [
          {
            "classes": "flexcolumn lrmargin",
            "display": [
              {
                "classes": "flexrow outlinebottom lrpadding",
                "display": [
                  {
                    "classes": "bold",
                    "name": "Special rules"
                  },
                  {
                    "classes": "bold flexmiddle create lrmargin",
                    "style": {
                      "cursor": "pointer"
                    },
                    "icon": "plus",
                    "click": {
                      "create": "specials"
                    }
                  }
                ]
              },
              {
                "target": "specials",
                "classes" : "spadding scroll-y",
                "scrl" : "spcl",
                "datalist": {
                  "classes": "flexrow flexbetween",
                  "display": [
                    {
                      "classes": "link flex",
                      "title": "@%dataTarget%",
                      "name": "",
                      "target": "%dataTarget%",
                      "value": "@c.%dataTarget%.name",
                      "click": {
                        "view": "specials"
                      }
                    },
                    {
                      "classes": "flexmiddle",
                      "name": "",
                      "target": "%dataTarget%",
                      "link": "edit",
                      "click": {
                        "edit": "specials"
                      }
                    },
                    {
                      "classes": "flexmiddle destroy",
                      "name": "",
                      "link": "trash",
                      "click": {
                        "delete": true,
                        "target": "%dataTarget%"
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    },
    "Trained Skills" : {
      content : {
        "classes": "flexcolumn",
        "display": [
          {
            "classes": "flexrow flexmiddle underline bold",
            "style": {
              "font-size": "1.4em"
            },
            "display": [
              {
                "name": "Skills"
              },
              {
                "classes": "bold flexmiddle create subtitle lrmargin",
                "style": {
                  "cursor": "pointer"
                },
                "icon": "plus",
                "click": {
                  "create": "skills"
                }
              }
            ]
          },
          {
            "classes": "flexcolumn flex padding white outline smooth scroll-y",
            "scrl" : "skls",
            "ui": "ui_skillList",
            "scope": {
              "lookup": "skills",
              "applyUI": {
                "classes": "flexrow flexaround flex subtitle smooth",
                "display": [
                  {
                    "classes": "flexrow flexmiddle",
                    "display": [
                      {
                        "title": "Trained?",
                        "target": "skills.@skillKey",
                        "ui": "ui_checkbox",
                        "scope": {
                          "saveInto": "skills.@skillKey",
                          "cond": "R@c.skills.@skillKey==1",
                          "checked": "1",
                          "unchecked": "0"
                        }
                      },
                      {
                        "style": {
                          "width": "150px",
                          "text-align": "left"
                        },
                        "title": "@skillKey",
                        "classes": "lrpadding bold subtitle",
                        "ui": "ui_link",
                        "scope": {
                          "name": "@c.skills.@skillKey.name",
                          "click": "ui_modifiers",
                          "lookup": "skills.@skillKey",
                          "attr": {
                            "modsOnly": true
                          }
                        }
                      },
                      {
                        "cond": "R@c.skills.@skillKey<1",
                        "name": "",
                        "title": "Rank Modifier",
                        "target": "skills.@skillKey",
                        "edit": {
                          "classes": "line middle lrmargin",
                          "mod": "rank",
                        }
                      },
                      {
                        "cond": "R@c.skills.@skillKey>0",
                        "name": "",
                        "title": "Rank Modifier",
                        "target": "skills.@skillKey",
                        "edit": {
                          "classes": "line middle lrmargin",
                          "mod": "rank",
                          "style": {
                            "width": "50px"
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        ]
      },
    }
  },
  "Interactive" : {
    "Equation Button" : {
      content : {
        classes : "bold hover2 spadding white outline smooth flexmiddle",
        value : "%Macro%",
        click : {action : "%Action%"}
      },
      arguments : {
        "%Action%" : {
          value : "",
        },
        "%Macro%" : {
          value : "",
        }
      }
    },
  }
}

util.premadeSheets = {};

util.customSheets = function(obj, app, scope, sheet){
  return [
    {
      name : "Blank Notes",
      click : function(){
        var style = sheet.style || {};
        obj.data._d = {
          style : style,
          content : {classes : "flexcolumn flex lpadding flexcontainer", display : [
            {classes : "flexrow flexbetween", display : [
              {classes : "flexcolumn flex padding",
                display : [
                  {
                    classes : "flexcolumn smooth outline flex white",
                    ui : "ui_image",
                    target : "info.img",
                    style : {"min-width" : "100px", "min-height" : "100px"},
                  }
                ]
              },
              {classes : "flexcolumn flex2", display : [
                {classes : "flexrow lrmargin spadding", target : "info.name", edit : {classes : "line fit-x lrmargin"}},
                {
                  classes : "flexcolumn flex2",
                  ui : "ui_characterNotes",
                  scope : {style : {"min-height" : "200px"}}
                },
              ]},
            ]}
          ]},
        }
        obj.sync("updateSheet");
      }
    },
    {
      name : "Container",
      click : function(){
        var style = sheet.style || {};
        merge(style, {padding : "1em"});
        obj.data._d = {
          style : style,
          content : {classes : "flexrow flexbetween flex flexcontainer", display : [
              {classes : "flexcolumn flex padding",
                display : [
                  {
                    classes : "flexcolumn smooth outline flex white",
                    ui : "ui_image",
                    target : "info.img",
                    style : {"min-width" : "100px", "min-height" : "100px"},
                  }
                ]
              },
              {classes : "flexcolumn flex2 lrmargin", display : [
                {classes : "flexrow fit-x spadding lrmargin", target : "info.name", edit : {classes : "line fit-x lrmargin"}},
                {
                  classes : "flexcolumn flex",
                  ui : "ui_characterNotes",
                  scope : {style : {"min-height" : "200px"}}
                },
                {classes : "flexcolumn padding flex", display : [
                  {style : {"font-size" : "1.6em"}, classes : "flexrow underline", display : [
                    {classes : "bold subtitle", name : "Inventory"},
                    {
                      classes : "bold create subtitle lrmargin",
                      style : {"cursor" : "pointer"},
                      icon : "plus",
                      click : {create : "inventory"}
                    },
                    {classes : "flex"},
                    {classes : "flexrow lrmargin", style : {"font-size" : "0.6em"}, name : "Max Weight", target : "stats.weight", edit : {classes : "line fit-x middle lrmargin", raw : "1", type : "number", style : {"width" : "80px"}}},
                  ]},
                  {classes : "flexrow fit-x flexbetween", display : [
                    {classes : "bold subtitle flex", name : "Name"},
                    {classes : "lrpadding lrmargin bold subtitle middle", name : "Quantity", style : {"width" : "50px"}},
                    {classes : "lrpadding lrmargin bold subtitle middle", name : "Weight", style : {"width" : "50px"}},
                    {
                      classes : "flexmiddle",
                      name : "",
                      icon : "edit",
                      style : {"color" : "transparent"},
                    },
                    {
                      classes : "flexmiddle",
                      name : "",
                      icon : "trash",
                      style : {"color" : "transparent"},
                    },
                  ]},
                  {
                    classes : "flex spadding white outline smooth",
                    style : {"text-align" : "left", "overflow-y" : "auto"},
                    scrl : "inv",
                    ui : "ui_entryList",
                    scope : {
                      drop : "inventoryDrop",
                      connectWith : ".inventoryDrop",
                      reposition : true,
                      lookup : "inventory",
                      applyUI : {classes : "flexrow flex subtitle", display : [
                        {
                          classes : "flexcolumn",
                          ui : "ui_image",
                          target : "@applyTarget.info.img",
                          style : {"width" : "20px", "height" : "20px"},
                          scope : {def : "/content/icons/Pouch1000p.png"},
                        },
                        {classes : "lrpadding flex", name : "", target : "@applyTarget.info.name", edit : {classes : "lrpadding line flex2", style : {"min-width" : "70px"}, raw : "1"}},
                        {classes : "lrpadding", name : "", target : "@applyTarget.info.quantity", edit : {classes : "lrpadding line middle", style : {"width" : "50px"}}},
                        {classes : "lrpadding", name : "", target : "@applyTarget.info.weight", edit : {classes : "lrpadding line middle", style : {"width" : "40px"}}},
                        {
                          classes : "flexmiddle",
                          name : "",
                          link : "edit",
                          target : "@applyTarget",
                          click : {edit : "@applyTarget"}
                        },
                        {
                          classes : "flexmiddle destroy lrmargin",
                          name : "",
                          link : "trash",
                          click : {delete : true, target : "@applyTarget"}
                        },
                      ]},
                    }
                  },
                  {classes : "flexrow", cond : "R@c.stats.weight>0", display : [
                    {classes : "bold subtitle lrmargin", name : "Weight (@:weight()lbs)"},
                    {classes : "spadding lrmargin flex", ui : "ui_progressBar", scope : {percentage : "@:weight()", max : "R@c.stats.weight", col : "rgb(@:int(@percentage*200),@:int(200-(@percentage*200)),0)"}},
                    {cond : "R@c.stats.weight>0", classes : "bold subtitle lrmargin", title : "Str*15", value : "@:int((@:weight()/(R@c.stats.weight))*100)+'%'"}
                  ]},
                ]}
              ]},
            ]
          },
        }
        obj.sync("updateSheet");
      }
    },
    {
      name : "Empty",
      click : function(){
        var style = sheet.style || {};
        merge(style, {padding : "1em"});
        obj.data._d = {
          style : style,
          content : {classes : "flexcolumn flex flexcontainer", display : []},
        }
        obj.sync("updateSheet");
      }
    },
    {
      name : "Notes Only",
      click : function(){
        var style = sheet.style || {};
        merge(style, {padding : "1em"});
        obj.data._d = {
          style : style,
          content : {classes : "flexrow flexbetween flex flexcontainer", display : [
              {classes : "flexcolumn flex padding",
                display : [
                  {
                    classes : "flexcolumn smooth outline flex white",
                    ui : "ui_image",
                    target : "info.img",
                    style : {"min-width" : "100px", "min-height" : "100px"},
                  }
                ]
              },
              {classes : "flexcolumn flex2 lrmargin", display : [
                {classes : "flexrow spadding lrmargin", target : "info.name", edit : {classes : "line fit-x lrmargin"}},
                {
                  classes : "flexcolumn flex2",
                  ui : "ui_characterNotes",
                  scope : {style : {"min-height" : "200px"}}
                },
              ]},
            ]
          },
        }
        obj.sync("updateSheet");
      }
    },
    {
      name : "Shop",
      submenu : [
        {
          name : "Inventory",
          click : function(){
            var style = sheet.style || {};
            merge(style, {padding : "1em"});
            obj.data._d = {
              style : style,
              content : {classes : "flexcolumn flex flexcontainer", display : [
                  {classes : "flexrow flexbetween", display : [
                    {classes : "flexcolumn flex padding",
                      display : [
                        {
                          classes : "flexcolumn smooth outline flex white",
                          ui : "ui_image",
                          target : "info.img",
                          style : {"min-width" : "100px", "min-height" : "100px"},
                        }
                      ]
                    },
                    {classes : "flexcolumn flex2 lrmargin", display : [
                      {classes : "flexrow lrmargin spadding", target : "info.name", edit : {classes : "line fit-x lrmargin"}},
                      {
                        classes : "flexcolumn flex2",
                        ui : "ui_characterNotes",
                        scope : {style : {"min-height" : "200px"}}
                      },
                    ]},
                  ]},
                  {classes : "flexcolumn padding", display : [
                    {style : {"font-size" : "1.6em"}, classes : "flexrow underline", display : [
                      {classes : "bold subtitle", name : "Shop"},
                      {
                        classes : "bold create subtitle lrmargin",
                        style : {"cursor" : "pointer"},
                        icon : "plus",
                        click : {create : "inventory"}
                      },
                    ]},
                    {classes : "flexrow fit-x flexbetween", display : [
                      {classes : "bold flex", name : "Name"},
                      {classes : "bold", name : "Quantity", style : {"width" : "80px"}},
                      {classes : "bold", name : "Price", style : {"width" : "70px"}},
                      {
                        classes : "flexmiddle",
                        name : "",
                        icon : "edit",
                        style : {"color" : "transparent"},
                      },
                      {
                        classes : "flexmiddle lrmargin",
                        name : "",
                        icon : "trash",
                        style : {"color" : "transparent"},
                      },
                    ]},
                    {
                      classes : "flex padding white outline smooth",
                      style : {"text-align" : "left", "overflow-y" : "auto"},
                      scrl : "inv",
                      ui : "ui_entryList",
                      scope : {
                        drop : "inventoryDrop",
                        connectWith : ".inventoryDrop",
                        reposition : true,
                        lookup : "inventory",
                        applyUI : {classes : "flexrow flex", display : [
                          {
                            classes : "flexcolumn",
                            ui : "ui_image",
                            target : "@applyTarget.info.img",
                            style : {"width" : "20px", "height" : "20px"},
                            scope : {def : "/content/icons/Pouch1000p.png"},
                          },
                          {classes : "lrpadding flex", name : "", target : "@applyTarget.info.name", edit : {classes : "lrpadding line flex2", style : {"min-width" : "70px"}, raw : "1"}},
                          {classes : "lrpadding", name : "", target : "@applyTarget.info.quantity", edit : {classes : "lrpadding line middle flex", style : {"width" : "60px"}}},
                          {classes : "lrmargin lrpadding white smooth outline bold flexmiddle", name : "", target : "@applyTarget.info.price", edit : {classes : "line middle", style : {"width" : "65px"}}},
                          {
                            classes : "flexmiddle",
                            name : "",
                            link : "edit",
                            target : "@applyTarget",
                            click : {edit : "@applyTarget"}
                          },
                          {
                            classes : "flexmiddle destroy lrmargin",
                            name : "",
                            link : "trash",
                            click : {delete : true, target : "@applyTarget"}
                          },
                        ]},
                      }
                    }
                  ]}
                ]
              },
            }
            obj.sync("updateSheet");
          }
        },
        {
          name : "Spells",
          click : function(){
            var style = sheet.style || {};
            merge(style, {padding : "1em"});
            obj.data._d = {
              style : style,
              content : {classes : "flexcolumn flex flexcontainer", display : [
                  {classes : "flexrow flexbetween", display : [
                    {classes : "flexcolumn flex padding",
                      display : [
                        {
                          classes : "flexcolumn smooth outline flex white",
                          ui : "ui_image",
                          target : "info.img",
                          style : {"min-width" : "100px", "min-height" : "100px"},
                        }
                      ]
                    },
                    {classes : "flexcolumn flex2 lrmargin", display : [
                      {classes : "flexrow spadding lrmargin", target : "info.name", edit : {classes : "line fit-x lrmargin"}},
                      {
                        classes : "flexcolumn flex2",
                        ui : "ui_characterNotes",
                        scope : {style : {"min-height" : "200px"}}
                      },
                    ]},
                  ]},
                  {classes : "flexcolumn padding", display : [
                    {style : {"font-size" : "1.6em"}, classes : "flexrow underline", display : [
                      {classes : "bold subtitle", name : "Shop"},
                      {
                        classes : "bold create subtitle lrmargin",
                        style : {"cursor" : "pointer"},
                        icon : "plus",
                        click : {create : "inventory"}
                      },
                    ]},
                    {classes : "flexrow fit-x flexbetween", display : [
                      {classes : "bold flex", name : "Name"},
                      {classes : "bold", name : "Quantity", style : {"width" : "80px"}},
                      {classes : "bold", name : "Price", style : {"width" : "70px"}},
                      {
                        classes : "flexmiddle",
                        name : "",
                        icon : "edit",
                        style : {"color" : "transparent"},
                      },
                      {
                        classes : "flexmiddle lrmargin",
                        name : "",
                        icon : "trash",
                        style : {"color" : "transparent"},
                      },
                    ]},
                    {
                      classes : "flex padding white outline smooth",
                      style : {"text-align" : "left", "overflow-y" : "auto"},
                      scrl : "inv",
                      ui : "ui_entryList",
                      scope : {
                        drop : "spellDrop",
                        connectWith : ".spellDrop",
                        reposition : true,
                        lookup : "spellbook",
                        applyUI : {classes : "flexrow flex", display : [
                          {
                            classes : "flexcolumn",
                            ui : "ui_image",
                            target : "@applyTarget.info.img",
                            style : {"width" : "20px", "height" : "20px"},
                            scope : {def : "/content/icons/Pouch1000p.png"},
                          },
                          {classes : "lrpadding flex", name : "", target : "@applyTarget.info.name", edit : {classes : "lrpadding line flex2", style : {"min-width" : "70px"}, raw : "1"}},
                          {classes : "lrpadding", name : "", target : "@applyTarget.info.quantity", edit : {classes : "lrpadding line middle flex", style : {"width" : "60px"}}},
                          {classes : "lrmargin lrpadding white smooth outline subtitle bold flexmiddle", name : "", target : "@applyTarget.info.price", edit : {classes : "line middle", style : {"width" : "65px"}}},
                          {
                            classes : "flexmiddle",
                            name : "",
                            link : "edit",
                            target : "@applyTarget",
                            click : {edit : "@applyTarget"}
                          },
                          {
                            classes : "flexmiddle destroy lrmargin",
                            name : "",
                            link : "trash",
                            click : {delete : true, target : "@applyTarget"}
                          },
                        ]},
                      }
                    }
                  ]}
                ]
              },
            }
            obj.sync("updateSheet");
          }
        }
      ]
    }
  ]
}

util.commands = {
  "forceToPoint" : function(data, userID){
    $(".application[ui-name='ui_board']").each(function(){
      var app = $(this);
      var board = getEnt(app.attr("index"));
      if (data.id == board.id() && !data.userID || data.userID == getCookie("UserID")) {
        boardApi.scrollTo(app, data.x, data.y, true);
        $("#"+app.attr("id")+"-zoom-range-"+data.id).val(data.zoom);
        $("#"+app.attr("id")+"-zoom-range-"+data.id).change();
      }
    });
  }
};

util.events = {
  "1" : {
    name : "Hide Layer",
    load : function(obj, app, scope, newValue) {
      // make changes to the data on selection
      obj.data = {target : "layers.0.h", eq : "1", e : newValue};
    },
    interface : function(obj, app, scope, board, pieceData) {
      var targetDiv = $("<div>");
      targetDiv.addClass("flexcolumn flex spadding");
      targetDiv.append("<b class='subtitle'>Target Layer</b>");

      var layers = $("<select>").appendTo(targetDiv);
      layers.addClass("smooth");
      for (var lid=0; lid<board.data.layers.length; lid++) {
        layers.append("<option value='"+lid+"'>"+board.data.layers[lid].n+"</option>");
      }

      layers.children().each(function(){
        obj.data.target = obj.data.target || "layers.0.h";
        if ($(this).attr("value") == obj.data.target.split(".")[1]) {
          $(this).attr("selected", true);
        }
      });
      layers.change(function(){
        obj.data = {target : "layers."+$(this).val()+".h", eq : "1", e : 1};
        obj.update();
      });

      return targetDiv;
    }
  },
  "2" : {
    name : "Reveal Layer",
    load : function(obj, app, scope, newValue) {
      obj.data = {target : "layers.0.h", eq : "0", e : newValue};
    },
    interface : function(obj, app, scope, board, pieceData) {
      var targetDiv = $("<div>");
      targetDiv.addClass("flexcolumn flex spadding");

      var layers = $("<select>").appendTo(targetDiv);
      layers.addClass("smooth");
      for (var lid=0; lid<board.data.layers.length; lid++) {
        layers.append("<option value='"+lid+"'>"+board.data.layers[lid].n+"</option>");
      }
      layers.children().each(function(){
        obj.data.target = obj.data.target || "layers.0.h";
        if ($(this).attr("value") == obj.data.target.split(".")[1]) {
          $(this).attr("selected", true);
        }
      });
      layers.change(function(){
        obj.data = {target : "layers."+$(this).val()+".h", eq : "0", e : 2};
        obj.update();
      });

      return targetDiv;
    }
  },
  "3" : {
    name : "Toggle Layer",
    load : function(obj, app, scope, newValue) {
      obj.data = {target : "layers.0.h", eq : "(@b.layers.0.h == 1)?(0):(1)", e : newValue};
    },
    interface : function(obj, app, scope, board, pieceData) {
      var targetDiv = $("<div>");
      targetDiv.addClass("flexcolumn flex spadding");

      var layers = $("<select>").appendTo(targetDiv);
      layers.addClass("smooth");

      for (var lid=0; lid<board.data.layers.length; lid++) {
        layers.append("<option value='"+lid+"'>"+board.data.layers[lid].n+"</option>");
      }
      layers.children().each(function(){
        obj.data.target = obj.data.target || "layers.0.h";
        if ($(this).attr("value") == obj.data.target.split(".")[1]) {
          $(this).attr("selected", true);
        }
      });
      layers.change(function(){
        obj.data = {target : "layers."+$(this).val()+".h", eq : "(@b.layers."+$(this).val()+".h == 1)?(0):(1)", e : 3};
        obj.update();
      });

      return targetDiv;
    }
  },
  "4" : {
    name : "Roll Dice",
    load : function(obj, app, scope, newValue) {
      obj.data = {e : newValue, msg : "Activated Trap!", data : game.templates.dice.defaults[0]};
    },
    interface : function(obj, app, scope, board, pieceData) {
      var targetDiv = $("<div>");
      targetDiv.addClass("flexcolumn flex spadding");

      var flavor = genInput({
        parent : targetDiv,
        classes : "line flex",
        value : obj.data.msg,
        placeholder : "Flavor Text (Optional)",
      });
      flavor.change(function(){
        obj.data.msg = $(this).val();
      });

      targetDiv.append("<b class='subtitle smargin'>Equation to Roll</b>");

      var equation = $("<textarea>").appendTo(targetDiv);
      equation.addClass("smooth");
      equation.attr("placeholder", "Enter a macro equation here");
      equation.text(obj.data.data || "");
      equation.change(function(){
        obj.data.data = $(this).val();
      });

      targetDiv.append("<b class='subtitle smargin'>Extra Options</b>");

      var optionsBar = $("<div>").appendTo(targetDiv);
      optionsBar.addClass("flexrow flexaround flexwrap fit-x subtitle");

      var gmOnly = $("<button>").appendTo(optionsBar);
      gmOnly.addClass("flexmiddle alttext");
      if (obj.data.p && obj.data.p.default) {
        gmOnly.addClass("highlight");
      }
      else {
        gmOnly.addClass("background");
      }
      gmOnly.text("GM Only?");
      gmOnly.click(function(){
        obj.data.p = obj.data.p || {};
        if (obj.data.p.default) {
          delete obj.data.p;
        }
        else {
          obj.data.p.default = "@:gm()";
        }
        obj.update();
      });

      var dataList = Object.keys(game.templates.display.ui);

      var ui = genInput({
        parent : optionsBar,
        classes : "line lrmargin",
        type : "list",
        list : dataList,
        value : obj.data.ui,
        placeholder : "Dice Display (Optional)",
      });
      ui.val(obj.data.ui);
      ui.change(function(){
        obj.data.ui = $(this).val();
      });

      var cond = genInput({
        parent : optionsBar,
        classes : "line flex lrmargin",
        value : obj.data.cond,
        placeholder : "Condition Macro",
      });
      cond.val(obj.data.cond);
      cond.change(function(){
        obj.data.cond = $(this).val();
      });

      return targetDiv;
    },
    fire : function(obj, app, calcData, pieceData, ctx) {
      var evData = {
        icon : calcData.data.href,
        eID : obj.id(),
        flavor : sync.eval(calcData.msg, ctx),
        p : calcData.p,
        eventData : sync.executeQuery(calcData.data, ctx),
      }
      evData.eventData.ui = calcData.ui;
      runCommand("chatEvent", evData);
    }
  },
  "5" : {
    name : "Focus on Token",
    load : function(obj, app, scope, newValue) {
      obj.data = {e : newValue};
    },
    interface : function(obj, app, scope, board, pieceData) {
      var targetDiv = $("<div>");
      targetDiv.addClass("flexcolumn flex spadding");

      return targetDiv;
    },
    fire : function(obj, app, calcData, pieceData, ctx) {
      runCommand("command", {cmd : "forceToPoint", id : obj.id(), x : pieceData.x + pieceData.w/2, y : pieceData.y + pieceData.h/2, zoom : app.attr("zoom")});
    }
  },
  "6" : {
    name : "Sound Effect",
    load : function(obj, app, scope, newValue) {
      obj.data = {e : newValue};
    },
    interface : function(obj, app, scope, board, pieceData) {
      var targetDiv = $("<div>");
      targetDiv.addClass("flexcolumn flex flexmiddle spadding");

      var soundPath = obj.data.s;

      var pickButton = $("<button>").appendTo(targetDiv);
      pickButton.addClass("background alttext subtitle");
      if (soundPath) {
        pickButton.text(soundPath);
      }
      else {
        pickButton.text("Pick Sound File");
      }
      pickButton.click(function(){
        var content = sync.render("ui_filePicker")(obj, app, {change : function(ev, ui, val){
          obj.data.s = val;
          layout.coverlay("sound-selection");
          obj.update();
        }});

        var pop = ui_popOut({
          target : app,
          prompt : true,
          id : "sound-selection",
          style : {"width" : assetTypes["filePicker"].width, "height" : assetTypes["filePicker"].height}
        }, content);
        pop.resizable();
      });

      return targetDiv;
    },
    fire : function(obj, app, calcData, pieceData, ctx) {
      runCommand("music", {src : calcData.s});
    },
  },
  "7" : {
    name : "Ping Beacon",
    load : function(obj, app, scope, newValue) {
      obj.data = {e : newValue};
    },
    interface : function(obj, app, scope, board, pieceData) {
      var targetDiv = $("<div>");
      targetDiv.addClass("flexcolumn flex flexmiddle spadding");

      return targetDiv;
    },
    fire : function(obj, app, calcData, pieceData, ctx) {
      runCommand("updateBoardCursor", {id : obj.id(), data : {x : pieceData.x + pieceData.w/2, y : pieceData.y + pieceData.h/2, l : app.attr("layer"), b : true}});
    }
  },
  "8" : {
    name : "Enable Combat",
    load : function(obj, app, scope, newValue) {
      obj.data = {combat : {engaged : {}, current : {}}, e : newValue};
    },
    interface : function(obj, app, scope, board, pieceData) {
      return sync.render("ui_turnOrder")(obj, app, scope).css("height", "400px").addClass("scroll-y");
    },
    fire : function(obj, app, calcData, pieceData, ctx) {
      var compare = function (obj1, obj2) {
        return sync.eval(game.templates.initiative.compare, {i1 : obj1, i2 : obj2});
      }

      game.state.data.combat = duplicate(calcData.combat);
      var randomInit = duplicate(calcData.combat);
      // roll the randoms if it isn't a player
      var pEnts = {};
      for (var k in game.players.data) {
        if (game.players.data[k].entity && !hasSecurity(k, "Game Master")) {
           pEnts[game.players.data[k].entity] = k;
        }
      }
      for (var i in randomInit.e) {
        if (!pEnts[randomInit.e[i]] && compare(game.state.data.combat.engaged[randomInit.e[i]], {}) == 0) {
          var sp;
          var ok;
          if (game.state.data.combat.engaged[randomInit.e[i]]) {
            if (game.state.data.combat.engaged[randomInit.e[i]].sp) {
              sp = game.state.data.combat.engaged[randomInit.e[i]].sp;
            }
            if (game.state.data.combat.engaged[randomInit.e[i]].ok) {
              ok = game.state.data.combat.engaged[randomInit.e[i]].ok;
            }
          }
          var context = sync.defaultContext();
          context[game.entities.data[randomInit.e[i]].data._t] = duplicate(game.entities.data[randomInit.e[i]].data);
          game.state.data.combat.engaged[randomInit.e[i]] = sync.executeQuery(game.templates.initiative.query, context).pool;
          game.state.data.combat.engaged[randomInit.e[i]].sp = sp;
          game.state.data.combat.engaged[randomInit.e[i]].ok = ok;
        }
      }
      game.state.data.combat.current = {};

      for (var id in game.state.data.combat.engaged) {
        if (compare(game.state.data.combat.engaged[id], game.state.data.combat.current) > 0) {
          game.state.data.combat.current = duplicate(game.state.data.combat.engaged[id]);
        }
      }
      game.state.data.combat.round = sync.newValue("Round", 0);
      game.state.sync("updateCombatState");
      runCommand("enableCombat");
    }
  },
  "9" : {
    name : "View Media",
    load : function(obj, app, scope, newValue) {
      obj.data = {e : newValue};
    },
    interface : function(obj, app, scope, board, pieceData) {
      var targetDiv = $("<div>");
      targetDiv.addClass("flexcolumn flex flexmiddle spadding");

      var filePath = obj.data.src;

      var pickButton = $("<button>").appendTo(targetDiv);
      pickButton.addClass("background alttext subtitle");
      if (filePath) {
        pickButton.text(filePath);
      }
      else {
        pickButton.text("Pick File");
      }
      pickButton.click(function(){
        var content = sync.render("ui_filePicker")(obj, app, {change : function(ev, ui, val){
          obj.data.src = val;
          layout.coverlay("sound-selection");
          obj.update();
        }});

        var pop = ui_popOut({
          target : app,
          prompt : true,
          id : "sound-selection",
          style : {"width" : assetTypes["filePicker"].width, "height" : assetTypes["filePicker"].height}
        }, content);
        pop.resizable();
      });

      return targetDiv;
    },
    fire : function(obj, app, calcData, pieceData, ctx) {
      assetTypes[util.mediaType(calcData.src)].preview({}, app, calcData.src);
    },
  },
  "10" : {
    name : "Move Token",
    load : function(obj, app, scope, newValue) {
      obj.data = {e : newValue};
    },
    interface : function(obj, app, scope, board, pieceData) {
      var targetDiv = $("<div>");
      targetDiv.addClass("flexcolumn flex flexmiddle spadding");

      var selectWrap = $("<div>").appendTo(targetDiv);
      selectWrap.addClass("flexrow fit-x flexbetween");
      selectWrap.append("<b class='flex'>Movement Type</b>");

      var select = genInput({
        parent : selectWrap,
        select : {
          "None" : null,
          "Relative" : "Relative",
          "Specific Point" : "Specific Point"
        },
        value : obj.data.mv
      });
      select.change(function(){
        obj.data.mv = $(this).val();
        obj.update();
      });

      if (!obj.data.mv) {

      }
      else {
        if (obj.data.mv == "Relative") {
          var inputWrap = $("<div>").appendTo(targetDiv);
          inputWrap.addClass("flexrow flexaround fit-x subtitle");
          inputWrap.append("<b class='flex'>Move Horizonally (Negative = Left, Positive = Right)</b>");

          var x = genInput({
            parent : inputWrap,
            value : boardApi.scale(obj.data.x, board),
            style : {"width" : "50px"},
          });
          x.change(function(){
            obj.data.x = boardApi.scale(Number($(this).val()), board, true);
            obj.update();
          });

          var inputWrap = $("<div>").appendTo(targetDiv);
          inputWrap.addClass("flexrow flexaround fit-x subtitle");
          inputWrap.append("<b class='flex'>Move Vertically (Negative = Up, Positive = Down)</b>");

          var y = genInput({
            parent : inputWrap,
            value : boardApi.scale(obj.data.y, board),
            style : {"width" : "50px"},
          });
          y.change(function(){
            obj.data.y = boardApi.scale(Number($(this).val()), board, true);
            obj.update();
          });
        }
        else {
          var inputWrap = $("<div>").appendTo(targetDiv);
          inputWrap.addClass("flexrow flexaround fit-x subtitle");
          inputWrap.append("<b class='flex'>Move To X</b>");

          var x = genInput({
            parent : inputWrap,
            value : boardApi.scale(obj.data.x, board),
            style : {"width" : "50px"},
          });
          x.change(function(){
            obj.data.x = boardApi.scale(Number($(this).val()), board, true);
            obj.update();
          });

          var inputWrap = $("<div>").appendTo(targetDiv);
          inputWrap.addClass("flexrow flexaround fit-x subtitle");
          inputWrap.append("<b class='flex'>Move to Y</b>");

          var y = genInput({
            parent : inputWrap,
            value : boardApi.scale(obj.data.y, board),
            style : {"width" : "50px"},
          });
          y.change(function(){
            obj.data.y = boardApi.scale(Number($(this).val()), board, true);
            obj.update();
          });
        }

        var clear = genIcon("trash", "Reset").appendTo(selectWrap);
        clear.addClass("destroy subtitle lrmargin");
        clear.click(function(){
          delete obj.data.x;
          delete obj.data.y;
          delete obj.data.mv;
          obj.update();
        });
        var button = $("<div>").appendTo(targetDiv);
        button.addClass("background alttext flexmiddle spadding subtitle hover2 smooth outline");
        button.text("Select Point");
        button.click(function(){
          var hasGrid = (board.data.gridW && board.data.gridH);
          if (hasGrid) {
            sendAlert({text : "Select Grid (Shift+Click for Exact)"});
          }
          else {
            sendAlert({text : "Select Point"});
          }

          boardApi.newDragEvent({
            move : function(ev){},
            end : function(ev) {
              var appid;
              var stage;
              for (var i in boardApi.apps) {
                if (boardApi.apps[i].board == board.id()) {
                  stage = boardApi.apps[i].stage;
                  appid = i;
                  break;
                }
              }
              var focal = stage.toLocal({x : ev.pageX, y : ev.pageY});
              var xPos = focal.x;
              var yPos = focal.y;
              if (!_down[16] && hasGrid) {
                xPos = Math.floor((focal.x-(board.data.gridX || 0)) / board.data.gridW) * board.data.gridW + (board.data.gridX || 0);
                yPos = Math.floor((focal.y-(board.data.gridY || 0)) / board.data.gridH) * board.data.gridH + (board.data.gridY || 0);
              }
              if (obj.data.mv == "Relative") {
                obj.data.x = xPos-pieceData.x;
                obj.data.y = yPos-pieceData.y;
              }
              else {
                obj.data.x = xPos;
                obj.data.y = yPos;
              }
              boardApi.scrollTo($("#"+appid), focal.x, focal.y);
              obj.update();
              delete boardApi.dragging;
            }
          });
        });

      }
      return targetDiv;
    },
    fire : function(obj, app, calcData, pieceData, ctx) {
      for (var key in boardApi.selections) {
        var selectData = boardApi.selections[key];
        if (selectData.app == app.attr("id") && selectData.type == "p") {
          if (calcData.mv == "Relative") {
            obj.data.layers[selectData.layer].p[selectData.index].x += calcData.x;
            obj.data.layers[selectData.layer].p[selectData.index].y += calcData.y;
          }
          else {
            obj.data.layers[selectData.layer].p[selectData.index].x = calcData.x;
            obj.data.layers[selectData.layer].p[selectData.index].y = calcData.y;
          }
          boardApi.updateObject(selectData.layer, "p", selectData.index, obj);
          runCommand("boardMove", {id : obj.id(), layer : selectData.layer, type : "p", index : selectData.index, data : obj.data.layers[selectData.layer].p[selectData.index]});
        }
      }
      if (calcData.mv == "Relative") {
        boardApi.scrollTo(app, pieceData.x + pieceData.w/2 + calcData.x, pieceData.y + pieceData.h/2 + calcData.y);
      }
      else {
        boardApi.scrollTo(app, pieceData.w/2 + calcData.x, pieceData.h/2 + calcData.y);
      }
    },
  },
}

util.calcAPI = {
  sign : function(args, targets){
    var val = (Number(sync.eval(args[0], targets))>=0)?("+"+Number(sync.eval(args[0], targets))):(Number(sync.eval(args[0], targets)));
    return "'"+val+"'";
  },
  int : function(args, targets){
    return parseInt(sync.eval(args[0], targets));
  },
  num : function(args, targets){
    return parseFloat(sync.eval(args[0], targets));
  },
  str : function(args, targets) {
    return String(args[0]);
  },
  raw : function(args, targets) {
    return String(sync.reduce(args[0], targets, true, true));
  },
  eval : function(args, targets) {
    return sync.eval(args[0], targets);
  },
  gm : function(args, targets){
    if (hasSecurity(getCookie("UserID"), "Assistant Master")) {
      return "1";
    }
    return "0";
  },
  armor : function(args, targets) {
    if (!targets || !game.templates || !game.templates.display) {return "0"}
    if (targets["c"] && !args[1]) {
      var val;
      if (game.templates.display.sheet && game.templates.display.sheet.rules && game.templates.display.sheet.rules.baseArmor) {
        val = duplicate(sync.rawVal(game.templates.display.sheet.rules.baseArmor)) || 0;
      }
      else {
        val = sync.eval(game.templates.constants.basearmor, targets) || 0;
      }
      if (val instanceof Object) {
        for (var k in val) {
          val[k] = sync.eval(val[k], targets);
        }
      }
      else {
        val = sync.eval(val, targets);
      }
      if (targets["c"].inventory) {
        for (var index in targets["c"].inventory) {
          var itemData = targets["c"].inventory[index];
          itemData.tags = itemData.tags || {};
          var itemArmor = duplicate(sync.rawVal(itemData.equip.armor)) || 0;
          if (itemData.tags["equipped"] && itemArmor) {
            var armorBonus = 0;
            for (var i in itemData.equip.armor.modifiers) {
              armorBonus += sync.eval(itemData.equip.armor.modifiers[i], targets);
            }
            if (itemArmor instanceof Object) {
              for (var k in val) {
                if (itemArmor[k]) {
                  val[k] += sync.eval(itemArmor[k], targets) + armorBonus;
                }
                else {
                  val[k] += armorBonus;
                }
              }
            }
            else {
              val += sync.eval(itemArmor, targets) + armorBonus;
            }
          }
        }
      }
      if (args[0]){
        return val[args[0]];
      }
      else {
        return val;
      }
    }
    if (targets["i"]) {
      var itemData = targets["i"];
      var itemArmor = duplicate(sync.rawVal(itemData.equip.armor)) || 0;
      if (itemArmor) {
        if (args[1]) {
          itemArmor = 0;
        }
        var armorBonus = 0;
        for (var i in itemData.equip.armor.modifiers) {
          armorBonus += sync.eval(itemData.equip.armor.modifiers[i], targets);
        }
        if (itemArmor instanceof Object) {
          for (var k in itemArmor) {
            itemArmor[k] = sync.eval(itemArmor[k], targets) + armorBonus;
          }
        }
        else {
          itemArmor = sync.eval(itemArmor, targets) + armorBonus;
        }
        return itemArmor;
      }
      return 0;
    }
    return 0;
  },
  weight : function(args, targets) {
    if (!targets || !game.templates || !game.templates.display) {return "0"}
    if (targets["c"]) {
      var weight = 0;
      for (var index in targets["c"].inventory) {
        weight += (sync.rawVal(targets["c"].inventory[index].info.quantity) || 0) * (sync.rawVal(targets["c"].inventory[index].info.weight) || 0);
      }
      return weight;
    }
  },
  equip : function(args, targets) {
    if (!targets || !game.templates || !game.templates.display) {return "0"}
    if (targets["c"]) {
      if (game.templates.display.sheet && game.templates.display.sheet.rules && game.templates.display.sheet.rules[args[0]]) {
        val = duplicate(sync.rawVal(game.templates.display.sheet.rules[args[0]])) || 0;
      }
      else {
        val = sync.eval(game.templates.constants[args[0]], targets) || 0;
      }
      if (val instanceof Object) {
        for (var k in val) {
          val[k] = sync.eval(val[k], targets);
        }
      }
      else {
        val = sync.eval(val, targets);
      }
      if (targets["c"].inventory) {
        for (var index in targets["c"].inventory) {
          var itemData = targets["c"].inventory[index];
          itemData.tags = itemData.tags || {};
          var itemArmor = duplicate(sync.rawVal(itemData.equip[args[1]])) || 0;
          if (itemData.tags["equipped"] && itemArmor) {
            var armorBonus = 0;
            for (var i in itemData.equip[args[1]].modifiers) {
              armorBonus += sync.eval(itemData.equip[args[1]].modifiers[i], targets);
            }
            if (itemArmor instanceof Object) {
              for (var k in val) {
                if (itemArmor[k]) {
                  val[k] += sync.eval(itemArmor[k], targets) + armorBonus;
                }
                else {
                  val[k] += armorBonus;
                }
              }
            }
            else {
              val += sync.eval(itemArmor, targets) + armorBonus;
            }
          }
        }
      }
      return val;
    }
    if (targets["i"]) {
      var itemData = targets["i"];
      var itemArmor = duplicate(sync.rawVal(itemData.equip[args[0]])) || 0;
      if (itemArmor) {
        var armorBonus = 0;
        for (var i in itemData.equip[args[0]].modifiers) {
          armorBonus += sync.eval(itemData.equip[args[0]].modifiers[i], targets);
        }
        if (itemArmor instanceof Object) {
          for (var k in itemArmor) {
            itemArmor[k] = sync.eval(itemArmor[k], targets) + armorBonus;
          }
        }
        else {
          itemArmor = sync.eval(itemArmor, targets) + armorBonus;
        }
        return itemArmor;
      }
      return 0;
    }
    return 0;
  },
  t : function(args, targets) {
    if (!targets) {return "0"}
    if (targets["c"] && !args[1]) {
      if (targets["c"].tags[args[0]]) {
        return 1;
      }
      else {
        return 0;
      }
    }
    if (targets[args[1]]) {
      if (targets[args[1]].tags[args[0]]) {
        return 1;
      }
      else {
        return 0;
      }
    }
  },
  "explode" : function(args, targets) {
    var maxLoop = 1000;
    var loop = 0;
    var cachedTargets = duplicate(targets);
    var expVal = sync.eval(args[0], cachedTargets);
    cachedTargets.val = expVal;
    var cond = sync.eval(args[1], cachedTargets);
    while (cond) {
      cachedTargets.val = sync.eval(args[0], cachedTargets);
      expVal = expVal + cachedTargets.val;
      cond = sync.eval(args[1], cachedTargets);
      loop++;
      if (loop > maxLoop) {
        sendAlert({text : "Error Processing Equation"});
        console.log(equation);
        return "0";
      }
    }
    return expVal;
  },
  total : function(args, targets) {
    var maxLoop = 1000;
    var loop = 0;
    var expVal = sync.eval(args[0], targets);
    var cond = sync.eval(args[1], targets);
    while (loop < cond) {
      expVal = expVal + sync.eval(args[0], targets);
      cond = sync.eval(args[1], targets);
      loop++;
      if (loop > maxLoop) {
        sendAlert({text : "Error Processing Equation"});
        console.log(equation);
        return "0";
      }
    }
    return expVal;
  },
  /*roll : function(args, targets) {
    setTimeout(function(){
      util.processEvent(args[0]);
    }, 100);
  },
  chat : function(args, targets) {
    setTimeout(function(){
      util.chatEvent(args[0], sync.eval(args[1] || "@me.name", targets));
    }, 100);
  },*/
  rand : function(args, targets) {
    if (Number(args[0]) >= Math.random()) {
      return 1;
    }
    return 0;
  },
  table : function(args, targets) {
    var maxLoop = 1000;
    var loop = 0;
    var expVal = sync.eval(args[0], targets);
    var cond = sync.eval(args[1], targets);

    if (game.templates.tables[expVal]) {
      if (game.templates.tables[expVal][cond]) {
        return sync.eval(game.templates.tables[expVal][cond], targets);
      }
      else {
        var reg = /(\d*)-(\d*)/i;
        var keys = Object.keys(game.templates.tables[expVal]);
        for (var i in keys) {
          var val = keys[i];
          var match = val.match(reg);
          if (match) {
            if (match[1] <= cond && cond <= match[2]) {
              return sync.eval(game.templates.tables[expVal][val], targets);
            }
            loop++;
            if (loop > maxLoop) {
              sendAlert({text : "Error Processing Equation"});
              console.log(equation);
              return "0";
            }
          }
        }
      }
    }
    return "0";
  },
  constant : function(args, targets) {
    var key = sync.eval(args[0], targets);
    if (game.templates.constants && (game.templates.constants[key] || game.templates.constants[String(key).toLowerCase()])) {
      return sync.eval(game.templates.constants[key] || game.templates.constants[String(key).toLowerCase()], targets);
    }
    return "0";
  },
  valid : function(args, targets) {
    var key = sync.reduce(args[0], targets, true).trim();
    if (key != null) {
      return 1;
    }
    return "0";
  },
};

util.trimCanvas = function(ctx) { // removes transparent edges
    var x, y, w, h, top, left, right, bottom, data, idx1, idx2, found, imgData;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
    if (!w && !h) { return false }
    imgData = ctx.getImageData(0, 0, w, h);
    data = new Uint32Array(imgData.data.buffer);
    idx1 = 0;
    idx2 = w * h - 1;
    found = false;
    // search from top and bottom to find first rows containing a non transparent pixel.
    for (y = 0; y < h && !found; y += 1) {
        for (x = 0; x < w; x += 1) {
            if (data[idx1++] && !top) {
                top = y + 1;
                if (bottom) { // top and bottom found then stop the search
                    found = true;
                    break;
                }
            }
            if (data[idx2--] && !bottom) {
                bottom = h - y - 1;
                if (top) { // top and bottom found then stop the search
                    found = true;
                    break;
                }
            }
        }
        if (y > h - y && !top && !bottom) { return false } // image is completely blank so do nothing
    }
    top -= 1; // correct top
    found = false;
    // search from left and right to find first column containing a non transparent pixel.
    for (x = 0; x < w && !found; x += 1) {
        idx1 = top * w + x;
        idx2 = top * w + (w - x - 1);
        for (y = top; y <= bottom; y += 1) {
            if (data[idx1] && !left) {
                left = x + 1;
                if (right) { // if left and right found then stop the search
                    found = true;
                    break;
                }
            }
            if (data[idx2] && !right) {
                right = w - x - 1;
                if (left) { // if left and right found then stop the search
                    found = true;
                    break;
                }
            }
            idx1 += w;
            idx2 += w;
        }
    }
    left -= 1; // correct left
    if(w === right - left + 1 && h === bottom - top + 1) { return true } // no need to crop if no change in size
    w = right - left + 1;
    h = bottom - top + 1;
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    ctx.putImageData(imgData, -left, -top);
    return true;
}
