let snake = new Snake(125, 20, 20);

document.getElementById("newGameBtn").addEventListener("click", () => {
    snake.restartGame();
});

document.getElementById("newGameBtn").addEventListener("mousedown", (e) => {
    e.preventDefault();
});
