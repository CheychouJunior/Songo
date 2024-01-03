document.addEventListener('DOMContentLoaded', function() {
    const socket = io()
    var coteJoueur1 = [5, 5, 5, 5, 5, 5, 5];
    var coteJoueur2 = [5, 5, 5, 5, 5, 5, 5];
    var pointJoueur1 = 0;
    var pointJoueur2 = 0;

    var startBtn = document.getElementById('startBtn');
    var a1 = document.getElementById("a1");
    var a2 = document.getElementById("a2");
    var a3 = document.getElementById("a3");
    var a4 = document.getElementById("a4");
    var a5 = document.getElementById("a5");
    var a6 = document.getElementById("a6");
    var a7 = document.getElementById("a7");

    var b1 = document.getElementById("b1");
    var b2 = document.getElementById("b2");
    var b3 = document.getElementById("b3");
    var b4 = document.getElementById("b4");
    var b5 = document.getElementById("b5");
    var b6 = document.getElementById("b6");
    var b7 = document.getElementById("b7");

    var player;
    // Send Ajax request to add player
    function addPlayer() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/addPlayer', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    player = response.player;
                }
            }
        };
        xhr.send();

    }


    // Send Ajax request to start the game
    function startGame() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/startGame', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    currentPlayer = response.currentPlayer;
                    coteJoueur1 = response.coteJoueur1;
                    coteJoueur2 = response.coteJoueur2;
                    pointJoueur1 = response.pointJoueur1;
                    pointJoueur2 = response.pointJoueur2;
                    print_game(coteJoueur1, coteJoueur2, pointJoueur1, pointJoueur2);;
                }
            }
        };
        xhr.send();
    }

    // Send Ajax request to make a move
    function play(index, user) {
        message = {
            'index': index,
            'player': user
        }
        socket.emit('play', message)
    }

    socket.on('updateBoard', (data) => {
        coteJoueur1 = data.coteJoueur1;
        coteJoueur2 = data.coteJoueur2;
        pointJoueur1 = data.pointJoueur1;
        pointJoueur2 = data.pointJoueur2;
        print_game(coteJoueur1, coteJoueur2, pointJoueur1, pointJoueur2);
    })

    socket.on('gameOver', (data) => {
        if (data.winner == player)
            alert("Vous avez gagné!!!")
        else
            alert("Vous avez perdu!!!")
    })

    socket.on('tour', (data) => {
        console.log(data.tour)
        if (player == data.tour)
            alert("Ce n'est pas votre tour")
    })

    // fonction pour afficher les pions et points de chaque joueur dans le tableau
    function print_game(coteJoueur1, coteJoueur2, pointJoueur1, pointJoueur2) {
        document.getElementById("a1").innerHTML = coteJoueur2[0];
        document.getElementById("a2").innerHTML = coteJoueur2[1];
        document.getElementById("a3").innerHTML = coteJoueur2[2];
        document.getElementById("a4").innerHTML = coteJoueur2[3];
        document.getElementById("a5").innerHTML = coteJoueur2[4];
        document.getElementById("a6").innerHTML = coteJoueur2[5];
        document.getElementById("a7").innerHTML = coteJoueur2[6];

        document.getElementById("p1").innerHTML = pointJoueur1;
        document.getElementById("p2").innerHTML = pointJoueur2;

        document.getElementById("b1").innerHTML = coteJoueur1[0];
        document.getElementById("b2").innerHTML = coteJoueur1[1];
        document.getElementById("b3").innerHTML = coteJoueur1[2];
        document.getElementById("b4").innerHTML = coteJoueur1[3];
        document.getElementById("b5").innerHTML = coteJoueur1[4];
        document.getElementById("b6").innerHTML = coteJoueur1[5];
        document.getElementById("b7").innerHTML = coteJoueur1[6];
    }

    b1.onclick = function() {
        play(1, player);
    }
    b2.onclick = function() {
        play(2, player);
    }
    b3.onclick = function() {
        play(3, player);
    }
    b4.onclick = function() {
        play(4, player);
    }
    b5.onclick = function() {
        play(5, player);
    }
    b6.onclick = function() {
        play(6, player);
    }
    b7.onclick = function() {
        play(7, player);
    }

    a1.onclick = function() {
        play(1, player);
    }
    a2.onclick = function() {
        play(2, player);
    }
    a3.onclick = function() {
        play(3, player);
    }
    a4.onclick = function() {
        play(4, player);
    }
    a5.onclick = function() {
        play(5, player);
    }
    a6.onclick = function() {
        play(6, player);
    }
    a7.onclick = function() {
        play(7, player);
    }

    function setcolor(index, elt) {
        if (player == 1) {
            if (coteJoueur1[index] != 0)
                elt.style.backgroundColor = "#49a53d";
            else
                elt.style.backgroundColor = "#bb3333"; //rouge
        } else if (player == 2) {
            if (coteJoueur2[index] != 0)
                elt.style.backgroundColor = "#49a53d";
            else
                elt.style.backgroundColor = "#bb3333"; //rouge
        }
    }

    function removecolor(elt) {
        elt.style.backgroundColor = "#af883f";
    }

    b1.onmouseenter = function() {
        if (player == 1)
            setcolor(0, this);
    }
    b1.onmouseleave = function() {
        if (player == 1)
            removecolor(this);
    }

    b2.onmouseenter = function() {
        if (player == 1)
            setcolor(1, this);
    }
    b2.onmouseleave = function() {
        if (player == 1)
            removecolor(this);
    }
    b3.onmouseenter = function() {
        if (player == 1)
            setcolor(2, this);
    }
    b3.onmouseleave = function() {
        if (player == 1)
            removecolor(this);
    }
    b4.onmouseenter = function() {
        if (player == 1)
            setcolor(3, this);
    }
    b4.onmouseleave = function() {
        if (player == 1)
            removecolor(this);
    }
    b5.onmouseenter = function() {
        if (player == 1)
            setcolor(4, this);
    }
    b5.onmouseleave = function() {
        if (player == 1)
            removecolor(this);
    }
    b6.onmouseenter = function() {
        if (player == 1)
            setcolor(5, this);
    }
    b6.onmouseleave = function() {
        if (player == 1)
            removecolor(this);
    }
    b7.onmouseenter = function() {
        if (player == 1)
            setcolor(6, this);
    }
    b7.onmouseleave = function() {
        if (player == 1)
            removecolor(this);
    }


    a1.onmouseenter = function() {
        if (player == 2)
            setcolor(0, this);
    }
    a1.onmouseleave = function() {
        if (player == 2)
            removecolor(this);
    }
    a2.onmouseenter = function() {
        if (player == 2)
            setcolor(1, this);
    }
    a2.onmouseleave = function() {
        if (player == 2)
            removecolor(this);
    }
    a3.onmouseenter = function() {
        if (player == 2)
            setcolor(2, this);
    }
    a3.onmouseleave = function() {
        if (player == 2)
            removecolor(this);
    }
    a4.onmouseenter = function() {
        if (player == 2)
            setcolor(3, this);
    }
    a4.onmouseleave = function() {
        if (player == 2)
            removecolor(this);
    }
    a5.onmouseenter = function() {
        if (player == 2)
            setcolor(4, this);
    }
    a5.onmouseleave = function() {
        if (player == 2)
            removecolor(this);
    }
    a6.onmouseenter = function() {
        if (player == 2)
            setcolor(5, this);
    }
    a6.onmouseleave = function() {
        if (player == 2)
            removecolor(this);
    }
    a7.onmouseenter = function() {
        if (player == 2)
            setcolor(6, this);
    }
    a7.onmouseleave = function() {
        if (player == 2)
            removecolor(this);
    }

    // Handle start game button click event
    startBtn.addEventListener('click', function() {
        addPlayer();
        startGame()
        startBtn.style.display = 'none';
    });

});