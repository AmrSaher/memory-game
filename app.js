const images = [
    "imgs/html.png",
    "imgs/css.png",
    "imgs/js.png",
    "imgs/vue.png",
    "imgs/php.png",
    "imgs/mysql.png",
    "imgs/server.png",
    "imgs/database.png",
    "imgs/git.png",
    "imgs/python.png"
];

function showBlocks() {
    images.forEach(img => {
        document.querySelector(".game-container").innerHTML += `
        <div class="game-block" data-item="${img}">
            <div class="face front"></div>
            <div class="face back">
                <img src="${img}" alt="">
            </div>
        </div>
        `.repeat(2);
    });
}
showBlocks();

function showLeaders() {
    let leaderBoard = document.querySelector("#leader-board table");
    let leaders = JSON.parse(localStorage.getItem("leaders"));
    if (!leaders) {
        localStorage.setItem("leaders", JSON.stringify([]));
        leaders = JSON.parse(localStorage.getItem("leaders"));
    }
    leaders = leaders.sort((a, b) => parseInt(a.time) - parseInt(b.time));

    leaderBoard.innerHTML = `
    <tr>
        <th>#</th>
        <th>Name</th>
        <th>Time</th>
        <th>Wrong Tries</th>
    </tr>
    `;
    leaders.forEach(leader => {
        leaderBoard.innerHTML += `
        <tr>
            <td>${leader.id}</td>
            <td>${leader.name}</td>
            <td>${leader.time}s</td>
            <td>${leader.wrongTries}</td>
        </tr>
        `;
    });
}
showLeaders();

function getName() {
    let name = prompt("What is your name?");

    if (name == null || name == "") {
        name = "Unknown";
    }
    return name;
}

document.querySelector("#start-game").onclick = () => {
    document.querySelector("#name").innerHTML = getName();
    document.querySelector(".splash-screen").remove();
    startTimer();
    bgMusic.play();
    showCards();
};

let duration = 1000;
let time = 90;
let gameContainer = document.querySelector(".game-container");
let blocks = Array.from(gameContainer.children);
let winSound = document.querySelector("#win");
let loseSound = document.querySelector("#lose");
let bgMusic = document.querySelector("#bg-music");
let range = [...Array(blocks.length).keys()];
shuffle(range);

blocks.forEach((block, index) => {
    block.style.order = range[index];
    block.addEventListener("click", () => {
        flipBlock(block);
    });
});

function flipBlock(block) {
    block.classList.add("is-flipped");
    let flippedBlocks = document.querySelectorAll(".is-flipped");
    
    if (flippedBlocks.length == 2) {
        stopClicking();
        matchBlocks(flippedBlocks[0], flippedBlocks[1]);
        checkWin();
    }
}

function startTimer() {
    let timer = document.querySelector("#timer");

    timer.innerHTML = time;
    setInterval(() => {
        let matchedBlocks = document.querySelectorAll('.matched');
        if (matchedBlocks.length == blocks.length) return;
        if (parseInt(timer.innerHTML) == 0) {
            // Lose
            bgMusic.pause();
            bgMusic.currentTime = 0;
            document.querySelector(".lose-screen").style.display = "flex";
            console.log("Lose");
            document.querySelectorAll(".play-again")[1].onclick = () => {
                playAgain();
            };
            return;
        }
        timer.innerHTML = parseInt(timer.innerHTML) - 1;
    }, 1000);
}

function stopClicking() {
    gameContainer.classList.add("stop-click");
    setTimeout(() => {
        gameContainer.classList.remove("stop-click");
    }, duration);
}

function matchBlocks(block1, block2) {
    let tries = document.querySelector("#tries");

    if (block1.dataset.item == block2.dataset.item) {
        block1.classList.remove("is-flipped");
        block2.classList.remove("is-flipped");

        block1.classList.add("matched");
        block2.classList.add("matched");
        winSound.play();
    } else {
        tries.innerHTML = parseInt(tries.innerHTML) + 1;
        setTimeout(() => {
            block1.classList.remove("is-flipped");
            block2.classList.remove("is-flipped");
        }, duration);
        loseSound.play();
    }
}

function checkWin() {
    let matchedBlocks = document.querySelectorAll('.matched');

    if (matchedBlocks.length == blocks.length) {
        // Win
        saveData();
        setTimeout(() => {
            bgMusic.pause();
            bgMusic.currentTime = 0;
            document.querySelector(".win-screen").style.display = "flex";
            document.querySelector(".play-again").onclick = () => {
                playAgain();
            };
        }, duration);
    }
}

function saveData() {
    let leaders = JSON.parse(localStorage.getItem("leaders"));
    let you = leaders.find((leader) => leader.name == document.querySelector("#name").innerHTML);
    if (typeof you == "object") {
        leaders[leaders.indexOf(you)].time = time - parseInt(document.querySelector("#timer").innerHTML);
        leaders[leaders.indexOf(you)].wrongTries = document.querySelector("#tries").innerHTML;
    } else {
        leaders.push({
            id: leaders.length + 1,
            name: document.querySelector("#name").innerHTML,
            time: time - parseInt(document.querySelector("#timer").innerHTML),
            wrongTries: document.querySelector("#tries").innerHTML
        });
    }
    localStorage.setItem("leaders", JSON.stringify(leaders));
}

function showCards() {
    blocks.forEach(block => {
        block.classList.add("is-flipped");
        setTimeout(() => {
            block.classList.remove("is-flipped");
        }, duration);
    });
}

function playAgain() {
    shuffle(range);
    showLeaders();
    startTimer();
    document.querySelector(".win-screen").style.display = "none";
    document.querySelector(".lose-screen").style.display = "none";
    document.querySelector("#tries").innerHTML = 0;
    bgMusic.play();
    blocks.forEach(block => {
        block.classList.remove("is-flipped");
        block.classList.remove("matched");
    });
    showCards();
}

function shuffle(array) {
    let current = array.length,
        temp,
        random;

    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }

    return array;
}

/*
[1] Add win screen                                                 [x]
[2] Add background music                                           [x]
[3] Add timer and if end lose                                      [x]
[4] Add leader board and save names and scores in localstorage     [x]
[5] Filter leaders                                                 [x]
[6] Show cards in the first                                        [x]
[7] Generate any blocks number                                     [x]
*/