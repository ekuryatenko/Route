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

        if(template) {
          adminPageContent.templateText = template.text;
        }else{
          //It's first call of page - show some text to admin
          adminPageContent.templateText = "Hello, {{userName}}!"
        }

        socket.emit('setAdmin', adminPageContent);
      });
  });
}
