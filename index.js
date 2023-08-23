//<![CDATA[
"use strict";


window.WebFontConfig = {
  //  'active' means all requested fonts have finished loading
  //  We set a 1 second delay before calling 'createText'.
  //  For some reason if we don't the browser cannot render the text the first time it's created.
  active: function () {
    setTimeout(function () {
      game.state.start("TelaMenu");
    }, 1000);
  },

  //  The Google Fonts we want to load (specify as many as you like in the array)
  google: {
    families: ['Indie+Flower']
  }
};


// https://github.com/photonstorm/phaser/blob/v2.6.2/src/core/Group.js#L2372
Phaser.Group.prototype.getRandomNotExists = function (startIndex, endIndex) {
  var list = this.getAll('exists', false, startIndex, endIndex);
  return this.game.rnd.pick(list);
};

// Essa não é a forma mais "profissional" de fazer, mas é a mais simples :)

// Vamos chamar a variável de game, para ficar igual ao sandbox!
var game = new Phaser.Game(1280, 720, Phaser.AUTO, "divJogo");
console.log(game)
//Variaveis sprites
var barco;
var barcoInvencivel;
var barcoPiscaTime;
var barcoPiscaVez;
var aguaBarco;
var cursors;
var atira;
var barcoInimigo;
var barcoInimigo2;

//Variaveis aceleracao
var aceleracaoMover = 1250,
  aceleracaoParar = 1750;

//Variaveis background
var fundo;
var filtro;
var ilha;

var parede;
var parede2;


//Variaveis mecanica bala
var bulletTime = 0;
var fireInterval = 350;
var timeUltimoTiro = 0;
var nextFire = 0;

var balas;
var balasInimigas;
var InimigosMortos = 0;

var explosoes;

var pedras;

var inimigosVivos = [];
var firingTimer = 0;

//Variaveis texto
var textoDistancia = 0;
var textoInimigos = 0;

var textoFim = 0;

//Loopings
var loopPedras;
var loopDist;
var loopMoe;
var loopBarIni;
var loopBarIni2;
//Variaveis distancia
var distancia = 0;

var coracao;
var coracao2;
var coracao3;
var vidas = 3;
var vidasInimigo2 = 3;
var tipoVerificacao = 0;

var liberaAtirar = true;

var botaoMenu;
var menuImage;
var btnMenu;
var btnRestart;

var explosion;
var dist = 0.5;
var musicaFundo

var contaInimigosMortos = 0;

