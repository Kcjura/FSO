import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newPerson => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const update = (id, updatedPerson) =>
    axios.put(`${baseUrl}/${id}`, updatedPerson).then(res => res.data)

const remove = (id) => 
    axios.delete(`${baseUrl}/${id}`)
   

export default { getAll, create, update, remove }
