function fetchCsrf(){}

const ADMIN_USER = {id: 1, username: "admin", fio: "Админ", group: "None"};
const PLAIN_USER = {id: 2, username: "plain", fio: "Петр Петров", group: "regular_user"};
const MANAGER_USER = {id: 3, username: "manager", fio: "Иван Иванов", group: "manager"};

const MOCK_USER = ADMIN_USER;

function tryFetchCurrentUser(onuserload, onfail){
    onuserload(MOCK_USER);
}

function logout(onlogout){}

function register(data, ondonecallback, onfailcallback = null){
    ondonecallback(MOCK_USER);
}

function login(data, ondonecallback, onfailcallback = null){
    ondonecallback(MOCK_USER);
}

function addPlace(data, ondonecallback, onfailcallback = null){
    ondonecallback({"id": 228, 
                    "place_type": 1, 
                    "owner": 1,
                    "name": data.name, 
                    "geometry": data.geometry,
                    "heighest_point": {
                        "type": "Point",
                        "coordinates": data.geometry.coordinates[0][0]
                    },
                    "heighest_elevation": 100500
                });
}

function updatePlace(id, data, ondonecallback, onfailcallback = null){
    ondonecallback({"id": 228, 
                    "place_type": 1, 
                    "owner": 1,
                    "name": data.name, 
                    "geometry": data.geometry,
                    "heighest_point": {
                        "type": "Point",
                        "coordinates": data.geometry.coordinates[0][0]
                    },
                    "heighest_elevation": 100500
                });
}

function getPlaces(ondonecallback, type_id = 1, onfailcallback = null) {
    ondonecallback([
        {
            "id": 19,
            "place_type": 1,
            "owner": 3,
            "name": "Парк",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            67.60444789182412,
                            33.69618068951904
                        ],
                        [
                            67.60331998482323,
                            33.69583741286222
                        ],
                        [
                            67.60148906454391,
                            33.6948075828918
                        ],
                        [
                            67.60175063327581,
                            33.690173348024786
                        ],
                        [
                            67.60335267853803,
                            33.68729840602396
                        ],
                        [
                            67.60513441753199,
                            33.69008752886057
                        ],
                        [
                            67.60444789182412,
                            33.69618068951904
                        ]
                    ]
                ]
            },
            "heighest_point": {
                "type": "Point",
                "coordinates": [
                    67.60166666666667,
                    33.69583333333333
                ]
            },
            "heighest_elevation": 510
        },
        {
            "id": 17,
            "place_type": 1,
            "owner": 3,
            "name": "16 км",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            67.59159245060104,
                            33.686567831035894
                        ],
                        [
                            67.5907583315104,
                            33.686911107692715
                        ],
                        [
                            67.58936806758294,
                            33.68519472440862
                        ],
                        [
                            67.58799407933238,
                            33.685409272319134
                        ],
                        [
                            67.58629284032459,
                            33.68480853816971
                        ],
                        [
                            67.58768328519592,
                            33.670433828165635
                        ],
                        [
                            67.59048028526928,
                            33.66966145568777
                        ],
                        [
                            67.59211580440665,
                            33.67283676476333
                        ],
                        [
                            67.59159245060104,
                            33.686567831035894
                        ]
                    ]
                ]
            },
            "heighest_point": {
                "type": "Point",
                "coordinates": [
                    67.58916666666667,
                    33.68666666666667
                ]
            },
            "heighest_elevation": 514
        },
        {
            "id": 20,
            "place_type": 1,
            "owner": 1,
            "name": "ЮОК",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            67.66338344239743,
                            33.693477437705845
                        ],
                        [
                            67.66053093327028,
                            33.69085685893034
                        ],
                        [
                            67.65762806342747,
                            33.69034194394513
                        ],
                        [
                            67.65586659716539,
                            33.69377471051329
                        ],
                        [
                            67.65609494281733,
                            33.700640243649566
                        ],
                        [
                            67.65707354196267,
                            33.70450210603873
                        ],
                        [
                            67.65792162832837,
                            33.705617755173364
                        ],
                        [
                            67.66118321432683,
                            33.7036439143967
                        ],
                        [
                            67.66291167173314,
                            33.6995245945149
                        ],
                        [
                            67.66338344239743,
                            33.693477437705845
                        ]
                    ]
                ]
            },
            "heighest_point": {
                "type": "Point",
                "coordinates": [
                    67.66333333333333,
                    33.6925
                ]
            },
            "heighest_elevation": 721
        },
        {
            "id": 18,
            "place_type": 1,
            "owner": 3,
            "name": "ул. Солнечная",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            67.60016249199664,
                            33.69055414666609
                        ],
                        [
                            67.59865833106494,
                            33.68888067296411
                        ],
                        [
                            67.59594405916678,
                            33.68746465675475
                        ],
                        [
                            67.5965163713609,
                            33.680942400275285
                        ],
                        [
                            67.60012979386464,
                            33.68188641108153
                        ],
                        [
                            67.60053851726065,
                            33.686048640545415
                        ],
                        [
                            67.60016249199664,
                            33.69055414666609
                        ]
                    ]
                ]
            },
            "heighest_point": {
                "type": "Point",
                "coordinates": [
                    67.59666666666666,
                    33.69083333333333
                ]
            },
            "heighest_elevation": 498
        }
    ]);
}

