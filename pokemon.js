const setup = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=810');
  console.log(response.data.results);

  const pokemon = response.data.results;
  $('#pokemon').empty();
  for (let i = 0; i < pokemon.length; i++) {
    let innerResponse = await axios.get(`${pokemon[i].url}`);
    let thisPokemon = innerResponse.data;
    $('#pokemon').append(`
    <div class="pokeCard card">
      <h3>${pokemon[i].name}</h3>
      <img src="${thisPokemon.sprites.front_default}" alt="${thisPokemon.name}">
      <button type="button" class="btn btn-primary"> More </button>
    </div>
    `);
  }
  $('#pokemon').append(newList);

}

$(document).ready(setup);