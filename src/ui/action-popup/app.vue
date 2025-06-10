<script setup lang="ts">
import { Check } from 'lucide-vue-next';

const locale = ref('en');

const items = [
  {
    label: "English",
    value: "en"
  },
  {
    label: "简体中文",
    value: "zh"
  },
  {
    label: "日本語",
    value: "jo"
  },
];

const onChangeLocale = (langCode: string) => {
  locale.value = langCode;
  chrome.storage.local.set({ langCode })
}

onMounted(async () => {
  const { langCode = "en" } = await chrome.storage.local.get(["langCode"])
  locale.value = langCode;
})

</script>

<template>
  <div class=" w-[200px] p-3 ">
    <!-- <USelect v-model="locale" :items="items" class=" w-full " /> -->

    <ul>
      <li v-for="item in items" :key="item.value"
        class=" px-3 p-1 hover:bg-muted flex justify-between items-center rounded cursor-pointer  transition-all "
        @click="onChangeLocale(item?.value)">
        <p :class="locale === item.value ? 'font-semibold' : ''">{{ item.label }}</p>
        <div v-if="locale === item.value">
          <Check :size="14" color="#14ff00" />
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
