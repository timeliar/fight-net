export function parseMoney(money: number) {
    return {
        gold: Math.floor(money / 10000),
        silver: Math.floor((money % 10000) / 100),
        copper: (money % 100)
    }
}