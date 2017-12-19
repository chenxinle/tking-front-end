import Network from '../../mods/Network'

function getUserById(id) {
  return Network.get(`/api/v1/user/${id}`)
}

export default {
  getUserById
}