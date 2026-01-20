// import Swal from "sweetalert2";
var ApiCaller = function ({ axios, finallyCallback = null, loginUrl = '/Account/Login' }) {

  this.axios = axios;
  this.defaultFinallyCallback = finallyCallback;
  this.loginUrl = loginUrl;

  console.log(this.axios, this.defaultFinallyCallback);

  let self = this;

  this.download = function ({
    apiItem,
    exceptionCallback = null,
    finallyCallback = null
  }) {
    let _axios = self.axios(
      {
        url: apiItem.uri,
        method: 'GET',
        responseType: 'blob', // Important
      }
    );
    self.doCallbacks(_axios, exceptionCallback, finallyCallback);
    return _axios;
  }

  this.call = async function ({
    apiItem = null,
    data = null,
    exceptionCallback = null,
    finallyCallback = null
  }) {
    if (apiItem.method == 'get') {
      return await self.get(apiItem, exceptionCallback, finallyCallback);
    } else {
      return await self.post(apiItem, data, exceptionCallback, finallyCallback);
    }
  }
  this.post = async function (api, payload, exceptionCallback, finallyCallback) {
    console.log('window.__RequestVerificationToken', window.__RequestVerificationToken);
    let _axios = self.axios.post(api.uri, payload, {
      headers: {
        //'Content-Type': 'application/json',
        'RequestVerificationToken': window.RequestVerificationToken,
        '__RequestVerificationToken': window.__RequestVerificationToken
      }
    });
    // .catch((e) => {
    //   //console.log(e);
      
    // });
    //self.doCallbacks(_axios, exceptionCallback, finallyCallback);
    return _axios;
  }
  this.get = async function (api, exceptionCallback, finallyCallback) {
    console.log('window.__RequestVerificationToken', window.__RequestVerificationToken);
    let _axios = self.axios.get(api.uri, {
      headers: {
        //'Content-Type': 'application/json',
        'RequestVerificationToken': window.__RequestVerificationToken
      }
    });
    self.doCallbacks(_axios, exceptionCallback, finallyCallback);
    return _axios;
  }

  this.doCallbacks = function (axios, exceptionCallback, finallyCallback) {
    if (exceptionCallback == null) {
      axios.catch(self.defaultExceptionCallback);
    } else {
      axios.catch(exceptionCallback);
    }
    if (finallyCallback == null && self.defaultFinallyCallback != null) {
      axios.finally(self.defaultFinallyCallback);
    }
    return axios;
  }

  this.defaultExceptionCallback = function (e) {
    console.log('exception', e);
    //console.log(e.response.status)
    if (e.response.status == 401) {
      // Swal.fire({
      //   //title: "The Internet?",
      //   text: '您尚未登入或登入逾時，請重新登入系統',
      //   icon: "warning"
      // }).then(() => {
      //   location.href = self.loginUrl;//'/Exhibitor/Application';//'/home/login';
      // });
      alert('您尚未登入或登入逾時，請重新登入系統');
      location.href = self.loginUrl;
    } else {
      let errMsg = '';
      if (e.response.status == 400) {
        //alert(e.response.data.errorMessage);
        errMsg = e.response.data.errorMessage;
      } else {
        //alert('something went wrong!')
        errMsg = 'something went wrong! please check system log!';
      }
      // Swal.fire({
      //   //title: "The Internet?",
      //   text: errMsg,
      //   icon: "warning"
      // });
      alert(errMsg);
    }

     
  }


}
export { ApiCaller }