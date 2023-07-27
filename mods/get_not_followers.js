require('dotenv').config()
const { IgApiClient, Feed } = require('instagram-private-api')
const ig = new IgApiClient();

ig.state.generateDevice(process.env.IG_USERNAME);

const getNotFollowerCount = async () => {
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    const followersFeed = ig.feed.accountFollowers(ig.state.cookieUserId);
    const followingFeed = ig.feed.accountFollowing(ig.state.cookieUserId);

    const followers = await getAllItemsFromFeed(followersFeed);
    const following = await getAllItemsFromFeed(followingFeed);

    const followersUsername = new Set(followers.map(({ username }) => username));
    const notFollowingYou = following.filter(({ username }) => !followersUsername.has(username));
    printSet(notFollowingYou);
}

async function getAllItemsFromFeed(feed) {
    let items = [];
    do {
        items = items.concat(await feed.items());
    } while (feed.isMoreAvailable());
    return items;
}

function printSet(followers) {
    console.log("Not Following you: ");
    let followersArray = Array.from(followers);
    for (let i = 0; i < followersArray.length; i++) {
        console.log(i + 1 + ") " + followersArray[i].username);
    }
}


module.exports = {
    getNotFollowerCount
}

