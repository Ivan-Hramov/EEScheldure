const axios = require("axios");
const activeRasp = new Map();
let groupsKeyBoard = [];

(async () => { //? Get groups list
    const res = [
        {
            "groupId": 6926,
            "groupCode": "AA-22"
        },
        {
            "groupId": 8658,
            "groupCode": "AA-23A"
        },
        {
            "groupId": 8660,
            "groupCode": "AA-23B"
        },
        {
            "groupId": 10343,
            "groupCode": "AA-24A"
        },
        {
            "groupId": 10344,
            "groupCode": "AA-24B"
        },
        {
            "groupId": 6927,
            "groupCode": "AV-22"
        },
        {
            "groupId": 6928,
            "groupCode": "EA-22"
        },
        {
            "groupId": 8657,
            "groupCode": "EA-23A"
        },
        {
            "groupId": 8659,
            "groupCode": "EA-23B"
        },
        {
            "groupId": 10341,
            "groupCode": "EA-24A"
        },
        {
            "groupId": 10342,
            "groupCode": "EA-24B"
        },
        {
            "groupId": 6929,
            "groupCode": "EV-22"
        },
        {
            "groupId": 8670,
            "groupCode": "FS-23"
        },
        {
            "groupId": 10354,
            "groupCode": "FS-24"
        },
        {
            "groupId": 5134,
            "groupCode": "IT-21E"
        },
        {
            "groupId": 5135,
            "groupCode": "IT-21V"
        },
        {
            "groupId": 6932,
            "groupCode": "IT-22E"
        },
        {
            "groupId": 6933,
            "groupCode": "IT-22V"
        },
        {
            "groupId": 8662,
            "groupCode": "IT-23A"
        },
        {
            "groupId": 8663,
            "groupCode": "IT-23B"
        },
        {
            "groupId": 10346,
            "groupCode": "IT-24A"
        },
        {
            "groupId": 10347,
            "groupCode": "IT-24B"
        },
        {
            "groupId": 8789,
            "groupCode": "KEE-23"
        },
        {
            "groupId": 8790,
            "groupCode": "KEV-23"
        },
        {
            "groupId": 8785,
            "groupCode": "KIT-23E"
        },
        {
            "groupId": 8786,
            "groupCode": "KIT-23V"
        },
        {
            "groupId": 3365,
            "groupCode": "KJE5-20"
        },
        {
            "groupId": 8791,
            "groupCode": "KMS-23"
        },
        {
            "groupId": 8787,
            "groupCode": "KTA-23E"
        },
        {
            "groupId": 8788,
            "groupCode": "KTA-23V"
        },
        {
            "groupId": 8792,
            "groupCode": "KTS-23E"
        },
        {
            "groupId": 8793,
            "groupCode": "KTS-23T"
        },
        {
            "groupId": 6931,
            "groupCode": "LA-22"
        },
        {
            "groupId": 6938,
            "groupCode": "MM-22"
        },
        {
            "groupId": 8668,
            "groupCode": "MM-23"
        },
        {
            "groupId": 10352,
            "groupCode": "MM-24"
        },
        {
            "groupId": 6930,
            "groupCode": "SA-22"
        },
        {
            "groupId": 8661,
            "groupCode": "SA-23"
        },
        {
            "groupId": 10345,
            "groupCode": "SA-24"
        },
        {
            "groupId": 5141,
            "groupCode": "TA-21E"
        },
        {
            "groupId": 5142,
            "groupCode": "TA-21V"
        },
        {
            "groupId": 6934,
            "groupCode": "TA-22E"
        },
        {
            "groupId": 6935,
            "groupCode": "TA-22V"
        },
        {
            "groupId": 8664,
            "groupCode": "TA-23A"
        },
        {
            "groupId": 8665,
            "groupCode": "TA-23B"
        },
        {
            "groupId": 10348,
            "groupCode": "TA-24A"
        },
        {
            "groupId": 10349,
            "groupCode": "TA-24B"
        },
        {
            "groupId": 8942,
            "groupCode": "TJE-23A"
        },
        {
            "groupId": 9209,
            "groupCode": "TJE-23B"
        },
        {
            "groupId": 9210,
            "groupCode": "TJE-23C"
        },
        {
            "groupId": 6936,
            "groupCode": "TT-22E"
        },
        {
            "groupId": 6937,
            "groupCode": "TT-22T"
        },
        {
            "groupId": 8666,
            "groupCode": "TT-23E"
        },
        {
            "groupId": 8667,
            "groupCode": "TT-23T"
        },
        {
            "groupId": 10350,
            "groupCode": "TT-24E"
        },
        {
            "groupId": 10351,
            "groupCode": "TT-24T"
        },
        {
            "groupId": 6939,
            "groupCode": "VM-22"
        },
        {
            "groupId": 8669,
            "groupCode": "VM-23"
        },
        {
            "groupId": 10353,
            "groupCode": "VM-24"
        }
    ]
    let groupsList = [];
    res.forEach(el => {
        if ((el.groupCode.includes('TA') || el.groupCode.includes('IT'))
        && !el.groupCode.includes('KTA') 
        && !el.groupCode.includes('KIT') 
        && !el.groupCode.includes('TA-21') 
        && !el.groupCode.includes('IT-21')) {        
            groupsList.push( { text: el.groupCode, callback_data: `rasp_${el.groupId}` } );
        }
    });
    for (let i = 0; i < groupsList.length; i += 3) {
        groupsKeyBoard.push(groupsList.slice(i, i + 3));
    }
})();

module.exports = {
    activeRasp,
    groupsKeyBoard
}