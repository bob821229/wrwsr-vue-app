var Apis = {
    General: {
        token: {
            uri: "/api/Home/token",
            method: "get",
        },
        getGlossaryData: {
            uri: "/api/Home/getGlossaryData",
            method: "get",
        },
    },
    Account: {
        login: {
            uri: "/api/account/login",
            method: "post",
        },
    },
    SupIrrigDecisions: {
        GetLastUpdate: {
            uri: "/mock/SupIrrigDecisions/GetLastUpdate.json",
            method: "get",
        },
        GetInitialWaterStorage: {
            uri: "/mock/SupIrrigDecisions/GetInitialWaterStorage.json",
            method: "post",
        },
        GetHistoricalPeriod: {
            uri: "/mock/SupIrrigDecisions/GetHistoricalPeriod.json",
            method: "post",
        },
        GetReservoirsList: {
            uri: "/mock/SupIrrigDecisions/GetReservoirsList.json",
            method: "get",
        },
        GetPiTypeValue: {
            uri: "/mock/SupIrrigDecisions/GetPiTypeValue.json",
            method: "post",
        },
        GetSolutionList: {
            uri: "/mock/SupIrrigDecisions/GetSolutionList.json",
            method: "post",
        },
        SetSimulationParams: {
            uri: "/mock/SupIrrigDecisions/SetSimulationParams.json",
            method: "post",
        },
        GetSafetyWaterLine: {
            uri: "/mock/SupIrrigDecisions/GetSafetyWaterLine.json",
            method: "post",
        },
    },
    RainfallSituation: {
        getRawStatisticOptions: {
            uri: "/mock/RainfallSituation/GetRawStatisticOptions.json",
            method: "get",
        },
    },
};
export { Apis };
