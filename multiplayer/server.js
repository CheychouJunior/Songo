const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

//app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json()); // Parse JSON request bodies

let players = [];
let currentPlayer = null;

class Songo {
    // Definition du constructeur de la class Songo
    constructor() {
        this.coteJoueur1 = [5, 5, 5, 5, 5, 5, 5];
        this.coteJoueur2 = [5, 5, 5, 5, 5, 5, 5];
        this.pointJoueur1 = 0;
        this.pointJoueur2 = 0;
    }

    nbPoints(idJ) {
        // si idJ est 1, donc le joueur1
        if (idJ == 1)
            return this.pointJoueur1;
        // si idJ est 2, donc le joueur2
        else if (idJ == 2)
            return this.pointJoueur2;
        // retourner -1 en cas d'erreur( il y a que 2 joueur dans la partie)
        else
            return -1;
    }

    distribution(idJ, numCase) { // numCase represente le numero de la case ou les pions seront pris pour la distribution, compté de maniere naturelle
        var i, val, indice, joueurfin;

        if (idJ == 1) {
            val = this.coteJoueur1[numCase - 1]; // Les pions sont recuperer dans la variable val
            this.coteJoueur1[numCase - 1] = 0; // Quand on recupere les pions il ne reste plus rien

            for (i = numCase - 2; i >= 0; i--) {
                if (val > 0) {
                    this.coteJoueur1[i]++;
                    val--;
                    indice = i;
                }
            }
            joueurfin = 1;
            while (val > 0) {
                for (i = 0; i < 7; i++) {
                    if (val > 0) {
                        this.coteJoueur2[i]++;
                        val--;
                        indice = i;
                    }
                }
                joueurfin = 2;
                if (val == 0)
                    break;
                for (i = 6; i >= 0; i--) {
                    if (val > 0) {
                        this.coteJoueur1[i]++;
                        val--;
                        indice = i;
                    }
                }
                joueurfin = 1;
            }
        } else if (idJ == 2) {

            val = this.coteJoueur2[numCase - 1]; // Les pions sont recuperer dans la variable val
            this.coteJoueur2[numCase - 1] = 0; // Quand on recupere les pions il ne reste plus rien

            for (i = numCase; i < 7; i++) {
                if (val > 0) {
                    this.coteJoueur2[i]++;
                    val--;
                    indice = i;
                }
            }
            joueurfin = 2;
            while (val > 0) {
                for (i = 6; i >= 0; i--) {
                    if (val > 0) {
                        this.coteJoueur1[i]++;
                        val--;
                        indice = i;
                    }
                }
                joueurfin = 1;
                if (val == 0)
                    break;
                for (i = 0; i < 7; i++) {
                    if (val > 0) {
                        this.coteJoueur2[i]++;
                        val--;
                        indice = i;
                    }
                }
                joueurfin = 2;
            }

        } else
            return -1;

        var info = [joueurfin, indice];
        return info;
    }

    prisePossible(num) { // fonction pour verifier si toutes les cases d'un joueur "num" on des pierres comprises entre 2 et 4, retourne 1 si vraie et 0 sinon
        var i, test;

        test = 7;
        if (num == 1) {
            for (i = 0; i < 7; i++) {
                if (this.coteJoueur1[i] >= 2 && this.coteJoueur1[i] <= 4)
                    test--;
            }
        } else if (num == 2) {
            for (i = 0; i < 7; i++) {
                if (this.coteJoueur2[i] >= 2 && this.coteJoueur2[i] <= 4)
                    test--;
            }
        }

        if (test == 0)
            return 1;
        return 0;
    }

    prise(idJ, info) {
        var i;

        if (idJ != info[0]) {
            if (idJ == 1) {
                if (this.prisePossible(2) == 0) {
                    for (i = info[1]; i >= 0; i--) {
                        if (this.coteJoueur2[i] >= 2 && this.coteJoueur2[i] <= 4) {
                            this.pointJoueur1 += this.coteJoueur2[i];
                            this.coteJoueur2[i] = 0;
                        }
                    }
                }
            } else if (idJ == 2) {
                if (this.prisePossible(1) == 0) {
                    for (i = info[1]; i < 7; i++) {
                        if (this.coteJoueur1[i] >= 2 && this.coteJoueur1[i] <= 4) {
                            this.pointJoueur2 += this.coteJoueur1[i];
                            this.coteJoueur1[i] = 0;
                        }
                    }
                }
            }
        }
    }

