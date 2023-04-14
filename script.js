import { appSettings } from "./firebase.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js"

const app = initializeApp(appSettings)
const database = getDatabase(app)
const dbTable = "shoppingList"
const shoppingListinDB = ref(database, dbTable)

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener('click', () => {
    let inputValue = inputFieldEl.value
    push(shoppingListinDB, inputValue)

    clearinputFieldEl()
}
)

onValue(shoppingListinDB, (snapshot) => {

    if (snapshot.exists()) {
        let dbObj = snapshot.val()
        let itemsArray = Object.entries(dbObj)
        shoppingListEl.innerHTML = ""
        for (let i = 0; i < itemsArray.length; i++) {
            appendItemInList(itemsArray[i])
        }
    } else {
        shoppingListEl.innerHTML = "пока в корзине нет ничего"
    }

})


function clearinputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemInList(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    shoppingListEl.append(newEl)

    newEl.addEventListener('dblclick', () => {
        let itemLink = dbTable + "/" + itemID
        let itemLocationInDB = ref(database, itemLink)
        remove(itemLocationInDB)
    })

}