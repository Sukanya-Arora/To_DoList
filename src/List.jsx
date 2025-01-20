import "./List.css";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function List({todos, setTodos, setActivityLog, activityLog}) {
    const [editId, setEditId]= useState(null);
    const [editText, setEditText]= useState("");

    const deleteTodo= (id, taskName) => {
        setTodos(() => todos.filter((prevTodos) => prevTodos.id!=id))
        setActivityLog((prevLog) => [
            ...prevLog,
            `Task deleted: ${taskName} at ${new Date().toLocaleTimeString()}`,
        ]);
    }

    const completed= (id, taskName) => {
        setTodos((prevTodos) => (
            prevTodos.map((todo) => {
                if(todo.id==id) {
                    return {
                        ...todo,
                        completed: !todo.completed
                    }
                } else {
                    return todo;
                }
            })
        ))

        setActivityLog((prevLog) => [
            ...prevLog,
            `Task ${taskName} marked as ${todos.find((todo) => todo.id === id).completed ? false : true} at ${new Date().toLocaleTimeString()}`,
        ]);
    }

    const edit= (id, currentText) => {
        setEditId(id);
        setEditText(currentText);
    }

    const saveEdit = (id, taskName) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id ? { ...todo, task: editText } : todo
            )
        );

        setActivityLog((prevLog) => [
            ...prevLog, `Task ${taskName} edited at ${new Date().toLocaleTimeString()}`,
        ]);
        setEditId(null);
        setEditText("");
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditText("");
    };

    const deleteAll= () => {
        setTodos([])
    }

    const clearLog = () => {
    setActivityLog([]);
    localStorage.removeItem("activityLog");
    }

    const pendingTasks = todos.filter((todo) => todo.task.trim() !== "" && !todo.completed).length;

    return (
        <div className="mediaStyle">
            <ul className="contentStyle">
                {todos.filter((todo) => todo.task.trim()!== "").length>0 && <h3>All Your Tasks <ArrowDownwardIcon/></h3>}
                {todos.filter((todo) => todo.task.trim()!== "").length>0 && <p>(Tap on your task for more options..)</p>}
            {
                todos.filter((todo) => todo.task)
                .map((todo) => (
                    <li key={todo.id} style={{textDecoration: todo.completed? "line-through" : "none"}}>
                    {editId===todo.id ? (
                        <>
                        <TextField id="outlined-basic"  variant="standard"  value={editText} onChange={(e) => setEditText(e.target.value)}/>
                        <br /><br />
                        <Button onClick={() => saveEdit(todo.id, todo.task)} variant="outlined" size="small">Save</Button>&nbsp;
                        <Button  onClick={cancelEdit} variant="outlined" size="small">Cancel</Button>
                        </>
                    ): (
                        <>
                        <div className="listStyle">
                        <span>{todo.task}</span>
                        <div className="btns">
                        <button className="btn doneButton" onClick={() => completed(todo.id, todo.task)}><DoneIcon/></button>
                        <button className="editButton btn" onClick={() => edit(todo.id, todo.task)}><EditIcon/></button>
                        <button className="deleteButton btn" onClick={() => deleteTodo(todo.id, todo.task)}><DeleteIcon fontSize="small"/></button>
                        </div>
                        </div>
                        </>
                    )}
                    </li>
                ))
            }
            {pendingTasks> 0 && <p>You have {pendingTasks} pending tasks</p>}
            {todos.filter((todo) => todo.task.trim()!== "").length>0 && <Button variant="text" onClick={deleteAll}>Clear All</Button>}
            <h3>Activity Log</h3>
            {activityLog.length> 0 ? (
                <ul>
                    {activityLog.map((log, index) => (
                        <li key={index} style={{whiteSpace: "nowrap"}}>{log}</li>
                    ))}
                    <Button  variant="contained" onClick={clearLog} size="small" >Clear your activities</Button>
                </ul>
            ): (
                <p>No activities recorded yet</p>
            )}
            </ul>
        </div>
    )
}