const MY_APP_EMAIL = process.env.CLOUDMAILIN_EMAIL;// ????????????

export default (function(){
  return {
    getIncomingMailSender (request){
      var data = request.payload;
      var incomingFrom = data.envelope.from;
      console.log("GET MESSAGE FROM:" + incomingFrom);
      return incomingFrom;
    }
  };
})();
