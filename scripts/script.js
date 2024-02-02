async function fetchPokemonList() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon');
        const data = await response.json();
        const firstFivePokemon = data.results.slice(0, 5);
        return firstFivePokemon;
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
        throw error;
    }
}

async function fetchPokemonData(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        throw error;
    }
}

async function fetchAbilityDetails(abilityURL) {
    try {
        const response = await fetch(abilityURL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching ability details:', error);
        throw error;
    }
}

async function displayPokemonDetails(pokemonName) {
    const pokemonData = await fetchPokemonData(pokemonName);

    const abilities = pokemonData.abilities.map(async ability => {
        const abilityDetails = await fetchAbilityDetails(ability.ability.url);
        return {
            name: ability.ability.name,
            effect: abilityDetails.effect_entries.find(entry => entry.language.name === 'en').effect,
            shortEffect: abilityDetails.effect_entries.find(entry => entry.language.name === 'en').short_effect,
            flavorText: abilityDetails.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text
        };
    });

    const detailsHTML = `
        <h2>${pokemonData.name}</h2>
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
        <p><strong>Abilities:</strong></p>
        <ul>
            ${await Promise.all(abilities).then(abilities => abilities.map(ability => `
                <li>
                    <strong>${ability.name}</strong>: ${ability.shortEffect}
                    <button onclick="displayAbilityDetails('${ability.name}', '${ability.effect}', '${ability.shortEffect}', '${ability.flavorText}')">Details</button>
                </li>
            `).join(''))}
        </ul>
        <p><strong>Height:</strong> ${pokemonData.height}</p>
        <p><strong>Base Experience:</strong> ${pokemonData.base_experience}</p>
    `;

    document.getElementById('pokemonDetails').innerHTML = detailsHTML;
}

function displayAbilityDetails(abilityName, abilityEffect, abilityShortEffect, flavorText) {
    const abilityDetailsHTML = `
        <h3>${abilityName} Details</h3>
        <p><strong>Effect:</strong> ${abilityEffect}</p>
        <p><strong>Short Effect:</strong> ${abilityShortEffect}</p>
        <p><strong>Flavor Text:</strong> ${flavorText}</p>
    `;

    document.getElementById('abilityDetails').innerHTML = abilityDetailsHTML;
}

async function loadPokemonList() {
    const pokemonList = await fetchPokemonList();
    const pokemonListContainer = document.getElementById('pokemonList');

    for (const pokemon of pokemonList) {
        const pokemonData = await fetchPokemonData(pokemon.name);
        const pokemonElement = document.createElement('div');
        pokemonElement.className = 'pokemon';
        pokemonElement.innerHTML = `
            <img src="${pokemonData.sprites.front_default}" alt="${pokemon.name}">
            <p>${pokemon.name}</p>
        `;
        pokemonElement.addEventListener('click', () => displayPokemonDetails(pokemon.name));
        pokemonListContainer.appendChild(pokemonElement);
    }
}

// Load the Pokémon list on page load
loadPokemonList();