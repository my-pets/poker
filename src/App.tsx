import { useEffect } from 'react';
import './App.css';
import useLocalStorage from 'use-local-storage';
import { socket } from './socket/socket';
import { sendEnterGame } from './socket/enter-game.type';
import { Game } from './Game/Game';
import { Login } from './Login/Login';

function App() {
    const [gameCode, setGameCode] = useLocalStorage('gameCode', '');
    const [code, setCode] = useLocalStorage('code', '');

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected:', socket.id);
            sendEnterGame({
                gameCode,
                code,
            })
        });

        socket.on('message', (msg) => {
            console.log('msg: ', msg);
        });
    }, []);

    const handleLoginSubmit = (gameCode: string, code: string, playersCount?: number) => {
        sendEnterGame({
            gameCode,
            code,
            playersCount,
        });
        setGameCode(gameCode);
        setCode(code);
    };

    return (
        <div>
            {(!gameCode || !code) && (
                <Login existedCode={code} existedGameCode={gameCode.split('')} onSubmit={handleLoginSubmit} />
            )}
            {!!gameCode && !!code && <Game code={code} gameCode={gameCode} />}
        </div>
    );
}

export default App;
