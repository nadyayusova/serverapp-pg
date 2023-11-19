// import axios from 'axios';

const form = document.querySelector('#crud');
const inputId = document.querySelector('#crud [name="userid"]');
const inputName = document.querySelector('#crud [name="username"]');
const results = document.querySelector('#results');
const table = document.querySelector("table");
const rows = document.querySelector("tbody");

const USER_ROUTE = '/api/v1/user';

const methods = [
  {
    name: 'select, select all',
    route: USER_ROUTE,
    method: 'GET',
    headers: {"Accept": "application/json"},
  },
  {
    name: 'create',
    route: USER_ROUTE,
    method: 'POST',
    headers: {"Accept": "application/json", "Content-Type": "application/json"},
  },
  {
    name: 'update',
    route: USER_ROUTE,
    method: 'PUT',
    headers: {"Accept": "application/json", "Content-Type": "application/json"}
  },
  {
    name: 'delete',
    route: USER_ROUTE,
    method: 'DELETE',
    headers: {"Accept": "application/json"}
  }
];

// Получение всех пользователей
async function getUsers() {
  try {
    const response = await axios.get(methods[0].route, {headers: methods[0].headers});
    if (response.status === 200) {
      const {data: users} = response;
      console.log(users);
      results.value = JSON.stringify(users, null, 1);
      rows.innerHTML = '';
      users.forEach(user => {
        rows.append(row(user));
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// Получение одного пользователя
async function getUser(id) {
  try {
    const response = await axios.get(methods[0].route + '/' + id, {headers: methods[0].headers});
    if (response.status === 200) {
      const {data: user} = response;
      console.log(user[0]);
      results.value = JSON.stringify(user[0], null, 1);
      form.elements["userid"].value = user[0].user_id;
      if (user[0]) {
        if (user[0].user_name) {
          form.elements["username"].value = user[0].user_name;
        } else {
          form.elements["username"].value = '';
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Добавление пользователя
async function createUser(userName) {
  try {
    const response = await axios.post(methods[1].route,
      {
        username: userName,
      },
      {
        headers: methods[1].headers,
      });
    console.log(response);
    if (response.status === 201 || response.status === 200) {
      const {data: user} = response;
      console.log(user[0]);
      results.value = JSON.stringify(user[0], null, 1);
      if (user[0].user_id) {
        rows.append(row(user[0]));
        form.reset();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Изменение пользователя
async function editUser(userId, userName) {
  try {
    const response = await axios.put(methods[2].route,
      {
        userid: userId,
        username: userName,
      },
      {
        headers: methods[2].headers,
      });
    if (response.status === 200) {
      const {data: user} = response;
      console.log(user[0]);
      results.value = JSON.stringify(user[0], null, 1);
      const row = rows.querySelector(`[data-rowid="${user[0].user_id}"]`);
      if (user[0]) {
        if (user[0].user_name) {
          row.querySelector('td:nth-child(2)').textContent = user[0].user_name;
        } else {
          row.querySelector('td:nth-child(2)').textContent = '';
        }
        form.reset();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Удаление пользователя
async function deleteUser(id) {
  axios
    .delete(methods[3].route + '/' + id, {headers: methods[3].headers})
    .then((response) => {
      if (response.status === 200) {
        const {data: user} = response;
        console.log(user[0]);
        results.value = JSON.stringify(user[0], null, 1);
        if (user[0]) {
          const row = rows.querySelector(`[data-rowid="${user[0].user_id}"]`);
          row.remove();
        }
      }
    });
}

function row(user) {
  const tr = document.createElement("tr");
  tr.setAttribute("data-rowid", user.user_id);

  const idTd = document.createElement("td");
  idTd.append(user.user_id);
  tr.append(idTd);

  const nameTd = document.createElement("td");
  nameTd.append(user.user_name);
  tr.append(nameTd);

  const linksTd = document.createElement("td");
  const linksWrapper = document.createElement("div");
  linksTd.append(linksWrapper);

  const editLink = document.createElement("a");
  editLink.setAttribute("data-action", "edit");
  editLink.append("Изменить");
  linksWrapper.append(editLink);

  const removeLink = document.createElement("a");
  removeLink.setAttribute("data-action", "delete");
  removeLink.append("Удалить");
  linksWrapper.append(removeLink);

  tr.appendChild(linksTd);

  return tr;
}

export function initTable() {
  if (form) {
    form.addEventListener('click', (evt) => {
      if (!evt.target.closest('button')) {
        return;
      }

      evt.preventDefault();
      const btnType = evt.target.getAttribute('data-type');

      switch (btnType) {
        case 'search':
          getUser(inputId.value);
          break;
        case 'create':
          createUser(inputName.value);
          break;
        case 'update':
          editUser(inputId.value, inputName.value);
          break;
        case 'delete':
          deleteUser(inputId.value);
          break;
        default:
          getUsers();
          break;
      }
    });
  }

  if (table) {
    table.addEventListener('click', (evt) => {
      if (!evt.target.closest('a[data-action]')) {
        return;
      }

      evt.preventDefault();
      const linkType = evt.target.getAttribute('data-action');
      const userid = evt.target.closest('[data-rowid]').dataset.rowid;

      switch (linkType) {
        case 'edit':
          getUser(userid);
          break;
        case 'delete':
          deleteUser(userid);
          break;
      }
    });
  }
}
