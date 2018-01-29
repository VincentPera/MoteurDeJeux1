// # Fonctions utilitaires
// Fonctions utilitaires pour des m�thodes g�n�riques qui n'ont
// pas de lien direct avec le jeu.

// ## Fonction *requestAnimationFrame*
// Encapsuler dans une promesse la m�thode qui attend la mise
// � jour de l'affichage.
function requestAnimationFrame() {
    return new Promise<number>((resolve) => {
        window.requestAnimationFrame(resolve);
    });
}

// ## Fonction *iterate*
// Ex�cute une it�ration de la boucle de jeu, en attendant
// apr�s chaque �tape du tableau `actions`.
function iterate(actions: ((delta: number) => void)[], delta: number) {
    let p = Promise.resolve();
    actions.forEach((a) => {
        p = p.then(() => {
            return a(delta);
        });
    });
    return p;
}

// ## Fonction *loop*
// Boucle de jeu simple, on lui passe un tableau de fonctions
// � ex�cuter � chaque it�ration. La boucle se rappelle elle-m�me
// apr�s avoir attendu le prochain rafra�chissement de l'affichage.
let lastTime = 0;

export function loop(actions: ((delta: number) => void)[], time = 0): Promise<{}> {
    // Le temps est compt� en millisecondes, on d�sire
    // l'avoir en secondes, sans avoir de valeurs trop �norme.
    const delta = clamp((time - lastTime) / 1000, 0, 0.1);
    lastTime = time;
    const nextLoop = (t: number) => loop(actions, t);
    return iterate(actions, delta)
        .then(requestAnimationFrame)
        .then(nextLoop);
}

// ## Fonction *inRange*
// M�thode utilitaire retournant le bool�en *vrai* si une
// valeur se situe dans un interval.
export function inRange(x: number, min: number, max: number) {
    return (min <= x) && (x <= max);
}

// ## Fonction *clamp*
// M�thode retournant la valeur pass�e en param�tre si elle
// se situe dans l'interval sp�cifi�, ou l'extr�mum correspondant
// si elle est hors de l'interval.
export function clamp(x: number, min: number, max: number) {
    return Math.min(Math.max(x, min), max);
}

// ## Fonction *loadAsync*
// Fonction qui charge un fichier de fa�on asynchrone,
// via une [promesse](http://bluebirdjs.com/docs/why-promises.html)
export function loadAsync(url: string) {
    return new Promise<XMLHttpRequest>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', reject);
        xhr.addEventListener('load', () => {
            resolve(xhr);
        });
        xhr.open('GET', url);
        xhr.send(null);
    });
}

// ## Fonction *loadJSON*
// Fonction qui charge un fichier JSON de fa�on asynchrone,
// via une [promesse](http://bluebirdjs.com/docs/why-promises.html)
export function loadJSON(url: string) {
    return loadAsync(url)
        .then((xhr) => {
            return JSON.parse(xhr.responseText);
        });
}
