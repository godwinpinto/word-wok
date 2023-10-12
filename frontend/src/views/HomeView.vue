<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';
import NavBar from '../components/NavBar.vue'
import FloatingLoader from '../components/FloatingLoader.vue'
import AIGeneratorEditor from '../components/AIGeneratorEditor.vue'
import AINameGeneratorEditor from '../components/AINameGeneratorEditor.vue'

const itemRoot = ref();
const showEditor = ref(false);
const showGenericNameEditor = ref(false);
const loadingIndicator = ref(false);

const products = ref<any>([]);
const getDashboard = async () => {
  try {
    loadingIndicator.value = true
    const response = await axios.get("/api/square/dashboard");
    if (response.status == 200) {
      products.value = response.data.responseData.data.objects;
    }
    console.log(response)
  } catch (error: any) {
    console.log(error.message);
  } finally {
    loadingIndicator.value = false
  }
}
getDashboard();

const reorderData = computed(() => {
  return [...products.value].sort((a, b) => {
    return b.itemData.categoryId.localeCompare(a.itemData.categoryId);
  });

});

const openAiEditor = (product: any) => {
  itemRoot.value = product;
  showEditor.value = true;

}

const openGenericNameEditor = () => {
  showGenericNameEditor.value = true;

}


const closeModalCallback = () => {
  console.log("HERE");
  showEditor.value = false;
  showGenericNameEditor.value=false;
}


</script>

<template>
  <nav>
    <NavBar />
  </nav>
  <main class="mt-24 mx-8">
    <div>
      <div class="grid grid-cols-4 gap-4 items-center">
        <div class="text-2xl font-bold col-span-1">Wok Dish Name</div>
        <div class="font-normal col-span-2 italic">Need an alternative name for dish? Try now!</div>
        <div class="font-bold col-span-1">
          <button type="button" @click="openGenericNameEditor"
            class="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
            <img src="@/assets/magic-wand.svg" class="h-4 text-white" />
            &nbsp;&nbsp;&nbsp;Generate a dish name
          </button>
        </div>
        <div class="col-span-4">
          <hr class="my-2 h-px border-t-0 bg-blue-300 opacity-100 dark:opacity-50" />
        </div>
      </div>
    </div>
    <div>
      <div class="grid grid-cols-4 gap-4 items-center mt-20">
        <div class="text-2xl col-span-4 font-bold">Wok your dish description</div>
        <div class="font-normal col-span-4 italic">Need a creative description for your dish?</div>
        <div class="col-span-4">
          <hr class="my-2 h-px border-t-0 bg-blue-300 opacity-100 dark:opacity-50" />
        </div>
      </div>
    </div>
    <div>
      <div class="grid grid-cols-4 gap-0 items-center  h-20">
        <div class="font-bold">Name</div>
        <div class="font-bold col-span-2">Description</div>
        <div class="font-bold">Edit Description</div>
        <div class="col-span-4">
          <hr class="my-2 h-px border-t-0 bg-blue-300 opacity-100 dark:opacity-50" />
        </div>
      </div>
      <div class="grid grid-cols-4 gap-2 items-start" v-for="(product, index) in reorderData" :key="index">
        <div class="h-24 ">{{ product.itemData.name }}</div>
        <div class="col-span-2">{{ product.itemData.description }}</div>
        <div class="">
          <button @click="openAiEditor(product)" type="button"
            class="bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  mr-2 mb-2 text-white">
            <img src="@/assets/magic-wand.svg" class="h-4 text-white" />
            &nbsp;&nbsp;&nbsp;Magic Editor
          </button>
        </div>
        <div class="col-span-4">
          <hr
            class="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
        </div>
      </div>
    </div>
  </main>
  <AIGeneratorEditor v-if="showEditor" :item-root="itemRoot" @closeModal="closeModalCallback" />

  <AINameGeneratorEditor v-if="showGenericNameEditor" @closeModal="closeModalCallback" />
  <FloatingLoader v-if="loadingIndicator" />
</template>
