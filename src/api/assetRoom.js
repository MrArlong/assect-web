import request from '@/utils/request'

// 临期预警
export function getLqyjList(params) {
  return request({
    url: '/assetorder/lqyj',
    method: 'get',
    params: params
  })
}
// 房间总览
export function homeRoomSum() {
  return request({
    url: '/room/homeRoomSum',
    method: 'get'
  })
}

// 订单统计
export function orderTj(params) {
  return request({
    url: '/room/orderTj',
    method: 'get',
    params: params
  })
}

export function getAssetFloorList(params) {
  return request({
    url: '/assetFloot/listAll',
    method: 'get',
    params: params
  })
}
export function getAssetLcList(params) {
  return request({
    url: '/room/getLc',
    method: 'get',
    params: params
  })
}
export function getAssetFjList(params) {
  return request({
    url: '/room/getFj',
    method: 'get',
    params: params
  })
}
export function fetchList(params) {
  return request({
    url: '/room/list',
    method: 'get',
    params: params
  })
}

export function downloadExcel(params) {
  return request({
    url: '/room/exportExcel',
    method: 'get',
    params: params,
    responseType: 'blob'
  })
}
export function createBrand(data) {
  return request({
    url: '/room/create',
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
    url: '/room/update/factoryStatus',
    method: 'post',
    data: data
  })
}

export function updateIsOccupancy(data) {
  return request({
    url: '/room/update/updateIsOccupancy',
    method: 'post',
    data: data
  })
}

export function deleteBrand(id) {
  return request({
    url: '/room/delete/' + id,
    method: 'get'
  })
}

export function getBrand(id) {
  return request({
    url: '/room/' + id,
    method: 'get'
  })
}

export function updateBrand(id, data) {
  return request({
    url: '/room/update/' + id,
    method: 'post',
    data: data
  })
}

