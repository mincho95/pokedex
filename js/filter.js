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

export const nomDuType = (api) => {
    const type = types.find(type => type.api === api);
    return type ? type.nom : api;
}

/* Génère les badges colorés à partir de "grass poison" */
export const afficherTypes = (typesDuPokemon) => typesDuPokemon
    .split(' ')
    .map(type => `<span class="badge-type type-${type}">${nomDuType(type)}</span>`)
    .join('');

export const appliquerFiltres = () => {
    const recherche = document.getElementById('recherche');
    const texte = recherche ? recherche.value.toLowerCase().trim() : '';
    let visibles = 0;

    document.querySelectorAll('.carte:not(.squelette)').forEach(carte => {
        const nom = carte.querySelector('h2').textContent.toLowerCase();
        const typesDeLaCarte = carte.dataset.types.split(' ');

        const bonNom = nom.includes(texte);
        const bonType = typeChoisi === '' || typesDeLaCarte.includes(typeChoisi);

        if (bonNom && bonType) {
            carte.style.display = '';
            visibles++;
        } else {
            carte.style.display = 'none';
        }
    });

    const resultats = document.getElementById('resultats');
    if (resultats) {
        resultats.textContent = `${visibles} Pokémon`;
    }

    const vide = document.getElementById('vide');
    if (vide) {
        vide.hidden = visibles > 0;
    }
}

export const setupFiltreType = () => {
    const bouton = document.getElementById('bouton-type');
    const liste = document.getElementById('liste-types');

    if (!bouton || !liste) {
        return;
    }

    let contenu = '<button type="button" data-type="" class="actif">Tous les types</button>';
    for (let i = 0; i < types.length; i++) {
        contenu += `<button type="button" data-type="${types[i].api}" class="type-${types[i].api}">${types[i].nom}</button>`;
    }
    liste.innerHTML = contenu;

    const ouvrir = (ouvert) => {
        liste.hidden = !ouvert;
        bouton.setAttribute('aria-expanded', ouvert);
    }

    bouton.addEventListener('click', () => {
        ouvrir(liste.hidden);
    });

    /* Ferme la liste si on clique ailleurs ou qu'on appuie sur Échap */
    document.addEventListener('click', (event) => {
        if (!event.target.closest('#filtre-type')) {
            ouvrir(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            ouvrir(false);
        }
    });

    liste.querySelectorAll('button').forEach(boutonType => {
        boutonType.addEventListener('click', () => {
            typeChoisi = boutonType.dataset.type;

            liste.querySelectorAll('button').forEach(b => b.classList.remove('actif'));
            boutonType.classList.add('actif');

            bouton.textContent = boutonType.textContent;
            bouton.className = typeChoisi ? `type-${typeChoisi}` : '';

            ouvrir(false);
            appliquerFiltres();
        });
    });
}
