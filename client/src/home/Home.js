import { useState } from 'react';

import Popup from './Popup.js'
import './Home.css'

function Home () {
    const [buttonPopup, setButtonPopup] = useState(false);
    return (
        <div>
            <main>
                <h1>WebWhiteboard</h1>
                <div>
                    <button id="startButton" onClick = {() => setButtonPopup(true)}>Create Room</button>
                    <Popup trigger = {buttonPopup} setTrigger = {setButtonPopup}>
                        <h3>Create a room to start!</h3>
                    </Popup>
                    {/* <button>Join Room</button> */}
                </div>
            </main>
        </div>
    );
}

export default Home;