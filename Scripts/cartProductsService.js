// let cartWithProductsTemp = {
//     cart: {
//         total: 0
//     },
//     cartProducts: 
//     [
//         {productid: 1000, productName: 'nazwa', price:100, amount: 1},
//         {productid: 2000, productName: 'nazwa1', price:200, amount: 2},
//         {productid: 3000, productName: 'nazwa2', price:300, amount: 3},    
//     ]
// };
// sessionStorage.setItem('cartWithProducts', JSON.stringify(cartWithProductsTemp));

const renderCartWithProducts = () => {
    const cartWithProducts = JSON.parse(sessionStorage.getItem('cartWithProducts'));
    if (cartWithProducts) {
        const cart_element = document.querySelector('#cart')
        cartWithProducts.orderProducts.forEach(product => {
            cart_element.innerHTML += `
                <div class="cart__product">
                    <h5 class="cart__product_text">${product.name}</h5>
                    <p class="cart__product_text">${product.price} zł</p>
                    <p class="cart__product_text">${product.amount}</p>
                    <button class="cart_btn" id=${product.id}>X</button>
                </div>
            `
        });
        let total = calculateTotal();
        setTotalElement(total);
    }
    else {
        const temp = {
            cart: {
                cartId: -1,
                total: 0
            },
            orderProducts: 
            []
        };
        sessionStorage.setItem('cartWithProducts', JSON.stringify(temp));
    }
    addEventListeners();
}

const setTotalElement = (total) => {
    const total_element = document.querySelector('#total');
    total_element.innerText = total.toString() + " zł";
}

const calculateTotal = () => {
    const cartWithProducts = JSON.parse(sessionStorage.getItem('cartWithProducts'));
    let total = 0;
    
    if (cartWithProducts) {
        cartWithProducts.orderProducts.forEach(product => {
            total += product.price * product.amount;
        });
    }
    else {
        return 0;
    }
    total = Math.round((total + Number.EPSILON) * 100) / 100

    cartWithProducts.cart.total = total;
    sessionStorage.setItem('cartWithProducts', JSON.stringify(cartWithProducts));
    return total;
}

const clearCartElement = () => {
    const cart_element = document.querySelector('#cart');
    cart_element.innerHTML= `
    <div class="cart__product cart__product_titles">
    <p class="cart__product_text">NAZWA:</p>
    <p class="cart__product_text">CENA:</p>
    <p class="cart__product_text">ILOŚĆ:</p>
    <button class="cart_btn__invisible"></button>
    </div>
    `;
}

const addEventListeners = () => {
    const cart_btn = document.querySelectorAll('.cart_btn');
    cart_btn.forEach(btn => {
        btn.addEventListener('click', function(e) {
            console.log(e.target.id);
            deleteFunction(parseInt(e.target.id));
        })
    })

    const buyCartBtn = document.querySelector('#buyCart');
    buyCartBtn.addEventListener('click', () => {
        buyCartWithProducts()
            .then(data => {
                console.log('poszło');
                sessionStorage.removeItem('cartWithProducts');
                location.href = 'cartBought.html';
            })
            .catch( error => {
                console.error('nie poszło',error);
            });
    });
}

const deleteFunction = (id) => {
    const cartWithProducts = JSON.parse(sessionStorage.getItem('cartWithProducts'));
    if(cartWithProducts) {
        // console.log("BEFORE", cartWithProducts);
        let productList = Array.from(cartWithProducts.orderProducts);
        const i = productList.findIndex(element => element.id === id);
        if( i > -1) {
            let temp = productList[i];
            if(temp.amount > 1){
                temp.amount -= 1;
                productList[i] = temp;
            }
            else {
                console.log(i,productList[i])
                productList.splice(i,1);
                location.href="cart.html";
            }
        }
        // console.log("AFTER", cartWithProducts);
        cartWithProducts.orderProducts = productList;
        sessionStorage.setItem('cartWithProducts', JSON.stringify(cartWithProducts));
    }
    clearCartElement();
    renderCartWithProducts();
}

const buyItem = (id, name, price, description, addedAt ) => {
    let productToAdd = {id: id, name: name, price:price, description: description, addedAt: addedAt, amount: 1};
    if(sessionStorage.getItem('cartWithProducts')) {
        const cartWithProducts = JSON.parse(sessionStorage.getItem('cartWithProducts'));
        // console.log("BEFORE",cartWithProducts)
        if(cartWithProducts) {
            let productList = Array.from(cartWithProducts.orderProducts);
            const i = productList.findIndex(element => element.id === id);
            if( i > -1) {
                let temp = productList[i];
                // console.log(i);
                // console.log(temp);
                temp.amount += 1;
                productList[i] = temp;
            }
            else {
                productList.push(productToAdd);
            }
            cartWithProducts.orderProducts = productList;
        }
        // console.log("AFTER",cartWithProducts);
    sessionStorage.setItem('cartWithProducts', JSON.stringify(cartWithProducts));
    }
    else{
        sessionStorage.setItem('cartWithProducts', JSON.stringify({
            cart: {
                cartId: -1,
                total: 0
            },
            orderProducts: 
            [productToAdd]
        }));
    }
    location.href="cart.html";
}

const getCurrentDateAsString = () => {
    const date = new Date();
    let d = new Date(date);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear();
    return [year, month, day].join('-');
}

const unwrapProducts = (productList) => {
    let outputList = [];
    let dateString = getCurrentDateAsString();
    productList.forEach(element => {
        for(let i=0; i < element.amount; i++) {
            outputList.push({productId:element.id, orderId:-1, createdAt:dateString});
        }
    });
    return Array.from(outputList);
}

const buyCartWithProducts = async () => {
    const cartWithProducts = JSON.parse(sessionStorage.getItem('cartWithProducts'));
    let orderProducts =  unwrapProducts(Array.from(cartWithProducts.orderProducts));
    const userToken = sessionStorage.getItem('user_token');
    
    console.log("cartWithProducts z sesji",cartWithProducts);
    let outputCartWithProducts = {
        cart: {
            cartId: -1,
            total: cartWithProducts.cart.total
            },
        orderProducts: orderProducts
    }
    console.log("cartWithProducts",outputCartWithProducts);
    try {
        const response = await fetch('http://localhost:8080/api/v1/cartWithProducts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': userToken               
                    },
                    body: JSON.stringify(outputCartWithProducts)
                    });
        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
}

renderCartWithProducts();