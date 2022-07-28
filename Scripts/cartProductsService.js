let cartWithProductsTemp = {
    cart: {
        total: 0
    },
    cartProducts: 
    [
        {productid: 1000, productName: 'nazwa', price:100, amount: 1},
        {productid: 2000, productName: 'nazwa1', price:200, amount: 2},
        {productid: 3000, productName: 'nazwa2', price:300, amount: 3},    
    ]
};

const renderCartWithProducts = () => {
    const cartWithProducts = JSON.parse(sessionStorage.getItem('cartWithProducts'));
    if (cartWithProducts) {
        const cart_element = document.querySelector('#cart')
        cartWithProducts.cartProducts.forEach(product => {
            cart_element.innerHTML += `
                <div class="cart__product">
                    <h5 class="cart__product_text">${product.productName}</h5>
                    <p class="cart__product_text">${product.price} zł</p>
                    <p class="cart__product_text">${product.amount}</p>
                    <button class="cart_btn" id=${product.productid}>X</button>
                </div>
            `
        });
        let total = calculateTotal();
        setTotalElement(total);
    }
    else {
        const temp = {
            cart: {
                total: 0
            },
            cartProducts: 
            []
        };
        sessionStorage.setItem('cartWithProducts', JSON.stringify(temp));
    }
    
}

const setTotalElement = (total) => {
    const total_element = document.querySelector('#total');
    total_element.innerText = total.toString() + " zł";
}

const calculateTotal = () => {
    const cartWithProducts = JSON.parse(sessionStorage.getItem('cartWithProducts'));
    let total = 0;
    
    if (cartWithProducts) {
        cartWithProducts.cartProducts.forEach(product => {
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

const deleteFunction = (id) => {
    const cartWithProducts = JSON.parse(sessionStorage.getItem('cartWithProducts'));
    if(cartWithProducts) {
        // console.log("BEFORE", cartWithProducts);
        let productList = Array.from(cartWithProducts.cartProducts);
        const i = productList.findIndex(element => element.productid === id);
        if( i > -1) {
            let temp = productList[i];
            if(temp.amount > 1){
                temp.amount -= 1;
                productList[i] = temp;
            }
            else {
                productList.splice(i);
            }
        }
        // console.log("AFTER", cartWithProducts);
        cartWithProducts.cartProducts = productList;
        sessionStorage.setItem('cartWithProducts', JSON.stringify(cartWithProducts));
    }
    clearCartElement();
    renderCartWithProducts();
}

const buyCart = async () => {
    const cartWithProducts = JSON.parse(sessionStorage.getItem('cartWithProducts'));
    const user_token = sessionStorage.getItem('user_token');
    try {
        const response = await fetch('http://localhost:8080/api/v1/cartWithProducts/buy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': user_token               
            },
            body: JSON.stringify(cartWithProducts)
        });
        console.log(response);
    } catch (e) {
        return Promise.reject(e);
    }
}

const buyItem = (id, name, price) => {
    console.log(id, name, price);
    let productToAdd = {productid: id, productName: name, price:price, amount: 1};
    if(sessionStorage.getItem('cartWithProducts')) {
        const cartWithProducts = JSON.parse(sessionStorage.getItem('cartWithProducts'));
        console.log("BEFORE",cartWithProducts)
        if(cartWithProducts) {
            let productList = Array.from(cartWithProducts.cartProducts);
            const i = productList.findIndex(element => element.productid === id);
            if( i > -1) {
                let temp = productList[i];
                console.log(i);
                console.log(temp);
                temp.amount += 1;
                productList[i] = temp;
            }
            else {
                productList.push(productToAdd);
            }
            cartWithProducts.cartProducts = productList;
        }
        console.log("AFTER",cartWithProducts);
    sessionStorage.setItem('cartWithProducts', JSON.stringify(cartWithProducts));
    }
    else{
        sessionStorage.setItem('cartWithProducts', JSON.stringify({
            cart: {
                total: 0
            },
            cartProducts: 
            [productToAdd]
        }));
    }
    location.href="cart.html";
}

// sessionStorage.setItem('cartWithProducts', JSON.stringify(cartWithProductsTemp));

renderCartWithProducts();

const cart_btn = document.querySelectorAll('.cart_btn');
cart_btn.forEach(btn => {
    btn.addEventListener('click', function(e) {
        console.log(e.target.id);
        deleteFunction(parseInt(e.target.id));
    })
})

const buyCartBtn = document.querySelector('#buyCart');
buyCartBtn.addEventListener('click', () => {
    buyCart()
        .then(data => {
            sessionStorage.removeItem('cartWithProducts');
            location.href = 'cartBought.html';
        })
});