<template>
    <v-sheet class="pa-12" color="grey-lighten-3">
        <v-card class="mx-auto" max-width="400">
            <v-card-text>
                <v-form validate-on="submit lazy" @submit.prevent="submit">
                    <v-text-field density="compact" placeholder="Login account" prepend-inner-icon="mdi-account"
                        variant="outlined" v-model="username" :readonly="loading" :error-messages="usernameError"
                        label="账号"></v-text-field>
                    <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
                        prepend-inner-icon="mdi-lock-outline" variant="outlined" :error-messages="passwordError"
                        @click:append-inner="visible = !visible" v-model="password" :readonly="loading"
                        label="密码"></v-text-field>
                    <v-btn :loading="loading" class="mb-8" color="blue" size="large" variant="elevated" text="登录"
                        type="submit" block></v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </v-sheet>
    <v-dialog v-model="dialog" transition="dialog-top-transition" width="auto">
        <v-card>
            <v-card-text>
                {{ dialogText }}
            </v-card-text>
            <template v-slot:actions>
                <v-btn class="ms-auto" color="error" v-show="failedBtn" text="失败" @click="dialog = false"></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios';
import { loginAccount } from '@/shared/validation.ts'
import { z } from 'zod';
import { useUserStore } from "~/store/client_auth"
const userStore = useUserStore()

const loading = ref(false)
const username = ref('')
const usernameError = ref([])
const password = ref('')
const passwordError = ref([])
const dialog = ref(false)
const failedBtn = ref(false)
const dialogText = ref('')
const visible = ref(false)

async function submit(event) {
    loading.value = true
    const parseResult = loginAccount.safeParse({
        username: username.value,
        password: password.value
    })

    if (!parseResult.success) {
        usernameError.value = z.flattenError(parseResult.error).fieldErrors.username || [];
        passwordError.value = z.flattenError(parseResult.error).fieldErrors.password || [];
        loading.value = false;
        return
    }
    axios.post('/api/login', parseResult.data).then(async (response) => {
        loading.value = false
        if (response.data.success) {
            await userStore.login(response.data.result.token)
            navigateTo('/')
        } else {
            failedBtn.value = true
            dialogText.value = response.data.message || "登录失败"
            dialog.value = true
        }
    }).catch((error) => {
        loading.value = false
        dialogText.value = "登录异常"
        failedBtn.value = true
    });
}
</script>