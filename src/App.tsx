import './App.css';
import useLocalStorage from 'use-local-storage';
import { Game } from './Game/Game';
import { Login } from './Login/Login';

function App() {
    const [gameCode, setGameCode] = useLocalStorage('gameCode', '');
    const [code, setCode] = useLocalStorage('code', '');
    const [playersCount, setPlayersCount] = useLocalStorage('playersCount', 2);

    const handleLoginSubmit = (gameCode: string, code: string, playersCount?: number) => {
        setGameCode(gameCode);
        setCode(code);
        setPlayersCount(playersCount)
    };

    return (
        <div>
            <Login existedCode={code} existedGameCode={gameCode.split('')} onSubmit={handleLoginSubmit} />
            {!!gameCode && !!code && <Game code={code} gameCode={gameCode} playersCount={playersCount}/>}
        </div>
    );
}

export default App;
