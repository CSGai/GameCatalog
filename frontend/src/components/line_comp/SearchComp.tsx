import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { customSelectStyles2 } from '../../styles/customReactStyle';
import '../../styles/leaderboard.css';
import eventEmitter from './eventEmitter'

export const Search: React.FC = () => {
    const [selectedOrder, setSelectedOrder] = useState<string>('');
    const [userTable, setUserTable] = useState<any[]>([]);
    const [refreshButton, setRefreshButton] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState(false);
    const [hoveredProfile, setHoveredProfile] = useState<any>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showCloseButton, setShowCloseButton] = useState<boolean>(false);

    const OrderOptions = [
        { value: 'No Order', label: 'No Order' },
        { value: 'Score', label: 'Score' },
        { value: 'Alphabetical', label: 'ABC' }
    ];

    const handleSelect = (option: { value: string; label: string }) => {
        setSelectedOrder(option.value);
    };

    const handleMouseOver = (profile: any) => {
        setHoveredProfile(profile);
        setIsHovering(true);
    };
  
    const handleMouseOut = () => {
        setIsHovering(false);
    };

    useEffect(() => {
        const tableSetter = async () => {
            try {
                const preReq: RequestInit = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const tableInfo = await fetch('http://localhost:443/api/userList', preReq);
                if (!tableInfo.ok) {
                    throw new Error('Failed to fetch catalog');
                }
                const data = await tableInfo.json();
                setUserTable(data);
    
            } catch (err) {
                console.error(err);
            }
        };
    
        tableSetter();
    }, [refreshButton]);
    useEffect(() => {
        const handleOrders = () => {
            switch (selectedOrder) {
                case 'Alphabetical':
                    return [...userTable].sort((a, b) => a.username.localeCompare(b.username));
                case 'Score':
                    return [...userTable].sort((a, b) => b.totalScore - a.totalScore);
                case 'No Order':
                    return [...userTable].sort(() => Math.random() - 0.5);
                default:
                    return userTable;
            }
        };
        setUserTable(handleOrders());
    }, [selectedOrder, userTable]);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => window.removeEventListener("mousemove", updateMousePosition);
    }, []);

    useEffect(() => {
        const handleUserCreated = () => {
            setRefreshButton(prevState => !prevState);
        };

        eventEmitter.on('userCreated', handleUserCreated);

        return () => eventEmitter.off('userCreated', handleUserCreated);
    }, []);


    const deleteProfile = async (user_id: string) => {
        try {
            const preReq: RequestInit = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            const bod = {user_id: user_id}
            preReq.body = JSON.stringify(bod);
            await fetch('http://localhost:443/api/removeUser', preReq);
            setRefreshButton(prevState => !prevState);
        }
        catch (err) {
            console.error(err);
        }
    }
    return (
        <div>
            <div className="leaderboard-options-Container">
                <Select
                    options={OrderOptions}
                    styles={customSelectStyles2}
                    onChange={(option: any) => handleSelect(option)}
                />
            </div>
            <button id='refresh' className="button"
                        onClick={(e) => setRefreshButton(!refreshButton)}>Refresh</button>
            <div className="profileContainer">
                {userTable.map((profile: any, index) => (
                    <div className="profileBox" key={index} 
                        onMouseOver={() => handleMouseOver(profile)} 
                        onMouseOut={handleMouseOut}
                        onMouseEnter={() => setShowCloseButton(true)}
                        onMouseLeave={() => setShowCloseButton(false)}>
                        <p>{profile.username}</p>
                        <p>{profile.totalScore}</p>
                        {showCloseButton && <button className='closeButton' onClick={() => deleteProfile(profile.user_id)}></button>}
                    </div>
                    
                ))}
            </div>
            <div className="popup-prof" style={{ left: mousePosition.x + 5, top: mousePosition.y - 220 }}>
            {isHovering && hoveredProfile && (
                    <div className="profileInfoBox" >
                        <p>{hoveredProfile.username}</p>
                        <p>Total Score: {hoveredProfile.totalScore}</p>
                        <p>Email: {hoveredProfile.email_addr}</p>
                        <p>Games: {hoveredProfile.games.map((game:string) => ` \n${game}`)}</p>
                        <p>Creation Date: {hoveredProfile.date}</p>
                    </div>
            )}
            </div>
        </div>
    );
};