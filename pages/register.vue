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
                    <v-text-field density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
                        variant="outlined" v-model="email" :readonly="loading" :error-messages="emailError" label="邮箱"
                        type="email"></v-text-field>
                    <v-btn :loading="loading" class="mb-8" color="cyan-darken-4" size="large" variant="elevated"
                        text="注册" type="submit" block></v-btn>
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
                <v-btn class="ms-auto" color="success" v-show="successBtn" text="成功" to="/login"></v-btn>
                <v-btn class="ms-auto" color="error" v-show="failedBtn" text="失败" @click="dialog = false"></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios';
import { registerAccount } from '@/shared/validation.ts'
import { z } from 'zod';

const loading = ref(false)
const username = ref('')
const usernameError = ref([])
const password = ref('')
const passwordError = ref([])
const email = ref('')
const emailError = ref([])
const visible = ref(false)
const dialog = ref(false)
const successBtn = ref(false)
const failedBtn = ref(false)
const dialogText = ref('')

async function submit(event) {
    loading.value = true
    const parseResult = registerAccount.safeParse({
        username: username.value,
        password: password.value,
        email: email.value
    })
    if (!parseResult.success) {
        usernameError.value = z.flattenError(parseResult.error).fieldErrors.username || [];
        passwordError.value = z.flattenError(parseResult.error).fieldErrors.password || [];
        emailError.value = z.flattenError(parseResult.error).fieldErrors.email || [];
        loading.value = false;
        return
    }
    axios.post('/api/register', parseResult.data).then((response) => {
        loading.value = false
        dialog.value = true
        if (response.data.success) {
            successBtn.value = true
            failedBtn.value = false
            dialogText.value = "注册成功"
        } else {
            successBtn.value = false
            failedBtn.value = true
            dialogText.value = response.data.errorMessage || "注册失败"
        }
    }).catch((error) => {
        loading.value = false
        dialogText.value = "注册失败"
        dialog.value = true
    });
    loading.value = false
}
</script>