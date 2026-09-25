import { getPokemonList } from "./api/pokeApi.js";
import { initPopup } from "./modal.js";
import { setupSearchBar } from "./searchBar.js";
import { setupFiltreType } from "./filter.js";

getPokemonList();
initPopup();
setupSearchBar();
setupFiltreType();
