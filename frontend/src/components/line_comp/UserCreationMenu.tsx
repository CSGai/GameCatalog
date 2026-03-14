import '../../styles/catalog.css';
import '../../styles/frontPage.css';
import React, { useState } from "react";
import Select from 'react-select';
import { customStyles } from '../../styles/customReactStyle'
import eventEmitter from './eventEmitter';

const CreateUser: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [username, setUsername] = useState<string>("");
    const [emailAddr, setEmailAddr] = useState<string>("");
    const [selectedGames, setSelectedGames] = useState<string[]>([]);
    const [catalog, setCatalog] = useState<any[]>([]);

    const openMenu = async () => {
        setIsOpen(!isOpen);
        await accessAPI('http://localhost:443/api/gameList', 'GET');
    };
    
    const closeMenu = async () => {
        setIsOpen(!isOpen);
    };


    const accessAPI = async (endpoint: string, method: string, pdata: any = undefined) => {
        setIsLoading(true);
        try {
            const options: RequestInit = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
    
            if (pdata !== undefined) {
                options.body = JSON.stringify(pdata);
            }
    
            const response = await fetch(endpoint, options);
            if (!response.ok) {
                throw new Error('Failed to fetch catalog');
            }
            const data = await response.json();
            if (pdata === undefined) {
                setCatalog(data);
            }
            else {
                return data;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const addUser = async () => {
        const res = await accessAPI('http://localhost:443/api/createNewUser', 'POST', 
        {game_id_list: selectedGames,
         username: username,
         email_addr: emailAddr});
        
        if (res.response) {
            alert(res.response);
        } else {
            alert('user created succesfully')
            setEmailAddr("");
            setUsername("");
            setSelectedGames([]);
            eventEmitter.emit('userCreated');
        }
    };

    const gameOptions = catalog.map(item => ({
        value: item.game_name,
        label: item.game_name,
        id: item.game_id
    }));

    return(
        <div>
            <button className='button' onClick={openMenu}>Create User</button>
            {isOpen && !isLoading && (
                <div className="popup-menu">
                    <div className="menu-content">
                        <br/>
                        <button onClick={closeMenu} className="close-button button">&times;</button>
                        <div id='Menu'>
                            <input
                                className='textInput'
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(userName) => setUsername(userName.target.value)}
                            />
                            <input
                                className='textInput'
                                type="text"
                                placeholder="Email Address"
                                value={emailAddr}
                                onChange={(emailAddr) => setEmailAddr(emailAddr.target.value)}
                            />
                        </div>
                        <Select
                                isMulti
                                options={gameOptions}
                                onChange={(selectedOptions:any) => {
                                    setSelectedGames(selectedOptions.map((option:any) => option.id));
                                }}
                                styles={customStyles}
                        />
                        <br/>
                        <button className="button" onClick={addUser}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default CreateUser;