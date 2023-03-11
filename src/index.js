import "./index.css";
import { myBase } from "./data.js";
const tableHead = ["id", "name", "username", "email", "phone", "website"];

const createTHwithContend = (content = "", elem = "td") => {
  const htmlElem = document.createElement(elem);
  htmlElem.innerText = content;
  return htmlElem;
};

document.addEventListener("DOMContentLoaded", () => {
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
    table.classList.add("my_table");
    const thead = makeHeadTable(head);
    const tbody = makeBodyTable(head, body);

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
  }

  //  получается надо было поднять это выше
  //  сначала проверяем есть ли стораж или делаем новую таблицу
  if (
    localStorage.getItem("myTable") !== undefined &&
    localStorage.getItem("myTable") !== null
  ) {
    console.log("есть стораж");
    document.querySelector(".wrapper-table").innerHTML =
      localStorage.getItem("myTable");
    document.querySelector(".clear-btn").style.display = "block";
  } else if (1) {
    document
      .querySelector(".wrapper-table")
      .appendChild(makeTable(tableHead, myBase));
  }

  // document
  //   .querySelector(".wrapper-table")
  //   .appendChild(makeTable(tableHead, myBase));

  // ===========================================================================

  const table = document.querySelector(".my_table");
  let headTable = table.querySelectorAll("th");
  let tableBody = Array.from(table.rows).slice(1);
  let direction = "";

  headTable.forEach(function (element, index) {
    element.addEventListener("click", function () {
      if (document.querySelector(".edit") === null) {
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
      sortedTable = tableBody.sort((rowA, rowB) =>
        +rowA.cells[index].innerHTML > +rowB.cells[index].innerHTML ? 1 : -1
      );
    } else {
      sortedTable = tableBody.sort((rowA, rowB) =>
        rowA.cells[index].innerHTML > rowB.cells[index].innerHTML ? 1 : -1
      );
    }

    function makeSortTable(sort) {
      table.tBodies[0].prepend(...sort);
    }

    if (direction == "" || direction == "desc") {
      direction = "asc";
      makeSortTable(sortedTable);
    } else {
      let revSorted = sortedTable.reverse();
      makeSortTable(revSorted);
      direction = "desc";
    }
  }

  // ===========================================================================
  let bodyTable = table.querySelectorAll("td");
  let editButtons = document.querySelector(".edit_btns");
  const textArea = document.createElement("textarea");
  const attrName = "data-default";
  // +++++++++++++++++++++__ВАРИАНТ-1___+++++++++++++++++++++++++++++++++++++++++++++++++++++++

  bodyTable.forEach(function (element, index) {
    element.addEventListener(
      "click",
      function (event) {
        console.log(event.target, index);
        if (document.querySelector(".edit") === null) {
          redactElemTd(element);
        }
      },
      { capture: true }
    );
  });

  /** * @param {Event} event  */
  const okHandler = (event) => {
    const { target } = event;
    /** @type {Element} */
    const parent = target.closest(".edit");
    const textArea = parent.querySelector("textarea");
    parent.innerHTML = textArea.value;
    parent.classList.remove("edit");

    saveLocal();
  };

  /** * @param {Event} event  */
  const cancelHandler = (event) => {
    const { target } = event;
    /** @type {Element} */
    const parent = target.closest(".edit");
    parent.innerHTML = parent.getAttribute(attrName);
    parent.classList.remove("edit");

    saveLocal();
  };

  let eventFlag = false;

  function redactElemTd(elem) {
    elem.classList.add("edit");
    elem.setAttribute(attrName, elem.textContent);
    let data = elem.innerHTML;
    textArea.value = data;

    elem.innerHTML = "";
    elem.appendChild(textArea);
    textArea.focus();
    elem.appendChild(editButtons);
    editButtons.style.display = "block";

    if (!eventFlag) {
      document
        .querySelector(".edit_btn-ok")
        .addEventListener("click", okHandler);

      document
        .querySelector(".edit_btn-cancel")
        .addEventListener("click", cancelHandler);
      eventFlag = true;
    }
  }

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  function delEditClass() {
    editButtons.remove();
    //  При втором измении тут вылетает ошибка,
    // но продолжает работать (после найстройки стоража не вылетает но и не меняется)
    document.querySelector(".edit").classList.remove("edit");

    saveLocal();
  }
  function saveLocal() {
    const tableWrap = document.querySelector(".wrapper-table").innerHTML;
    localStorage.setItem("myTable", tableWrap);
  }

  const clearBtn = document.querySelector(".clear-btn");
  clearBtn.addEventListener("click", function () {
    localStorage.removeItem("myTable");
    table.innerHTML = "";
  });
});
