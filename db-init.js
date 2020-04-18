const Community = require('./models/community');
const Post = require('./models/post');
const Comment = require('./models/comment');

const initDB = () => {
    // init community DB
    const community1 = new Community({ name: 'Community 1', description: 'This is community 1'});
    community1.save((err, community) => {
        if(err) return console.error(err);
        console.log('community created:', community);
    })
}

module.exports = initDB;