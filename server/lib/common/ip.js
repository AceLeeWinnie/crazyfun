const os = require('os')

module.exports = () => {
  let networkInterfaces = os.networkInterfaces()
  let eth0 = [];
  if(networkInterfaces.eth0){
    eth0 = networkInterfaces.eth0
  }
  if(networkInterfaces.en0){
    eth0 = networkInterfaces.en0
  }
  if(networkInterfaces.bond0){
    eth0 = networkInterfaces.bond0 
  }
  for(let i = 0, len = eth0.length; i < len; i++){
    let eth = eth0[i]
    if(eth.family === 'IPv4'){
      return eth.address;
    }
  }
  return null
}