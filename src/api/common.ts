import { getAjax } from '@/utils/request'

export function getBaseInfo() {
  return getAjax('/test')
}
