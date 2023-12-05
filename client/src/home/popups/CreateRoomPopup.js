import { useState } from 'react';
import './Popup.css'
import { socket } from '../../socket';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';


function CreateRoomPopup(props) {
    const [roomName, setRoomName] = useState("");
    return (props.trigger) ? (
        <div className = "outer">
            <div className = "popup">
                { props.children }
                <div className = "button-container">
                    {/* <input type = "text" placeholder = "Enter Room Name" value = {roomName} onChange = {(e) => setRoomName(e.target.value)}></input> */}
                    <Link to = {`room/${socket.id}`} props = {{roomID: socket.id}}>
                        <Button variant="outlined" >Create Room</Button>
                    </Link>
                    <Button variant="outlined" onClick = {cancel} color="error">Cancel</Button>
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