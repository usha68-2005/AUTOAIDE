import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote, Wind, Gamepad2, RotateCcw, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

// Motivation Quotes
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
];

// Breathing Exercise Component
function BreathingExercise() {
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [countdown, setCountdown] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const phases: Array<{ name: 'inhale' | 'hold' | 'exhale'; duration: number }> = [
      { name: 'inhale', duration: 4 },
      { name: 'hold', duration: 7 },
      { name: 'exhale', duration: 8 },
    ];

    let currentPhaseIndex = 0;
    let currentCount = phases[0].duration;

    setPhase(phases[0].name);
    setCountdown(currentCount);

    const interval = setInterval(() => {
      currentCount--;
      if (currentCount <= 0) {
        currentPhaseIndex++;
        if (currentPhaseIndex >= phases.length) {
          currentPhaseIndex = 0;
          setCycles(c => c + 1);
        }
        currentCount = phases[currentPhaseIndex].duration;
        setPhase(phases[currentPhaseIndex].name);
      }
      setCountdown(currentCount);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleExercise = () => {
    if (isRunning) {
      setIsRunning(false);
      setPhase('idle');
      setCountdown(0);
    } else {
      setIsRunning(true);
      setCycles(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-5 h-5" />
          Guided Breathing
        </CardTitle>
        <CardDescription>4-7-8 breathing technique for relaxation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div
            className={cn(
              'w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000',
              phase === 'idle' && 'bg-muted',
              phase === 'inhale' && 'bg-blue-500/20 scale-110',
              phase === 'hold' && 'bg-purple-500/20',
              phase === 'exhale' && 'bg-green-500/20 scale-90'
            )}
          >
            <div className="text-center">
              <p className="text-3xl font-bold">{countdown || '-'}</p>
              <p className="text-sm text-muted-foreground capitalize">
                {phase === 'idle' ? 'Ready' : phase}
              </p>
            </div>
          </div>

          {cycles > 0 && (
            <p className="text-sm text-muted-foreground">Completed cycles: {cycles}</p>
          )}

          <Button onClick={toggleExercise} variant={isRunning ? 'destructive' : 'default'}>
            {isRunning ? 'Stop' : 'Start Breathing Exercise'}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-1 bg-muted p-4 rounded-lg">
          <p><strong>Instructions:</strong></p>
          <p>• Inhale through your nose for 4 seconds</p>
          <p>• Hold your breath for 7 seconds</p>
          <p>• Exhale slowly through your mouth for 8 seconds</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Tic Tac Toe Game
type Player = 'X' | 'O' | null;
type Board = Player[];

function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [scores, setScores] = useState({ player: 0, ai: 0 });

  const checkWinner = useCallback((b: Board): Player | 'draw' | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];

    for (const [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
        return b[a];
      }
    }

    if (b.every(cell => cell !== null)) {
      return 'draw';
    }

    return null;
  }, []);

  const minimax = useCallback((b: Board, isMaximizing: boolean): number => {
    const result = checkWinner(b);
    if (result === 'O') return 10;
    if (result === 'X') return -10;
    if (result === 'draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = 'O';
          bestScore = Math.max(bestScore, minimax(b, false));
          b[i] = null;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = 'X';
          bestScore = Math.min(bestScore, minimax(b, true));
          b[i] = null;
        }
      }
      return bestScore;
    }
  }, [checkWinner]);

  const getAIMove = useCallback((b: Board): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (b[i] === null) {
        b[i] = 'O';
        const score = minimax(b, false);
        b[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  }, [minimax]);

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove([...board]);
        if (aiMove !== -1) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          
          const result = checkWinner(newBoard);
          if (result) {
            setWinner(result);
            if (result === 'O') {
              setScores(s => ({ ...s, ai: s.ai + 1 }));
            }
          } else {
            setIsPlayerTurn(true);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner, getAIMove, checkWinner]);

  const handleCellClick = (index: number) => {
    if (board[index] || !isPlayerTurn || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      if (result === 'X') {
        setScores(s => ({ ...s, player: s.player + 1 }));
      }
    } else {
      setIsPlayerTurn(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5" />
          Tic-Tac-Toe
        </CardTitle>
        <CardDescription>You are X, AI is O. Try to beat the AI!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="flex justify-center gap-8 text-sm">
          <div className="text-center">
            <p className="font-semibold text-blue-500">You (X)</p>
            <p className="text-2xl font-bold">{scores.player}</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-red-500">AI (O)</p>
            <p className="text-2xl font-bold">{scores.ai}</p>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner || !isPlayerTurn}
              className={cn(
                'aspect-square text-2xl font-bold rounded-lg transition-all',
                'border-2 border-border hover:border-primary/50',
                'flex items-center justify-center',
                cell === 'X' && 'text-blue-500 bg-blue-500/10',
                cell === 'O' && 'text-red-500 bg-red-500/10',
                !cell && !winner && isPlayerTurn && 'hover:bg-muted cursor-pointer'
              )}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Game Status */}
        {winner && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              {winner === 'X' && (
                <>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="text-blue-500">You Win!</span>
                </>
              )}
              {winner === 'O' && <span className="text-red-500">AI Wins!</span>}
              {winner === 'draw' && <span className="text-muted-foreground">It's a Draw!</span>}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button variant="outline" onClick={resetGame} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Relaxation Page
export default function RelaxationPage() {
  const [currentQuote, setCurrentQuote] = useState(() => 
    quotes[Math.floor(Math.random() * quotes.length)]
  );

  const refreshQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(newQuote);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relaxation Zone</h1>
        <p className="text-muted-foreground">Take a break and refresh your mind</p>
      </div>

      {/* Motivation Quote */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="w-5 h-5" />
            Daily Motivation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <blockquote className="text-xl italic text-center px-4">
            "{currentQuote.text}"
          </blockquote>
          <p className="text-center text-muted-foreground">— {currentQuote.author}</p>
          <div className="flex justify-center">
            <Button variant="outline" onClick={refreshQuote}>
              New Quote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BreathingExercise />
        <TicTacToe />
      </div>
    </div>
  );
}
