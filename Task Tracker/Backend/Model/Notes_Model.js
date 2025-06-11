//Import the module
import mongoose from "mongoose";
const {Schema} = mongoose;


// Define the notes schema
const NotesSchema = new Schema({
  title: {type: String, required: true},
  creationDate: {type: Date, default: Date.now}
});


// Export the model
const Task = mongoose.model("Notes", NotesSchema);
export default Task;