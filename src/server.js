
import http from "http";
import WebSocket from "ws";
import express from "express";
import { handle } from "express/lib/application";

const app = express();
//pug로 view engine 설정
app.set("view engine", "pug");
//express 에 template이 어딨는지 설정
app.set("views", __dirname + "/views");
//public url을 생성해서 유저에게 파일 공유
//user들은 내 서버의 파일들을 다 볼 수 없기 때문에 별도의 공유가 필요하다.
app.use("/public", express.static(__dirname + "/public"));
//home.pug를 render해주는 handler
app.get("/", (req, res)=> res.render("home"));
//사용자가 어떤 url을 사용하던 홈으로 돌아올 수있도록 catchcall
app.get("/*", (req, res) =>res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// express는 http를 다루기 때문에 시작하는 법을 ws 로 하도록 두개의 프로토콜을 합칠거기 때문에 바꿈.
// app.listen(3000, handleListen);

//HTTP SERVER 
//app : requestListener
const server = http.createServer(app);

//WEBSOCKET SERVER
const wss = new WebSocket.Server({ server });
//line 25-28: http서버, websocket서버 둘 다 돌릴 수 있음 
// 같은 서버에서 http, websocket둘다 작동시키는 것 두개가 같은 포트에 있길 원하기 때문에.
// http 서버를 사용하지 않는다면 만들 line25는 없어도돼.


wss.on("connection", (socket)=> {
    console.log("Connected to Browser ✔️");
    //browser tab을 닫았을 때
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (message)=> {
        console.log(message.toString('utf-8'));
    });
    socket.send("hello!!!");
})


// 내 HTTP서버에 접근하기 위해 listen을 하는 거고 http위에 websocket 서버를 만들 수 있도록 한 것.
server.listen(3000, handleListen);

