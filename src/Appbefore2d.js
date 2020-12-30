import React, { useEffect, useState } from 'react'
import axios from 'axios'


const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ searchName, setNewSearch] = useState('')

  // axios
  //   .get('http://localhost:3001/persons')
  //   .then(response => {
  //       console.log(response)
  //       setPersons(response.data)
  //   })

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  
  const row = () => persons.filter(x => x.name.toLowerCase().includes(searchName.toLowerCase())).map(person => 
    <div key={persons.indexOf(person)}>
    {person.name} {person.number}
    </div>
    )


  const addPersons = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    if (persons.filter(x => x.name === newName).length > 0) {
      window.alert(`${newName} already exist`)
    }
    else { 
      setPersons(persons.concat(nameObject))
    }
  }
  
  const handleNameadd = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberadd = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={searchName} onChange={handleSearch} /> 
      </div>
      <form onSubmit={addPersons}>
        <div>
          name: <input value={newName} onChange={handleNameadd} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberadd} />
        </div>
        <div>
          <button type="submit" >add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {row()}
     </ul>
    </div>
  )
}

export default App