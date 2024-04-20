import { setState } from "react"

function App() {

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
          <input onChange={(e) => setState(e.target.value)} type="text" className="mt-4 block border border-black h-10 px-5 rounded-md text-base w-full" placeholder="ask me anything!" />
          <div className="lg:ml-auto mt-auto pt-5">
            {/* <span className="opacity-70">Created with</span> ❤️ <span className="opacity-70">by Sam Hernandez</span> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
