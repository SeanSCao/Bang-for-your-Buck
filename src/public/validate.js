function validateCompare() {
    let valid = true;

    if (document.compare.compare1.value === document.compare.compare2.value) {
        //To do: Display error on the DOM
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Selections Must Be Two Different Plans");

        content.appendChild(text);
        div[0].appendChild(content);

        valid = false;
    }

    return valid;

}

function validateCreate() {
    let valid = true;

    if (document.createForm.title.value == "" || isNaN(document.createForm.budget.value)) {
        //To do: Display error on the DOM
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Please fill out all values in the form");

        content.appendChild(text);
        div[0].appendChild(content);

        valid = false;
    }

    if (document.createForm.budget.value < 1) {
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Budget must be at least 1");

        content.appendChild(text);
        div[0].appendChild(content);

        valid = false;
    }

    return valid;
}


function validateItemDel() {
    let valid = false;
    if (document.itemDel.del) {
        if (document.itemDel.del.length >= 2) {
            for (let i = 0; i < document.itemDel.del.length; i++) {
                if (document.itemDel.del[i].checked == true) {
                    valid = true;
                }
            }
        } else {
            if (document.itemDel.del[0]) {
                if (document.itemDel.del[0].checked == true) {
                    valid = true;
                }
            }
        }
    }

    if (!valid) {
        //To do: Display error on the DOM
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Please check at least one item to delete");

        content.appendChild(text);
        div[0].appendChild(content);
    }

    return valid;
}

function validateNoteDel() {
    let valid = false;

    if (document.noteDel.del) {
        if (document.noteDel.del.length >= 2) {
            for (let i = 0; i < document.noteDel.del.length; i++) {
                if (document.noteDel.del[i].checked == true) {
                    valid = true;
                }
            }
        } else {
            if (document.noteDel.del[0]) {
                if (document.noteDel.del[0].checked == true) {
                    valid = true;
                }
            }
        }
    }
    if (!valid) {
        //To do: Display error on the DOM
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Please check at least one note to delete");

        content.appendChild(text);
        div[0].appendChild(content);
    }

    return valid;
}

function validateItem() {
    let valid = true;

    if (document.itemForm.name.value == "" || isNaN(document.itemForm.newCost.value) || isNaN(document.itemForm.usedCost.value) || isNaN(document.itemForm.quantity.value)) {
        //To do: Display error on the DOM
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Please fill out all values in the form");

        content.appendChild(text);
        div[0].appendChild(content);

        valid = false;
    }

    if (document.itemForm.newCost.value < 1 || document.itemForm.usedCost.value < 1 || document.itemForm.quantity.value < 1) {
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Values must be at least 1");

        content.appendChild(text);
        div[0].appendChild(content);

        valid = false;
    }

    return valid;
}

function validateNote() {
    let valid = true;

    if (document.noteForm.note.value == "") {
        //To do: Display error on the DOM
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Please fill out the note input");

        content.appendChild(text);
        div[0].appendChild(content);

        valid = false;
    }

    return valid;
}

function validateSignup() {
    let valid = true;

    if (document.signup.username.value == "" || document.signup.password.value == "" || document.signup.password2.value == "") {
        //To do: Display error on the DOM
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Please fill out all values in the form");

        content.appendChild(text);
        div[0].appendChild(content);

        valid = false;
    }

    if (document.signup.password.value !== document.signup.password2.value) {
        //To do: Display error on the DOM
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Passwords don't match");

        content.appendChild(text);
        div[0].appendChild(content);

        valid = false;
    }

    return valid;
}

function validateLogin() {
    let valid = true;

    if (document.login.username.value == "" || document.login.password.value == "") {
        //To do: Display error on the DOM
        const div = document.getElementsByClassName("error");

        const content = document.createElement('p');
        content.classList.add('text');

        const text = document.createTextNode("Please fill out all values in the form");

        content.appendChild(text);
        div[0].appendChild(content);

        valid = false;
    }

    return valid;
}
