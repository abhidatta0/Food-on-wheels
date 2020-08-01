const items = document.querySelector(".items");
const range1 = document.getElementById('pricelow');
const range2 = document.getElementById('pricehigh');
const searchBtn = document.getElementById('search-btn');
const star5 = document.getElementById('5star');
const star4 = document.getElementById('4star');
const star3 = document.getElementById('3star');
const star2 = document.getElementById('2star');
const pricesort = document.getElementById('pricesort');
let sortingOrder = "lth";
let cartCount = document.getElementById("cartCount");

async function getData() {
    const response = await fetch('data.json');
    const responseJson = await response.json();
    return responseJson;
}

let foods = '';
//on page load
function onLoad() {
    getData().then(data => {
        foods = getSortedArray(data, sortingOrder);
        createView(foods)
    });
    updateCartNotification();
}
onLoad();

//card
function createView(dataArray) {
    deleteView();
    dataArray.forEach(function (item) {
        const div = document.createElement('div');
        div.className = "item";
        const imageBox = document.createElement('div');
        imageBox.className = "image-box";
        imageBox.style.backgroundImage = "URL(" + item['Image Url'] + ")";
        imageBox.alt='Food Image';
        const foodName = document.createElement('h3');
        foodName.innerText = item['Display Name'];

        const restaurantName = document.createElement('p');
        restaurantName.innerText = item['Restaurant Name'];

        const price = document.createElement('h3');
        price.innerText = `Rs. ${item.price}`;

        const buttonDiv = document.createElement('div');
        buttonDiv.className = "d-flex";
        const cartButton = document.createElement('button');
        cartButton.innerText = 'Add to cart';
        cartButton.className = 'pointer cb';
        cartButton.style.backgroundColor = 'orange';
        buttonDiv.appendChild(cartButton);
        div.appendChild(imageBox)
        div.appendChild(foodName)
        div.appendChild(restaurantName);
        div.appendChild(price);
        div.appendChild(buttonDiv);
        cartButton.setAttribute("itemId", item.id);
        items.appendChild(div);
    })
    attachClickEvent();
}

//event for "AddToCart" for button
function attachClickEvent() {
    let btnList = document.getElementsByClassName('cb');
    let listLength = btnList.length;
    for (let i = 0; i < listLength; i++) {
        btnList[i].addEventListener("click", addToCart);
    }
}

function addToCart(e) {
    let ele= e.currentTarget;
    let eleItemId = parseInt(ele.getAttribute('itemId'));
    let cartItems = getLocalStorage("items");
    if (!cartItems.includes(eleItemId)) {
        ele.style.backgroundColor = 'green';
        ele.style.color = 'white';
        ele.innerText = 'Added';
        cartItems.push(eleItemId);
        setLocalStorageItem("items", cartItems);
        updateCartNotification();
    }
    else {
        alert("Already added to cart!");
    }
}

function updateCartNotification() {
    let cartItems = getLocalStorage("items") || [];
    cartCount.innerText = '';
    if (cartItems.length > 0) {
        cartCount.innerText = cartItems.length;
        cartCount.className = "cart";
        cartCount.style.display = 'inline';
    }
    else {
        cartCount.style.display = 'none';
    }
}

function deleteView() {
    while (items.lastElementChild) {
        items.removeChild(items.lastElementChild);
    }
}

//Search 
searchBtn.addEventListener('click', search);
let searchedFoods = [];
function search() {
    const value = document.getElementById('search-input').value.toLowerCase();
    //Search in name and tags
    searchedFoods = foods.filter((food) => {
        return (food["Display Name"].toLowerCase().includes(value)) || food.tags.some(t => t.toLowerCase().includes(value))
    });
    console.log(searchedFoods); //this is the array where all fitering and sorting is done
    ratings();
    createView(searchedFoods);

}

//Ratings 
let ratingFoods = [];
[star5, star4, star3, star2].forEach(element => element.addEventListener('change', ratings));
const ratingsArray = [false, false, false, false];
function ratings() {
    if (searchedFoods.length == 0) {
        searchedFoods = getSortedArray(foods, sortingOrder);;
    }
    ratingsArray[0] = star5.checked == true;
    ratingsArray[1] = star4.checked == true;
    ratingsArray[2] = star3.checked == true;
    ratingsArray[3] = star2.checked == true;
    if (ratingsArray.every(rating => rating == false)) {
        createView(searchedFoods);
        return;
    }
    ratingFoods = searchedFoods.filter((food) => {
        return (food.rating == 5 && ratingsArray[0]) || (food.rating == 4 && ratingsArray[1]) ||
            (food.rating == 3 && ratingsArray[2]) || (food.rating == 2 && ratingsArray[3])
    });
    ratingFoods = getSortedArray(ratingFoods, sortingOrder);
    createView(ratingFoods);
}

pricesort.addEventListener('change', function (e) {
    sortingOrder = e.currentTarget.value;
    if (ratingFoods.length == 0) {
        searchedFoods = getSortedArray(foods, sortingOrder);
    } else {
        searchedFoods = getSortedArray(ratingFoods, sortingOrder);
    }
    createView(searchedFoods);
})

function getSortedArray(arry, sort) {
    if (sort === 'htl') {
        arry.sort(function (a, b) {
            const p1 = a.price;
            const p2 = b.price;
            if (p1 > p2) {
                return -1;
            }
            else if (p1 < p2) {
                return 1;
            }
            return 0;
        });
    }
    else if (sort === "lth") {
        arry.sort(function (a, b) {
            const p1 = a.price;
            const p2 = b.price;
            if (p1 < p2) {
                return -1;
            }
            else if (p1 > p2) {
                return 1;
            }
            return 0;
        });
    }
    return arry;
}

//uncheck all checkboxes
function clearAllCheckboxes() {
    [star5, star4, star3, star2].forEach(element => element.checked = false);
}

function resetPriceSort() {
    pricesort.value = "lth";
}

function clear() {
    ratingFoods = [];
    searchedFoods = [];
    resetPriceSort();
    clearAllCheckboxes();
}

//set local storage
function setLocalStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

//get local storage
function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

