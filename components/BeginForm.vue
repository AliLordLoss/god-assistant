<template>
  <div>
    <v-row justify="space-around">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="count"
          label="تعداد بازیکنان:"
          :rules="[isCountValid]"
          outlined
        />
      </v-col>
    </v-row>
    <v-expand-transition>
      <div v-if="isCountValid === true">
        <v-row justify="space-around">
          نقش‌های موجود در بازی را انتخاب کنید:
        </v-row>
        <v-row justify="space-around">
          <v-checkbox
            v-model="game.nums.godfather"
            :disabled="!game.nums.godfather && disableAll"
            label="پدرخوانده"
          />
          <v-col cols="6">
            <v-text-field
              v-model="game.names.godfatherName"
              :disabled="!game.nums.godfather"
              label="نام بازیکن:"
              outlined
            />
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-checkbox
            v-model="game.nums.dr_lecter"
            :disabled="!game.nums.dr_lecter && disableAll"
            label="دکتر لکتر"
          />
          <v-col cols="6">
            <v-text-field
              v-model="game.names.dr_lecterName"
              :disabled="!game.nums.dr_lecter"
              label="نام بازیکن:"
              outlined
            />
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-checkbox
            v-model="game.nums.yakuza"
            :disabled="!game.nums.yakuza && disableAll"
            label="یاکوزا"
          />
          <v-col cols="6">
            <v-text-field
              v-model="game.names.yakuzaName"
              :disabled="!game.nums.yakuza"
              label="نام بازیکن:"
              outlined
            />
          </v-col>
        </v-row>
        <v-row
          v-for="i in game.nums.mafia + 1"
          :key="`mafia ${i}`"
          justify="space-around"
        >
          <v-checkbox
            :label="`مافیا ساده ${i}`"
            :disabled="
              i < game.nums.mafia || (i > game.nums.mafia && disableAll)
            "
            @change="mafiaChanged"
          />
          <v-col cols="6">
            <v-text-field
              v-model="game.names.mafiaNames[i - 1]"
              :disabled="i > game.nums.mafia"
              label="نام بازیکن:"
              outlined
            />
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-checkbox
            v-model="game.nums.detective"
            :disabled="!game.nums.detective && disableAll"
            label="کارآگاه"
          />
          <v-col cols="6">
            <v-text-field
              v-model="game.names.detectiveName"
              :disabled="!game.nums.detective"
              label="نام بازیکن:"
              outlined
            />
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-checkbox
            v-model="game.nums.nurse"
            :disabled="!game.nums.nurse && disableAll"
            label="پزشک"
          />
          <v-col cols="6">
            <v-text-field
              v-model="game.names.nurseName"
              :disabled="!game.nums.nurse"
              label="نام بازیکن:"
              outlined
            />
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-checkbox
            v-model="game.nums.bodyguard"
            :disabled="!game.nums.bodyguard && disableAll"
            label="جان‌سخت"
          />
          <v-col cols="6">
            <v-text-field
              v-model="game.names.bodyguardName"
              :disabled="!game.nums.bodyguard"
              label="نام بازیکن:"
              outlined
            />
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-checkbox
            v-model="game.nums.sniper"
            :disabled="!game.nums.sniper && disableAll"
            label="اسنایپر"
          />
          <v-col cols="6">
            <v-text-field
              v-model="game.names.sniperName"
              :disabled="!game.nums.sniper"
              label="نام بازیکن:"
              outlined
            />
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-checkbox
            v-model="game.nums.hypnotist"
            :disabled="!game.nums.hypnotist && disableAll"
            label="روان‌شناس"
          />
          <v-col cols="6">
            <v-text-field
              v-model="game.names.hypnotistName"
              :disabled="!game.nums.hypnotist"
              label="نام بازیکن:"
              outlined
            />
          </v-col>
        </v-row>
        <v-row
          v-for="j in game.nums.citizen + 1"
          :key="`citizen ${j}`"
          justify="space-around"
        >
          <v-checkbox
            :label="`شهروند ساده ${j}`"
            :disabled="
              j < game.nums.citizen || (j > game.nums.citizen && disableAll)
            "
            @change="citizenChanged"
          />
          <v-col cols="6">
            <v-text-field
              v-model="game.names.citizenNames[j - 1]"
              :disabled="j > game.nums.citizen"
              label="نام بازیکن:"
              outlined
            />
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <v-btn
            color="success"
            :disabled="!disableAll || !validateNames"
            @click="begin"
          >
            شروع
          </v-btn>
        </v-row>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: undefined,
      game: {
        nums: {
          godfather: 0,
          dr_lecter: 0,
          mafia: 0,
          yakuza: 0,
          detective: 0,
          nurse: 0,
          bodyguard: 0,
          sniper: 0,
          hypnotist: 0,
          citizen: 0,
        },
        names: {
          godfatherName: '',
          dr_lecterName: '',
          mafiaNames: [''],
          yakuzaName: '',
          detectiveName: '',
          nurseName: '',
          bodyguardName: '',
          sniperName: '',
          hypnotistName: '',
          citizenNames: [''],
        },
      },
    }
  },
  computed: {
    isCountValid() {
      return !isNaN(this.count) && !isNaN(parseInt(this.count))
        ? true
        : 'مقدار معتبر نیست!'
    },

    validateNames() {
      let valid = true

      Object.keys(this.game.nums).forEach((item) => {
        if (this.game.nums[item]) {
          if (this.game.names[`${item}Name`] !== undefined) {
            if (!this.game.names[`${item}Name`]) valid = false
          } else {
            for (let i = 0; i < this.game.nums[item]; i++) {
              if (!this.game.names[`${item}Names`][i]) valid = false
            }
          }
        }
      })

      return valid
    },

    disableAll() {
      return (
        Object.values(this.game.nums).reduce((acc, item) => acc + item, 0) ===
        Number(this.count)
      )
    },
  },
  methods: {
    numberChanged(prop) {
      return (e) => {
        if (e) {
          this.game.nums[prop]++
          this.game.names[`${prop}Names`].push('')
        } else {
          this.game.nums[prop]--
          this.game.names[`${prop}Names`].pop()
        }
      }
    },

    citizenChanged(e) {
      this.numberChanged('citizen')(e)
    },

    mafiaChanged(e) {
      this.numberChanged('mafia')(e)
    },

    begin() {
      this.$store.dispatch('beginGame', { game: this.game })
    },
  },
}
</script>
