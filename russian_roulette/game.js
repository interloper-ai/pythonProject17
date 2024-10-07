const playerNameInput = document.getElementById('playerName');
const joinButton = document.getElementById('joinButton');
const lobby = document.getElementById('lobby');
const playerList = document.getElementById('playerList');
const timerDisplay = document.getElementById('timer');
const gameArea = document.getElementById('gameArea');
const gun = document.getElementById('gun');
const winnerDisplay = document.getElementById('winner');

let players = [];

joinButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        addPlayer(playerName);
        playerNameInput.value = ''; // Очистить поле ввода
    }
});

function addPlayer(name) {
    if (!players.includes(name)) {
        players.push(name);
        localStorage.setItem('players', JSON.stringify(players));
        updatePlayerList();
    }
    if (players.length >= 2) {
        startCountdown();
    }
}

function updatePlayerList() {
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        playerList.appendChild(li);
    });

    lobby.style.display = 'block';
    playerList.style.display = 'block';
}

function startCountdown() {
    gameArea.style.display = 'block';
    timerDisplay.style.display = 'block';
    let countdown = 5;

    const countdownInterval = setInterval(() => {
        timerDisplay.textContent = countdown;
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            spinGun();
        }
    }, 1000);
}

function spinGun() {
    gun.style.transition = 'transform 2s';
    gun.style.transform = 'rotate(720deg)';

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * players.length);
        const loser = players[randomIndex];
        players.splice(randomIndex, 1); // Удаляем проигравшего

        if (players.length === 0) {
            winnerDisplay.textContent = "Все проиграли!";
        } else {
            winnerDisplay.textContent = `${loser} проиграл!`;
        }

        winnerDisplay.style.display = 'block';
        localStorage.setItem('players', JSON.stringify(players)); // Сохраняем изменения

        // Перезапуск игры через 3 секунды
        setTimeout(() => {
            resetGame();
        }, 3000);
    }, 2000);
}

function resetGame() {
    winnerDisplay.style.display = 'none';
    playerList.innerHTML = '';
    players = JSON.parse(localStorage.getItem('players')) || []; // Загрузить игроков из localStorage
    updatePlayerList();
    gameArea.style.display = 'none';
    timerDisplay.style.display = 'none';
}

// Загружаем игроков из localStorage при загрузке страницы
window.onload = () => {
    players = JSON.parse(localStorage.getItem('players')) || [];
    updatePlayerList();
};
