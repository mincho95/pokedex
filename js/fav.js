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
        compteur.textContent = favoris.length;
    }
}

/* Met à jour l'apparence du cœur (plein ou vide) */
const afficherEtat = (bouton, favori) => {
    bouton.classList.toggle('actif', favori);
    bouton.setAttribute('aria-pressed', favori);
    bouton.setAttribute('aria-label', favori ? 'Retirer des favoris' : 'Ajouter aux favoris');
}

const toggleFavori = (id, bouton) => {
    let favoris = getFavoris();

    if (favoris.includes(id)) {
        favoris = favoris.filter(favoriId => favoriId !== id);
        afficherEtat(bouton, false);
    } else {
        favoris.push(id);
        afficherEtat(bouton, true);
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

        afficherEtat(bouton, isFavori(id));

        bouton.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleFavori(id, bouton);
        });
    });

    updateCompteur();
}
