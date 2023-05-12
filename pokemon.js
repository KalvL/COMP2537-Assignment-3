const setup = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=810');
  console.log(response.data.results);

  const pokemon = response.data.results;
  $('#pokemon').empty();
  var newList = $('<ol></ol>');
  for (let i = 0; i < pokemon.length; i++) {
    newList.append(`<li>${pokemon[i].name}</li>`);
  }
  $('#pokemon').append(newList);

}

$(document).ready(setup);