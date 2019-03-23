function charClick(ev, ui, charObj, obj, app, scope) {
  if (hasSecurity(getCookie("UserID"), "Visible", charObj.data)) {
    if (charObj.data._t == "c" && _down[17] && !isNaN(charObj.id())) {
      if (ui.parent().hasClass("card-selected")) {
        ui.parent().removeClass("card-selected");
        util.untarget(charObj.id());
        sendAlert({text : "Released Target"});
      }
      else {
        ui.parent().addClass("card-selected");
        util.target(charObj.id());
        sendAlert({text : "Targeted"});
      }
      return true;
    }
    else {
      if (layout.mobile) {
        obj.removeApp(app);
        game.entities.removeApp(app);
        app.attr("from", app.attr("ui-name"));
        app.attr("ui-name", "ui_characterSheetv2");
        if (!hasSecurity(getCookie("UserID"), "Rights", charObj.data)) {
          app.attr("viewOnly", "true");
        }
        else {
          game.players.data[getCookie("UserID")].entity = charObj.id();
          runCommand("selectPlayerEntity", {id : charObj.id()});
          app.removeAttr("viewOnly");
        }
        charObj.addApp(app);
      }
      else {
        if (!_down["16"]) {
          var newApp = sync.newApp("ui_characterSheetv2");
          newApp.attr("from", "ui_characterSummary");
          if (!hasSecurity(getCookie("UserID"), "Rights", charObj.data)) {
            newApp.attr("viewOnly", "true");
          }
          charObj.addApp(newApp);
          var pop = ui_popOut({
            target : ui,
            id : "char-sheet-"+charObj.id(),
            title : sync.rawVal(charObj.data.info.name),
            minimize : true,
            dragThickness : "0.5em",
            style : {width : assetTypes["c"].width, height : assetTypes["c"].height},
          }, newApp);
          pop.resizable();
        }
        else {
          var newApp = sync.newApp("ui_characterSummary");
          if (!hasSecurity(getCookie("UserID"), "Rights", charObj.data)) {
            newApp.attr("viewOnly", "true");
          }
          charObj.addApp(newApp);
          var pop = ui_popOut({
            target : ui,
            id : "char-summary-"+charObj.id(),
            title : sync.rawVal(charObj.data.info.name),
            minimize : true,
            dragThickness : "0.5em",
          }, newApp);
          pop.resizable();
        }
      }
    }
  }
}

function createCharacter(charData, dontRoll, returnCreate, noResults, popup, supressCreate) {
  var nameBank = util.nameBank;
  var rolled = {stats : {}, counters : {}};
  var rollResult = $("<div>");
  rollResult.addClass("flexcolumn");
  rollResult.css("font-size", "1.2em");
  var appendStats = false;
  if (!dontRoll) {
    for (var i in charData.stats) {
      var stat = charData.stats[i];
      for (var j in stat.modifiers) {
        stat.current = (stat.current || "0") + "+" + stat.modifiers[j];
      }
      var results = sync.executeQuery(String(stat.current), charData);
      var totalStr = "";
      var total = 0;

      for (var d in results.equations) {
        totalStr += results.equations[d].r + "+";
        total += results.equations[d].v;
      }
      if (stat.current != totalStr.substring(0,totalStr.length-1)) {
        if (!appendStats) {
          rollResult.append("<b>Stats</b>");
          appendStats = true;
        }
        rolled.stats[i] = "<b>"+stat.name+"</b><li class='subtitle' style='margin-left:1.5em; margin-right:1.5em;'>"+stat.current+" = "+totalStr.substring(0,totalStr.length-1)+" = " + total;
        rollResult.append("<div class='subtitle'>"+rolled.stats[i]+"</li></div>");
      }
      stat.current = total;
      if (stat.max != null && stat.current > stat.max) {
        stat.max = stat.current;
      }
      stat.modifiers = {};
    }

    var appendCounter = false;
    for (var i in charData.counters) {
      var counter = charData.counters[i];
      for (var j in counter.modifiers) {
        counter.current = (counter.current || "0") + "+" + counter.modifiers[j];
      }
      if (!(counter.current instanceof Object) && i != "hit") {
        var results = sync.executeQuery(String(counter.current), charData);
        var totalStr = "";
        var total = 0;
        for (var d in results.equations) {
          totalStr += results.equations[d].r + "+";
          total += results.equations[d].v;
        }
        if (counter.current != totalStr.substring(0,totalStr.length-1)) {
          if (!appendCounter) {
            rollResult.append("<b>Counters</b>");
          }
          rolled.counters[i] = "<b>"+counter.name+"</b><li class='subtitle' style='margin-left:1.5em; margin-right:1.5em;'>"+counter.current+" = "+totalStr.substring(0,totalStr.length-1)+" = " + total;
          rollResult.append("<div class='subtitle'>"+rolled.counters[i]+"</li></div>");
          appendCounter = true;
        }

        var diceRoll = false;
        if (counter.current && String(counter.current).match(diceRegex)) {
          diceRoll = true;
        }

        counter.current = sync.eval(counter.current);
        if (diceRoll) {
          counter.max = sync.modified(counter.current, 0);
        }
        if (counter.max != null && counter.current > counter.max) {
          counter.max = counter.current;
        }
        counter.modifiers = {};
      }
    }
    sync.rawVal(charData.info.name, nameBank[Math.floor(nameBank.length * Math.random())]);
  }
  if (!supressCreate) {
    game.locals["newAssetList"] = game.locals["newAssetList"] || [];
    var lastKeys = Object.keys(game.entities.data);
    game.entities.listen["newAsset"] = function(rObj, newObj, target) {
      var change = true;
      for (var key in game.entities.data) {
        if (!util.contains(lastKeys, key)) {
          game.locals["newAssetList"].push(key);
          if (!charData._flags || !charData._flags["temp"]) {
            if (popup !== false) {
              assetTypes["c"].preview(getEnt(key), $("body"));
            }
          }
          change = false;
        }
      }
      return change;
    }
    if (!game.config.data.offline) {
      runCommand("createCharacter", charData);
    }
    else {
      game.entities.data["tempObj"+game.config.data.offline] = sync.obj("tempObj"+game.config.data.offline);
      game.entities.data["tempObj"+game.config.data.offline]._lid = "tempObj"+game.config.data.offline;
      game.entities.data["tempObj"+game.config.data.offline++].data = duplicate(charData);
      game.entities.update();
    }
  }
  if (returnCreate) {
    return charData;
  }
}

