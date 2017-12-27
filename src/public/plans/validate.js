function validate() {
    valid = true;

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

    //To do: Validate other forms
    /*
        if (document. < form name > . < string input > .value == "") {
            //To do: Display error on the DOM
            valid = false;
        }

        if (document. < form name > . < check box array > .checked == false) {
            //To do: Display error on the DOM
            valid = false;
        }

        

        if (document. < form name > . < check box > .checked == false) {
            //To do: Display error on the DOM
            valid = false;
        }*/

    return valid;
}
