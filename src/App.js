
import {useState, useEffect, useRef} from 'react'
const App = () => {
    const [ value, setValue] = useState("")
    const [ message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState(JSON.parse(localStorage.getItem("Chats"))||[])
    const [ currentTitle, setCurrentTitle] = useState(null)
    const feed = useRef(null)

    const createNewChat = () => {
        setMessage(null)
        setValue("")
        setCurrentTitle(null)
    }

    const deleteChat = (title) => {
        setPreviousChats(prevChats => prevChats.filter(message => message.title !== title));
    }

    const handleClick = (uniqueTitle) => {
        setCurrentTitle(uniqueTitle)
        setValue("")
    }

    const getMessages = async ()=> {
        const options= {
            method: "POST",
            body : JSON.stringify({
                message: value
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }
        try {
            const response = await fetch('http://localhost:8000/completions', options)
            const data = await response.json()
            // console.log(data)
            // setMessage(data.choices[0].message)
            const message = data.choices[0].message
            const title = currentTitle || value
            setPreviousChats(prevChats => (
                [...prevChats,
                    {
                        title: title,
                        role: "user",
                        content: value
                    },
                    {
                        title: title,
                        role: message.role,
                        content: message.content
                    }
                ]
            ))

            setCurrentTitle(title)

        } catch (error) {
            console.error(error)
        }
        console.log(feed.current)
        feed.current.scrollIntoView({block: "end"})
    }
    // useEffect(() => {
    //     console.log(currentTitle, value, message)
    //     if (!currentTitle && value && message) {
    //         setCurrentTitle(value)
    //     }
    //     if (currentTitle && value && message) {
    //         setPreviousChats(prevChats => (
    //             [...prevChats,
    //                 {
    //                     title: currentTitle,
    //                     role: "user",
    //                     content: value
    //                  },
    //                 {
    //                     title: currentTitle,
    //                     role: message.role,
    //                     content: message.content
    //                 }
    //             ]
    //         ))
    //     }
    //
    // },[message, currentTitle, value])

    useEffect(()=>{
        localStorage.setItem("Chats", JSON.stringify(previousChats))
    },[previousChats])

     console.log(previousChats)
     const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
     const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
     console.log(uniqueTitles)



  return (
    <div className="app">
      <section className="side-bar">
          <button onClick={createNewChat}>+ New chat</button>
          <ul className="history">
              {uniqueTitles?.map((uniqueTitle, index) => {
                  return (
                  <span className="test">
                      <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>
                      <button className="xButton" onClick={() => deleteChat(uniqueTitle)}>x</button>
                  </span>); })}
          </ul>
          <nav></nav>
          <p className="by-line">Made by Ella</p>
      </section>
      <section className="main">
          {!currentTitle ? <h1>EllaGPT</h1>:<h1>{currentTitle}</h1>}
          <ul className="feed" ref={feed}>
              {currentChat?.map((chatMessage, index) => <li key={index}>
                  <p className="role">{chatMessage.role}</p>
                  <p>{chatMessage.content}</p>
              </li>)}

          </ul>
          <div className="bottom-section">
              <div className="input-container">
                  <input value={value} onChange={(e) => setValue(e.target.value)}/>
                  <div id="submit" onClick={getMessages}>➢</div>
              </div>
              <p className="info">
                  Chat GPT Mar 14 Version. Free Research Preview.
                  Our goal is to make AI systems more natural and safe to interact with.
                  Your feedback will help us improve.
              </p>

          </div>
      </section>
    </div>
  )
}

export default App;
