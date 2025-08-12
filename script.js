const inputName = document.getElementById('itemName');
const inputPrice = document.getElementById('itemPrice');
const inputQuantity = document.getElementById('itemQuantity');
const inputUnit = document.getElementById('itemUnit');
const inputImage = document.getElementById('itemImage');
const list = document.getElementById('shoppingList');

const scanBtn = document.getElementById('scanBarcodeBtn');
const qrReader = document.getElementById('qr-reader');
let html5QrcodeScanner;

window.onload = function() {
  let savedList = JSON.parse(localStorage.getItem('shoppingList')) || [];
  savedList.forEach(item => addItemToDOM(item));
};

function addItem() {
  const name = inputName.value.trim();
  const price = parseFloat(inputPrice.value);
  const quantity = parseInt(inputQuantity.value);
  const unit = inputUnit.value;
  const file = inputImage.files[0];

  if (!name) {
    alert('الرجاء إدخال اسم المنتج');
    return;
  }
  if (isNaN(price) || price < 0) {
    alert('الرجاء إدخال سعر صحيح');
    return;
  }
  if (isNaN(quantity) || quantity <= 0) {
    alert('الرجاء إدخال كمية صحيحة');
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageDataUrl = e.target.result;
      const newItem = { name, price, quantity, unit, image: imageDataUrl };
      addItemToDOM(newItem);
      saveItem(newItem);
      clearInputs();
    };
    reader.readAsDataURL(file);
  } else {
    const newItem = { name, price, quantity, unit, image: null };
    addItemToDOM(newItem);
    saveItem(newItem);
    clearInputs();
  }
}

function clearInputs() {
  inputName.value = '';
  inputPrice.value = '';
  inputQuantity.value = '';
  inputUnit.value = 'قطعة';
  inputImage.value = '';
}

function addItemToDOM(item) {
  const li = document.createElement('li');

  const infoDiv = document.createElement('div');
  infoDiv.className = 'item-info';

  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.style.cursor = 'pointer';
    img.onclick = function() {
      showPopup(item.image, item.name);
    };
    infoDiv.appendChild(img);
  }

  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'item-details';

  const nameElem = document.createElement('div');
  nameElem.textContent = `المنتج: ${item.name}`;

  const priceElem = document.createElement('div');
  priceElem.textContent = `السعر: ${item.price.toFixed(2)} درهم`;

  const quantityElem = document.createElement('div');
  quantityElem.textContent = `الكمية: ${item.quantity} ${item.unit}`;

  detailsDiv.appendChild(nameElem);
  detailsDiv.appendChild(priceElem);
  detailsDiv.appendChild(quantityElem);

  infoDiv.appendChild(detailsDiv);
  li.appendChild(infoDiv);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'حذف';
  deleteBtn.onclick = function() {
    list.removeChild(li);
    removeItem(item);
  };
  li.appendChild(deleteBtn);

  list.appendChild(li);
}

// حفظ في التخزين المحلي
function saveItem(item) {
  let savedList = JSON.parse(localStorage.getItem('shoppingList')) || [];
  savedList.push(item);
  localStorage.setItem('shoppingList', JSON.stringify(savedList));
}

// إزالة من التخزين المحلي
function removeItem(item) {
  let savedList = JSON.parse(localStorage.getItem('shoppingList')) || [];
  savedList = savedList.filter(i => !(i.name === item.name && i.price === item.price && i.quantity === item.quantity && i.unit === item.unit && i.image === item.image));
  localStorage.setItem('shoppingList', JSON.stringify(savedList));
}

// --- بوب أب الصورة ---
const popup = document.getElementById('imagePopup');
const popupImg = document.getElementById('popupImage');
const closeBtn = document.querySelector('.close');

function showPopup(imageSrc, altText) {
  popup.style.display = 'block';
  popupImg.src = imageSrc;
  popupImg.alt = altText;
}

closeBtn.onclick = function() {
  popup.style.display = 'none';
};

popup.onclick = function(event) {
  if (event.target === popup) {
    popup.style.display = 'none';
  }
};

// --- مسح باركود ---

scanBtn.onclick = () => {
  if (qrReader.style.display === "none") {
    qrReader.style.display = "block";
    startScanner();
   
