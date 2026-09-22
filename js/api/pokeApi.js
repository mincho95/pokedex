
import { setupSearchBar } from "../searchBar.js";

const getFrenchName = (species, fallback) => {
    for (let i = 0; i < species.names.length; i++) {
        if (species.names[i].language.name === "fr") {
            return species.names[i].name;
        }
    }

    return fallback;
}

const getDetails = async (pokemon) => {
    const fiche = await fetch(pokemon.url).then(res => res.json());
    const species = await fetch(fiche.species.url).then(res => res.json());

    return {
        id: fiche.id,
        name: getFrenchName(species, fiche.name),
        sprite: fiche.sprites.front_default
    };
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

        let content = "";
        for (let i = 0; i < details.length; i++) {
            const pokemon = details[i];

            content += `
                <div class="carte" data-id="${pokemon.id}">
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

        setupSearchBar()
    } else {
        displayError("Une erreur est survenue")
    }
}
