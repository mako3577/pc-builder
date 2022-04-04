let nameInput = document.querySelector(".name-input");
let priceInput = document.querySelector(".price-input");
let infoInput = document.querySelector(".info-input");
let selectField = document.querySelector(".select-field");
const table = document.querySelector(".table tbody");
const addBtn = document.querySelector(".add-item-btn");
const delBtns = document.querySelectorAll(".delete-button");
const delBtn = document.querySelector(".delete-button");
const btnsDiv = document.querySelector(".buttons");
const firstOption = document.querySelector("option");
// 4 main inputs from top side of the app
const mainInputs = document.querySelectorAll(".input-field");
let id = 3;

const checkClick = function (e) {
  // Just testing purposes
  console.log(e.target);
};

const addItem = function () {
  let name = nameInput.value;
  let price = priceInput.value;
  let info = infoInput.value;
  let category = selectField.value;

  // add color border to invalid value in inputs
  if (name == "") {
    nameInput.style.border = "3px solid red";
  }
  if (info == "") {
    infoInput.style.border = "3px solid red";
  }
  if (priceInput.value.length == 0) {
    priceInput.style.border = "3px solid red";
  }
  if (selectField.value == "noAnswer") {
    selectField.style.border = "3px solid red";
  }

  if (
    name != "" &&
    price != "" &&
    info != "" &&
    category != "noAnswer" &&
    price >= 0 &&
    price < 9999999
  ) {
    // increase id to align higher than elements before
    id++;
    // create new tr element which will contain
    // all the inputs as a children
    let newItem = document.createElement("tr");
    newItem.setAttribute("id", `${id}`);
    table.appendChild(newItem);

    let newName = document.createElement("td");
    newName.innerText = name;
    newItem.appendChild(newName);

    let newInfo = document.createElement("td");
    newInfo.innerText = info;
    newItem.appendChild(newInfo);

    let newPrice = document.createElement("td");
    newPrice.innerText = price;
    newItem.appendChild(newPrice);

    let newCategory = document.createElement("td");
    newCategory.innerText = category;
    newItem.appendChild(newCategory);

    // also create buttons to allow deleting
    // and editing new items
    newBtnsDiv = document.createElement("td");
    newBtnsDiv.classList.add("buttons");

    const cloneDelBtn = delBtn.cloneNode("false");
    newBtnsDiv.appendChild(cloneDelBtn);

    cloneDelBtn.addEventListener("click", deleteItem);

    newItem.appendChild(newBtnsDiv);
    nameInput.value = "";
    priceInput.value = "";
    infoInput.value = "";
    // selectField.value = firstOption;   - not working
  }
};

//
// function to edit table items
// to call it, double click table item
const editFunction = function (e) {
  editCancel();
  if (e.target.matches("td")) {
    // e.target is targeted column
    e.target.style.position = "relative";
    // Create input element
    editInput = document.createElement("input");
    // Style input element
    editInput.style.position = "absolute";
    editInput.style.width = "80%";
    editInput.style.height = "100%";
    editInput.style.left = "0";
    editInput.style.top = "0";
    editInput.value = e.target.innerText;
    editInput.classList.add("activeEdit");
    // for price column only numbers can be provided
    if (e.target.matches(".price")) {
      editInput.type = "number";
    }
    // create button to confirm changes
    editBtn = document.createElement("button");
    editBtn.style.position = "absolute";
    editBtn.style.width = "20%";
    editBtn.style.height = "100%";
    editBtn.style.left = "80%";
    editBtn.style.top = "0";
    editBtn.classList.add("activeEdit");
    // append both button and input as a children to target column
    e.target.appendChild(editInput);
    e.target.appendChild(editBtn);

    const editConfirm = function () {
      e.target.innerText = editInput.value;
      editInput.remove();
      editBtn.remove();
    };

    editBtn.addEventListener("click", editConfirm);
    document.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        editConfirm();
      }
    });
  }
};

const editCancel = function () {
  // remove old input fields and buttons
  oldInput = document.querySelectorAll(".activeEdit");
  for (item of oldInput) {
    item.remove();
  }
};

const deleteItem = function (e) {
  // gParent = e.target.parentElement.parentElement; when clicked right in the icon inside the button
  // it was deleting button td instead of all the record

  gParent = e.target.closest("tr");
  console.log(gParent);
  gParent.remove();
};

//
// //////////////
// Starting loops
// //////////////
//

// clear red-border warning that appears
// when invalid data is in input fields
// after input field is clicked
for (input of mainInputs) {
  input.addEventListener("click", function (e) {
    for (input of mainInputs) {
      e.target.style.border = "";
    }
  });
}

///////////////////////
// Event listeners
// ////////////////////
//
addBtn.addEventListener("click", addItem);
table.addEventListener("dblclick", checkClick);
table.addEventListener("dblclick", editFunction);
for (let delBtn of delBtns) {
  delBtn.addEventListener("click", deleteItem);
}

// this listener construction allow user to cancel
// editing column just by clicking somewhere else
document.addEventListener("click", function (e) {
  if (e.target.matches(".activeEdit")) {
    return;
  } else editCancel();
});
