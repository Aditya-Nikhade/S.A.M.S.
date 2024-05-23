import mongoose from "mongoose";
import express from "express";
import moneyModel from "./model/moneyPermission.js"
import User from "./model/userModel.js";
import cors from "cors";
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import moneyForm from "./model/moneyPermission.js";
import classesPermission from "./model/classesPermission.js";
import calendarFormat from "./model/calendarModel.js";
import locationPermission from "./model/locationPermission.js";

const app = express();
app.use(express.json());
// Example setting HTTP headers in an Express.js app

const jwtSecret = "dfshwbfewjuh3kqbj12";

app.use(cors({
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
    optionsSuccessStatus: 204,
}));

app.options('*', cors());

mongoose.connect("mongodb+srv://adchamp123:MRWsMO2zxcVgjX2W@clustersams.3trbp3k.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSAMS")

mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB");
})
mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

app.get('/test',(req,res)=>{
    res.json("Chal raha h");
})


app.post('/user/money/submitted', async(req,res)=>{
    try {
        const newMessage = {
            description:req.body?.desc,
            date:req.body?.date,
            money:req.body?.number,
            sender:req.body?.nameofUser,
            reciever:req.body?.recipient,
            origin: req.body?.origin
        }

        const moneyMessage = await moneyModel.create(newMessage);
        return res.status(201).send(moneyMessage);

    } catch (error) {
        res.status(400).json("Sab na changa si");
    }
})
app.post("/classes/submitted",async(req,res)=>{
    
    try {
        const msg = {
            reason: req.body?.reason,
            day: req.body?.date,
            fromTime: req.body?.fromTime,
            toTime: req.body?.toTime,
            sender:req.body?.nameofUser,
            reciever:req.body?.recipient,
            origin: req.body?.origin
        }    
        const newClassCancelMsg = await classesPermission.create(msg);
        return res.status(201).send(newClassCancelMsg)

    } catch (error) {
        res.status(400).json('Error in creating class cancel message')
    }
})

app.get('/extuser/money/submitted/:nameuser',async(req,res)=>{
    try {
        const {nameuser} = req.params;//to access it you have to ofc use nameuser and not nameduser because ofc req
        //cha params access karaycha aahe.
        const messages = await moneyModel.find({reciever: nameuser}).sort({createdAt: -1});
        res.status(200).send(messages);
    } catch (error) {
        res.status(400).json("Error extuser")
    }
})

app.get('/extuser/classes/submitted/:nameuser',async(req,res)=>{
    try {
        const {nameuser} = req.params;//to access it you have to ofc use nameuser and not nameduser because ofc req
        //cha params access karaycha aahe.
        const messages = await classesPermission.find({reciever: nameuser}).sort({createdAt: -1});
        res.status(200).send(messages);
    } catch (error) {
        res.status(400).json("Error extuser")
    }
})



