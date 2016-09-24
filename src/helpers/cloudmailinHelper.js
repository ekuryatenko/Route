const MY_APP_EMAIL = process.env.CLOUDMAILIN_EMAIL;

/**
 * Object helps to handle emails
 * with CLOUDMAILIN service REST API
 */
export default (function(){
  return {
    getIncomingMailAddresses (request){
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
