const MY_APP_EMAIL = process.env.CLOUDMAILIN_EMAIL;// ????????????

export default (function(){
  return {
    getIncomingMailAdresses (request){
      let data = request.payload;

      let addresses = {
        incomingSender: data.envelope.from,
        incomingReciever: data.envelope.to
      };

      console.log("GET MESSAGE FROM:" + addresses.incomingSender);

      return addresses;
    }
  };
})();
