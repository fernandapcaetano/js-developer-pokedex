const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


function searchPokemonByName(event) {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    const pokemonNameInput = document.getElementById('pokemonName');
    const pokemonName = pokemonNameInput.value.trim().toLowerCase();

    if (pokemonName === '') {
        alert('Digite o nome do Pokémon.');
        return;
    }

    // Limpa a lista de Pokémon antes de carregar novos resultados
    pokemonList.innerHTML = '';

    // Chama a função para buscar detalhes do Pokémon pelo nome
    pokeApi.getPokemonDetailByName(pokemonName)
        .then((pokemon) => {
            if (pokemon) {
                const pokemonLi = convertPokemonToLi(pokemon);
                pokemonList.innerHTML = pokemonLi;
            } else {
                alert('Pokémon não encontrado. Verifique o nome e tente novamente.');
            }
        })
        .catch((error) => {
            console.error('Erro ao buscar Pokémon:', error);
            alert('Ocorreu um erro ao buscar o Pokémon. Tente novamente mais tarde.');
        });

        loadMoreButton.style.display = "none"
}

// Adiciona um ouvinte de evento para o formulário de busca por nome
pokemonSearchForm.addEventListener('submit', searchPokemonByName);

// ... Restante do seu código ...
