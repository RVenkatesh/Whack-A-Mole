import Game from './game.js';

(function() {
    var $startButton = document.querySelector('.game-starter');
    function startGame() {
        var $gameSelector = document.querySelector('.game-selector');
        var pockets = +$gameSelector.options[$gameSelector.selectedIndex].value;

        $startButton.disabled = true;
        Game(pockets, {
            onHitsChange(hits) {
                document.querySelector('.scorer .score').innerHTML = hits * 100;
            },
            onGameEnd() {
                alert("Game over!!");
                $startButton.disabled = false;
            }
        });
    }
    $startButton.onclick = startGame;
})();