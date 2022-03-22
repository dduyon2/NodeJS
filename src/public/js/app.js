//connect frontend to backend
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", ()=> {
    console.log("Connected to Server ✔️");
});

socket.addEventListener("message", (message)=> {
    console.log("Just got this:", message.data, "from the server ");
});
//server가 종료됐을 때
socket.addEventListener("close", () =>{
    console.log("Connected from Server ❌")
});

setTimeout(() => {
    socket.send("hello from the browser!");
}, 10000);