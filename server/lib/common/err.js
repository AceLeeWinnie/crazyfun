const err = {
  toString: function(err){
    if(err instanceof Error){
      return `${err.toString()}${err.stack}`
    }
    else if(typeof err === 'object'){
      return JSON.stringify(err)
    }
    else{
      return err
    }
  }
}

module.exports = err