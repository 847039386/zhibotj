import Pyfl from 'pyfl';

class Tools {

    static getFirstLetter(field) {
        let newStr = '#';
        if (field) {
            const Letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            const py = Pyfl(field);
            const firstStr = py.slice(0, 1).toUpperCase();
            for (var i = 0; i < Letters.length; i++) {
                if (firstStr == Letters[i]) {
                    newStr = Letters[i];
                    return newStr;
                }
            }
        }
        return newStr;
    }

    static getDatasBySzm(datas) {
        var result = [];
        var optSzm = [];
        var optData = [];

        datas.forEach(item => {
            if (optSzm.length > 0) {
                var currentIndex = 0;
                var isSzm = false;
                for (var i = 0; i < optSzm.length; i++) {
                    if (optSzm[i] == item.szm) {
                        isSzm = true;
                        currentIndex = i;
                        break;
                    }
                }
                if (isSzm) {
                    optData[currentIndex].push(item)
                } else {
                    optSzm.push(item.szm);
                    optData.push([item])
                }

            } else {
                optSzm.push(item.szm);
                optData.push([item]);
            }
        });

        if (optSzm.length > 0) {
            optSzm.forEach((item, index) => {
                result.push({
                    szm: item,
                    datas: optData[index]
                })
            })
        }

        return result
    }

    /**
     * 
     * @param {number} ms //毫秒 
     * @returns 时分秒字符串
     */
    static getDateByTime = (ms = 0) => {
        let time = ms / 1000
        if (time < 60) {
            return time + "秒";
        } else {

            var min_total = Math.floor(time / 60); // 分钟
            var sec = Math.floor(time % 60); // 余秒
            if (min_total < 60) {
                return min_total + "分钟" + sec + "秒";
            } else {
                var hour_total = Math.floor(min_total / 60); // 小时数
                var min = Math.floor(min_total % 60); // 余分钟
                return hour_total + "小时" + min + "分钟" + sec + "秒";
            }

        }

    }

    static waitTime = (time = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };

    static getBill = (work) => {
        let reachDays = []
        let notReachDays = []
        let allReachDays = []
        let reach_day = 0
        let not_reach_day = 0
        let trial_day = 0
        let formal_day = 0
        let cost = 0
        let count = 0
        let selling_price = 0
        let profit = 0
        let play_time_total = 0
        let game = {
            trial_price: 0,
            formal_price: 0,
            custom_trial_price: 0,
            custom_formal_price: 0,
            play_time: 0,
            reach_day: 0
        }
        if (work) {
            if (work && work.status === 0) {
                game = work.game_id
            } else {
                game = work.history
            }
            if (work.tasks.length > 0) {
                count = work.tasks.length
                work.tasks.map((item, index) => {
                    play_time_total += item.work_time
                    if (game.reach_status === 0) {
                        if (item.work_time >= game.play_time * 60 * 60) {
                            if (item.contract_status === 1) {
                                formal_day += 1
                            } else {
                                trial_day += 1
                            }
                            reachDays.push(item)
                        } else {
                            notReachDays.push(item)
                        }
                    } else {
                        if (item.contract_status === 1) {
                            cost += Math.floor(game.formal_price * (item.work_time / 60 / 60))
                            selling_price += Math.floor(game.custom_formal_price * (item.work_time / 60 / 60))
                            formal_day += 1
                        } else {
                            cost += Math.floor(game.trial_price * (item.work_time / 60 / 60))
                            selling_price += Math.floor(game.custom_trial_price * (item.work_time / 60 / 60))
                            trial_day += 1
                        }
                        reachDays.push(Object.assign(item, { key: `reachDays${index}`, game: { formal_price: game.formal_price, trial_price: game.trial_price } }))
                    }
                    allReachDays.push(Object.assign(item, { key: `allReachDays${index}`, game: { formal_price: game.formal_price, trial_price: game.trial_price } }))
                })
                play_time_total = Math.floor(play_time_total / 60 / 60)
            }
            if (game.reach_status === 0) {
                reach_day = reachDays.length
                not_reach_day = count - reach_day
                cost = game.trial_price * trial_day + game.formal_price * formal_day
                selling_price = game.custom_trial_price * trial_day + game.custom_formal_price * formal_day
            }
            profit = cost - selling_price

        }
        return { count, cost, selling_price, profit, trial_day, formal_day, reach_day, not_reach_day, allReachDays, notReachDays, reachDays, game, play_time_total }
    }

    static numConvert = (num) => {
        if (num >= 10000) {
            num = (num / 10000).toFixed(2) + 'W';
        } else if (num >= 1000) {
            num = (num / 1000).toFixed(2) + 'K';
        }
        return num || 0;
    }

}




export default Tools;