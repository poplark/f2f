<template>
  <span>
    {{showDateTime(props.data)}}
  </span>
</template>>
<script setup>
import { defineProps } from 'vue';
import { format } from 'date-fns';

const props = defineProps({
  data: {
    type: String,
    default: '',
  }
})
function showDateTime(date) {
  if (date) {
    return format(new Date(date), 'yyyy-MM-dd HH:mm');
  }
  return date;
}
</script>
