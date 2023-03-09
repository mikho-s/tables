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



  // создание таблицы по клику, но не совсем получается
  // const createTable = document.querySelector('.show');
  // createTable.addEventListener('click', function () {
  //   console.log(table);
  //   console.log(table !== null);

  //   if (table == undefined || table !== null) {

  //     console.log("ЕСТЬ ТАБЛИЦА");
  //     console.log(table);
  //     showtable()
  //   }
  // })
  // function showtable() {
  //   document
  //     .querySelector(".wrapper-table")
  //     .appendChild(makeTable(tableHead, myBase));
  // }




  document
    .querySelector(".wrapper-table")
    .appendChild(makeTable(tableHead, myBase));

  // ===========================================================================


  const table = document.querySelector(".my_table");
  let headTable = table.querySelectorAll("th");
  let tableBody = Array.from(table.rows).slice(1);
  let direction = "";


  // сортировка айди отдельно указана для столбца 0 - где нужна сортировка не как у строк
  // но наверное правильнее через дата атрибут ? но т.к. таблицу мы создаем через джс а не через ХТМЛ
  //  то я даже пока хз как вписать в нужные строки дата атрибут. пока проще просто указать индекс необхомых строк

  function sorted(index) {
    console.log("sorted activate");
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
  let editButton = document.querySelector('.edit_btns');


  function redactElemTd(elem) {
    elem.classList.add('edit');
    let data = elem.innerHTML
    const textArea = document.createElement('textarea');
    textArea.value = data;

    elem.innerHTML = '';
    elem.appendChild(textArea);
    textArea.focus();
    elem.appendChild(editButton);
    editButton.style.display = 'block';

    // document.querySelector('.edit_btns').addEventListener('click', function (event) {
    document.addEventListener('click', function (event) {
      const targetItem = event.target;
      if (targetItem.classList.contains('edit_btn-ok')) {
        elem.innerHTML = textArea.value
        delEditClass();
        console.log(" какого х оно візівается");

      } else if (targetItem.classList.contains('edit_btn-cancel')) {
        elem.innerHTML = data
        console.log(" какого х оно візівается");
        // работает не коректно 
        delEditClass();
      }
    });
  }

  function delEditClass() {
    editButton.remove();

    if (document.querySelector('.edit')) {
      document.querySelector('.edit').classList.remove("edit");
    }
    // document.querySelector('.edit').classList.remove("edit");
    saveLocal();
  }


  function saveLocal() {
    const tableWrap = document.querySelector('.wrapper-table').innerHTML;
    localStorage.setItem('myTable', tableWrap);
  };

  // ===========================================================================


  if (localStorage.getItem('myTable') !== undefined && localStorage.getItem('myTable') !== null) {
    document.querySelector('.wrapper-table').innerHTML = localStorage.getItem('myTable');
    document.querySelector('.clear-btn').style.display = 'block'
  }

  const clearBtn = document.querySelector('.clear-btn');
  clearBtn.addEventListener('click', function () {
    localStorage.removeItem('myTable')
    table.innerHTML = "";
  })



  // ниже добавил делегирование, один обработчик , вызывает разные функции 

  // const wrapTable = document.querySelector(".wrapper-table");
  document.addEventListener('click', function (event) {
    let targetItem = event.target;

    if (targetItem.tagName == 'TH' && document.querySelector('.edit') === null) {
      let element = targetItem.innerHTML
      let index1 = tableHead.indexOf(element)
      console.log(index1);
      sorted(index1);
    }
    else if (targetItem.tagName == 'TD' && document.querySelector('.edit') === null) {
      // console.log("WTF");
      redactElemTd(targetItem)
    }


  })

});


