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

function showRoom(count) {
    room.hidden=false;
    form.hidden = true;
    const h3 = room.querySelector("h3");
    h3.innerText = `ROOM ${roomName} (${count})`;
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

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `ROOM ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
});
socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `ROOM ${roomName} (${newCount})`;
    addMessage(`${left} left :(`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms)=> {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML="";
    if(rooms.length === 0) {
        roomList.innerHTML = "";
        return;
    }
    console.log(rooms);
    rooms.forEach( room => {
        console.log(room);
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});