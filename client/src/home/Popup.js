import { useState } from 'react';
import './Popup.css'
import { socket } from '../socket';
import { Link } from 'react-router-dom';

function Popup(props) {
    const [roomName, setRoomName] = useState("");
    return (props.trigger) ? (
        <div className = "outer">
            <div className = "popup">
                { props.children }
                {/* <input type = "text" placeholder = "Enter Room Name" value = {roomName} onChange = {(e) => setRoomName(e.target.value)}></input> */}
                <button className = "cancelButton" onClick = {cancel}>Cancel</button>
                <Link to = {`room/${socket.id}`} props = {{roomID: socket.id}}>
                    <button className = "createRoomButton" >Create Room</button>
                </Link>
            </div>
        </div>
       
    ) : "";

    function cancel() {
        props.setTrigger(false);
        setRoomName("");
    }
}



export default Popup;