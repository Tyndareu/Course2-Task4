//SENATORS JSON

let params = new URL(document.location).searchParams;
let chamber = params.get("chamber")
let congress

if (chamber) {
    if (chamber === 'house') {
        congress = await fetch("./assets/scr/house.json");

    }
    else {
        congress = await fetch("./assets/scr/senate.json");
    }
}
else {
    congress = await fetch("./assets/scr/senate.json")
    chamber='house'}



const jsonSenators = Array.from(await congress.json());

//congress select item

let congressP = document.createElement("p");
congressP.className = "congress";
congressP.textContent = chamber.toLocaleUpperCase()
document.querySelector("#congress").appendChild(congressP)

const h2Senators = "Senators"
const pSenators = "First convened in 1789, the composition and powers of the Senate are established in Article One of the U.S. Constitution. Each state is represented by two senators, regardless of population, who serve staggered six-year terms. The Senate has several exclusive powers not granted to the House, including consenting to treaties as a precondition to their ratification and consenting to or confirming appointments of Cabinet secretaries, federal judges, other federal executive officials, military officers, regulatory officials, ambassadors, and other federal uniformed officers, as well as trial of federal officials impeached by the House." 
const h2Congress = "Congressmen"
const pCongress = "The major power of the House is to pass federal legislation that affects the entire country, although its bills must also be passed by the Senate and further agreed to by the U.S. President before becoming law (unless both the House and Senate re-pass the legislation with a two-thirds majority in each chamber). The House has some exclusive powers: the power to initiate revenue bills, to impeach officials (impeached officials are subsequently tried in the Senate), and to elect the U.S. President in case there is no majority in the Electoral College."
const p2Congress = "Each U.S. state is represented in the House in proportion to its population as measured in the census, but every state is entitled to at least one representative. "

if (chamber === 'house'){
    let congressH2 = document.createElement("h2")
    let congressP =document.createElement("p")
    let congressP2 =document.createElement("p")

    congressH2.textContent = h2Congress.toLocaleUpperCase()
    congressP.textContent = pCongress
    congressP2.textContent = p2Congress
    document.querySelector("#congressInfo").appendChild(congressH2).appendChild(congressP).appendChild(congressP2)
}

else{
    let congressH2 = document.createElement("h2")
    let congressP =document.createElement("p")
    congressH2.textContent = h2Senators.toLocaleUpperCase()
    congressP.textContent = pSenators
    document.querySelector("#congressInfo").appendChild(congressH2).appendChild(congressP)    
}

//STATES JSON
const states = await fetch("https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json");
const jsonStates = await states.json();

//checkbox

let jsonTabla = jsonSenators;
let jsonTablaState = []
let jsonTablaStateFilter = ['']

let checkboxes = Array.from(document.getElementsByClassName("party"));
let checkBox = [];
checkboxes.forEach((element) => {
    element.addEventListener("change", function (event) {
        if (element.checked) {
            checkBox.push(element.value);
        }
        if (!element.checked) {
            checkBox = checkBox.filter((x) => x != element.value);
        }
        let key = checkBox.length;
        switch (key) {
            case 2:
                let push = [];
                checkBox.forEach((element) => {
                    push.push(
                        Array.from(jsonSenators.filter((x) => x.party === element))
                    );
                });
                jsonTabla = push[1].concat(push[0]);
                generate_table();
                break;
            case 1:
                jsonTabla = jsonSenators.filter((x) => x.party === checkBox.toString());
                generate_table();
                break;
            default:
                jsonTabla = jsonSenators;
                generate_table();
                break;
        }
    });
});


//Dropdown States Filter

document.getElementById('dropdownbtn').onclick = function () {
    //Delete DropDown
    const dropdownbtn = document.querySelector("#dropdown");
    dropdownbtn.innerHTML = " ";

    // button "all states"
    let buttonAllStates = document.createElement("button");
    buttonAllStates.value = 'all';
    buttonAllStates.className = "dropdownoption";
    let aAllStates = document.createElement("a");
    aAllStates.appendChild(document.createTextNode('All States'));
    document.querySelector("#dropdown").appendChild(buttonAllStates).appendChild(aAllStates);
    // button all states end

    let states;
    for (const prop in jsonStates) {
        let button = document.createElement("button");
        button.value = prop;
        button.className = "dropdownoption";

        let a = document.createElement("a");
        states = jsonStates[prop];

        a.appendChild(document.createTextNode(states));
        document.querySelector("#dropdown").appendChild(button).appendChild(a);
    }
    dropDownOptionFunction()
}

//DESPLEGABLE OPTION
function dropDownOptionFunction() {
    const dropdownoption = document.querySelectorAll(".dropdownoption");
    dropdownoption.forEach(button => {
        button.addEventListener("click", function (event) {
            jsonTablaStateFilter = button.value
            generate_table()
        });
    })
}

//TABLA
const headerItems = [
    "Name",
    "Party",
    "State",
    "Seniority",
    "Votes with Party"
];
const senatorItems = [
    "first_name",
    "party",
    "state",
    "seniority",
    "votes_with_party_pct",
];

function generate_table() {
    const deleteTable = document.querySelector("#tabla");
    deleteTable.innerHTML = " ";

    if (jsonTablaStateFilter != '' && jsonTablaStateFilter != 'all') {
        jsonTablaState = jsonTabla.filter((x) => x.state === jsonTablaStateFilter)
    }
    else { jsonTablaState = jsonTabla }


    // Crea un elemento <table> y un elemento <tbody>
    const tabla = document.createElement("table");
    tabla.className = "table table-striped table-bordered"
    const tblBody = document.createElement("tbody");

    // Header
    const rowHeader = document.createElement("tr");
    rowHeader.className = "table-header";

    headerItems.forEach((element) => {
        const cell = document.createElement("td");
        const cellText = document.createTextNode(element);

        cell.appendChild(cellText);
        rowHeader.appendChild(cell);
        // agrega la row al final de la tabla (al final del elemento tblbody)
        tblBody.appendChild(rowHeader);
    });
    // Header End

    // Create cells
    jsonTablaState.forEach((element) => {
        // Crea las rows de la tabla
        const row = document.createElement("tr");
        row.className = "table-row";

        senatorItems.forEach((element2) => {
            const cell = document.createElement("td");
            const cellText = document.createTextNode(element[element2]);
            cell.appendChild(cellText);
            row.appendChild(cell);
        });

        // agrega la row al final de la tabla (al final del elemento tblbody)
        tblBody.appendChild(row);
    });

    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // appends <table> into <body>
    document.querySelector("#tabla").appendChild(tabla);
}

generate_table();

