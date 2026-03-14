import React, { useState, useEffect } from "react";
import { ListFormat } from "typescript";

interface LeaderboardProps {
    userProfile: ListFormat
    user_id: number
    username: string
}

const Leaderboard: React.FC<LeaderboardProps> = () => {
    const [userProfiles, setUserProfiles] = useState<LeaderboardProps[]>([]);


    useEffect(() => {
        const userList = async () => {
            const list = await fetch('http://127.0.0.1:443/api/userList');
        }
    })
    return (
        <br/>
    )
    
}

export default Leaderboard;