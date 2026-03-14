require('dotenv/config');
const mongoAssist = require('../../utils/mongoAssist');
const {
    v4
} = require('uuid');

const {
    MongoClient
} = require("mongodb");

const readline = require('readline');
const util = require('util');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const questionAsync = util.promisify(rl.question).bind(rl);

//database startup
let startDatabase = `src\\services\\mongoDB\\startupMongoDB.bat`;
let stopDatabase = `src\\services\\mongoDB\\closeMongoDB.bat`;
let childProcess;

//databse setup
const uri = "mongodb://" + process.env.IP + ":" + process.env.MONGOPORT;
const client = new MongoClient(uri);
const database = client.db("Challenge1");

//collection setup
const gameInfo = database.collection("gameInfo");
const userInfo = database.collection("userInfo");
const userGameInfo = database.collection("userGameInfo");

//connects and verifies server connection
async function runDB() {
    try {
        console.log('Database startup sequence');
        childProcess = mongoAssist.execCommand(startDatabase, 'Database is up and running...');
        await client.connect();
        await database.command({
            ping: 1
        });
        console.log("Connected successfully to server");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw Error('boot failiure');
    }
}
//close connection and shuts down mongodb server
async function closeClientConnection() {
    console.log("\nClosing connection...");
    await client.close();
    await mongoAssist.execCommand(stopDatabase, 'Finished.\n');
}
//removes a user from the database
async function removeUsers(user_id_list) {
    user_id_list = await mongoAssist.gameListSetup(user_id_list, lowerList = false);
    await userInfo.deleteMany({
        user_id: {
            $in: user_id_list
        }
    });
    await userGameInfo.deleteMany({
        user_id: {
            $in: user_id_list
        }
    });
}
//removes game from the catalog
async function removeGames(game_id_list) {
    game_id_list = await mongoAssist.gameListSetup(game_id_list);
    await gameInfo.deleteMany({
        game_id: {
            $in: game_id_list
        }
    });
    await userGameInfo.deleteMany({
        game_id: {
            $in: game_id_list
        }
    });
    console.log('removed ', game_id_list);
}
//adds a game (or a list of) to the user profile
async function addGamesToUser(user_id, game_id_list) {
    try {
        game_id_list = await mongoAssist.gameListSetup(game_id_list);
        const data = game_id_list.map(game_id => ({
            user_id: user_id,
            game_id: game_id
        }))
        await userGameInfo.insertMany(data);
    } catch (error) {
        console.error('Add Game To User Error: ', error);
    }
}
//removes games from the user's profile
async function removeGamesFromUser(user_id, game_id_list) {
    try {
        game_id_list = await mongoAssist.gameListSetup(game_id_list);
        await userGameInfo.deleteMany({
            user_id: user_id,
            game_id: {
                $in: game_id_list
            }
        });
    } catch (error) {
        console.error('Remove Game From User Error: ', error);
    }
}
//get a list of all usernames and their respective IDs
async function getUserList() {
    try {
        const finalList = [];
        const uil = await userInfo.find({}, {
            projection: {
                email_addr: 0,
                _id: 0
            }
        }).toArray();
    
        for (const e of uil) {
            const prof = await getProfile(user_id = e.user_id);
            finalList.push(prof);
        }
        return finalList;
    } catch (err) {
        console.error('Failed to fetch user list');
    }
}
async function getGameList() {
    return await gameInfo.find({}, {
        projection: {
            _id: 0
        }
    }).toArray();
}
//gets all user profile info
async function getProfile(user_id = undefined, username = undefined) {
    try {
        var totalScore = 0;
        let userDoc;

        let id = user_id != undefined ? 1 : 0;
        let usr = username != undefined ? 1 : 0;

        let input = id > usr ? 'user_id' : 'username';
        let inputData = id > usr ? user_id : username;

        let query = {};
        query[input] = inputData;

        const userInfoDoc = await userInfo.findOne(query, {
            projection: {
                _id: 0
            }
        });
        user_id = userInfoDoc.user_id;


        const userGameLink = await userGameInfo.find({
            user_id: user_id
        }, {
            projection: {
                _id: 0
            }
        }).toArray();
        const tempIDLink = mongoAssist.toExtract(userGameLink, 'game_id');

        const userGames = await gameInfo.find({
            game_id: {
                $in: tempIDLink
            }
        }, {
            projection: {
                date: 0,
                _id: 0
            }
        }).toArray();
        const gameNames = mongoAssist.toExtract(userGames, 'game_name');
        const gameScores = mongoAssist.toExtract(userGames, 'game_score');

        gameScores.forEach(score => {
            totalScore += parseInt(score, 10);
        });
        userDoc = {
            ...userInfoDoc,
            totalScore: totalScore,
            games: gameNames
        };
        return userDoc;
    } catch (error) {
        console.error('getProfile Error: ', error)
    }

}
//creates new user
async function createNewUser(username, email_addr, game_id_list) {
    try {
        const user_id = v4();
        email_addr = email_addr.toLowerCase();
        const existingUser = userInfo.findOne({
            'username': username
        });
        const existingEmail = userInfo.findOne({
            'email_addr': email_addr
        });
        //check if user or email exists in db
        if (!await existingUser) {
            if (!await existingEmail) {
                //creates the new user
                await userInfo.insertOne({
                    user_id: user_id,
                    username: username,
                    email_addr: email_addr,
                    date: new Date()
                });

                //inserts new games to user relationships
                await addGamesToUser(user_id, game_id_list);
                console.log(`User: ${username} succesfully created`);
            } else {
                const fail = `Email already exists in the database: ${email_addr}`;
                console.log(fail);
                return fail;
            }
        } else {
            const fail = `Username already exists in the database: ${username}`;
            console.log(fail);
            return fail;
        }
    } catch (error) {
        console.error('Error creating new user:', error);
    }
}
//introduces a new game to the game catalog (gameInfo)
async function introduceGameToCatalog(game_name, game_score) {
    try {
        let game_id = v4();
        game_name = game_name.toLowerCase().replace(/ /g, '_');
        const existingGame = gameInfo.findOne({
            'game_name': game_name
        });

        if (!await existingGame) {
            await gameInfo.insertOne({
                game_name: game_name,
                game_id: game_id,
                game_score: game_score,
                date: new Date()
            });
            console.log('\nGame introduced to catalog:', game_name);
        } else {
            console.log('\nGame already exists in the catalog:', game_name);
        }
    } catch (error) {
        console.error('\nError introducing game to catalog:', error);
    }
}
//retrieve gameIDs in a dict
async function getGamesFromCatalog_ID(game_names_list, return_game_names = false) {
    var id_list = {};
    var allDocuments = {};

    if (game_names_list != undefined) {
        try {
            //game list processing
            game_names_list = await mongoAssist.gameListSetup(game_names_list);
            allDocuments = await gameInfo.find({
                game_name: {
                    $in: game_names_list
                }
            }, {
                projection: {
                    game_id: 1,
                    game_name: 1,
                    _id: 0
                }
            }).toArray();
            if (game_names_list.length > 0) {
                id_list = mongoAssist.getIDFromDB(allDocuments);
            } else {
                console.log(game_name + 'not found.');
            }
        } catch (error) {
            console.error('get games from catalog Error: ', error.message);
        }
    } else {
        try {
            allDocuments = await gameInfo.find({}, {
                projection: {
                    game_id: 1,
                    game_name: 1,
                    _id: 0
                }
            }).toArray();
            id_list = mongoAssist.getIDFromDB(allDocuments);
        } catch (error) {
            console.log('get games from catalog Error:', error.message);
        }
    }
    if (!return_game_names) {
        return Object.values(id_list);
    } else {
        return id_list;
    }
}
async function autoCorrectProfiles() {}