    nombrePierre1() {
        var somme, i;

        somme = 0;
        for (i = 0; i < 7; i++) {
            somme += this.coteJoueur1[i];
        }
        return somme;
    }

    nombrePierre2() {
        var somme, i;

        somme = 0;
        for (i = 0; i < 7; i++) {
            somme += this.coteJoueur2[i];
        }
        return somme;
    }

    poursuiteJeu() {
        if (this.nombrePierre1() + this.nombrePierre2() < 10) {
            if (this.pointJoueur1 + this.nombrePierre1() < this.pointJoueur2 + this.nombrePierre2())
                return 2;
            else
                return 1;
        } else if (this.pointJoueur1 > 35)
            return 1;
        else if (this.pointJoueur2 > 35)
            return 2;
        else
            return 0;
    }
}

app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

app.post('/addPlayer', (req, res) => {
    var player;
    if (players.length == 0) {
        player = 1;
        console.log("je suis la avec " + player);
        players.push(player);
    } else if (players.length == 1) {
        player = 2;
        console.log("je suis la avec " + player);
        players.push(player);
    }

    res.status(200).json({
        player: player
    });
});

// Send Ajax request to start the game
app.post('/startGame', (req, res) => {
    currentPlayer = players[0];
    s = new Songo();
    res.status(200).json({
        currentPlayer: currentPlayer,
        coteJoueur1: s.coteJoueur1,
        coteJoueur2: s.coteJoueur2,
        pointJoueur1: s.pointJoueur1,
        pointJoueur2: s.pointJoueur2
    });
});

// Handle socket.io connection
io.on('connection', socket => {
    // Handle play
    socket.on('play', data => {
        const {
            index,
            player
        } = data;
        if (player !== currentPlayer) {
            console.log("Donc chui meme arrivee la")
            io.emit('turn', {
                tour: currentPlayer
            });
        }
        if (player == 1) {
            if (s.coteJoueur1[index] != 0) {
                var tab = s.distribution(1, index);
                s.prise(1, tab);
                if (s.poursuiteJeu() == 1) {
                    io.emit('updateBoard', {
                        currentPlayer: currentPlayer,
                        coteJoueur1: s.coteJoueur1,
                        coteJoueur2: s.coteJoueur2,
                        pointJoueur1: s.pointJoueur1,
                        pointJoueur2: s.pointJoueur2
                    });
                    io.emit('gameOver', {
                        winner: player
                    });
                } else {
                    currentPlayer = 2;
                    io.emit('updateBoard', {
                        currentPlayer: currentPlayer,
                        coteJoueur1: s.coteJoueur1,
                        coteJoueur2: s.coteJoueur2,
                        pointJoueur1: s.pointJoueur1,
                        pointJoueur2: s.pointJoueur2
                    });
                }
            }
        } else if (player == 2) {
            if (s.coteJoueur2[index] != 0) {
                var tab = s.distribution(2, index);
                s.prise(2, tab);
                if (s.poursuiteJeu() == 2) {
                    io.emit('updateBoard', {
                        currentPlayer: currentPlayer,
                        coteJoueur1: s.coteJoueur1,
                        coteJoueur2: s.coteJoueur2,
                        pointJoueur1: s.pointJoueur1,
                        pointJoueur2: s.pointJoueur2
                    });
                    io.emit('gameOver', {
                        winner: player
                    });
                } else {
                    currentPlayer = 1;
                    io.emit('updateBoard', {
                        currentPlayer: currentPlayer,
                        coteJoueur1: s.coteJoueur1,
                        coteJoueur2: s.coteJoueur2,
                        pointJoueur1: s.pointJoueur1,
                        pointJoueur2: s.pointJoueur2
                    });
                }
            }
        }
    });

});

// Start the server
const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});