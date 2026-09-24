import { setupFavoris } from "../fav.js";

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
        sprite: fiche.sprites.front_default,
        types: getTypes(fiche),
        height: fiche.height / 10,
        weight: fiche.weight / 10,
        stats: getStats(fiche)
    };
}

export const getPokemon = (id) => {
    return pokemons.find(pokemon => pokemon.id === Number(id));
}

const displayError = (message) => {
    const erreur = document.createElement('p');
    erreur.className = 'erreur';
    erreur.textContent = message;
    document.body.appendChild(erreur);
}

export const getPokemonList = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
        .catch(error => {
            console.error("Error:", error)
            return null;
        });

    if (!response) {
        displayError("Une erreur est survenue");
        return;
    }

    if (response.status < 300) {
        const data = await response.json();

        const requetes = [];
        for (let i = 0; i < data.results.length; i++) {
            requetes.push(getDetails(data.results[i]));
        }

        const details = await Promise.all(requetes);
        pokemons = details;

        let content = "";
        for (let i = 0; i < details.length; i++) {
            const pokemon = details[i];

            content += `
                <div class="carte" data-id="${pokemon.id}" data-types="${pokemon.types}">
                    <button class="fav"></button>
                    <h2>${pokemon.name}</h2>
                    <img src="${pokemon.sprite}" alt="${pokemon.name}">
                </div>
            `;
        }

        const elements = document.createElement('main')
        elements.className = 'grille'
        elements.innerHTML = content
        document.body.appendChild(elements)

        setupFavoris()
    } else {
        displayError("Une erreur est survenue")
    }
}
