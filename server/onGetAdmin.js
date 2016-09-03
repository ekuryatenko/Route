export function onGetAdmin(ss_user_email) {
  const socket = this;
  const db = socket.db;

  var users = db.collection('users');
  let adminPageContent = {};

  const findOptions = {
    user_email:1,
    password:1,
    _id:0
  };

  users.find({}, findOptions).toArray(function(err, dbDoc) {
    if (err) throw err;

    adminPageContent.usersList = dbDoc;

    const templates = db.collection('templates');
    templates
      .find({version:"1"})
      .limit(1)
      .next(function(err, template){
        if (err) throw err;

        adminPageContent.templateText = template.text;

        socket.emit('setAdmin', adminPageContent);
      });
  });
}
