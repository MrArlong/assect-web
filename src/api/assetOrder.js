import request from '@/utils/request'
export function createOrder(data) {
  return request({
    url: '/assetorder/create',
    method: 'post',
    data: data
  })
}
export function getOrderNum() {
  return request({
    url: '/assetorder/getOrderNum',
    method: 'get'
  })
}
export function fetchList(params) {
  return request({
    url: '/assetorder/list',
    method: 'get',
    params: params
  })
}

export function closeOrder(params) {
  return request({
    url: '/assetorder/update/close',
    method: 'post',
    params: params
  })
}

export function deleteOrder(params) {
  return request({
    url: '/assetorder/delete',
    method: 'post',
    params: params
  })
}

export function deliveryOrder(data) {
  return request({
    url: '/assetorder/update/delivery',
    method: 'post',
    data: data
  })
}

export function getOrderDetail(id) {
  return request({
    url: '/assetorder/' + id,
    method: 'get'
  })
}

export function getOrderRoomDetail(id) {
  return request({
    url: '/assetorder/room/' + id,
    method: 'get'
  })
}

export function updateReceiverInfo(data) {
  return request({
    url: '/assetorder/update/receiverInfo',
    method: 'post',
    data: data
  })
}

export function updateMoneyInfo(data) {
  return request({
    url: '/assetorder/update/moneyInfo',
    method: 'post',
    data: data
  })
}

export function updateOrderNote(params) {
  return request({
    url: '/assetorder/update/note',
    method: 'post',
    params: params
  })
}
