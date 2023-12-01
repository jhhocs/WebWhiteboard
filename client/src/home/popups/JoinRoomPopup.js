import { useState } from 'react';
import './Popup.css'
import { socket } from '../../socket';
import { Link } from 'react-router-dom';

function JoinRoomPopup(props) {
    const [roomID, setRoomID] = useState("");
    return (props.trigger) ? (
        <div className = "outer">
            <div className = "popup">
                { props.children }

                <input type = "text" placeholder = "Enter Room ID" value = {roomID} onChange = {(e) => setRoomID(e.target.value)}></input>

                <div id = "buttonContainer">
                    <button className = "cancelButton" id="startButton" onClick = {cancel}>Cancel</button>
                    <Link to = {`room/${roomID}`} props = {{roomID: roomID}}>
                        <button className = "joinRoomButton" id="startButton">Join Room</button>
                    </Link>
                </div>
            </div>
        </div>
       
    ) : "";

    function cancel() {
        props.setTrigger(false);
        setRoomID("");
    }
}


export default JoinRoomPopup;