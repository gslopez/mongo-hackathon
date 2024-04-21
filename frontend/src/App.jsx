import { useEffect, useRef, useState } from "react"
import axios from 'axios';

const baseUrl = "http://127.0.0.1:5000"

function App() {

  useEffect(() => {
    inputRef.current?.focus?.()
    axios.post(`${baseUrl}/reset`, { hi: "hi" }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }, [])

  const [question, setQuestion] = useState("")
  const [chat, setChat] = useState([])
  const [loading, setQuestionLoading] = useState("")
  const divRef = useRef()
  const inputRef = useRef()

  const sendQuery = async (questionToSend) => {
    setQuestionLoading(questionToSend)
    setQuestion("")
    try {
      const response = await axios.post(`${baseUrl}/chat`, { message: questionToSend }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log("response", response)
      if (response.data.status === 1) {
        setChat([...chat, {
          question: questionToSend,
          response: response.data.result,
        }])
      } else {
        throw "error"
      }
    } catch (e) {
      alert("error")
      console.log(e)
    }
    setQuestionLoading("")
    setTimeout(() => {
      if (divRef.current) {
        divRef.current.scrollTop = -1 * divRef.current.scrollHeight;
      }
      inputRef.current?.focus?.()
    }, 1)
  }
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendQuery(question);
    }
};

  return (
    <div className="flex flex-1 items-center justify-center w-full h-full min-h-screen">
      <div className="h-screen w-screen fixed inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
      <div className="bg-white my-10 shadow-xl w-full max-w-[min(80vw,720px)] p-10 flex flex-col rounded-xl z-10">
        <div className="flex flex-col">
          <h1 className="text-4xl hidden lg:block">
            MongoDB AI Hackathon Assistent
          </h1>
          <p className="pt-4 opacity-70 text-sm md:text-base">
            {`Ask me anything you need and I'll do my best to help you!
            E.g "What's the discord link?"`}
          </p>
          <div className="flex flex-row pt-5">
            <input onKeyDown={handleKeyDown} ref={inputRef} value={question} onChange={(e) => setQuestion(e.target.value)} type="text" className="block border border-black h-10 px-5 rounded-md text-base w-full" placeholder="" />
            <div onClick={() => sendQuery(question)} className="block border border-black h-10 px-5 rounded-md text-base h-10 w-10 flex items-center justify-center ml-2 transition duration-100 ease-in-out hover:opacity-70 active:opacity-80 cursor-pointer">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20px" height="20px" viewBox="0 0 512 512">
                  <path fill="#000000" d="M255.682,494.636,16,254.3V216.024l143.937-.007V16h192V216.007L495.952,216l-.035,38.688ZM54.931,248.022l200.8,201.342L457.328,248l-137.391.008V48h-128V248.015Z" />
                </svg>
              </div>
            </div>
          </div>
          {(chat.length > 0 || loading) && <div ref={divRef} className="w-full border border-black mt-4 max-h-[520px] rounded-md overflow-y-scroll px-3 py-2 flex flex-col-reverse">
            {chat.map((chat, index) => {
              return (
                <div key={index} className="flex flex-row mb-2">
                  <div>
                    <p>{">"}</p>
                  </div>
                  <div className="flex flex-col ml-1">
                    {chat.question && <p className="opacity-70 mb-2">{chat.question}</p>}
                    <p className="overflow-wrap">{chat.response}</p>
                  </div>
                </div>
              )
            })}
            {loading && <div key="loading">
              <div key="loading" className="flex flex-row mb-2">
                <div>
                  <p>{">"}</p>
                </div>
                <div className="flex flex-col ml-1">
                  <p className="opacity-70 mb-2">{loading}</p>
                  <p className="overflow-wrap opacity-70">Loading...</p>
                </div>
              </div>
            </div>}
          </div>}
          <div className="lg:ml-auto mt-auto pt-5">
            {/* <span className="opacity-70">Created with</span> ❤️ <span className="opacity-70">by Sam Hernandez</span> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
