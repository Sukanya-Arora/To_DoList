import {  useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import List from "./List";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./InputTask.css"
import AddIcon from '@mui/icons-material/Add';

export default function InputTask() {
    let [todos, setTodos]= useState(() => {
        try {
            const storedTodos = localStorage.getItem("todos");
            return storedTodos ? JSON.parse(storedTodos) : [];
        } catch {
            return [];
        }
    });
    let [newTodo, setnewTodo]= useState("");
    const [activityLog, setActivityLog] = useState(() => {
        try {
            const storedLog = localStorage.getItem("activityLog");
            return storedLog ? JSON.parse(storedLog) : [];
        } catch {
            return [];
        }
    });

    const addTask= () => {
        setTodos((prevTodos) => [
            ...prevTodos, {task: newTodo.trim(), id: uuidv4(), completed: false}
        ])

        setActivityLog((prevLog) => [
            ...prevLog,
            `Task added: ${newTodo.trim()} at ${new Date().toLocaleTimeString()}`,
        ]);
        setnewTodo("");
    }

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);
    
    useEffect(() => {
        if (activityLog.length > 0) { // Only save if there are items
            localStorage.setItem("activityLog", JSON.stringify(activityLog));
        }
    }, [activityLog]);

    // useEffect(() => {
    //     const storedTodos= JSON.parse(localStorage.getItem("todos")) || [];
    //     const storedActivityLog= JSON.parse(localStorage.getItem("activityLog")) || [];
    //     setTodos(storedTodos);
    //     setActivityLog(storedActivityLog);
    // }, []);

    // useEffect(() => {
    //     localStorage.setItem("todos", JSON.stringify(todos));
    //     localStorage.setItem("activityLog", JSON.stringify(activityLog));
    // }, [todos, activityLog])

    const inputHandler= (event) => {
        setnewTodo(event.target.value);
    }

    const formHandler= (event) => {
        event.preventDefault();
    }

    return (
        <div className="formStyle">
            <h3 style={{textAlign: "center"}}>Add Your Daily Task</h3>
            <form onSubmit={formHandler} className="formStyle2">
            <TextField id="outlined-basic" label="Write your task here..." variant="standard"  value={newTodo} onChange={inputHandler}/>
            <Button variant="contained" onClick={addTask}><AddIcon fontSize="small"/></Button>
            </form>
            <List todos={todos} setTodos={setTodos} setActivityLog={setActivityLog} activityLog={activityLog}/>
        </div>
    )
}