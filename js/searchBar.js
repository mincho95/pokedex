import { appliquerFiltres } from "./filter.js";

export const setupSearchBar = () => {
    const recherche = document.getElementById('recherche');

    if (!recherche) {
        return;
    }

    recherche.addEventListener('input', appliquerFiltres);
}
