// Import the modules
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import Task from './Model/Notes_Model.js';


// Run the express server
const app = express()
const port = 5000
const connectDB = "mongodb://localhost:27017/Notes" // connect the localhost


// Middleware
app.use(cors());
app.use(express.json()); 


// Database Connection
mongoose.connect(connectDB)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("DataBase Connection Error:", err));



// CREATE Data (save the task)
app.post('/api/save_data', async (req,res) => {
  const data = req.body;
  console.log(req.body);

  try {
    const savedata = new Task({title: data.title});
    await savedata.save();

    res.status(201).json({message: "Data Saved Sucessfully!", savedata})
  } 
  catch (error) {
    console.error("Error Saving Data:", error);
  }
});



// READ Data (fetch the task)
app.get('/api/read_data', async (req,res) => {
  try {
    const get_all_records = await Task.find();
    res.status(200).json({message: "Successfully Fetch All Tasks!", get_all_records});
  } 

  catch (error) {
    console.error("Error Saving Data:",error);
  }
});



// UPDATE Task by ID (edit the task)
app.put('/api/update_data/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title } = req.body;
    
    // return updated task
    const updatedTask = await Task.findByIdAndUpdate(id, { title }, { new: true }); 

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({message: "Task updated successfully", updatedTask});
  } 
  
  catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// DELETE Task by ID (delete the task)
app.delete('/api/delete_data/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({message: "Task not found"});
    }
    res.status(200).json({message: "Task deleted successfully", deletedTask});
  } 
  
  catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({message: "Server error"});
  }
});



// start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});