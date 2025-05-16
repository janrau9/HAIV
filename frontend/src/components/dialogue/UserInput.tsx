import { useState } from 'react'

const SendIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </svg>
  )
}

interface UserInputProps {
  onSend: (message: string) => void
}

const UserInput: React.FC<UserInputProps> = ({ onSend }) => {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '') return
    onSend(input)
    setInput('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className=" shadow-[4px_4px_0_0_black] border-black bg-white w-full max-w-md px-4 flex justify-center items-center gap-2"
    >
      <textarea
        placeholder="Ask the suspect..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault() // Prevent newline
            handleSubmit(e) // Send message
          }
        }}
        rows={1}
        className="flex-1 p-2 bg-white text-[#2b3b13] resize-none border-none focus:outline-none"
      />
      <button type="submit" className="bg-white text-[#2b3b13] p-2 ">
        <SendIcon />
      </button>
    </form>
  )
}

export default UserInput
