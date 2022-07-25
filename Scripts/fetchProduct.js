const retrieveProductIdFromURL = () => {
    const query_string = window.location.search;
    const url_params = new URLSearchParams(query_string);
    const product_id = url_params.get('id');
    if (product_id) {
        return product_id;
    }
    throw new Error('Cannot find product id in URL params.')
}

const getProduct = (id) => {
    return new Promise( (resolve, reject) => {
        fetch(`http://localhost:8080/api/v1/product/${id}`)
            .then( async response => {
                const product = await response.json();
                resolve(product);
            })
            .catch( error => {
                console.debug('[debug] ERROR');
                console.warn(JSON.stringify(error));
                reject(error);
            });
    });
}

const setProductInfo = (product) => {
    const title_element = document.querySelector('#title');
    const image_element = document.querySelector('#image')
    const description_element = document.querySelector('#description');
    const price_element = document.querySelector('#price');
    const date_element = document.querySelector('#date');

    title_element.innerText = product.name;
    image_element.src = `../img/${product.image.path}`;
    description_element.innerText = product.description;
    price_element.innerText = product.price + " zł";
    date_element.innerText = product.addedAt;
}

const product_id = retrieveProductIdFromURL();

getProduct(product_id)
    .then( product => {
        console.log(JSON.stringify(product));
        setProductInfo(product);
    })
    .catch( error => {
        console.error(JSON.stringify(error))
    })