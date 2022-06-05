//const bodyParser = require("body-parser")
const li = document.querySelectorAll("li");
const listItems = document.querySelectorAll(".listItems");
const checkList = document.querySelectorAll(".checkList");
// console.log(`these are the spans ${listItems[2].innerText} `)
// console.log(`these are the check spans ${checkList.innerText} `)

const clearAllBtn = document.getElementById("clearBtn");
const clearCrossedBtn = document.getElementById("clearCrossed");
// const listCount = document.getElementById('listCount')

//     let count = document.querySelectorAll('.notcrossed').length
//     listCount.innerText = count
// }
//     let nc = document.querySelectorAll('.notcrossed').length

//     listCount.innerText = nc
// }

function addAndRemoveStrikethrough() {
  li.forEach((element) => {
    let items = element.childNodes[1]; //all of the spans
    let checkedOff = element.childNodes[3].innerText; //all of the spans with checked
    //console.log(checkedOff == 'no')
    //console.log(element.childNodes[1].style.color = 'red')
    //checkedOff.style.color = 'red'
    if (checkedOff == "yes") {
      items.style.textDecoration = "line-through";
      items.style.color = "gray";
    } else if (checkedOff == "no") {
      items.style.textDecoration = "none";
      items.style.color = "black";
    }
  });
}

addAndRemoveStrikethrough();

Array.from(listItems).forEach(function (element) {
  element.addEventListener("click", function () {
    const item = this.parentNode.childNodes[1].innerText; //todo items
    const checkedOff = this.parentNode.childNodes[3].innerText; //checkedOff yes or no's
    console.log(`here ${checkedOff}`);
    console.log(this);

    //conditional for adding yes or no to checkedoff property. Goes with 2 dif PUTS. 
    if (checkedOff == "no") {
      fetch("crossedOut", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: item,
          checkedOff: checkedOff,
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log(data);
          window.location.reload(true);
        });
    } else if (checkedOff == "yes") {
      fetch("notCrossedOut", {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item: item,
          checkedOff: checkedOff,
        }),
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log(data);
          window.location.reload(true);
        });
    } //else statement
  }); //event listener
}); //forEach function

//clear checkedOff:yes list items
clearCrossedBtn.addEventListener("click", (_) => {
  fetch("deleteCrossedOut", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      checkedOff: "yes",
    }),
  }).then(function (response) {
    window.location.reload();
  });
});

clearAllBtn.addEventListener("click", (_) => {
  fetch("deleteAll", {
    method: "delete",
  }).then(function (response) {
    window.location.reload();
  });
});
