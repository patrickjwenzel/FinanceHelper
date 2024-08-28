import "./App.css";
import TopMenu from "./components/menus/TopMenu";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div className="App">
                <header className="App-header">
                    <TopMenu />
                </header>
            </div>
        </LocalizationProvider>
    );
}

export default App;
