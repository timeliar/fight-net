export const enum Expansion {
    Classic = 0,
    TBC = 1,
    WotLK = 2,
}

export const enum Locale {
    enUS = 0,
    koKR = 1,
    frFR = 2,
    deDE = 3,
    zhCN = 4,
    zhTW = 5,
    esES = 6,
    esMX = 7,
    ruRU = 8,
}

export const enum Race {
    Human = 1,
    Orc = 2,
    Dwarf = 3,
    NightElf = 4,
    Undead = 5,
    Tauren = 6,
    Gnome = 7,
    Troll = 8,
    Goblin = 9,
    BloodElf = 10,
    Draenei = 11,
    FelOrc = 12,
    Naga = 13,
    Broken = 14,
    Skeleton = 15,
    Vrykul = 16,
    Tuskarr = 17,
    ForestTroll = 18,
    Taunka = 19,
    NorthrendSkeleton = 20,
    IceTroll = 21
}

export const enum RealmIcon {
    Normal = 0,
    PvP = 1,
    PVE = 4,
    RP = 6,
    RPPvP = 8
}

export const enum RealmTimezone {
    US = 2,
    LatinAmerica = 4,
    Korea = 6,
    English = 8,
    German = 9,
    French = 10,
    Spanish = 11,
    Russian = 12,
    Taiwan = 14,
    China = 16
}

export const enum Gender {
    Male = 0,
    Female = 1
}

export const enum CharClass {
    Warrior = 1,
    Paladin = 2,
    Hunter = 3,
    Rogue = 4,
    Priest = 5,
    DeathKnight = 6,
    Shaman = 7,
    Mage = 8,
    Warlock = 9,
    Druid = 11
}

export const CharClassKeyMap: Map<CharClass, string> = new Map([
    [CharClass.Warrior, "warrior"],
    [CharClass.Paladin, "paladin"],
    [CharClass.Hunter, "hunter"],
    [CharClass.Rogue, "rogue"],
    [CharClass.Priest, "priest"],
    [CharClass.DeathKnight, "deathknight"],
    [CharClass.Shaman, "shaman"],
    [CharClass.Mage, "mage"],
    [CharClass.Warlock, "warlock"],
    [CharClass.Druid, "druid"],
])

export const RaceKeyMap: Map<Race, string> = new Map([
    [Race.Human, "human"],
    [Race.Orc, "orc"],
    [Race.Dwarf, "dwarf"],
    [Race.NightElf, "nightelf"],
    [Race.Undead, "undead"],
    [Race.Tauren, "tauren"],
    [Race.Gnome, "gnome"],
    [Race.Troll, "troll"],
    [Race.Goblin, "goblin"],
    [Race.BloodElf, "bloodelf"],
    [Race.Draenei, "draenei"],
    [Race.FelOrc, "felorc"],
])

export const GenderKeyMap: Map<Gender, string> = new Map([
    [Gender.Male, "male"],
    [Gender.Female, "female"]
])

export function getRaceIcon(race: Race, gender: Gender): string {
    return `https://warcraft.wiki.gg/images/Charactercreate-races_${RaceKeyMap.get(race)}-${GenderKeyMap.get(gender)}.png?format=original`
}

export function getCharClassIcon(charClass: CharClass): string {
    return `https://warcraft.wiki.gg/images/Charactercreate-class_${CharClassKeyMap.get(charClass)}.png?format=original`
}

export enum ItemQuality {
    Grey = 0,
    White = 1,
    Green = 2,
    Blue = 3,
    Purple = 4,
    Orange = 5,
    RedArtifact = 6,
    Gold = 7,
}
export const ItemQualityColorMap: Map<ItemQuality, string> = new Map([
    [ItemQuality.Grey, "default"],
    [ItemQuality.White, "indigo-lighten-5"],
    [ItemQuality.Green, "green-darken-1"],
    [ItemQuality.Blue, "light-blue-darken-1"],
    [ItemQuality.Purple, "purple-darken-1"],
    [ItemQuality.Orange, "orange-darken-1"],
    [ItemQuality.RedArtifact, "red-darken-1"],
    [ItemQuality.Gold, "yellow-darken-1"],
])

export const ItemEquipmentPosition: Map<number, string> = new Map([
    [0, "头部"],
    [2, "颈部"],
    [4, "肩部"],
    [6, "衬衫"],
    [8, "身体"],
    [10, "腰部"],
    [12, "腿部"],
    [14, "脚部"],
    [16, "手腕"],
    [18, "手部"],
    [20, "戒指#1"],
    [22, "戒指#2"],
    [24, "饰品#1"],
    [26, "饰品#2"],
    [28, "背部"],
    [30, "主手"],
    [32, "副手"],
    [34, "远程"],
    [36, "战袍"],
    [38, "背包#1"],
    [40, "背包#2"],
    [42, "背包#3"],
    [44, "背包#4"],
])