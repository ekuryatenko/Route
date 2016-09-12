export function onSetProfile(obj) {
  // With arrows i had undefined instead this, as socket, after transpilling
  const socket = this;
  const db = socket.db;

  // create a database variable
  var users = db.collection ('users');

  users.findOneAndUpdate ({user_email: obj.user_email}
    , {
      $set: {
        password: obj.fpass,
        emailTemplate: obj.emailTemplate
      }
    }
    , function(err, res){
      if(err){
        throw err;
      }

      // Reload data on page
      let profile = {
        user_email: obj.user_email,
        password: obj.fpass,
        emailTemplate: obj.emailTemplate
      };
      socket.emit('setProfile', profile);

      // Confirm user
      socket.emit ('alert', 'Profile changed!');
    }
  );

}
