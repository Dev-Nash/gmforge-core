var titleUpdate = 0;

sync.render("ui_pieceBuilder", function(obj, app, scope){
  app.parent().parent().css("opacity", "1.0");

  var div = $("<div>");
  div.addClass("flexcolumn fit-xy padding");

  var existingPiece;
  var board = getEnt(app.attr("target"));
  var hasRights = hasSecurity(getCookie("UserID"), "Rights", board.data) || hasSecurity(getCookie("UserID"), "Game Master");

  var layer = obj.data.layer;
  var piece = obj.data.piece;

  var pieceData = obj.data.pieceData;

  if (layer  != null && piece != null) {
    if (board && board.data && board.data.layers[layer] && board.data.layers[layer].p[piece]) {
      existingPiece = board.data.layers[layer].p[piece];
    }
    else {
      delete obj.data.layer;
      delete obj.data.piece;
      layer = null;
      piece = null;
    }
  }

  var navBar = $("<div>").appendTo(div);
  navBar.addClass("flexrow middle size2");

  var health = $("<div>").appendTo(navBar);
  health.addClass("spadding flex alttext subtitle outline smooth");
  health.text("Auras & HP");
  health.click(function(){
    obj.data.advanced = "health";
    obj.update();
  });

  var assets = $("<div>").appendTo(navBar);
  assets.addClass("spadding alttext subtitle outline smooth");
  assets.text("Assets");
  assets.click(function(){
    obj.data.advanced = "assets";
    obj.update();
  });

  var apperance = $("<div>").appendTo(navBar);
  apperance.addClass("spadding alttext subtitle outline smooth");
  apperance.text("Basic");
  apperance.click(function(){
    delete obj.data.advanced;
    obj.update();
  });

  var logic = $("<div>").appendTo(navBar);
  logic.addClass("spadding alttext subtitle outline smooth");
  logic.text("Logic");
  logic.click(function(){
    obj.data.advanced = "logic";
    obj.update();
  });

  if (!obj.data.advanced) {
    apperance.addClass("highlight");
    assets.addClass("background hover2");
    logic.addClass("background hover2");
    health.addClass("background hover2");
  }
  else if (obj.data.advanced == "assets") {
    apperance.addClass("background hover2");
    assets.addClass("highlight");
    logic.addClass("background hover2");
    health.addClass("background hover2");
  }
  else if (obj.data.advanced == "logic") {
    apperance.addClass("background hover2");
    assets.addClass("background hover2");
    health.addClass("background hover2");
    logic.addClass("highlight");
  }
  else if (obj.data.advanced == "health") {
    apperance.addClass("background hover2");
    assets.addClass("background hover2");
    logic.addClass("background hover2");
    health.addClass("highlight");
  }

  div.append("<div class='spadding'></div>")

  if (existingPiece) {
    if (!obj.data.advanced) {
      var inWrap = $("<div>").appendTo(div);
      inWrap.addClass("flexrow flexbetween outlinebottom");

      inWrap.append("<b class='subtitle dull' style='white-space:nowrap;'>Token Title</b>");

      var title = genInput({
        parent : inWrap,
        value : existingPiece.t,
        classes : "line alttext flex middle subtitle size2",
        placeholder : "Token Title",
      });
      title.click(function(ev){
        ev.stopPropagation();
      });
      title.bind("input", function(){
        board.data.layers[layer].p[piece].t = $(this).val();
        boardApi.lookup(layer, "p", piece, $("#"+app.attr("targetApp"))).update();
      });
      title.change(function(){
        board.data.layers[layer].p[piece].t = $(this).val();
        boardApi.updateObject(layer, "p", piece, board);
        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
      });

      var coords = $("<div>").appendTo(div);
      coords.addClass("flexrow flexaround");

      var inputWrap = $("<div>").appendTo(coords);
      inputWrap.addClass("flexcolumn dull");
      inputWrap.click(function(ev){
        ev.stopPropagation();
      });

      var inWrap = $("<div>").appendTo(inputWrap);
      inWrap.addClass("flexrow flexbetween");

      inWrap.append("<b class='subtitle'>X</b>");
      inWrap.append("<text class='flex'></text>");

      var title = genInput({
        parent : inWrap,
        value : boardApi.scale(existingPiece.x, board),
        classes : "line alttext middle subtitle",
        placeholder : "X",
        style : {"width" : "45px"},
      });
      title.bind("input", function(){
        board.data.layers[layer].p[piece].x = boardApi.scale(Number($(this).val() || 0), board, true);
        boardApi.updateObject(layer, "p", piece, board);
      });
      title.change(function(){
        board.data.layers[layer].p[piece].x = boardApi.scale(Number($(this).val() || 0), board, true);
        boardApi.updateObject(layer, "p", piece, board);
        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
      });

      inWrap.append("<b class='subtitle'>"+(board.data.options.unit || "")+"</b>");

      var inWrap = $("<div>").appendTo(inputWrap);
      inWrap.addClass("flexrow flexbetween");

      inWrap.append("<b class='subtitle'>Y</b>");
      inWrap.append("<text class='flex'></text>");

      var title = genInput({
        parent : inWrap,
        value : boardApi.scale(existingPiece.y, board),
        classes : "line alttext middle subtitle",
        placeholder : "Y",
        style : {"width" : "45px"},
      });
      title.bind("input", function(){
        board.data.layers[layer].p[piece].y = boardApi.scale(Number($(this).val() || 0), board, true);
        boardApi.updateObject(layer, "p", piece, board);
      });
      title.change(function(){
        board.data.layers[layer].p[piece].y = boardApi.scale(Number($(this).val() || 0), board, true);
        boardApi.updateObject(layer, "p", piece, board);
        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
      });

      inWrap.append("<b class='subtitle'>"+(board.data.options.unit || "")+"</b>");

      var inWrap = $("<div>").appendTo(inputWrap);
      inWrap.addClass("flexrow flexbetween");

      inWrap.append("<b class='subtitle'>Width</b>");
      inWrap.append("<text class='flex'></text>");

      var title = genInput({
        parent : inWrap,
        value : boardApi.scale(existingPiece.w, board),
        classes : "line alttext middle subtitle",
        placeholder : "Width",
        style : {"width" : "45px"},
      });
      title.bind("input", function(){
        board.data.layers[layer].p[piece].w = boardApi.scale(Number($(this).val() || 10), board, true);
        boardApi.updateObject(layer, "p", piece, board);
      });
      title.change(function(){
        board.data.layers[layer].p[piece].w = boardApi.scale(Number($(this).val() || 10), board, true);
        boardApi.updateObject(layer, "p", piece, board);
        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
      });

      inWrap.append("<b class='subtitle'>"+(board.data.options.unit || "")+"</b>");

      var inWrap = $("<div>").appendTo(inputWrap);
      inWrap.addClass("flexrow flexbetween");

      inWrap.append("<b class='subtitle'>Height</b>");
      inWrap.append("<text class='flex'></text>");

      var title = genInput({
        parent : inWrap,
        value : boardApi.scale(existingPiece.h, board),
        classes : "line alttext middle subtitle",
        placeholder : "Height",
        style : {"width" : "45px"},
      });
      title.bind("input", function(){
        board.data.layers[layer].p[piece].h = boardApi.scale(Number($(this).val() || 10), board, true);
        boardApi.updateObject(layer, "p", piece, board);
      });
      title.change(function(){
        board.data.layers[layer].p[piece].h = boardApi.scale(Number($(this).val() || 10), board, true);
        boardApi.updateObject(layer, "p", piece, board);
        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
      });

      inWrap.append("<b class='subtitle'>"+(board.data.options.unit || "")+"</b>");

      var inWrap = $("<div>").appendTo(inputWrap);
      inWrap.addClass("flexrow flexbetween");

      inWrap.append("<b class='subtitle'>Move</b>");
      inWrap.append("<text class='flex'></text>");

      var title = genInput({
        parent : inWrap,
        value : (existingPiece.o != null && existingPiece.o.Move)?(existingPiece.o.Move.d):(null),
        classes : "line alttext subtitle middle",
        placeholder : "",
        style : {"width" : "45px"},
      });
      title.bind("input", function(){
        board.data.layers[layer].p[piece].o = board.data.layers[layer].p[piece].o || {};
        board.data.layers[layer].p[piece].o["Move"] = {d : $(this).val(), s : 1};
        boardApi.updateObject(layer, "p", piece, board);
      });
      title.change(function(){
        board.data.layers[layer].p[piece].o = board.data.layers[layer].p[piece].o || {};
        board.data.layers[layer].p[piece].o["Move"] = {d : $(this).val(), s : 1};
        boardApi.updateObject(layer, "p", piece, board);
        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
      });

      inWrap.append("<b class='subtitle'>"+(board.data.options.unit || "")+"</b>");


      var inWrap = $("<div>").appendTo(inputWrap);
      inWrap.addClass("flexrow flexbetween");

      inWrap.append("<b class='subtitle'>Sight</b>");
      inWrap.append("<text class='flex'></text>");

      var title = genInput({
        parent : inWrap,
        value : (existingPiece.o != null && existingPiece.o.Sight)?(existingPiece.o.Sight.d):(null),
        classes : "line alttext subtitle middle",
        placeholder : "",
        style : {"width" : "45px"},
      });
      title.bind("input", function(){
        board.data.layers[layer].p[piece].o = board.data.layers[layer].p[piece].o || {};
        if ($(this).val() == "") {
          delete board.data.layers[layer].p[piece].o["Sight"];
        }
        else {
          board.data.layers[layer].p[piece].o["Sight"] = {d : $(this).val()};
        }
        boardApi.updateObject(layer, "p", piece, board);
      });
      title.change(function(){
        board.data.layers[layer].p[piece].o = board.data.layers[layer].p[piece].o || {};
        if ($(this).val() == "") {
          delete board.data.layers[layer].p[piece].o["Sight"];
        }
        else {
          board.data.layers[layer].p[piece].o["Sight"] = {d : $(this).val()};
        }
        boardApi.updateObject(layer, "p", piece, board);
        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
      });

      inWrap.append("<b class='subtitle'>"+(board.data.options.unit || "")+"</b>");

      var image = existingPiece.i;
      if (!image && existingPiece.eID && getEnt(existingPiece.eID) && getEnt(existingPiece.eID).data) {
        image = sync.rawVal(getEnt(existingPiece.eID).data.info.img) || "/content/icons/blankchar.png";
      }

      var imgWrap = $("<div>").appendTo(coords);
      imgWrap.addClass("flexmiddle");

      var imgPreview = $("<div>").appendTo(imgWrap);
      imgPreview.addClass("flexcolumn link smooth flexmiddle outline smooth");
      imgPreview.css("background", existingPiece.c || "white");
      imgPreview.css("background-image", "url('"+image+"')");
      imgPreview.css("background-size", "contain");
      imgPreview.css("background-position", "center");
      imgPreview.css("background-repeat", "no-repeat");
      imgPreview.css("position", "relative");
      imgPreview.css("width", "100px");
      imgPreview.css("height", "100px");


      if (!image) {
        var inputWrap = $("<div>").appendTo(imgPreview);
        inputWrap.addClass("flexrow flexmiddle subtitle fit-x");
        inputWrap.css("color", "#333");
        inputWrap.css("text-shadow", "none");
        inputWrap.text('Token Image');
      }

      imgPreview.click(function(){
        var imgList = sync.render("ui_filePicker")(obj, app, {
          filter : "img",
          value : existingPiece.i,
          change : function(ev, ui, value){
            layout.coverlay("icons-picker");
            board.data.layers[layer].p[piece].i = value;
            runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
            boardApi.updateObject(layer, "p", piece, board);
            obj.update();
          }
        });

        var pop = ui_popOut({
          target : $(this),
          prompt : true,
          id : "icons-picker",
          align : "top",
          style : {"width" : assetTypes["filePicker"].width, "height" : assetTypes["filePicker"].height}
        }, imgList);
        pop.resizable();
      });

      var pieceColor = $("<div>").appendTo(div);
      pieceColor.addClass("flexcolumn flexmiddle");
      pieceColor.css("font-size", "7.2px");

      pieceColor.append("<div class='padding'></div>");

      var primaryCol = sync.render("ui_colorPicker")(obj, app, {
        hideColor : true,
        custom : false,
        colors : [
          "rgba(187,0,0,1)",
          "rgba(187,0,0,0.5)",
          "rgba(255,153,0,1)",
          "rgba(255,153,0,0.5)",
          "rgba(255,240,0,1)",
          "rgba(255,240,0,0.5)",
          "rgba(0,187,0,1)",
          "rgba(0,187,0,0.5)",
          "rgba(0,115,230,1)",
          "rgba(0,115,230,0.5)",
          "rgba(176,0,187,1)",
          "rgba(176,0,187,0.5)",
          "rgba(255,255,255,1)",
          "rgba(255,255,255,0.5)",
        ],
        colorChange : function(ev, ui, value){
          if (existingPiece) {
            board.data.layers[layer].p[piece].c = value;
            boardApi.updateObject(layer, "p", piece, board);
            runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
          }
          else {
            pieceData.c = value;
            obj.update();
          }
        }
      }).addClass("subtitle").appendTo(pieceColor);
      var primaryCol = sync.render("ui_colorPicker")(obj, app, {
        hideColor : true,
        custom : false,
        colors : [
          "rgba(137,0,0,1)",
          "rgba(137,0,0,0.5)",
          "rgba(205,103,0,1)",
          "rgba(205,103,0,0.5)",
          "rgba(205,190,0,1)",
          "rgba(205,190,0,0.5)",
          "rgba(0,137,0,1)",
          "rgba(0,137,0,0.5)",
          "rgba(0,65,180,1)",
          "rgba(0,65,180,0.5)",
          "rgba(126,0,137,1)",
          "rgba(126,0,137,0.5)",
          "rgba(155,155,155,1)",
          "rgba(155,155,155,0.5)",
        ],
        colorChange : function(ev, ui, value){
          if (existingPiece) {
            board.data.layers[layer].p[piece].c = value;
            boardApi.updateObject(layer, "p", piece, board);
            runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
          }
          else {
            pieceData.c = value;
            obj.update();
          }
        }
      }).addClass("subtitle").appendTo(pieceColor);
      var primaryCol = sync.render("ui_colorPicker")(obj, app, {
        hideColor : true,
        custom : false,
        colors : [
          "rgba(77,0,0,1)",
          "rgba(77,0,0,0.5)",
          "rgba(145,43,0,1)",
          "rgba(145,43,0,0.5)",
          "rgba(145,130,0,1)",
          "rgba(145,130,0,0.5)",
          "rgba(0,77,0,1)",
          "rgba(0,77,0,0.5)",
          "rgba(0,5,120,1)",
          "rgba(0,5,120,0.5)",
          "rgba(66,0,77,1)",
          "rgba(66,0,77,0.5)",
          "rgba(55,55,55,1)",
          "rgba(55,55,55,0.5)",
        ],
        colorChange : function(ev, ui, value){
          if (existingPiece) {
            board.data.layers[layer].p[piece].c = value;
            boardApi.updateObject(layer, "p", piece, board);
            runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
          }
          else {
            pieceData.c = value;
            obj.update();
          }
        }
      }).addClass("subtitle").appendTo(pieceColor);

      pieceColor.append("<div class='padding'></div>");

      var primaryCol = sync.render("ui_shapePicker")(obj, app, {
        size : 20,
        color : pieceData.c || "transparent",
        selected : pieceData.d,
        selectedClass : "white outline smooth",
        shapeChange : function(ev, ui, newShape){
          if (existingPiece) {
            board.data.layers[layer].p[piece].d = newShape;
            boardApi.updateObject(layer, "p", piece, board);
            runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
          }
          else {
            pieceData.d = newShape;
          }
          obj.update();
        }
      }).addClass("inactive outline smooth").appendTo(pieceColor);

      var previewOptions = $("<div>").appendTo(div);
      previewOptions.addClass("flexbetween fit-x");

      var tScaleWrap = $("<div>").appendTo(previewOptions);
      tScaleWrap.addClass("flexcolumn flexmiddle padding");
      tScaleWrap.append("<b class='subtitle'>Token Scale</b>");

      var tScale = genInput({
        parent : tScaleWrap,
        type : "range",
        step : 25,
        min : 50,
        value : Number(existingPiece.ts || 1) * 100,
        max : 200,
      });
      tScale.bind("input", function(){
        board.data.layers[layer].p[piece].ts = Number($(this).val())/100;
        boardApi.updateObject(layer, "p", piece, board);
      });
      tScale.change(function(){
        board.data.layers[layer].p[piece].ts = Number($(this).val())/100;
        boardApi.updateObject(layer, "p", piece, board);
        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
      });
      tScale.contextmenu(function(){
        $(this).val(100);
        $(this).change();
        return false;
      });

      var tScaleWrap = $("<div>").appendTo(previewOptions);
      tScaleWrap.addClass("flexcolumn flexmiddle padding");
      tScaleWrap.append("<b class='subtitle'>Rotation</b>");

      var tScale = genInput({
        parent : tScaleWrap,
        type : "range",
        step : 15,
        min : 0,
        value : existingPiece.r || 0,
        max : 360,
      });
      tScale.bind("input", function(){
        board.data.layers[layer].p[piece].r = $(this).val() % 360;
        boardApi.updateObject(layer, "p", piece, board);
      });
      tScale.change(function(){
        board.data.layers[layer].p[piece].r = $(this).val() % 360;
        boardApi.updateObject(layer, "p", piece, board);
        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
      });
      tScale.contextmenu(function(){
        $(this).val(0);
        $(this).change();
        return false;
      });
    }
    else if (obj.data.advanced == "assets") {
      var assetLinkWrap = $("<div>").appendTo(div);
      assetLinkWrap.addClass("flexcolumn flex");
      assetLinkWrap.append("<b class='fit-x flexmiddle'>Attached Assets</b>");
      assetLinkWrap.css("height", "200px");

      var assetLinksScroll = $("<div>").appendTo(assetLinkWrap);
      assetLinksScroll.addClass("smooth outline flex");
      assetLinksScroll.css("position", "relative");
      assetLinksScroll.css("overflow-y", "auto");
      assetLinksScroll.css("background", "rgba(0,0,0,0.4)");

      var assetLinks = $("<div>").appendTo(assetLinksScroll);
      assetLinks.addClass("fit-x flexcolumn");
      assetLinks.css("position", "absolute");
      assetLinks.css("padding-bottom", "1em");

      if (existingPiece.eID) {
        if (existingPiece.eID instanceof Object) {
          for (var idx=0; idx<existingPiece.eID.length; idx++) {
            var char = getEnt(existingPiece.eID[idx]);
            var entDiv = $("<div>").appendTo(assetLinks);
            entDiv.addClass("flexcolumn");
            entDiv.css("color", "#333");
            entDiv.css("text-shadow", "none");
            if (idx > 0) {
              entDiv.addClass("subtitle");
            }
            else {
              entDiv.addClass("outlinebottom smooth");
              entDiv.css("font-size", "1.2em");
            }
            entDiv.css("position", "relative");
            entDiv.css("overflow", "visible");
            entDiv.css("background-repeat", "no-repeat");
            entDiv.css("background-position", "center");
            entDiv.css("background-size", "contain");
            var ent = sync.render("ui_ent")(char, entDiv, {
              click : function(ev, plate, char){
                plate.contextmenu();
                ev.stopPropagation();
                ev.preventDefault();
              },
              draw : function(ui, char) {
                ui.removeClass("outline");
              }
            }).appendTo(entDiv);
            ent.addClass("white");
          }
        }
        else {
          var char = getEnt(existingPiece.eID);
          var entDiv = $("<div>").appendTo(assetLinks);
          entDiv.addClass("flexcolumn");
          entDiv.css("color", "#333");
          entDiv.css("text-shadow", "none");

          if (idx > 0) {
            entDiv.addClass("subtitle");
          }
          else {
            entDiv.addClass("outlinebottom smooth");
            entDiv.css("font-size", "1.2em");
          }
          entDiv.css("position", "relative");
          entDiv.css("overflow", "visible");
          entDiv.css("background-repeat", "no-repeat");
          entDiv.css("background-position", "center");
          entDiv.css("background-size", "contain");
          var ent = sync.render("ui_ent")(char, entDiv, {
            click : function(ev, plate, char){
              plate.contextmenu();
              ev.stopPropagation();
              ev.preventDefault();
            }
          }).appendTo(entDiv);
          ent.addClass("white");
        }
        var removeLinks = genIcon("remove").appendTo(assetLinksScroll);
        removeLinks.addClass("destroy spadding flexmiddle");
        removeLinks.css("position", "absolute");
        removeLinks.css("bottom", "0");
        removeLinks.css("right", "0");
        removeLinks.click(function(){
          if (board.data.layers[layer].p[piece].eID instanceof Object) {
            board.data.layers[layer].p[piece].eID = board.data.layers[layer].p[piece].eID[0];
          }
          else {
            delete board.data.layers[layer].p[piece].eID;
          }
          runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
          obj.update();
        });
      }

      var createAssetLink = genIcon("plus", "Attach Asset").appendTo(assetLinksScroll);
      createAssetLink.addClass("create spadding subtitle lrmargin");
      createAssetLink.css("position", "absolute");
      createAssetLink.css("bottom", "0");
      createAssetLink.css("left", "0");
      createAssetLink.click(function(){
        var ignore = {};
        if (existingPiece.eID instanceof Object) {
          for (var key in existingPiece.eID) {
            ignore[existingPiece.eID[key]] = true;
          }
        }
        else {
          ignore[existingPiece.eID] = true;
        }

        var content = sync.render("ui_assetPicker")(obj, app, {
          rights : "Visible",
          category : (Object.keys(ignore).length)?("b"):("c"),
          ignore : ignore,
          select : function(ev, ui, ent, options){
            var indx = board.data.layers[layer].p[piece].eID;
            if (!(indx instanceof Object)) {
              board.data.layers[layer].p[piece].eID = [];
              if (indx != null) {
                board.data.layers[layer].p[piece].eID.push(indx);
              }
            }
            if ((board.data.layers[layer].p[piece].eID instanceof Object) && board.data.layers[layer].p[piece].eID.length == 0 && ent.data._t == "c") {
              board.data.layers[layer].p[piece].eID = ent.id();
            }
            else {
              board.data.layers[layer].p[piece].eID.push(ent.id());
            }
            boardApi.updateObject(layer, "p", piece, board);
            runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
            obj.update();

            ignore = ignore || {};
            ignore[ent.id()] = true;
            return true;
          }
        });

        var popOut = ui_popOut({
          target : $("body"),
          prompt : true,
          id : "add-asset",
          title : "Attach Link",
          style : {"width" : assetTypes["assetPicker"].width, "height" : assetTypes["assetPicker"].height}
        }, content);
        popOut.resizable();
      });
    }
    else if (obj.data.advanced == "health") {
      var auraWrap = $("<div>").appendTo(div);
      auraWrap.addClass("flexcolumn");
      auraWrap.append("<b class='fit-x flexmiddle'>Auras</b>");
      auraWrap.css("height", "200px");

      var aurasScroll = $("<div>").appendTo(auraWrap);
      aurasScroll.addClass("smooth outline flex");
      aurasScroll.css("position", "relative");
      aurasScroll.css("overflow-y", "auto");
      aurasScroll.css("background", "rgba(0,0,0,0.4)");

      var auras = $("<div>").appendTo(aurasScroll);
      auras.addClass("fit-x flexcolumn");
      auras.css("position", "absolute");
      auras.css("padding-bottom", "1em");

      for (var key in existingPiece.o) {
        var threatWrap = $("<div>").appendTo(auras);
        threatWrap.addClass("flexcolumn flexbetween");

        var titleThreat = $("<div>").appendTo(threatWrap);
        titleThreat.addClass("flexrow flexbetween");

        var newThreat = $("<div>").appendTo(threatWrap);
        newThreat.addClass("flexrow flexbetween");

        var col = $("<div>").appendTo(titleThreat);
        col.addClass("hover2 flex flexmiddle subtitle underline");
        col.attr("index", key);
        col.text(key);
        col.click(function(){
          var aura = $(this);
          var key = $(this).attr("index");
          var actionsList = [];
          var submenu = [
            "rgba(34,34,34,1)",
            "rgba(187,0,0,1)",
            "rgba(255,153,0,1)",
            "rgba(255,240,0,1)",
            "rgba(0,187,0,1)",
            "rgba(0,115,230,1)",
            "rgba(176,0,187,1)",
            "rgba(255,115,255,1)",
            "rgba(255,255,255,1)",
          ];
          for (var i in submenu) {
            actionsList.push({
              icon : "tint",
              style : {"background-color" : submenu[i], "color" : "transparent"},
              attr : {"bgcol" : submenu[i]},
              click : function(ev, ui){
                var value = ui.attr("bgcol");
                if (existingPiece) {
                  board.data.layers[layer].p[piece].o[key].c = value.replace(",1)", ",0.35)");
                  boardApi.updateObject(layer, "p", piece, board);
                  runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
                }
                else {
                  pieceData.o[key].c = value.replace(",1)", ",0.35)");
                }
                obj.update();
              },
            });
          }
          actionsList.push({
            icon : "cog",
            click : function(){
              var primaryCol = sync.render("ui_colorPicker")(obj, app, {
                hideColor : true,
                custom : true,
                colorChange : function(ev, ui, col){
                  var value =  col;
                  if (existingPiece) {
                    board.data.layers[layer].p[piece].o[key].c = value;
                    boardApi.updateObject(layer, "p", piece, board);
                    runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
                  }
                  else {
                    pieceData.o[key].c = value;
                  }
                  obj.update();
                  layout.coverlay("aura-color");
                }
              });

              ui_popOut({
                target : aura,
                id : "aura-color",
              }, primaryCol);
            },
          });
          ui_dropMenu($(this), actionsList, {id : "change-aura-color", hideClose : true});
        });

        var showSquares = genInput({
          parent : newThreat,
          key : key,
          type : "checkbox"
        });
        showSquares.prop("checked", board.data.layers[layer].p[piece].o[key].s);

        showSquares.change(function(){
          var key = $(this).attr("key");
          if ($(this).prop("checked") == "true" || $(this).prop("checked") == true) {
            board.data.layers[layer].p[piece].o[key].s = 1;
          }
          else {
            delete board.data.layers[layer].p[piece].o[key].s;
          }
          boardApi.updateObject(layer, "p", piece, board);
          runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
        });

        var box = $("<b>").appendTo(newThreat);
        box.addClass("subtitle flexmiddle lrmargin");
        box.text("Squares");

        var newThreatRange = genInput({
          parent : newThreat,
          value : existingPiece.o[key].d,
          classes : "line subtitle flex2 middle",
          key : key,
          style : {"border-color" : existingPiece.o[key].c}
        });
        newThreatRange.change(function(){
          var key = $(this).attr("key");
          board.data.layers[layer].p[piece].o[key].d = $(this).val();
          boardApi.updateObject(layer, "p", piece, board);
          runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
        });

        var removeAura = genIcon("remove").appendTo(titleThreat);
        removeAura.addClass("destroy");
        removeAura.attr("key", key);
        removeAura.click(function(){
          var key = $(this).attr("key");
          delete board.data.layers[layer].p[piece].o[key];
          boardApi.updateObject(layer, "p", piece, board);
          runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
          obj.update();
        });
      }

      var createAuraLink = genIcon("plus", "New Aura").appendTo(aurasScroll);
      createAuraLink.addClass("create spadding subtitle lrmargin");
      createAuraLink.css("position", "absolute");
      createAuraLink.css("bottom", "0");
      createAuraLink.css("left", "0");
      createAuraLink.click(function(){
        ui_prompt({
          target : $(this),
          inputs : {
            "Aura Name" : ""
          },
          click : function(ev, inputs) {
            board.data.layers[layer].p[piece].o = board.data.layers[layer].p[piece].o || {};
            board.data.layers[layer].p[piece].o[inputs["Aura Name"].val()] = {d : 6};
            boardApi.updateObject(layer, "p", piece, board);
            runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
            obj.update();
          }
        });
      });

      if (existingPiece.eID) {

        div.append("<div class='padding'></div>");

        var healthBars = $("<div>").appendTo(div);
        healthBars.addClass("flexcolumn flex alttext");
        healthBars.append("<b class='fit-x flexmiddle'>Health Bars</b>");
        healthBars.css("height", "200px");

        var healthBarsScroll = $("<div>").appendTo(healthBars);
        healthBarsScroll.addClass("smooth outline flex");
        healthBarsScroll.css("position", "relative");
        healthBarsScroll.css("overflow-y", "auto");
        healthBarsScroll.css("background", "rgba(0,0,0,0.4)");

        function rebuildHP(){
          healthBarsScroll.empty();

          for (var i in existingPiece.hpb) {
            var hpWrap = $("<div>").appendTo(healthBarsScroll);
            hpWrap.addClass("flexrow flexbetween");

            var ent = getEnt(existingPiece.eID);
            var title = $("<b>").appendTo(hpWrap);
            title.addClass("lrpadding hover2 flex");
            title.attr("index", i);
            title.text(ent.data.counters[i].name);

            title.click(function(){
              var aura = $(this);
              var key = $(this).attr("index");
              var actionsList = [];
              var submenu = [
                "rgba(34,34,34,1)",
                "rgba(187,0,0,1)",
                "rgba(255,153,0,1)",
                "rgba(255,240,0,1)",
                "rgba(0,187,0,1)",
                "rgba(0,115,230,1)",
                "rgba(176,0,187,1)",
                "rgba(255,115,255,1)",
                "rgba(255,255,255,1)",
              ];
              for (var i in submenu) {
                actionsList.push({
                  icon : "tint",
                  style : {"background-color" : submenu[i], "color" : "transparent"},
                  attr : {"bgcol" : submenu[i]},
                  click : function(ev, ui){
                    var value = ui.attr("bgcol");
                    if (existingPiece) {
                      board.data.layers[layer].p[piece].hpb[key].c = value.replace(",1)", ",0.35)");
                      boardApi.updateObject(layer, "p", piece, board);
                      runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
                    }
                    else {
                      pieceData.hpb[key].c = value.replace(",1)", ",0.35)");
                    }
                    obj.update();
                  },
                });
              }
              actionsList.push({
                icon : "cog",
                click : function(){
                  var primaryCol = sync.render("ui_colorPicker")(obj, app, {
                    hideColor : true,
                    custom : true,
                    colorChange : function(ev, ui, col){
                      var value = col;
                      if (existingPiece) {
                        board.data.layers[layer].p[piece].hpb[key].c = value;
                        boardApi.updateObject(layer, "p", piece, board);
                        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
                      }
                      else {
                        pieceData.hpb[key].c = value;
                      }
                      obj.update();
                      layout.coverlay("aura-color");
                    }
                  });

                  ui_popOut({
                    target : aura,
                    id : "aura-color",
                  }, primaryCol);
                },
              });
              ui_dropMenu($(this), actionsList, {id : "change-aura-color", hideClose : true});
            });

            var checkWrap = $("<div>").appendTo(hpWrap);
            checkWrap.addClass("flexmiddle hover2 subtitle lrmargin");
            checkWrap.attr("key", i);

            var segmented = genInput({
              parent : checkWrap,
              type : "checkbox",
            });
            segmented.prop("checked", existingPiece.hpb[i].b);
            checkWrap.append("<b>Boxed</b>");
            checkWrap.click(function(){
              var key = $(this).attr("key");
              if (!board.data.layers[layer].p[piece].hpb[key].b) {
                board.data.layers[layer].p[piece].hpb[key].b = true;
              }
              else {
                delete board.data.layers[layer].p[piece].hpb[key].b;
              }
              boardApi.updateObject(layer, "p", piece, board);
              runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
              rebuildHP();
            });

            var removeAura = genIcon("remove").appendTo(hpWrap);
            removeAura.addClass("destroy");
            removeAura.attr("key", i);
            removeAura.click(function(){
              var key = $(this).attr("key");
              delete board.data.layers[layer].p[piece].hpb[key];
              if (!Object.keys(board.data.layers[layer].p[piece].hpb).length) {
                delete board.data.layers[layer].p[piece].hpb;
              }
              boardApi.updateObject(layer, "p", piece, board);
              runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
              $(this).parent().remove();
            });
          }
        }
        rebuildHP();

        var hpWrap = $("<div>").appendTo(healthBars);
        hpWrap.addClass("flexrow flexbetween fit-x bold");

        var addBar = genIcon("plus", "New Health Bar").appendTo(hpWrap);
        addBar.addClass("create");
        addBar.click(function(){
          var ent = getEnt(existingPiece.eID);
          var select = {};
          for (var k in ent.data.counters) {
            select[ent.data.counters[k].name] = k;
          }

          ui_prompt({
            target : $(this),
            inputs : {
              "Health Data" : {select : select},
            },
            click : function(ev, inputs){
              if (inputs["Health Data"].val()) {
                existingPiece.hpb = existingPiece.hpb || {};
                existingPiece.hpb[inputs["Health Data"].val()] = {c : "rgb(155,155,155)"};
                boardApi.updateObject(layer, "p", piece, board);
                runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
                rebuildHP();
              }
            }
          });
        });

        if (existingPiece && existingPiece.eID) {
          var tScaleWrap = $("<div>").appendTo(hpWrap);
          tScaleWrap.addClass("flexcolumn flexmiddle");
          if (getEnt(existingPiece.eID) && getEnt(existingPiece.eID).data._t == "c") {
            if (!existingPiece.hp) {
              var token = genIcon("heart", "Hide Bars").appendTo(tScaleWrap);
              token.click(function(){
                board.data.layers[layer].p[piece].hp = true;
                boardApi.updateObject(layer, "p", piece, board);
                runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
                obj.update();
              });
            }
            else {
              var token = genIcon("heart-empty", "Show Bars").appendTo(tScaleWrap);
              token.addClass("dull");
              token.click(function(){
                delete board.data.layers[layer].p[piece].hp;
                boardApi.updateObject(layer, "p", piece, board);
                runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
                obj.update();
              });
            }
          }
        }
      }
    }
    else if (obj.data.advanced == "logic") {
      div.append("<b>Events and Triggers</b>");

      var triggerControls = $("<select>").appendTo(div);
      triggerControls.addClass("flexmiddle");
      triggerControls.css("color", "#333");
      triggerControls.css("text-shadow", "none");
      triggerControls.append("<option value=0>None</option>");
      triggerControls.append("<option value=1>Manual</option>");
      triggerControls.append("<option value=2>Pressure Plate</option>");
      triggerControls.append("<option value=3>Trip Wire</option>");
      if (board.data.layers[layer].p[piece].e && board.data.layers[layer].p[piece].e.t) {
        triggerControls.children().each(function(){
          if ($(this).attr("value") == board.data.layers[layer].p[piece].e.t) {
            $(this).attr("selected", true);
          }
        });
      }
      triggerControls.change(function(){
        if ($(this).val() && $(this).val() != "0") {
          board.data.layers[layer].p[piece].e = board.data.layers[layer].p[piece].e || {t : $(this).val(), calc : []};
          board.data.layers[layer].p[piece].e.t = Number($(this).val());
          rebuildTriggers();
        }
        else {
          delete board.data.layers[layer].p[piece].e;
          rebuildTriggers();
        }
        boardApi.updateObject(layer, "p", piece, board);
        runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
      });

      var triggerList = $("<div>").appendTo(div);
      triggerList.addClass("flexcolumn fit-x");
      triggerList.css("color", "#333");
      triggerList.css("text-shadow", "none");

      function rebuildTriggers(){
        triggerList.empty();
        if (board.data.layers[layer].p[piece].e && board.data.layers[layer].p[piece].e.t) {
          for (var i in board.data.layers[layer].p[piece].e.calc) {
            var triggerPlate = $("<div>").appendTo(triggerList);
            triggerPlate.addClass("flexrow flexmiddle white outlinebottom smooth hover2");
            triggerPlate.attr("index", i);

            triggerPlate.click(function(){
              var index = $(this).attr("index");

              var newTrigger = sync.dummyObj();
              newTrigger.data = board.data.layers[layer].p[piece].e.calc[index];

              var content = $("<div>");
              content.addClass("flexcolumn flex lrpadding");

              var newApp = sync.newApp("ui_triggerBuilder").appendTo(content);
              newApp.attr("board", app.attr("target"));
              newApp.attr("piece", piece);
              newApp.attr("layer", layer);

              newTrigger.addApp(newApp);

              var confirm = $("<button>").appendTo(content);
              confirm.append("Confirm");
              confirm.click(function(){
                board.data.layers[layer].p[piece].e =  board.data.layers[layer].p[piece].e || {t : 1, calc : []};
                board.data.layers[layer].p[piece].e.calc[index] = newTrigger.data;
                boardApi.updateObject(layer, "p", piece, board);
                runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
                rebuildTriggers();
                layout.coverlay("create-trigger");
              });

              var pop = ui_popOut({
                id : "create-trigger",
                target : $(this),
                title : "New Trigger",
                style : {"width" : "400px"}
              }, content);
            });

            if (util.events[board.data.layers[layer].p[piece].e.calc[i].e]) {
              triggerPlate.append("<b class='flex flexmiddle'>"+util.events[board.data.layers[layer].p[piece].e.calc[i].e].name+"</b>");
            }

            var remove = genIcon("remove").appendTo(triggerPlate);
            remove.addClass("destroy");
            remove.attr("index", i);
            remove.click(function(){
              board.data.layers[layer].p[piece].e.calc.splice($(this).attr("index"), 1);
              boardApi.updateObject(layer, "p", piece, board);
              runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
              rebuildTriggers();
            });
          }
          var addTrigger = genIcon("plus", "Add Event").appendTo(triggerList);
          addTrigger.addClass("spadding alttext subtitle");
          addTrigger.css("color", "white");
          addTrigger.click(function(){
            var newTrigger = sync.dummyObj();
            newTrigger.data = {data : "d20", e : 4};

            var content = $("<div>");
            content.addClass("flexcolumn flex");

            var newApp = sync.newApp("ui_triggerBuilder").appendTo(content);
            newApp.attr("board", app.attr("target"));
            newApp.attr("piece", piece);
            newApp.attr("layer", layer);

            newTrigger.addApp(newApp);

            var confirm = $("<button>").appendTo(content);
            confirm.append("Confirm");
            confirm.click(function(){
              board.data.layers[layer].p[piece].e = board.data.layers[layer].p[piece].e || {t : 1, calc : []};
              board.data.layers[layer].p[piece].e.calc.push(newTrigger.data);
              boardApi.updateObject(layer, "p", piece, board);
              runCommand("boardMove", {id : app.attr("target"), layer : layer, type : "p", index : piece, data : board.data.layers[layer].p[piece]});
              rebuildTriggers();
              layout.coverlay("create-trigger");
            });

            var pop = ui_popOut({
              id : "create-trigger",
              target : $(this),
              title : "New Event",
              style : {"width" : "400px"}
            }, content);
          });
        }
      }
      rebuildTriggers();
    }
  }
  return div;
});
