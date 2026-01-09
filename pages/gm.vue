<template>
  <v-main>
    <v-container>
      <v-sheet class="mb-2">
        <v-card width="100%">
          <v-card-text>
            <v-row>
              <v-col cols="12" lg="3" md="6" sm="12">
                <v-text-field label="角色名" v-model="nameQuery" clearable variant="solo"
                  @update:model-value="loadCharacters"></v-text-field>
              </v-col>
              <v-col cols="12" lg="3" md="6" sm="12">
                <v-switch label="是否在线" v-model="onlineStat" color="primary"
                  @update:model-value="loadCharacters"></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-sheet>
      <v-sheet>
        <v-pagination :length="pageCount" v-model="currentPage" @update:modelValue="loadCharacters"
          color="secondary"></v-pagination>
        <v-row>
          <v-col v-for="character in characters" :key="character?.guid" cols="12" lg="4" md="6" sm="12">
            <v-card max-width="500">
              <v-card-title class="d-flex align-center">
                <v-avatar color="grey" class="mr-2">
                  <v-img :src="getCharClassIcon(character?.class)" cover></v-img>
                </v-avatar>
                <v-avatar color="grey">
                  <v-img :src="getRaceIcon(character?.race, character?.gender)" cover></v-img>
                </v-avatar>
                <v-btn :color="character.online ? 'green' : 'grey'" class="ml-3"
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
                    <v-chip size="small" color="yellow-accent-4" variant="flat">{{ character?.money?.gold }}金</v-chip>
                    <v-chip size="small" class="ml-1" color="blue-grey-lighten-2" variant="flat">{{
                      character?.money?.silver }}银</v-chip>
                    <v-chip size="small" class="ml-1" color="brown-darken-1" variant="flat">{{ character?.money?.copper
                    }}铜</v-chip>
                  </v-list-item>
                </v-list>
              </v-card-text>

              <v-card-actions>
                <v-btn size="small" color="warning" variant="flat" prepend-icon="mdi-gift"
                  @click="openSendItemDialog(character)">发送物品</v-btn>
                <v-spacer></v-spacer>
                <v-btn size="small" prepend-icon="mdi-tshirt-crew"
                  :append-icon="`${character?.equipmentExpand ? 'mdi-arrow-up' : 'mdi-arrow-down'}`"
                  @click="expandCharacterEquipments(character)">
                  角色装备
                </v-btn>
              </v-card-actions>

              <v-divider></v-divider>

              <v-expand-transition>
                <div v-if="character?.equipmentExpand">
                  <v-list :lines="false" density="compact">
                    <v-list-item v-for="(equipment, idx) in character.equipments" :key="idx">
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
        <v-pagination :length="pageCount" v-model="currentPage" @update:modelValue="loadCharacters"
          color="primary"></v-pagination>
      </v-sheet>
    </v-container>
    <v-dialog v-model="sendItemsDialog" transition="dialog-top-transition" max-width="500" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-h5 text-medium-emphasis ps-2">
            发送物品给：{{ sendItemTarget?.characterName }}
          </div>
          <v-btn icon="mdi-close" variant="text" @click="sendItemsDialog = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field label="标题" v-model="sendItemTarget.title" variant="solo"></v-text-field>
          <v-textarea label="内容" v-model="sendItemTarget.content" variant="solo"></v-textarea>
          <v-text-field label="物品：id1:cnt1 id2:cnt2..." v-model="sendItemTarget.itemList" variant="solo"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn @click="executeSendItems()" color="success" variant="flat">
            发送
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-main>
</template>
<script setup lang="ts">
import { Gender, Expansion, Locale, CharClass, Race, getCharClassIcon, getRaceIcon, RealmIcon, RealmTimezone, ItemQualityColorMap, itemEquipmentPositionName } from "~/shared/enums"
import axios from 'axios';
import { useUserStore } from "~/store/client_auth"
const userStore = useUserStore()
const characters = ref([])
const pageSize = ref(50)
const pageCount = ref(0)
const currentPage = ref(1)
const nameQuery = ref('')
const onlineStat = ref(true)
const sendItemsDialog = ref(false)
const sendItemTarget = ref({
  characterName: '',
  title: '',
  content: '',
  itemList: ''
})
onMounted(async () => {
  if (!await userStore.loadAuthUser()) {
    return navigateTo('/login')
  }
  if (!(userStore.userInfo.flag & 1)) {
    return navigateTo('/')
  }
  loadCharacters();
})

function loadCharacters() {
  axios.get(`/api/gm/characters`, {
    params: {
      page: currentPage.value,
      size: pageSize.value,
      nameQuery: nameQuery.value,
      online: onlineStat.value
    }
  }).then((response) => {
    const charactersResp = response.data.result.characters;
    const pageCountVal = Math.ceil(response.data.result.total / pageSize.value)
    if (pageCountVal < currentPage.value && pageCountVal > 1) {
      currentPage.value = 1
      loadCharacters()
      return;
    }
    pageCount.value = pageCountVal;
    for (const element of charactersResp) {
      element.equipmentExpand = false;
    }
    characters.value = charactersResp
  })
}
function expandCharacterEquipments(character: any) {
  if (character.equipmentExpand) {
    character.equipmentExpand = false
    return;
  }
  axios.get(`/api/gm/character/${character.guid}/equipments`).then((response) => {
    character.equipments = response.data.result.equipments
    character.equipmentExpand = true;
  })
}

function openSendItemDialog(character: any) {
  sendItemTarget.value.characterName = character.name;
  sendItemTarget.value.itemList = '';
  sendItemTarget.value.title = '';
  sendItemTarget.value.content = '';
  sendItemsDialog.value = true;
}

function executeSendItems() {
  axios.post(`/api/gm/sendItems`, sendItemTarget.value).then((response) => {
    if (response.data.success) {
      sendItemsDialog.value = false;
    } else {
      alert(response.data.errorMessage);
    }
  })
}
</script>