function followUser(fields) {
    console.log(JSON.stringify(fields))
    fetch(`/api/follows`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}

function viewAllFollowers(fields) {
    fetch(`/api/follows?followee=${fields.followee}`)
        .then(showResponse)
        .catch(showResponse);
}

function viewAllFollowees(fields) {
    fetch(`/api/follows?follower=${fields.follower}`)
        .then(showResponse)
        .catch(showResponse);
}

function unfollowUser(fields) {
    fetch(`/api/follows/${fields.followee}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}