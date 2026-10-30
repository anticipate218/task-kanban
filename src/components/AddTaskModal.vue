<script setup>
import { reactive, ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  existingCategories: { type: Array, default: () => [] }
})

const emit = defineEmits(['submit', 'close'])

const form = reactive({
  title: '',
  description: '',
  category: '',
  columnId: 'todo'
})

const titleError = ref(false)
const titleInputRef = ref(null)

const categorySuggestions = computed(() => props.existingCategories)

watch(
  () => form.title,
  (val) => {
    if (val.trim()) titleError.value = false
  }
)

onMounted(async () => {
  document.addEventListener('keydown', onKeydown)
  await nextTick()
  titleInputRef.value?.focus()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

function submit() {
  if (!form.title.trim()) {
    titleError.value = true
    titleInputRef.value?.focus()
    return
  }
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category.trim(),
    columnId: form.columnId
  })
}

function onOverlayClick(e) {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click="onOverlayClick">
    <div class="modal-card" role="dialog" aria-modal="true" aria-label="新增任务">
      <header class="modal-card__header">
        <h3 class="modal-card__title">✨ 新增任务</h3>
        <button class="icon-btn" title="关闭弹窗" aria-label="关闭弹窗" @click="emit('close')">✕</button>
      </header>

      <form class="modal-card__form" novalidate @submit.prevent="submit">
        <div class="field" :class="{ 'field--error': titleError }">
          <div class="field__float">
            <input
              id="task-title"
              ref="titleInputRef"
              v-model="form.title"
              type="text"
              placeholder=" "
              autocomplete="off"
              maxlength="60"
            />
            <label for="task-title">任务标题 *</label>
          </div>
          <p v-if="titleError" class="field__error">标题不能为空，给任务起个名字吧</p>
        </div>

        <div class="field">
          <div class="field__float field__float--area">
            <textarea
              id="task-desc"
              v-model="form.description"
              rows="3"
              placeholder=" "
              maxlength="200"
            ></textarea>
            <label for="task-desc">任务描述（可选）</label>
          </div>
        </div>

        <div class="field">
          <div class="field__float">
            <input
              id="task-category"
              v-model="form.category"
              list="category-suggestions"
              placeholder=" "
              autocomplete="off"
              maxlength="12"
            />
            <datalist id="category-suggestions">
              <option v-for="c in categorySuggestions" :key="c" :value="c"></option>
            </datalist>
            <label for="task-category">分类（可选）</label>
          </div>
        </div>

        <div class="field">
          <span class="field__static">放入看板列</span>
          <div class="segmented" role="radiogroup" aria-label="选择看板列">
            <button
              v-for="col in columns"
              :key="col.id"
              type="button"
              class="segmented__item"
              :class="{ 'is-active': form.columnId === col.id }"
              :aria-pressed="form.columnId === col.id"
              @click="form.columnId = col.id"
            >
              <span class="segmented__dot" :style="{ background: col.color }"></span>
              {{ col.title }}
            </button>
          </div>
        </div>

        <footer class="modal-card__footer">
          <button type="button" class="btn btn-ghost" @click="emit('close')">取消</button>
          <button type="submit" class="btn btn-primary">创建任务</button>
        </footer>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background: rgba(15, 23, 42, 0.45);
  animation: fade-in 0.25s ease;
}

.modal-card {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  animation: pop-in 0.3s ease;
}

.modal-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-lg) var(--space-md);
  border-bottom: 1px solid var(--border);
}

.modal-card__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
}

.modal-card__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.field__float {
  position: relative;
}

.field__float input,
.field__float textarea {
  width: 100%;
  padding: 18px 12px 6px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color var(--transition-fast), background var(--transition-fast);
  resize: vertical;
}

.field__float input:focus,
.field__float textarea:focus {
  border-color: var(--primary);
  background: var(--surface);
}

.field__float label {
  position: absolute;
  left: 12px;
  top: 15px;
  color: var(--text-muted);
  pointer-events: none;
  transition: all var(--transition-fast);
}

.field__float input:focus ~ label,
.field__float input:not(:placeholder-shown) ~ label,
.field__float textarea:focus ~ label,
.field__float textarea:not(:placeholder-shown) ~ label {
  top: 4px;
  font-size: var(--font-size-xs);
  color: var(--primary);
}

.field--error .field__float input {
  border-color: var(--danger);
}

.field__error {
  font-size: var(--font-size-xs);
  color: var(--danger);
}

.field__static {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
}

.segmented {
  display: flex;
  gap: var(--space-xs);
  background: var(--bg-soft);
  padding: 4px;
  border-radius: var(--radius-sm);
}

.segmented__item {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 10px;
  border-radius: calc(var(--radius-sm) - 2px);
  color: var(--text-secondary);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.segmented__item.is-active {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-sm);
}

.segmented__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.modal-card__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding-top: var(--space-xs);
}

@media (max-width: 480px) {
  .segmented__item {
    flex-direction: column;
    gap: 2px;
    font-size: var(--font-size-xs);
  }
}
</style>