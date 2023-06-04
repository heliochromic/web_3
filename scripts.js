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
          <button type="button" class="delete remove tooltip" data-tooltip="delete" onclick="deleteItem(this)">X</button>
        </div>
      `;

  let newLeftElement = document.createElement("span");
  newLeftElement.classList.add("cell");

  newLeftElement.innerHTML = `          
    <span class="item-name">${inputValue}</span>
    <div class="yellow_counter">1</div>`;

  let container = document.getElementById("left");
  let rightContainer = document.querySelector("#not_done");
  container.appendChild(newElement);
  rightContainer.appendChild(newLeftElement);

  input.value = "";
}

let input = document.querySelector('input[name="search"]');
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission
    addElement(); // Call the addElement function
  }
});

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

function editItemName(element) {
  const itemName = element.querySelector("p").textContent;

  const formDiv = document.createElement("div");
  formDiv.className = "product_name_form";

  const form = document.createElement("form");
  const input = document.createElement("input");
  input.type = "text";
  input.id = "set_item_name";
  form.appendChild(input);
  formDiv.appendChild(form);

  const parentDiv = element.parentElement;
  parentDiv.replaceChild(formDiv, element);
  input.focus();

  input.value = itemName;

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      saveUpdatedName();
    }
  });

  form.addEventListener("focusout", function (event) {
    event.preventDefault(); // Prevent the form from submitting
    saveUpdatedName();
  });

  function saveUpdatedName() {
    const updatedItemName = input.value;

    if (updatedItemName.trim() === "") {
      window.alert("You can't save an empty field!");
      parentDiv.replaceChild(element, formDiv);
      return;
    }

    var elements = document.querySelectorAll("#not_done > span");

    elements.forEach(function (innerElement) {
      var text = innerElement.textContent.trim().split("\n");
      let name = innerElement.querySelector(".item-name");
      console.log(text);
      if (text[0] == itemName) {
        console.log("okie");
        name.innerText = updatedItemName;
      }
    });

    const newDiv = document.createElement("div");
    newDiv.className = "not_bought_product_name";
    newDiv.addEventListener("click", function () {
      editItemName(this);
    });
    const newParagraph = document.createElement("p");
    newParagraph.textContent = updatedItemName;
    newDiv.appendChild(newParagraph);
    parentDiv.replaceChild(newDiv, formDiv);
  }
}

let rightElementItem = function (itemName) {
  var elements = document.querySelectorAll("#not_done > span");

  let matchedElement = null;

  elements.forEach(function (innerElement) {
    let name = innerElement.querySelector(".item-name");
    console.log(name);
    if (name.textContent === itemName) {
      matchedElement = innerElement;
    }
  });

  return matchedElement;
};

function deleteItem(button) {
  let itemBlock = button.closest(".item");
  itemBlock.remove();

  const goodName = itemBlock.querySelector(".not_bought_product_name > p");
  console.log(goodName);
  let rightItemBlock = rightElementItem(goodName.innerText);
  console.log(rightItemBlock);
  rightItemBlock.remove();
}
