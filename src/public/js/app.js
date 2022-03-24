const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

const nickname = document.getElementById("name");
const nameForm = nickname.querySelector("form");

const room = document.getElementById("room");

welcome.hidden = true;
room.hidden = true;

let roomName;

function addMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText=msg;
    ul.append(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value="";
}


function inputRoomName() {
    welcome.hidden=false;
    nickname.hidden=true;
    form.addEventListener("submit", handleRoomSubmit );
}


function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);    
    roomName = input.value
    input.value = "";
}

function showRoom() {
    room.hidden=false;
    form.hidden = true;
    const h3 = room.querySelector("h3");
    h3.innerText = `ROOM ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = nameForm.querySelector("input");
    const h4 = room.querySelector("h4");
    h4.innerText = `USER ${input.value}`;
    socket.emit("nickname", input.value, inputRoomName );
}

// form.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} arrived!`);
});
socket.on("bye", (left) => {
    addMessage(`${left} left :(`);
});

socket.on("new_message", addMessage);

socket.on("room_chane", (rooms)=> {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML="";
    if(rooms.length === 0) {
        roomList.innerHTML = "";
        return;
    }
    rooms.forEach( room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});