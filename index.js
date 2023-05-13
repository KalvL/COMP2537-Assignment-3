const PAGE_SIZE = 10
let currentPage = 1;
let pokemons = [];
let types = [];
let selectedFilters = [];

const filter = async () => {
  let response = await axios.get('https://pokeapi.co/api/v2/type');
  types = response.data.results;
  types.forEach(async (types) => {
    const res = await axios.get(types.url)
    $('#filter').append(`
    <input type="checkbox" class="filterCheck" id="${res.data.name}">&nbsp${res.data.name}&emsp;</input>
    `)
  });
}

const numPokemonDisplayed = () => {
  $('#numDisplayed').empty();
  $('#numDisplayed').append(`<h3>Showing ${currentPage * PAGE_SIZE} of ${pokemons.length}</h3>`)
}


const updatePaginationDiv = (currentPage, numPages) => {
  $('#pagination').empty()
  numPokemonDisplayed();
  const startPage = 1;
  const endPage = numPages;
  if (currentPage > 3) {
    $('#pagination').append(`
      <button class="btn btn-primary page ml-1 numberedButtons" value="${1}">First</button>
    `)
  }
  if (currentPage > 1) {
    $('#pagination').append(`
      <button class="btn btn-primary page ml-1 numberedButtons" value="${currentPage - 1}">Previous</button>
    `)
  }
  for (let i = startPage; i <= endPage; i++) {
    if (i >= currentPage - 2 && i <= currentPage + 2) {
      let isActive = "";
      if (i === currentPage) {
        isActive = "active"
      }
      $('#pagination').append(`
    <button class="btn btn-primary page ml-1 numberedButtons ${isActive}" value="${i}">${i}</button>
    `)
    }
  }
  if (currentPage < numPages) {
    $('#pagination').append(`
      <button class="btn btn-primary page ml-1 numberedButtons" value="${currentPage + 1}">Next</button>
    `)
  }
  if (currentPage < numPages - 2) {
    $('#pagination').append(`
      <button class="btn btn-primary page ml-1 numberedButtons" value="${numPages}">Last</button>
    `)
  }

}

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  selected_pokemons = pokemons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  $('#pokeCards').empty()
  selected_pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url)
    $('#pokeCards').append(`
      <div class="pokeCard card" pokeName=${res.data.name}   >
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
          More
        </button>
        </div>  
        `)
  })
}

const setup = async () => {
  // test out poke api using axios here
  filter();

  $('#pokeCards').empty()
  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  pokemons = response.data.results;

  paginate(currentPage, PAGE_SIZE, pokemons)
  const numPages = Math.ceil(pokemons.length / PAGE_SIZE)
  updatePaginationDiv(currentPage, numPages)

  $('body').on('click', ".filterCheck", async function (e) {
    console.log(e.target.id);
    if (document.getElementById(e.target.id).checked) {
      selectedFilters.push(e.target.id);
    } else {
      for (let i = 0; i < selectedFilters.length; i++) {
        if (selectedFilters[i] == e.target.id) {
          selectedFilters.splice(i, 1);
        }
      }
    }
    console.log(selectedFilters);
  })


  // pop up modal when clicking on a pokemon card
  // add event listener to each pokemon card
  $('body').on('click', '.pokeCard', async function (e) {
    const pokemonName = $(this).attr('pokeName')
    // console.log("pokemonName: ", pokemonName);
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    // console.log("res.data: ", res.data);
    const types = res.data.types.map((type) => type.type.name)
    // console.log("types: ", types);

    console.log(res.data.abilities.map((ability) => ability.ability.name).join(''));
    console.log(res.data.types.map((type) => type.type.name).join(''));


    $('.modal-body').html(`
        <div style="width:200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
        </div>

        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>

        </div>

        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
          </ul>
      
        `)
    $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `)
  })

  // add event listener to pagination buttons
  $('body').on('click', ".numberedButtons", async function (e) {
    currentPage = Number(e.target.value)
    paginate(currentPage, PAGE_SIZE, pokemons)
    //update pagination buttons
    updatePaginationDiv(currentPage, numPages)
  })

}


$(document).ready(setup)