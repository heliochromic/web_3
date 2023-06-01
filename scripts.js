function addElement() {
  // Get the input element value from the form
  let input = document.querySelector('input[name="search"]');
  let inputValue = input.value;

  if (inputValue.trim() === "") {
    alert("Don't leave this field empty.");
    return;
  }

  let newElement = document.createElement("div");

  newElement.classList.add("item");

  newElement.innerHTML = `
        <div class="not_bought_product_name" onclick="editItemName(this)">
          <p>${inputValue}</p>
        </div>
        <div class="not_bought_counter">
          <button type="button" class="round_button delete disabled" data-tooltip="remove" onclick="decrement(this)">-</button>
          <div class="counter">1</div>
          <button type="button" class="round_button add tooltip" data-tooltip="add" onclick="increment(this)">+</button>
        </div>
        <div class="bought">
          <button type="button" class="add to_do tooltip" data-tooltip="click to buy">Куплено</button>
          <button type="button" class="delete remove tooltip" data-tooltip="delete">X</button>
        </div>
      `;

  let newLeftElement = document.createElement("span");
  newLeftElement.classList.add("cell");

  newLeftElement.innerHTML = `          
          ${inputValue}
          <div class="yellow_counter">1</div>`;

  let container = document.getElementById("left");
  let rightContainer = document.querySelector("#not_done");
  container.appendChild(newElement);
  rightContainer.appendChild(newLeftElement);

  input.value = "";
}

function increment(button) {
  const counterElement = button.parentNode.querySelector(".counter");
  let value = parseInt(counterElement.innerText);
  counterElement.innerText = value + 1;

  if (value === 1) {
    let disabledRemove = button.parentNode.querySelector(".delete");
    disabledRemove.setAttribute("type", "button");
    disabledRemove.setAttribute("class", "round_button delete tooltip");
    disabledRemove.setAttribute("data-tooltip", "remove");
    disabledRemove.addEventListener("click", decrement);
  }

  changeYellow(button, value, 1);
}

function decrement() {
  const button = this; // Since the decrement function is called as an event listener, `this` refers to the clicked button
  const counterElement = button.parentNode.querySelector(".counter");
  let value = parseInt(counterElement.innerText);
  if (value === 2) {
    let activeRemove = button.parentNode.querySelector(".delete");
    activeRemove.removeAttribute("type");
    activeRemove.removeAttribute("class");
    activeRemove.removeAttribute("data-tooltip");
    activeRemove.removeEventListener("click", decrement);
    activeRemove.setAttribute("type", "button");
    activeRemove.setAttribute("class", "round_button delete disabled");
  }
  if (value > 1) {
    counterElement.innerText = value - 1;
  }

  changeYellow(button, value, -1);
}

function changeYellow(button, value, sign) {
  const itemElement = button.closest(".item");
  const itemBlockName = itemElement.querySelector(
    ".not_bought_product_name p"
  ).textContent;

  var elements = document.querySelectorAll(".right_block .cell");

  elements.forEach(function (element) {
    var text = element.textContent.trim().split("\n");
    if (text[0] == itemBlockName) {
      var yellowCounter = element.querySelector(".yellow_counter");
      yellowCounter.innerHTML = value + sign * 1;
    }
  });
}

function editItemName(name) {
  let itemElement = name.parentNode;

  const itemInput = document.createElement("div");
  itemInput.classList.add("product_name_form");
  itemInput.innerHTML = `
    <form>
      <input type="text" id="set_item_name" name="update"/>
    </form>
  `;

  function saveUpdatedName() {
    let input = document.getElementById("set_item_name");
    console.log(input);
    const newName = document.createElement("div");
    newName.setAttribute("class", "not_bought_product_name");
    newName.addEventListener("focusout", function () {
      editItemName(this);
    });
    newName.addEventListener("click", function () {
      editItemName(this);
    });
    newName.innerHTML = `
      <p>${input.value}</p>
    `;
    itemElement.replaceChild(newName, input);
  }

  itemInput.addEventListener("click", function () {
    saveUpdatedName();
  });

  const currentItemName = itemElement.querySelector(".not_bought_product_name");
  itemElement.replaceChild(itemInput, currentItemName);
}
