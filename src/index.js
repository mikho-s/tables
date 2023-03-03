import './index.css';
import { myBase } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableHead = ["id", "name", "username", "email", "phone", "website"];

  const createTHwithContend = (content = "", elem = "td") => {
    const htmlElem = document.createElement(elem);
    htmlElem.innerText = content;
    return htmlElem;
  };

  function makeHeadTable(arr) {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    arr.forEach((element) => {
      const th = createTHwithContend(element, "th");
      tr.appendChild(th);
    });

    thead.appendChild(tr);

    return thead;
  }

  function makeBodyTable(head, body) {
    const tbody = document.createElement("tbody");

    body.forEach((dataElem) => {
      const tr = document.createElement("tr");

      head.forEach((headEl) => {
        const content = dataElem[headEl] || "";
        const td = createTHwithContend(content, "td");
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    return tbody;
  }

  function makeTable(head, body) {
    const table = document.createElement("table");
    table.classList.add('my_table')
    const thead = makeHeadTable(head);
    const tbody = makeBodyTable(head, body);

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
  }

  document
    .querySelector(".wrapper-table")
    .appendChild(makeTable(tableHead, myBase));

  // ===========================================================================


  const table = document.querySelector(".my_table");
  let headTable = table.querySelectorAll("th");
  let tableBody = Array.from(table.rows).slice(1);
  let direction = "";

  headTable.forEach(function (element, index) {
    element.addEventListener('click', function () {
      sorted(index);
    });
  });

  // сортировка айди отдельно указана для столбца 0 - где нужна сортировка не как у строк
  // но наверное правильнее через дата атрибут ? но т.к. таблицу мы создаем через джс а не через ХТМЛ
  //  то я даже пока хз как вписать в нужные строки дата атрибут. пока проще просто указать индекс необхомых строк

  function sorted(index) {
    let sortedTable;
    if (index == "0") {
      sortedTable = tableBody
        .sort((rowA, rowB) => +(rowA.cells[index].innerHTML) > +(rowB.cells[index].innerHTML) ? 1 : -1);
    } else {
      sortedTable = tableBody
        .sort((rowA, rowB) => rowA.cells[index].innerHTML > rowB.cells[index].innerHTML ? 1 : -1);
    }

    function makeSortTable(sort) {
      table.tBodies[0].prepend(...sort);
    }

    if (direction == "" || direction == "desc") {
      direction = "asc";
      makeSortTable(sortedTable)
    } else {
      let revSorted = sortedTable.reverse();
      makeSortTable(revSorted)
      direction = "desc"
    }
  }

});


