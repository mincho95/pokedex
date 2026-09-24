import { getPokemon } from "./api/pokeApi.js";

/* Stats max pokemon = 255 mais au dessus de 180 rare */
const STAT_MAX = 180;

const afficherStats = (stats) => stats.map(stat => `
    <li class="stat">
        <span class="stat-nom">${stat.nom}</span>
        <span class="stat-barre">
            <span class="stat-remplissage" style="width: ${Math.min(stat.valeur / STAT_MAX * 100, 100)}%"></span>
        </span>
        <span class="stat-valeur">${stat.valeur}</span>
    </li>
`).join("");

export const initPopup = () => {
    document.body.addEventListener('click', function (event) {
        const carte = event.target.closest('.carte');

        if (!carte || event.target.classList.contains('fav')) {
            return;
        }

        const pokemon = getPokemon(carte.dataset.id);

        if (!pokemon) {
            return;
        }

        const popup = document.createElement('div');
        popup.className = 'modal';
        popup.innerHTML = `
            <div class="modal-contenu">
                <button class="modal-fermer">✖</button>
                <h2>${pokemon.name}</h2>
                <img src="${pokemon.sprite}" alt="${pokemon.name}">
                <p>N° ${pokemon.id}</p>
                <p>Types : ${pokemon.types}</p>
                <p>Taille : ${pokemon.height} m — Poids : ${pokemon.weight} kg</p>
                <ul class="stats">
                    ${afficherStats(pokemon.stats)}
                </ul>
            </div>
        `;

        document.body.appendChild(popup);

        popup.addEventListener('click', function (e) {
            if (e.target === popup || e.target.classList.contains('modal-fermer')) {
                popup.remove();
            }
        });
    });
}
