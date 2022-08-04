const getOrders = () => {
    const userToken = sessionStorage.getItem('user_token');
    return new Promise( (resolve, reject) => {
        fetch('http://localhost:8080/api/v1/orderproduct/user',{
            headers:{
                'Authorization' : userToken
            }
        })
            .then( async response => {
                const orderproducts = await response.json();
                resolve(orderproducts);
            })
            .catch( error => {
                console.debug('[debug] ERROR');
                console.warn(JSON.stringify(error));
                reject(error);
            });
    })
}

const renderOrders = (orderproductsMap,orders) => {
    const orders_element = document.querySelector('.orders');
    if(orders_element) {
        orders.forEach(order => {
            orders_element.innerHTML += `
            <div class="order" id=order${order.id}>
                <h3 class="orderproduct__header">Zamówienie z dnia: ${order.createdAt}</h3>
                </div>
            `;
            const order_element = document.querySelector(`#order${order.id}`);
            addOrderProducts(orderproductsMap, order.id, order_element);
        });
    }
}

const addOrderProducts = (orderproductsMap, orderId, order_element) => {
    // console.log(orderId,orderproductsMap.get(orderId))
    let orderproducts = orderproductsMap.get(orderId);
    if(Array.isArray(orderproducts)) {
        orderproducts = Array.from(orderproducts);
        orderproducts.forEach(orderproduct => {
            order_element.innerHTML +=`
            <div class="orderproduct" id="orderproduct${orderproduct.id}">
                <img src="../img/${orderproduct.image.path}" class="orderproduct__img">
                <p class="orderproduct__text">${orderproduct.name}</p>
                <p class="orderproduct__text">${orderproduct.description}</p>
                <p class="orderproduct__text">${orderproduct.addedAt}</p>
            </div>  
            `
        });
    }
    else {
        order_element.innerHTML +=`
        <div class="orderproduct" id="orderproduct${orderproducts.id}">
            <img src="../img/${orderproducts.image.path}" class="orderproduct__img">
            <p class="orderproduct__text">${orderproducts.name}</p>
            <p class="orderproduct__text">${orderproducts.description}</p>
            <p class="orderproduct__text">${orderproducts.addedAt}</p>
        </div>  
        `;
    }
    
}

const getOrderProductsMap = (orderproducts) => {
    let tempMap = new Map();
        orderproducts.forEach(orderproduct => {
            // console.warn(orderproduct.product);
           if(tempMap.has(orderproduct.orderId)) {
                tempMap.get(orderproduct.orderId).push(orderproduct.product);
           }
           else {
            // console.log("NEW",orderproduct.orderId, orderproduct.product);
            tempMap.set(orderproduct.orderId, [orderproduct.product]);
           }
        });
    console.log(tempMap);
    return tempMap;
}

const getUniqueOrders = (orders) => {
    let uniqueIds = [];
    const uniqueOrders = orders.filter( element => {
        const isDuplicate = uniqueIds.includes(element.id);
        if(!isDuplicate) {
            uniqueIds.push(element.id);
            return true;
        }
        return false;
    });
    return uniqueOrders;
}

getOrders()
    .then( orderproducts => {
        console.error('wszystkie',orderproducts);
        let orderproductsMap = getOrderProductsMap(orderproducts);
        let ordersTemp = Array.from(orderproducts).map((element) => { return element.order; });
        const orders = getUniqueOrders(ordersTemp);
        // console.log('ORDERS',orders);
        // console.log(orderproductsMap);
        renderOrders(orderproductsMap, orders);
        
    })