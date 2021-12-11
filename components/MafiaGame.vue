<template>
  <div>
    <v-row>
      <v-col v-for="i in chances.length" :key="i" cols="6" md="2">
        <v-checkbox :label="i + '. ' + chances[i - 1].value" />
      </v-col>
    </v-row>
    <hr />
    <br />
    <v-row justify="center">
      <h2>{{ day ? 'روز' : 'شب' }} {{ $store.state.game.day }}</h2>
    </v-row>
    <div v-if="$store.state.game.day > 1">
      <v-row justify="center">
        <v-col cols="8"> کشته‌های دیشب: </v-col>
      </v-row>
      <v-row
        v-for="name in $store.state.game.lastNightReport.lastNightDeads"
        :key="name"
        justify="center"
      >
        <v-col cols="8">
          {{ name }}
        </v-col>
      </v-row>
      <br />
      <hr />
      <br />
      <v-row justify="center">
        روانشناس دیشب
        {{
          $store.state.game.lastNightReport.hypnoTarget &&
          $store.state.game.lastNightReport.hypnoTarget !== 'هیچکس'
            ? `${$store.state.game.lastNightReport.hypnoTarget} رو ساکت کرد`
            : 'کسی رو ساکت نکرد'
        }}!
      </v-row>
      <v-row justify="center">
        جان‌سخت دیشب استعلام
        {{
          $store.state.game.lastNightReport.bodyguardAbility ? 'گرفت' : 'نگرفت'
        }}!
      </v-row>
    </div>
    <br />
    <hr />
    <br />
    <v-row justify="center">
      <v-col cols="4">
        افراد حاضر در بازی:
        <div v-for="name in $store.getters.inGamePeople" :key="name">
          {{ name }}: {{ getRole(name) }}
        </div>
      </v-col>
      <v-col cols="4">
        قبرستان:
        <div v-for="name in $store.state.game.deads" :key="name">
          {{ name }}: {{ getRole(name) }}
        </div>
      </v-col>
    </v-row>
    <div v-if="day">
      <v-row justify="center">
        <v-col cols="8">
          <v-select
            v-model="democraticKill"
            :items="[...$store.getters.inGamePeople, 'هیچکس']"
            label="اخراجی امروز:"
            outlined
          ></v-select>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row justify="center">
        <v-col cols="8">
          <v-select
            v-model="nurseTarget"
            :items="nurseTargets"
            :disabled="!inGame('nurse')"
            label="هدف پزشک:"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="8">
          <v-select
            v-model="mafiaTarget"
            :items="mafiaTargets"
            label="هدف مافیا:"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <!-- TODO <v-row justify="center">
      <v-col cols="4">
        <h3>هدف یاکوزا:</h3>
      </v-col>
      <v-col cols="8">
        <v-select :items="nurseTargets" outlined></v-select>
      </v-col>
    </v-row> -->
      <v-row justify="center">
        <v-col cols="8">
          <v-select
            v-model="lecterTarget"
            :items="lecterTargets"
            :disabled="!inGame('dr_lecter')"
            label="هدف دکتر لکتر:"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="8">
          <v-select
            v-model="detectiveTarget"
            :items="detectiveTargets"
            :disabled="!inGame('detective')"
            label="استعلام کارآگاه:"
            outlined
          ></v-select>
        </v-col>
        <v-col v-if="detectiveTarget" align-self="center" cols="1">
          <v-icon> mdi-thumb-{{ isMafia ? 'up' : 'down' }} </v-icon>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="8">
          <v-select
            v-model="sniperTarget"
            :items="sniperTargets"
            :disabled="!inGame('sniper')"
            label="هدف اسنایپر:"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="8">
          <v-select
            v-model="hypnoTarget"
            :items="hypnoTargets"
            :disabled="!inGame('hypnotist')"
            label="هدف روان‌شناس:"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="8">
          <v-checkbox
            v-model="bodyguardAbility"
            :disabled="
              !inGame('bodyguard') || !$store.state.game.bodyguardAbilityLeft
            "
            label="استعلام جان‌سخت"
          />
        </v-col>
      </v-row>
    </div>
    <v-row justify="center">
      <v-btn color="primary" x-large @click="changeDay">
        يُقَلِّبُ اللهُ اللَّيْلَ وَ النَّهارَ
      </v-btn>
    </v-row>
    <br />
    <br />
    <v-row justify="center">
      <v-btn color="error" x-large @click="end"> پایان </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      day: true,
      nurseTarget: '',
      mafiaTarget: '',
      lecterTarget: '',
      detectiveTarget: '',
      sniperTarget: '',
      hypnoTarget: '',
      bodyguardAbility: false,
      democraticKill: '',
      chances: [
        'مسیر سبز',
        'مسیر قرمز',
        'ذهن زیبا',
        'شلیک شب',
        'بی‌خوابی',
        'دروغ 13',
      ]
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort),
    }
  },
  computed: {
    isMafia() {
      const target = this.getRole(this.detectiveTarget)
      return (
        (target === 'godfather' && !this.$store.state.game.godfatherShield) ||
        target === 'mafia' ||
        target === 'dr_lecter'
      )
    },

    inGame() {
      return this.$store.getters.inGame
    },

    getRole() {
      return this.$store.getters.getRole
    },

    nurseTargets() {
      return this.$store.state.game.nurseSelfSavesLeft
        ? this.$store.getters.inGamePeople
        : this.$store.getters.inGamePeople.filter(
            (name) => name !== this.$store.state.game.names.nurseName
          )
    },

    detectiveTargets() {
      return this.$store.getters.inGamePeople.filter(
        (name) => name !== this.$store.state.game.names.detectiveName
      )
    },

    mafiaTargets() {
      return this.$store.getters.inGamePeople.filter(
        (name) =>
          name !== this.$store.state.game.names.godfatherName &&
          name !== this.$store.state.game.names.dr_lecterName &&
          !this.$store.state.game.names.mafiaNames.includes(name)
      )
    },

    lecterTargets() {
      return this.$store.getters.inGamePeople.filter(
        (name) =>
          name === this.$store.state.game.names.godfatherName ||
          (this.$store.state.game.lecterSelfSavesLeft && name === this.$store.state.game.names.dr_lecterName) ||
          this.$store.state.game.names.mafiaNames.includes(name)
      )
    },

    sniperTargets() {
      return [
        ...this.$store.getters.inGamePeople.filter(
          (name) => name !== this.$store.state.game.names.sniperName
        ),
        'هیچکس',
      ]
    },

    hypnoTargets() {
      return [
        ...this.$store.getters.inGamePeople.filter(
          (name) => name !== this.$store.state.game.names.hypnotistName
        ),
        'هیچکس',
      ]
    },
  },
  methods: {
    changeDay() {
      if (this.day && this.democraticKill && this.democraticKill !== 'هیچکس') {
        this.$store.dispatch('kill', { name: this.democraticKill })
      }
      if (!this.day) {
        this.$store.dispatch('nightEvents', {
          nurseTarget: this.nurseTarget,
          detectiveTarget: this.detectiveTarget,
          mafiaTarget: this.mafiaTarget,
          lecterTarget: this.lecterTarget,
          sniperTarget: this.sniperTarget,
          bodyguardAbility: this.bodyguardAbility,
          hypnoTarget: this.hypnoTarget,
        })
      }

      this.day = !this.day
      if (this.day) {
        this.$store.dispatch('anotherDay')
        this.nurseTarget = ''
        this.mafiaTarget = ''
        this.lecterTarget = ''
        this.detectiveTarget = ''
        this.sniperTarget = ''
        this.hypnoTarget = ''
        this.bodyguardAbility = false
        this.democraticKill = ''
      }
    },
    end() {
      localStorage.clear()
      location.reload()
    },
  },
}
</script>