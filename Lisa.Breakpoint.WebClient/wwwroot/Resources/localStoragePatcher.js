import {Router} from "aurelia-router";

export class LocalStoragePatcher {
    static inject() {
        return [ Router ];
    }

    localStoragePatcher(oldData, newData, storageKey) {

        //Check if the new value is a string, if so it will check if it is unique and if it is it will add it to the localstorage
        if( typeof newData == "string" || newData instanceof String)
        {
            if (!oldData.indexOf("newData") > -1) {
                oldData.push(newData);
                localStorage.setItem(storageKey, JSON.stringify(oldData));
                return;
            }
            return;
        }

        // If there is no old data, create an empty array
        if (oldData === null) {
            oldData = [];
        }

        // if nothing is present, except and empty sting, the value will be Not Specified
        if (newData.length == 1 && newData[0] == "")   {
            newData[0] = "not specified";
        }

        // checks all values and gives and array back containing only the new unique ones
        var uniqueNew = newData.filter(function(obj) {
            return !oldData.some(function(obj2) {
                return obj == obj2;
            });
        });

        // Combines the 2 arrays
        var allData = oldData.concat(uniqueNew);

        // removes any empty strings if there are stille some left
        for(var i=0;i<allData.length;i++){
            if(allData[i] === "")   {
                allData.splice(i, 1);
            }
        }

        if (allData.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(allData));
        }
    }

}