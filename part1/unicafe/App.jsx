import { isValidElement, useState } from 'react'

const Header = ({feedback}) => <h1>{feedback}</h1>
const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({stats}) => {
  const all = stats[0].amount + stats[1].amount + stats[2].amount

  if (all === 0) {
    return <p>No information given</p>
  }

  const average = (stats[0].amount - stats[2].amount) / all
  const positive = (stats[0].amount / all) * 100

  return (
  <table>
    <tbody>
    <StatisticLine text = {stats[0].name} value = {stats[0].amount} />
    <StatisticLine text = {stats[1].name} value = {stats[1].amount} />
    <StatisticLine text= {stats[2].name} value = {stats[2].amount} />

    <StatisticLine text="all" value={all} />
    <StatisticLine text="average" value={average}/>
    <StatisticLine text="positive" value={`${positive} %`}/>
    </tbody>
  </table>
  )
}

 const feedback = 'give feedback'

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    console.log('value of good is now', updatedGood)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    console.log('value of neutral is now', updatedNeutral)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    setBad(updatedBad);
    console.log('value of bad is now', updatedBad)
  }

  const stats = {
    name: 'statistics',
    parts: [
      {name:'good', amount: good},
      {name:'neutral', amount: neutral},
      {name:'bad', amount: bad}
    ]
  }

  return (
    <div>
      <Header feedback={feedback}/>
      <Button onClick={handleGoodClick} text='good'/>
      <Button onClick={handleNeutralClick} text='neutral'/>
      <Button onClick={handleBadClick} text='bad'/>
      <h2>statistics</h2>
      <Statistics stats={stats.parts}/>
    </div>
  )
}

export default App
