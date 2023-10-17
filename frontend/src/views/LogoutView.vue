<script setup lang="ts">
import { onMounted } from 'vue';


onMounted(() => {
  //window.location.href="/"
})
</script>
<template>
  <div class="about">
    <h3>You have been logged out. Redirecting now</h3>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
