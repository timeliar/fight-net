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
        <v-card variant="flat">
          <v-card-title primary-title>
            服务器列表
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="(realm, i) in realms" :key="i" cols="12" md="4" sm="12">
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
                    <v-chip size="small" dark color="success">
                      角色数：{{ realm?.numCharacters }}
                    </v-chip>
                    <v-btn rounded size="small" dark color="blue" class="ml-3" prepend-icon="mdi-currency-usd"
                      @click="showRealmRates(realm?.rates)">
                      倍率
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-sheet>
      <v-sheet class="mt-2">
        <v-card variant="flat">
          <v-card-title primary-title>
            角色列表
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="character in realmCharacters" :key="character?.guid" cols="12" lg="4" md="6" sm="12">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-avatar color="grey">
                      <v-img :src="getCharClassIcon(character?.class)" cover></v-img>
                    </v-avatar>
                    <v-avatar color="grey" class="ml-2">
                      <v-img :src="getRaceIcon(character?.race, character?.gender)" cover></v-img>
                    </v-avatar>
                    <v-btn :color="character?.online ? 'green' : 'grey'" class="ml-3 text-none"
                      :prepend-icon="character?.online ? 'mdi-wifi' : 'mdi-wifi-off'">
                      {{ character?.name }}
                    </v-btn>
                  </v-card-title>
                  <v-card-subtitle>
                    <v-chip size="small" color="blue" class="ml-3">
                      Lv.{{ character?.level }}
                    </v-chip>
                    <v-chip size="small" :color="character.playerFlags & 16 ? 'grey' : 'green'" class="ml-3">
                      {{ character?.playerFlags & 16 ? '死了' : '活着' }}
                    </v-chip>
                  </v-card-subtitle>
                  <v-card-text>
                    <v-list>
                      <v-list-item>升到下一级所需经验：{{ character?.xp }}</v-list-item>
                      <v-list-item>金钱：
                        <v-chip size="small" color="yellow-accent-4" variant="flat">{{ character?.money.gold
                        }}金</v-chip>
                        <v-chip size="small" class="ml-1" color="blue-grey-lighten-2" variant="flat">{{
                          character?.money.silver
                        }}银</v-chip>
                        <v-chip size="small" class="ml-1" color="brown-darken-1" variant="flat">{{
                          character?.money.copper
                        }}铜</v-chip>
                      </v-list-item>
                    </v-list>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn size="small" prepend-icon="mdi-tshirt-crew"
                      :append-icon="character?.equipmentExpand ? 'mdi-arrow-up' : 'mdi-arrow-down'"
                      @click="expandCharacterEquipments(character)">
                      角色装备
                    </v-btn>
                  </v-card-actions>

                  <v-divider></v-divider>

                  <v-expand-transition>
                    <div v-if="character?.equipmentExpand">
                      <v-list :lines="false" density="compact">
                        <v-list-item v-for="(equipment, idx) in character?.equipments" :key="idx">
                          <v-btn>{{ itemEquipmentPositionName(equipment.index) }}</v-btn>
                          <v-chip class="ml-2" :color="ItemQualityColorMap.get(equipment.quality)" variant="flat">
                            {{ equipment.zhCNName }}
                          </v-chip>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-sheet>
    </v-container>
  </v-main>
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
import axios from 'axios';
const userStore = useUserStore()
const realmCharacters = ref([])
const realmRatesDialog = ref(false)
const realmRates = ref<{ title: string; icon: string }[]>([])
const realms = ref([])
onMounted(async () => {
  if (!await userStore.loadAuthUser()) {
    return navigateTo('/login')
  }
  axios.get('/api/realmlist').then((response) => {
    realms.value = response.data
  })
  showRealmCharacters();
})
import { Gender, Expansion, Locale, CharClass, Race, getCharClassIcon, getRaceIcon, RealmIcon, RealmTimezone, ItemQualityColorMap, itemEquipmentPositionName } from "~/shared/enums"


function showRealmCharacters() {
  axios.get(`/api/characters`).then((response) => {
    const characters = response.data.result.characters;
    for (const element of characters) {
      element.equipmentExpand = false;
    }
    realmCharacters.value = characters
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

function expandCharacterEquipments(character: any) {
  if (character.equipmentExpand) {
    character.equipmentExpand = false
    return;
  }
  axios.get(`/api/character/${character.guid}/equipments`).then((response) => {
    character.equipments = response.data.result.equipments
    character.equipmentExpand = true;
  })
}
</script>
<style scoped lang="scss"></style>