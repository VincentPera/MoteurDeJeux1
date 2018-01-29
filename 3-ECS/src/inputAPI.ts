// # Fonctions d'entr�e
// M�thodes n�cessaires pour saisir les entr�es de l'utilisateur.

// ## Interface *IKeyPressed*
// Cette interface permet de d�finir un type associant une cl�
// � un type bool�en.
interface IKeyPressed {
    [key: string]: boolean;
}

// ## Variable *keyPressed*
// Tableau associatif vide qui contiendra l'�tat courant
// des touches du clavier.
const keyPressed: IKeyPressed = {};

// ## M�thode *setupKeyboardHandler*
// Cette m�thode enregistre des fonctions qui seront
// appel�es par le navigateur lorsque l'utilisateur appuie
// sur des touches du clavier. On enregistre alors si la touche
// est appuy�e ou rel�ch�e dans le tableau `keyPressed`.
//
// On utilise la propri�t� `code` de l'�v�nement, qui est
// ind�pendant de la langue du clavier (ie.: WASD vs ZQSD)
//
// Cette m�thode est appel�e lors du chargement de ce module.
function setupKeyboardHandler() {
    document.addEventListener('keydown', (evt) => {
        keyPressed[evt.code] = true;
    }, false);

    document.addEventListener('keyup', (evt) => {
        keyPressed[evt.code] = false;
    }, false);
}

// ## M�thode *getAxisY*
// Cette m�thode prend en param�tre l'identifiant du joueur (0 ou 1)
// et retourne une valeur correspondant � l'axe vertical d'un faux
// joystick. Ici, on consid�re les paires W/S et les fl�ches haut et
// bas comme les extr�mums de ces axes.
//
// Si on le voulait, on pourrait substituer cette impl�mentation
// par clavier par une impl�mentation de l'[API Gamepad.](https://developer.mozilla.org/fr/docs/Web/Guide/API/Gamepad)
export function getAxisY(player: 0 | 1) {
    if (player === 0) {
        if (keyPressed['KeyW'] === true) {
            return -1;
        }
        if (keyPressed['KeyS'] === true) {
            return 1;
        }
    }
    if (player === 1) {
        if (keyPressed['ArrowUp'] === true) {
            return -1;
        }
        if (keyPressed['ArrowDown'] === true) {
            return 1;
        }
    }
    return 0;
}

// Configuration de la capture du clavier au chargement du module.
// On met dans un bloc `try/catch` afin de pouvoir ex�cuter les
// tests unitaires en dehors du navigateur.
try {
    setupKeyboardHandler();
} catch (e) { }
