<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
const businessName=ref('');
const getMerchantDetails=async()=>{
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL+"/api/square/merchant-details", { withCredentials: true });
      if (response.status = 200) {
        businessName.value=response.data.responseData.data.merchant.businessName;
      }
    } catch (error: any) {
    }
}
getMerchantDetails();
</script>
<template>
    <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div class="w-full flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="https://flowbite.com/" class="flex items-center">
                <img src="@/assets/logo-icon.png" class="h-8 mr-3" alt="Word Wok Logo">
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Word Wok</span>
            </a>
            <div class="flex md:order-2 items-center justify-center">
                <a href="tel:5541251234" class="mr-6 text-sm  text-gray-500 dark:text-white font-bold">Welcome, {{ businessName }} </a>
                <button
                    class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                    <span
                        class="relative px-4 py-2  transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Logout
                    </span>
                </button>
            </div>
        </div>
</nav>
</template>