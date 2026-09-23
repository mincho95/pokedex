export const setupSearchBar = () => {
    const recherche = document.getElementById('recherche');

    if (!recherche) {
        return;
    }

    recherche.addEventListener('input', () => {
        const texte = recherche.value.toLowerCase();

        document.querySelectorAll('.carte').forEach(carte => {
            const nom = carte.querySelector('h2').textContent.toLowerCase();

            if (nom.includes(texte)) {
                carte.style.display = '';
            } else {
                carte.style.display = 'none';
            }
        });
    });
}
