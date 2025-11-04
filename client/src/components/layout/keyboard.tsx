function keyClass(status: string) {
  if (!status)
    return 'bg-black/10 dark:bg-white/10 text-black dark:text-white';

  if (status === 'correct')
    return 'bg-green-800 dark:bg-green-500 text-white';

  if (status === 'present')
    return 'bg-yellow-800 dark:bg-yellow-400 text-white dark:text-black';

  return 'text-black dark:text-white bg-black/10 dark:bg-white/10 opacity-40';
}

const keyboardRows = [
  'йцукенгшщзхъ'.split(''),
  'фывапролджэ'.split(''),
  ['Backspace', ...'ячсмитьбю'.split(''), 'Enter'],
];

export default function KeyboardRow({
  keyState,
  handleEnter,
  handleBackspace,
  handleLetter,
}: {
  keyState: { [key: string]: string },
  handleEnter: () => void,
  handleBackspace: () => void,
  handleLetter: (letter: string) => void,
}) {
  return (
    <section className="select-none w-full max-w-2xl mx-auto px-1">
      {keyboardRows.map((row: string[], rIdx: number) => (
        <div
          key={rIdx}
          className="flex w-full justify-center mb-2 gap-1 sm:gap-2"
        >
          {row.map((k: string) => {
            const lower = k.toLowerCase();
            const isSpecial = k === "Enter" || k === "Backspace";
            const color = isSpecial
              ? 'bg-black/10 dark:bg-white/10 text-white'
              : keyClass(keyState[lower] as string);

            const buttonBase =
              "flex-grow min-w-0 h-12 sm:h-12 lg:h-12 rounded flex items-center justify-center font-semibold transition-colors focus:outline-none p-2";
            const special = isSpecial
              ? "basis-[65px] sm:basis-[80px] max-w-[90px] px-2 dark:text-black"
              : "";

            return (
              <button
                key={k}
                onClick={() => {
                  if (k === "Enter") return handleEnter();
                  if (k === "Backspace") return handleBackspace();
                  handleLetter(lower);
                }}
                className={`${buttonBase} ${special} ${color} text-[16px] sm:text-lg`}
                aria-label={k === "Backspace" ? "Delete" : k.toUpperCase()}
              >
                {k === "Backspace" ? (
                  <span className="inline-block min-w-6 min-h-6 text-black dark:text-white">Del</span>
                ) : k === "Enter" ? (
                  <span className="inline-block min-w-6 min-h-6 text-black dark:text-white">Enter</span>
                ) : (
                  k.toUpperCase()
                )}
              </button>
            );
          })}
        </div>
      ))}
    </section>
  );
}
