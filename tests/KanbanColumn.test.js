import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KanbanColumn from '../src/components/KanbanColumn.vue'
import EmptyState from '../src/components/EmptyState.vue'

const column = { id: 'todo', title: '待办', color: '#5b8def' }

const tasks = [
  { id: 't1', title: '任务一', columnId: 'todo', starred: false, urgent: false, createdAt: Date.now() },
  { id: 't2', title: '任务二', columnId: 'todo', starred: true, urgent: false, createdAt: Date.now() }
]

describe('KanbanColumn', () => {
  it('渲染列标题与任务计数', () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: tasks } })
    expect(wrapper.find('.kanban-column__title').text()).toBe('待办')
    expect(wrapper.find('.kanban-column__count').text()).toBe('2')
  })

  it('空列时渲染 EmptyState 组件', () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: [] } })
    expect(wrapper.findComponent(EmptyState).exists()).toBe(true)
  })

  it('非空列时不渲染 EmptyState', () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: tasks } })
    expect(wrapper.findComponent(EmptyState).exists()).toBe(false)
  })

  it('drop 事件 emit move(taskId, columnId, null)', async () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: [] } })
    await wrapper.find('.kanban-column').trigger('drop', {
      dataTransfer: { getData: () => 't1' }
    })
    expect(wrapper.emitted('move')).toHaveLength(1)
    expect(wrapper.emitted('move')[0]).toEqual(['t1', 'todo', null])
  })

  it('dragover 时列进入拖放高亮状态', async () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: [] } })
    await wrapper.find('.kanban-column').trigger('dragover', {
      dataTransfer: { dropEffect: null }
    })
    expect(wrapper.find('.kanban-column').classes()).toContain('is-drag-over')
  })

  it('子卡片 toggle / remove 事件向上透传', async () => {
    const wrapper = mount(KanbanColumn, { props: { column, taskList: tasks } })
    await wrapper.find('.icon-btn--star').trigger('click')
    expect(wrapper.emitted('toggle')[0]).toEqual(['t1', 'starred'])

    await wrapper.find('.icon-btn--remove').trigger('click')
    expect(wrapper.emitted('remove')[0]).toEqual(['t1'])
  })

  it('showAddAction 为 true 时空状态显示新增按钮并透传 add 事件', async () => {
    const wrapper = mount(KanbanColumn, {
      props: { column, taskList: [], showAddAction: true }
    })
    const btn = wrapper.find('.empty-state__action')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')
    expect(wrapper.emitted('add')).toHaveLength(1)
  })
})