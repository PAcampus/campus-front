let orders = [
    {
        orderId:1,
        orderDate: "00-00-0000",
        products:[
            { id: 1, name: "name", description: "desc", createdAt:"00-00-0000", imagePath:"Test-Logo.png"}
        ]
    },

]

const getOrders = () => {
    return new Promise( (resolve, reject) => {
        fetch('http://localhost:8080/api/v1/orderproduct')
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

const renderOrders = (orderproducts) => {
    const orders_element = document.querySelector('#orders');
    if(orders_element) {
        orderproducts.forEach(orderproduct => {
            
        });
    }
}

getOrders()
    .then( orderproducts => {
        renderOrders(orderproducts);
    })