app.post('/signup', async (req, res) => {
    const { username, userID, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const createdUser = await User.create({ username, userID, password: hashedPassword });

        Jwt.sign({ IDuser: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) {
                throw err;
            }
            res.cookie('token', token, { httpOnly: true }).status(201).json({
                token,
                id: createdUser._id,
                username: username,
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Signup Error" });
    }
});


app.post('/login', async (req, res) => {
    const { username, userID, password } = req.body;
    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (!passOk) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        Jwt.sign({ IDuser: foundUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) {
                throw err;
            }
            res.cookie('token', token).json({
                token,
                id: foundUser._id,
                username: username
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Login Error" });
    }
});


app.get('/logout',async(req,res)=>{
    try {
        res.cookie('token','',{ sameSite: 'none', secure: true }).json('Ok!');
    } catch (error) {
        console.log("Error in logging out: ",error);
    }//response madhe empty token, means user logged out.
})

app.put('/extuser/money/forward',async(req,res)=>{
    try {
        const {messageID,sender,reciever,newIndex} = req.body;
        
        const updateData = {
            sender: sender,
            reciever: reciever,
            index: newIndex
        }
        console.log(updateData)
        const updatedUser = await moneyForm.findByIdAndUpdate(messageID, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json("Document not found");
        }
        
        res.status(200).json("content madhe problem aahe");
        
    } catch (error) {
        console.log("Forwarding error:",error);
        res.status(400).json("Forwarding error");
    }
})

app.put('/extuser/classes/forward',async(req,res)=>{
    try {
        const {messageID,sender,reciever,newIndex} = req.body;
        
        const updateData = {
            sender: sender,
            reciever: reciever,
            index: newIndex
        }
        console.log(updateData)
        const updatedUser = await classesPermission.findByIdAndUpdate(messageID, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json("Document not found");
        }
        
        res.status(200).json("content madhe problem aahe");
        
    } catch (error) {
        console.log("Forwarding error:",error);
        res.status(400).json("Forwarding error");
    }
})

app.delete('/extuser/money/delete/:messageID',async(req,res)=>{
    const {messageID} = req.params;
    try {
        
        const foundMessage =  await moneyForm.findById(messageID);
        const userToBeFound = foundMessage.origin;
        const useritself = await User.findOne({username:userToBeFound});
        
        if (useritself) {
            // Update the progress.classes property to true
            const updatedUser = await User.updateOne(
              { _id: useritself._id },
              { $set: { 'progress.$[].money': true } }
            );
          
            console.log(`Updated the document`,foundMessage);
          } else {
            console.log('User not found');
          }
        
        

        const deletedDoc = await moneyForm.findByIdAndDelete(messageID);
        

        if(!deletedDoc){
            res.status(404).json("Document not found");
        }
        
        res.status(200).json(userToBeFound);

    } catch (error) {
        res.status(500).json('Internal server error');
    }
})
app.delete('/extuser/classes/delete/:messageID',async(req,res)=>{
    const {messageID} = req.params;
    try {
        const foundMessage =  await classesPermission.findById(messageID);
        const userToBeFound = foundMessage.origin;
        const useritself = await User.findOne({username:userToBeFound});
        
        if (useritself) {
            // Update the progress.classes property to true
            const updatedUser = await User.updateOne(
              { _id: useritself._id },
              { $set: { 'progress.$[].classes': true } }
            );

            const dataCalendar = {
                reason: foundMessage?.reason,
                day: foundMessage?.day,
                fromTime: foundMessage?.fromTime,
                toTime: foundMessage?.toTime,
                origin: foundMessage?.origin
            }

            console.log(`Updated the document`,foundMessage,dataCalendar);
            
            await calendarFormat.create(dataCalendar);

          } else {
            console.log('User not found');
          }


        const deletedDoc = await classesPermission.findByIdAndDelete(messageID);
        if(!deletedDoc){
            res.status(404).json("Document not found");
        }
        
        res.status(200).json(userToBeFound);

    } catch (error) {
        res.status(500).json('Internal server error');
    }
})

app.delete('/extuser/location/delete/:messageID',async(req,res)=>{
    const {messageID} = req.params;
    try {
        const foundMessage =  await locationPermission.findById(messageID);
        const userToBeFound = foundMessage.origin;
        const useritself = await User.findOne({username:userToBeFound});
        
        if (useritself) {
            // Update the progress.classes property to true
            const updatedUser = await User.updateOne(
              { _id: useritself._id },
              { $set: { 'progress.$[].location': true } }
            );

            const dataCalendar = {
                reason: foundMessage?.reason,
                day: foundMessage?.day,
                fromTime: foundMessage?.fromTime,
                toTime: foundMessage?.toTime,
                origin: foundMessage?.origin,
                location: foundMessage?.location
            }

            console.log(`Updated the document`,foundMessage,dataCalendar);
            
            await calendarFormat.create(dataCalendar);

          } else {
            console.log('User not found');
          }


        const deletedDoc = await locationPermission.findByIdAndDelete(messageID);
        if(!deletedDoc){
            res.status(404).json("Document not found");
        }
        
        res.status(200).json(userToBeFound);

    } catch (error) {
        res.status(500).json('Internal server error');
    }
})


app.get('/getstatus',async(req,res)=>{
    try {
        const users = await User.find(
            { username: { $in: ["AarohiHead", "ECellHead"] } },
            { _id: 0,username: 1, progress: 1 } // Projection to include only the 'progress' field
        );
        //single json response mei just string works.
        //but for string, data you have to send it like neeche wala.
        //also yar status tar send karaychach rahta in response.
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
    }
})


app.get('/money/status/:nameofUser',async(req,res)=>{
    const {nameofUser} = req.params;
    try {
        
        const message = await moneyForm.findOne({origin:nameofUser});
        if(message){
            res.status(200).json(message?.index)
        }
        else{
                
                const userstatus = await User.find({username: nameofUser});
                res.status(200).json((userstatus[0].progress[0].money)?(3):(-1))
            
            }
    } catch (error) {
        console.error(error);
    }
})
app.get('/classes/status/:nameofUser',async(req,res)=>{
    const {nameofUser} = req.params;
    try {
    
        const message = await classesPermission.findOne({origin:nameofUser});
        if(message){
            res.status(200).json(message?.index)
        }
        else{
                
                const userstatus = await User.find({username: nameofUser});
                res.status(200).json((userstatus[0].progress[0].classes)?(3):(-1))
            
            }
    } catch (error) {
        console.error(error);
    }
})

app.get('/location/check',async(req,res)=>{
    try {
        const data = await locationPermission.find();
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
    }
})

app.post('/location',async(req,res)=>{
    try {
        const data = req?.body;
        await locationPermission.create(data);
        res.status(201).json("Successfully created");
    } catch (error) {
        console.error("Error adding location to db", error);
    }
})

app.get('/calendar/classes',async(req,res)=>{
    try {
        
        const data = await calendarFormat.find({ location: { $exists: false } });
        res.status(200).json(data);
        
    } catch (error) {
        console.error("The error is: ",error);
    }
})

app.get('/calendar/location',async(req,res)=>{
    try {
        const data = await calendarFormat.find({ location: { $exists: true } });
        res.status(200).json(data);
    } catch (error) {
        console.error("The error is: ",error);
    }
})

app.get("/extuser/location/:nameofUser",async(req,res)=>{
    try {
        const {nameofUser} = req?.params;
        const data = await locationPermission.find({recipient:nameofUser});
        res.status(200).json(data);

    } catch (error) {
        console.error("The error is: ",error);
    }
})

app.post('/validateToken', (req, res) => {
    const { token } = req.body;

    Jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
            return res.status(400).json({ valid: false, message: "Invalid token" });
        }

        try {
            const user = await User.findOne({ _id: decoded.IDuser });
            if (user) {
                res.status(200).json({ valid: true, uniqueID: user._id, nameofUser: user.username });
            } else {
                res.status(400).json({ valid: false, message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ valid: false, message: "Server error" });
        }
    });
});

app.listen(3000,()=>{
    console.log("The server is up and running.")
})