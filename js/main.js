import { getPokemonList } from "./api/pokeApi.js";
import { setupSearchBar } from "./searchBar.js";
import { setupFiltreType } from "./filter.js";

getPokemonList();
setupSearchBar();
setupFiltreType();
