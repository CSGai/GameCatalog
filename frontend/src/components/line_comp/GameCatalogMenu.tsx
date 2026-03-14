import '../../styles/catalog.css';
import '../../styles/frontPage.css';
import React, { useState } from "react";
import Select from 'react-select';
import { customStyles } from '../../styles/customReactStyle'



const Catalog: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [catalog, setCatalog] = useState<any[]>([]);

    const [isOpen, setIsOpen] = useState(false);

    const [gameName, setGameName] = useState("");
    const [gameScore, setGameScore] = useState("");

    const [selectedGames, setSelectedGames] = useState<string[]>([]);

    const openMenu = async () => {
        setIsOpen(!isOpen);
        await accessAPI('http://localhost:443/api/gameList', 'GET');
    };
    
    const closeMenu = async () => {
        setIsOpen(!isOpen);
    };

    const refreshGameList = async () => {
        await accessAPI('http://localhost:443/api/gameList', 'GET');
    }
    
    const addGame = async () => {
        await accessAPI('http://localhost:443/api/addGameToCatalog', 'POST',{game_name: gameName, game_score: gameScore});
        refreshGameList();
        setGameName("");
        setGameScore("");
        alert(gameName + ' has been added to the catalog')
    };

    const removeGame = async () => {
        await accessAPI('http://localhost:443/api/removeCatalogGames', 'DELETE', {game_id_list: selectedGames});
        setSelectedGames([]);
        refreshGameList();
        alert('game list has been removed from the catalog');
    }

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
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const gameOptions = catalog.map(item => ({
            value: item.game_name,
            label: item.game_name,
            id: item.game_id
        }));
    

    return (
        <div>
            <button className='button' onClick={openMenu}>Game Catalog</button>
            {isOpen && !isLoading && (
                <div className="popup-menu">
                    <div className="menu-content">
                    <button onClick={closeMenu} className="close-button button">&times;</button>
                    <br/>
                        <div id='Menu'>
                            <input
                                className='textInput'
                                type="text"
                                placeholder="Game Name"
                                value={gameName}
                                onChange={(gameName) => setGameName(gameName.target.value)}
                            />
                            <input
                                className='textInput'
                                type="text"
                                placeholder="Game Score"
                                value={gameScore}
                                onChange={(gameScore) => setGameScore(gameScore.target.value)}
                            />
                            <button className='button' onClick={addGame}>Add Game</button>
                        </div>
                        <div id='removeGame'>
                            <Select
                                isMulti
                                options={gameOptions}
                                onChange={(selectedOptions:any) => {
                                    setSelectedGames(selectedOptions.map((option:any) => option.id));
                                }}
                                styles={customStyles}
                            />
                        </div>
                        <button className='button' onClick={removeGame}>Remove Game</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalog;
