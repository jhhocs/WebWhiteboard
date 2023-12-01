import { useState } from 'react';

import CreateRoomPopup from './popups/CreateRoomPopup.js'
import JoinRoomPopup from './popups/JoinRoomPopup.js';
import './Home.css'

function Home () {
    const [createButtonPopup, setCreateButtonPopup] = useState(false);
    const [joinButtonPopup, setJoinButtonPopup] = useState(false);
    return (
        <div>
            <main>
                <h1>WebWhiteboard</h1>
                <div>
                    <button id="startButton" onClick = {() => setCreateButtonPopup(true)}>Create Room</button>
                    <CreateRoomPopup trigger = {createButtonPopup} setTrigger = {setCreateButtonPopup}>
                        <h2>Create a room to start!</h2>
                    </CreateRoomPopup>
                    <button id = "joinButton" onClick = {() => setJoinButtonPopup(true)}>Join Room</button>
                    <JoinRoomPopup trigger = {joinButtonPopup} setTrigger = {setJoinButtonPopup}>
                        <h2>Join a room!</h2>
                    </JoinRoomPopup>
                </div>
            </main>
        </div>
    );
}

export default Home;