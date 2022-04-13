<template>
  <span>
    {{showDateTime(props.data)}}
  </span>
</template>>
<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  data: {
    type: String,
    default: '',
  }
})
function showDateTime(date) {
  if (date) {
    const p = new Date(date);
    return p.toLocaleString();
  }
  return date;
}
</script>
