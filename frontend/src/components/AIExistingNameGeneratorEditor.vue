<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios'

const { itemRoot } = defineProps<{
    itemRoot: any
}>()
const apiErrorMessage = ref("");
const dishName = ref("")
const nameUpdated = ref(false)
const fetchLoadingService = ref(false);
const loadingService = ref(false);
const squareErrorMessage = ref("");
const loadingSubmitService = ref(false);
const dishNames = ref<Array<string>>()
const emit = defineEmits(['closeModal'])

const closeModal = () => {
    emit('closeModal');
}
const generateNames = async () => {
    apiErrorMessage.value = "";
    fetchLoadingService.value = true;
    dishName.value = itemRoot.itemData.name
    const postData = {
        name: dishName.value,
    };
    try {
        const response = await axios.post(import.meta.env.VITE_API_URL + "/api/ai/generate-name", postData, { withCredentials: true })
        if (response.status == 200 && response.data.response.status == "ok") {
            const dishNamesResponse = JSON.parse(response.data.response.names)
            dishNames.value = dishNamesResponse
        } else {
            apiErrorMessage.value = response.data.response.error
        }
    } catch (e: any) {
        apiErrorMessage.value = "Something went wrong. " + e.message
    }
    fetchLoadingService.value = false;
}
generateNames();

const updateToSquare = async () => {
    apiErrorMessage.value = "";
    nameUpdated.value = false;
    squareErrorMessage.value = "";
    if (dishName.value == "" || itemRoot.itemData.name == dishName.value) {
        squareErrorMessage.value = "Please select a name from this list if you wish to update."
        loadingService.value = false;
        return;
    }
    loadingSubmitService.value = true;

    const updateData = itemRoot;
    updateData.itemData.name = dishName.value
    try {
        const response = await axios.post(import.meta.env.VITE_API_URL + "/api/square/update-item", updateData, { withCredentials: true })
        if (response.status == 200) {
            updateData.version = response.data.responseData.data.result.catalogObject.version
            nameUpdated.value = true
            setTimeout(function () {
                nameUpdated.value = false;
            }, 5000);

        } else {
            squareErrorMessage.value = JSON.stringify(response)
        }
    } catch (e: any) {
        squareErrorMessage.value = "Something went wrong. " + e.message
    }
    loadingSubmitService.value = false;
}
</script>
<template>
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div class="relative w-full max-w-4xl max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" @click="closeModal"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="authentication-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
                <div class="px-6 py-6 lg:px-8">

                    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{{ itemRoot.itemData.name }}</h3>
                    <div role="status" v-if="fetchLoadingService" class="flex justify-center">
                        <svg aria-hidden="true"
                            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor" />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill" />
                        </svg>
                        <span>Performing generative AI magic. Kindly wait while we Load a few names...</span>
                    </div>

                    <div v-if="apiErrorMessage != ''"
                        class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                        role="alert">
                        {{ apiErrorMessage }}
                    </div>
                    <div class="flex flex-wrap">
                        <div v-for="dish in dishNames"
                            class="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-700 w-1/2">
                            <input :id="dish" type="radio" :value="dish" v-model="dishName"
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                            <label :for="dish"
                                class="w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                {{ dish }}</label>
                        </div>
                    </div>
                    <div v-if="squareErrorMessage != ''"
                        class="p-4 mb-4 mt-6 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                        role="alert">
                        {{ squareErrorMessage }}
                    </div>
                    <div class="mt-6 ">
                        <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">You
                            selected (Edit this name here, before final submission)</label>
                        <input type="text" id="first_name" v-model="dishName"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Enter dish name to generate alternative name options" required>
                    </div>
                    <div v-if="nameUpdated" class="mt-6 flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                        role="alert">
                        <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span class="sr-only">Info</span>
                        <div>
                            <span class="font-medium">Success!</span> Name updation is successful.
                        </div>
                    </div>
                    <div
                        class="mt-6 flex items-center align-middle justify-between  pt-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <div class="flex flex-1  p-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                            role="alert">
                            <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span class="sr-only">Info</span>
                            <div>
                                By clicking on update, this will be updated to sqaure system
                            </div>
                        </div>
                        <div class="text-sm text-slate-500 py-2.5"></div>
                        <button type="button" @click="updateToSquare"
                            class="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 mb-2">
                            <svg v-if="loadingSubmitService" aria-hidden="true" role="status"
                                class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor" />
                            </svg>
                            Update to Sqaure Database
                        </button>
                    </div>
                    <!-- <div class="grid grid-cols-4 gap-x-12 w-full">
                        
                        <div class="">
                            <label for="first_name"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Generated Names</label>
                                            <hr class="my-2 h-px border-t-0 bg-blue-300 opacity-100 dark:opacity-50" />
                            <ul class="w-96">
                                <li v-for="dish in dishNames"
                                    class="w-full border-b-2 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50">
                                    {{dish}}
                                </li>
                            </ul>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
</div></template>