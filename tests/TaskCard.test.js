import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskCard from '../src/components/TaskCard.vue'

const baseTask = {
  id: 'task-1',
  title: '写周报',
  description: '整理本周完成事项',
  category: '工作',
  columnId: 'todo',
  starred: false,
  urgent: false,
  createdAt: Date.now()
}

function makeTask(overrides = {}) {
  return { ...baseTask, ...overrides }
}

describe('TaskCard', () => {
  it('渲染标题、描述与分类标签', () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    expect(wrapper.text()).toContain('写周报')
    expect(wrapper.text()).toContain('整理本周完成事项')
    expect(wrapper.find('.task-card__category').text()).toBe('工作')
  })

  it('卡片可拖拽（draggable 属性为 true）', () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    expect(wrapper.find('.task-card').attributes('draggable')).toBe('true')
  })

  it('点击星标按钮 emit toggle(taskId, starred)', async () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    await wrapper.find('.icon-btn--star').trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
    expect(wrapper.emitted('toggle')[0]).toEqual(['task-1', 'starred'])
  })

  it('点击紧急按钮 emit toggle(taskId, urgent)', async () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    await wrapper.find('.icon-btn--urgent').trigger('click')
    expect(wrapper.emitted('toggle')[0]).toEqual(['task-1', 'urgent'])
  })

  it('星标与紧急状态反映到样式类', () => {
    const wrapper = mount(TaskCard, {
      props: { task: makeTask({ starred: true, urgent: true }) }
    })
    const card = wrapper.find('.task-card')
    expect(card.classes()).toContain('is-starred')
    expect(card.classes()).toContain('is-urgent')
  })

  it('已完成列的卡片带 is-done 类且标题划线', () => {
    const wrapper = mount(TaskCard, {
      props: { task: makeTask({ columnId: 'done' }) }
    })
    expect(wrapper.find('.task-card').classes()).toContain('is-done')
    const title = wrapper.find('.task-card__title')
    expect(title.exists()).toBe(true)
  })

  it('点击删除按钮 emit remove(taskId)', async () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    await wrapper.find('.icon-btn--remove').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.emitted('remove')[0]).toEqual(['task-1'])
  })

  it('dragstart 时写入任务 id 到 dataTransfer', async () => {
    const wrapper = mount(TaskCard, { props: { task: makeTask() } })
    const dataTransfer = {
      data: {},
      setData(type, value) {
        this.data[type] = value
      }
    }
    Object.assign(dataTransfer, { effectAllowed: null })
    await wrapper.find('.task-card').trigger('dragstart', { dataTransfer })
    expect(dataTransfer.data['text/plain']).toBe('task-1')
  })
})