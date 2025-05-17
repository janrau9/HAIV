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
  disabled?: boolean
}

const UserInput: React.FC<UserInputProps> = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === '' || disabled) return
    onSend(input)
    setInput('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`h-full border-green-500 border bg-black bg-opacity-70 w-full px-4 flex justify-center items-center gap-2 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <textarea
        placeholder={
          disabled ? 'No more questions allowed...' : 'Ask the suspect...'
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !disabled) {
            e.preventDefault() // Prevent newline
            handleSubmit(e) // Send message
          }
        }}
        rows={2}
        disabled={disabled}
        className="flex-1 p-2 bg-transparent text-green-500 resize-none border-none focus:outline-none h-full font-mono"
      />
      <button type="submit" className="text-green-500 p-2" disabled={disabled}>
        <SendIcon />
      </button>
    </form>
  )
}

export default UserInput
