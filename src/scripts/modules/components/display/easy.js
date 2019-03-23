sync.render("ui_easySheets", function(obj1, app, scope) {
  var div = $("<div>");
  div.addClass("flexcolumn flex padding");

  var obj = getEnt(app.attr("target"));

  var targetApp;
  if (app.attr("targetapp")) {
    targetApp = $("#"+app.attr("targetapp"));
  }
  else {
    targetApp = app;
  }

  var data = obj.data;

  var sheetData;
  if (obj.data.sheets) {
    sheetData = obj.data.sheets[Number(targetApp.attr("tileSheet") || 0)];
  }


  var currentCollection = $("<div>").appendTo(div);
  currentCollection.addClass("flexrow flexbetween");

  var createWrap = $("<div>").appendTo(currentCollection);
  createWrap.addClass("alttext flexmiddle");

  var select = $("<select>").appendTo(createWrap);
  select.addClass("subtitle bold");
  select.css("color", "#333");
  select.css("text-shadow", "none");
  select.append("<option value='"+(targetApp.attr("tileSheet") || 0)+"'>Sheet "+(targetApp.attr("tileSheet") || 0)+"</option>");
  for (var key in obj.data.sheets) {
    if (key != (targetApp.attr("tileSheet") || 0) && obj.data.sheets[key].objs && obj.data.sheets[key].objs.length) {
      select.append("<option value='"+key+"'>Sheet "+key+"</option>");
    }
  }
  select.change(function(){
    targetApp.attr("tileSheet", $(this).val());
    obj1.update();
  });
  select.click(function(ev){
    ev.stopPropagation();
  });


  var createWrap = $("<div>").appendTo(currentCollection);
  createWrap.addClass("alttext flexmiddle");

  var next = genIcon("", "Next").appendTo(createWrap);
  next.addClass("subtitle");
  next.click(function(){
    var newSheet = Number(targetApp.attr("tileSheet") || 0) + 1;
    if (obj.data.sheets && newSheet >= obj.data.sheets.length) {
      newSheet = 0;
    }
    targetApp.attr("tileSheet", newSheet);
    obj1.update();
  });


  var createWrap = $("<div>").appendTo(currentCollection);
  createWrap.addClass("alttext flexmiddle");

  var create = genIcon("cloud-download", "Load").appendTo(createWrap);
  create.addClass("subtitle")
  create.attr("title", "Load Tile Sheet");
  create.click(function(ev){
    var newApp = sync.newApp("ui_boardStamps", null, {tile : true, board : obj.id()});

    var pop = ui_popOut({
      target : $("body"),
      id : "load-tiles",
      style : {"width" : "400px", height : "600px"}
    }, newApp);
    pop.resizable();
    ev.stopPropagation();
    ev.preventDefault();
  });

  if (sheetData) {
    if (sheetData.legal) {
      var legalWrap = $("<a>").appendTo(currentCollection);
      legalWrap.addClass("flexrow flexmiddle subtitle");
      legalWrap.addClass("alttext");
      legalWrap.attr("href", sheetData.legal.href);
      legalWrap.attr("target", "_");

      if (sheetData.legal.img) {
        var icon = $("<div>").appendTo(legalWrap);
        icon.addClass("smooth");
        icon.attr("title", sheetData.legal.name);
        icon.css("background-repeat", "no-repeat");
        icon.css("background-position", "center");
        icon.css("width", "32px");
        icon.css("height", "32px");
        icon.css("background-size", "cover");
        icon.css("background-image", "url('"+sheetData.legal.img+"')");
        icon.tooltip({
          container: 'body',
          placement: 'right'
        });
      }
    }

    var columns = $("<div>").appendTo(div);
    columns.addClass("flexcolumn flex");

    var tileListWrap = $("<div>").appendTo(columns);
    tileListWrap.addClass("flexcolumn flex");
    tileListWrap.css("position", "relative");
    tileListWrap.css("overflow", "auto");
    tileListWrap.attr("_lastScrollTop", targetApp.attr("_lastTileScrollTop"));
    tileListWrap.scroll(function(){
      targetApp.attr("_lastTileScrollTop", $(this).scrollTop());
    });

    if (sheetData.objs) {
      var load = new Image();
      load.src = sheetData.i;
      load.onload = function(){
        var tileList = $("<div>").appendTo(tileListWrap);
        tileList.addClass("flexrow flexbetween flexwrap fit-x");
        tileList.css("min-width", "100%");
        tileList.css("position", "absolute");

        for (var i=0; i<sheetData.objs.length; i++) {
          var tileData = sheetData.objs[i];
          tileData.s = Number(targetApp.attr("tileSheet") || 0);
          var canvasWrap = $("<div>").appendTo(tileList);
          canvasWrap.addClass("hover2 smooth");
          canvasWrap.attr("index", i);
          canvasWrap.css("position", "relative");
          canvasWrap.css("overflow", "hidden");
          canvasWrap.css("width", 50);
          canvasWrap.css("height", 50);
          canvasWrap.css("margin", "0.25em");
          canvasWrap.click(function(){
            if (checkbox.prop("checked")) {
              randomRot = true;
            }
            tileList.children().removeClass("highlight");
            floatingTile = duplicate(sheetData.objs[$(this).attr("index")]);
            floatingTile.sheet = $(this).attr("index");
            $(this).addClass("highlight");
          });
          canvasWrap.contextmenu(function(){
            var index = $(this).attr("index");
            var actionsList = [
              {
                name : "Remove",
                click : function(){
                  sheetData.objs.splice(index, 1);
                  if (!scope.local) {
                    obj.sync("updateAsset");
                  }
                  else {
                    obj.update();
                  }
                }
              },
            ];

            ui_dropMenu($(this), actionsList, {id : "tile-option"});
            return false;
          });

          var img = $("<canvas>").appendTo(canvasWrap);
          img.attr("width", 50);
          img.attr("height", 50);
          img.css("position", "absolute");
          img.css("pointer-events", "none");

          var tileW = sheetData.gW + sheetData.p;
          var tileH = sheetData.gH + sheetData.p;
          var xGrid = Math.ceil(sheetData.w/(tileW));
          var yGrid = Math.ceil(sheetData.h/(tileH));

          var aspectW = 1;
          var aspectH = 1;
          if (sheetData.nW && sheetData.nH) {
            aspectW = sheetData.w/sheetData.nW;
            aspectH = sheetData.h/sheetData.nH;
          }

          var sX = (tileData.i % xGrid) * tileW;
          var sY = Math.floor(tileData.i / xGrid) * tileH;

          var w = (tileData.gW * (data.gridW || 64));
          var h = (tileData.gH * (data.gridH || 64));
          var sW = (tileData.gW || 1) * sheetData.gW + ((tileData.gW || 1)-1) * sheetData.p;
          var sH = (tileData.gH || 1) * sheetData.gH + ((tileData.gH || 1)-1) * sheetData.p;

          var isHex = obj.data.options && obj.data.options.hex;

          var dummyCanvas = $("<canvas>");
          dummyCanvas.attr("width", Math.max(w,h));
          dummyCanvas.attr("height", Math.max(w,h));

          if (tileData.t && (w >= (data.gridW || w) && h >= (data.gridH || h))) {
            var tileX = (tileData.gW || 1) * sheetData.gW + ((tileData.gW || 1)-1) * sheetData.p;
            var tileY = (tileData.gH || 1) * sheetData.gH + ((tileData.gH || 1)-1) * sheetData.p;
            var gridX = Math.floor((w || obj.data.gridW)/tileX);
            var gridY = Math.floor((h || obj.data.gridH)/tileY);
            var width = (tileX || w || obj.data.gridW);
            var height = (tileY || h || obj.data.gridH);
            for (var x=0; x<gridX; x++) {
              for (var y=0; y<gridY; y++) {
                dummyCanvas.drawImage({
                  source : sheetData.i,
                  x : (x * width),
                  y : (y * height),
                  width : width,
                  height : height,
                  sWidth: tileX,
                  sHeight: tileY,
                  sx: sX, sy: sY,
                  fromCenter : false,
                  rotate : tileData.r || 0,
                });
              }
            }
          }
          else {
            dummyCanvas.drawRect({
              fillStyle : (w==h)?("transparent"):("rgba(235,235,228,0.4)"),
              x : Math.max(h-w, 0)/2, y : Math.max(w-h, 0)/2,
              width : w,
              height : h,
              fromCenter : false,
            });
            dummyCanvas.drawImage({
              source : sheetData.i,
              x : Math.max(h-w, 0)/2, y : Math.max(w-h, 0)/2,
              width : w,
              height : h,
              sWidth: sW / aspectW,
              sHeight: sH / aspectH,
              sx: sX / aspectW, sy: sY / aspectH,
              fromCenter: false,
              rotate : tileData.r || 0,
            });
          }
          img.drawImage({
            source : dummyCanvas[0],
            layer : true,
            width : 50, height : 50,
            strokeStyle: "rgba(0,0,0,0)",
            strokeWidth: 4,
            fromCenter : false,
          });
        }
      }
    }

    var searchDiv = $("<div>").appendTo(columns);
    searchDiv.addClass("flexrow fit-x flexbetween");

    var tilemode = $("<button>");//.appendTo(searchDiv);
    tilemode.addClass("subtitle");
    if (targetApp.attr("background") == "true") {
      tilemode.text("Tile Mode");
    }
    else {
      tilemode.text("Stamp Mode");
    }
    tilemode.click(function(){
      if ($("#save-changes").length) {
        $("#save-changes").remove();
      }
      if (targetApp.attr("background") == "true") {
        boardApi.saveChanges(obj, true)
        targetApp.removeAttr("background");
        targetApp.removeAttr("ignore");
        targetApp.removeAttr("local");

        layout.coverlay("save-changes");
      }
      else {
        targetApp.attr("background", true);
        obj.update();
      }
    });

    if (targetApp.attr("background") == "true") {
      tilemode.addClass("highlight alttext");
    }

    var searchWrap = $("<div>")//.appendTo(searchDiv);
    searchWrap.addClass("flexrow flexmiddle alttext");

    genIcon("search").appendTo(searchWrap);

    var search = genInput({
      parent : searchWrap,
      classes : "line lrpadding lrmargin"
    });

    var checkWrap = $("<button>").appendTo(searchDiv);
    checkWrap.addClass("flexmiddle alttext background subtitle");
    checkWrap.click(function(){
      checkbox.click();
    });

    var checkbox = genInput({
      type : "checkbox",
      parent : checkWrap,
      style : {"margin" : "0"}
    }).addClass("random-rotation-check");
    if (randomRot) {
      checkbox.prop("checked", true);
      checkWrap.removeClass("background");
      checkWrap.addClass("highlight");
    }
    checkbox.change(function(){
      if ($(this).prop("checked") == true) {
        randomRot = true;
        if (boardApi.apps[targetApp.attr("id")].floatingImage && boardApi.apps[targetApp.attr("id")].floatingImage.tileData) {
          floatingTile.r = Math.floor(Math.random() * 4) * 90;
          boardApi.apps[app.attr("id")].floatingImage.children[0].rotation = (floatingTile.r || 0)/180 * (Math.PI);
        }
        $(this).parent().addClass("highlight");
        $(this).parent().removeClass("background");
      }
      else {
        randomRot = false;
        if (boardApi.apps[targetApp.attr("id")].floatingImage && boardApi.apps[targetApp.attr("id")].floatingImage.tileData) {
          floatingTile.r = 0;
          boardApi.apps[app.attr("id")].floatingImage.children[0].rotation = 0;
        }
        $(this).parent().removeClass("highlight");
        $(this).parent().addClass("background");
      }
    });
    checkbox.click(function(ev){
      ev.stopPropagation();
    });

    $("<b class'lrpadding subtitle'>Random Rotation</b>").appendTo(checkWrap);

    var showAtlas = $("<button>").appendTo(searchDiv);
    showAtlas.addClass("subtitle background alttext");
    showAtlas.text("Tile Sheet");
    showAtlas.click(function(){
      var newApp = sync.newApp("ui_sheet");
      newApp.attr("index", targetApp.attr("tileSheet") || 0);

      if (sheetData.i) {
        newApp.attr("hideOptions", true);
      }
      obj.addApp(newApp);
      var popout = ui_popOut({
        target : $(this),
        id : "sheet-"+(targetApp.attr("tileSheet") || 0)+"-display",
        dragThickness : "0.5em",
        align : "top",
        minimize : true,
        title : "sheet",
        style : {"width" : "60vw", "height" : "70vh"}
      }, newApp);
      popout.addClass("board-"+app.attr("board")+"-sheet-controls");
      popout.resizable();
    });
  }

  return div;
});
