let nameInput = document.querySelector(".name-input");
let priceInput = document.querySelector(".price-input");
let infoInput = document.querySelector(".info-input");
let selectField = document.querySelector(".select-field");
const table = document.querySelector(".table tbody");
const addBtn = document.querySelector(".add-item-btn");
const delBtns = document.querySelectorAll(".delete-button");
const delBtn = document.querySelector(".delete-button"); // check if it is neccesary here
const btnsDiv = document.querySelector(".buttons");
const firstOption = document.querySelector("option");
const editBtn = document.querySelector(".edit-button");
// 4 main inputs from top side of the app
const mainInputs = document.querySelectorAll(".input-field");
const categoriesList = document.querySelector(".categories-list");
const categorySettingsBtn = document.querySelector(".category-settings-btn");
const categorySettingsCloseBtn = document.querySelector(".close-clas-edit-btn");
const addCatBtn = document.querySelector(".add-cat-btn");
let summaryCost;

// localStorage.clear();
id = localStorage.getItem("id");

const countPrice = function () {
  let priceCols = document.querySelectorAll(".price");
  summaryCost = 0;
  for (price of priceCols) {
    summaryCost += parseInt(price.innerText);
  }
  document.querySelector(".price-info").textContent = `Łączna cena to ${summaryCost} PLN.`;
};

