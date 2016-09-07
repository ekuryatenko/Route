export function onGetProfile(ss_user_email) {
  const socket = this;
  const db = socket.db;

  var users = db.collection('users');

  users.find({
    'user_email': ss_user_email
  }).toArray(function(err, dbArr) {
    if (err) throw err;

    let profile = {
      user_email: dbArr[0].user_email,
      password: dbArr[0].password,
      emailTemplate: dbArr[0].emailTemplate
    };

    socket.emit('setProfile', profile);

  });
}

