class Net {
  constructor(){
    this.header = {
      'Content-type': 'application/json', 
      'x-requested-with': 'XMLHttpRequest',
      'Accept': 'text/json',
      'Authorization': ''
    }
  }

  setAuthorization(token) {
    this.header.Authorization = 'Bearer '+token
  }

  getAuthorization() {
    return this.header.Authorization;
  }

  getHeader() {
    return this.header
  }
}

module.exports = new Net;