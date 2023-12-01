import { useState } from 'react';
import './Popup.css'
import { socket } from '../../socket';
import { Link } from 'react-router-dom';

function CreateRoomPopup(props) {
    const [roomName, setRoomName] = useState("");
    return (props.trigger) ? (
        <div className = "outer">
            <div className = "popup">
                { props.children }
                <div id = "buttonContainer">
                    {/* <input type = "text" placeholder = "Enter Room Name" value = {roomName} onChange = {(e) => setRoomName(e.target.value)}></input> */}
                    <button className = "cancelButton" id="startButton" onClick = {cancel}>Cancel</button>
                    <Link to = {`room/${socket.id}`} props = {{roomID: socket.id}}>
                        <button className = "createRoomButton" id="startButton">Create Room</button>
                    </Link>
                </div>
            </div>
        </div>
       
    ) : "";

    function cancel() {
        props.setTrigger(false);
        setRoomName("");
    }
}


export default CreateRoomPopup;