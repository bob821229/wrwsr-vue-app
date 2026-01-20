class ApiTokenHelper {
  constructor(param = { apiCaller, AdminApi, refreshInterval }) {
    this.apiCaller = param.apiCaller;
    this.AdminApi = param.AdminApi;

    if (param.refreshInterval == null || param.refreshInterval == undefined) {
      this.refreshInterval = 1000 * 60 * 5; // default 5 分鐘
    } else {
      this.refreshInterval = param.refreshInterval;
    }

  }

  getToken = async function () {
    console.log('get token');
    let _api = copyJsonObject(this.AdminApi.General.token);
    let _axios = await this.apiCaller.call(
      {
        apiItem: _api,
        data: null,
      }).then((res) => {
        let responsePayload = res.data;
        //console.log('token', responsePayload.data);
        //window.__RequestVerificationToken = `${responsePayload.cookieToken}:${responsePayload.formToken}`;
        window.RequestVerificationToken = `${responsePayload.formToken}`;
        window.__RequestVerificationToken = `${responsePayload.cookieToken}`;
        
        console.log('window.__RequestVerificationToken', window.__RequestVerificationToken, window.RequestVerificationToken);
      });
  };

  autoRefreshToken = async function () {
    let self = this;
    await self.getToken();
    setInterval(async function () {
      console.log('auto refresh token');
      await self.getToken();
    }, this.refreshInterval);
  };
}

export { ApiTokenHelper }