//runs tests for the db commands
// async function testDB() {
//     try {

//         await runDB();
//         console.log("\nbeginning test...\n");

//         var newProfileGames = [];

//         //introduce 2 games to the catalog
//         for (let i = 0; i < 2; i++) {
//             const gameName = await questionAsync('Game Name: ');
//             const gameScore = await questionAsync('Game Score: ');
//             newProfileGames.push(gameName);
//             await introduceGameToCatalog(gameName, gameScore);
//         }
//         const profileGames = getGamesFromCatalog(newProfileGames);


//         //get all games in the catalog (including the ones just added)
//         // const profileGames = getGamesFromCatalog(['destiny', 'destiny 2', 'deadcells', 'overwatch']);
//         await introduceGameToCatalog('warframe', 100)
//         const additionalProfileGames = getGamesFromCatalog('warframe');

//         //create new user
//         var username = await questionAsync('\nusername: ');
//         var email_addr = await questionAsync('email: ');
//         // var username = 'TOG';
//         // var email_addr = 'TOG@admin.com';

//         await createNewUser(username, email_addr, await profileGames);

//         //success!
//         var profile = await getProfile(null, username);
//         await addGamesToUser(profile.user_id, await additionalProfileGames);
//         profile = await getProfile(null, username);
//         await removeGamesFromUser(profile.user_id, await additionalProfileGames);
//         profile = await getProfile(null, username);

//         console.log(await getUserList());
//         await removeGames(await additionalProfileGames);
//         await removeUsers(profile.user_id);
//         console.log('users and profiles removed');
//         console.log(await getUserList());
//         console.log("\ntest has run its course...");
//     } catch (error) {
//         console.error('Error during test:', error);
//         await closeClientConnection();
//     } finally {
//         rl.close();
//         await closeClientConnection();
//         process.exit(0);
//     }
// }

module.exports = {
    runDB,
    closeClientConnection,
    removeUsers,
    addGamesToUser,
    removeGamesFromUser,
    getGameList,
    getUserList,
    getProfile,
    createNewUser,
    introduceGameToCatalog,
    getGamesFromCatalog_ID,
    removeGames
}