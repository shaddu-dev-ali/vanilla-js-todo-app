const $taskInput = document.querySelector(
  '.container form'
);
const $todos = document.querySelector('.todos');
const $listContainer =
  document.getElementById('simpleList');
const $itemCount = document.querySelector('.count span');
const $filterArr = document.querySelectorAll(
  '.filters input[type="radio"]'
);
const $clear = document.querySelector('.clear');
const $themeImage = document.querySelector(
  '.theme-image img'
);

let count = 0;
let allItems = [];

$themeImage.addEventListener('click', function () {
  document.body.classList.toggle('light');
  if (document.body.classList.contains('light')) {
    $themeImage.src = 'images/icon-moon.svg';
  } else {
    $themeImage.src = 'images/icon-sun.svg';
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const savedArray = JSON.parse(
    localStorage.getItem('todos')
  );
  if (savedArray == null) return;
  allItems = savedArray;

  allItems.forEach((todo) => {
    displayUI(todo);
  });
  count = allItems.length;
  updateCount(count);
  filterTodos();
});

const pushToArray = (obj) => {
  allItems.push(obj);
  count++;
  updateCount(count);
  saveToLocalStorage();
};

const saveToLocalStorage = () => {
  localStorage.setItem('todos', JSON.stringify(allItems));
};

const displayUI = (todo) => {
  const isCompleted = todo.status === 'completed';
  const markup = `
      <li class="${isCompleted ? 'completed' : 'active'}">
        <label class="list">
          <input id="${
            todo.id
          }" class="checkbox" type="checkbox" ${
    isCompleted ? 'checked' : ''
  }/>
          <span  class="text">${todo.value}</span>
        </label>
        <span id="${todo.id}" class="remove"></span>
      </li>
`;

  $listContainer.insertAdjacentHTML('beforeend', markup);
};

function filterTodo(id) {
  const allItems = document.querySelectorAll('li');

  if (id === 'all') {
    allItems.forEach((item) => {
      item.classList.remove('hidden');
    });
  }

  if (id === 'active') {
    allItems.forEach((item) => {
      if (!item.querySelector('.checkbox').checked) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  if (id === 'completed') {
    allItems.forEach((item) => {
      if (item.querySelector('.checkbox').checked) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }
}

function updateCount(count) {
  $itemCount.innerText = count;
}

function filterTodos() {
  $filterArr.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      filterTodo(e.target.id);
    });
  });
}

$taskInput.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputTask = $taskInput.querySelector(
    '.create-task-input'
  );

  const value = inputTask.value;
  inputTask.value = '';
  // creating object to push
  const obj = {
    id: Math.floor(Math.random() * 9999999),
    value: value,
    status: 'active',
  };
  // push to allItems array and save in storage
  pushToArray(obj);

  // push items to the ui
  displayUI(obj);

  // filter todos

  filterTodos();
});

document.addEventListener('input', (e) => {
  const box = e.target.closest('.checkbox');
  console.log(box);
  const id = Number(box.id);
  const isChecked = box.checked;
  allItems = allItems.map((todo) => {
    if (todo.id === id) {
      todo.status = isChecked ? 'completed' : 'active';
    }
    return todo;
  });
  console.log(isChecked);
  saveToLocalStorage();
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove')) {
    const id = Number(e.target.id);

    const itemIndex = allItems.findIndex(
      (todo) => todo.id === id
    );
    allItems.splice(itemIndex);
    saveToLocalStorage();
    e.target.closest('li').remove();
    count--;
    updateCount(count);
  }
});

$clear.addEventListener('click', () => {
  allItems = allItems.filter(
    (todo) => todo.status == 'active'
  );
  saveToLocalStorage();

  document
    .querySelectorAll('input:checked')
    .forEach((item) => {
      item.closest('li').remove();
      count--;
      updateCount(count);
    });
});
