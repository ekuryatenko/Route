module.exports = {
  context: __dirname + '/frontend/public',

  entry:  {
    adminProfile: "./adminProfile",
    logIn       : "./logIn",
    signIn      : "./signIn",
    userProfile : "./userProfile"
  },

  output: {
    path        : __dirname + "/lib/public",
    publicPath  : '/',
    filename    : "[name].js",
    library     : "[name]"
  },

  module: {
    loaders: [{
      test      : /\.js$/,
      exclude   : /node_modules/,
      loader    : 'babel-loader',
      query     : {
        presets : ['es2015']
      }
    }]
  },

  resolve: {
    extensions  : ['', '.js']
  }
};

