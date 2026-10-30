<script setup>
defineProps({
  icon: { type: String, default: '🗂️' },
  title: { type: String, default: '暂无任务' },
  hint: { type: String, default: '' },
  actionText: { type: String, default: '' },
  actionIcon: { type: String, default: '＋' }
})

defineEmits(['action'])
</script>

<template>
  <div class="empty-state">
    <span class="empty-state__icon">{{ icon }}</span>
    <p class="empty-state__title">{{ title }}</p>
    <p v-if="hint" class="empty-state__hint">{{ hint }}</p>
    <button v-if="actionText" class="btn btn-ghost empty-state__action" @click="$emit('action')">
      {{ actionIcon }} {{ actionText }}
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xl) var(--space-md);
  text-align: center;
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-base);
}

.empty-state__icon {
  font-size: 34px;
  animation: empty-float 2.6s ease-in-out infinite;
}

.empty-state__title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

.empty-state__hint {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.empty-state__action {
  margin-top: var(--space-sm);
}

@keyframes empty-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
</style>