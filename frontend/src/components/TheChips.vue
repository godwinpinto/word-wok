<template>
    <div class="chips">
        <div v-for="(chip, index) in chips" :key="index" class="chip text-sm">
            {{ chip }}
            <button class="remove" @click="removeChip(index)">x</button>
        </div>
        <input v-model="newChip" @keydown.enter.prevent="addChip" placeholder="Add keywords" class="input text-sm w-full text-gray-900" />
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';


const chips = ref<Array<string>>([])
const newChip = ref('')

function addChip(this: any) {
    if (newChip.value.trim() !== '') {
        chips.value.push(newChip.value.trim());
        newChip.value = '';
        emit('updateChips',chips.value);
    }
}

const emit = defineEmits(['updateChips'])


function removeChip(index: any) {
    chips.value.splice(index, 1);
}
</script>
  
<style scoped>
.chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    border: 1px solid #ccc;
    padding: 2px;
    border-radius: 4px;
}

.chip {
    background-color: #e0e0e0;
    padding: 2px 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
}

.remove {
    background: none;
    border: none;
    cursor: pointer;
    margin-left: 4px;
}

.input {
    border: none;
    outline: none;
}
</style>