import { useState, useEffect } from 'react';
import "./App.css";


function App() {
  // this is for "Entered the task" in input field
  const [inputValue, setInputValue] = useState("");

  // this is for "Add the task" in the database
  const [showInput, setShowInput] = useState(false);

  // this is for "Show the task" from the database
  const [fetchedTasks, setFetchedTasks] = useState([]);

  // this is for "Edit or Delete the task" from the database using Task_ID
  const [checkboxState, setCheckboxState] = useState({});

  // this is for "Update the task" in the database using Task_ID
  const [editModeId, setEditModeId] = useState(null);
  const [editInputValue, setEditInputValue] = useState("");




  // Store the "Entered Value" in setInputValue
  const handleInputValue = (e) => {
    setInputValue(e.target.value);
  };



  // Handle "Add Task" on click the button
  const handleClick = () => {
    if (inputValue.trim() !== "") 
    {
      SaveTask(inputValue.trim());
      setInputValue("");
    }
    setShowInput(!showInput);
  };



  // Save Task
  const SaveTask = async (task) => {
    try {
      const res = await fetch("http://localhost:5000/api/save_data", 
      {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: task}),
      });

      if (!res.ok) {
        throw new Error('Server Error');
      }

      await res.json();
      await FetchTasks(); // Refresh the list
    } 
    
    catch (error) {
      console.error('Error Saving Task:', error);
    }
  };



  // Read Task
  const FetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/read_data");
      const data = await res.json();
      setFetchedTasks(data.get_all_records);
    } 
    
    catch (err) {
      console.error("Fetch Error:", err);
    }
  };



  // Update Task
  const updateTask = async (id, newTitle) => {
  try {
    const res = await fetch(`http://localhost:5000/api/update_data/${id}`,
    {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ title: newTitle })
    });

    if (!res.ok) {
      throw new Error("Update failed");
    }

    await res.json();
    setEditModeId(null);
    FetchTasks(); // refresh list
  } 
  
  catch (error) {
    console.error("Error updating task:", error);
  }
};



  // Delete Task
  const DeleteTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/delete_data/${id}`, 
        {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      });

      if (!res.ok) {
        throw new Error("Server Error");
      }

      await res.json();
      await FetchTasks(); // Refresh the list after delete the data
    } 
    
    catch (error) {
      console.error('Error Deleting Task:', error);
    }
  };



  // Checkbox toggle open when check the checkbox
  const handleCheckboxChange = (taskId) => {
    setCheckboxState((prev) => ({...prev, [taskId]: !prev[taskId],}));
  };



  // "Show (Hold) the all task" when the server is start or refresh
  useEffect(() => {
    FetchTasks();
  }, []);



  return (
    <div className="App">
      <div className="Container">

        {/* Top Section where the Heading and Date shown */}
        <div className="Top-Section">
          <h1> Task Tracker </h1>
          <p> {new Date().toDateString()} </p>
        </div>


        {/* Task List where all the task add, show, edit and delete */}
        <div className="Container-List">
          <h2> Focus List </h2>
          <p> You can add multiple tasks to the list: </p>

          {/* task list */}
          <ul className="w3-ul Task-List-1">
            {
              // map function is like for loop JavaScript
              fetchedTasks.map((task) => (
                <li key={task._id}>
                  <div className="Task-List-2">
                    <div className='w3-col s12 m12 l12'>
                      <input className="w3-check" type="checkbox" checked={checkboxState[task._id] || false} onChange={() => handleCheckboxChange(task._id)} />
                      <span className="w3-margin-left" style={{textDecoration: checkboxState[task._id] ? 'line-through' : 'none'}}>
                        {task.title}
                      </span>
                    </div>

                    { // Used the ternary operator to edit and delete the task
                      checkboxState[task._id] ? 
                      (
                        <button onClick={() => DeleteTask(task._id)} className="w3-button w3-red w3-hover-red w3-round Delete-Button"> Delete </button>
                      ): 

                      (
                        editModeId === task._id ? (
                          <>
                            <div className='w3-col s12 m12 l12'>
                              <input type="text" value={editInputValue} onChange={(e) => setEditInputValue(e.target.value)} className="Input-Modification"/>

                              <button className="w3-button w3-green w3-hover-green w3-round Save-Button" onClick={() => updateTask(task._id, editInputValue)}> Save </button>
                              <button className="w3-button w3-grey w3-hover-grey w3-round Cancel-Button" onClick={() => setEditModeId(null)}> Cancel </button>
                            </div>
                          </>
                        ) : 
                        (
                          <>
                            <button className="w3-button w3-blue w3-hover-blue w3-round Edit-Button"
                              onClick={() => {
                                setEditModeId(task._id);
                                setEditInputValue(task.title);
                              }}
                            > Edit </button>

                            
                          </>
                        )
                      )
                    }
                  </div>
                </li>
              ))
            }
          </ul>
        </div>

        {/* Add Task Button */}
        <div className="Add-Task-Button">
          <button type="Submit" className="w3-blue w3-button w3-hover-white w3-hover-text-blue w3-round-large button-modified" onClick={handleClick}> + Add Task </button>

          <div className="Input-Field">
            {showInput && (<input type="text" placeholder="enter your task" value={inputValue} onChange={handleInputValue} />)}  
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;