// function getElevation(latlng, ondonecallback, onfailcallback = null){
//     __get(HOST + ELEVATION + `/${latlng[0]}/${latlng[1]}`, ondonecallback, onfailcallback)
// }

function elevationExp(latlng, fraction, ondonecallback, onfailcallback = null){
    ondonecallback([
        [
            [
                67.59027777777779,
                33.68666666664018
            ],
            [
                67.59055555555555,
                33.6861111110849
            ],
            [
                67.59083333333334,
                33.68555555552962
            ],
            [
                67.59111111111112,
                33.68499999997434
            ],
            [
                67.59138888888889,
                33.68444444441905
            ],
            [
                67.59166666666667,
                33.68388888886377
            ],
            [
                67.59194444444445,
                33.68333333330849
            ],
            [
                67.59222222222222,
                33.68277777775321
            ],
            [
                67.5925,
                33.68222222219793
            ],
            [
                67.59277777777778,
                33.68166666664265
            ],
            [
                67.59305555555555,
                33.68111111108737
            ],
            [
                67.59333333333333,
                33.68055555553208
            ],
            [
                67.59333333333333,
                33.6799999999768
            ],
            [
                67.59305555555555,
                33.67944444442152
            ]
        ],
        [
            {
                "time": 4.58620650559485,
                "velocity_at_end": 1.2274656039800305,
                "delta_elevation": 9.0,
                "angle": 3.2790368847258837
            },
            {
                "time": 6.855676453956653,
                "velocity_at_end": 6.061718333967665,
                "delta_elevation": 16.0,
                "angle": 5.822517317378929
            },
            {
                "time": 7.6368397926824745,
                "velocity_at_end": 16.227732952476032,
                "delta_elevation": 26.0,
                "angle": 9.434784755355045
            },
            {
                "time": 4.1644747880568485,
                "velocity_at_end": 20.727947654624593,
                "delta_elevation": 22.0,
                "angle": 7.9936434909261616
            },
            {
                "time": 3.5045080110678946,
                "velocity_at_end": 24.514989065088734,
                "delta_elevation": 22.0,
                "angle": 7.9936434909261616
            },
            {
                "time": 3.706836522007549,
                "velocity_at_end": 29.449458727167748,
                "delta_elevation": 26.0,
                "angle": 9.434784755355045
            },
            {
                "time": 3.06591927463648,
                "velocity_at_end": 33.33864506704149,
                "delta_elevation": 25.0,
                "angle": 9.075035888257535
            },
            {
                "time": 2.8877735579371624,
                "velocity_at_end": 37.182793825152245,
                "delta_elevation": 26.0,
                "angle": 9.434784755355045
            },
            {
                "time": 1.3118912104890263,
                "velocity_at_end": 38.02582751071413,
                "delta_elevation": 15.0,
                "angle": 5.459752487195349
            },
            {
                "time": 0.6704061105049206,
                "velocity_at_end": 38.24713348470489,
                "delta_elevation": 10.0,
                "angle": 3.6429072039290964
            },
            {
                "time": 0.6666580270229545,
                "velocity_at_end": 38.46720218884894,
                "delta_elevation": 10.0,
                "angle": 3.6429072039290964
            },
            {
                "time": 0.7100102692155588,
                "velocity_at_end": 38.822609455381155,
                "delta_elevation": 9.0,
                "angle": 4.6347241465938
            },
            {
                "time": 0.03620991330019052,
                "velocity_at_end": 38.82325778085246,
                "delta_elevation": 5.0,
                "angle": 1.8223756389103065
            }
        ],
        "fraction is too high and angle is low"
    ]);
}


function getAllowedRegion(ondonecallback, onfailcallback = null){
    ondonecallback({"allowed_region": [[67.546, 33.28], [68, 34]]});
}