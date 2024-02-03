
// fetching pokemon data using api link
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

// fetching specific pokemon data filerted by its name
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

// fetching pokemon ability 
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

// fetching pokemon detail 
async function displayPokemonDetails(pokemonName) {
    const pokemonData = await fetchPokemonData(pokemonName);
    //code to reset ability section for each pokemon
    document.getElementById('abilityDetails').innerHTML = '';
    
    //hiding pokemon detail and ability section while loading page
    document.getElementById('pokemonDetails').classList.remove('hidden');
    document.getElementById('abilityDetails').classList.remove('hidden');


    //storing abilities details
    const abilities = await Promise.all(pokemonData.abilities.map(async ability => {
        const abilityDetails = await fetchAbilityDetails(ability.ability.url);
        return {
            name: ability.ability.name,
            effect: abilityDetails.effect_entries.find(entry => entry.language.name === 'en').effect,
            shortEffect: abilityDetails.effect_entries.find(entry => entry.language.name === 'en').short_effect,
            flavorText: abilityDetails.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text
        };
    }));

    
    //section to show pokemon detail
    const detailsHTML = `
        <h2>${pokemonData.name}</h2>
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
        <p><strong>Abilities:</strong></p>
        <ul id="abilitiesList">
            ${abilities.map(ability => `
            <li class="abilityName">
            <strong>${ability.name}</strong>
        </li>
            `).join('')}
        </ul>
        <p><strong>Height:</strong> ${pokemonData.height}</p>
        <p><strong>Base Experience:</strong> ${pokemonData.base_experience}</p>
    `;

    document.getElementById('pokemonDetails').innerHTML = detailsHTML;

    const abilityButtons = document.querySelectorAll('.abilityDetailsButton');
    abilityButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            displayAbilityDetails(
                abilities[index].name,
                abilities[index].effect,
                abilities[index].shortEffect,
                abilities[index].flavorText
            );
        });
    });

    const abilityNames = document.querySelectorAll('.abilityName');
    abilityNames.forEach((name, index) => {
        name.addEventListener('click', () => {
            // Showing the abilities div when an ability name is clicked
            document.getElementById('abilityDetails').classList.remove('hidden');
            displayAbilityDetails(
                abilities[index].name,
                abilities[index].effect,
                abilities[index].shortEffect,
                abilities[index].flavorText
            );
        });
    });
}


// function to display ability details 
function displayAbilityDetails(abilityName, abilityEffect, abilityShortEffect, flavorText) {
    const abilityDetailsHTML = `
        <h3>${abilityName} Details</h3>
        <p><strong>Effect:</strong> ${abilityEffect}</p>
        <p><strong>Short Effect:</strong> ${abilityShortEffect}</p>
        <p><strong>Flavor Text:</strong> ${flavorText}</p>
    `;

    document.getElementById('abilityDetails').innerHTML = abilityDetailsHTML;
}

// function to load pokemon 
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
loadPokemonList();