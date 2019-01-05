import { login, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

/* 定义用户共享变量user*/
const user = {
  /* 初始化变量 */
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },
  /* 修改变量 */
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          setToken(response.token)
          commit('SET_TOKEN', response.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息,将用户名和角色存入共享数据中
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          commit('SET_NAME', response.name)
          commit('SET_ROLES', response.roles)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      removeToken()
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
