const USER_PROFILE_PAGE = 'userProfileForm.html';
/**
 */
export function onSignIn(obj) {
  // With arrows i had undefined instead this, as socket, after transpilling
  const socket = this;
  const db = socket.db;
  var user_email = obj.user_email,
    fpass = obj.fpass,
    cpass = obj.cpass;

  // check for empty fields
  if (user_email === '' || cpass === '' || fpass === '') {
    socket.emit('alert', 'Whoops, you missed one!');
    return;
  }

  // check for matching passwords
  if (fpass !== cpass) {
    socket.emit('alert', 'Your passwords don\'t match.');
    return;
  }

  //socket.emit('alert', 'You are connected.');

  // create a database variable
  var users = db.collection('users');

  // create a variable to hold the data object
  users.find().sort({
    _id: 1
  }).toArray(function (err, dbArr) {
    if (err) throw err;

    // create a flag variable
    var newUser = user_email;

    var doesUserExist = function (newUser, arr) {
      if (arr.length) {
        for (var i = 0; i < arr.length; i++) {

          var answer;

          if (newUser === arr[i].user_email) {
            answer = "exists";
            break;
          } else {
            answer = "does not exist";
          }
        }
        return answer;
      } else {
        return answer = "does not exist";
      }
    };

    var found = doesUserExist(newUser, dbArr);

    if (found !== "exists") {
      // if not found, push the user profile into the db
      let profile = {
        user_email: user_email,
        password: cpass,
        emailTemplate: (user_email.indexOf("@") > -1) ? user_email.substr(0, user_email.indexOf("@")) : user_email
      };

      socket.profile = profile;

      users.insertOne(profile, function () {
        socket.emit('alert', 'Your account has been created');
        socket.emit('clear-form');
        socket.emit('redirect', USER_PROFILE_PAGE);
        return found; //?? What for this return
      });
    } else {
      socket.emit('clear-form');
      socket.emit('alert', 'Username already exists. Please use another one.');
    }
  });
}
