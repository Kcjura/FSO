const Persons = ({ persons, onDelete }) => (
  <div>
    {persons.map((person) => (
      <div key={person.id}>
        {person.name} {person.number} {''}
        <button onClick={() => onDelete(person.id, person.name)}>delete</button>
      </div>
    ))}
  </div>
)

const remove = (id) => axios.delete(`${baseUrl}/${id}`)

export default Persons