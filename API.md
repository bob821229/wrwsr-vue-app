## 1. 取得水庫清單

- Method: GET
- URL: /SupIrrigDecisions/GetReservoirsList
- 功能說明: 取得水庫下拉選單資料

### Request

無

### Response

[
    {
        "StationNo": "10201",
        "StationName": "石門水庫"
    },
    {
        "StationNo": "30502",
        "StationName": "曾文水庫"
    },
    {
        "StationNo": "20101",
        "StationName": "鯉魚潭水庫"
    }
]

## 2. 取得最新更新時間

- Method: GET
- URL: /SupIrrigDecisions/GetLastUpdate
- 功能說明: 取得最新更新時間

### Request

無

### Response

{
    "LastUpdate": "115-04-02"
}

## 3. 取得初始蓄水量

- Method: POST
- URL: /SupIrrigDecisions/GetInitialWaterStorage
- 功能說明: 取得初始蓄水量

### Request

{
    "StationNo": "10201",
    "CompareDate": "2026-04-16"
}

### Response

{
    "EffectiveStorage": 3020.9
}

## 3. 取得歷年初始蓄水量

- Method: POST
- URL: /SupIrrigDecisions/GetHistoricalPeriod
- 功能說明: 取得歷年初始蓄水量

### Request

{
    "StationNo": "10201",
    "CompareDate": "04-16"
}

### Response

[
    {
        "Rank": 1,
        "Date": "1964-04-07",
        "EffectiveStorage": 0
    },
    {
        "Rank": 2,
        "Date": "1965-04-07",
        "EffectiveStorage": 4345
    }
]

## 4. 取得歷年初始蓄水量

- Method: POST
- URL: /SupIrrigDecisions/GetHistoricalPeriod
- 功能說明: 取得歷年初始蓄水量

### Request

{
    "StationNo": "10201",
    "CompareDate": "04-16"
}

### Response

[
    {
        "Rank": 1,
        "Date": "1964-04-07",
        "EffectiveStorage": 0
    },
    {
        "Rank": 2,
        "Date": "1965-04-07",
        "EffectiveStorage": 4345
    }
]

## 5. 取得入流量選項

- Method: POST
- URL: /SupIrrigDecisions/GetPiTypeValue
- 功能說明: 取得入流量選項

### Request

{
    "StationNo": "10201"
}

### Response

[
    {
        "label": "Q60",
        "value": "Q60"
    },
    {
        "label": "Q70",
        "value": "Q70"
    },
    {
        "label": "Q80",
        "value": "Q80"
    },
    {
        "label": "Q90",
        "value": "Q90"
    },
    {
        "label": "Q95",
        "value": "Q95"
    },
    {
        "label": "十年最枯",
        "value": "TenYear"
    },
    {
        "label": "I60",
        "value": "I60"
    },
    {
        "label": "I70",
        "value": "I70"
    },
    {
        "label": "I80",
        "value": "I80"
    },
    {
        "label": "I90",
        "value": "I90"
    },
    {
        "label": "I95",
        "value": "I95"
    }
]
## 6. 取得情境列表

- Method: POST
- URL: /SupIrrigDecisions/GetSolutionList
- 功能說明: 取得情境列表

### Request

{
    "StationNo": "10201"
}

### Response

[
    {
        "id": "s1001",
        "solutionName": "114年桃園石門灌溉計畫",
        "irrigationList": [
            {
                "ManageID": "NO1",
                "ManageName": "一期稻作桃園大圳",
                "WaterUsage": 17287,
                "IrrigationDate": "2026-01-01"
            },
            {
                "ManageID": "NO2",
                "ManageName": "一期稻作石門大圳",
                "WaterUsage": 5743,
                "IrrigationDate": "2026-01-01"
            }
        ]
    },
    {
        "id": "s1002",
        "solutionName": "情境二",
        "irrigationList": [
            {
                "ManageID": "NO3",
                "ManageName": "二期稻作桃園大圳",
                "WaterUsage": 7287,
                "IrrigationDate": "2026-01-01"
            },
            {
                "ManageID": "NO4",
                "ManageName": "二期稻作石門大圳",
                "WaterUsage": 4743,
                "IrrigationDate": "2026-01-01"
            }
        ]
    },
    {
        "id": "s1003",
        "solutionName": "情境三",
        "irrigationList": [
            {
                "ManageID": "NO5",
                "ManageName": "稻作桃園大圳",
                "WaterUsage": 37287,
                "IrrigationDate": "2026-01-01"
            },
            {
                "ManageID": "NO6",
                "ManageName": "稻作石門大圳",
                "WaterUsage": 15743,
                "IrrigationDate": "2026-01-01"
            }
        ]
    }
]

## 7. 取得安全蓄水線

- Method: POST
- URL: /SupIrrigDecisions/GetSafetyWaterLine
- 功能說明: 取得安全蓄水線

### Request

{
    "StationNo": "10201",
    "DemoStartDate": "2026-03-16",
    "SimuStartDate": "2026-04-16",
    "SimuEndDate": "2026-06-16",
    "EffectiveStorage": 3021,
    "CustomSafeWater": 4800
}

### Response

[
    {
    "DataDate": "2020/03/08",
    "SafeWater": 4800
    },
    {
    "DataDate": "2020/03/09",
    "SafeWater": 4800
    },
    {
    "DataDate": "2020/03/10",
    "SafeWater": 4800
    },
    {
    "DataDate": "2020/03/11",
    "SafeWater": 4800
    },
    {
    "DataDate": "2020/03/12",
    "SafeWater": 4800
    },....
]

## 8. 取得模擬結果

- Method: POST
- URL: /SupIrrigDecisions/SetSimulationParams
- 功能說明: 取得模擬結果

### Request

{
    "DemoStartDate": "2026-03-16",
    "EffectiveStorage": 3021,
    "SimuEndDate": "2026-06-16",
    "SimuStartDate": "2026-04-16",
    "SolutionPrefix": "114年桃園石門灌溉計畫",
    "StationNo": "10201",
    "WaterSetting": {
        "AdvancedSetting": {
            "CropTR": [
                {
                    "ManageID": "NO1",
                    "IrrigationDate": "2026-01-01",
                    "IrrigationAreaPercent": 1,
                    "WaterPercentOfFieldPeriod": 1,
                    "WaterPercentOfVegetativePeriod": 1
                },
                {
                    "ManageID": "NO2",
                    "IrrigationDate": "2026-01-01",
                    "IrrigationAreaPercent": 1,
                    "WaterPercentOfFieldPeriod": 1,
                    "WaterPercentOfVegetativePeriod": 1
                }
            ],
        },
        "InflowSetting": {
            "selectedInflows": [
                "Q60",
                "Q70"
            ]
        }
    }
}

### Response

[
    {
        "Soluction": "實際蓄水量",
        "Values": [
            {
                "Date": "2026/03/25",
                "Storage": 18415,
                "Inflow": 0,
                "Irrigation": 0
            },
            {
                "Date": "2026/03/26",
                "Storage": 16078,
                "Inflow": 0,
                "Irrigation": 0
            },....
        ]
    },
    {
        "Soluction": "期作-Q70",
        "Values": [
            {
                "Date": "2026/03/25",
                "Storage": 10510,
                "Inflow": 21,
                "Irrigation": 0
            },
            {
                "Date": "2026/03/26",
                "Storage": 10456,
                "Inflow": 21,
                "Irrigation": 0
            },...
        ]
    },....
]