require('dotenv').config()
const { IgApiClient, Feed } = require('instagram-private-api')
const ig = new IgApiClient();

ig.state.generateDevice(process.env.IG_USERNAME);

const getFollowerCount = async () => {
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    const followersFeed = await ig.feed.accountFollowers(ig.state.cookieUserId);
    const followers = await getAllItemsFromFeed(followersFeed);
    const followersUsername = new Set(followers.map(({ username }) => username));
    printSet(followersUsername);
    console.log("\nYou have a total of " + followers.length + " followers\n");
}

async function getAllItemsFromFeed(feed) {
    let items = [];
    do {
        items = items.concat(await feed.items());
    } while (feed.isMoreAvailable());
    return items;
}

function printSet(followers) {
    console.log("Followers: ");
    let followersArray = Array.from(followers);
    for (let i = 0; i < followersArray.length; i++) {
        console.log(i + 1 + ") " + followersArray[i]);
    }
}

module.exports = {
    getFollowerCount
}