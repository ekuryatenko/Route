export function onGetAdmin(ss_user_email) {
  const socket = this;
  const db = socket.db;

  var users = db.collection('users');

  users.find({}, {user_email:1, _id:0}).toArray(function(err, dbArr) {
    if (err) throw err;

    let profile = dbArr;

    socket.emit('setAdmin', profile);
  });
}
