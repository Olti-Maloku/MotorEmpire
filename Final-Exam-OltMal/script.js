let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const products = [
    { id: 1, name: "BMW M4 Competition", price: 23982, imageSrc: "./Images/BMW-car-new-section.png" },
    { id: 2, name: "Mercedes S-Class 570", price: 165170, imageSrc: "./Images/mercedes-new-section.avif" },
    { id: 3, name: "Audi A4 Sedan", price: 89095, imageSrc: "./Images/audi-new-section.avif" },
    { id: 4, name: "Porsche Taycan", price: 120095, imageSrc: "./Images/M4/porsche.png" },
    { id: 5, name: "BMW X5 SUV", price: 12343, imageSrc: "./Images/X5.png" },
    { id: 6, name: "BMW I7 Premium", price: 120095, imageSrc: "./Images/bmw-7.png" },
    { id: 7, name: "BMW M2 Convertible", price: 120095, imageSrc: "./Images/bmw-M2.png" },
    { id: 8, name: "BMW X7 SUV", price: 120095, imageSrc: "./Images/bmw X7.png" },
    { id: 9, name: "BMW X6 M-pack", price: 120095, imageSrc: "./Images/BMW-X6.avif" },
    { id: 10, name: "Mercedes GLE", price: 120095, imageSrc: "./Images/Mercedes-GLE.png" },
    { id: 11, name: "Mercedes SL class", price: 120095, imageSrc: "./Images/SL class mercedes.png" },
    { id: 12, name: "Mercedes EQS Electric", price: 120095, imageSrc: "./Images/Mercedes EQS.png" },
    { id: 13, name: "Mercedes AMG GT", price: 120095, imageSrc: "./Images/Mercedes amg gt.png" },
];


function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (product) {
        
        const existingItem = document.querySelector(`.listCart .item [data-id="${productId}"]`);
        if (existingItem) {
            return;
        }

        
        const cartItem = document.createElement('div');
        cartItem.classList.add('item');
        
        cartItem.innerHTML = `
            <div class="img"><img src="${product.imageSrc}" alt="${product.name}"></div>
            <div class="name">${product.name}</div>
            <div class="price">${product.price.toFixed(2).replace('.', ',')}€</div>
            <div class="remove-item" data-id="${product.id}"><i class="fa-solid fa-trash"></i></div>
        `;

        document.querySelector('.listCart').appendChild(cartItem);
        updateCartTotal();
        updateCartCount(); 
        saveCartToLocalStorage(); 
    }
}


function updateCartTotal() {
    const cartItems = document.querySelectorAll('.listCart .item');
    let subtotal = 0;

    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.price').textContent.replace('€', '').replace(',', '.'));
        subtotal += price;
    });

    const total = subtotal; 
    document.getElementById('Subtotal-price').textContent = subtotal.toFixed(2);
    document.getElementById('totali-price').textContent = total.toFixed(2);
}



function updateCartCount() {
    const cartItemCount = document.querySelectorAll('.listCart .item').length;
    document.querySelector('.cart-count').textContent = cartItemCount;
}


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productId = parseInt(button.closest('.card').getAttribute('data-id'), 10);
        addToCart(productId);
    });
});


document.querySelector('.listCart').addEventListener('click', event => {
    if (event.target.closest('.remove-item')) {
        const itemToRemove = event.target.closest('.item');
        const productId = parseInt(itemToRemove.querySelector('.remove-item').getAttribute('data-id'), 10);

        itemToRemove.remove();
        updateCartTotal();
        updateCartCount(); 
        saveCartToLocalStorage();
    }
});


function saveCartToLocalStorage() {
    const cartItems = [];
    document.querySelectorAll('.listCart .item').forEach(item => {
        const productId = parseInt(item.querySelector('.remove-item').getAttribute('data-id'), 10);
        const priceText = item.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace('€', '').replace(',', '.'));

        cartItems.push({
            id: productId,
            price: price
        });
    });

    localStorage.setItem('cart', JSON.stringify(cartItems));
}


function loadCartFromLocalStorage() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    cartItems.forEach(item => {
        addToCart(item.id);
    });

   
    updateCartCount();
}


updateCartCount(); 
loadCartFromLocalStorage();



// Pjesa e shtuar


let cars = JSON.parse(localStorage.getItem('cars')) || [];

const renderCars = () => {
  const productList = document.getElementById('productList');
  productList.innerHTML = '';

  cars.forEach(car => {
    const carCard = document.createElement('div');
    carCard.classList.add('card');
    
    carCard.innerHTML = `
      <div class="img"><img src="${car.imageSrc}" alt="${car.name}"></div>
      <div class="title"><a>${car.name}</a></div>
      <div class="desc">${car.description}</div>
      <div class="box">
          <div class="price">${car.price}€</div>
          <button class="btn add-to-cart">Add to cart</button>
      </div>
    `;

    productList.appendChild(carCard);
  });
};


renderCars();

document.querySelector('.add-car').addEventListener('click', () => {
  const modelInput = document.getElementById('Model');
  const priceInput = document.getElementById('price');
  const imageInput = document.getElementById('photo');


  if (!modelInput.value || !priceInput.value || !imageInput.value) {
    alert("Please fill in all fields and add a Photo.");
    return; 
  }



  const reader = new FileReader();
  reader.onload = function (e) {
    const newCar = {
      id: cars.length + 1,
      name: modelInput.value,
      price: priceInput.value,
      imageSrc: e.target.result,
      description: "Newly added car"
    };

    cars.push(newCar);
    localStorage.setItem('cars', JSON.stringify(cars));

    renderCars();


    modelInput.value = '';
    priceInput.value = '';
    imageInput.value = '';
  };

  reader.readAsDataURL(imageInput.files[0]);

});