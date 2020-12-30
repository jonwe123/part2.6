import React, { useEffect, useState } from 'react'
import axios from 'axios'
import notes, {getAll, create, update, delname} from './services/notes'
import './index.css'

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName] = useState('')
  const [ newNumber, setNewNumber] = useState('')
  const [ searchName, setNewSearch] = useState('')
  const url = 'http://localhost:3001/persons'
  const [okMessage, setOkMessage] = useState('')
  const [NokMessage, setNOkMessage] = useState('')

  const getData = () => {
    axios
    .get(url)
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
    .catch(
      console.log("axios error") 
    )
  }

  useEffect(() => {
    console.log('effect')
    getData()
  }, [])
  
  const tabort = (props) => {
    getData()
    //getData is delayed the subsequential codes. Tabort should should be synchronous but is 
    //right now not. Uppgift 2.20 not completed. Fix tabort to complete 2.20
    const select = persons.filter(x => x.id === props)
    const name = select[0].name;
    if (select.length > 0) {
      if (window.confirm(`Do you really want to remove ${select[0].name}?`)) {
        console.log("delname", notes.delname(props))
        setPersons(persons.filter(x => x.id !== props)) 
        setOkMessage(`${name} is removed`)
        setTimeout(() => {
          setOkMessage('')
        }, 3000)
      } else {
        return
      }
    }
    else {
      setNOkMessage(`${name} doesn't exist in the phonebook`)
      setTimeout(() => {
        setNOkMessage('')
      }, 3000)
    }
  }


  const row = () => persons.filter(x => x.name.toLowerCase().includes(searchName.toLowerCase())).map(person => 
    <div key={persons.indexOf(person)}>
    {person.name} {person.number}
    <button onClick={(e) => {tabort(person.id, e)} }>delete</button>
    </div>
    )


  const addPersons = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
      id: ''
    }
    const personitem = persons.filter(x => x.name === newName)

    if (personitem.length > 0) {
       if (newNumber !== "") {
        if (window.confirm(`${newName} is already in the phonebook. Replace the old number?`)) {
          console.log("personitem id", personitem)          
          notes
            .update(personitem[0].id, nameObject)
            .then(response => {
              console.log("phone number updated", response)
              getData()
              setOkMessage(`Phone number has been updated for ${newName}`)
              setTimeout(() => {
                setOkMessage('')
              }, 5000)
            })
        }
        return
       } else {
        //  window.alert(`${newName} already exist`)         
        setNOkMessage(`${newName} already exist`)
        setTimeout(() => {
          setNOkMessage('')
        }, 5000)
       }
    }
    else { 
      notes.create(nameObject).then(object => {
        console.log("person saved on database")
        getData()
        setOkMessage(`Added ${nameObject.name}`)
        setTimeout(() => {
           setOkMessage('') 
        }, 5000)
      })
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

  const Notification = ({ message }) => {
    if (message === '') {
      return null      
    }
    return (
      <div className="added">
        {message}
      </div>
    )

  }

  const NotificationNok = ( {message} ) => {
    if (message === '') {
      return null      
    }
    return (
      <div className="error">
        {message}
      </div>
    )

  }

  return (
    <div>
      <h2 className='phonebook'>Phonebook</h2>
      <Notification message={okMessage} />
      <NotificationNok message={NokMessage} />
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
      <h2 className='numbers'>Numbers</h2>
      <ul>
        {row()}
     </ul>
    </div>
  )
}

export default App