// baska55
var tableBody = document.querySelector("#todo-table tbody");
var modal = document.getElementById("modal");
var titleInput = document.getElementById("title-input");
var saveButton = document.getElementById("save-button");

// Fake API'den todosları al

function getTodos() {
  fetch("  http://localhost:5050/todos")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      createTable(data);
    })
    .catch(function(error) {
      console.log(error);
    });
}

// Tabloyu oluştur
function createTable(todos) {
  tableBody.innerHTML = "";

  for (var i = 0; i < todos.length; i++) {
    var todo = todos[i];

    var row = document.createElement("tr");
    var titleCell = document.createElement("td");
    titleCell.textContent = todo.title;
    row.appendChild(titleCell);

    var actionsCell = document.createElement("td");
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Sil";
    deleteButton.dataset.id = todo.id;
    deleteButton.classList.add('btns');

    actionsCell.appendChild(deleteButton);

    var changeButton = document.createElement("button");
    changeButton.textContent = "Değiştir";
    changeButton.dataset.id = todo.id;
    changeButton.classList.add('btn');
    actionsCell.appendChild(changeButton);

    row.appendChild(actionsCell);

    tableBody.appendChild(row);
  }
}

// Delete button'a click event listener ekle
tableBody.addEventListener("click", function(event) {
  if (event.target.tagName === "BUTTON" && event.target.textContent === "Sil") {
    var id = event.target.dataset.id;
    deleteTodoById(id);
  }
});

// Todo'yu sil
function deleteTodoById(id) {
  var url = "http://localhost:5050/todos/" + id;

  fetch(url, {
    method: "DELETE"
  })
    .then(function(response) {
      if (response.ok) {
        getTodos();
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

// Change button'a click event listener ekle
tableBody.addEventListener("click", function(event) {
  if (event.target.tagName === "BUTTON" && event.target.textContent === "Değiştir") {
    var id = event.target.dataset.id;
    openModal(id);
  }
});

// Modalı açan fonksiyon
function openModal(id) {
  modal.style.display = "block";

  fetch("http://localhost:5050/todos/" + id)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      titleInput.value = data.title;
      saveButton.dataset.id = data.id;
    })
    .catch(function(error) {
      console.log(error);
    });
}

// Save button'a click event listener ekle
saveButton.addEventListener("click", function() {
  var id = saveButton.dataset.id;
  var newTitle = titleInput.value;

  updateTodoTitle(id, newTitle);
});

// Todo title'ını güncelle
function updateTodoTitle(id, newTitle) {
  var url = "http://localhost:5050/todos/" + id;

  fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: newTitle
    })
  })
    .then(function(response) {
      if (response.ok) {
        getTodos();
        modal.style.display = "none";
        titleInput.value = "";
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

// Todosları al ve tabloyu oluştur
getTodos();

// Yeni todo ekleme düğmesine click event listener ekle
var addTodoButton = document.getElementById("add-todo-button");
addTodoButton.addEventListener("click", function() {
  var newTitle = document.getElementById("new-todo-input").value; // Input alanındaki değeri al
  addNewTodo(newTitle);
});

// Yeni todo ekle
function addNewTodo(title) {
  var newTodo = {
    title: title,
    completed: false
  };

  fetch("http://localhost:5050/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newTodo)
  })
    .then(function(response) {
      if (response.ok) {
        getTodos(); // Yeniden todosları al ve tabloyu güncelle
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}