export function onUpdateTemplate(newTemplate) {
  // With arrows i had undefined instead this, as socket, after transpilling
  const socket = this;
  const db = socket.db;

  // create a database variable
  var templates = db.collection('templates');

  var find = {version: newTemplate.version};
  var update = {
    $set: {
      version: newTemplate.version,
      text: newTemplate.text
    }
  };
  var options = {
    upsert: true
  };

  templates.findOneAndUpdate (
    find,
    update,
    options,
    function(err, r) {
        if(err){
          throw err;
        }

      // Confirm user
      socket.emit ('alert', 'Template changed!');
    });
}
