import { useReducer, useState, useContext, useRef, createContext } from 'react';
import './App.css';

function App() {
  return (
      <TodoListStateProvider>
        <div className="App">
          <InputTodoComponent />
          <FilterTodosComponent />
          <TodoListComponent />
        </div>
      </TodoListStateProvider>
  );
}

function TodoListStateProvider({ children }) {

  const initialState = {
    todoList: [],
    filterTerm: ''
  }
  const [appState, dispatch] = useReducer(todoListReducer, initialState);
  
  // const [todoList, setTodoList] = useState([])
  // const [filterTerm, setFilterTerm] = useState('');

  /* Mutators */
  const addTodo = (todoText) => {
    // const newTodo = { 
    //   todoText, 
    //   id: uuidv4(), 
    //   timestamp: new Date()
    // };
    // setTodoList(prev => [...prev, newTodo])
    dispatch({
      type: ADD_TODO,
      todoText
    })
  }

  const updateFilterTerm = (filterTerm) => {

    // setFilterTerm(filterTerm);
    dispatch({
      type: UPDATE_FILTER_TERM,
      filterTerm
    })
  }

  /*** ***/
  // const appState = {
  //   todoList, 
  //   filterTerm
  // }
  const stateProviderValue = appState;

  const stateMutatorProviderValue = {
    addTodo,
    updateFilterTerm
  }

  return (
    <TodoListStateContext.Provider value={stateProviderValue}>
      <TodoListStateMutatorContext.Provider value={stateMutatorProviderValue}>
        {children}
      </TodoListStateMutatorContext.Provider>
    </TodoListStateContext.Provider>
  )
}

function InputTodoComponent() {

  const inputRef = useRef(null);
  
  const { addTodo } = useContext(TodoListStateMutatorContext);
  
  const onClick = () => {
    const newTodo = inputRef?.current?.value;
    addTodo(newTodo)
  }

  return (
    <div>
      <label>Add Todo</label>
      <input type="text" ref={inputRef} />
      <button onClick={onClick}>Add Todo</button>    
    </div>
  )
}

function FilterTodosComponent() {
  
  const { updateFilterTerm } = useContext(TodoListStateMutatorContext);

  const onChange = (e) => {
    const newFilterTerm = e.target.value;
    console.log('hello')
    console.log('newFilterTerm', newFilterTerm)
    updateFilterTerm(newFilterTerm);
  }

  return (
    <div>
      <label>Filter Todos</label>
      <input type="text" onChange={onChange} />
    </div>

  )
  
}

function TodoListComponent() {
  const { todoList, filterTerm } = useContext(TodoListStateContext);

  return (
    <ul>
      {
        todoList
          .filter(({ todoText }) => todoText.toLowerCase().includes(filterTerm.toLowerCase()))
          .map(({ id }) => <TodoItemComponent key={id} id={id} />)
      }
    </ul>
  );
}

function TodoItemComponent({ id }) {

  const { todoList } = useContext(TodoListStateContext);
  const todo = todoList.find(({ id: id1 }) => id === id1);
  const { todoText } = todo;

  return (
    <li>{todoText}</li>
  )
}

function todoListReducer(state, action) {
  const { type } = action;

  switch(type) {
    case ADD_TODO:
      return getNewStateFromAddTodoAction(state, action)
    case UPDATE_FILTER_TERM:
      return getNewStateFromUpdateFilterTerm(state, action)  
    default:
      return state;  
  }
}

function getNewStateFromAddTodoAction(state, action) {
  const { todoText } = action;
  const{ todoList } = state;
  const newTodo = { 
    todoText, 
    id: uuidv4(), 
    timestamp: new Date()
  };

  return {
    ...state,
    todoList: [
      ...todoList,
      newTodo
    ]
  }
}

function getNewStateFromUpdateFilterTerm(state, action) {

  const { filterTerm } = action;

  return {
    ...state,
    filterTerm
  }
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

const ADD_TODO = 'ADD_TODO';
const UPDATE_FILTER_TERM = 'UPDATE_FILTER_TERM';

const TodoListStateContext = createContext({
  todoList: [],
  filterTerm: ''
});

const TodoListStateMutatorContext = createContext({
  addTodo: (todoText) => {},
  updateFilterTerm: (filterTerm) => {}
})


export default App;
