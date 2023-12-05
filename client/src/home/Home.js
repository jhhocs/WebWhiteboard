import { useState } from 'react';

import CreateRoomPopup from './popups/CreateRoomPopup.js'
import JoinRoomPopup from './popups/JoinRoomPopup.js';
import './Home.css'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';


function Home () {
    const [createButtonPopup, setCreateButtonPopup] = useState(false);
    const [joinButtonPopup, setJoinButtonPopup] = useState(false);
    return (
        <div className='home-container'>
            <main>
                <h1>WebWhiteboard</h1>
                <div className='flex-container'>
                    <Button onClick = {() => setCreateButtonPopup(true)} variant="outlined">Create Room</Button>
                    <Button onClick = {() => setJoinButtonPopup(true)} variant="outlined">Join Room</Button>
                    <Modal
                        open={createButtonPopup}
                        onClose={() => setCreateButtonPopup(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        >
                        <CreateRoomPopup trigger = {createButtonPopup} setTrigger = {setCreateButtonPopup}>
                            <h2>Create a room to start!</h2>
                        </CreateRoomPopup>
                    </Modal>
                    <Modal
                        open={joinButtonPopup}
                        onClose={() => setJoinButtonPopup(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <JoinRoomPopup trigger = {joinButtonPopup} setTrigger = {setJoinButtonPopup}>
                            <h2>Join a room!</h2>
                        </JoinRoomPopup>
                    </Modal>
                </div>
            </main>
        </div>
    );
}

export default Home;