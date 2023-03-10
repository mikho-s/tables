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

  //  получается надо было поднять это выше 
  //  сначала проверяем есть ли стораж или делаем новую таблицу
  if (localStorage.getItem('myTable') !== undefined && localStorage.getItem('myTable') !== null) {
    console.log("есть стораж");
    document.querySelector('.wrapper-table').innerHTML = localStorage.getItem('myTable');
    document.querySelector('.clear-btn').style.display = 'block'
  } else if (1) {
    document
      .querySelector(".wrapper-table")
      .appendChild(makeTable(tableHead, myBase));
  };



  // document
  //   .querySelector(".wrapper-table")
  //   .appendChild(makeTable(tableHead, myBase));

  // ===========================================================================


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


  // ===========================================================================
  let bodyTable = table.querySelectorAll("td");
  let editButtons = document.querySelector('.edit_btns');
  const textArea = document.createElement('textarea');


  // +++++++++++++++++++++__ВАРИАНТ-1___+++++++++++++++++++++++++++++++++++++++++++++++++++++++

  bodyTable.forEach(function (element, index) {
    element.addEventListener('click', function (event) {
      console.log(event.target, index);
      if (document.querySelector('.edit') === null) {
        redactElemTd(element)
      }
    }, { capture: true })
  })

  function redactElemTd(elem) {
    elem.classList.add('edit');
    let data = elem.innerHTML
    textArea.value = data;

    elem.innerHTML = '';
    elem.appendChild(textArea);
    textArea.focus();
    elem.appendChild(editButtons);
    editButtons.style.display = 'block';

    document.querySelector('.edit_btn-ok').addEventListener('click', function () {
      elem.innerHTML = textArea.value
      delEditClass()
    }, { once: true })

    document.querySelector('.edit_btn-cancel').addEventListener('click', function () {
      elem.innerHTML = data
      delEditClass()
    }, { once: true })
  }
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  // ++++++++++++++++++++++___ВАРИАНТ-2_______+++++++++++++++++++++++++++++++++++++

  // bodyTable.forEach(function (element, index) {
  //   element.addEventListener('click', function (event) {
  //     console.log(event.target, index);
  //     if (document.querySelector('.edit') === null) {
  //       redactElemTd(element)
  //     }
  //   }, { capture: true })
  // })
  // function redactElemTd(elem) {
  //   elem.classList.add('edit');
  //   let data = elem.innerHTML
  //   console.log(data);
  //   // console.log(takeData);
  //   textArea.value = data;
  //   elem.innerHTML = '';
  //   elem.appendChild(textArea);
  //   textArea.focus();
  //   elem.appendChild(editButtons);
  //   editButtons.style.display = 'block';

  //   document.querySelector('.edit_btn-ok').addEventListener('click', clickOk)

  //   document.querySelector('.edit_btn-cancel').addEventListener('click', clickCancel)

  // }

  // function clickOk() {
  //   let element = document.querySelector('.edit')
  //   element.innerHTML = textArea.value
  //   delEditClass()
  // }
  // function clickCancel() {
  //   let element = document.querySelector('.edit')
  //   element.innerHTML = data
  //   delEditClass()
  // }
  // // document.querySelector('.edit_btn-ok').removeEventListener('click', clickOk)

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  function delEditClass() {
    editButtons.remove();
    //  При втором измении тут вылетает ошибка, 
    // но продолжает работать (после найстройки стоража не вылетает но и не меняется)
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


