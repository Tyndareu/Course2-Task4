//SENATORS JSON

let params = new URL(document.location).searchParams;
let chamber = params.get("chamber");
let jsonSenators;
let jsonSenatorsFull;
import { AttStatistics } from "./congressinfo.js";
let Statistics;
const KEY = "QziPqLEQCaI1cI9ngA3NfTu7tUihuBCIYauTHncB";

if (chamber === "senate") {
  fetch("https://api.propublica.org/congress/v1/117/senate/members.json", {
    method: "GET",
    withCredentials: true,
    headers: {
      "X-API-Key": KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      (jsonSenatorsFull = data.results[0].members),
        (Statistics = AttStatistics[0].senateAtt),
        fulltabla();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
} else {
  fetch("https://api.propublica.org/congress/v1/117/house/members.json", {
    method: "GET",
    withCredentials: true,
    headers: {
      "X-API-Key": KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      (jsonSenatorsFull = data.results[0].members),
        (Statistics = AttStatistics[1].houseAtt),
        (chamber = "house"),
        fulltabla();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function fulltabla() {
  //congress select item
  const top = 15;
  let topTen = Math.round((jsonSenatorsFull.length * top) / 100);
  let totalPeople = jsonSenatorsFull.length - 2;

  let congressH2 = document.createElement("h2");
  let congressP = document.createElement("p");

  congressH2.textContent =
    chamber.toLocaleUpperCase() + " - Congressmen".toLocaleUpperCase();

  congressP.textContent =
    `Top ` + top + `% (` + topTen + ` Congressmen) "MISSED VOTES"`;

  document
    .querySelector("#congressInfo")
    .appendChild(congressH2)
    .appendChild(congressP);

  //TABLE 0
  const headerTable0 = ["", "Nº of Reps.", "% Missed Votes  "];
  const statisticsItems = ["1", "2", "3"];

  // tABLE 0 END
  const headerTable1 = [
    "Name",
    "Party",
    "State",
    "Missed Votes",
    "Missed Votes % ⇓",
  ];
  const headerTable2 = [
    "Name",
    "Party",
    "State",
    "Missed Votes",
    "Missed Votes % ⇑",
  ];
  const senatorItems = [
    "first_name",
    "party",
    "state",
    "missed_votes",
    "missed_votes_pct",
  ];

  //Table 0

  function generate_table0() {
    const deleteTable = document.querySelector("#tabla0");
    deleteTable.innerHTML = " ";

    // Crea un elemento <table> y un elemento <tbody>
    const tabla = document.createElement("table");
    tabla.className = "table table-striped table-bordered";
    const tblBody = document.createElement("tbody");

    // Header
    const rowHeader = document.createElement("tr");
    rowHeader.className = "table-header";

    headerTable0.forEach((element) => {
      const cell = document.createElement("td");
      const cellText = document.createTextNode(element);

      cell.appendChild(cellText);
      rowHeader.appendChild(cell);
      // agrega la row al final de la tabla (al final del elemento tblbody)
      tblBody.appendChild(rowHeader);
    });
    // Header End

    // Create cells

    Statistics.forEach((element) => {
      // Crea las rows de la tabla

      const row = document.createElement("tr");
      row.className = "table-row";

      statisticsItems.forEach((element2) => {
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
    document.querySelector("#tabla0").appendChild(tabla);
  }
  //TABLA1
  function generate_table() {
    const deleteTable = document.querySelector("#tabla");
    deleteTable.innerHTML = " ";
    jsonSenators = jsonSenatorsFull
      .sort((y, x) => x.missed_votes_pct - y.missed_votes_pct)
      .slice(0, topTen);

    // Crea un elemento <table> y un elemento <tbody>
    const tabla = document.createElement("table");
    tabla.className = "table table-striped table-bordered";
    const tblBody = document.createElement("tbody");

    // Header
    const rowHeader = document.createElement("tr");
    rowHeader.className = "table-header";

    headerTable1.forEach((element) => {
      const cell = document.createElement("td");
      const cellText = document.createTextNode(element);

      cell.appendChild(cellText);
      rowHeader.appendChild(cell);
      // agrega la row al final de la tabla (al final del elemento tblbody)
      tblBody.appendChild(rowHeader);
    });
    // Header End

    // Create cells
    jsonSenators.forEach((element) => {
      // Crea las rows de la tabla
      if (element.missed_votes) {
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
      }
    });

    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // appends <table> into <body>
    document.querySelector("#tabla").appendChild(tabla);
  }

  //Table 2

  function generate_table2() {
    const deleteTable = document.querySelector("#tabla2");
    deleteTable.innerHTML = " ";

    jsonSenators = jsonSenatorsFull
      .sort((x, y) => x.missed_votes_pct - y.missed_votes_pct)
      .slice(0, topTen);

    // Crea un elemento <table> y un elemento <tbody>
    const tabla = document.createElement("table");
    tabla.className = "table table-striped table-bordered";
    const tblBody = document.createElement("tbody");

    // Header
    const rowHeader = document.createElement("tr");
    rowHeader.className = "table-header";

    headerTable2.forEach((element) => {
      const cell = document.createElement("td");
      const cellText = document.createTextNode(element);

      cell.appendChild(cellText);
      rowHeader.appendChild(cell);
      // agrega la row al final de la tabla (al final del elemento tblbody)
      tblBody.appendChild(rowHeader);
    });
    // Header End

    // Create cells
    jsonSenators.forEach((element) => {
      // Crea las rows de la tabla
      if (element.missed_votes !== null) {
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
      }
    });

    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // appends <table> into <body>
    document.querySelector("#tabla2").appendChild(tabla);
  }
  generate_table0();
  generate_table();
  generate_table2();
}
