//SENATORS JSON

let params = new URL(document.location).searchParams;
let chamber = params.get("chamber");
let jsonSenators;

if (chamber === "senate") {
  fetch("./assets/scr/congress.json")
    .then((response) => response.json())
    .then((data) => {
      (jsonSenators = data[0].senate[1].members), fulltabla();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
} else {
  fetch("./assets/scr/congress.json")
    .then((response) => response.json())
    .then((data) => {
      (jsonSenators = data[1].house[1].members),
        (chamber = "house"),
        fulltabla();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function fulltabla() {
  //congress select item

  let congressP = document.createElement("p");
  let totalR = document.createElement("p");
  let totalD = document.createElement("p");
  let totalI = document.createElement("p");
  congressP.className = "congress";

  congressP.textContent = chamber.toLocaleUpperCase();
  console.log(jsonSenators);
  totalR.textContent =
    "Republicans :" + jsonSenators.filter((x) => x.party === "R").length;
  totalD.textContent =
    "Democrats :" + jsonSenators.filter((x) => x.party === "D").length;
  totalI.textContent =
    "Independents :" + jsonSenators.filter((x) => x.party === "I").length;

  document.querySelector("#congress").append(congressP, totalR, totalD, totalI);

  if (chamber === "house") {
    let congressH2 = document.createElement("h2");
    let congressP = document.createElement("p");

    congressH2.textContent = "Congressmen".toLocaleUpperCase();
    congressP.textContent = 'Loyalty';

    document
      .querySelector("#congressInfo")
      .appendChild(congressH2)
      .appendChild(congressP);
  } else {
    let congressH2 = document.createElement("h2");
    let congressP = document.createElement("p");
    congressH2.textContent = "Senators".toLocaleUpperCase();
    congressP.textContent = 'Loyalty';
    document
      .querySelector("#congressInfo")
      .appendChild(congressH2)
      .appendChild(congressP);
  }

  //STATES JSON
  const jsonStates = {
    AL: "Alabama",
    AK: "Alaska",
    AS: "American Samoa",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    DC: "District Of Columbia",
    FM: "Federated States Of Micronesia",
    FL: "Florida",
    GA: "Georgia",
    GU: "Guam",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MH: "Marshall Islands",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    MP: "Northern Mariana Islands",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PW: "Palau",
    PA: "Pennsylvania",
    PR: "Puerto Rico",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VI: "Virgin Islands",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
  };

  //checkbox

  let jsonTabla = jsonSenators;
  let jsonTablaState = [];
  let jsonTablaStateFilter = [""];

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
          jsonTabla = jsonSenators.filter(
            (x) => x.party === checkBox.toString()
          );
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

  document.getElementById("dropdownbtn").onclick = function () {
    //Delete DropDown
    const dropdownbtn = document.querySelector("#dropdown");
    dropdownbtn.innerHTML = " ";

    // button "all states"
    let buttonAllStates = document.createElement("button");
    buttonAllStates.value = "all";
    buttonAllStates.className = "dropdownoption";
    let aAllStates = document.createElement("a");
    aAllStates.appendChild(document.createTextNode("All States"));
    document
      .querySelector("#dropdown")
      .appendChild(buttonAllStates)
      .appendChild(aAllStates);
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
    dropDownOptionFunction();
  };

  //DESPLEGABLE OPTION
  function dropDownOptionFunction() {
    const dropdownoption = document.querySelectorAll(".dropdownoption");
    dropdownoption.forEach((button) => {
      button.addEventListener("click", function (event) {
        jsonTablaStateFilter = button.value;
        generate_table();
      });
    });
  }

  //TABLE
  const headerItems = [
    "Name",
    "Party",
    "State",
    "Votes With Party %",
    "votes Against Party %",
  ];
  const senatorItems = [
    "first_name",
    "party",
    "state",
    "votes_with_party_pct",
    "votes_against_party_pct",
  ];

  function generate_table() {
    const deleteTable = document.querySelector("#tabla");
    deleteTable.innerHTML = " ";

    if (jsonTablaStateFilter != "" && jsonTablaStateFilter != "all") {
      jsonTablaState = jsonTabla.filter(
        (x) => x.state === jsonTablaStateFilter
      );
    } else {
      jsonTablaState = jsonTabla;
    }

    jsonTablaState = jsonTablaState.sort(
      (y, x) => x.votes_against_party_pct - y.votes_against_party_pct
    );

    // Crea un elemento <table> y un elemento <tbody>
    const tabla = document.createElement("table");
    tabla.className = "table table-striped table-bordered";
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
}
