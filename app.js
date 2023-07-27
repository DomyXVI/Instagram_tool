const readline = require("readline");

const { unfollow_unfollowers } = require("./mods/unfollow_unfollowers");

const { getFollowerCount } = require("./mods/get_follower_count.js");

const { getNotFollowerCount } = require("./mods/get_not_followers.js");

const { whoUnfollowedMe } = require("./mods/who_has_unfollowed_me.js");

const { updateAccount } = require("./mods/update_profile.js");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

updateAccount().then(() => {
    let question =
        `
________________________________________
Instagram Tool:
1- Get Follower count
2- Get people who are NOT following you
3- Unfollow who is NOT following you
4- See who has followed/unfollowed you
0- Exit
________________________________________
`;


    rl.question(question, function (input) {
        const answer = parseInt(input);
        switch (answer) {
            case 0:
                exitRequested = true; // Set the flag to exit the loop
                rl.close(); // Close the readline interface
                break;
            case 1:
                getFollowerCount();
                break;
            case 2:
                getNotFollowerCount();
                break;
            case 3:
                unfollow_unfollowers();
                break;
            case 4:
                whoUnfollowedMe();
                break;
            default:
                console.log("try again.");
        }
    });
});
