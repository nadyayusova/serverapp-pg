window.addEventListener('load', () => {
  const inputId = document.querySelector('#crud [name="userid"]');
  const inputName = document.querySelector('#crud [name="username"]');
  const results = document.querySelector('#results');
  const rows = document.querySelector("tbody");

  const methods = [
    {
      name: 'select, select all',
      route: '/api/user',
      method: 'GET',
      headers: { "Accept": "application/json" },
    },
    {
      name: 'create',
      route: '/api/user',
      method: 'POST',
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
    },
    {
      name: 'update',
      route: '/api/user',
      method: 'PUT',
      headers: { "Accept": "application/json", "Content-Type": "application/json" }
    },
    {
      name: 'delete',
      route: '/api/user',
      method: 'DELETE',
      headers: { "Accept": "application/json" }
    }
  ];
  

  const form = document.querySelector('#crud');

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
  })


  // Получение всех пользователей
  async function getUsers() {
    // отправляет запрос и получаем ответ
    const response = await fetch(methods[0].route, {
      method: methods[0].method,
      headers: methods[0].headers,
    });
    // если запрос прошел нормально
    if (response.ok === true) {
      // получаем данные
      const users = await response.json();
      console.log(users);
      results.value = JSON.stringify(users, null, 1);
      // добавляем полученные элементы в таблицу
      rows.innerHTML = '';
      users.forEach(user => {
        rows.append(row(user));
      });
    }
  }

  // Получение одного пользователя
  async function getUser(id) {
    const response = await fetch(methods[0].route + '/' + id, {
      method: methods[0].method,
      headers: methods[0].headers,
    });
    if (response.ok === true) {
      const user = await response.json();
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
  }
  // Добавление пользователя
  async function createUser(userName) {
    // в body не забыть написать правильное название параметра запроса
    const response = await fetch(methods[1].route, {
      method: methods[1].method,
      headers: methods[1].headers,
      body: JSON.stringify({
        username: userName,
      }),
    });
    if (response.ok === true) {
      const user = await response.json();
      console.log(user[0]);
      results.value = JSON.stringify(user[0], null, 1);
      if (user[0].user_id) {
        rows.append(row(user[0]));
        form.reset();
      }
    }
  }

  // Изменение пользователя
  async function editUser(userId, userName) {
    const response = await fetch(methods[2].route, {
      method: methods[2].method,
      headers: methods[2].headers,
      body: JSON.stringify({
        userid: userId,
        username: userName,
      })
    });
    if (response.ok === true) {
      const user = await response.json();
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
  }

  // Удаление пользователя
  async function deleteUser(id) {
    const response = await fetch(methods[3].route + '/' + id, {
      method: methods[3].method,
      headers: methods[3].headers,
    });
    if (response.ok === true) {
      const user = await response.json();
      console.log(user[0]);
      results.value = JSON.stringify(user[0], null, 1);
      if (user[0]) {
        const row = rows.querySelector(`[data-rowid="${user[0].user_id}"]`);
        row.remove();
      }
    }
  }
  
  function row(user) {
    // списано
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
    editLink.setAttribute("data-id", user.user_id);
    editLink.append("Изменить");
    editLink.addEventListener("click", (evt) => {

        evt.preventDefault();
        getUser(user.user_id);
    });
    linksWrapper.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", user.user_id);
    removeLink.append("Удалить");
    removeLink.addEventListener("click", (evt) => {

        evt.preventDefault();
        deleteUser(user.user_id);
    });

    linksWrapper.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
  }
});