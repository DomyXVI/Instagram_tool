require('dotenv').config()
const { IgApiClient, Feed } = require('instagram-private-api')
const fs = require("fs");
const ig = new IgApiClient();

ig.state.generateDevice(process.env.IG_USERNAME);


const whoUnfollowedMe = async () => {
    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);




    fs.readFile("./profile_snapshot.json", "utf8", async (err, jsonString) => {
        if (err) {

            var followers = await getFollowers();

            let obj = {
                followerCount: followers.length,
                followers: followers
            }

            fs.writeFile('profile_snapshot.json', JSON.stringify(obj), function (err) {
                if (err) throw err;
                console.log('complete');
            });

            return;
        }

        var oldFollowers = JSON.parse(jsonString).followers;
        var newFollowers = await getFollowers();

        console.log("Followers lost: " + oldFollowers.filter(x => !newFollowers.includes(x)));
        console.log("Followers gained: " + newFollowers.filter(x => !oldFollowers.includes(x)));

        let obj = {
            followerCount: newFollowers.length,
            followers: newFollowers
        }

        fs.writeFile('profile_snapshot.json', JSON.stringify(obj), function (err) {
            if (err) throw err;
            console.log('\ncomplete');
        });

    });
}



async function getAllItemsFromFeed(feed) {
    let items = [];
    do {
        items = items.concat(await feed.items());
    } while (feed.isMoreAvailable());
    return items;
}

async function getFollowers() {
    const followersFeed = await ig.feed.accountFollowers(ig.state.cookieUserId);
    const followers = await getAllItemsFromFeed(followersFeed);
    const followersUsername = new Set(followers.map(({ username }) => username));
    return Array.from(followersUsername);
}


module.exports = {
    whoUnfollowedMe
}
