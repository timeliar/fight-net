<template>

  <v-navigation-drawer>
    <v-sheet class="pa-4" color="grey-lighten-4">
      <div class="d-flex align-center justify-space-around">
        <v-avatar class="mb-4" color="grey-darken-1" size="64">
          <v-img :alt="userStore.getUserInfo?.username"
            src="https://upload.wikimedia.org/wikipedia/commons/e/eb/WoW_icon.svg"></v-img>
        </v-avatar>
      </div>
      <div class="d-flex align-center justify-space-around">
        {{ userStore.getUserInfo?.username }}
      </div>
    </v-sheet>

    <v-divider></v-divider>

    <v-list>
      <v-list-item>
        在线状态：
        <v-chip :color="userStore.getUserInfo?.online ? 'green' : 'grey'" small>
          {{ userStore.getUserInfo?.online ? '在线' : '离线' }}</v-chip>
      </v-list-item>
      <v-list-item>
        最后登录：
        {{ new Date(userStore.getUserInfo?.last_login || '').toLocaleString() || '未知' }}
      </v-list-item>
      <v-list-item>
        版本：
        {{ Expansion[userStore.getUserInfo?.expansion] || '未知' }}
      </v-list-item>
      <v-list-item>
        锁定状态：
        <v-chip :color="userStore.getUserInfo?.locked ? 'red' : 'green'" small>
          {{ userStore.getUserInfo?.is_locked ? '已锁定' : '未锁定' }}</v-chip>
      </v-list-item>
      <v-list-item>
        语言：
        {{ Locale[userStore.getUserInfo?.locale] || '未知' }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-main class="d-flex align-center justify-center">
    <v-container>
      <v-sheet width="100%">
        <v-template v-for="(realm, i) in realms" :key="i">
          <v-card max-width="400" color="blue-grey-lighten-5">
            <v-card-title primary-title>
              {{ realm?.name }}
            </v-card-title>
            <v-card-subtitle>
              客户端 <code>WTF/Config.wtf</code> 配置如下： <br>
              <v-chip label>
                SET realmlist "{{ realm?.address }}"
              </v-chip>
            </v-card-subtitle>
            <v-card-text>
              地址：{{ realm?.address }} <br>
              端口：{{ realm?.port }} <br>
              版本：{{ realm?.gamebuild }} <br>
              时区：{{ RealmTimezone[realm?.timezone] }} <br>
              类型：<v-chip color="warning" size="x-small">{{ RealmIcon[realm?.icon] }}</v-chip>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn rounded size="small" dark color="success" @click="showRealmCharacters(realm?.id)">
                角色数：{{ realm?.numCharacters }}
              </v-btn>
              <v-btn rounded size="small" dark color="blue" class="ml-3" prepend-icon="mdi-currency-usd"
                @click="showRealmRates(realm?.rates)">
                倍率
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-template>
      </v-sheet>
    </v-container>
  </v-main>
  <v-dialog v-model="realmCharactersDialog" width="auto">
    <v-card prepend-icon="mdi-card-account-details-outline" title="角色">
      <v-card-text>
        <v-data-iterator :items="realmCharacters" item-value="name">
          <template v-slot:default="{ items, isExpanded, toggleExpand }">
            <v-card v-for="item in items" :key="item.raw.name" max-width="500" class="mb-2">
              <v-card-title class="d-flex align-center">
                <v-icon :color="item.raw.color" :icon="item.raw.icon" size="18" start></v-icon>
                <v-avatar color="grey" class="mr-2">
                  <v-img :src="getCharClassIcon(item.raw.class)" cover></v-img>
                </v-avatar>
                <v-avatar color="grey">
                  <v-img :src="getRaceIcon(item.raw.race, item.raw.gender)" cover></v-img>
                </v-avatar>
                <v-btn :color="item.raw.online ? 'green' : 'grey'" class="ml-3"
                  :prepend-icon="item.raw.online ? 'mdi-wifi' : 'mdi-wifi-off'">
                  {{ item.raw.name }}
                </v-btn>
                <v-chip size="small" color="blue" class="ml-3">
                  Lv.{{ item.raw.level }}
                </v-chip>
                <v-chip size="small" :color="item.raw.playerFlags & 16 ? 'grey' : 'green'" class="ml-3">
                  {{ item.raw.playerFlags & 16 ? '死了' : '活着' }}
                </v-chip>
              </v-card-title>

              <v-card-text>
                <v-list>
                  <v-list-item>升到下一级所需经验：{{ item.raw.xp }}</v-list-item>
                  <v-list-item>金钱：
                    <v-chip size="small" color="yellow-accent-4" variant="flat">{{ item.raw.money.gold }}金</v-chip>
                    <v-chip size="small" class="ml-1" color="blue-grey-lighten-2" variant="flat">{{ item.raw.money.silver }}银</v-chip>
                    <v-chip size="small" class="ml-1" color="brown-darken-1" variant="flat">{{ item.raw.money.copper }}铜</v-chip>
                  </v-list-item>
                </v-list>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn size="small" prepend-icon="mdi-tshirt-crew"
                  :append-icon="`${isExpanded(item) ? 'mdi-arrow-up' : 'mdi-arrow-down'}`"
                  :model-value="isExpanded(item)" @click="() => loadCharacterEquipments(item, toggleExpand)">
                  角色装备
                </v-btn>
              </v-card-actions>

              <v-divider></v-divider>

              <v-expand-transition>
                <div v-if="isExpanded(item)">
                  <v-list :lines="false" density="compact">
                    <v-list-item v-for="(equipment, idx) in item.equipments" :key="idx">
                      <v-btn>{{ ItemEquipmentPosition.get(equipment.index) }}</v-btn>
                      <v-chip class="ml-2" :color="ItemQualityColorMap.get(equipment.quality)" variant="flat">
                        {{ equipment.zhCNName }}
                      </v-chip>
                    </v-list-item>
                  </v-list>
                </div>
              </v-expand-transition>
            </v-card>
          </template>
        </v-data-iterator>
      </v-card-text>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="关闭" color="red" @click="realmCharactersDialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="realmRatesDialog" width="auto">
    <v-card prepend-icon="mdi-currency-usd" title="倍率">
      <v-card-text>
        <v-list :items="realmRates" item-icon="icon">
          <v-list-item v-for="(item, i) in realmRates" :key="i" :value="item">
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="关闭" color="red" @click="realmRatesDialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/client_auth"
const userStore = useUserStore()
const realmCharactersDialog = ref(false)
const realmCharacters = ref([])
const realmRatesDialog = ref(false)
const realmRates = ref<{ title: string; icon: string }[]>([])
onMounted(async () => {
  if (!await userStore.loadAuthUser()) {
    return navigateTo('/login')
  }
})
import { Gender, Expansion, Locale, CharClass, Race, getCharClassIcon, getRaceIcon, RealmIcon, RealmTimezone, ItemQualityColorMap, ItemEquipmentPosition } from "~/shared/enums"
import axios from 'axios';
const realms = ref([])
axios.get('/api/realmlist').then((response) => {
  realms.value = response.data
})

function showRealmCharacters(realmId: number) {
  axios.get(`/api/realmlist/${realmId}/characters`).then((response) => {
    realmCharacters.value = response.data.result.characters
    realmCharactersDialog.value = true
  })
}

function showRealmRates(rates: object) {
  realmRates.value = [
    { title: `金钱掉落：x${rates.dropMoney}`, icon: "mdi-gold" },
    { title: `任务经验：x${rates.xpQuest}`, icon: "mdi-panda" },
    { title: `探索经验：x${rates.xpExplore}`, icon: "mdi-paw" },
    { title: `生命恢复：x${rates.health}`, icon: "mdi-medication" },
    { title: `魔力恢复：x${rates.mana}`, icon: "mdi-battery-charging" },
    { title: `专注恢复：x${rates.focus}`, icon: "mdi-creation" },
    { title: `能量恢复：x${rates.energy}`, icon: "mdi-ev-station" },
    { title: `绿装掉落：x${rates.dropItemUncommon}`, icon: "mdi-scanner" },
    { title: `蓝装掉落：x${rates.dropItemRare}`, icon: "mdi-radio-handheld" },
    { title: `紫装掉落：x${rates.itemEpic}`, icon: "mdi-cellphone" },
    { title: `传奇掉落：x${rates.itemLenendary}`, icon: "mdi-laptop" },
  ]
  realmRatesDialog.value = true
}

function loadCharacterEquipments(character: any, toggleExpand: Function) {
  axios.get(`/api/character/${character.raw.guid}/equipments`).then((response) => {
    character.equipments = response.data.result.equipments
    toggleExpand(character)
  })
}
</script>
<style scoped lang="scss"></style>