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

function getAllowedRegion(ondonecallback, onfailcallback = null){
    ondonecallback({"allowed_region": [[67.546, 33.28], [68, 34]]});
}