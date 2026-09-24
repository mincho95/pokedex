const types = [
    { api: 'normal', nom: 'Normal' },
    { api: 'fire', nom: 'Feu' },
    { api: 'water', nom: 'Eau' },
    { api: 'grass', nom: 'Plante' },
    { api: 'electric', nom: 'Électrik' },
    { api: 'ice', nom: 'Glace' },
    { api: 'fighting', nom: 'Combat' },
    { api: 'poison', nom: 'Poison' },
    { api: 'ground', nom: 'Sol' },
    { api: 'flying', nom: 'Vol' },
    { api: 'psychic', nom: 'Psy' },
    { api: 'bug', nom: 'Insecte' },
    { api: 'rock', nom: 'Roche' },
    { api: 'ghost', nom: 'Spectre' },
    { api: 'dragon', nom: 'Dragon' },
    { api: 'dark', nom: 'Ténèbres' },
    { api: 'steel', nom: 'Acier' },
    { api: 'fairy', nom: 'Fée' }
];

let typeChoisi = '';

export const appliquerFiltres = () => {
    const recherche = document.getElementById('recherche');
    const texte = recherche ? recherche.value.toLowerCase() : '';

    document.querySelectorAll('.carte').forEach(carte => {
        const nom = carte.querySelector('h2').textContent.toLowerCase();
        const typesDeLaCarte = carte.dataset.types.split(' ');

        const bonNom = nom.includes(texte);
        const bonType = typeChoisi === '' || typesDeLaCarte.includes(typeChoisi);

        if (bonNom && bonType) {
            carte.style.display = '';
        } else {
            carte.style.display = 'none';
        }
    });
}

export const setupFiltreType = () => {
    const bouton = document.getElementById('bouton-type');
    const liste = document.getElementById('liste-types');

    if (!bouton || !liste) {
        return;
    }

    let contenu = '<button data-type="">Tous</button>';
    for (let i = 0; i < types.length; i++) {
        contenu += `<button data-type="${types[i].api}">${types[i].nom}</button>`;
    }
    liste.innerHTML = contenu;

    bouton.addEventListener('click', () => {
        if (liste.style.display === 'none') {
            liste.style.display = '';
        } else {
            liste.style.display = 'none';
        }
    });

    liste.querySelectorAll('button').forEach(boutonType => {
        boutonType.addEventListener('click', () => {
            typeChoisi = boutonType.dataset.type;
            bouton.textContent = `Type : ${boutonType.textContent}`;
            liste.style.display = 'none';
            appliquerFiltres();
        });
    });
}
