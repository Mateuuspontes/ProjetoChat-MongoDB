let express = require("express");
let bodyParser = require("body-parser");
let app = express();
let http = require("http").Server(app);
let io = require("socket.io")(http);
let mongoose = require("mongoose");




app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

let Message = mongoose.model('Message', {
    name:String, 
    message: String 
});

mongoose.connect(
    "mongodb+srv://mateuuspontes:1234@messages.i3n2rcf.mongodb.net/?retryWrites=true&w=majority");
    
    let db = mongoose.connection;
    
  
    
    db.on("Error", console.log.bind(console, "Conecction Error"));
    db.once("open", () =>{
        console.log('Sucessfully Conection');
    });
    
    app.get("/messages", (req, res) => {
        Message.find({}, (err, messages) =>{
            res.send(messages)
        })
        
    });
    
    app.delete("/messages", (req, res) => {
        Message.remove({}, (err, messages) =>{
            res.send(messages)
        })
    });
    
    
    app.get("/messages/:user", (req, res)=>{
        let user = req.params.user;
        Message.find({name: user}, (err, messages)=>{
            res.send(messages);
        });
    });
    
    app.post("/messages", async(req, res) =>{
        try {
            let message =new Message(req.body);
            
            let saveMessage = await message.save();
            console.log("Saved");
            
            let censord = await Message.findOne({message: "badword"});
            if (censord) {
            await Message.remove({_id: censord.id });
        }
        else{
            io.emit("message", req.body);
            res.sendStatus(200);
        }

    } catch (error) {
        res.status(500)
        return console.log("error", error)
    } 
    
    finally{
        console.log("Message Posted")
    }
})

io.on('connection', () =>{
    console.log("Usuário Conectado")
})


let server = http.listen(3002, ()=> {
    console.log("Server is Runing on port", server.address().port)
});

//mongodb+srv://mateuuspontes:1234@messages.i3n2rcf.mongodb.net/?retryWrites=true&w=majority

//const origin = window.location.origin