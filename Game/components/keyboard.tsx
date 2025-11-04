function keyClass(status: string) {
    if (!status) return 'bg-white/10';
    if (status === 'correct') return 'bg-green-800 text-white';
    if (status === 'present') return 'bg-yellow-800 text-white';
    return 'bg-white/10 opacity-10';
  }

  const keyboardRows = [
    'йцукенгшщзхъ'.split(''),
    'фывапролджэ'.split(''),
    ['Enter', ...'ячсмитьбю'.split(''), 'Backspace'],
  ];


export default function KeyboardRow({ keyState, handleEnter, handleBackspace, handleLetter }: { keyState: { [key: string]: string }, handleEnter: () => void, handleBackspace: () => void, handleLetter: (letter: string) => void }) {
  
    return (
    <>
        <section className="select-none">
        {keyboardRows.map((row: string[], rIdx: number) => {
          let displayRow = row;
          if (row.includes('Enter') && row.includes('Backspace')) {
            displayRow = [...row];
            const enterIdx = displayRow.indexOf('Enter');
            const backspaceIdx = displayRow.indexOf('Backspace');
            displayRow[enterIdx] = 'Backspace';
            displayRow[backspaceIdx] = 'Enter';
          }
          return (
            <div key={rIdx} className="flex justify-center gap-2 mb-2">
              {displayRow.map((k: string) => {
                const lower = String(k).toLowerCase();
                const cls = k.length > 1 ? 'px-2 py-3 text-[14px]' : 'w-12 h-12 lg:w-20 lg:h-20 ';
                const color = k === 'Enter' || k === 'Backspace' ? 'bg-white/10' : keyClass(keyState[lower] as string);
                return (
                  <button
                    key={k}
                    onClick={() => {
                      if (k === 'Enter') return handleEnter();
                      if (k === 'Backspace') return handleBackspace();
                      handleLetter(lower);
                    }}
                    className={`${cls} ${color} rounded flex items-center justify-center font-semibold`}
                  >
                    {k === 'Backspace' ? 'Delete' : k.toUpperCase()}
                  </button>
                );
              })}
            </div>
          );
        })}
      </section>
    </>
  )
}