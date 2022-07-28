const getProducts = () => {
    return new Promise( (resolve, reject) => {
        fetch('http://localhost:8080/api/v1/product')
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
                    <img src="../img/${product.image.path}" class="card__img" alt="Zdjęcie ${product.name}"/>
                    <h4 class="card_title">${product.name}</h4>
                    <div class="overlay">
                        <p class="card_description">${product.description}</p>
                        <div class="inner-card-controls">
                            <a href="product.html?id=${product.id}" class="a__no_style">
                            <button class="btn btn__details">
                                DETALE
                            </button>
                            </a>
                            <button class="btn buyBtn enabled" id=${product.id}>
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
        // console.log(JSON.stringify(products));
        renderProducts(products);
        performHideOrShow();
        const buyBtns = document.querySelectorAll('.buyBtn');
        buyBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const id = parseInt(e.target.id);
                console.log(id);
                let product = Array.from(products).find(element => element.id === id);
                console.log("PRODUKT", product);
                buyItem(product.id, product.name, product.price);
            })
        })
    })
    .catch( error => {
        console.error(JSON.stringify(error))
    })