sync.render("ui_characterSheetv2", function(obj, app, scope){
  if (!game.templates.build) {
    return sync.render("ui_characterSheet")(obj, app, scope);
  }

  var div = $("<div>");
  div.addClass("fit-xy flexcolumn");

  if (!obj || !obj.data || obj.data["_t"] != "c") {
    if (app && layout.mobile) {
      app.attr("ui-name", "ui_assetManager");
      game.entities.addApp(app);
    }
    return div;
  }

  scope = scope || {
    viewOnly: (app.attr("viewOnly") == "true"),
    local : (app.attr("local") == "true"),
    markup : app.attr("markup") == "true",
    editing : app.attr("editing") == "true",
  };

  obj.data._flags = obj.data._flags || duplicate(obj.data.tags || {});

  var sheet = scope.sheet;
  if (app.attr("homebrew")) {
    sheet = sheet || game.locals["homebrew"].data.templates.display.actors[obj.data._type] || {};
  }
  else {
    sheet = sheet || game.templates.display.actors[obj.data._type] || game.templates.display.actors[Object.keys(game.templates.display.actors)[0]] || {};
  }

  var ctx = sync.defaultContext();
  ctx["c"] = obj.data;

  if (app.attr("attributes")) {
    div.removeClass("flexcolumn");
    div.addClass("foreground");
    div.css("overflow", "auto");
    div.scroll(function(){
      app.attr("_lastScrollTop", div.scrollTop());
      app.attr("_lastScrollLeft", div.scrollLeft());
    });

    var buttonList = $("<div>").appendTo(div);
    buttonList.addClass("flexrow foreground flexbetween subtitle");
    buttonList.css("margin-bottom", "1em");

    var reset = $("<button>").appendTo(buttonList);
    reset.addClass("highlight lrpadding alttext flexmiddle");
    reset.text("Back to Sheet");
    reset.click(function(){
      app.removeAttr("attributes");
      obj.update();
    });

    var template = {stats : "", info : "", counters : ""};
    if (!game.templates.build) {
      template["skills"] = "";
    }
    if (game.templates.display.actors[obj.data._type] && game.templates.display.actors[obj.data._type].categories) {
      template = {};
      for (var k in game.templates.display.actors[obj.data._type].categories) {
        template[k] = game.templates.display.actors[obj.data._type].categories[k];
      }
    }

    var reset = $("<button>").appendTo(buttonList);
    reset.addClass("background lrpadding alttext flexmiddle");
    reset.text("Load Attributes");
    reset.click(function(){
      var content = sync.render("ui_assetPicker")(obj, app, {
        category : "c",
        filter : "c",
        select : function(ev, ui, ent, options, entities){
          if (ent.data) {
            var newData = duplicate(ent.data);
            for (var i in newData) {
              if (i && String(i)[0] == "_") {
                delete newData;
              }
            }
            merge(obj.data, newData, true);
            if (app.attr("homebrew") && game.templates.build) {
              game.locals["homebrew"].data.previewChar[obj.data._type] = duplicate(obj.data);
              game.locals["homebrew"].data.templates.actors[obj.data._type] = duplicate(obj.data);
            }
            obj.update();
          }
          layout.coverlay("add-asset");
        }
      });
      var pop = ui_popOut({
        target : $("body"),
        prompt : true,
        id : "add-asset",
        title : "Pick Sheet",
        style : {"width" : assetTypes["assetPicker"].width, "height" : assetTypes["assetPicker"].height}
      }, content);
      pop.resizable();
    });

    var keys = {};
    for (var key in template) {
      var path = key;

      var attrPlate = $("<div>").appendTo(div);
      attrPlate.addClass("lrpadding lrmargin");
      attrPlate.css("font-size", "1.2em");
      attrPlate.append("<u class='bold lrpadding lrmargin alttext'>"+key+"</b>");

      var attrWrap = $("<div>").appendTo(attrPlate);
      attrWrap.addClass("flexcolumn subtitle white outline smooth lpadding");
      attrWrap.css("margin-bottom", "1em");
      if (template[key] == "") {
        var headerRow = $("<div>").appendTo(attrWrap);
        headerRow.addClass("flexrow padding");
        headerRow.append("<u class='subtitle flexmiddle lrmargin' style='width:100px'>Macro Key</u>");
        headerRow.append("<u class='flex subtitle flexmiddle lrmargin' style='width:100px'>Name</u>");
        headerRow.append("<u class='flex2 subtitle flexmiddle lrmargin' style='width:100px'>Value</u>");
        headerRow.append("<u class='subtitle flexmiddle lrmargin' style='width:40px'>Min</u>");
        headerRow.append("<u class='subtitle flexmiddle lrmargin' style='width:40px'>Max</u>");
        headerRow.append("<u class='subtitle flexmiddle lrmargin' style='width:70px'>Modifiers</u>");
        headerRow.append(genIcon("remove").addClass("lrpadding lrmargin").css("color", "transparent"));
        for (var subKey in obj.data[key]) {
          path = key + "." + subKey;
          if (path != "info.notes" && path != "info.img" && path != "info.name") {
            var attrOption = $("<div>").appendTo(attrWrap);
            attrOption.addClass("flexrow padding");
            if (!keys[subKey]) {
              attrOption.append("<text class='subtitle flexmiddle' style='width:100px'>@"+subKey+"</text>");
              keys[subKey] = true;
            }
            else {
              attrOption.append("<text class='subtitle flexmiddle' style='width:100px'>@c."+path+"</text>");
            }

            var name = genInput({
              parent : attrOption,
              classes : "line subtitle lrmargin middle",
              value : obj.data[key][subKey],
              cmd : "updateAsset",
              obj : obj,
              name : true,
              style : {"width" : "150px"}
            });

            var value = genInput({
              parent : attrOption,
              classes : "line subtitle flex2 lrmargin middle",
              value : obj.data[key][subKey],
              cmd : "updateAsset",
              obj : obj,
            });

            var min = genInput({
              parent : attrOption,
              classes : "line subtitle lrmargin middle",
              value : obj.data[key][subKey],
              style : {"width" : "40px"},
              cmd : "updateAsset",
              obj : obj,
              raw : "min",
            });

            var max = genInput({
              parent : attrOption,
              classes : "line subtitle lrmargin middle",
              value : obj.data[key][subKey],
              style : {"width" : "40px"},
              cmd : "updateAsset",
              obj : obj,
              raw : "max"
            });

            var remove = genIcon("list-alt", "Mods").appendTo(attrOption);
            remove.addClass("flexmiddle lrmargin lrpadding");
            remove.attr("path", path);
            remove.css("width", "70px");
            remove.click(function(){
              var path = $(this).attr("path");

              var content = sync.newApp("ui_modifiers");
              content.attr("viewOnly", scope.viewOnly);
              content.attr("lookup", path);
              content.attr("modsOnly", "true");
              obj.addApp(content);

              ui_popOut({
                target : $(this),
                align : "top",
                title : "Modifiers",
                id : "modify-exp",
                style : {"min-width" : "100px"},
              }, content);
            });

            var remove = genIcon("remove").appendTo(attrOption);
            remove.addClass("destroy flexmiddle lrmargin lrpadding");
            remove.attr("path", path);
            remove.click(function(){
              var path = $(this).attr("path");

              ui_prompt({
                target : $(this),
                confirm : "Delete Attribute",
                click : function(){
                  sync.traverse(obj.data, path, "");
                  obj.sync("updateAsset");
                }
              });
            });
          }
        }

        var headerRow = genIcon("plus", "New Attribute").appendTo(attrWrap);
        headerRow.addClass("flexmiddle fit-x create");
        headerRow.attr("category", key);
        headerRow.click(function(){
          var category = $(this).attr("category");

          var invalidKeys = {
            "length" : "system",
          }; // invalid keys

          for (var key in obj.data) {
            invalidKeys[key] = key;
          }
          for (var key in obj.data.info) {
            invalidKeys[key] = "info."+key;
          }
          for (var key in obj.data.counters) {
            invalidKeys[key] = "counters."+key;
          }
          for (var key in obj.data.stats) {
            invalidKeys[key] = "stats."+key;
          }

          ui_prompt({
            target : $(this),
            inputs : {
              "Macro Key" : "",
            },
            click : function(ev, inputs){
              var path = inputs["Macro Key"].val();
              if (path && path != "notes" && path != "img" && path != "name" && isNaN(path)) {
                path = replaceAll(path, " ", "_");
                path = replaceAll(path, "@", "");
                path = replaceAll(path, "(", "_");
                path = replaceAll(path, ")", "_");
                path = replaceAll(path, "[", "_");
                path = replaceAll(path, "]", "_");
                path = replaceAll(path, "!", "_");
                path = replaceAll(path, "#", "_");
                path = replaceAll(path, "$", "_");
                if (invalidKeys[path]) {
                  sendAlert({text : "This key is used somewhere else"});
                }
                else {
                  obj.data[category] = obj.data[category] || {};
                  obj.data[category][path] = {};
                  obj.sync("updateAsset");
                }
              }
            }
          });
        });
      }
      else {
        sync.render("ui_processUI")(obj, app, {display : template[key]}).appendTo(attrWrap);
      }
    }

    return div;
  }

  if (app.attr("viewingActions")) {
    div.css("overflow", "auto");
    div.scroll(function(){
      app.attr("_lastScrollTop", div.scrollTop());
      app.attr("_lastScrollLeft", div.scrollLeft());
    });

    var buttonList = $("<div>").appendTo(div);
    buttonList.addClass("flexrow foreground flexbetween subtitle");

    var reset = $("<button>").appendTo(buttonList);
    reset.addClass("highlight lrpadding alttext flexmiddle");
    reset.text("Back to Sheet");
    reset.click(function(){
      app.removeAttr("viewingActions");
      obj.update();
    });

    var reset = $("<button>").appendTo(buttonList);
    reset.addClass("highlight lrpadding alttext flexmiddle");
    reset.text("Restore to Default Hotbar");
    reset.click(function(){
      obj.data._hud = duplicate(game.templates.actors[obj.data._type]._hud);
      obj.sync("updateAsset");
    });

    sync.render("ui_manageActionsv2")(obj, app, scope).appendTo(div);

    return div;
  }

  if (app.attr("viewingData")) {
    var calcs = duplicate(obj.data._calc || sheet.calc || []);

    var buttonList = $("<div>").appendTo(div);
    buttonList.addClass("flexrow foreground subtitle flexbetween");

    if (hasSecurity(getCookie("UserID"), "Rights", obj.data) || app.attr("homebrew")) {
      var confirm = $("<button>").appendTo(buttonList);
      confirm.addClass("highlight alttext flexmiddle");
      confirm.text("Save");
      confirm.click(function(){
        obj.data._calc = calcs;

        app.removeAttr("viewingData");
        obj.sync("updateAsset");
      });
    }

    var discard = $("<button>").appendTo(buttonList);
    discard.addClass("highlight alttext flexmiddle");
    discard.text("Discard Changes");
    discard.click(function(){
      app.removeAttr("viewingData");
      obj.update();
    });


    if (!app.attr("homebrew")) {
      var reset = $("<button>").appendTo(buttonList);
      reset.addClass("highlight lrpadding alttext flexmiddle");
      reset.text("Clear");
      reset.click(function(){
        obj.data._calc = [];

        obj.update();
      });
    }

    if (!app.attr("homebrew")) {
      var reset = $("<button>").appendTo(buttonList);
      reset.addClass("highlight lrpadding alttext flexmiddle");
      reset.text("Reset to Default");
      reset.click(function(){
        delete obj.data._calc;

        app.removeAttr("viewingData");
        obj.sync("updateAsset");
      });
    }

    var header = $("<highlight>").appendTo(div);
    header.addClass("fit-x flexmiddle");
    header.text("Automatic Calculations");

    var calcWrapper = $("<div>").appendTo(div);
    calcWrapper.addClass("flexcolumn margin flex outline smooth");
    calcWrapper.css("position", "relative");
    calcWrapper.css("overflow-y", "auto");

    var calcList = $("<div>").appendTo(calcWrapper);
    calcList.addClass("fit-x");
    calcList.css("position", "absolute");
    calcList.css("top", "0");
    calcList.css("left", "0");

    if (!obj.data._calc) {
      calcList.css("opacity", "0.25");
      calcList.css("pointer-events", "none");

      var calcDefault = $("<highlight>").appendTo(calcWrapper);
      calcDefault.addClass("fit-xy flexcolumn flexmiddle");
      calcDefault.append("<text>System Calculations</text><br><text class='subtitle'>Click to overwrite system</text>");
      calcDefault.click(function(){
        calcDefault.remove();
        calcList.css("opacity", "");
        calcList.css("pointer-events", "");
      });
    }
    sync.render("ui_math")(obj, app, {calc : calcs}).appendTo(calcList);

    var warning = $("<i>").appendTo(div);
    warning.addClass("flexmiddle subtitle bold")
    warning.text("Calculations that are applied automatically after a sheet has been changed. Calculations are applied in sequential order, allowing you to reference a value affected by a previous calculation");

    return div;
  }

  if (app.attr("viewingNotes")) {
    var content = sync.newApp("ui_editPage").appendTo(div);
    content.attr("targetApp", app.attr("id"));
    obj.addApp(content);

    return div;
  }

  if (app.attr("viewingRights")) {
    var buttonList = $("<div>").appendTo(div);
    buttonList.addClass("flexrow foreground");
    buttonList.css("margin-bottom", "1em");

    var reset = $("<button>").appendTo(buttonList);
    reset.addClass("highlight lrpadding alttext flexmiddle");
    reset.text("Back to Sheet");
    reset.click(function(){
      app.removeAttr("viewingRights");
      obj.update();
    });

    var content = sync.newApp("ui_rights").appendTo(div);
    content.attr("viewOnly", scope.viewOnly);
    content.attr("last_rights", "indv");
    obj.addApp(content);

    return div;
  }

  if (!app.attr("homebrew") && !scope.editing) {
    var calc = obj.data._calc || sheet.calc || [];
    for (var i=0; i<calc.length; i++) {
      if (!calc[i].cond || sync.eval(calc[i].cond, ctx)) {
        var val = sync.eval(calc[i].eq, ctx);
        var target = sync.traverse(obj.data, calc[i].target);
        if (target instanceof Object) {
          sync.rawVal(target, val);
        }
        else {
          sync.traverse(obj.data, calc[i].target, val);
        }
      }
    }
    for (var key in game.templates.hudLookups) {
      var listKey = game.templates.hudLookups[key];
      var list = sync.traverse(obj.data, listKey);
      if (list) {
        for (var id in list) {
          var itemData = list[id];
          ctx["i"] = itemData;
          var calc = itemData._calc || [];
          for (var i=0; i<calc.length; i++) {
            if (calc[i].cond == null || sync.eval(calc[i].cond, ctx)) {
              var val = sync.eval(calc[i].eq, ctx);
              var target = sync.traverse(obj.data, calc[i].target);
              if (target instanceof Object) {
                sync.rawVal(target, val);
              }
              else {
                sync.traverse(obj.data, calc[i].target, val);
              }
            }
          }
        }
      }
    }
    delete ctx["i"];
  }

  var data = obj.data || {info : {}};

  if (!scope.viewOnly) {
    div.on("dragover", function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (_dragTransfer) {
        var olay = layout.overlay({
          target : app,
          id : app.attr("id")+"-drag-overlay",
          style : {"background-color" : "rgba(0,0,0,0.5)", "pointer-events" : "none"}
        });
        olay.addClass("flexcolumn flexmiddle alttext");
        olay.css("font-size", "2em");
        olay.css("z-index", util.getMaxZ(".ui-popout")+1);
        if (_dragTransfer.roll) {
          olay.addClass("focus");
          olay.append("<b>Targeting</b>");
        }
      }
      else if (!$("#"+app.attr("id")+"-drag-overlay").length) {
    		var olay = layout.overlay({
          target : app,
          id : app.attr("id")+"-drag-overlay",
          style : {"background-color" : "rgba(0,0,0,0.5)", "pointer-events" : "none"}
        });
        olay.addClass("flexcolumn flexmiddle alttext");
        olay.css("font-size", "2em");
        olay.css("z-index", util.getMaxZ(".ui-popout")+1);
        olay.append("<b>Drop to Create</b>");
      }
    });
    div.droppable();
    div.on('drop', function(ev, ui){
      ev.preventDefault();
      ev.stopPropagation();
      if (_dragTransfer) {
        if (_dragTransfer.roll) {
          optionsBar.addClass("card-selected");
          sendAlert({text : "Targeted " + sync.rawVal(obj.data.info.name)});
          var pop = ui_dropMenu(app, util.buildActions(_dragTransfer.roll), {id : "dice-action", align : "center", style : {"font-size" : "1.6em"}});
        }
      }
      else {
        var dt = ev.originalEvent.dataTransfer||$(ui.draggable).data("dt");
        if (hook.call("OnDropCharacter", obj, app, scope, dt)) {
          if (dt && dt.getData("OBJ")) {
            var ent = JSON.parse(dt.getData("OBJ"));
            if (ent._t == "i") {
              if (ent._drop) {
                var list = sync.traverse(obj.data, ent._drop);
                if (!ent._dropKey && Array.isArray(list)) {
                  list.push(ent);
                }
                else if (list && list instanceof Object) {
                  var ui = $(this);
                  if (!ent._dropKey) {
                    ui_prompt({
                      inputs : {"Unique Key" : ""},
                      click: function(ev, inputs){
                        ent._dropKey = inputs["Unique Key"].val().toLowerCase().replace(/ /g,"_");
                        if (list[ent._dropKey]) {
                          ui_dropMenu(ui, [{name : "Overwrite?", click : function(){list[ent._dropKey] = ent; obj.sync("updateAsset");}}], {id : "quick-sheet-drop", hideClose : true, "z-index" : util.getMaxZ(".ui-popout")+1});
                        }
                        else {
                          list[ent._dropKey] = ent;
                        }
                      }
                    });
                    return;
                  }
                  else {
                    if (list[ent._dropKey]) {
                      ui_dropMenu(ui, [{name : "Overwrite?", click : function(){list[ent._dropKey] = ent; obj.sync("updateAsset");}}], {id : "quick-sheet-drop", hideClose : true, "z-index" : util.getMaxZ(".ui-popout")+1});
                      return;
                    }
                    else {
                      list[ent._dropKey] = ent;
                    }
                  }
                }
              }
            }
            else if (dt.getData("target")) {
              obj.data[dt.getData("target")][dt.getData("key")] = ent;
            }
            obj.sync("updateAsset");
          }
        }
      }

      layout.coverlay(app.attr("id")+"-drag-overlay");
    });
  	div.on("dragleave", function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      layout.coverlay(app.attr("id")+"-drag-overlay");
  	});
  }

  var info = data.info;
  if (!scope.local) {
    var optionsBar = $("<div>").appendTo(div);
    optionsBar.addClass("flexwrap flexbetween background boxinshadow alttext");
    optionsBar.css("color", "white");
    optionsBar.attr("index", obj.id());
    div.contextmenu(function(ev){
      if (!_down["16"]) {
        var menu = assetTypes.contextmenu(ev, optionsBar, obj, app, scope);
        menu.css("left", ev.pageX - 10);
        menu.css("top", ev.pageY - 10);
        util.windowBound(menu);
        return false;
      }
    });

    if (app.attr("simpleEditing")) {
      if (hasSecurity(getCookie("UserID"), "Rights", obj.data) || app.attr("homebrew")) {
        var quickSheet = $("<button>").appendTo(optionsBar);
        quickSheet.addClass("highlight subtitle alttext");
        quickSheet.text("Stop Editing");
        quickSheet.click(function(){
          if (obj.data._d && !app.attr("homebrew")) {
            if (JSON.stringify(obj.data._d.content) == JSON.stringify(game.templates.display.actors[obj.data._type].content)) {
              if (JSON.stringify(obj.data._d.style) == JSON.stringify(game.templates.display.actors[obj.data._type].style)) {
                delete obj.data._d;
              }
            }
          }
          app.removeAttr("simpleEditing");
          obj.sync("updateAsset");
        });

        var modeBar = $("<div>").appendTo(optionsBar)
        modeBar.addClass("flexrow");
        modeBar.css("color", "#333");
        modeBar.css("text-shadow", "none");

        var quickSheet = $("<button>").appendTo(modeBar);
        quickSheet.addClass("button subtitle");
        quickSheet.text("Paint Mode");
        if (app.attr("boxPaint")) {
          if ((obj.data._d && obj.data._d.content instanceof Object) || (!obj.data._d && sheet.content instanceof Object)) {
            quickSheet.removeClass("button").addClass("highlight alttext");
          }
        }
        quickSheet.click(function(){
          if (obj.data._d && !(obj.data._d.content instanceof Object)) {
            obj.data._d.content = {display : []};
          }
          else if (!obj.data._d) {
            obj.data._d = {style : duplicate(sheet.style) || {}, content : {classes : "flexcolumn flex padding", display : []}};
          }
          if (app.attr("boxPaint")) {
            app.removeAttr("boxPaint");
          }
          else {
            app.attr("boxPaint", true);
          }
          obj.update();
        });

        var quickSheet = $("<button>").appendTo(modeBar);
        quickSheet.addClass("button subtitle");
        quickSheet.text("Build Mode");
        if (!app.attr("boxPaint")) {
          if ((obj.data._d && obj.data._d.content instanceof Object) || (!obj.data._d && sheet.content instanceof Object)) {
            quickSheet.removeClass("button").addClass("highlight alttext");
          }
        }
        quickSheet.click(function(){
          if (obj.data._d && !(obj.data._d.content instanceof Object)) {
            obj.data._d.content = {display : []};
          }
          else if (!obj.data._d) {
            obj.data._d = {style : duplicate(game.templates.display.sheet.style) || {}, content : {classes : "flexcolumn flex padding", display : []}};
          }
          if (app.attr("boxPaint")) {
            app.removeAttr("boxPaint");
          }
          else {
            app.attr("boxPaint", true);
          }
          obj.update();
        });


        var quickSheet = $("<button>").appendTo(modeBar);
        quickSheet.addClass("button subtitle");
        quickSheet.text("HTML Mode");

        if ((obj.data._d && !(obj.data._d.content instanceof Object)) || !(sheet.content instanceof Object)) {
          quickSheet.removeClass("button").addClass("highlight alttext");
        }
        quickSheet.click(function(){
          var content = $("<div>");
          content.addClass("flexcolumn fit-xy");

          var select = genInput({
            parent : content,
            type : "textarea",
            classes : "flex subtitle",
            id : app.attr("id") + "-html-edit"
          });
          if (obj.data._d && !(obj.data._d.content instanceof Object)) {
            select.text(obj.data._d.content);
          }
          else if (!(sheet.content instanceof Object)) {
            select.text(sheet.content);
          }
          select.change(function(){
            obj.data._d.content = $(this).val();
            obj.update();
          });

          var button = $("<button class='fit-x spadding'>Confirm</button>");
          content.append(button);

          setTimeout(function(){
            var editor = ace.edit(app.attr("id") + "-html-edit");
            editor.setTheme("ace/theme/monokai");
            $(editor.container).css("margin","0");
            $(editor.container).addClass("flex");
            $(editor.container).hover(function(){
              editor.resize();
            });
            editor.session.setMode("ace/mode/html");
            editor.setOptions({
              autoScrollEditorIntoView: true,
              useWorker: false
            });

            button.click(function(){
              obj.data._d.content = editor.getValue();
              obj.update();
            });
          }, 100);


          var popout = ui_popOut({
            target : $("body"),
            id : "json-editor",
            style : {"width" : "600px", "height" : "600px"}
          }, content);
          popout.resizable();
        });


        var quickSheet = $("<button>").appendTo(optionsBar);
        quickSheet.addClass("background subtitle alttext");
        quickSheet.text("Sheet Background");
        quickSheet.click(function(){
          var imgList = sync.render("ui_filePicker")(obj, app, {
            filter : "img",
            change : function(ev, ui, value){
              var img = new Image();
              img.src = value;
              img.onload = function(){
                obj.data._d = obj.data._d || {style : duplicate(sheet.style) || {}, content : duplicate(game.templates.display.sheet.content)};
                obj.data._d.style = obj.data._d.style || duplicate(sheet.style) || {};

                var aspect = this.naturalWidth/this.naturalHeight;

                var imageWidth = this.naturalWidth;
                var imageHeight = this.naturalHeight;
                var areaHeight = 750;
                var areaWidth = 700;

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

                obj.data._d.style["background-image"] = 'url("'+value+'")';
                obj.data._d.style["background-size"] = imageWidth + "px " + imageHeight + "px";
                obj.data._d.style["background-repeat"] = "no-repeat";

                obj.update();
                layout.coverlay("icons-picker");
                layout.coverlay("style-sheet");
              };
              img.onerror = function(){
                sendAlert({text : "Error Loading Image"});
                layout.coverlay("icons-picker");
              }
            }
          });

          var pop = ui_popOut({
            target : $(this),
            id : "icons-picker",
            align : "top",
            prompt : true,
            style : {"width" : assetTypes["filePicker"].width, "height" : assetTypes["filePicker"].height}
          }, imgList);
          pop.resizable();
        });

        if (!((obj.data._d && !(obj.data._d.content instanceof Object)) || !(sheet.content instanceof Object))) {
          var quickSheet = $("<button>").appendTo(optionsBar);
          quickSheet.addClass("background subtitle alttext");
          quickSheet.text("Blank Sheet");
          quickSheet.click(function(){
            ui_prompt({
              target : $(this),
              confirm : "Clear Sheet?",
              click : function() {
                obj.data._d = {style : duplicate(sheet.style) || {}, content : {classes : "flexcolumn flex padding", display : []}};
                app.attr("simpleEditing", true);
                obj.update();
              }
            });
          });
          var quickSheet = $("<button>").appendTo(optionsBar);
          quickSheet.addClass("background subtitle alttext");
          quickSheet.text("Default Sheet");
          quickSheet.click(function(){
            obj.data._d = {style : duplicate(sheet.style) || {}, content : duplicate(game.templates.display.sheet.content)};
            app.attr("simpleEditing", true);
            obj.update();
          });
          var quickSheet = $("<button>").appendTo(optionsBar);
          quickSheet.addClass("background subtitle alttext");
          quickSheet.text("Pre-made");
          quickSheet.click(function(){
            var actionList = [];
            for (var key in game.templates.display.premade) {
              function wrap(key){
                actionList.push({
                  name : key,
                  click : function(){
                    obj.data._d = duplicate(game.templates.display.premade[key]);
                    obj.sync("updateAsset");
                  }
                });
              }
              wrap(key);
            }
            for (var key in util.premadeSheets) {
              function wrap(key){
                actionList.push({
                  name : key,
                  click : function(){
                    obj.data._d = duplicate(util.premadeSheets[key]);
                    obj.sync("updateAsset");
                  }
                });
              }
              wrap(key);
            }

            var actionList = util.customSheets(obj, app, scope, sheet);
            ui_dropMenu($(this), actionList, {id : "quick-sheet-drop", "z-index" : util.getMaxZ(".ui-popout")+1});
          });
        }

        var quickSheet = $("<button>").appendTo(optionsBar);
        quickSheet.addClass("background subtitle alttext");
        quickSheet.text("JSON");
        quickSheet.click(function(){
          var select = sync.newApp("ui_JSON");
          select.attr("lookup", "_d");
          select.attr("closeTarget", "json-editor");
          obj.addApp(select);

          var popout = ui_popOut({
            target : $(this),
            id : "json-editor",
          }, select);
          popout.resizable();
        });

        var quickSheet = $("<button>").appendTo(optionsBar);
        quickSheet.addClass("background subtitle alttext");
        quickSheet.text("Load a Sheet");
        quickSheet.click(function(){
          var content = sync.render("ui_assetPicker")(obj, app, {
            category : "c",
            select : function(ev, ui, ent, options, entities){
              if (ent.data._d) {
                obj.data._d = duplicate(ent.data._d);
                obj.update();
              }
              layout.coverlay("add-asset");
            }
          });
          var pop = ui_popOut({
            target : $("body"),
            prompt : true,
            id : "add-asset",
            title : "Pick Sheet",
            style : {"width" : assetTypes["assetPicker"].width, "height" : assetTypes["assetPicker"].height}
          }, content);
          pop.resizable();
        });
      }
    }
    else {
      if (app.attr("from") && sheet.summary) {
        var back = genIcon("arrow-left").appendTo(optionsBar);
        back.addClass("lrmargin");
        back.attr("title", "Back");
        back.click(function(){
          if (layout.mobile) {
            runCommand("selectPlayerEntity");
            obj.removeApp(app);
            var old = app.attr("ui-name");
            app.attr("ui-name", "ui_assetManager");
            app.attr("from", old);
            game.entities.addApp(app);
          }
          else {
            var old = app.attr("ui-name");
            app.attr("ui-name", app.attr("from"));
            app.attr("from", old);
            obj.update();
          }
          var parent = app.parent();
          if (parent && parent.parent() && parent.parent().parent() && parent.parent().parent().hasClass("ui-popout")) {
            parent = parent.parent().parent();
            parent.css("width", "");
            parent.css("height", "");
            parent.css("max-height", "");
            parent.resizable();
          }
        });
        div.mousemove(function(){
          if (_down["17"]) {
            div.css("cursor", "pointer");
          }
          else {
            div.css("cursor", "");
          }
        });
      }
      if (app.attr("homebrew") && game.templates.build) {
        var targetIcon = $("<button>").appendTo(optionsBar);
        targetIcon.addClass("background subtitle alttext");
        targetIcon.text("Default Data Model");
        targetIcon.click(function(){
          var select = sync.newApp("ui_JSON");
          select.attr("lookup", "templates.actors."+obj.data._type);
          select.attr("closeTarget", "json-editor");
          game.locals["homebrew"].addApp(select);

          var popout = ui_popOut({
            target : $("body"),
            id : "json-editor",
            title : "Default Data Model(JSON)"
          }, select);
          popout.resizable();
        });
      }

      if (!app.attr("homebrew")) {
        div.click(function(ev){
          if (_down["17"]) {
            if (optionsBar.hasClass("card-selected")) {
              targetIcon.text("Target");
              optionsBar.removeClass("card-selected");
              util.untarget(obj.id());
              sendAlert({text : "Released Target"});
            }
            else {
              optionsBar.addClass("card-selected");
              targetIcon.text("Release Target");
              util.target(obj.id());
              sendAlert({text : "Targeted"});
            }
          }
        });

        var targetIcon = $("<button>").appendTo(optionsBar);
        targetIcon.addClass("background subtitle alttext");
        if (optionsBar.hasClass("card-selected")) {
          targetIcon.text("Release Target");
        }
        else {
          targetIcon.text("Target");
        }
        targetIcon.click(function() {
          if (targetIcon.text() == "Target") {
            targetIcon.text("Release Target");
            if (optionsBar.hasClass("card-selected")) {
              optionsBar.removeClass("card-selected");
              util.untarget(obj.id());
            }
            else {
              optionsBar.addClass("card-selected");
              util.target(obj.id());
            }
          }
          else {
            targetIcon.text("Target");
            if (optionsBar.hasClass("card-selected")) {
              optionsBar.removeClass("card-selected");
              util.untarget(obj.id());
            }
            else {
              optionsBar.addClass("card-selected");
              util.target(obj.id());
            }
          }
        });
      }

      var buffer = $("<div>").appendTo(optionsBar);
      buffer.addClass("flex");

      if (!scope.viewOnly) {
        if (!app.attr("homebrew")) {
          var securityWrap = $("<button>").appendTo(optionsBar);
          securityWrap.addClass("background subtitle alttext");

          var security = genIcon("lock", "Grant Access").appendTo(securityWrap);
          security.attr("title", "Edit who has access to this character");
          security.click(function(){
            if (app.attr("viewingRights")) {
              app.removeAttr("viewingRights");
            }
            else {
              app.attr("viewingRights", true);
            }
            obj.update();
          });
        }

        var buffer = $("<div>").appendTo(optionsBar);
        buffer.addClass("flex");

        var cog = $("<button>").appendTo(optionsBar);
        cog.addClass("background subtitle alttext");
        cog.attr("title", "Manage attributes");
        cog.text("Attributes");
        cog.click(function(){
          if (app.attr("attributes")) {
            app.removeAttr("attributes");
          }
          else {
            app.attr("attributes", true);
          }
          obj.update();
        });
        if (!app.attr("homebrew")) {
          var icon = $("<button>").appendTo(optionsBar);
          icon.addClass("background subtitle alttext");
          icon.text("Update Map Token");
          icon.click(function() {
            if (boardApi.selections && Object.keys(boardApi.selections).length == 1) {
              var selectData = boardApi.selections[Object.keys(boardApi.selections)[0]];
              var ent = getEnt(selectData.board);
              if (selectData.layer && ent && ent.data && ent.data.layers && ent.data.layers[selectData.layer] && ent.data.layers[selectData.layer].p[selectData.index]) {
                found = true;
                var dupe = duplicate(ent.data.layers[selectData.layer].p[selectData.index]);
                delete dupe.x;
                delete dupe.y;
                dupe.w = boardApi.scale(dupe.w, ent, true);
                dupe.h = boardApi.scale(dupe.h, ent, true);
                delete dupe.l;
                delete dupe.e;
                delete dupe.v;
                delete dupe.eID;
                if (dupe.i) {
                  obj.data.info.img.min = dupe.i;
                }
                else {
                  delete obj.data.info.img.min;
                }
                sendAlert({text : "Saved as default token"});

                obj.data.info.img.modifiers = dupe;
                obj.sync("updateAsset");
              }
              else {
                sendAlert({text : "Invalid Token"});
              }
            }
            else {
              sendAlert({text : "Select a single piece to save as the default map token"})
            }
          });
        }

        var calculations = $("<button>").appendTo(optionsBar);
        calculations.addClass("background subtitle alttext");
        calculations.text("Math");
        calculations.click(function(){
          app.attr("viewingData", true);
          obj.update();
        });
        if (hasSecurity(getCookie("UserID"), "Rights", obj.data) || app.attr("homebrew")) {
          var quickSheet = $("<button>").appendTo(optionsBar);
          quickSheet.addClass("background subtitle alttext");
          quickSheet.text("Sheet");
          quickSheet.click(function(){
            obj.data._d = obj.data._d || {style : duplicate(sheet.style) || {}, content : duplicate(sheet.content)};
            app.attr("simpleEditing", true);
            obj.update();
          });
        }
        if (hasSecurity(getCookie("UserID"), "Rights", obj.data) || app.attr("homebrew")) {
          var tags = $("<button>")//.appendTo(optionsBar);
          tags.addClass("background subtitle alttext");
          tags.text("Notes");
          tags.click(function(){
            app.attr("viewingNotes", true);
            obj.update();
          });
        }

        var tags = $("<button>")//.appendTo(optionsBar);
        tags.addClass("background subtitle alttext");
        tags.text("Tags");
        if (app.attr("viewingTags")) {
          tags.removeClass("background");
          tags.addClass("highlight");
        }
        tags.click(function(){
          if (app.attr("viewingTags")) {
            app.removeAttr("viewingTags");
          }
          else {
            app.attr("viewingTags", true);
          }
          obj.update();
        });
        if (!app.attr("homebrew") || game.templates.build) {
          if (game.templates.build) {
            var actions = $("<button>").appendTo(optionsBar);
            actions.addClass("background subtitle alttext");
            actions.text("Hotbar");
            actions.click(function(){
              if (app.attr("viewingActions")) {
                app.removeAttr("viewingActions");
              }
              else {
                app.attr("viewingActions", true);
              }
              obj.update();
            });
          }
          else {
            var actions = $("<button>").appendTo(optionsBar);
            actions.addClass("background subtitle alttext");
            if (app.attr("viewingActions")) {
              actions.removeClass("background");
              actions.addClass("highlight");
            }
            actions.text("Actions");
            actions.click(function(){
              if (app.attr("viewingActions")) {
                app.removeAttr("viewingActions");
                div.empty();
              }
              else {
                app.attr("viewingActions", true);
              }
              obj.update();
            });
            actions.contextmenu(function(ev){
              var actionObj = sync.dummyObj();
              actionObj.data = {context : {c : obj.id()}};

              game.locals["actions"] = game.locals["actions"] || [];
              game.locals["actions"].push(actionObj);

              var newApp = sync.newApp("ui_actions");
              newApp.addClass("spadding");
              actionObj.addApp(newApp);

              var pop = ui_popOut({
                target : $(this),
                minimize : true,
                dragThickness : "0.5em",
                title : "Actions",
                align : "bottom",
                style : {"width" : "300px"},
              }, newApp);
              pop.resizable();

              ev.stopPropagation();
              return false;
            });
          }
        }

        if (hasSecurity(getCookie("UserID"), "Rights", data) && hasSecurity(getCookie("UserID"), "Assistant Master")) {
          if (hasSecurity(getCookie("UserID"), "Owner", data)) {
            var syncLabel;
            if (data._c == -1) {
              syncLabel = genIcon("remove").appendTo(optionsBar);
              syncLabel.addClass("alttext background outline");
              syncLabel.attr("title", "Duplicate to move to Asset Storage");
            }
            else {
              if (data._uid) {
                if (data._sync) {
                  var syncLabel = genIcon("refresh").appendTo(optionsBar);
                  syncLabel.addClass("alttext highlight smooth outline lrpadding");
                  syncLabel.attr("title", "This is saved, and is in-sync with Asset Storage");
                  syncLabel.click(function(ev){
                    runCommand("updateSync", {id : obj.id(), data : false});
                    ev.stopPropagation();
                    return false;
                  });
                }
                else {
                  var syncLabel = genIcon("cloud").appendTo(optionsBar);
                  syncLabel.addClass("alttext highlight smooth outline lrpadding");
                  syncLabel.attr("title", "This is saved, but is not in-sync with Asset Storage");
                  syncLabel.click(function(ev){
                    runCommand("updateSync", {id : obj.id(), data : true});
                    ev.stopPropagation();
                    return false;
                  });
                }
              }
              else {
                var syncLabel = genIcon("cloud")//.appendTo(optionsBar);
                syncLabel.addClass("lrpadding");
                syncLabel.attr("title", "Enable Asset Storage");
                syncLabel.click(function(ev){
                  var popOut = ui_prompt({
                    target : $(this),
                    id : "confirm-store-char",
                    confirm : "Move to Asset Storage",
                    click : function(){
                      runCommand("storeAsset", {id: obj.id()});
                      layout.coverlay("quick-storage-popout");
                      syncLabel.remove();
                    }
                  });
                  ev.stopPropagation();
                  return false;
                });
              }
            }
          }
        }
      }
    }
  }

  var charWrapper = $("<div>").appendTo(div);
  charWrapper.addClass("flexcolumn flex");
  charWrapper.css("overflow-y", "auto");
  charWrapper.attr("_lastScrollTop", app.attr("_lastScrollTop"));
  charWrapper.scroll(function(){
    app.attr("_lastScrollTop", charWrapper.scrollTop());
    app.attr("_lastScrollLeft", charWrapper.scrollLeft());
  });


  var charContents = $("<div>").appendTo(charWrapper);
  charContents.addClass("fit-xy flexcolumn");

  var list = $("<div>").appendTo(charContents);
  list.addClass("fit-x flexaround flexwrap");

  if (obj.data._d) { // flat sheets
    sheet = obj.data._d;

    for (var i in sheet.style) {
      charWrapper.css(i, sheet.style[i]);
    }

    var newScope = duplicate(scope);
    newScope.display = sheet.content;
    if (scope.markup || app.attr("simpleEditing")) {
      newScope.markup = "editing";
    }
    newScope.context = ctx;
    charContents.append(sync.render("ui_processUI")(obj, app, newScope));

    if (obj.data._d.content instanceof Object) {
      if (app.attr("simpleEditing")) {
        if (app.attr("boxPaint")) {
          charWrapper.css("position", "relative");
          charContents.children().children().children().find("*").css("opacity", "0").css("pointer-events","none");

          var sX;
          var sY;
          var snap;
          var fit = $("<div>").appendTo(charWrapper);
          fit.css("position", "absolute");
          fit.css("background", "rgba(0,0,0,0.4)");
          fit.css("min-height", "100%");
          fit.css("min-width", "100%");
          fit.css("cursor", "pointer");
          fit.mousedown(function(ev){
            ghost.show();
            sX = ev.pageX;
            sY = ev.pageY;

            var offset = fit.offset();
            sX = sX - offset.left;
            sY = sY - offset.top;

            sX = sX + charWrapper.scrollLeft();
            sY = sY + charWrapper.scrollTop();
            ev.preventDefault();
          });
          fit.mousemove(function(ev){
            var eX = ev.pageX;
            var eY = ev.pageY;

            var offset = fit.offset();
            eX = eX - offset.left;
            eY = eY - offset.top;

            eX = eX + charWrapper.scrollLeft();
            eY = eY + charWrapper.scrollTop();

            var sXD = sX;
            var sYD = sY;

            if (snap || _down[16]) {
              if (eX < sX) {
                sXD = Math.round(eX/20) * 20;
                eX = Math.floor(sX/20) * 20;
              }
              if (eY < sY) {
                sYD = Math.round(eY/20) * 20;
                eY = Math.floor(sY/20) * 20;
              }
            }

            var eW = Math.round(Math.abs(sXD - eX));
            var eH = Math.round(Math.abs(sYD - eY));

            sXD = Math.round(Math.min(sXD, eX));
            sYD = Math.round(Math.min(sYD, eY));

            if (snap || _down[16]) {
              sXD = Math.round(sXD/20) * 20;
              sYD = Math.round(sYD/20) * 20;
              eW = Math.ceil(eW/20) * 20;
              eH = Math.ceil(eH/20) * 20;
            }

            ghost.css("left", sXD);
            ghost.css("top", sYD);
            ghost.width(eW);
            ghost.height(eH);
            ev.preventDefault();
          });
          fit.mouseup(function(ev){
            if (ev.which == 1) {
              var eX = ev.pageX;
              var eY = ev.pageY;

              var offset = fit.offset();
              eX = eX - offset.left;
              eY = eY - offset.top;

              eX = eX + charWrapper.scrollLeft();
              eY = eY + charWrapper.scrollTop();

              var sXD = sX;
              var sYD = sY;

              if (snap || _down[16]) {
                if (eX < sX) {
                  sXD = Math.round(eX/20) * 20;
                  eX = Math.floor(sX/20) * 20;
                }
                if (eY < sY) {
                  sYD = Math.round(eY/20) * 20;
                  eY = Math.floor(sY/20) * 20;
                }
              }

              var eW = Math.round(Math.abs(sXD - eX));
              var eH = Math.round(Math.abs(sYD - eY));

              sXD = Math.round(Math.min(sXD, eX));
              sYD = Math.round(Math.min(sYD, eY));

              if (snap || _down[16]) {
                sXD = Math.round(sXD/20) * 20;
                sYD = Math.round(sYD/20) * 20;
                eW = Math.ceil(eW/20) * 20;
                eH = Math.ceil(eH/20) * 20;
              }
              if (!_down[17]) {
                var dataList = [];

                var template = {stats : "", info : "", counters : ""};
                for (var key in template) {
                  var pathKey = key;
                  for (var subKey in obj.data[key]) {
                    pathKey = key + "." + subKey;
                    if (pathKey != "info.notes" && pathKey != "info.img") {
                      dataList.push(pathKey);
                    }
                  }
                }
                setTimeout(function(){
                  ui_prompt({
                    target : app,
                    prompt : false,
                    inputs : {
                      "Attribute" : {list : dataList},
                    },
                    click : function(ev, inputs) {
                      if (inputs["Attribute"].val()) {
                        if (obj.data._d && (obj.data._d.content && obj.data._d.content instanceof Object)) {
                          obj.data._d.content.style = obj.data._d.content.style || {};
                          obj.data._d.content.style.position = "relative";

                          obj.data._d.content.display = obj.data._d.content.display || [];
                          obj.data._d.content.display.push(
                            {
                              classes : "flexrow",
                              style : {width : eW, height : eH, position : "absolute", left : sXD, top : sYD},
                              name : "",
                              target : inputs["Attribute"].val(),
                              edit : {classes : "line fit-x middle"}
                            }
                          );
                        }
                        obj.update();
                      }
                      else {
                        sendAlert({text : "No Attribute Selected"});
                      }
                    }
                  });
                }, 10);
                sX = null;
                sY = null;
                ghost.hide();
              }
              else {
                if (obj.data._d && (obj.data._d.content && obj.data._d.content instanceof Object)) {
                  obj.data._d.content.style = obj.data._d.content.style || {};
                  obj.data._d.content.style.position = "relative";

                  obj.data._d.content.display = obj.data._d.content.display || [];

                  obj.data._d.content.display.push(
                    {
                      classes : "white outline smooth flexcolumn flexcontainer",
                      style : {width : eW, height : eH, position : "absolute", left : sXD, top : sYD},
                      display : []
                    }
                  );
                }
                obj.update();
              }
            }
            sX = null;
            sY = null;
            ev.preventDefault();
          });

          var ghost = $("<text>").appendTo(charWrapper);
          ghost.addClass("bold alttext selected");
          ghost.css("position","absolute");
          ghost.css("pointer-events", "none");

          var drawLabel = $("<div>").appendTo(charWrapper);
          drawLabel.addClass("fit-x alttext flexmiddle flexcolumn");
          drawLabel.css("position","absolute");
          drawLabel.css("left", "0");
          drawLabel.css("top", "45%");
          drawLabel.css("pointer-events", "none");
          drawLabel.append("<b>Draw Attribute Fields</b>");
          drawLabel.append("<b>Press Shift to Toggle Snap to Grid</b>");
          drawLabel.append("<b>Hold control to draw an attribute container</b>");
        }
        else {
          function sheetElementMenu(parent, path) {
            var contents = sync.render("ui_addElement")(obj, app, {path : path, closeTarget : "sheet-element-menu", viewOnly : scope.viewOnly});

            var pop = ui_popOut({
              target : app,
              prompt : true,
              id : "sheet-element-menu",
              style : {"width" : "400px", "height" : "400px"},
            }, contents);
            return pop;
          }

          charContents.click(function(){
            var replace = path.replace(app.attr("id")+"_0", "");
            while (replace.match("-")) {
              replace = replace.replace("-", ".");
            }
            if (replace[0] == ".") {
              replace = replace.substring(1, replace.length);
            }

            var select = sync.newApp("ui_JSON");
            select.attr("lookup", "_d.contents"+replace);
            select.attr("closeTarget", "json-editor");
            obj.addApp(select);

            var popout = ui_popOut({
              target : $(this),
              id : "json-editor",
            }, select);
            popout.resizable();
          });
          function build(sData, lastLookup) {
            var first = false;
            if (!lastLookup) {
              lastLookup = app.attr("id")+"_0";
              first = true;
            }
            var name = lastLookup;
            var icon = "";
            if (sData.classes && sData.classes.match("flexcolumn")) {
              icon = 'resize-vertical';
              name = "Columns";
            }
            else if (sData.classes && sData.classes.match("flexrow")) {
              name = "Rows";
              icon = "resize-horizontal";
            }
            if (sData.ui) {
              name = sData.ui;
              icon = "edit";
            }
            if (sData.apps) {
              name = "Apps";
              icon = "th-large";
            }
            if (sData.link) {
              name = sData.link;
              icon = "link"
            }
            if (sData.icon) {
              name = sData.icon;
              icon = "exclamation-sign"
            }

            if (sData.name) {
              name = sData.name;
              icon = "text-color"
            }
            if (sData.target) {
              name = sData.target;
              icon = "";
            }
            function clickWrap(scope, lastLookup) {
              setTimeout(function(){
                $("#"+(newScope.markup || "")+lastLookup).mousemove(function(ev){
                  cursorX = ev.pageX;
                  cursorY = ev.pageY;
                  if (!$("#sheet-element-menu").length) {
                    $(".selected").removeClass("selected");
                    $(this).addClass("selected");
                  }
                  ev.stopPropagation();
                  ev.preventDefault();
                });
                $("#"+(newScope.markup || "")+lastLookup).attr("target", lastLookup);
                $("#"+(newScope.markup || "")+lastLookup).unbind("click");
                $("#"+(newScope.markup || "")+lastLookup).css("cursor", "pointer");
                $("#"+(newScope.markup || "")+lastLookup).click(function(ev){
                  $(".selected").removeClass("selected");
                  $(this).addClass("selected");

                  var popout = sheetElementMenu($(this), lastLookup);

                  ev.stopPropagation();
                });
                $("#"+(newScope.markup || "")+lastLookup).contextmenu(function(ev){
                  $(".selected").removeClass("selected");
                  $(this).addClass("selected");
                  var focus = $(this);
                  var actionsList = [
                    {
                      name : "DELETE",
                      icon : "trash",
                      click : function(ev, ui) {
                        var replace = lastLookup.replace(app.attr("id")+"_0", "");
                        while (replace.match("-")) {
                          replace = replace.replace("-", ".");
                        }
                        if (replace[0] == ".") {
                          replace = replace.substring(1, replace.length);
                        }

                        var index = replace.split("\.");
                        index = index[index.length-1];
                        var final = replace.substring(0, replace.length-1-index.length);
                        var arr = sync.traverse(obj.data._d.content, final);
                        if (arr && Array.isArray(arr)) {
                          arr.splice(index, 1);
                          if (!_down[16]) {
                            layout.coverlay("sheet-element-menu");
                          }
                          obj.update();
                        }
                      }
                    },
                  ]

                  var drop = ui_dropMenu($(this), actionsList, {});

                  ev.stopPropagation();
                  return false;
                });
              }, 10);
            }
            clickWrap(newScope, lastLookup);
            if (sData.display) {
              for (var i in sData.display) {
                if (sData.display[i]) {
                  build(sData.display[i], lastLookup+"-display-"+i);
                }
              }
            }
          }
          build(newScope.display);
        }
      }

      if (sheet.tabs && sheet.tabs.length) {
        var tabContent = genNavBar("flexaround background alttext", "flex", "4px");
        tabContent.addClass("flex");
        function tabWrap(importData, index) {
          tabContent.generateTab(importData.name, importData.icon, function(parent) {
            var newScope = duplicate(scope);
            newScope.display = importData.display;
            newScope.context = ctx;
            if (scope.markup) {
              newScope.markup = "tabs"+index;
            }
            parent.append(sync.render("ui_processUI")(obj, app, newScope));

            if (app) {
              app.attr("char_tab", importData.name);
            }
          });
        }

        for (var index in sheet.tabs) {
          tabWrap(sheet.tabs[index], index);
        }
        if (sheet.tabs && sheet.tabs.length) {
          if (app) {
            if (!app.attr("char_tab") && sheet.tabs) {
              app.attr("char_tab", sheet.tabs[0].name);
            }
            tabContent.selectTab(app.attr("char_tab"));
          }
          else {
            tabContent.selectTab(sheet.tabs[0].name);
          }
        }

        tabContent.appendTo(charContents);
      }
    }
    return div;
  }

  for (var i in sheet.style) {
    charWrapper.css(i, sheet.style[i]);
  }

  var newScope = duplicate(scope);
  newScope.display = sheet.content;
  if (scope.markup) {
    newScope.markup = "content";
  }
  newScope.context = ctx;
  charContents.append(sync.render("ui_processUI")(obj, app, newScope));

  return div;
});


