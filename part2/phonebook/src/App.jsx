import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '020202' },
    { name: 'Hellas Arto', number: '202020' },
    { name: 'Juukeli', number: '12345' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({message, type})
    setTimeout(() => setNotification(null), 5000)
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()

    const nameToAdd = newName.trim()
    const numberToAdd = newNumber.trim()
    const existingPerson = persons.find(p => p.name === nameToAdd)

    if (nameToAdd === '' || numberToAdd === '') return

    if (existingPerson) {
      const ok = window.confirm(
        `${nameToAdd} is already added to phonebook, replace the old number with a new one?`)
        if (!ok) return
        const changedPerson = { ...existingPerson, number: numberToAdd}

        personService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(prev =>
            prev.map(p => (p.id === existingPerson.id ? returnedPerson : p))
          )
          setNewName('')
          setNewNumber('')
          showNotification(`Updated ${returnedPerson.name}`, 'success')
        })
        .catch(error => {
          showNotification(
            `Information of ${existingPerson.name} has already been removed from server`,
            'error'
          )
          setPersons(prev => prev.filter(p => p.id !== id))
        }) 
      return
    }

    const personObject = { name: nameToAdd, number: numberToAdd }

    personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(prev => prev.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      showNotification(`Added ${returnedPerson.name}`, 'success')
    })
  }

  const deletePerson = (id, name) => {
    if(window.confirm(`Delete ${name}?`)){
      personService.remove(id).then(()=>{setPersons(persons.filter(p => p.id !==id))
      showNotification(`Deleted ${name}`, 'success')  
      })
      .catch((error)=> {
        showNotification(`Information of ${name} has already been removed from the server`, 'error')
        setPersons(prev => prev.filter (p => p.id !== id))
      })
    }
  }

  const personsToShow =
    filter.trim() === ''
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(filter.trim().toLowerCase())
        )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}/>

      <Filter filter={filter} onFilterChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
