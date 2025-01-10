import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (localStorage.getItem('username') != null) {
    let getmain = document.getElementById('main')
    getmain.hidden = true
    let getnon = document.getElementById('non')
    getnon.hidden = false
    fetchData()
}

let btn = document.getElementById("btn");
if (btn) {
    btn.addEventListener("click", async () => {
        let getInp = document.getElementById("inp");
        if (getInp.value.trim() != '') {
            getUl.innerHTML = "";
            const docRef = await addDoc(collection(db, localStorage.getItem('username')), {
                name: getInp.value,
            });
            fetchData();
            getInp.value = ''
        }
    });
}

let getUl = document.getElementById("ul");

async function fetchData() {
    const q = collection(db, localStorage.getItem('username'));
    const querySnapshot = await getDocs(q);
    getUl.innerHTML = "";
    querySnapshot.forEach((doc) => {
        getUl.innerHTML += `
            <li class="todo-item">${doc.data().name}<div class="todo-actions">
                    <button class="btn btn-warning" onclick="delItem('${doc.id}')"><i class="fas fa-trash-alt"></i></button>
                    <button class="btn btn-danger" onclick="editItem('${doc.id}',this)"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-info" onclick="done(this)"><i class="fas fa-check"></i></button>
                </div>
            </li>`;
    });
}


async function delItem(e) {
    getUl.innerHTML = "";
    await deleteDoc(doc(db, localStorage.getItem('username'), e));
    console.log("Item has been deleted");
    fetchData();
}

async function editItem(e,t) {
    const washingtonRef = doc(db, localStorage.getItem('username'), e);
    let pro = prompt("Enter updated value",t.parentNode.parentNode.firstChild.nodeValue);
    if (pro !== null && pro.trim() !== '') {
        await updateDoc(washingtonRef, {
            name: pro,
        });
        fetchData();
    }
}

function done(e) {
    const todoItem = e.closest('.todo-item');
    todoItem.style.backgroundColor = 'lightgreen';
    const undoneButton = document.createElement("button");
    undoneButton.innerHTML = '<i class="fas fa-undo"></i>';
    undoneButton.className = "btn btn-primary";
    undoneButton.onclick = () => again(todoItem);
    e.replaceWith(undoneButton);
}

function again(todoItem) {
    todoItem.style.backgroundColor = '';
    const doneButton = document.createElement("button");
    doneButton.innerHTML = '<i class="fas fa-check"></i>';
    doneButton.className = "btn btn-info";
    doneButton.onclick = () => done(doneButton);
    todoItem.querySelector('.btn-primary').replaceWith(doneButton);
}

window.delItem = delItem;
window.editItem = editItem;
window.done = done;
window.again = again;


let getName = document.getElementById('saveName')
getName.addEventListener('click', async () => {
    let getinp = document.getElementById('inpName').value
    let check = []
    let flag = true
    const q = collection(db, 'users');
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        check.push(doc.data().username)
    });
    for (var i = 0; i < check.length; i++) {
        if (check[i] == getinp) {
            flag = false
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "This user name is already in use..",
              })
            break;
        }
    }
    if (flag == true) {
        localStorage.setItem('username', getinp)
        const docRef = await addDoc(collection(db, 'users'), {
            username: getinp,
        });
        window.location.reload()
        let getmain = document.getElementById('main')
        getmain.hidden = true
        let getnon = document.getElementById('non')
        getnon.hidden = false
    }
    else if(getinp == ''){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please Enter Your Name..",
          });
    }


})

