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

  // ===========================================================================

  if (localStorage.getItem('myTable') !== undefined && localStorage.getItem('myTable') !== null) {
    console.log("есть стораж");
    document.querySelector('.wrapper-table').innerHTML = localStorage.getItem('myTable');
    document.querySelector('.clear-btn').style.display = 'block'
  } else if (1) {
    document
      .querySelector(".wrapper-table")
      .appendChild(makeTable(tableHead, myBase));
  };





  const table = document.querySelector(".my_table");
  let headTable = table.querySelectorAll("th");
  let tableBody = Array.from(table.rows).slice(1);
  let direction = "";

  headTable.forEach(function (element, index) {
    element.addEventListener('click', function () {
      if (document.querySelector('.edit') === null) {
        sorted(index);
      }

    });
  });


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


  // ===========================================================================
  let bodyTable = table.querySelectorAll("td");
  let editButtons = document.querySelector('.edit_btns');
  const textArea = document.createElement('textarea');
  const attrName = "data-default";


  bodyTable.forEach(function (element, index) {
    element.addEventListener('click', function (event) {
      // console.log(event.target, index);
      if (document.querySelector('.edit') === null) {
        console.log('click 1');
        redactElemTd(element)
      }
    }, { capture: true })
  })

  function redactElemTd(elem) {
    console.log('click 1.111');
    console.log(elem);

    elem.classList.add('edit');
    elem.setAttribute(attrName, elem.textContent);

    let data = elem.innerHTML
    textArea.value = data;

    elem.innerHTML = '';
    elem.appendChild(textArea);
    textArea.focus();
    elem.appendChild(editButtons);
    editButtons.style.display = 'block';

    document.querySelector('.edit_btn-ok').addEventListener('click', function () {
      console.log('click ok');
      console.log(elem);
      elem.innerHTML = textArea.value
      delEditClass()
    }, { once: true })

    document.querySelector('.edit_btn-cancel').addEventListener('click', function () {
      console.log('click cancel');
      console.log(elem);
      debugger
      elem.innerHTML = elem.getAttribute(attrName);
      delEditClass()
    }, { once: true })


  }

  function delEditClass() {
    editButtons.remove();
    document.querySelector('.edit').classList.remove("edit");
    saveLocal();
  }

  function saveLocal() {
    const tableWrap = document.querySelector('.wrapper-table').innerHTML;
    localStorage.setItem('myTable', tableWrap)
  }

  const clearBtn = document.querySelector('.clear-btn');
  clearBtn.addEventListener('click', function () {
    localStorage.removeItem('myTable')
    table.innerHTML = "";
  })

});

