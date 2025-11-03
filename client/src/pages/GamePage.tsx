import { useEffect, useState, useCallback } from 'react';
import useKeyBoard from '../hooks/useKeyBoard';
import delay from '../utils/delay';
import { MAX_ATTEMPTS, STORAGE_KEY } from '../utils/constant';
import KeyboardRow from '../components/layout/keyboard';

const WORDS = [
  'яблоко'
];

const WORD_LENGTH = WORDS[0].length;


function pickSolution() {
  // выбираем псевдослучайное решение на основе дня, чтобы сделать его повторяемым, если вам нравится
  const today = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  return WORDS[today % WORDS.length];
}

function computeResult(guess: string, solution: string) {
  // Возвращает массив статусов: 'correct', 'present', 'absent'
  const res = Array(WORD_LENGTH).fill('absent');
  const solArr = solution.split('');
  const used = Array(WORD_LENGTH).fill(false);

  // Первый проход: правильные позиции
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === solArr[i]) {
      res[i] = 'correct';
      used[i] = true;
    }
  }

  // Второй проход: присутствует, но на неправильной позиции
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (res[i] === 'correct') continue;
    for (let j = 0; j < WORD_LENGTH; j++) {
      if (!used[j] && guess[i] === solArr[j]) {
        res[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }

  return res;
}

export default function WordleLike() {
  const [solution, setSolution] = useState(() => {
    // пытаемся загрузить из хранилища или выбрать новое
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // если решение существует в хранилище и того же дня, используем его, иначе выбираем новое
        if (parsed.solution) return parsed.solution;
      }
    } catch (e) {}
    return pickSolution();
  });

  const [guesses, setGuesses] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.guesses || [];
      }
    } catch (e) {}
    return [];
  });

  const [current, setCurrent] = useState('');
  const [resultRows, setResultRows] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).resultRows || [];
    } catch (e) {}
    return [];
  });

  const [message, setMessage] = useState('');
  const [isSolved, setIsSolved] = useState(false);

  useKeyBoard({ isSolved, handleBackspace: () => setCurrent((c) => c.slice(0, -1)), handleEnter: () => handleEnter(), handleLetter: (letter: string) => handleLetter(letter) });

  useEffect(() => {
    // persist state
    const payload = { solution, guesses, resultRows };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [solution, guesses, resultRows]);

  const handleLetter = useCallback((letter: string) => {
    if (current.length >= WORD_LENGTH) return;
    setCurrent((c) => c + letter);
  }, [current]);

  const handleBackspace = useCallback(() => {
    setCurrent((c) => c.slice(0, -1));
  }, []);

  const handleEnter = useCallback(() => {
    if (current.length !== WORD_LENGTH) {
      setMessage('Введите 5 букв');
      setTimeout(() => setMessage(''), 1500);
      return;
    }


    const newGuesses = [...guesses, current];
    const computed = computeResult(current, solution);
    const newResults = [...resultRows, computed];

    setGuesses(newGuesses);
    setResultRows(newResults);
    setCurrent('');

    if (current === solution) {
      setIsSolved(true);
      setMessage('Поздравляем! Вы угадали слово 🎉');
      delay(1000).then(() => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      });
      return;
    }

    if (newGuesses.length >= MAX_ATTEMPTS) {
      setMessage(`Игра окончена. Слово: ${solution}`);
      delay(1000).then(() => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      });
      return;
    }
  }, [current, guesses, resultRows, solution]);  

  // создаем состояние клавиатуры из resultRows
  const keyState: { [key: string]: string } = {};
  for (const rowIndex in resultRows) {
    const row = resultRows[rowIndex];
    const guess = guesses[rowIndex];
    for (let i = 0; i < guess.length; i++) {
      const ch = guess[i];
      const status = row[i];
      const prev = keyState[ch];
      if (prev === 'correct') continue;
      if (prev === 'present' && status === 'absent') continue;
      keyState[ch] = status;
    }
  }


  return (
    <div className="flex items-center justify-center text-slate-100 lg:p-6">
      <div className="w-full max-w-5xl">
        <main>
            <div className="flex flex-col mt-2 gap-2 mb-6 items-center justify-center bg-white/5 rounded-lg p-10">
                <h1 className="text-xl font-bold">{solution.toUpperCase()}</h1>
                <p className="text-sm text-white/50">
                    Wordle Like is a word game like Wordle. You have {MAX_ATTEMPTS} attempts left
                </p>
            </div>
          <section className="flex flex-col gap-2 mb-6">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, rowIdx) => {
              const guess = guesses[rowIdx] || (rowIdx === guesses.length ? current : '');
              const res = resultRows[rowIdx] || [];
              return (
                <div key={rowIdx} className="flex justify-center gap-2">
                  {Array.from({ length: WORD_LENGTH }).map((__, i) => {
                    const ch = (guess[i] || '').toUpperCase();
                    const status = res[i];
                    const base = 'flex items-center justify-center text-xl font-semibold w-10 h-10 lg:w-20 lg:h-20 border rounded ';
                    const statusClasses = status === 'correct' ? 'bg-green-800 text-white border-green-800' : status === 'present' ? 'bg-yellow-800 text-white border-yellow-800' : (res.length ? 'bg-white/10 text-white border-white/10' : 'bg-transparent text-white');
                    const isFilled = !!ch && (!res.length || status);
                    return <div key={i} className={`${base} ${status ? statusClasses : (rowIdx === guesses.length ? 'bg-white/10 border-white/10' : 'bg-transparent border-white/10')}`} aria-label={`cell-${rowIdx}-${i}`}>
                      <span className={`${isFilled ? 'animate-pop' : ''}`}>{ch}</span>
                    </div>;
                  })}
                </div>
              );
            })}
          </section>
          <div className="mb-4 h-6">
            {message && <div className="text-center text-sm">{message}</div>}
          </div>

           <KeyboardRow keyState={keyState} handleEnter={handleEnter} handleBackspace={handleBackspace} handleLetter={handleLetter} />
        </main>
      </div>

      <style>{`
        .animate-pop { animation: pop 200ms ease; }
        @keyframes pop { 0% { transform: scale(0.9); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
}
