import request from '@/utils/request'

export function getAssetFloorList(params) {
  return request({
    url: '/assetFloot/listAll',
    method: 'get',
    params: params
  })
}
export function fetchList(params) {
  return request({
    url: '/assetFloot/list',
    method: 'get',
    params: params
  })
}
export function createBrand(data) {
  return request({
    url: '/assetFloot/create',
    method: 'post',
    data: data
  })
}
export function updateShowStatus(data) {
  return request({
    url: '/assetFloot/update/showStatus',
    method: 'post',
    data: data
  })
}

export function updateFactoryStatus(data) {
  return request({
    url: '/assetFloot/update/factoryStatus',
    method: 'post',
    data: data
  })
}

export function updateSftjStatus(data) {
  return request({
    url: '/assetFloot/update/sftjStatus',
    method: 'post',
    data: data
  })
}

export function deleteBrand(id) {
  return request({
    url: '/assetFloot/delete/' + id,
    method: 'get'
  })
}

export function getBrand(id) {
  return request({
    url: '/assetFloot/' + id,
    method: 'get'
  })
}

export function updateBrand(id, data) {
  return request({
    url: '/assetFloot/update/' + id,
    method: 'post',
    data: data
  })
}

