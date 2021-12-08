export const state = () => ({
  game: {},
  started: false,
})

export const getters = {
  inGamePeople: (state) => {
    const namesList = []
    Object.keys(state.game.names).forEach((name) => {
      if (typeof state.game.names[name] === 'string') {
        if (
          state.game.names[name] &&
          !state.game.deads.includes(state.game.names[name])
        )
          namesList.push(state.game.names[name])
      } else {
        state.game.names[name].forEach((item) => {
          if (item && !state.game.deads.includes(item)) namesList.push(item)
        })
      }
    })
    return namesList
  },

  inGame: (state) => (role) => {
    return (
      state.game.nums[role] !== 0 &&
      !state.game.deads.includes(state.game.names[`${role}Name`])
    )
  },

  getRole: (state) => (name) => {
    for (const item of Object.keys(state.game.names)) {
      if (item.endsWith('Name')) {
        if (state.game.names[item] === name) return item.slice(0, -4)
      } else {
        for (const n of state.game.names[item]) {
          if (n === name) return item.slice(0, -5)
        }
      }
    }
  },
}

export const actions = {
  beginGame({ commit }, { game }) {
    commit('SET_GAME', { game })
    commit('BEGIN')
  },

  anotherDay({ commit }) {
    commit('INCREMENT_DAY')
  },

  kill({ commit }, { name }) {
    commit('ADD_DEAD', { name })
  },

  nightEvents(
    { commit, getters, state },
    {
      nurseTarget,
      detectiveTarget,
      mafiaTarget,
      lecterTarget,
      sniperTarget,
      bodyguardAbility,
      hypnoTarget,
    }
  ) {
    let bodyguardShield = state.game.bodyguardShield
    let godfatherShield = state.game.godfatherShield
    let bodyguardAbilityLeft = state.game.bodyguardAbilityLeft
    let nurseSelfSavesLeft = state.game.nurseSelfSavesLeft
    let lecterSelfSavesLeft = state.game.lecterSelfSavesLeft

    const lastNightDeads = []

    if (getters.getRole(detectiveTarget) === 'godfather' && godfatherShield) {
      godfatherShield = false
    }

    if (getters.getRole(mafiaTarget) === 'bodyguard' && bodyguardShield) {
      bodyguardShield = false
    } else if (mafiaTarget !== nurseTarget) {
      lastNightDeads.push(mafiaTarget)
      commit('ADD_DEAD', { name: mafiaTarget })
    }

    if (getters.getRole(sniperTarget) === 'bodyguard' && bodyguardShield) {
      bodyguardShield = false
      lastNightDeads.push(state.game.names.sniperName)
      commit('ADD_DEAD', { name: state.game.names.sniperName })
    } else if (
      getters.getRole(sniperTarget) === 'godfather' &&
      godfatherShield
    ) {
      godfatherShield = false
    } else if (
      sniperTarget !== lecterTarget &&
      (getters.getRole(sniperTarget) === 'godfather' ||
        getters.getRole(sniperTarget) === 'dr_lecter' ||
        getters.getRole(sniperTarget) === 'mafia')
    ) {
      lastNightDeads.push(sniperTarget)
      commit('ADD_DEAD', { name: sniperTarget })
    } else if (sniperTarget && sniperTarget !== 'هیچکس') {
      lastNightDeads.push(state.game.names.sniperName)
      commit('ADD_DEAD', { name: state.game.names.sniperName })
    }

    if (bodyguardAbility && bodyguardAbilityLeft) bodyguardAbilityLeft--

    if (nurseTarget === state.game.names.nurseName) nurseSelfSavesLeft = 0
    if (lecterSelfSavesLeft === state.game.names.dr_lecterName)
      lecterSelfSavesLeft = 0

    commit('UPDATE_GAME', {
      bodyguardShield,
      godfatherShield,
      bodyguardAbilityLeft,
      lecterSelfSavesLeft,
      nurseSelfSavesLeft,
      lastNightReport: { lastNightDeads, bodyguardAbility, hypnoTarget },
    })
  },
}

export const mutations = {
  SET_GAME(state, { game }) {
    state.game = {
      ...game,
      bodyguardAbilityLeft: 2,
      lecterSelfSavesLeft: 1,
      nurseSelfSavesLeft: 1,
      godfatherShield: true,
      bodyguardShield: true,
      day: 1,
      lastNightReport: {},
      deads: [],
    }
  },

  BEGIN(state) {
    state.started = true
  },

  INCREMENT_DAY(state) {
    state.game.day++
  },

  ADD_DEAD(state, { name }) {
    this._vm.$set(state.game.deads, state.game.deads.length, name)
  },

  UPDATE_GAME(
    state,
    {
      bodyguardShield,
      godfatherShield,
      bodyguardAbilityLeft,
      lecterSelfSavesLeft,
      nurseSelfSavesLeft,
      lastNightReport,
    }
  ) {
    this._vm.$set(state.game, 'bodyguardShield', bodyguardShield)
    this._vm.$set(state.game, 'godfatherShield', godfatherShield)
    this._vm.$set(state.game, 'bodyguardAbilityLeft', bodyguardAbilityLeft)
    this._vm.$set(state.game, 'lecterSelfSavesLeft', lecterSelfSavesLeft)
    this._vm.$set(state.game, 'nurseSelfSavesLeft', nurseSelfSavesLeft)
    this._vm.$set(state.game, 'lastNightReport', lastNightReport)
  },
}
