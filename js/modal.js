import { getPokemon, formatNumero } from "./api/pokeApi.js";
import { afficherTypes } from "./filter.js";

/* Stats max pokemon = 255 mais au dessus de 180 rare */
const STAT_MAX = 180;

const afficherStat = (nom, valeur, max) => `
    <li class="stat">
        <span class="stat-nom">${nom}</span>
        <span class="stat-valeur">${valeur}</span>
        <span class="stat-barre">
            <span class="stat-remplissage" style="width: ${Math.min(valeur / max * 100, 100)}%"></span>
        </span>
    </li>
`;

const afficherStats = (stats) => {
    let total = 0;
    let contenu = '';

    for (let i = 0; i < stats.length; i++) {
        total += stats[i].valeur;
        contenu += afficherStat(stats[i].nom, stats[i].valeur, STAT_MAX);
    }

    /* Le total est comparé à 600, valeur typique d'un Pokémon légendaire */
    return contenu + afficherStat('Total', total, 600).replace('class="stat"', 'class="stat stat-total"');
}

const formatNombre = (nombre) => nombre.toLocaleString('fr-FR');

const fermerPopup = () => {
    const popup = document.querySelector('.modal');
    if (!popup) {
        return;
    }

    popup.remove();
    document.body.classList.remove('modal-ouverte');

    /* Redonne le focus à la carte d'origine (navigation au clavier) */
    const carte = document.querySelector(`.carte[data-id="${popup.dataset.id}"]`);
    if (carte) {
        carte.focus();
    }
}

const ouvrirPopup = (id) => {
    const pokemon = getPokemon(id);

    if (!pokemon) {
        return;
    }

    const typePrincipal = pokemon.types.split(' ')[0];

    const popup = document.createElement('div');
    popup.className = 'modal';
    popup.dataset.id = pokemon.id;
    popup.innerHTML = `
        <div class="modal-contenu type-${typePrincipal}" role="dialog" aria-modal="true" aria-labelledby="modal-titre">
            <button class="modal-fermer" type="button" aria-label="Fermer">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>

            <div class="modal-entete">
                <span class="modal-numero">${formatNumero(pokemon.id)}</span>
                <h2 id="modal-titre">${pokemon.name}</h2>
                <div class="types">${afficherTypes(pokemon.types)}</div>
                <img src="${pokemon.sprite}" alt="${pokemon.name}">
            </div>

            <div class="modal-corps">
                <div class="mesures">
                    <div class="mesure"><span>Taille</span><strong>${formatNombre(pokemon.height)} m</strong></div>
                    <div class="mesure"><span>Poids</span><strong>${formatNombre(pokemon.weight)} kg</strong></div>
                </div>

                <h3>Statistiques de base</h3>
                <ul class="stats">
                    ${afficherStats(pokemon.stats)}
                </ul>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
    document.body.classList.add('modal-ouverte');
    popup.querySelector('.modal-fermer').focus();

    popup.addEventListener('click', function (e) {
        if (e.target === popup || e.target.closest('.modal-fermer')) {
            fermerPopup();
        }
    });
}

export const initPopup = () => {
    document.body.addEventListener('click', function (event) {
        const carte = event.target.closest('.carte');

        if (!carte || event.target.closest('.fav')) {
            return;
        }

        ouvrirPopup(carte.dataset.id);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            fermerPopup();
            return;
        }

        /* Ouvre la fiche avec Entrée quand une carte a le focus */
        const carte = event.target.closest && event.target.closest('.carte');
        if (event.key === 'Enter' && carte && event.target === carte) {
            ouvrirPopup(carte.dataset.id);
        }
    });
}
