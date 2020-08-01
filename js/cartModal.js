const modalBody = document.querySelector('.modal-body');
//Modal action
var modal = document.getElementById("myModal");
var btn = document.getElementById("cartBtn");
var span = document.getElementsByClassName("close")[0];

//open the modal 
btn.onclick = function() {
  displayCartModal();
}

// close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// when the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function displayCartModal(){
    const cartIds = getLocalStorage("items") || [];
    getData().then(data => {
       let cartItems = [];
       for(let i=0;i<data.length;i++){
           if(cartIds.includes(data[i].id) ){
            cartItems.push(data[i]);
           }
       }
       
       modal.style.display = "block";
       createCartView(cartItems);
    });
}

function createCartView(cartItems=[]){
    if(cartItems.length == 0){
        modalBody.innerText = 'Nothing added to cart!';
        modalBody.style.textAlign = "center";
    }

    cartItems.forEach(item =>{
        const div = document.createElement('div');
        div.className = 'cart-item';
        const displayName = document.createElement('h3');
        displayName.innerHTML = `${item['Display Name']}  <i class="fa fa-trash-o dc pointer" style="color: red;padding: 1%" onClick="deleteFromCart(${item.id})" aria-hidden="true"></i>`;
        const restaurantName = document.createElement('p');
        restaurantName.innerHTML = `from ${item["Restaurant Name"]}`;
        const price = document.createElement('p');
        price.innerHTML = `Rs. ${item.price}`;
        div.appendChild(displayName);
        div.appendChild(restaurantName);
        div.appendChild(price);
        modalBody.appendChild(div);
    });

}

function deleteFromCart(id){
    let cartItems = getLocalStorage("items");
    const index = cartItems.indexOf(id);
    cartItems.splice(index,1);
    setLocalStorageItem('items',cartItems);
    modal.style.display = "none";
    updateCartNotification();
    onLoad();
}

function deleteCartView(){
    modalBody.removeAttribute("style");
    while (modalBody.lastElementChild) {
        modalBody.removeChild(modalBody.lastElementChild);
    }
}