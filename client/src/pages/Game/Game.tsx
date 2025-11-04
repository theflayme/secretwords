import { useState, useEffect, useCallback } from "react"
import useKeyBoard from "@/hooks/useKeyBoard"
import KeyboardRow from "@/components/layout/keyboard"
import { useSearchParams } from "react-router-dom"

const MAX_ATTEMPTS = 6

const checkGuess = (guess: string, solution: string) => {
  const result: { letter: string; status: string }[] = []
  const solArr = solution.split("")

  guess.split("").forEach((ch, i) => {
    if (solution[i] === ch) {
      result.push({ letter: ch, status: "correct" })
      solArr[i] = "*" // занятая позиция
    } else if (solArr.includes(ch)) {
      result.push({ letter: ch, status: "present" })
      solArr[solArr.indexOf(ch)] = "*"
    } else {
      result.push({ letter: ch, status: "absent" })
    }
  })
  return result
}

interface Room {
  name: string;
  description: string;
  currentPlayers: number;
  maxPlayers: number;
  word: string;
  url: string;
}

const Game = () => {
  const [searchParams] = useSearchParams()
  const roomUrl = searchParams.get("room")
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState("")
  const [keyState, setKeyState] = useState<{ [key: string]: string }>({})
  const [isSolved, setIsSolved] = useState(false)
  const [solution, setSolution] = useState<string>("")
  const [wordLength, setWordLength] = useState<number>(4)
  const [error, setError] = useState<string>("")
  const [roomData, setRoomData] = useState<Room | null>(null)
  

  // Загрузка данных комнаты
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomUrl) {
        setError("URL комнаты не найден")
        return
      }

      try {
        const response = await fetch(`http://localhost:5000/game/room?room=${roomUrl}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Комната не найдена")
        }
        
        const data = await response.json()
        setRoomData(data)
        setSolution(data.word.toLowerCase())
        setWordLength(data.word.length)
      } catch (err) {
        setError("Ошибка при загрузке комнаты")
      }
    }

    fetchRoomData()
  }, [roomUrl])

  const handleLetter = useCallback(
    (letter: string) => {
      if (isSolved || current.length >= wordLength) return
      setCurrent((prev) => prev + letter)
    },
    [isSolved, current, wordLength]
  )

  const handleBackspace = useCallback(() => {
    if (isSolved) return
    setCurrent((prev) => prev.slice(0, -1))
  }, [isSolved])

  const handleEnter = useCallback(() => {
    if (isSolved || current.length !== wordLength) return

    const result = checkGuess(current, solution)
    setGuesses((prev) => [...prev, current])

    const newKeys = { ...keyState }
    result.forEach(({ letter, status }) => {
      const prevStatus = newKeys[letter]
      if (prevStatus === "correct") return
      if (status === "correct" || (status === "present" && prevStatus !== "correct"))
        newKeys[letter] = status
      else if (!prevStatus) newKeys[letter] = status
    })
    setKeyState(newKeys)

    if (current === solution) setIsSolved(true)
    setCurrent("")
  }, [current, solution, isSolved, keyState, wordLength])

  useKeyBoard({ isSolved, handleBackspace, handleEnter, handleLetter })

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-110px)] text-white">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 h-[calc(100vh-110px)] text-white">
      {/* Информация о комнате */}
      {roomData && (
        <div className="mb-6 text-center">
          <h3 className="text-gray-400 text-lg font-bold">{roomData.description}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Игроков: {roomData.currentPlayers}/{roomData.maxPlayers}
          </p>
        </div>
      )}

      {/* Игровое поле */}
      <div className="grid grid-rows-6 gap-2 mb-6">
        {[...Array(MAX_ATTEMPTS)].map((_, i) => {
          const guess = guesses[i] || (i === guesses.length ? current : "")
          const letters = guess.split("")
          return (
            <div key={i} className="flex gap-2 justify-center">
              {[...Array(wordLength)].map((_, j) => {
                const ch = letters[j] || ""
                const status =
                  guesses[i] && checkGuess(guesses[i], solution)[j]?.status
                const color =
                  status === "correct"
                    ? "bg-green-700"
                    : status === "present"
                    ? "bg-yellow-700"
                    : "bg-black/10 dark:bg-white/10 text-black dark:text-white"

                return (
                  <div
                    key={j}
                    className={`w-15 h-15 flex items-center justify-center border border-white/10 text-3xl font-bold uppercase rounded ${color}`}
                  >
                    {ch}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {isSolved && (
        <div className="text-green-400 font-semibold mb-4">
          🎉 Слово угадано! ({solution.toUpperCase()})
        </div>
      )}
      {!isSolved && guesses.length >= MAX_ATTEMPTS && (
        <div className="text-red-400 font-semibold mb-4">
          😢 Попытки закончились. Слово: {solution.toUpperCase()}
        </div>
      )}

      <KeyboardRow
        keyState={keyState}
        handleEnter={handleEnter}
        handleBackspace={handleBackspace}
        handleLetter={handleLetter}
      />
    </div>
  )
}

export default Game
