import React, { useState, useEffect } from 'react'
import Todo from './Todo'
import TodoForm from './TodoForm'

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

function TodoList(props) {
  const [todos, setTodos] = useState([])
  const [trigger, setTrigger] = useState(false)

  /* GET initial todo list */
  const getInitialTodos = () => {
    fetch(`${process.env.REACT_APP_TODO_SERVER}`)
      .then((res) => res.json())
      .then((data) => {
        let descendingData = data.reverse()
        console.log('descendingData ', descendingData);
        setTodos(descendingData)
      })
      .catch((error) => {
        console.error('Error:', error);
      })
  }

  useEffect(() => {
    getInitialTodos()
  }, [trigger])

  /* ADD new todo */
  const addTodo = todo => {
    if (!todo.text) return

    let raw = JSON.stringify(todo);
    fetch(`${process.env.REACT_APP_TODO_SERVER}/create`, {
      method: 'POST', 
      headers: myHeaders,
      body: raw,
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299){ 
          console.log('Create new todo list successfully.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })

    const newTodos = [todo, ...todos]

    setTodos(newTodos)
  }

  /* UPDATE any data */
  const updateTodo = (todoId, newValue) => {
    if (!newValue) return
    let raw = JSON.stringify({ text: newValue });
    fetch(`${process.env.REACT_APP_TODO_SERVER}/update/${todoId}`, {
      method: 'PUT', 
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299){
          setTrigger(!trigger)
          console.log('UPDATE the todo list successfully.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })


    setTodos(prev => prev.map(item => (
      item.id === todoId ? newValue : item
    )))
  }

  /* UPDATE any todo to be complete */
  const completeTodo = (item) => {
    let completeTodo = item.isComplete
    let raw = JSON.stringify({
        isComplete: !completeTodo
      });
    fetch(`${process.env.REACT_APP_TODO_SERVER}/update/${item._id}`, {
      method: 'PUT', 
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299){
          console.log('UPDATE the todo list successfully.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })

    let updatedTodo = todos.map((todo) => {
      if (todo._id === item._id) {
        todo.isComplete = !todo.isComplete
      }
      return todo
    })
    setTodos(updatedTodo)
  }

  /* DELETE any todo */
  const removeTodo = (id) => {
    fetch(`${process.env.REACT_APP_TODO_SERVER}/delete/${id}`, {
      method: 'DELETE', 
      headers: myHeaders,
    })
      .then((response) => {
        if (response.status >= 200 && response.status <= 299){ 
          setTrigger(!trigger)
          console.log('DELETE the todo list successfully.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })

    const removeArr = [ ...todos ].filter(todo => todo.id !== id)
    setTodos(removeArr)
  }

  return (
    <div>
      <h1>What's the plan for today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </div>
  )
}

export default TodoList