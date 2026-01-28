const Notification = ({ message, type }) => {
    if (!message) return null
    
    const style = {
        padding: 10,
        border: '2px solid',
        borderRadius: 5,
        marginBottom: 10,
        color: type === 'error' ? 'red' : 'green',
        background: '#f3f3f3'
    }

    return (
        <div style={style}>
          {message}
        </div>
    )
}

export default Notification