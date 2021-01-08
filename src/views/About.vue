<template>
  <div class="about">
    <h1>Новая свежая новость</h1>
    <router-link to="/">
      <v-btn
       elevation="3"
       small
       >Вернуться к новостям
       </v-btn>
    </router-link>
    <!-- <v-container>
      <form @submit.prevent="onSubmit">
        <v-text-field
          v-model="inputSource"
          :error-messages="inputSourceErrors"
          :counter="20"
          :class="{'is-invalid': $v.inputSource.$error}"
          label="ИСТОЧНИК"
          required
          @blur="$v.inputSource.$touch()"
        ></v-text-field>
        <v-text-field
          v-model="inputTitle"
          :error-messages="inputTitleErrors"
          :counter="120"
          :class="{'is-invalid': $v.inputTitle.$error}"
          label="ЗАГОЛОВОК НОВОСТИ"
          required
          @blur="$v.inputTitle.$touch()"
        ></v-text-field>
        <v-textarea
          v-model="inputDescription"
          :error-messages="inputDescriptionErrors"
          :counter="250"
          :class="{'is-invalid': $v.inputDescription.$error}"
          label="ОПИСАНИЕ НОВОСТИ"
          hide-details="auto"
          no-resize
        ></v-textarea>
        <v-btn
          type="submit"
          :disabled="$v.$invalid"
          @click="submit"
        >
          Добавить
        </v-btn>
        <v-btn
          @click="clear"
        >
          Очистить
          </v-btn>
      </form>
    </v-container> -->
  </div>
</template>

<script>
// import { validationMixin } from 'vuelidate'
// import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'About',

  components: {
    //
  },

  // mixins: [validationMixin],

  data () {
    return {
      // inputSource: '',
      // inputTitle: '',
      // inputDescription: '',
      // newNews: {
      //   publishedAt: '',
      //   source: '',
      //   title: '',
      //   description: ''
      // }
    }
  },

  // validations: {
  //   inputSource: { required, maxLength: maxLength(20) },
  //   inputTitle: { required, maxLength: maxLength(120) },
  //   inputDescription: { maxLength: maxLength(250) }
  // },

  computed: {
    // inputSourceErrors () {
    //   const errors = []
    //   if (!this.$v.inputSource.$dirty) return errors
    //   !this.$v.inputSource.maxLength && errors.push('Длина источника не может превышать 10 символов')
    //   !this.$v.inputSource.required && errors.push('Укажите источник')
    //   return errors
    // },
    // inputTitleErrors () {
    //   const errors = []
    //   if (!this.$v.inputTitle.$dirty) return errors
    //   !this.$v.inputTitle.maxLength && errors.push('Длина заголовка не может превышать 120 символов')
    //   !this.$v.inputTitle.required && errors.push('Укажите заголовок')
    //   return errors
    // },
    // inputDescriptionErrors () {
    //   const errors = []
    //   if (!this.$v.inputDescription.$dirty) return errors
    //   !this.$v.inputDescription.maxLength && errors.push('Длина описания не может превышать 250 символов')
    //   return errors
    // }
  },

  methods: {
    // onSubmit () {
    // this.newNews.publishedAt = Date.now
    // this.newNews.source = this.inputSource
    // this.newNews.title = this.inputTitle
    // this.newNews.Description = this.inputDescription
    // this.news.push(this.newNews)
    // },
    // submit () {
    //   this.$v.$touch()
    //   this.newNews.publishedAt = Date.now
    //   this.newNews.source = this.inputSource
    //   this.newNews.title = this.inputTitle
    //   this.newNews.description = this.inputDescription
    //   console.log(this.newNews)
    //   this.news.push(this.newNews)
    //   alert('Новость добавлена')
    //   return this.news
    // },
    // clear () {
    //   this.$v.$reset()
    //   this.inputSource = ''
    //   this.inputTitle = ''
    //   this.inputDescription = ''
    // }
  }
}
</script>

<style scoped>
  /* .about {
    margin: 20px 30px;
  }

  h1 {
    text-align: center;
  }

  .is-invalid {
    color: red
  } */
</style>