sync.render("ui_characterSheet", function(obj, app, scope){
  var div = $("<div>");
  div.addClass("fit-xy flexcolumn");

  if (!obj || !obj.data || obj.data["_t"] != "c") {
    if (app && layout.mobile) {
      app.attr("ui-name", "ui_assetManager");
      game.entities.addApp(app);
    }
    return div;
  }

  scope = scope || {
    viewOnly: (app.attr("viewOnly") == "true"),
    local : (app.attr("local") == "true"),
    markup : app.attr("markup") == "true",
    editing : app.attr("editing") == "true",
  };

  obj.data._flags = obj.data._flags || duplicate(obj.data.tags || {});
  obj.data._hud = obj.data._hud || obj.data._a || {};

  // don't edit cloud entities
  if (obj.id() && isNaN(obj.id()) && obj.id().match("_") && !scope.editing && !(game.config && game.config.data.offline)) {
    scope.viewOnly = true;
    scope.local = true;
  }

  var sheet = scope.sheet || game.templates.display.sheet;
  var ctx = sync.defaultContext();
  ctx["c"] = obj.data;

  if (app.attr("attributes")) {
    div.removeClass("flexcolumn");
    div.addClass("foreground");
    div.css("overflow", "auto");
    div.scroll(function(){
      app.attr("_lastScrollTop", div.scrollTop());
      app.attr("_lastScrollLeft", div.scrollLeft());
    });

    var buttonList = $("<div>").appendTo(div);
    buttonList.addClass("flexrow foreground flexbetween subtitle");
    buttonList.css("margin-bottom", "1em");

    var reset = $("<button>").appendTo(buttonList);
    reset.addClass("highlight lrpadding alttext flexmiddle");
    reset.text("Back to Sheet");
    reset.click(function(){
      app.removeAttr("attributes");
      obj.update();
    });

    var template = {stats : "", info : "", counters : ""};
    if (!game.templates.build) {
      template["skills"] = "";
    }
    if (game.templates.display.sheet.categories) {
      template = {};
      for (var k in game.templates.display.sheet.categories) {
        template[k] = "";
      }
    }

    var reset = $("<button>").appendTo(buttonList);
    reset.addClass("background lrpadding alttext flexmiddle");
    reset.text("Load Attributes");
    reset.click(function(){
      var content = sync.render("ui_assetPicker")(obj, app, {
        category : "c",
        filter : "c",
        select : function(ev, ui, ent, options, entities){
          if (ent.data) {
            for (var key in template) {
              obj.data[key] = duplicate(ent.data[key]);
            }
            obj.update();
          }
          layout.coverlay("add-asset");
        }
      });
      var pop = ui_popOut({
        target : $("body"),
        prompt : true,
        id : "add-asset",
        title : "Pick Sheet",
        style : {"width" : assetTypes["assetPicker"].width, "height" : assetTypes["assetPicker"].height}
      }, content);
      pop.resizable();
    });

    var keys = {};
    for (var key in template) {
      var path = key;
      var attrPlate = $("<div>").appendTo(div);
      attrPlate.addClass("lrpadding lrmargin");
      attrPlate.css("font-size", "1.2em");
      attrPlate.append("<u class='bold lrpadding lrmargin alttext'>"+key+"</b>");

      var attrWrap = $("<div>").appendTo(attrPlate);
      attrWrap.addClass("flexcolumn subtitle white outline smooth lpadding");
      attrWrap.css("margin-bottom", "1em");

      var headerRow = $("<div>").appendTo(attrWrap);
      headerRow.addClass("flexrow padding");
      headerRow.append("<u class='subtitle flexmiddle lrmargin' style='width:100px'>Macro Key</u>");
      headerRow.append("<u class='flex subtitle flexmiddle lrmargin' style='width:100px'>Name</u>");
      headerRow.append("<u class='flex2 subtitle flexmiddle lrmargin' style='width:100px'>Value</u>");
      headerRow.append("<u class='subtitle flexmiddle lrmargin' style='width:40px'>Min</u>");
      headerRow.append("<u class='subtitle flexmiddle lrmargin' style='width:40px'>Max</u>");
      headerRow.append("<u class='subtitle flexmiddle lrmargin' style='width:70px'>Modifiers</u>");
      headerRow.append(genIcon("remove").addClass("lrpadding lrmargin").css("color", "transparent"));
      for (var subKey in obj.data[key]) {
        path = key + "." + subKey;
        if (path != "info.notes" && path != "info.img" && path != "info.name") {
          var attrOption = $("<div>").appendTo(attrWrap);
          attrOption.addClass("flexrow padding");
          if (!keys[subKey]) {
            attrOption.append("<text class='subtitle flexmiddle' style='width:100px'>@"+subKey+"</text>");
            keys[subKey] = true;
          }
          else {
            attrOption.append("<text class='subtitle flexmiddle' style='width:100px'>@c."+path+"</text>");
          }

          var name = genInput({
            parent : attrOption,
            classes : "line subtitle lrmargin middle",
            value : obj.data[key][subKey],
            cmd : "updateAsset",
            obj : obj,
            name : true,
            style : {"width" : "150px"}
          });

          var value = genInput({
            parent : attrOption,
            classes : "line subtitle flex2 lrmargin middle",
            value : obj.data[key][subKey],
            cmd : "updateAsset",
            obj : obj,
          });

          var min = genInput({
            parent : attrOption,
            classes : "line subtitle lrmargin middle",
            value : obj.data[key][subKey],
            style : {"width" : "40px"},
            cmd : "updateAsset",
            obj : obj,
            raw : "min",
          });

          var max = genInput({
            parent : attrOption,
            classes : "line subtitle lrmargin middle",
            value : obj.data[key][subKey],
            style : {"width" : "40px"},
            cmd : "updateAsset",
            obj : obj,
            raw : "max"
          });

          var remove = genIcon("list-alt", "Mods").appendTo(attrOption);
          remove.addClass("flexmiddle lrmargin lrpadding");
          remove.attr("path", path);
          remove.css("width", "70px");
          remove.click(function(){
            var path = $(this).attr("path");

            var content = sync.newApp("ui_modifiers");
            content.attr("viewOnly", scope.viewOnly);
            content.attr("lookup", path);
            content.attr("modsOnly", "true");
            obj.addApp(content);

            ui_popOut({
              target : $(this),
              align : "top",
              title : "Modifiers",
              id : "modify-exp",
              style : {"min-width" : "100px"},
            }, content);
          });

          var remove = genIcon("remove").appendTo(attrOption);
          remove.addClass("destroy flexmiddle lrmargin lrpadding");
          remove.attr("path", path);
          remove.click(function(){
            var path = $(this).attr("path");

            ui_prompt({
              target : $(this),
              confirm : "Delete Attribute",
              click : function(){
                sync.traverse(obj.data, path, "");
                obj.sync("updateAsset");
              }
            });
          });
        }
      }

      var headerRow = genIcon("plus", "New Attribute").appendTo(attrWrap);
      headerRow.addClass("flexmiddle fit-x create");
      headerRow.attr("category", key);
      headerRow.click(function(){
        var category = $(this).attr("category");

        var invalidKeys = {
          "length" : "system",
        }; // invalid keys

        for (var key in obj.data) {
          invalidKeys[key] = key;
        }
        for (var key in obj.data.info) {
          invalidKeys[key] = "info."+key;
        }
        for (var key in obj.data.counters) {
          invalidKeys[key] = "counters."+key;
        }
        for (var key in obj.data.stats) {
          invalidKeys[key] = "stats."+key;
        }


        for (var key in game.templates.item.info) {
          invalidKeys[key] = "item.info."+key;
        }
        for (var key in game.templates.item.equip) {
          invalidKeys[key] = "item.equip."+key;
        }
        for (var key in game.templates.item.weapon) {
          invalidKeys[key] = "item.weapon."+key;
        }
        for (var key in game.templates.item.spell) {
          invalidKeys[key] = "item.spell."+key;
        }

        ui_prompt({
          target : $(this),
          inputs : {
            "Macro Key" : "",
          },
          click : function(ev, inputs){
            var path = inputs["Macro Key"].val();
            if (path && path != "notes" && path != "img" && path != "name" && isNaN(path)) {
              path = replaceAll(path, " ", "_");
              path = replaceAll(path, "@", "");
              path = replaceAll(path, "(", "_");
              path = replaceAll(path, ")", "_");
              path = replaceAll(path, "[", "_");
              path = replaceAll(path, "]", "_");
              path = replaceAll(path, "!", "_");
              path = replaceAll(path, "#", "_");
              path = replaceAll(path, "$", "_");
              if (invalidKeys[path]) {
                sendAlert({text : "This key is used somewhere else"});
              }
              else {
                obj.data[category][path] = {};
                obj.sync("updateAsset");
              }
            }
          }
        });
      });
    }

    return div;
  }

  if (app.attr("viewingData")) {
    var calcs = duplicate(obj.data._calc || sheet.calc || []);

    var buttonList = $("<div>").appendTo(div);
    buttonList.addClass("flexrow foreground subtitle flexbetween");

    if (hasSecurity(getCookie("UserID"), "Rights", obj.data) || app.attr("homebrew")) {
      var confirm = $("<button>").appendTo(buttonList);
      confirm.addClass("highlight alttext flexmiddle");
      confirm.text("Save");
      confirm.click(function(){
        obj.data._calc = calcs;

        app.removeAttr("viewingData");
        obj.sync("updateAsset");
      });
    }

    var discard = $("<button>").appendTo(buttonList);
    discard.addClass("highlight alttext flexmiddle");
    discard.text("Discard Changes");
    discard.click(function(){
      app.removeAttr("viewingData");
      obj.update();
    });


    if (!app.attr("homebrew")) {
      var reset = $("<button>").appendTo(buttonList);
      reset.addClass("highlight lrpadding alttext flexmiddle");
      reset.text("Clear");
      reset.click(function(){
        obj.data._calc = [];

        obj.update();
      });
    }

    if (!app.attr("homebrew")) {
      var reset = $("<button>").appendTo(buttonList);
      reset.addClass("highlight lrpadding alttext flexmiddle");
      reset.text("Reset to Default");
      reset.click(function(){
        delete obj.data._calc;

        app.removeAttr("viewingData");
        obj.sync("updateAsset");
      });
    }

    var header = $("<highlight>").appendTo(div);
    header.addClass("fit-x flexmiddle");
    header.text("Automatic Calculations");

    var calcWrapper = $("<div>").appendTo(div);
    calcWrapper.addClass("flexcolumn margin flex outline smooth");
    calcWrapper.css("position", "relative");
    calcWrapper.css("overflow-y", "auto");

    var calcList = $("<div>").appendTo(calcWrapper);
    calcList.addClass("fit-x");
    calcList.css("position", "absolute");
    calcList.css("top", "0");
    calcList.css("left", "0");

    if (!obj.data._calc) {
      calcList.css("opacity", "0.25");
      calcList.css("pointer-events", "none");

      var calcDefault = $("<highlight>").appendTo(calcWrapper);
      calcDefault.addClass("fit-xy flexcolumn flexmiddle");
      calcDefault.append("<text>System Calculations</text><br><text class='subtitle'>Click to overwrite system</text>");
      calcDefault.click(function(){
        calcDefault.remove();
        calcList.css("opacity", "");
        calcList.css("pointer-events", "");
      });
    }
    sync.render("ui_math")(obj, app, {calc : calcs}).appendTo(calcList);

    var warning = $("<i>").appendTo(div);
    warning.addClass("flexmiddle subtitle bold")
    warning.text("Calculations that are applied automatically after a sheet has been changed. Calculations are applied in sequential order, allowing you to reference a value affected by a previous calculation");

    return div;
  }

  if (app.attr("viewingNotes")) {
    var content = sync.newApp("ui_editPage").appendTo(div);
    content.attr("targetApp", app.attr("id"));
    obj.addApp(content);

    return div;
  }

  if (app.attr("viewingActions")) {
    div.addClass("foreground");

    var buttonList = $("<div>").appendTo(div);
    buttonList.addClass("flexrow foreground");

    var reset = $("<button>").appendTo(buttonList);
    reset.addClass("highlight lrpadding alttext flexmiddle");
    reset.text("Save Changes");
    reset.click(function(){
      app.removeAttr("viewingActions");
      obj.sync("updateAsset");
    });

    var actionObj = sync.dummyObj();
    actionObj.data = {context : {c : obj.id()}};

    game.locals["actions"] = game.locals["actions"] || [];
    game.locals["actions"].push(actionObj);

    var charWrapper = $("<div>").appendTo(div);
    charWrapper.addClass("flexcolumn flex");
    charWrapper.css("overflow-y", "auto");
    charWrapper.attr("_lastScrollTop", app.attr("_lastScrollTop"));
    charWrapper.scroll(function(){
      app.attr("_lastScrollTop", charWrapper.scrollTop());
      app.attr("_lastScrollLeft", charWrapper.scrollLeft());
    });

    sync.render("ui_manageActions")(obj, app, scope).appendTo(charWrapper);

    /*var newApp = sync.newApp("ui_actions").appendTo(div);
    newApp.addClass("spadding");
    actionObj.addApp(newApp);*/
    return div;
  }

  if (app.attr("viewingRights")) {
    var buttonList = $("<div>").appendTo(div);
    buttonList.addClass("flexrow foreground");
    buttonList.css("margin-bottom", "1em");

    var reset = $("<button>").appendTo(buttonList);
    reset.addClass("highlight lrpadding alttext flexmiddle");
    reset.text("Back to Sheet");
    reset.click(function(){
      app.removeAttr("viewingRights");
      obj.update();
    });

    var content = sync.newApp("ui_rights").appendTo(div);
    content.attr("viewOnly", scope.viewOnly);
    content.attr("last_rights", "indv");
    obj.addApp(content);

    return div;
  }

  if (!app.attr("homebrew") && !scope.editing) {
    var calc = obj.data._calc || sheet.calc || [];
    for (var i=0; i<calc.length; i++) {
      if (!calc[i].cond || sync.eval(calc[i].cond, ctx)) {
        var val = sync.eval(calc[i].eq, ctx);
        var target = sync.traverse(obj.data, calc[i].target);
        if (target instanceof Object) {
          sync.rawVal(target, val);
        }
        else {
          sync.traverse(obj.data, calc[i].target, val);
        }
      }
    }
    if (game.templates.build) {
      for (var key in game.templates.hudLookups) {
        var listKey = game.templates.hudLookups[key];
        var list = sync.traverse(obj.data, listKey);
        if (list) {
          for (var id in list) {
            var itemData = list[id];
            ctx["i"] = itemData;
            var calc = itemData._calc || [];
            for (var i=0; i<calc.length; i++) {
              if (calc[i].cond == null || sync.eval(calc[i].cond, ctx)) {
                var val = sync.eval(calc[i].eq, ctx);
                var target = sync.traverse(obj.data, calc[i].target);
                if (target instanceof Object) {
                  sync.rawVal(target, val);
                }
                else {
                  sync.traverse(obj.data, calc[i].target, val);
                }
              }
            }
          }
        }
      }
    }
    else {
      for (var id in obj.data.inventory) {
        var itemData = obj.data.inventory[id];
        ctx["i"] = itemData;
        var calc = itemData._calc || [];
        for (var i=0; i<calc.length; i++) {
          if (calc[i].cond == null || sync.eval(calc[i].cond, ctx)) {
            var val = sync.eval(calc[i].eq, ctx);
            var target = sync.traverse(obj.data, calc[i].target);
            if (target instanceof Object) {
              sync.rawVal(target, val);
            }
            else {
              sync.traverse(obj.data, calc[i].target, val);
            }
          }
        }
      }
      for (var id in obj.data.spellbook) {
        var itemData = obj.data.spellbook[id];
        ctx["i"] = itemData;
        var calc = itemData._calc || [];
        for (var i=0; i<calc.length; i++) {
          if (calc[i].cond == null || sync.eval(calc[i].cond, ctx)) {
            var val = sync.eval(calc[i].eq, ctx);
            var target = sync.traverse(obj.data, calc[i].target);
            if (target instanceof Object) {
              sync.rawVal(target, val);
            }
            else {
              sync.traverse(obj.data, calc[i].target, val);
            }
          }
        }
      }
    }
    delete ctx["i"];
  }

  ctx["c"] = obj.data;

  var data = obj.data || {info : {}};

  if (!scope.viewOnly) {
    div.on("dragover", function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (_dragTransfer) {
        var olay = layout.overlay({
          target : app,
          id : app.attr("id")+"-drag-overlay",
          style : {"background-color" : "rgba(0,0,0,0.5)", "pointer-events" : "none"}
        });
        olay.addClass("flexcolumn flexmiddle alttext");
        olay.css("font-size", "2em");
        olay.css("z-index", util.getMaxZ(".ui-popout")+1);
        if (_dragTransfer.roll) {
          olay.addClass("focus");
          olay.append("<b>Targeting</b>");
        }
      }
      else if (!$("#"+app.attr("id")+"-drag-overlay").length) {
    		var olay = layout.overlay({
          target : app,
          id : app.attr("id")+"-drag-overlay",
          style : {"background-color" : "rgba(0,0,0,0.5)", "pointer-events" : "none"}
        });
        olay.addClass("flexcolumn flexmiddle alttext");
        olay.css("font-size", "2em");
        olay.css("z-index", util.getMaxZ(".ui-popout")+1);
        olay.append("<b>Drop to Create</b>");
      }
    });
    div.droppable();
    div.on('drop', function(ev, ui){
      ev.preventDefault();
      ev.stopPropagation();
      if (_dragTransfer) {
        if (_dragTransfer.roll) {
          optionsBar.addClass("card-selected");
          sendAlert({text : "Targeted " + sync.rawVal(obj.data.info.name)});
          var pop = ui_dropMenu(app, util.buildActions(_dragTransfer.roll), {id : "dice-action", align : "center", style : {"font-size" : "1.6em"}});
        }
      }
      else {
        var dt = ev.originalEvent.dataTransfer||$(ui.draggable).data("dt");
        if (hook.call("OnDropCharacter", obj, app, scope, dt)) {
          if (dt && dt.getData("OBJ")) {
            var ent = JSON.parse(dt.getData("OBJ"));
            if (ent._t == "i") {
              if (ent._drop) {
                var list = sync.traverse(obj.data, ent._drop);
                if (!ent._dropKey && Array.isArray(list)) {
                  list.push(ent);
                }
                else if (list && list instanceof Object) {
                  var ui = $(this);
                  if (!ent._dropKey) {
                    ui_prompt({
                      inputs : {"Unique Key" : ""},
                      click: function(ev, inputs){
                        ent._dropKey = inputs["Unique Key"].val().toLowerCase().replace(/ /g,"_");
                        if (list[ent._dropKey]) {
                          ui_dropMenu(ui, [{name : "Overwrite?", click : function(){list[ent._dropKey] = ent; obj.sync("updateAsset");}}], {id : "quick-sheet-drop", hideClose : true, "z-index" : util.getMaxZ(".ui-popout")+1});
                        }
                        else {
                          list[ent._dropKey] = ent;
                        }
                      }
                    });
                    return;
                  }
                  else {
                    if (list[ent._dropKey]) {
                      ui_dropMenu(ui, [{name : "Overwrite?", click : function(){list[ent._dropKey] = ent; obj.sync("updateAsset");}}], {id : "quick-sheet-drop", hideClose : true, "z-index" : util.getMaxZ(".ui-popout")+1});
                      return;
                    }
                    else {
                      list[ent._dropKey] = ent;
                    }
                  }
                }
              }
              else if (dt.getData("spell") || ent.tags["spell"]) {
                obj.data.spellbook.push(ent);
              }
              else {
                obj.data.inventory.push(ent);
              }
            }
            else if (dt.getData("target")) {
              obj.data[dt.getData("target")][dt.getData("key")] = ent;
            }
            obj.sync("updateAsset");
          }
          else if (dt && dt.getData("Text")) {
            sync.rawVal(obj.data.info.img, dt.getData("Text"));
            obj.sync("updateAsset");
          }
        }
      }

      layout.coverlay(app.attr("id")+"-drag-overlay");
    });
  	div.on("dragleave", function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      layout.coverlay(app.attr("id")+"-drag-overlay");
  	});
  }

  var info = data.info;
  if (!scope.local) {
    var optionsBar = $("<div>").appendTo(div);
    optionsBar.addClass("flexwrap flexbetween background boxinshadow alttext");
    optionsBar.css("color", "white");
    optionsBar.attr("index", obj.id());
    div.contextmenu(function(ev){
      if (!_down["16"]) {
        var menu = assetTypes.contextmenu(ev, optionsBar, obj, app, scope);
        menu.css("left", ev.pageX - 10);
        menu.css("top", ev.pageY - 10);
        util.windowBound(menu);
        return false;
      }
    });

    if (app.attr("simpleEditing")) {
      if (hasSecurity(getCookie("UserID"), "Rights", obj.data) || app.attr("homebrew")) {
        var quickSheet = $("<button>").appendTo(optionsBar);
        quickSheet.addClass("highlight subtitle alttext");
        quickSheet.text("Stop Editing");
        quickSheet.click(function(){
          if (JSON.stringify(obj.data._d.content) == JSON.stringify(game.templates.display.sheet.content)) {
            if (JSON.stringify(obj.data._d.style) == JSON.stringify(game.templates.display.sheet.style)) {
              delete obj.data._d;
            }
          }
          app.removeAttr("simpleEditing");
          obj.sync("updateAsset");
        });

        var modeBar = $("<div>").appendTo(optionsBar)
        modeBar.addClass("flexrow");
        modeBar.css("color", "#333");
        modeBar.css("text-shadow", "none");

        var quickSheet = $("<button>").appendTo(modeBar);
        quickSheet.addClass("button subtitle");
        quickSheet.text("Paint Mode");
        if (app.attr("boxPaint")) {
          if ((obj.data._d && obj.data._d.content instanceof Object) || (!obj.data._d && sheet.content instanceof Object)) {
            quickSheet.removeClass("button").addClass("highlight alttext");
          }
        }
        quickSheet.click(function(){
          if (obj.data._d && !(obj.data._d.content instanceof Object)) {
            obj.data._d.content = {display : []};
          }
          else if (!obj.data._d) {
            obj.data._d = {style : duplicate(game.templates.display.sheet.style) || {}, content : {classes : "flexcolumn flex padding", display : []}};
          }
          if (app.attr("boxPaint")) {
            app.removeAttr("boxPaint");
          }
          else {
            app.attr("boxPaint", true);
          }
          obj.update();
        });

        var quickSheet = $("<button>").appendTo(modeBar);
        quickSheet.addClass("button subtitle");
        quickSheet.text("Build Mode");
        if (!app.attr("boxPaint")) {
          if ((obj.data._d && obj.data._d.content instanceof Object) || (!obj.data._d && sheet.content instanceof Object)) {
            quickSheet.removeClass("button").addClass("highlight alttext");
          }
        }
        quickSheet.click(function(){
          if (obj.data._d && !(obj.data._d.content instanceof Object)) {
            obj.data._d.content = {display : []};
          }
          else if (!obj.data._d) {
            obj.data._d = {style : duplicate(game.templates.display.sheet.style) || {}, content : {classes : "flexcolumn flex padding", display : []}};
          }
          if (app.attr("boxPaint")) {
            app.removeAttr("boxPaint");
          }
          else {
            app.attr("boxPaint", true);
          }
          obj.update();
        });


        var quickSheet = $("<button>").appendTo(modeBar);
        quickSheet.addClass("button subtitle");
        quickSheet.text("HTML Mode");

        if ((obj.data._d && !(obj.data._d.content instanceof Object)) || !(sheet.content instanceof Object)) {
          quickSheet.removeClass("button").addClass("highlight alttext");
        }
        quickSheet.click(function(){
          var content = $("<div>");
          content.addClass("flexcolumn fit-xy");

          var select = genInput({
            parent : content,
            type : "textarea",
            classes : "flex subtitle",
          });
          if (obj.data._d && !(obj.data._d.content instanceof Object)) {
            select.text(obj.data._d.content);
          }
          else if (!(sheet.content instanceof Object)) {
            select.text(sheet.content);
          }
          select.change(function(){
            obj.data._d.content = $(this).val();
            obj.update();
          });

          content.append("<button class='fit-x spadding'>Confirm</button>");

          var popout = ui_popOut({
            target : $("body"),
            id : "json-editor",
            style : {"width" : "600px", "height" : "600px"}
          }, content);
          popout.resizable();
        });


        var quickSheet = $("<button>").appendTo(optionsBar);
        quickSheet.addClass("background subtitle alttext");
        quickSheet.text("Sheet Background");
        quickSheet.click(function(){
          var imgList = sync.render("ui_filePicker")(obj, app, {
            filter : "img",
            change : function(ev, ui, value){
              var img = new Image();
              img.src = value;
              img.onload = function(){
                obj.data._d = obj.data._d || {style : duplicate(game.templates.display.sheet.style) || {}, content : duplicate(game.templates.display.sheet.content)};
                obj.data._d.style = obj.data._d.style || duplicate(game.templates.display.sheet.style) || {};

                var aspect = this.naturalWidth/this.naturalHeight;

                var imageWidth = this.naturalWidth;
                var imageHeight = this.naturalHeight;
                var areaHeight = 750;
                var areaWidth = 700;

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

                obj.data._d.style["background-image"] = 'url("'+value+'")';
                obj.data._d.style["background-size"] = imageWidth + "px " + imageHeight + "px";
                obj.data._d.style["background-repeat"] = "no-repeat";

                obj.update();
                layout.coverlay("icons-picker");
                layout.coverlay("style-sheet");
              };
              img.onerror = function(){
                sendAlert({text : "Error Loading Image"});
                layout.coverlay("icons-picker");
              }
            }
          });

          var pop = ui_popOut({
            target : $(this),
            id : "icons-picker",
            align : "top",
            prompt : true,
            style : {"width" : assetTypes["filePicker"].width, "height" : assetTypes["filePicker"].height}
          }, imgList);
          pop.resizable();
        });

        if (!((obj.data._d && !(obj.data._d.content instanceof Object)) || !(sheet.content instanceof Object))) {
          var quickSheet = $("<button>").appendTo(optionsBar);
          quickSheet.addClass("background subtitle alttext");
          quickSheet.text("Blank Sheet");
          quickSheet.click(function(){
            ui_prompt({
              target : $(this),
              confirm : "Clear Sheet?",
              click : function() {
                obj.data._d = {style : duplicate(game.templates.display.sheet.style) || {}, content : {classes : "flexcolumn flex padding", display : []}};
                app.attr("simpleEditing", true);
                obj.update();
              }
            });
          });
          var quickSheet = $("<button>").appendTo(optionsBar);
          quickSheet.addClass("background subtitle alttext");
          quickSheet.text("Default Sheet");
          quickSheet.click(function(){
            obj.data._d = {style : duplicate(game.templates.display.sheet.style) || {}, content : duplicate(game.templates.display.sheet.content)};
            app.attr("simpleEditing", true);
            obj.update();
          });
          var quickSheet = $("<button>").appendTo(optionsBar);
          quickSheet.addClass("background subtitle alttext");
          quickSheet.text("Pre-made");
          quickSheet.click(function(){
            var actionList = [];
            for (var key in game.templates.display.sheet.premade) {
              function wrap(key){
                actionList.push({
                  name : key,
                  click : function(){
                    obj.data._d = duplicate(game.templates.display.sheet.premade[key]);
                    obj.sync("updateAsset");
                  }
                });
              }
              wrap(key);
            }
            for (var key in util.premadeSheets) {
              function wrap(key){
                actionList.push({
                  name : key,
                  click : function(){
                    obj.data._d = duplicate(util.premadeSheets[key]);
                    obj.sync("updateAsset");
                  }
                });
              }
              wrap(key);
            }

            var actionList = util.customSheets(obj, app, scope, sheet);
            ui_dropMenu($(this), actionList, {id : "quick-sheet-drop", "z-index" : util.getMaxZ(".ui-popout")+1});
          });
        }

        var quickSheet = $("<button>").appendTo(optionsBar);
        quickSheet.addClass("background subtitle alttext");
        quickSheet.text("JSON");
        quickSheet.click(function(){
          var select = sync.newApp("ui_JSON");
          select.attr("lookup", "_d");
          select.attr("closeTarget", "json-editor");
          obj.addApp(select);

          var popout = ui_popOut({
            target : $(this),
            id : "json-editor",
          }, select);
          popout.resizable();
        });

        var quickSheet = $("<button>").appendTo(optionsBar);
        quickSheet.addClass("background subtitle alttext");
        quickSheet.text("Load a Sheet");
        quickSheet.click(function(){
          var content = sync.render("ui_assetPicker")(obj, app, {
            category : "c",
            select : function(ev, ui, ent, options, entities){
              if (ent.data._d) {
                obj.data._d = duplicate(ent.data._d);
                obj.update();
              }
              layout.coverlay("add-asset");
            }
          });
          var pop = ui_popOut({
            target : $("body"),
            prompt : true,
            id : "add-asset",
            title : "Pick Sheet",
            style : {"width" : assetTypes["assetPicker"].width, "height" : assetTypes["assetPicker"].height}
          }, content);
          pop.resizable();
        });
      }
    }
    else {
      if (app.attr("from") && game.templates.display.sheet.summary) {
        var back = genIcon("arrow-left").appendTo(optionsBar);
        back.addClass("lrmargin");
        back.attr("title", "Back");
        back.click(function(){
          if (layout.mobile) {
            runCommand("selectPlayerEntity");
            obj.removeApp(app);
            var old = app.attr("ui-name");
            app.attr("ui-name", "ui_assetManager");
            app.attr("from", old);
            game.entities.addApp(app);
          }
          else {
            var old = app.attr("ui-name");
            app.attr("ui-name", app.attr("from"));
            app.attr("from", old);
            obj.update();
          }
          var parent = app.parent();
          if (parent && parent.parent() && parent.parent().parent() && parent.parent().parent().hasClass("ui-popout")) {
            parent = parent.parent().parent();
            parent.css("width", "");
            parent.css("height", "");
            parent.css("max-height", "");
            parent.resizable();
          }
        });
        div.mousemove(function(){
          if (_down["17"]) {
            div.css("cursor", "pointer");
          }
          else {
            div.css("cursor", "");
          }
        });
      }
      if (!app.attr("homebrew")) {
        div.click(function(ev){
          if (_down["17"]) {
            if (optionsBar.hasClass("card-selected")) {
              targetIcon.text("Target");
              optionsBar.removeClass("card-selected");
              util.untarget(obj.id());
              sendAlert({text : "Released Target"});
            }
            else {
              optionsBar.addClass("card-selected");
              targetIcon.text("Release Target");
              util.target(obj.id());
              sendAlert({text : "Targeted"});
            }
          }
        });

        var targetIcon = $("<button>").appendTo(optionsBar);
        targetIcon.addClass("background subtitle alttext");
        if (optionsBar.hasClass("card-selected")) {
          targetIcon.text("Release Target");
        }
        else {
          targetIcon.text("Target");
        }
        targetIcon.click(function() {
          if (targetIcon.text() == "Target") {
            targetIcon.text("Release Target");
            if (optionsBar.hasClass("card-selected")) {
              optionsBar.removeClass("card-selected");
              util.untarget(obj.id());
            }
            else {
              optionsBar.addClass("card-selected");
              util.target(obj.id());
            }
          }
          else {
            targetIcon.text("Target");
            if (optionsBar.hasClass("card-selected")) {
              optionsBar.removeClass("card-selected");
              util.untarget(obj.id());
            }
            else {
              optionsBar.addClass("card-selected");
              util.target(obj.id());
            }
          }
        });
      }

      var buffer = $("<div>").appendTo(optionsBar);
      buffer.addClass("flex");

      if (!scope.viewOnly) {
        if (!app.attr("homebrew")) {
          var securityWrap = $("<button>").appendTo(optionsBar);
          securityWrap.addClass("background subtitle alttext");

          var security = genIcon("lock", "Grant Access").appendTo(securityWrap);
          security.attr("title", "Edit who has access to this character");
          security.click(function(){
            if (app.attr("viewingRights")) {
              app.removeAttr("viewingRights");
            }
            else {
              app.attr("viewingRights", true);
            }
            obj.update();
          });
        }

        var buffer = $("<div>").appendTo(optionsBar);
        buffer.addClass("flex");

        var cog = $("<button>").appendTo(optionsBar);
        cog.addClass("background subtitle alttext");
        cog.attr("title", "Manage attributes");
        cog.text("Attributes");
        cog.click(function(){
          if (app.attr("attributes")) {
            app.removeAttr("attributes");
          }
          else {
            app.attr("attributes", true);
          }
          obj.update();
        });
        if (!app.attr("homebrew")) {
          var icon = $("<button>").appendTo(optionsBar);
          icon.addClass("background subtitle alttext");
          icon.text("Update Map Token");
          icon.click(function() {
            if (boardApi.selections && Object.keys(boardApi.selections).length == 1) {
              var selectData = boardApi.selections[Object.keys(boardApi.selections)[0]];
              var ent = getEnt(selectData.board);
              if (selectData.layer && ent && ent.data && ent.data.layers && ent.data.layers[selectData.layer] && ent.data.layers[selectData.layer].p[selectData.index]) {
                found = true;
                var dupe = duplicate(ent.data.layers[selectData.layer].p[selectData.index]);
                delete dupe.x;
                delete dupe.y;
                dupe.w = boardApi.scale(dupe.w, ent, true);
                dupe.h = boardApi.scale(dupe.h, ent, true);
                delete dupe.l;
                delete dupe.e;
                delete dupe.v;
                delete dupe.eID;
                if (dupe.i) {
                  obj.data.info.img.min = dupe.i;
                }
                else {
                  delete obj.data.info.img.min;
                }
                sendAlert({text : "Saved as default token"});

                obj.data.info.img.modifiers = dupe;
                obj.sync("updateAsset");
              }
              else {
                sendAlert({text : "Invalid Token"});
              }
            }
            else {
              sendAlert({text : "Select a single piece to save as the default map token"})
            }
          });
        }

        var calculations = $("<button>").appendTo(optionsBar);
        calculations.addClass("background subtitle alttext");
        calculations.text("Math");
        calculations.click(function(){
          app.attr("viewingData", true);
          obj.update();
        });
        if (hasSecurity(getCookie("UserID"), "Rights", obj.data) || app.attr("homebrew")) {
          var quickSheet = $("<button>").appendTo(optionsBar);
          quickSheet.addClass("background subtitle alttext");
          quickSheet.text("Sheet");
          quickSheet.click(function(){
            obj.data._d = obj.data._d || {style : duplicate(game.templates.display.sheet.style) || {}, content : duplicate(game.templates.display.sheet.content)};
            app.attr("simpleEditing", true);
            obj.update();
          });
        }
        if (hasSecurity(getCookie("UserID"), "Rights", obj.data) || app.attr("homebrew")) {
          var tags = $("<button>")//.appendTo(optionsBar);
          tags.addClass("background subtitle alttext");
          tags.text("Notes");
          tags.click(function(){
            app.attr("viewingNotes", true);
            obj.update();
          });
        }

        var tags = $("<button>")//.appendTo(optionsBar);
        tags.addClass("background subtitle alttext");
        tags.text("Tags");
        if (app.attr("viewingTags")) {
          tags.removeClass("background");
          tags.addClass("highlight");
        }
        tags.click(function(){
          if (app.attr("viewingTags")) {
            app.removeAttr("viewingTags");
          }
          else {
            app.attr("viewingTags", true);
          }
          obj.update();
        });
        if (!app.attr("homebrew") || game.templates.build) {
          if (game.templates.build) {
            var actions = $("<button>").appendTo(optionsBar);
            actions.addClass("background subtitle alttext");
            actions.text("Actions");
            actions.click(function(ev){
              var newApp = sync.newApp("ui_manageActionsv2");
              newApp.attr("homebrew", app.attr("homebrew"));
              obj.addApp(newApp);

              var pop = ui_popOut({
                target : $(this),
                minimize : true,
                dragThickness : "0.5em",
                title : "Actions",
                align : "bottom",
                style : {"width" : "300px", "max-height" : "300px"},
              }, newApp);
              pop.resizable();

              ev.stopPropagation();
              return false;
            });
          }
          else {
            var actions = $("<button>").appendTo(optionsBar);
            actions.addClass("background subtitle alttext");
            if (app.attr("viewingActions")) {
              actions.removeClass("background");
              actions.addClass("highlight");
            }
            actions.text("Actions");
            actions.click(function(){
              if (app.attr("viewingActions")) {
                app.removeAttr("viewingActions");
                div.empty();
              }
              else {
                app.attr("viewingActions", true);
              }
              obj.update();
            });
            actions.contextmenu(function(ev){
              var actionObj = sync.dummyObj();
              actionObj.data = {context : {c : obj.id()}};

              game.locals["actions"] = game.locals["actions"] || [];
              game.locals["actions"].push(actionObj);

              var newApp = sync.newApp("ui_actions");
              newApp.addClass("spadding");
              actionObj.addApp(newApp);

              var pop = ui_popOut({
                target : $(this),
                minimize : true,
                dragThickness : "0.5em",
                title : "Actions",
                align : "bottom",
                style : {"width" : "300px"},
              }, newApp);
              pop.resizable();

              ev.stopPropagation();
              return false;
            });
          }
        }

        if (hasSecurity(getCookie("UserID"), "Rights", data) && hasSecurity(getCookie("UserID"), "Assistant Master")) {
          if (hasSecurity(getCookie("UserID"), "Owner", data)) {
            var syncLabel;
            if (data._c == -1) {
              syncLabel = genIcon("remove").appendTo(optionsBar);
              syncLabel.addClass("alttext background outline");
              syncLabel.attr("title", "Duplicate to move to Asset Storage");
            }
            else {
              if (data._uid) {
                if (data._sync) {
                  var syncLabel = genIcon("refresh").appendTo(optionsBar);
                  syncLabel.addClass("alttext highlight smooth outline lrpadding");
                  syncLabel.attr("title", "This is saved, and is in-sync with Asset Storage");
                  syncLabel.click(function(ev){
                    runCommand("updateSync", {id : obj.id(), data : false});
                    ev.stopPropagation();
                    return false;
                  });
                }
                else {
                  var syncLabel = genIcon("cloud").appendTo(optionsBar);
                  syncLabel.addClass("alttext highlight smooth outline lrpadding");
                  syncLabel.attr("title", "This is saved, but is not in-sync with Asset Storage");
                  syncLabel.click(function(ev){
                    runCommand("updateSync", {id : obj.id(), data : true});
                    ev.stopPropagation();
                    return false;
                  });
                }
              }
              else {
                var syncLabel = genIcon("cloud")//.appendTo(optionsBar);
                syncLabel.addClass("lrpadding");
                syncLabel.attr("title", "Enable Asset Storage");
                syncLabel.click(function(ev){
                  var popOut = ui_prompt({
                    target : $(this),
                    id : "confirm-store-char",
                    confirm : "Move to Asset Storage",
                    click : function(){
                      runCommand("storeAsset", {id: obj.id()});
                      layout.coverlay("quick-storage-popout");
                      syncLabel.remove();
                    }
                  });
                  ev.stopPropagation();
                  return false;
                });
              }
            }
          }
        }
      }
    }
  }
  else if (obj.id() && isNaN(obj.id()) && obj.id().match(getCookie("UserID"))) {
    var optionsBar = $("<div>").appendTo(div);
    optionsBar.addClass("flexaround background");
    optionsBar.css("color", "white");

    var cloudWrap = genIcon("cloud-download", "Download Asset").appendTo(optionsBar);
    cloudWrap.attr("title", "Download Asset");

    cloudWrap.click(function(ev){
      if (game.locals["storage"]) {
        for (var i in game.locals["storage"].data.l) {
          var listEntry = game.locals["storage"].data.l[i];
          var split = obj.id().split("_");
          if (obj.data._c == getCookie("UserID") && listEntry._uid == split[1]) {
            listEntry.move = true;
            runCommand("moveAssets", {l : game.locals["storage"].data.l});
            delete listEntry.move;
            game.entities.listen[obj.id()] = function(src, update, target) {
              for (var key in src.data) {
                var newEnt = src.data[key];
                if (newEnt.data && newEnt.data._c == split[0] && newEnt.data._uid == split[1]) {
                  obj.removeApp(app);
                  newEnt.addApp(app);
                  return false;
                }
              }
              return true;
            }
            break;
          }
        }
      }
      else {
        sendAlert({text : "Asset Storage hasn't loaded yet"});
      }
      ev.preventDefault();
      ev.stopPropagation();
    });
  }

  if (app.attr("viewingTags")) {
    var tags = sync.render("ui_tags")(obj, app, scope).appendTo(div);
    tags.addClass("foreground outlinebottom");
  }

  var charWrapper = $("<div>").appendTo(div);
  charWrapper.addClass("flexcolumn flex");
  charWrapper.css("overflow-y", "auto");
  charWrapper.attr("_lastScrollTop", app.attr("_lastScrollTop"));
  charWrapper.scroll(function(){
    app.attr("_lastScrollTop", charWrapper.scrollTop());
    app.attr("_lastScrollLeft", charWrapper.scrollLeft());
  });


  var charContents = $("<div>").appendTo(charWrapper);
  charContents.addClass("fit-xy flexcolumn");

  var list = $("<div>").appendTo(charContents);
  list.addClass("fit-x flexaround flexwrap");

  var ctx = sync.defaultContext();
  ctx[obj.data._t] = obj.data;

  if (obj.data._d) { // flat sheets
    sheet = obj.data._d;

    for (var i in sheet.style) {
      charWrapper.css(i, sheet.style[i]);
    }

    var newScope = duplicate(scope);
    newScope.display = sheet.content;
    if (scope.markup || app.attr("simpleEditing")) {
      newScope.markup = "editing";
    }
    newScope.context = ctx;
    charContents.append(sync.render("ui_processUI")(obj, app, newScope));

    if (obj.data._d.content instanceof Object) {
      if (app.attr("simpleEditing")) {
        if (app.attr("boxPaint")) {
          charWrapper.css("position", "relative");
          charContents.children().children().children().find("*").css("opacity", "0").css("pointer-events","none");

          var sX;
          var sY;
          var snap;
          var fit = $("<div>").appendTo(charWrapper);
          fit.css("position", "absolute");
          fit.css("background", "rgba(0,0,0,0.4)");
          fit.css("min-height", "100%");
          fit.css("min-width", "100%");
          fit.css("cursor", "pointer");
          fit.mousedown(function(ev){
            ghost.show();
            sX = ev.pageX;
            sY = ev.pageY;

            var offset = fit.offset();
            sX = sX - offset.left;
            sY = sY - offset.top;

            sX = sX + charWrapper.scrollLeft();
            sY = sY + charWrapper.scrollTop();
            ev.preventDefault();
          });
          fit.mousemove(function(ev){
            var eX = ev.pageX;
            var eY = ev.pageY;

            var offset = fit.offset();
            eX = eX - offset.left;
            eY = eY - offset.top;

            eX = eX + charWrapper.scrollLeft();
            eY = eY + charWrapper.scrollTop();

            var sXD = sX;
            var sYD = sY;

            if (snap || _down[16]) {
              if (eX < sX) {
                sXD = Math.round(eX/20) * 20;
                eX = Math.floor(sX/20) * 20;
              }
              if (eY < sY) {
                sYD = Math.round(eY/20) * 20;
                eY = Math.floor(sY/20) * 20;
              }
            }

            var eW = Math.round(Math.abs(sXD - eX));
            var eH = Math.round(Math.abs(sYD - eY));

            sXD = Math.round(Math.min(sXD, eX));
            sYD = Math.round(Math.min(sYD, eY));

            if (snap || _down[16]) {
              sXD = Math.round(sXD/20) * 20;
              sYD = Math.round(sYD/20) * 20;
              eW = Math.ceil(eW/20) * 20;
              eH = Math.ceil(eH/20) * 20;
            }

            ghost.css("left", sXD);
            ghost.css("top", sYD);
            ghost.width(eW);
            ghost.height(eH);
            ev.preventDefault();
          });
          fit.mouseup(function(ev){
            if (ev.which == 1) {
              var eX = ev.pageX;
              var eY = ev.pageY;

              var offset = fit.offset();
              eX = eX - offset.left;
              eY = eY - offset.top;

              eX = eX + charWrapper.scrollLeft();
              eY = eY + charWrapper.scrollTop();

              var sXD = sX;
              var sYD = sY;

              if (snap || _down[16]) {
                if (eX < sX) {
                  sXD = Math.round(eX/20) * 20;
                  eX = Math.floor(sX/20) * 20;
                }
                if (eY < sY) {
                  sYD = Math.round(eY/20) * 20;
                  eY = Math.floor(sY/20) * 20;
                }
              }

              var eW = Math.round(Math.abs(sXD - eX));
              var eH = Math.round(Math.abs(sYD - eY));

              sXD = Math.round(Math.min(sXD, eX));
              sYD = Math.round(Math.min(sYD, eY));

              if (snap || _down[16]) {
                sXD = Math.round(sXD/20) * 20;
                sYD = Math.round(sYD/20) * 20;
                eW = Math.ceil(eW/20) * 20;
                eH = Math.ceil(eH/20) * 20;
              }
              if (!_down[17]) {
                var dataList = [];

                var template = {stats : "", info : "", counters : ""};
                for (var key in template) {
                  var pathKey = key;
                  for (var subKey in obj.data[key]) {
                    pathKey = key + "." + subKey;
                    if (pathKey != "info.notes" && pathKey != "info.img") {
                      dataList.push(pathKey);
                    }
                  }
                }
                setTimeout(function(){
                  ui_prompt({
                    target : app,
                    prompt : false,
                    inputs : {
                      "Attribute" : {list : dataList},
                    },
                    click : function(ev, inputs) {
                      if (inputs["Attribute"].val()) {
                        if (obj.data._d) {
                          obj.data._d.content.style = obj.data._d.content.style || {};
                          obj.data._d.content.style.position = "relative";

                          obj.data._d.content.display = obj.data._d.content.display || [];
                          obj.data._d.content.display.push(
                            {
                              classes : "flexrow",
                              style : {width : eW, height : eH, position : "absolute", left : sXD, top : sYD},
                              name : "",
                              target : inputs["Attribute"].val(),
                              edit : {classes : "line fit-x middle"}
                            }
                          );
                        }
                        obj.update();
                      }
                      else {
                        sendAlert({text : "No Attribute Selected"});
                      }
                    }
                  });
                }, 10);
                sX = null;
                sY = null;
                ghost.hide();
              }
              else {
                if (obj.data._d) {
                  obj.data._d.content.style = obj.data._d.content.style || {};
                  obj.data._d.content.style.position = "relative";

                  obj.data._d.content.display = obj.data._d.content.display || [];

                  obj.data._d.content.display.push(
                    {
                      classes : "white outline smooth flexcolumn flexcontainer",
                      style : {width : eW, height : eH, position : "absolute", left : sXD, top : sYD},
                      display : []
                    }
                  );
                }
                obj.update();
              }
            }
            sX = null;
            sY = null;
            ev.preventDefault();
          });

          var ghost = $("<text>").appendTo(charWrapper);
          ghost.addClass("bold alttext selected");
          ghost.css("position","absolute");
          ghost.css("pointer-events", "none");

          var drawLabel = $("<div>").appendTo(charWrapper);
          drawLabel.addClass("fit-x alttext flexmiddle flexcolumn");
          drawLabel.css("position","absolute");
          drawLabel.css("left", "0");
          drawLabel.css("top", "45%");
          drawLabel.css("pointer-events", "none");
          drawLabel.append("<b>Draw Attribute Fields</b>");
          drawLabel.append("<b>Press Shift to Toggle Snap to Grid</b>");
          drawLabel.append("<b>Hold control to draw an attribute container</b>");
        }
        else {
          function sheetElementMenu(parent, path) {
            var contents = sync.render("ui_addElement")(obj, app, {path : path, closeTarget : "sheet-element-menu", viewOnly : scope.viewOnly});

            var pop = ui_popOut({
              target : app,
              prompt : true,
              id : "sheet-element-menu",
              style : {"width" : "400px", "height" : "400px"},
            }, contents);
            return pop;
          }

          charContents.click(function(){
            var replace = path.replace(app.attr("id")+"_0", "");
            while (replace.match("-")) {
              replace = replace.replace("-", ".");
            }
            if (replace[0] == ".") {
              replace = replace.substring(1, replace.length);
            }

            var select = sync.newApp("ui_JSON");
            select.attr("lookup", "_d.contents"+replace);
            select.attr("closeTarget", "json-editor");
            obj.addApp(select);

            var popout = ui_popOut({
              target : $(this),
              id : "json-editor",
            }, select);
            popout.resizable();
          });
          function build(sData, lastLookup) {
            var first = false;
            if (!lastLookup) {
              lastLookup = app.attr("id")+"_0";
              first = true;
            }
            var name = lastLookup;
            var icon = "";
            if (sData.classes && sData.classes.match("flexcolumn")) {
              icon = 'resize-vertical';
              name = "Columns";
            }
            else if (sData.classes && sData.classes.match("flexrow")) {
              name = "Rows";
              icon = "resize-horizontal";
            }
            if (sData.ui) {
              name = sData.ui;
              icon = "edit";
            }
            if (sData.apps) {
              name = "Apps";
              icon = "th-large";
            }
            if (sData.link) {
              name = sData.link;
              icon = "link"
            }
            if (sData.icon) {
              name = sData.icon;
              icon = "exclamation-sign"
            }

            if (sData.name) {
              name = sData.name;
              icon = "text-color"
            }
            if (sData.target) {
              name = sData.target;
              icon = "";
            }
            function clickWrap(scope, lastLookup) {
              setTimeout(function(){
                $("#"+(newScope.markup || "")+lastLookup).mousemove(function(ev){
                  cursorX = ev.pageX;
                  cursorY = ev.pageY;
                  if (!$("#sheet-element-menu").length) {
                    $(".selected").removeClass("selected");
                    $(this).addClass("selected");
                  }
                  ev.stopPropagation();
                  ev.preventDefault();
                });
                $("#"+(newScope.markup || "")+lastLookup).attr("target", lastLookup);
                $("#"+(newScope.markup || "")+lastLookup).unbind("click");
                $("#"+(newScope.markup || "")+lastLookup).css("cursor", "pointer");
                $("#"+(newScope.markup || "")+lastLookup).click(function(ev){
                  $(".selected").removeClass("selected");
                  $(this).addClass("selected");

                  var popout = sheetElementMenu($(this), lastLookup);

                  ev.stopPropagation();
                });
                $("#"+(newScope.markup || "")+lastLookup).contextmenu(function(ev){
                  $(".selected").removeClass("selected");
                  $(this).addClass("selected");
                  var focus = $(this);
                  var actionsList = [
                    {
                      name : "DELETE",
                      icon : "trash",
                      click : function(ev, ui) {
                        var replace = lastLookup.replace(app.attr("id")+"_0", "");
                        while (replace.match("-")) {
                          replace = replace.replace("-", ".");
                        }
                        if (replace[0] == ".") {
                          replace = replace.substring(1, replace.length);
                        }

                        var index = replace.split("\.");
                        index = index[index.length-1];
                        var final = replace.substring(0, replace.length-1-index.length);
                        var arr = sync.traverse(obj.data._d.content, final);
                        if (arr && Array.isArray(arr)) {
                          arr.splice(index, 1);
                          if (!_down[16]) {
                            layout.coverlay("sheet-element-menu");
                          }
                          obj.update();
                        }
                      }
                    },
                  ]

                  var drop = ui_dropMenu($(this), actionsList, {});

                  ev.stopPropagation();
                  return false;
                });
              }, 10);
            }
            clickWrap(newScope, lastLookup);
            if (sData.display) {
              for (var i in sData.display) {
                if (sData.display[i]) {
                  build(sData.display[i], lastLookup+"-display-"+i);
                }
              }
            }
          }
          build(newScope.display);
        }
      }

      if (sheet.tabs && sheet.tabs.length) {
        var tabContent = genNavBar("flexaround background alttext", "flex", "4px");
        tabContent.addClass("flex");
        function tabWrap(importData, index) {
          tabContent.generateTab(importData.name, importData.icon, function(parent) {
            var newScope = duplicate(scope);
            newScope.display = importData.display;
            newScope.context = ctx;
            if (scope.markup) {
              newScope.markup = "tabs"+index;
            }
            parent.append(sync.render("ui_processUI")(obj, app, newScope));

            if (app) {
              app.attr("char_tab", importData.name);
            }
          });
        }

        for (var index in sheet.tabs) {
          tabWrap(sheet.tabs[index], index);
        }
        if (sheet.tabs && sheet.tabs.length) {
          if (app) {
            if (!app.attr("char_tab") && sheet.tabs) {
              app.attr("char_tab", sheet.tabs[0].name);
            }
            tabContent.selectTab(app.attr("char_tab"));
          }
          else {
            tabContent.selectTab(sheet.tabs[0].name);
          }
        }

        tabContent.appendTo(charContents);
      }
    }
    return div;
  }

  for (var i in sheet.style) {
    charWrapper.css(i, sheet.style[i]);
  }

  var newScope = duplicate(scope);
  newScope.display = sheet.content;
  if (scope.markup) {
    newScope.markup = "content";
  }
  newScope.context = ctx;
  charContents.append(sync.render("ui_processUI")(obj, app, newScope));
  if (sheet.tabs && sheet.tabs.length) {
    var tabContent = genNavBar("flexaround background alttext", "flex", "4px");
    tabContent.addClass("flex");
    function tabWrap(importData, index) {
      tabContent.generateTab(importData.name, importData.icon, function(parent) {
        var newScope = duplicate(scope);
        newScope.display = importData.display;
        newScope.context = ctx;
        if (scope.markup) {
          newScope.markup = "tabs"+index;
        }
        parent.append(sync.render("ui_processUI")(obj, app, newScope));

        if (app) {
          app.attr("char_tab", importData.name);
        }
      });
    }

    for (var index in sheet.tabs) {
      tabWrap(sheet.tabs[index], index);
    }
    if (sheet.tabs && sheet.tabs.length) {
      if (app) {
        if (!app.attr("char_tab") && sheet.tabs) {
          app.attr("char_tab", sheet.tabs[0].name);
        }
        tabContent.selectTab(app.attr("char_tab"));
      }
      else {
        tabContent.selectTab(sheet.tabs[0].name);
      }
    }

    tabContent.appendTo(charContents);
  }

  return div;
});
