/**
 * Estado da aplicação(state)
 */
let inputName = null;
let buttonSearch = null;
let divUserFiltered = null;
let divStatistics = null;
let form = null;
let allUsers = [];

window.addEventListener('load', () => {
  inputName = document.querySelector('#inputName');
  buttonSearch = document.querySelector('#buttonSearch');
  divFilteredUsers = document.querySelector('#filteredUsers');
  divStatistics = document.querySelector('#userStatistics');
  form = document.querySelector('form');

  //fetchUsers();
  fetchUsersAsync();
  addEvents();
});

/*function fetchUsers() {
  fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo')
    .then((res) => {
      res.json().then((data) => {
        console.log('Capturou os dados');
      });
    })
    .catch((error) => {
      console.log('Erro na requisição');
    });
}*/

async function fetchUsersAsync() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();

  allUsers = json.results.map((user) => {
    return {
      name: user.name.first + ' ' + user.name.last,
      age: user.dob.age,
      photo: user.picture.thumbnail,
      gender: user.gender,
    };
  });
}

function addEvents() {
  inputName.addEventListener('keyup', handleButtonState);
  form.addEventListener('submit', preventSubmit);
  buttonSearch.addEventListener('click', search);
}

function handleButtonState(event) {
  const valueInput = event.target.value.trim();

  buttonSearch.disabled = false;
  if (valueInput === '') {
    buttonSearch.disabled = true;
  }
  if (
    (event.code === 'Enter' || event.code === 'NumpadEnter') &&
    valueInput !== ''
  ) {
    search();
  }

  console.log(event);
}

function preventSubmit(event) {
  event.preventDefault();
}

function search() {
  const filteredUsers = allUsers
    .filter((user) => {
      return (
        user.name.toLowerCase().indexOf(inputName.value.toLowerCase()) > -1
      );
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  let filteredUsersHTML = '<div>';
  filteredUsersHTML += `<h4 class="subtitle">${filteredUsers.length} usuário(s) encontrado(s)</h4>`;

  filteredUsers.forEach((user) => {
    const { name, age, photo } = user;

    const filteredUserHTML = `
      <div class='user'>
        <div>
          <img src="${photo}" alt="${name}" />
        </div>
        <div>
          <p>${name}, ${age} anos</p>
        </div>
      </div>
    `;

    filteredUsersHTML += filteredUserHTML;
  });

  filteredUsersHTML += '</div>';
  divFilteredUsers.innerHTML = filteredUsersHTML;

  renderStatisticsUsers(filteredUsers);
}

function renderStatisticsUsers(filteredUsers) {
  let userStatisticsHTML = '';

  if (filteredUsers.length > 0) {
    const male = filteredUsers.filter((user) => {
      return user.gender === 'male';
    });

    const female = filteredUsers.filter((user) => {
      return user.gender === 'female';
    });

    const totalAge = filteredUsers.reduce((accumulator, current) => {
      return accumulator + current.age;
    }, 0);

    const mediaIdades = (totalAge / filteredUsers.length).toFixed(2);

    userStatisticsHTML = '<div>';
    userStatisticsHTML += '<h4 class="subtitle">Estatísticas</h4>';
    const userStatisticHTML = `
        <div class='statistic'>
          <ul>
            <li>Sexo masculino: ${male.length}</li>
            <li>Sexo feminino: ${female.length}</li>
            <li>Soma das idades: ${totalAge}</li>
            <li>Média das idades: ${mediaIdades}</li>
          </ul>
        </div>
      `;
    userStatisticsHTML += userStatisticHTML;
    userStatisticsHTML += '</div>';
    divStatistics.innerHTML = userStatisticsHTML;
  } else {
    userStatisticsHTML = '<h4>Nada a ser exibido</h4>';
    divStatistics.innerHTML = userStatisticsHTML;
  }
}
