import React, { useState } from 'react'
import TodoForm from './TodoForm'
import { RiCloseCircleLine } from 'react-icons/ri'
import { TiEdit } from 'react-icons/ti'

function Todo(props) {
  const {
    todos, completeTodo, removeTodo, updateTodo
  } = props
  const [edit, setEdit] = useState({
    _id: null,
    text: ''
  })

  const submitUpdate = (value) => {
    updateTodo(value._id, value.text)
    setEdit({
      _id: null,
      value: ''
    })
  }

  if (edit._id) {
    return (
      <TodoForm
        edit={edit}
        onSubmit={submitUpdate}
      />
    )
  }

  return (
    <>
      {todos && todos.map((todo) => (
        <div
          className={todo.isComplete ? 'todo-row complete' : 'todo-row'}
          key={todo._id}
        >
          <div
            key={todo._id}
            onClick={() => completeTodo(todo)}
          >
            {todo.text}
          </div>
          <div className='icons'>
            <RiCloseCircleLine
              className='delete-icon'
              onClick={() => removeTodo(todo._id)}
            />
            <TiEdit
              className='edit-icon'
              onClick={() => setEdit(todo)}
            />
          </div>
        </div>
      ))}
    </>
    
  )
}

export default Todo