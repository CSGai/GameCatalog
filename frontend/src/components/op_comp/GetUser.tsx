import React, { useState } from "react";
import Greeting from "./Greeting";
import '../../styles/frontPage.css'

const GetUser: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [showGreeting, setShowGreeting] = useState<boolean>(false);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    };

    const handleButtonClick = () => {
        setShowGreeting(true);
    };

    const buttonClass = username ? '' : 'disabled';

    return (
      <div className="centered intro-container">
        {/* Input field to enter username */}
        {!showGreeting && (
            <div>
              <form>
                <label htmlFor="username-input">Username: </label>
                <input id='username-input' className="textbox-container" type="text" value={username} onChange={handleUsernameChange} />
                <button className={`button ${buttonClass}`} disabled={!username} onClick={handleButtonClick}>enter</button>
              </form>
            </div>
            )}
        {/* Render the GreetingComponent if username is not empty and button clicked */}
        {showGreeting && <Greeting username={username} />}
      </div>
    );
  };

export default GetUser;
