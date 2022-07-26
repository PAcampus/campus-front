const login = async (email, password) => {
    try {
        const response = await fetch('http://localhost:8080/authentication/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const auth_data = await response.json();
        const user_id = auth_data.userId;
        const user_token = auth_data.userToken;
        sessionStorage.setItem('user_id', user_id);
        sessionStorage.setItem('user_token', user_token);

        return Promise.resolve();

    } catch (e) {
        return Promise.reject(e);
    }
}

const register = async (name, last_name, email, password, address, phoneNumber) => {
    try {
        const response = await fetch('http://localhost:8080/authentication/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                last_name: last_name,
                address: address,
                email: email,
                password: password,
                phone_number: phoneNumber
            })
        });

        return Promise.resolve();

    } catch (e) {
        return Promise.reject(e);
    }
}

const logout = () => {
    if(isLoggedIn) {
        document.querySelectorAll('#username').innerText = "Zaloguj się!";
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('user_token');
    }
    else {
        alert('Musisz się najpierw zalogować!');
    }
}

const isLoggedIn = () => {
    return sessionStorage.getItem('user_id') != null;
}

const performLogin = () => {
    const email = document.querySelector('#usernameInput').value;
    const password = document.querySelector('#passwordInput').value;

    login(email, password)
        .then( data => {
            location.href = 'index.html';
        } )
        .catch( err => {
            console.error(JSON.stringify(err));
        });
    return false;
}

const performRegister = () => {
    const name = document.querySelector('#nameInput').value;
    const last_name = document.querySelector('#lastNameInput').value;
    const email = document.querySelector('#emailInput').value;
    const password = document.querySelector('#passwordInput').value;
    const address = document.querySelector('#addressInput').value;
    const phoneNumber = document.querySelector('#phoneNumberInput').value;

    register(name, last_name, email, password, address, phoneNumber)
        .then( data => {
            location.href = 'registerSuccess.html';
        } )
        .catch( err => {
            console.error(JSON.stringify(err));
        });
    return false;
}