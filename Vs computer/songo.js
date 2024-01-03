var bloque = 0;

class Songo {
    // Definition du constructeur de la class Songo
    constructor() {
        this.coteJoueur1 = [5, 5, 5, 5, 5, 5, 5];
        this.coteJoueur2 = [5, 5, 5, 5, 5, 5, 5];
        this.pointJoueur1 = 0;
        this.pointJoueur2 = 0;
        this.tour = 1;
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

    estBloque(idJ) {
        if (idJ == this.tour)
            return 0;
        else
            return 1;
    }

    distribution(idJ, numCase) { // numCase represente le numero de la case ou les pions seront pris pour la distribution, compté de maniere naturlle
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

// fonction pour afficher les pions et points de chaque joueur dans le tableau
function print_game(jeu) {
    document.getElementById("a1").innerHTML = jeu.coteJoueur2[0];
    document.getElementById("a2").innerHTML = jeu.coteJoueur2[1];
    document.getElementById("a3").innerHTML = jeu.coteJoueur2[2];
    document.getElementById("a4").innerHTML = jeu.coteJoueur2[3];
    document.getElementById("a5").innerHTML = jeu.coteJoueur2[4];
    document.getElementById("a6").innerHTML = jeu.coteJoueur2[5];
    document.getElementById("a7").innerHTML = jeu.coteJoueur2[6];

    document.getElementById("p1").innerHTML = jeu.pointJoueur1;
    document.getElementById("p2").innerHTML = jeu.pointJoueur2;

    document.getElementById("b1").innerHTML = jeu.coteJoueur1[0];
    document.getElementById("b2").innerHTML = jeu.coteJoueur1[1];
    document.getElementById("b3").innerHTML = jeu.coteJoueur1[2];
    document.getElementById("b4").innerHTML = jeu.coteJoueur1[3];
    document.getElementById("b5").innerHTML = jeu.coteJoueur1[4];
    document.getElementById("b6").innerHTML = jeu.coteJoueur1[5];
    document.getElementById("b7").innerHTML = jeu.coteJoueur1[6];
}

function sleep(seconds) {
    var waitUntil = new Date().getTime() + seconds * 1000;
    while (new Date().getTime() < waitUntil) true;
}

function getJoueur2Case(num) {
    if (num == 1)
        return document.getElementById("a1");
    else if (num == 2)
        return document.getElementById("a2");
    else if (num == 3)
        return document.getElementById("a3");
    else if (num == 4)
        return document.getElementById("a4");
    else if (num == 5)
        return document.getElementById("a5");
    else if (num == 6)
        return document.getElementById("a6");
    else if (num == 7)
        return document.getElementById("a7");
}

function resetCouleurJoueur2() {
    document.getElementById("a1").style.backgroundColor = "#af883f";
    document.getElementById("a2").style.backgroundColor = "#af883f";
    document.getElementById("a3").style.backgroundColor = "#af883f";
    document.getElementById("a4").style.backgroundColor = "#af883f";
    document.getElementById("a5").style.backgroundColor = "#af883f";
    document.getElementById("a6").style.backgroundColor = "#af883f";
    document.getElementById("a7").style.backgroundColor = "#af883f";
}

function ordi_play() {
    var tab = [];
    var i_ordi;

    i_ordi = Math.floor(Math.random() * 7) + 1;
    while (s.coteJoueur2[i_ordi - 1] == 0)
        i_ordi = Math.floor(Math.random() * 7) + 1;

    getJoueur2Case(i_ordi).style.backgroundColor = "#61be8b";
    tab = s.distribution(2, i_ordi);
    print_game(s);
    s.prise(2, tab);
    print_game(s);
    if (s.poursuiteJeu() == 1)
        alert("Vous avez gagné");
    else if (s.poursuiteJeu() == 2)
        alert("Vous avez perdu");

    s.tour = 1;
}

//------------------------------------ Main -----------------------------------------------
s = new Songo;
print_game(s)

var b1 = document.getElementById("b1");
var b2 = document.getElementById("b2");
var b3 = document.getElementById("b3");
var b4 = document.getElementById("b4");
var b5 = document.getElementById("b5");
var b6 = document.getElementById("b6");
var b7 = document.getElementById("b7");

var tab = [];
var i_ordi;
b1.onclick = function() {
    if (s.estBloque(1) == 0) {
        if (s.coteJoueur1[0] != 0) {
            resetCouleurJoueur2();
            tab = s.distribution(1, 1);
            print_game(s);
            s.prise(1, tab);
            print_game(s);
            s.tour = 2;
            if (s.poursuiteJeu() == 1)
                alert("Vous avez gagné");
            else if (s.poursuiteJeu() == 2)
                alert("Vous avez perdu");
            setTimeout(ordi_play, 3000);
        }
    } else
        alert("Ce n'est pas votre tour, veuillez patienter");
}

b1.onmouseenter = function() {
    if (s.coteJoueur1[0] != 0)
        this.style.backgroundColor = "#49a53d";
    else
        this.style.backgroundColor = "#bb3333"; //rouge
}
b1.onmouseleave = function() {
    this.style.backgroundColor = "#af883f"
}


b2.onclick = function() {
    if (s.estBloque(1) == 0) {
        if (s.coteJoueur1[1] != 0) {
            resetCouleurJoueur2();
            tab = s.distribution(1, 2);
            print_game(s);
            s.prise(1, tab);
            print_game(s);
            if (s.poursuiteJeu() == 1)
                alert("Vous avez gagné");
            else if (s.poursuiteJeu() == 2)
                alert("Vous avez perdu");
            setTimeout(ordi_play, 3000);
        }
    } else
        alert("Ce n'est pas votre tour, veuillez patienter");
}

b2.onmouseenter = function() {
    if (s.coteJoueur1[1] != 0)
        this.style.backgroundColor = "#49a53d";
    else
        this.style.backgroundColor = "#bb3333"; //rouge
}
b2.onmouseleave = function() {
    this.style.backgroundColor = "#af883f"
}


b3.onclick = function() {
    if (s.estBloque(1) == 0) {
        if (s.coteJoueur1[2] != 0) {
            resetCouleurJoueur2();
            tab = s.distribution(1, 3);
            print_game(s);
            s.prise(1, tab);
            print_game(s);
            if (s.poursuiteJeu() == 1)
                alert("Vous avez gagné");
            else if (s.poursuiteJeu() == 2)
                alert("Vous avez perdu");
            setTimeout(ordi_play, 3000);
        }
    } else
        alert("Ce n'est pas votre tour, veuillez patienter");
}

b3.onmouseenter = function() {
    if (s.coteJoueur1[2] != 0)
        this.style.backgroundColor = "#49a53d";
    else
        this.style.backgroundColor = "#bb3333"; //rouge
}
b3.onmouseleave = function() {
    this.style.backgroundColor = "#af883f"
}


b4.onclick = function() {
    if (s.estBloque(1) == 0) {
        if (s.coteJoueur1[3] != 0) {
            resetCouleurJoueur2();
            tab = s.distribution(1, 4);
            print_game(s);
            s.prise(1, tab);
            print_game(s);
            if (s.poursuiteJeu() == 1)
                alert("Vous avez gagné");
            else if (s.poursuiteJeu() == 2)
                alert("Vous avez perdu");
            setTimeout(ordi_play, 3000);
        }
    } else
        alert("Ce n'est pas votre tour, veuillez patienter");
}

b4.onmouseenter = function() {
    if (s.coteJoueur1[3] != 0)
        this.style.backgroundColor = "#49a53d";
    else
        this.style.backgroundColor = "#bb3333"; //rouge
}
b4.onmouseleave = function() {
    this.style.backgroundColor = "#af883f"
}


b5.onclick = function() {
    if (s.estBloque(1) == 0) {
        if (s.coteJoueur1[4] != 0) {
            resetCouleurJoueur2();
            tab = s.distribution(1, 5);
            print_game(s);
            s.prise(1, tab);
            print_game(s);
            if (s.poursuiteJeu() == 1)
                alert("Vous avez gagné");
            else if (s.poursuiteJeu() == 2)
                alert("Vous avez perdu");
            setTimeout(ordi_play, 3000);
        }
    } else
        alert("Ce n'est pas votre tour, veuillez patienter");
}

b5.onmouseenter = function() {
    if (s.coteJoueur1[4] != 0)
        this.style.backgroundColor = "#49a53d";
    else
        this.style.backgroundColor = "#bb3333"; //rouge
}
b5.onmouseleave = function() {
    this.style.backgroundColor = "#af883f"
}


b6.onclick = function() {
    if (s.estBloque(1) == 0) {
        if (s.coteJoueur1[5] != 0) {
            resetCouleurJoueur2();
            tab = s.distribution(1, 6);
            print_game(s);
            s.prise(1, tab);
            print_game(s);
            if (s.poursuiteJeu() == 1)
                alert("Vous avez gagné");
            else if (s.poursuiteJeu() == 2)
                alert("Vous avez perdu");
            setTimeout(ordi_play, 3000);
        }
    } else
        alert("Ce n'est pas votre tour, veuillez patienter");
}

b6.onmouseenter = function() {
    if (s.coteJoueur1[5] != 0)
        this.style.backgroundColor = "#49a53d";
    else
        this.style.backgroundColor = "#bb3333"; //rouge
}
b6.onmouseleave = function() {
    this.style.backgroundColor = "#af883f"
}


b7.onclick = function() {
    if (s.estBloque(1) == 0) {
        if (s.coteJoueur1[6] != 0) {
            resetCouleurJoueur2();
            tab = s.distribution(1, 7);
            print_game(s);
            s.prise(1, tab);
            print_game(s);
            if (s.poursuiteJeu() == 1)
                alert("Vous avez gagné");
            else if (s.poursuiteJeu() == 2)
                alert("Vous avez perdu");
            setTimeout(ordi_play, 3000);
        }
    } else
        alert("Ce n'est pas votre tour, veuillez patienter");
}

b7.onmouseenter = function() {
    if (s.coteJoueur1[6] != 0)
        this.style.backgroundColor = "#49a53d";
    else
        this.style.backgroundColor = "#bb3333"; //rouge
}
b7.onmouseleave = function() {
    this.style.backgroundColor = "#af883f"
}