const initTable = function () {
  for (let i = 1; i <= id; i++) {
    if (typeof localStorage[`${i}`] != "undefined") {
      let newItemParameters = localStorage.getItem(`${i}`).split(",");
      let newTr = document.createElement("tr");
      newTr.setAttribute("id", `${i}`);

      let newItemName = document.createElement("td");
      newItemName.innerText = newItemParameters[0];

      let newItemDescription = document.createElement("td");
      newItemDescription.innerText = newItemParameters[1];

      let newItemPrice = document.createElement("td");
      newItemPrice.innerText = newItemParameters[2];
      newItemPrice.classList.add("price");

      let newItemCategory = document.createElement("td");
      newItemCategory.innerText = newItemParameters[3];

      let newButtonTd = document.createElement("td");
      newButtonTd.classList.add("buttons");

      let newButton = document.createElement("button");
      newButton.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';

      newButton.classList.add("delete-button");
      newButton.classList.add("button");

      // append children
      table.appendChild(newTr);

      newTr.appendChild(newItemName);
      newTr.appendChild(newItemDescription);
      newTr.appendChild(newItemPrice);
      newTr.appendChild(newItemCategory);
      newTr.appendChild(newButtonTd);

      newButtonTd.appendChild(newButton);

      // listener to the button
      newButton.addEventListener("click", deleteItem);
    }
  }
  countPrice();
};

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
    nameInput.style.border = "2px solid rgba(218, 44, 44, 0.808)";
  }
  if (info == "") {
    infoInput.style.border = "2px solid rgba(218, 44, 44, 0.808)";
  }
  if (priceInput.value.length == 0 || priceInput.value < 0) {
    priceInput.style.border = "2px solid rgba(218, 44, 44, 0.808)";
  }
  if (selectField.value == "noAnswer") {
    selectField.style.border = "2px solid rgba(218, 44, 44, 0.808)";
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
    newPrice.classList.add("price");

    let newCategory = document.createElement("td");
    newCategory.innerText = category;
    newItem.appendChild(newCategory);

    // also create buttons to allow deleting
    // and editing new items
    newBtnsDiv = document.createElement("td");
    newBtnsDiv.classList.add("buttons");

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-button");
    delBtn.classList.add("button");
    delBtn.innerHTML = '<i class="fas fa-times"></i>';
    newBtnsDiv.appendChild(delBtn);

    delBtn.addEventListener("click", deleteItem);

    newItem.appendChild(newBtnsDiv);
    nameInput.value = "";
    priceInput.value = "";
    infoInput.value = "";

    // selectField.value = firstOption;   - not working

    checkIfEmpty();
    localStorage.setItem(`${id}`, [name, info, price, category]);
    localStorage.setItem("id", `${id}`);

    countPrice();
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
    editBtn.style.display = "block";

    editBtn.classList.add("activeEdit");
    // document.querySelector(".fa-square-check").style.height = "100%";
    // append both button and input as a children to target column
    e.target.appendChild(editInput);
    e.target.appendChild(editBtn);

    const editConfirm = function () {
      console.log(e.target);
      e.target.closest("td").innerText = editInput.value;
      editInput.remove();
      editBtn.remove();
    };

    editBtn.addEventListener("click", editConfirm);
    e.target.addEventListener("keypress", function (e) {
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

  let itemId = gParent.getAttribute("id");

  localStorage.removeItem(`${itemId}`);

  gParent.remove();
  checkIfEmpty();

  countPrice();
};

const checkIfEmpty = function () {
  let itemsInCol = table.querySelectorAll("tr");
  if (itemsInCol.length <= 1) {
    document.querySelector(".empty-list-info").classList.add("visible");
    document.querySelector(".price-info").classList.remove("visible");
  } else {
    document.querySelector(".empty-list-info").classList.remove("visible");
    document.querySelector(".price-info").classList.add("visible");
  }
};

const createCategoriesList = function () {
  // clear old list
  let categories = document.querySelectorAll(".categories-list li");
  let categoriesAll = document.querySelectorAll(".select-field option");
  for (category of categories) {
    category.remove();
  }
  for (category of categoriesAll) {
    console.log(category.innerText);
    if (category.value != "noAnswer") {
      newCategory = document.createElement("li");
      newCategory.style.display = "flex";
      newCategory.classList.add("space-btw");

      newCategoryText = document.createElement("p");
      newCategoryText.innerText = category.innerText;

      newCategoryButton = document.createElement("button");
      newCategoryButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      newCategoryButton.classList.add("delete-category");
      newCategoryButton.classList.add("button");
      newCategoryButton.addEventListener("click", deleteCategory);

      newCategory.appendChild(newCategoryText);
      newCategory.appendChild(newCategoryButton);
      categoriesList.appendChild(newCategory);
    }
  }
};
const deleteCategory = function (e) {
  let liToDel = e.target.closest("li");

  textInside = e.target.closest("button").previousSibling.innerText;
  console.log(textInside);

  liToDel.remove();

  optionToDel = document.querySelector(`[value ='${textInside}'`);
  optionToDel.remove();

  // document.querySelector(".category-settings-div").classList.toggle("active");
};

const expandCategoriesSettings = function () {
  createCategoriesList();
  document.querySelector(".category-settings-div").classList.toggle("active");
};

const addNewCat = function () {
  let newCatInput = document.querySelector(".new-cat-input");
  let newCatText = newCatInput.value;
  let newCatLi = document.createElement("li");
  let newP = document.createElement("p");
  newP.innerText = newCatText;

  const newButton = document.createElement("button");
  newButton.classList.add("delete-category");
  newButton.classList.add("button");
  newButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

  newCatLi.classList.add("space-btw");
  newCatLi.classList.add("flex");

  newCat = document.createElement("option");
  newCat.value = newCatText;
  newCat.innerText = newCatText;

  newCatLi.appendChild(newP);
  newCatLi.appendChild(newButton);
  categoriesList.appendChild(newCatLi);

  selectField.appendChild(newCat);

  newButton.addEventListener("click", deleteCategory);
  newCatInput.value = "";
};

const closeCatEdit = function () {
  document.querySelector(".category-settings-div").classList.remove("active");
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
categorySettingsBtn.addEventListener("click", expandCategoriesSettings);
addCatBtn.addEventListener("click", addNewCat);
categorySettingsCloseBtn.addEventListener("click", closeCatEdit);
// table.addEventListener("click", choseItem);

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

// starting functions
initTable();
checkIfEmpty();
countPrice();
