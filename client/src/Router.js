import Home from "./home/Home.js"
import App from "./App.js"

import {HashRouter, Route, Routes} from 'react-router-dom'

function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route path = "/" element = {<Home />}></Route>
                <Route path = "/room/:roomID" element = {<App />}></Route>
            </Routes>
        </HashRouter>
    );
}

export default Router;