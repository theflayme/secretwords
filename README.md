src/
├── assets/
│   ├── images/
│   ├── icons/
│   └── styles/
│
├── components/
│   ├── ui/              # Базовые UI-компоненты (Button, Input, Modal)
│   ├── layout/          # Компоненты макета (Header, Footer, Sidebar)
│   └── common/          # Универсальные компоненты (Loader, ErrorMessage)
│
├── features/            # Фичи (модули с полной логикой)
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── pages/
│   └── tasks/
│       ├── components/
│       ├── services/
│       └── pages/
│
├── hooks/
│   └── useLocalStorage.js
│
├── context/
│   └── ThemeContext.jsx
│
├── services/
│   └── api.js
│
├── store/
│   └── index.js
│
├── utils/
│   ├── formatDate.js
│   └── constants.js
│
├── routes/
│   └── AppRouter.jsx
│
├── App.jsx
└── main.jsx
