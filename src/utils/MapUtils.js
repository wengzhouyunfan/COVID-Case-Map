//大家都可以用的工具类的静态方法公共函数 会专门写的这个folder中
//跟任何components都没有任何关系
export const MapUtils = {
    // aggregate county level raw data to states and nations levels
    convertCovidPoints: function(countyLevelPoints) {
        if (!countyLevelPoints) { // sanity check
                                  // check 是否为null
            return {};
        }

        let result = {  
            'county': countyLevelPoints, //现有数据
            'state': {//
            },
            'nation': {}
        };

        let stateData = {};
        // aggregate data by state
        for (const point of countyLevelPoints) {
            // sanity check
            if (Number.isNaN(point.stats.confirmed) || Number.isNaN(point.stats.deaths)) {
                console.error('Got dirty data', point);
                //看confirmed 的data是否是数字
                continue;
            }
            // Initialize the new province
            if (!stateData[point.province]) {
                stateData[point.province] = {
                    confirmed: 0,
                    deaths: 0,
                };
            }

            // aggregate
            stateData[point.province].confirmed += point.stats.confirmed;
            stateData[point.province].deaths += point.stats.deaths;

            // initialize坐标和country
            if (!stateData[point.province].coordinates) {
                stateData[point.province].coordinates = point.coordinates;
                //随机找到的第一个county的点作为该province的坐标
            }
            if (!stateData[point.province].country) {
                stateData[point.province].country = point.country;
            }
        }
        result['state'] = stateData;
        //------------
        // let nationData = {};
        // // aggregate data by nation
        // for (const point of countyLevelPoints) {
        //     // sanity check
        //     if (Number.isNaN(point.stats.confirmed) || Number.isNaN(point.stats.deaths)) {
        //         console.error('Got dirty data', point);
        //         //看confirmed 的data是否是数字
        //         continue;
        //     }
        //     // Initialize the new nation
        //     if (!nationData[point.country]) {
        //         nationData[point.country] = {
        //             confirmed: 0,
        //             deaths: 0,
        //         };
        //     }

        //     // aggregate
        //     nationData[point.country].confirmed += point.stats.confirmed;
        //     nationData[point.country].deaths += point.stats.deaths;

        //     // initialize坐标和country
        //     if (!nationData[point.country].coordinates) {
        //         nationData[point.country].coordinates = point.coordinates;
        //         //随机找到的第一个county的点作为该province的坐标
        //     }
        //     if (!nationData[point.province].country) {
        //         nationData[point.province].country = point.country;
        //     }
        // }
        // result['nation'] = nationData;

        //TODO: aggregate data by nation

        return result;
    },
    isInBoundary: function (bounds, coordinates) {
        return coordinates && bounds && bounds.nw && bounds.se && ((coordinates.longitude >= bounds.nw.lng && coordinates.longitude <= bounds.se.lng) || (coordinates.longitude <= bounds.nw.lng && coordinates.longitude >= bounds.se.lng))
            && ((coordinates.latitude >= bounds.se.lat && coordinates.latitude <= bounds.nw.lat) || (coordinates.latitude <= bounds.se.lat && coordinates.latitude >= bounds.nw.lat));
    }
};