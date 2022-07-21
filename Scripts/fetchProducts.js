const getProducts = () => {
    return new Promise( (resolve, reject) => {
        fetch('http://localhost:8080/api/v1/product',{
        })
            .then( async response => {
                const products = await response.json();
                resolve(products);
            })
            .catch( error => {
                console.debug('[debug] ERROR');
                console.warn(JSON.stringify(error));
                reject(error);
            });
    });
}

const renderProducts = (products) => {
    const customGrid = document.querySelector('#MAIN_GRID');

    if(customGrid) {
        products.forEach(product => {
            customGrid.innerHTML += `
            <div class="card" id="${product.id}">
                    <img src="img/Test-logo.png" class="card__img" alt="Zdjęcie produktu"/>
                    <h5 class="card_title">${product.name}</h5>
                    <div class="overlay">
                        <div class="inner-card-controls">
                            <button class="btn details">
                                DETALE
                            </button>
                            <button class="btn">
                                KUP
                            </button>
                        </div>
                    </div>
                </div>
            `
        });
    }
    else {
        throw new Error('Cannot find #MAIN_GRID.');
    }
}

getProducts()
    .then( products => {
        console.log(JSON.stringify(products));
        renderProducts(products);
    })
    .catch( error => {
        console.error(JSON.stringify(error))
    })