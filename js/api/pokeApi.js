import { setupFavoris } from "../fav.js";
import { appliquerFiltres, afficherTypes } from "../filter.js";

const nomsDesStats = {
    'hp': 'PV',
    'attack': 'Attaque',
    'defense': 'Défense',
    'special-attack': 'Attaque Spé.',
    'special-defense': 'Défense Spé.',
    'speed': 'Vitesse'
};

let pokemons = [];

const getFrenchName = (species, fallback) => {
    for (let i = 0; i < species.names.length; i++) {
        if (species.names[i].language.name === "fr") {
            return species.names[i].name;
        }
    }

    return fallback;
}

const getTypes = (fiche) => {
    const types = [];
    for (let i = 0; i < fiche.types.length; i++) {
        types.push(fiche.types[i].type.name);
    }

    return types.join(' ');
}

const getStats = (fiche) => {
    const stats = [];
    for (let i = 0; i < fiche.stats.length; i++) {
        const nomApi = fiche.stats[i].stat.name;

        stats.push({
            nom: nomsDesStats[nomApi] || nomApi,
            valeur: fiche.stats[i].base_stat
        });
    }

    return stats;
}

const getDetails = async (pokemon) => {
    const fiche = await fetch(pokemon.url).then(res => res.json());
    const species = await fetch(fiche.species.url).then(res => res.json());

    return {
        id: fiche.id,
        name: getFrenchName(species, fiche.name),
        sprite: fiche.sprites.other['official-artwork'].front_default || fiche.sprites.front_default,
        types: getTypes(fiche),
        height: fiche.height / 10,
        weight: fiche.weight / 10,
        stats: getStats(fiche)
    };
}

/* 25 -> "N° 025" */
export const formatNumero = (id) => `N° ${String(id).padStart(3, '0')}`;

export const getPokemon = (id) => {
    return pokemons.find(pokemon => pokemon.id === Number(id));
}

const displayError = (message) => {
    const grille = document.getElementById('grille');
    grille.innerHTML = `<p class="erreur">${message}</p>`;

    const resultats = document.getElementById('resultats');
    if (resultats) {
        resultats.textContent = '';
    }
}

/* Cartes grises animées pendant le chargement des données */
const afficherChargement = () => {
    const grille = document.getElementById('grille');
    grille.innerHTML = '<div class="carte squelette" aria-hidden="true"></div>'.repeat(12);

    const resultats = document.getElementById('resultats');
    if (resultats) {
        resultats.textContent = 'Chargement…';
    }
}

export const getPokemonList = async () => {
    afficherChargement();

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
        .catch(error => {
            console.error("Error:", error);
            return null;
        });

    if (!response) {
        displayError("Impossible de charger les Pokémon. Vérifiez votre connexion.");
        return;
    }

    if (response.status < 300) {
        const data = await response.json();

        const requetes = [];
        for (let i = 0; i < data.results.length; i++) {
            requetes.push(getDetails(data.results[i]));
        }

        const details = await Promise.all(requetes).catch(error => {
            console.error("Error:", error);
            return null;
        });

        if (!details) {
            displayError("Impossible de charger les Pokémon. Vérifiez votre connexion.");
            return;
        }

        pokemons = details;

        let content = "";
        for (let i = 0; i < details.length; i++) {
            const pokemon = details[i];
            const typePrincipal = pokemon.types.split(' ')[0];

            content += `
                <article class="carte type-${typePrincipal}" data-id="${pokemon.id}" data-types="${pokemon.types}" tabindex="0">
                    <span class="carte-numero">${formatNumero(pokemon.id)}</span>
                    <button class="fav" type="button" aria-label="Ajouter aux favoris">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </button>
                    <img src="${pokemon.sprite}" alt="${pokemon.name}" loading="lazy" width="140" height="140">
                    <h2>${pokemon.name}</h2>
                    <div class="types">${afficherTypes(pokemon.types)}</div>
                </article>
            `;
        }

        document.getElementById('grille').innerHTML = content;

        setupFavoris();
        appliquerFiltres();
    } else {
        displayError("Impossible de charger les Pokémon. Vérifiez votre connexion.");
    }
}
