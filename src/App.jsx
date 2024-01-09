import { useState, useEffect } from "react";
import "./styles/App.css";

function useTasks(){
    const [tasksList, setTasksList] = useState(()=>{
        const savedTasksList = window.localStorage.getItem("tasksList");

        return savedTasksList ? JSON.parse(savedTasksList) : new Array;
    });

    function createNewTask(description){
        let newTasksList = [...tasksList];
        newTasksList.push({description: description, isDone: false});
        setTasksList(newTasksList);
    }

    function markTaskAsDone(id){
        let newTasksList = [...tasksList];
        newTasksList[id].isDone = !newTasksList[id].isDone;
        setTasksList(newTasksList);
    }

    function deleteTask(id){
        let newTasksList = [...tasksList];
        newTasksList.splice(id, 1);
        setTasksList(newTasksList);
    }

    useEffect(()=>{
        
        window.localStorage.setItem("tasksList", JSON.stringify(tasksList))

    }, [tasksList])

    return [tasksList, createNewTask, markTaskAsDone, deleteTask]
}

export function App(){

    const [tasksList, createNewTask, markTaskAsDone, deleteTask] = useTasks();
    const [newTaskText, setNewTaskText] = useState("");

    function createTaskCall(){
        if(newTaskText !== ""){
            createNewTask(newTaskText);
            setNewTaskText("");
            document.getElementById("new_task_text").value = "";
        }
    }

    return <main>

        <h1>Task Manager</h1>

        <section className="new_task_section">
            <label htmlFor="new_task_text">Create a new task here</label>
            <input name="new_task_text" id="new_task_text" type="text" placeholder="new task description"
                onChange={(e)=>setNewTaskText(e.target.value)}
                onKeyDown={(e)=>{if((e.keyCode || e.which) == "13"){createTaskCall();}}}
            />
            <button onClick={createTaskCall}>Create new task</button>
        </section>
        
        <section className="tasks_section">
            {
                tasksList && tasksList.map((task, id)=>{
                    return (<div key={id} className="task_card">
                        <span>{task.description}</span>
                        <div className="task_card_actions">
                            <button onClick={()=>markTaskAsDone(id)}>{task.isDone ? "✓" : "-"}</button>
                            <button onClick={()=>deleteTask(id)}>×</button>
                        </div>
                        
                    </div>)
                })
            }
        </section>
    </main>
}