import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AddTaskModal from '../src/components/AddTaskModal.vue'

const columns = [
  { id: 'todo', title: '待办', color: '#5b8def' },
  { id: 'doing', title: '进行中', color: '#f0a24b' },
  { id: 'done', title: '已完成', color: '#4ecb8f' }
]

function mountModal(props = {}) {
  return mount(AddTaskModal, {
    props: { columns, existingCategories: ['开发', '设计'], ...props }
  })
}

describe('AddTaskModal', () => {
  it('渲染表单字段与三个看板列选项', () => {
    const wrapper = mountModal()
    expect(wrapper.find('#task-title').exists()).toBe(true)
    expect(wrapper.find('#task-desc').exists()).toBe(true)
    expect(wrapper.find('#task-category').exists()).toBe(true)
    expect(wrapper.findAll('.segmented__item')).toHaveLength(3)
  })

  it('空标题提交：不 emit submit 且显示错误提示', async () => {
    const wrapper = mountModal()
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.find('.field__error').exists()).toBe(true)
  })

  it('填写完整后提交：emit submit 且数据完整', async () => {
    const wrapper = mountModal()
    await wrapper.find('#task-title').setValue('完成设计稿')
    await wrapper.find('#task-desc').setValue('首页视觉走查')
    await wrapper.find('#task-category').setValue('设计')
    await wrapper.findAll('.segmented__item')[1].trigger('click')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect(wrapper.emitted('submit')[0][0]).toEqual({
      title: '完成设计稿',
      description: '首页视觉走查',
      category: '设计',
      columnId: 'doing'
    })
  })

  it('标题自动去除首尾空白', async () => {
    const wrapper = mountModal()
    await wrapper.find('#task-title').setValue('  修复登录 Bug  ')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')[0][0].title).toBe('修复登录 Bug')
  })

  it('点击取消按钮 emit close', async () => {
    const wrapper = mountModal()
    await wrapper.find('.modal-card__footer .btn-ghost').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('点击右上角关闭按钮 emit close', async () => {
    const wrapper = mountModal()
    await wrapper.find('.modal-card__header .icon-btn').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('分类自动补全：datalist 包含已有分类建议', () => {
    const wrapper = mountModal()
    const options = wrapper.findAll('#category-suggestions option')
    expect(options.map((o) => o.attributes('value'))).toEqual(['开发', '设计'])
  })

  it('未填写分类时提交 category 为空字符串', async () => {
    const wrapper = mountModal()
    await wrapper.find('#task-title').setValue('随便记一下')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')[0][0].category).toBe('')
  })
})