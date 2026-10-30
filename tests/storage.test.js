import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loadState, saveState, clearState, storageKey } from '../src/utils/storage'

const KEY = storageKey('test')

beforeEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  it('saveState / loadState 数据往返一致', () => {
    const state = {
      columns: [{ id: 'todo', title: '待办', color: '#5b8def' }],
      tasks: [{ id: 'task_1', title: '写周报', columnId: 'todo', starred: false, urgent: false, createdAt: 1700000000000 }]
    }
    expect(saveState(KEY, state)).toBe(true)
    expect(loadState(KEY)).toEqual(state)
  })

  it('loadState 无数据时返回 null', () => {
    expect(loadState(KEY)).toBeNull()
  })

  it('loadState 遇到非法 JSON 自动降级返回 null', () => {
    localStorage.setItem(KEY, '{invalid json!!')
    expect(loadState(KEY)).toBeNull()
  })

  it('loadState 遇到结构非法数据（tasks 非数组）降级返回 null', () => {
    localStorage.setItem(KEY, JSON.stringify({ columns: [], tasks: 'oops' }))
    expect(loadState(KEY)).toBeNull()
  })

  it('loadState 遇到结构非法数据（缺少 columns）降级返回 null', () => {
    localStorage.setItem(KEY, JSON.stringify({ tasks: [] }))
    expect(loadState(KEY)).toBeNull()
  })

  it('saveState 写入失败时返回 false 且不抛异常', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(saveState(KEY, { columns: [], tasks: [] })).toBe(false)
    spy.mockRestore()
  })

  it('saveState 生成的任务数据可再次读取（序列化稳定）', () => {
    const state = { columns: [], tasks: [{ id: 'a' }, { id: 'b' }] }
    saveState(KEY, state)
    saveState(KEY, state)
    expect(loadState(KEY)).toEqual(state)
  })

  it('clearState 移除数据后 loadState 返回 null', () => {
    saveState(KEY, { columns: [], tasks: [] })
    expect(clearState(KEY)).toBe(true)
    expect(loadState(KEY)).toBeNull()
  })

  it('storageKey 生成带前缀的键名', () => {
    expect(storageKey('state')).toBe('task-kanban:state')
  })
})