function TelaInicial(game) {

  // A função init() não aparecia no sandbox porque eles fazem ela por nós lá! :)
  // A função init() não aparecia no sandbox porque eles fazem ela por nós lá! :)
  this.init = function () {

    game.input.maxPointers = 1;

    // Deixar o jogo executando, mesmo se o browser mudar de aba?
    game.stage.disableVisibilityChange = false;

    if (game.device.desktop) {
      // Configurações específicas para desktop

      // Como criamos o CSS acima, não precisamos centralizar via código
      game.scale.pageAlignHorizontally = false;
    } else {
      // Configurações específicas para celulares

      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      // Especifica o tamanho mímino e máximo para a área do jogo (de 400x300 até 800x600)
      game.scale.setMinMax(400, 300, 1280, 720);
      game.scale.forceLandscape = true;
      // Como criamos o CSS acima, não precisamos centralizar via código
      game.scale.pageAlignHorizontally = false;
    }

  }

  this.preload = function () {
    game.load.crossOrigin = "anonymous";

    game.load.image('ship', 'images/fragatinha.png');
    game.load.spritesheet('AguaMove', 'images/WaterEffect.png', 158, 430);
    game.load.spritesheet('AguaMoveInimiga', 'images/WaterEffectInimigo.png', 158, 430);
    game.load.image('barcoinimigo', 'images/Fragatinha3.png');
    game.load.image('barcoinimigoSprite', 'images/Fragatinha4.png');
    game.load.image('missil1', 'images/cannon_ball.png');
    game.load.image('balaInimiga', 'images/cannon_ball.png');
    game.load.image('coracao', 'images/vida2.png');
    game.load.image('pedra', 'images/pedra1.png');
    game.load.image('pedra2', 'images/pedra2.png');
    game.load.image('pedra3', 'images/pedra3.png');

    //ANIMAÇÕES
    game.load.spritesheet('explode', 'images/explosion.png', 64, 64);

    //Sprites mapa
    game.load.spritesheet('waterP', 'images/marLoop2.jpg', 2560, 1440);
    game.load.spritesheet('ilha', 'images/ilhazinha.png', 1280, 1080);
    game.load.image('parede', 'images/Colisor2.png');

    //MENU IN GAME
    game.load.image('telaScore', 'images/telaScore.png');
    game.load.image('btnMenu', 'images/btnHighLight.png');

    //AUDIOS
    game.load.audio('explosion', 'http://examples.phaser.io/assets/audio/SoundEffects/explosion.mp3');
    game.load.audio('music', 'audios/musica.mp3');

    //game.load.script('filter', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/CheckerWave.js');
    game.load.script('filter', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/Marble.js');
  }

  this.create = function () {
    game.stage.backgroundColor = "#3498db";
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //AGUA
    fundo = game.add.tileSprite(0, 0, 1280, 1440, 'waterP');
    fundo.width = 1280;
    fundo.height = 720;
    //fundo.visible = false;

    // var fragmentSrc = [
    //     "precision mediump float;",
    //     "#define N 3",
    //     "uniform float time;",
    //     "uniform vec2 mouse;",
    //     "uniform vec2 resolution;",
    //     "uniform sampler2D tex0;",
    //     "float plasma(vec2 u) {",
    //       "vec2 p = u;",
    //       "float t = time * 2.4;",
    //       "float r = 0.0;",
    //       "for (int i = 0; i < N; i++) {",
    //         "float d = 3.14159265 * float(i) * 5.0 / float(N);",
    //         "r = 0.75 * length(p) + 0.01;",
    //         "float a = atan(p.x,p.y)*4.;",
    //         "float xx = p.x;",
    //         "p.x += cos(p.y+sin(r*1.3+time) + d + r ) + cos(t*2.+r);",
    //         "p.y -= sin(xx +cos(r*2.3+a) - d + r + time*2.) + sin(t-r*2.);",
    //       "}",
    //       "return (r / 36.0) - 0.3;",
    //     "}",
    //     "void main(void) {",
    //       "vec2 uv = gl_FragCoord.xy;",
    //       "uv.x -= resolution.x * 0.5;",
    //       "uv = uv / resolution.xy * 40.0;",
    //       "uv.x /= 1.5;",
    //       "uv.y += 20.0;",
    //
    //       "float c = plasma (uv);",
    //       "vec2 coord = (gl_FragCoord.xy / resolution.xy) + (0.15 * c);",
    //       "coord.y *= 0.5;",
    //       "coord.y += time * 0.02;",
    //       "if (coord.y <= 0.0) { coord.y = -coord.y; } else {",
    //       "coord.y = mod(coord.y, 2.0);",
    //       "if (coord.y > 1.0) coord.y = 2.0 - coord.y; }",
    //
    //       "float f = (((resolution.y - gl_FragCoord.y) / resolution.y) + 0.2) * 1.25;",
    //       "if (coord.x < 0.0) coord.x = -coord.x;",
    //       "else if (coord.x > 1.0) coord.x = 2.0 - coord.x;",
    //       "float r = clamp((c * f),0.0,1.0);",
    //       "r = clamp(((r - 0.5) * 2.5) + 0.5, 0.0, 1.0);",
    //       "gl_FragColor = vec4(texture2D(tex0, coord)) + vec4(r, r, r, 0.0);",
    //     "}"
    // ];
    // var uniforms = {
    //     tex0: { type: "sampler2D", value: fundo.texture, textureData: { repeat: true } }
    // };
    // filtro = new Phaser.Filter(game, uniforms, fragmentSrc);
    // filtro.setResolution(1280, 720);
    // fundo.filters = [ filtro ];

    ilha = game.add.tileSprite(0, 0, 1280, 1080, 'ilha');
    explosion = game.add.audio('explosion', 0.1);

    //PEDRAS
    pedras = game.add.group();
    pedras.enableBody = true;
    pedras.createMultiple(5, 'pedra');
    pedras.createMultiple(5, 'pedra2');
    pedras.createMultiple(5, 'pedra3');
    game.physics.arcade.enable(pedras, true);

    //Parede invisivel laterais
    parede = game.add.sprite(0, 0, 'parede');
    parede2 = game.add.sprite(1225, 0, 'parede');
    game.physics.enable(parede, Phaser.Physics.ARCADE);
    game.physics.enable(parede2, Phaser.Physics.ARCADE);
    parede.body.enable = true;
    parede2.body.enable = true;
    parede.alpha = 0;
    parede2.alpha = 0;
    parede.body.collideWorldBounds = true;
    parede2.body.collideWorldBounds = true;
    parede.body.immovable = true
    parede2.body.immovable = true;

    aguaBarco = game.make.sprite(0, 0, 'AguaMove');
    aguaBarco.scale.setTo(0.4);
    aguaBarco.anchor.setTo(0.5, 0.5);
    aguaBarco.animations.add("movimento", [0, 1, 2, 3, 4], 12, true);
    aguaBarco.animations.play("movimento");

    //BARCO
    barco = game.add.sprite(640, 600, 'ship');
    game.physics.arcade.enable(barco);
    barco.body.fixedRotation = true;
    barco.body.collideWorldBounds = true;
    barco.body.maxVelocity.x = 400;
    barco.body.maxVelocity.y = 400;
    barco.body.enable = true;
    barco.anchor.setTo(0.5, 0.77);
    barco.addChild(aguaBarco);
    barco.body.velocidadeAntigaX = 0;
    barco.body.velocidadeAntigaY = 0;

    //Balas
    balas = game.add.group();
    balas.enableBody = true;
    balas.physicsBodyType = Phaser.Physics.ARCADE;
    balas.createMultiple(30, 'missil1');
    balas.setAll('anchor.x', 0.5);
    balas.setAll('anchor.y', 0.5);
    balas.setAll('outOfBoundsKill', true);
    balas.setAll('checkWorldBounds', true);

    //Barcos inimigos
    barcoInimigo = game.add.group();
    barcoInimigo.enableBody = true;
    barcoInimigo.createMultiple(15, 'barcoinimigo');
    barcoInimigo.physicsBodyType = Phaser.Physics.ARCADE;

    barcoInimigo2 = game.add.group();
    barcoInimigo2.enableBody = true;
    barcoInimigo2.createMultiple(15, 'barcoinimigoSprite');
    barcoInimigo2.physicsBodyType = Phaser.Physics.ARCADE;


    //Balas Inimigas
    balasInimigas = game.add.group();
    balasInimigas.enableBody = true;
    balasInimigas.physicsBodyType = Phaser.Physics.ARCADE;
    balasInimigas.createMultiple(30, 'balaInimiga');
    balasInimigas.setAll('anchor.x', 0.5);
    balasInimigas.setAll('anchor.y', 0.5);
    balasInimigas.setAll('outOfBoundsKill', true);
    balasInimigas.setAll('checkWorldBounds', true);

    menuImage = game.add.image(350, 50, 'telaScore');
    menuImage.scale.setTo(0.7);
    menuImage.visible = false;

    btnMenu = game.add.sprite(570, 197, 'btnMenu');
    btnMenu.scale.setTo(0.7);
    btnMenu.visible = false;
    btnMenu.inputEnabled = true;
    btnMenu.events.onInputDown.add(backToMenu, this);
    btnMenu.events.onInputOver.add(mouseOverBtnMenu, this);
    btnMenu.events.onInputOut.add(mouseOutBtnMenu, this);
    btnMenu.alpha = 0;

    btnRestart = game.add.sprite(570, 447, 'btnMenu');
    btnRestart.scale.setTo(0.7);
    btnRestart.visible = false;
    btnRestart.inputEnabled = true;
    btnRestart.events.onInputDown.add(restart, this);
    btnRestart.events.onInputOver.add(mouseOverBtnRestart, this);
    btnRestart.events.onInputOut.add(mouseOutBtnRestart, this);
    btnRestart.alpha = 0;

    musicaFundo = game.add.audio('music', 0.4);
    musicaFundo.play();

    //botaoMenu = game.add.image(540,450, 'menu');
    //botaoMenu.scale.setTo(1.2);
    //botaoMenu.visible = false;
    //botaoMenu.inputEnabled = true;
    //botaoMenu.events.onInputDown.add(backToMenu, this);
    //botaoMenu.events.onInputOver.add(clicaOverMenu, this);
    //botaoMenu.events.onInputOut.add(clicaOutPlay, this);

    //CORAÇÕES
    vidas = game.add.group();
    for (var i = 0; i < 3; i++) {
      var coracao = vidas.create(game.world.width - 155 + (60 * i), 40, 'coracao');
      coracao.anchor.setTo(0.5, 0.5);
      coracao.scale.setTo(0.3, 0.3);
    }

    //EXPLOSÕES
    explosoes = game.add.group();
    explosoes.createMultiple(30, 'explode');

    textoDistancia = game.add.text(10, 10, '', {
      font: '65px Sun',
      fill: "#ecd781",
      padding: "20px",
      letterspacing: "200px"
    });
    textoDistancia.stroke = "#000000";
    textoDistancia.strokeThickness = 6;
    //textoInimigos = game.add.text(10, 60, 'Inimigos: 0', {
    //    font: "40px arial",
    //    fill: "#ffffff",
    //    backgroundColor: "#34495e",
    //    padding: "20px"
    //});

    textoFim = game.add.text(game.world.centerX, game.world.centerY + 28, ' ', {
      font: '45px Sun',
      fill: '#fff',
      fill: "#ecd781"
    });
    textoFim.anchor.setTo(0.5, 0.5);
    textoFim.visible = false;

    //TECLADO
    cursors = game.input.keyboard.createCursorKeys();
    atira = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    restart();
  }

  function backToMenu() {
    game.state.start("TelaMenu");
    musicaFundo.stop();
  }

  function mouseOverBtnMenu() {
    btnMenu.alpha = 1;
  }

  function mouseOverBtnRestart() {
    btnRestart.alpha = 1;
  }

  function mouseOutBtnMenu() {
    btnMenu.alpha = 0.4;
  }

  function mouseOutBtnRestart() {
    btnRestart.alpha = 0.4;
  }

  // function clicaOverMenu(){
  //     botaoMenu = game.add.image(540,450, 'menuOver');
  //     botaoMenu.scale.setTo(1.2,1.2);
  // }
  //
  // function clicaOutPlay(){
  //     botaoMenu = game.add.image(540,450, 'menu');
  //     botaoMenu.scale.setTo(1.2,1.2);
  // }

  this.update = function () {

    // filtro.update();

    var lista = pedras.getAll('exists', true);
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].body.y > 300) {
        lista[i].outOfBoundsKill = true;
        lista[i].checkWorldBounds = true;
      }
    }

    var lista2 = barcoInimigo.getAll('exists', true);
    for (var i = 0; i < lista2.length; i++) {
      if (lista2[i].body.y > 300) {
        lista2[i].outOfBoundsKill = true;
        lista2[i].checkWorldBounds = true;
      }
    }

    game.physics.arcade.collide(barco, [parede, parede2]);

    if (!barcoInvencivel) {
      tipoVerificacao = 0;
      game.physics.arcade.overlap(barco, pedras, collisionHandler, null, this);
      tipoVerificacao = 1;
      game.physics.arcade.overlap(barco, barcoInimigo, collisionHandler, null, this);
      game.physics.arcade.overlap(barco, barcoInimigo2, collisionHandler, null, this);
      tipoVerificacao = 2;
      game.physics.arcade.overlap(barco, balasInimigas, collisionHandler, null, this);
    }

    game.physics.arcade.overlap(balas, barcoInimigo, collisionHandler2, null, this);
    //game.physics.arcade.overlap(balas, barcoInimigo2, collisionHandler2, null, this);

    game.physics.arcade.overlap(balas, pedras, collisionHandler3, null, this);
    game.physics.arcade.overlap(balasInimigas, pedras, collisionHandler3, null, this);
    game.physics.arcade.overlap(pedras, barcoInimigo2, collisionHandler3, null, this);
    game.physics.arcade.overlap(barcoInimigo, pedras, collisionHandler4, null, this);
    game.physics.arcade.overlap(balas, balasInimigas, collisionHandler5, null, this);

    game.physics.arcade.overlap(balas, barcoInimigo2, collisionHandler6, null, this);

    ajustaVelocidadeBarco();

    //Clicar para atirar
    if (liberaAtirar === true) {
      if (atira.isDown) {
        var agora = game.time.now;
        var deltaT = agora - timeUltimoTiro;
        if (deltaT >= fireInterval) {
          timeUltimoTiro = agora;
          fire();
          explosion.play();
        }
      }
    }

    if (game.time.now > firingTimer) {
      inimigoFires();
      inimigoFires2();
    }

    //Move o fundo
    fundo.tilePosition.y += 2;
    fundo.tilePosition.x += dist;
    ilha.tilePosition.y += 2;

    if (distancia % 800 === 0) {
      dist += 0.2;
    }

    if (barcoInvencivel) {
      if (game.time.now >= barcoPiscaTime) {
        barcoPiscaTime = game.time.now + 100;
        barcoPiscaVez++;
        if ((barcoPiscaVez & 1)) {
          barco.visible = true;
          if (barcoPiscaVez >= 21) {
            barcoInvencivel = false;
          }
        } else {
          barco.visible = false;
        }
      }
    }
  }

  function ajustaVelocidadeBarco() {
    var a = 0;
    var v = barco.body.velocity.x;
    if (cursors.left.isDown) {
      if (v > 0) {
        // Derrapando! (Poderíamos utilizar uma animação especial aqui, para mostrar a derrapagem)
        a = -aceleracaoParar;
      } else {
        a = -aceleracaoMover;
      }
    } else if (cursors.right.isDown) {
      if (v < 0) {
        // Derrapando! (Poderíamos utilizar uma animação especial aqui, para mostrar a derrapagem)
        a = aceleracaoParar;
      } else {
        a = aceleracaoMover;
      }
    } else {
      if (v > 0) {
        if (barco.body.velocidadeAntigaX < 0) {
          // Força a parada!
          a = 0;
          v = 0;
        } else {
          // Ainda estamos parando
          a = -aceleracaoParar;
        }
      } else if (v < 0) {
        if (barco.body.velocidadeAntigaX > 0) {
          // Força a parada!
          a = 0;
          v = 0;
        } else {
          // Ainda estamos parando
          a = aceleracaoParar;
        }
      }
    }
    barco.angle = v * 25 / barco.body.maxVelocity.x;
    barco.body.velocidadeAntigaX = v;
    barco.body.velocity.x = v;
    barco.body.acceleration.x = a;

    var a = 0;
    var v = barco.body.velocity.y;
    if (cursors.up.isDown) {
      if (v > 0) {
        // Derrapando! (Poderíamos utilizar uma animação especial aqui, para mostrar a derrapagem)
        a = -aceleracaoParar;
      } else {
        a = -aceleracaoMover;
      }
    } else if (cursors.down.isDown) {
      if (v < 0) {
        // Derrapando! (Poderíamos utilizar uma animação especial aqui, para mostrar a derrapagem)
        a = aceleracaoParar;
      } else {
        a = aceleracaoMover;
      }
    } else {
      if (v > 0) {
        if (barco.body.velocidadeAntigaY < 0) {
          // Força a parada!
          a = 0;
          v = 0;
        } else {
          // Ainda estamos parando
          a = -aceleracaoParar;
        }
      } else if (v < 0) {
        if (barco.body.velocidadeAntigaY > 0) {
          // Força a parada!
          a = 0;
          v = 0;
        } else {
          // Ainda estamos parando
          a = aceleracaoParar;
        }
      }
    }
    barco.body.velocidadeAntigaY = v;
    barco.body.velocity.y = v;
    barco.body.acceleration.y = a;
  }

  function contaDistancia() {

    distancia++;

    textoDistancia.setText(distancia + "m");

  }

  function contaInimigos() {

    InimigosMortos++;
    //textoInimigos.setText('Inimigos: ' + InimigosMortos);
  }

  function obterCoordenadaSemInimigo2() {
    var inimigosVivos = [];

    barcoInimigo2.forEachAlive(function (barcoinimigo) {
      inimigosVivos.push(barcoinimigo);
    });

    for (; ;) {
      var x = Math.random() * (900 - 272) + 272;
      var livre = true;
      var xMin = x - 20;
      var xMax = x + 20;
      for (var i = inimigosVivos.length - 1; i >= 0; i--) {
        var inimigo = inimigosVivos[i];
        if (xMax >= (inimigo.position.x - 36) && (inimigo.position.x + 36) >= xMin) {
          livre = false;
          break;
        }
      }
      if (livre) {
        return x;
      }
    }

  }

  function liberaBarcoInimigo() {

    var barcoinimigo = barcoInimigo.getRandomNotExists();

    var aguaBarcoInimigo = game.make.sprite(0, 0, 'AguaMoveInimiga');
    aguaBarcoInimigo.scale.setTo(0.4);
    aguaBarcoInimigo.anchor.setTo(0.5, 0.67);
    aguaBarcoInimigo.animations.add("movimento2", [4, 3, 2, 1, 0], 12, true);
    aguaBarcoInimigo.animations.play("movimento2");

    var x = obterCoordenadaSemInimigo2();
    if (!barcoinimigo) {
      barcoinimigo = barcoInimigo.create(x, -100, 'barcoinimigo');
      barcoinimigo.outOfBoundsKill = false;
      barcoinimigo.checkWorldBounds = false;
    } else {
      barcoinimigo.outOfBoundsKill = false;
      barcoinimigo.checkWorldBounds = false;
      barcoinimigo.reset(x, -100);
    }
    barcoinimigo.physicsBodyType = Phaser.Physics.ARCADE;
    barcoinimigo.body.enable = true;
    barcoinimigo.body.velocity.y = 180;
    barcoinimigo.anchor.x = 0.5;
    barcoinimigo.anchor.y = 0.5;

    barcoinimigo.removeChildren();
    barcoinimigo.addChild(aguaBarcoInimigo);
    //aguaBarcoInimigo.sendToBack();
    //fundo.sendToBack();
  }

  function liberaBarcoInimigo2() {

    vidasInimigo2 = 3;
    var barcoinimigo = barcoInimigo2.getRandomNotExists();

    var aguaBarcoInimigo = game.make.sprite(0, 0, 'AguaMoveInimiga');
    aguaBarcoInimigo.scale.setTo(0.4);
    aguaBarcoInimigo.anchor.setTo(0.5, 0.67);
    aguaBarcoInimigo.animations.add("movimento2", [4, 3, 2, 1, 0], 12, true);
    aguaBarcoInimigo.animations.play("movimento2");

    if (!barcoinimigo) {
      barcoinimigo = barcoInimigo2.create(Math.random() * (900 - 272) + 272, -100, 'barcoinimigoSprite');
      barcoinimigo.outOfBoundsKill = false;
      barcoinimigo.checkWorldBounds = false;
    } else {
      barcoinimigo.outOfBoundsKill = false;
      barcoinimigo.checkWorldBounds = false;
      barcoinimigo.reset(Math.random() * (900 - 272) + 272, -100);
    }
    barcoinimigo.physicsBodyType = Phaser.Physics.ARCADE;
    barcoinimigo.body.enable = true;
    barcoinimigo.body.velocity.y = 110;
    barcoinimigo.anchor.x = 0.5;
    barcoinimigo.anchor.y = 0.5;
    barcoinimigo.scale.setTo(1.8);

    barcoinimigo.removeChildren();
    barcoinimigo.addChild(aguaBarcoInimigo);
    //aguaBarcoInimigo.sendToBack();
    //fundo.sendToBack();

    balasInimigas.setAll('anchor.x', -1.5);
    balasInimigas.setAll('anchor.y', -3);
  }

  function liberaPedras() {

    var pedra = pedras.getRandomNotExists();
    if (!pedra) {
      pedra = pedras.create(Math.random() * (900 - 272) + 272, -100, 'pedra');
      pedra.outOfBoundsKill = false;
      pedra.checkWorldBounds = false;
    } else {
      pedra.outOfBoundsKill = false;
      pedra.checkWorldBounds = false;
      pedra.reset(Math.random() * (900 - 272) + 272, -100);
    }
    pedra.physicsBodyType = Phaser.Physics.ARCADE;
    pedra.body.enable = true;
    pedra.body.velocity.y = 120;
    pedra.anchor.x = 0.5;
    pedra.anchor.y = 0.5;

    if (pedra.key == 'pedra') {

      pedra.scale.setTo(0.25, 0.25);
      pedra.body.setCircle(140 * 0.25, 250, 250);
    } else if (pedra.key == 'pedra2') {

      pedra.scale.setTo(0.25, 0.25);
      pedra.body.setCircle(140 * 0.25, 250, 250);
    } else if (pedra.key == 'pedra3') {

      pedra.scale.setTo(0.25, 0.25);
      pedra.body.setCircle(80 * 0.25, 250, 250);
    }
  }

  function collisionHandler(barco, objetoColidido) {
    objetoColidido.kill();

    var vida = vidas.getFirstAlive();

    if (vida) {
      if (!barcoInvencivel) {
        vida.kill();
        if (vidas.countLiving() >= 1) {
          barcoInvencivel = true;
          barcoPiscaTime = game.time.now + 100;
          barcoPiscaVez = 0;
          barco.visible = false;
        }
      }
    }

    if (vidas.countLiving() < 1) {

      barco.kill();
      pedras.callAll('kill');
      barcoInimigo.callAll('kill');
      barcoInimigo2.callAll('kill');
      balasInimigas.callAll('kill');
      liberaAtirar = false;
      game.time.events.remove(loopPedras);
      game.time.events.remove(loopBarIni);
      game.time.events.remove(loopBarIni2);
      game.time.events.remove(loopDist);

      textoFim.text = Math.round(distancia * (1 + (contaInimigosMortos / 100)));
      textoFim.visible = true;

      btnMenu.visible = true;
      btnRestart.visible = true;
      menuImage.visible = true;

      //botaoMenu.visible = true;
    }
    var explosao = explosoes.getFirstExists(false);
    explosao.reset(barco.body.x, barco.body.y);
    explosao.animations.add('explode');
    explosao.play('explode', 180, false, true);
  }

  function collisionHandler2(bala, barcoinimigo) {
    bala.kill();
    barcoinimigo.kill();

    var explosao = explosoes.getFirstExists(false);
    explosao.reset(barcoinimigo.body.x, barcoinimigo.body.y);
    explosao.animations.add('explode');
    explosao.play('explode', 180, false, true);

    contaInimigosMortos++;

    contaInimigos();
  }

  function collisionHandler3(bala, pedra) {
    bala.kill();
  }

  function collisionHandler4(barcoInimigo, objetoColidido) {
    barcoInimigo.kill();

    var explosao = explosoes.getFirstExists(false);
    explosao.reset(barcoInimigo.body.x, barcoInimigo.body.y);
    explosao.animations.add('explode');
    explosao.play('explode', 180, false, true);
  }

  function collisionHandler5(bala, balaInimiga) {
    bala.kill();
    balaInimiga.kill();
  }

  function collisionHandler6(bala, barcoInimigo2) {
    //var vidasInimigo2 = 3;
    bala.kill();
    //if (vidasInimigo2) {
    vidasInimigo2--;
    //

    if (vidasInimigo2 < 1) {
      barcoInimigo2.kill();
      contaInimigosMortos++;
    }
    var explosao = explosoes.getFirstExists(false);
    explosao.reset((barcoInimigo2.body.x), (barcoInimigo2.body.y + 49.05));
    explosao.animations.add('explode');
    explosao.play('explode', 180, false, true);
  }

  function fire() {

    if (game.time.now > bulletTime) {

      var bala = balas.getFirstExists(false);

      if (bala) {
        //  And fire it
        //bala.reset(barco.x, barco.y - 57);
        //bala.body.velocity.y = -525;

        var a = Math.PI * barco.angle / 180;
        var c = Math.cos(a);
        var s = Math.sin(a);
        var x = 0,
          y = -86;
        var xd = (c * x) - (s * y);
        var yd = (s * x) + (c * y);
        bala.reset(barco.x + xd, barco.y + yd);
        bala.body.velocity.x = 525 * s;
        bala.body.velocity.y = -525 * c;

        bulletTime = game.time.now + 25;
        bala.scale.setTo(0.4, 0.4);
      }
    }

  }

  function inimigoFires() {
    var balaInimiga = balasInimigas.getFirstExists(false);

    inimigosVivos = [];

    barcoInimigo.forEachAlive(function (barcoinimigo) {
      inimigosVivos.push(barcoinimigo);
    });

    if (balaInimiga && inimigosVivos.length > 0) {
      var random = game.rnd.integerInRange(0, inimigosVivos.length - 1);

      //Seleciona um inimigo aleatório
      var shooter = inimigosVivos[random];

      //E o inimigo atirar
      balaInimiga.reset(shooter.body.x + 16.5, shooter.body.y + 60);

      game.physics.arcade.moveToObject(balaInimiga, barco, 400);
      balaInimiga.scale.setTo(0.4, 0.4);
      firingTimer = game.time.now + 1300;
      explosion.play();
    }
  }

  var angulosTiros = [45 * Math.PI / 180, 90 * Math.PI / 180, 135 * Math.PI / 180, 225 * Math.PI / 180, 270 * Math.PI / 180, 315 * Math.PI / 180];

  function inimigoFires2() {
    var balaInimiga = balasInimigas.getFirstExists(false);

    inimigosVivos = [];

    barcoInimigo2.forEachAlive(function (barcoinimigo) {
      inimigosVivos.push(barcoinimigo);
    });

    if (balaInimiga && inimigosVivos.length > 0) {
      var random = game.rnd.integerInRange(0, inimigosVivos.length - 1);

      //Seleciona um inimigo aleatório
      var shooter = inimigosVivos[random];

      var total = 0;
      do {
        //E o inimigo atirar
        balaInimiga.reset(shooter.body.x + 16.5, shooter.body.y + 60);

        //game.physics.arcade.moveToObject(balaInimiga, barco, 400);

        var a = angulosTiros[total];
        var c = Math.cos(a);
        var s = Math.sin(a);
        balaInimiga.body.velocity.x = 400 * s;
        balaInimiga.body.velocity.y = -400 * c;
        balaInimiga.scale.setTo(0.4, 0.4);

        total++;
        balaInimiga = balasInimigas.getFirstExists(false);
      } while (total < angulosTiros.length && balaInimiga);
      firingTimer = game.time.now + 1300;
      explosion.play();
    }
  }

  function restart() {
    barcoInvencivel = false;
    barcoPiscaTime = 0;
    barcoPiscaVez = 0;
    //resets the life count
    vidas.callAll('revive');
    //  And brings the aliens back from the dead :)
    dist = 0.5;
    liberaAtirar = true;
    //Revive o barco
    barco.revive();
    //esconde o texto
    textoFim.visible = false;
    //botaoMenu.visible = false;
    menuImage.visible = false;
    btnMenu.visible = false;
    btnRestart.visible = false;

    musicaFundo.play();

    distancia = 0;
    InimigosMortos = 0;
    //textoInimigos.text = "Inimigos: " + 0;
    loopPedras = game.time.events.loop(3000, liberaPedras, this);
    loopBarIni = game.time.events.loop(2500, liberaBarcoInimigo, this);
    loopBarIni2 = game.time.events.loop(15000, liberaBarcoInimigo2, this);
    loopDist = game.time.events.loop(100, contaDistancia, this);
    barco.reset(640, 680);
    barco.body.velocity.x = 0;
    barco.body.velocity.y = 0;
    barco.body.acceleration.x = 0;
    barco.body.acceleration.y = 0;
    barco.body.velocidadeAntigaX = 0;
    barco.body.velocidadeAntigaY = 0;
  }

}

