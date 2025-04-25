"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Hand,
  HandIcon as HandRock,
  HandIcon as HandPaper,
  ScissorsIcon as HandScissors,
  RotateCcw,
} from "lucide-react"

type Choice = "rock" | "paper" | "scissors" | null
type Result = "win" | "lose" | "draw" | null
type GameHistory = {
  playerChoice: Choice
  computerChoice: Choice
  result: Result
  timestamp: Date
}

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null)
  const [computerChoice, setComputerChoice] = useState<Choice>(null)
  const [result, setResult] = useState<Result>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [computerScore, setComputerScore] = useState(0)
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  const choices: Choice[] = ["rock", "paper", "scissors"]

  const getComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * 3)
    return choices[randomIndex]
  }

  const determineWinner = (player: Choice, computer: Choice): Result => {
    if (player === computer) return "draw"
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "win"
    }
    return "lose"
  }

  const handleChoice = (choice: Choice) => {
    if (isAnimating) return

    setIsAnimating(true)
    setPlayerChoice(choice)
    setComputerChoice(null)
    setResult(null)

    // Simulate computer "thinking"
    const animationInterval = setInterval(() => {
      setComputerChoice(getComputerChoice())
    }, 100)

    // Stop animation and determine winner after 1 second
    setTimeout(() => {
      clearInterval(animationInterval)
      const computer = getComputerChoice()
      setComputerChoice(computer)
      const gameResult = determineWinner(choice, computer)
      setResult(gameResult)

      // Update scores
      if (gameResult === "win") {
        setPlayerScore((prev) => prev + 1)
      } else if (gameResult === "lose") {
        setComputerScore((prev) => prev + 1)
      }

      // Add to history
      setGameHistory((prev) => [
        {
          playerChoice: choice,
          computerChoice: computer,
          result: gameResult,
          timestamp: new Date(),
        },
        ...prev.slice(0, 9), // Keep only the last 10 games
      ])

      setIsAnimating(false)
    }, 1000)
  }

  const resetGame = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult(null)
    setPlayerScore(0)
    setComputerScore(0)
    setGameHistory([])
  }

  const ChoiceIcon = ({ choice, size = 24 }: { choice: Choice; size?: number }) => {
    switch (choice) {
      case "rock":
        return <HandRock size={size} />
      case "paper":
        return <HandPaper size={size} />
      case "scissors":
        return <HandScissors size={size} />
      default:
        return <Hand size={size} />
    }
  }

  const getResultMessage = (): string => {
    switch (result) {
      case "win":
        return "You win! 🎉"
      case "lose":
        return "You lose! 😢"
      case "draw":
        return "It's a draw! 🤝"
      default:
        return "Make your choice!"
    }
  }

  const getResultColor = (): string => {
    switch (result) {
      case "win":
        return "text-green-500"
      case "lose":
        return "text-red-500"
      case "draw":
        return "text-yellow-500"
      default:
        return ""
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Rock Paper Scissors</CardTitle>
          <CardDescription>Choose your weapon wisely!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <p className="text-sm font-medium mb-1">You</p>
              <div className="bg-muted rounded-full p-4 h-20 w-20 flex items-center justify-center mx-auto">
                {playerChoice ? (
                  <ChoiceIcon choice={playerChoice} size={36} />
                ) : (
                  <Hand size={36} className="text-muted-foreground" />
                )}
              </div>
              <Badge variant="outline" className="mt-2">
                Score: {playerScore}
              </Badge>
            </div>

            <div className="text-center">
              <p className={`text-xl font-bold ${getResultColor()}`}>{getResultMessage()}</p>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium mb-1">Computer</p>
              <div className="bg-muted rounded-full p-4 h-20 w-20 flex items-center justify-center mx-auto">
                {computerChoice ? (
                  <ChoiceIcon choice={computerChoice} size={36} />
                ) : (
                  <Hand size={36} className="text-muted-foreground" />
                )}
              </div>
              <Badge variant="outline" className="mt-2">
                Score: {computerScore}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8">
            <Button
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => handleChoice("rock")}
              disabled={isAnimating}
            >
              <HandRock className="mb-1" />
              <span>Rock</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => handleChoice("paper")}
              disabled={isAnimating}
            >
              <HandPaper className="mb-1" />
              <span>Paper</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
              onClick={() => handleChoice("scissors")}
              disabled={isAnimating}
            >
              <HandScissors className="mb-1" />
              <span>Scissors</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={resetGame} className="flex items-center gap-1">
            <RotateCcw size={16} />
            Reset Game
          </Button>
        </CardFooter>
      </Card>

      {gameHistory.length > 0 && (
        <Card className="max-w-md mx-auto mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Game History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gameHistory.map((game, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 border-b last:border-0">
                  <div className="flex items-center gap-1">
                    <ChoiceIcon choice={game.playerChoice} size={16} />
                    <span>You</span>
                  </div>
                  <div
                    className={`font-medium ${
                      game.result === "win"
                        ? "text-green-500"
                        : game.result === "lose"
                          ? "text-red-500"
                          : "text-yellow-500"
                    }`}
                  >
                    {game.result === "win" ? "Win" : game.result === "lose" ? "Lose" : "Draw"}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Computer</span>
                    <ChoiceIcon choice={game.computerChoice} size={16} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
