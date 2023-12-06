import { useState } from 'react';
import './Popup.css'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function JoinRoomPopup(props) {
    const [roomID, setRoomID] = useState("");
    return (props.trigger) ? (
        <div className = "outer">
                <div className = "popup">
                    { props.children }
                    <TextField id="outlined-basic" label="Room Id" value={roomID} variant="outlined" onChange={(e) => setRoomID(e.target.value)}/>
                    <div className = "button-container">
                        <Link to = {`room/${roomID}`} props = {{roomID: roomID}}>
                            <Button variant="outlined" >Join Room</Button>
                        </Link>
                        <Button variant="outlined" onClick = {cancel} color='error'>Cancel</Button>
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