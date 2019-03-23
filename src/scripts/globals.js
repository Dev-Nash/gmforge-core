function global_init() {
  util.initialize = [];
}

var connection = {alive : false, peers : {}, streams : {}};
// Game state, this is important
// Do NOT write to this, or you will break everything
var game = {
  locals : {}, // all local information
  //players : sync.newObj(), // userID as a key
  config : null, // game configurations
  entities : null,
  events : null, // All Events performed by the DM
  components : null, // list of all the ui components a player has access to
  templates : {}, // data structures specific to game
  commands : {},
  version : 4 // the version for the patcher to check against
};

function setupGame() {
  game.entities = game.entities || sync.obj();
  game.entities.data = game.entities.data || {};

  game.config = game.config || sync.obj();
  game.config.data = game.config.data ||{};

  game.events = game.events || sync.obj();
  game.events.data = game.events.data || {};

  game.state = game.state || sync.obj();
  game.state.data = game.state.data || {};

  game.display = game.display || sync.obj();
  game.display.data = game.display.data || {};

  game.players = game.players || sync.obj("players");
  game.players.data = game.players.data || {};

  game.logs = game.logs || sync.obj();
  game.logs.data = game.logs.data || {};

  game.locals["newAssetList"] = [];
}


game.components = [
  {name : "System Builder", ui : "ui_homebrew", basic : "Tweak and change the layout of your game, including how stats are calculated, what your character sheets look like and much more!", w : 100, h : 100, asTab : true},
  {name : "Character Importer", ui : "ui_charImporter", basic : "Import Characters in simple text or from XML files from OggDude's tool and PCGen", author : "Noobulater", w : 50, h : 50}, // first action is the default
];
