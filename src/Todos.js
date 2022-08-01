import React, { useState, useEffect } from 'react'
const axios = require('axios');

function Todos() {

    const [todoItems, setTodos] = useState([]);

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://localhost:8080/getTodo',
            responseType: 'json'
        })
            .then(function (response) {
                setTodos(response.data)
            });
    }, []);

    useEffect(() => {
        if (todoItems.length != 0) {
            axios({
                method: 'post',
                url: 'http://localhost:8080/refreshTodos',
                responseType: 'json',
                data: todoItems
            })
                .then(function (response) {
                });
        }

    }, [todoItems]);

    function getDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = dd + '/' + mm + '/' + yyyy;
        return formattedToday;
    }

    const handleMessageChange = event => {
        var id = event.target.id.split(" ")[0];
        var dataType = event.target.id.split(" ")[1];
        var newState = [];
        for (var i = 0; i < todoItems.length; i++) {
            if (todoItems[i].id == id) {
                if (dataType == "title") {
                    newState.push({
                        id: todoItems[i].id,
                        title: event.target.value,
                        description: todoItems[i].description,
                        dateCreated: getDate()
                    })
                } else if (dataType == "description") {
                    newState.push({
                        id: todoItems[i].id,
                        title: todoItems[i].title,
                        description: event.target.value,
                        dateCreated: getDate()
                    })
                } else if (dataType == "dateCreated") {
                    newState.push({
                        id: todoItems[i].id,
                        title: todoItems[i].title,
                        description: todoItems[i].description,
                        dateCreated: getDate()
                    })
                }
            } else {
                newState.push(todoItems[i])
            }
        }
        setTodos(newState);
    };
    const RemoveItem = (event) => {
        var id = event.target.id.split(" ")[0];
        var newState = [];
        for (var i = 0; i < todoItems.length; i++) {
            if (todoItems[i].id != id) {
                newState.push(todoItems[i])
            }
        }
        axios({
            method: 'post',
            url: 'http://localhost:8080/refreshTodos',
            responseType: 'json',
            data: newState
        })
            .then(function (response) {
                window.location.reload()
            });
    }
    const AddTodo = (event) => {
        axios({
            method: 'get',
            url: 'http://localhost:8080/addTodo',
            responseType: 'json',
            data: todoItems
        })
            .then(function (response) {
                window.location.reload();
            });
    }
    return (
        <div style={{textAlign:"center"}} id='todoContainer'>
            <h1>Todo App</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date Created</th>
                        <th><button onClick={AddTodo}>Add Todo</button></th>
                    </tr>
                </thead>
                <tbody>
                    {todoItems.map(it =>
                        <tr key={it.id}>
                            <td><textarea onChange={handleMessageChange} id={it.id + " title"} value={it.title}></textarea></td>
                            <td><textarea onChange={handleMessageChange} id={it.id + " description"} value={it.description}></textarea></td>
                            <td>{it.dateCreated}</td>
                            <td><button style={{ backgroundColor: "red" }} id={it.id + " button"} onClick={RemoveItem}>Delete</button></td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    )
}

export default Todos