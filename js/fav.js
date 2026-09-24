export const getFavoris = () => {
    const favoris = localStorage.getItem('favoris');
    return favoris ? JSON.parse(favoris) : [];
}

const saveFavoris = (favoris) => {
    localStorage.setItem('favoris', JSON.stringify(favoris));
}

export const isFavori = (id) => {
    return getFavoris().includes(id);
}

export const updateCompteur = () => {
    const favoris = getFavoris();
    const compteur = document.getElementById('compteur');
    if (compteur) {
        compteur.textContent = `Favoris : ${favoris.length}`;
    }
}

const toggleFavori = (id, bouton) => {
    let favoris = getFavoris();

    if (favoris.includes(id)) {
        favoris = favoris.filter(favoriId => favoriId !== id);
        bouton.textContent = '🩶';
    } else {
        favoris.push(id);
        bouton.textContent = '❤️';
    }

    saveFavoris(favoris);
    updateCompteur();
}

export const setupFavoris = () => {
    document.querySelectorAll('.carte').forEach(carte => {
        const id = Number(carte.dataset.id);
        const bouton = carte.querySelector('.fav');

        if (!bouton) {
            return;
        }

        bouton.textContent = isFavori(id) ? '❤️' : '🩶';

        bouton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleFavori(id, bouton);
        });
    });

    updateCompteur();
}