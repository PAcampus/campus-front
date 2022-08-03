const hideElements = () => {
    const elemnts_to_disable = document.querySelectorAll('.enabled');
    elemnts_to_disable.forEach(element => {
        element.classList.add('disabled');
        element.classList.remove('enabled');
    });
}

const showElements = () => {
    const elemnts_to_enabled = document.querySelectorAll('.disabled');
    for (const element of elemnts_to_enabled) {
        element.classList.add('enabled');
        element.classList.remove('disabled');
    }
}

const setUserElement = () => {
    const user_email = sessionStorage.getItem('user_email');
    if(user_email) {
        const user_element = document.querySelector('#user');
        const a_element = document.querySelector('#login');
        if(user_element) {
            user_element.innerText = user_email;
        }
        if(a_element) {
            a_element.href = 'index.html';
        }
    }
}

const isLogged = () => {
    return sessionStorage.getItem('user_id') != null;
}

const performHideOrShow = () => {
    if(!isLogged()) {
        hideElements();
    }
    else {
        setUserElement();
        showElements();
    }
}

performHideOrShow();