function TelaMenu(game) {

  // A função init() não aparecia no sandbox porque eles fazem ela por nós lá! :)
  this.init = function () {

    game.input.maxPointers = 1;

    // Deixar o jogo executando, mesmo se o browser mudar de aba?
    game.stage.disableVisibilityChange = false;

    if (game.device.desktop) {
      // Configurações específicas para desktop

      // Como criamos o CSS acima, não precisamos centralizar via código
      game.scale.pageAlignHorizontally = false;
    } else {
      // Configurações específicas para celulares

      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      // Especifica o tamanho mímino e máximo para a área do jogo (de 400x300 até 800x600)
      game.scale.setMinMax(400, 300, 1280, 720);
      game.scale.forceLandscape = true;
      // Como criamos o CSS acima, não precisamos centralizar via código
      game.scale.pageAlignHorizontally = false;
    }
  }

  this.preload = function () {
    game.load.crossOrigin = "anonymous";

    game.load.image('tela', 'images/fundo.jpg', 1280, 720);
    game.load.spritesheet('btnPlay', 'images/BotaoPlay.png');
    game.load.spritesheet('btnPlayOver', 'images/BotaoPlayHover.png');
    game.load.spritesheet('btnLoja', 'images/BotaoLoja.png');
    game.load.spritesheet('btnLojaOver', 'images/BotaoLojaHover.png');
    game.load.spritesheet('btnVoltar', 'images/BotaoVoltar.png');
    game.load.spritesheet('btnVoltarOver', 'images/BotaoVoltarOver.png');
    game.load.image('tela2', 'images/escritos.png');
    game.load.image('tela3', 'images/texto.png');
    game.load.image('loja1', 'images/loja1.png');
    game.load.image('loja2', 'images/loja2.png');

    game.load.audio('barcoRangendo', 'audios/ShipCreaking.mp3');
    game.load.audio('somBotao', 'audios/somBotao.mp3');
    game.load.audio('SomBarcoMenu', 'audios/SailSound.mp3');

  }

  var btnPlay;
  var btnLoja;
  var btnPlayOver;
  var btnLojaOver;
  var fundo;
  var btnVoltar;
  var btnVoltarOver;

  var somBotao;
  var somBarcoRangendo;
  var SomBarcoVelejando;
  var tela2;
  var tela3;
  var loja1;
  var loja2;

  this.create = function () {

    fundo = game.add.tileSprite(640, 360, 1920, 1080, 'tela');
    fundo.scale.setTo(0.75, 0.75);
    fundo.anchor.setTo(0.5, 0.5);

    game.physics.enable(fundo, Phaser.Physics.ARCADE);

    tela2 = game.add.tileSprite(640, 330, 1920, 1080, 'tela2');
    tela2.scale.setTo(0.75, 0.75);
    tela2.anchor.setTo(0.5, 0.5);

    tela3 = game.add.tileSprite(640, 320, 1920, 1080, 'tela3');
    tela3.scale.setTo(0.75, 0.75);
    tela3.anchor.setTo(0.5, 0.5);

    loja2 = game.add.tileSprite(-70, -800, 1920, 1080, 'loja2');
    loja2.scale.setTo(0.75, 0.75);
    loja1 = game.add.tileSprite(-70, -800, 1920, 1080, 'loja1');
    loja1.scale.setTo(0.75, 0.75);


    btnPlay = game.add.image(450, 550, 'btnPlay');
    btnPlay.scale.setTo(0.666, 0.666);

    btnLoja = game.add.image(675, 550, 'btnLoja');
    btnLoja.scale.setTo(0.666, 0.666);

    btnPlay.inputEnabled = true;
    btnPlay.events.onInputDown.add(clica, this);

    btnLoja.inputEnabled = true;
    btnLoja.events.onInputDown.add(clicaLoja, this);

    btnPlay.events.onInputOver.add(clicaOverPlay, this);
    btnLoja.events.onInputOver.add(clicaOverLoja, this);

    btnPlay.events.onInputOut.add(clicaOutPlay, this);
    btnLoja.events.onInputOut.add(clicaOutLoja, this);

    btnVoltar = game.add.image(0, -800, 'btnVoltar');
    btnVoltar.scale.setTo(0.666, 0.666);
    btnVoltar.inputEnabled = true;
    btnVoltar.events.onInputDown.add(voltarLoja, this);
    btnVoltar.events.onInputOver.add(voltarOver, this);
    btnVoltar.events.onInputOut.add(voltarOut, this);

    somBarcoRangendo = game.add.audio('barcoRangendo', 0.6);
    somBarcoRangendo.play();

    SomBarcoVelejando = game.add.audio('SomBarcoMenu', 0.2);
    SomBarcoVelejando.play();

    somBotao = game.add.audio('somBotao');


  }

  function clica() {
    game.state.start("TelaInicial");
    somBotao.play();
    somBarcoRangendo.stop();
  }

  function clicaLoja() {

    tela2.alpha = 0;
    tela3.alpha = 0;
    btnPlay.kill();
    btnLoja.kill();
    btnVoltar.revive();

    game.add.tween(loja1).to({
      y: -45
    }, 750).start();
    game.add.tween(loja2).to({
      y: -250
    }, 750).start();
    game.add.tween(btnVoltar).to({
      y: 0
    }, 750).start();
  }

  function voltarLoja() {

    tela2.alpha = 1;
    tela3.alpha = 1;
    btnPlay.revive();
    btnLoja.revive();
    btnVoltar.kill();

    loja1.position.y = -800;
    loja2.position.y = -800;
    btnVoltar.position.y = -800;
    loja2.alpha = 0;
  }

  function voltarOver() {
    btnVoltarOver = game.add.image(0, 0, 'btnVoltarOver');
    btnVoltarOver.scale.setTo(0.666, 0.666);

  }

  function voltarOut() {
    btnVoltarOver.scale.setTo(0.666, 0.666);
    btnVoltarOver.kill();
  }

  function clicaOverPlay() {
    btnPlayOver = game.add.image(450, 550, 'btnPlayOver');
    btnPlayOver.scale.setTo(0.666, 0.666);
  }

  function clicaOutPlay() {
    btnLoja.scale.setTo(0.666, 0.666);
    btnPlayOver.kill();
  }

  function clicaOverLoja() {
    btnLojaOver = game.add.image(675, 550, 'btnLojaOver');
    btnLojaOver.scale.setTo(0.666, 0.666);
  }

  function clicaOutLoja() {
    btnLoja.scale.setTo(0.666, 0.666);
    btnLojaOver.kill();
  }

  var angle = 0.025;

  this.update = function () {

    fundo.angle = 4 * Math.sin(game.time.now * 0.0005);

    if (loja1.position.y == -45) {

      game.add.tween(loja2).to({
        y: -45
      }, 400).start();
      loja2.alpha = 1;

    }
    if (loja1.position.y == -800) {

      loja2.position.y = -800;
    }
  }


  this.render = function () {
    //game.debug.spriteBounds(barco);
  }
}
// Os estados do jogo podem ser entendidos como "telas" ou "cenários"
// Se nosso jogo tivesse mais de uma "tela", bastaria adicionar as telas aqui,
// dando nomes para cada uma (para alternar entre uma tela e outra, bastaria
// executar jogo.state.start("Nome da tela") a qualquer momento)
game.state.add("TelaInicial", TelaInicial);
game.state.add("TelaMenu", TelaMenu);
//]]>