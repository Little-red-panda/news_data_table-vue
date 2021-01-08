<template>
  <v-app>
  <div>
    <h1>Самые свежие новости науки</h1>
    <v-container class="sort">
      <p class="sort__text">Сортировать</p>

      <v-btn
       class="sort__btn sort__btn-date"
       elevation="3"
       small
       @click ="[isSortData = !isSortData, sortData()]"
       :class="{'arrowSort': isSortData}"
       >По дате
       <span></span>
      </v-btn>

      <v-btn
       class="sort__btn sort__btn-source"
       elevation="3"
       small
       @click ="[isSortSource = !isSortSource, sortSource()]"
       :class="{'arrowSort': isSortSource}"
       >По источнику
       <span></span>
      </v-btn>

      <v-text-field
       class="sort__search-news"
       label="ПОИСК НОВОСТЕЙ"
       hide-details="auto"
       v-model="searchNews"
      ></v-text-field>

      <v-btn
        class="sort__btn-add-news"
        elevation="3"
        small
        @click="isVisible = !isVisible"
        >Добавить новость
      </v-btn>
    </v-container>

    <section v-if="errored">
      <p class="axios-error">К сожалению, в настоящий момент информация недоступна. Повторите попытку позже.</p>
    </section>

    <section v-else>

      <template>

        <v-data-table
          :headers="headers"
          :items="filteredNews"
          class="elevation-1 data-table"
          disable-sort
          disable-pagination
          hide-default-footer
          :loading="loading"
          loading-text="Загрузка... Пожалуйста, подождите"
        >

        <template  v-slot:item.description="{ item }">
          <span v-html="item.description"></span>
        </template>

        <template  v-slot:item.source.name="{ item }">
          <span>{{ item.source.name | lowercase }}</span>
        </template>

        </v-data-table>

      </template>
    </section>

    <div class="fresh-news" v-if="isVisible">
      <span
        class="fresh-news__close"
        @click="isVisible = !isVisible"
      ></span>
      <h2>Новая свежая новость</h2>

      <v-container class="fresh-news__form">

        <form @submit.prevent="onSubmit">

          <v-text-field
            class="fresh-news__input-source"
            v-model="inputSource"
            :error-messages="inputSourceErrors"
            :counter="20"
            :class="{'is-invalid': $v.inputSource.$error}"
            label="ИСТОЧНИК"
            required
            @blur="$v.inputSource.$touch()"
          ></v-text-field>

          <v-text-field
            class="fresh-news__input-title"
            v-model="inputTitle"
            :error-messages="inputTitleErrors"
            :counter="120"
            :class="{'is-invalid': $v.inputTitle.$error}"
            label="ЗАГОЛОВОК НОВОСТИ"
            required
            @blur="$v.inputTitle.$touch()"
          ></v-text-field>

          <v-textarea
            class="fresh-news__input-description"
            v-model="inputDescription"
            :error-messages="inputDescriptionErrors"
            :counter="250"
            :class="{'is-invalid': $v.inputDescription.$error}"
            label="ОПИСАНИЕ НОВОСТИ"
            hide-details="auto"
            no-resize
          ></v-textarea>

          <v-text-field
            class="fresh-news__input-url"
            v-model="inputUrl"
            :error-messages="inputUrlErrors"
            :class="{'is-invalid': $v.inputUrl.$error}"
            label="ССЫЛКА НА НОВОСТЬ"
            required
            url
            @blur="$v.inputUrl.$touch()"
          ></v-text-field>

          <v-btn
            class="fresh-news__btn-submit"
            type="submit"
            :disabled="$v.$invalid"
            @click="submit"
          >
            Добавить
          </v-btn>
          <v-btn
            class="fresh-news__btn-clear"
            @click="clear"
          >
            Очистить
          </v-btn>

          <v-btn
            class="fresh-news__btn-back"
            elevation="3"
            @click="isVisible = !isVisible"
          >Вернуться к новостям
          </v-btn>
        </form>
      </v-container>
    </div>
  </div>
</v-app>
</template>

<script>
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required, maxLength, url } from 'vuelidate/lib/validators'
export default {
  name: 'App',
  mixins: [validationMixin],

  data () {
    return {
      isSortData: false,
      isSortSource: false,
      loading: true,
      errored: false,
      isVisible: false,
      searchNews: '',
      news: [],
      search: '',
      headers: [
        {
          text: 'Дата',
          align: 'start',
          value: 'publishedAt'
        },
        { text: 'Источник', value: 'source.name' },
        { text: 'Заголовок', value: 'title' },
        { text: 'Содержание', value: 'description' }
      ],
      inputSource: '',
      inputTitle: '',
      inputDescription: '',
      inputUrl: '',
      newNews: {
        publishedAt: '',
        source: {
          name: ''
        },
        title: '',
        description: '',
        url: ''
      }
    }
  },

  validations: {
    inputSource: { required, maxLength: maxLength(20) },
    inputTitle: { required, maxLength: maxLength(120) },
    inputDescription: { maxLength: maxLength(250) },
    inputUrl: { required, url }
  },

  filters: {
    lowercase (value) {
      return value.toLowerCase()
    }
  },

  mounted () {
    axios.get('http://newsapi.org/v2/top-headlines?country=ru&category=science&apiKey=595eb52772fc46a0a2e1ec29428c872d')
      .then(response => {
        this.news = response.data.articles
        console.log(this.news)
        this.news.forEach(function (newsItem) {
          newsItem.publishedAt = new Date(newsItem.publishedAt).toLocaleDateString()
          if (newsItem.description === null) {
            newsItem.description = ''
          }
          newsItem.description = '<p>' + newsItem.description + ' <a href="' + newsItem.url + '">[Подробнее]</a></p>'
          // newsItem.url = '<a href="' + newsItem.url + '">' + newsItem.source.name.toLowerCase() + '</a>'
          return newsItem
        })
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => (this.loading = false))
  },

  computed: {
    filteredNews () {
      const filter = new RegExp(this.searchNews, 'i')
      return this.news.filter(el => el.description.match(filter) || el.title.match(filter))
    },
    inputSourceErrors () {
      const errors = []
      if (!this.$v.inputSource.$dirty) return errors
      !this.$v.inputSource.maxLength && errors.push('Длина источника не может превышать 10 символов')
      !this.$v.inputSource.required && errors.push('Укажите источник')
      return errors
    },
    inputTitleErrors () {
      const errors = []
      if (!this.$v.inputTitle.$dirty) return errors
      !this.$v.inputTitle.maxLength && errors.push('Длина заголовка не может превышать 120 символов')
      !this.$v.inputTitle.required && errors.push('Укажите заголовок')
      return errors
    },
    inputDescriptionErrors () {
      const errors = []
      if (!this.$v.inputDescription.$dirty) return errors
      !this.$v.inputDescription.maxLength && errors.push('Длина описания не может превышать 250 символов')
      return errors
    },
    inputUrlErrors () {
      const errors = []
      if (!this.$v.inputUrl.$dirty) return errors
      !this.$v.inputUrl.required && errors.push('Укажите URL новости')
      !this.$v.inputUrl.url && errors.push('Несоответствующий формат')
      return errors
    }
  },

  methods: {
    onSubmit () {
      console.log('Новость добавлена')
    },
    sortData () {
      if (this.isSortData) {
        this.news.sort((a, b) => a.publishedAt > b.publishedAt ? 1 : -1)
      } else {
        this.news.sort((a, b) => a.publishedAt < b.publishedAt ? 1 : -1)
      }
    },
    sortSource () {
      if (this.isSortSource) {
        this.news.sort((a, b) => a.source.name > b.source.name ? 1 : -1)
      } else {
        this.news.sort((a, b) => a.source.name < b.source.name ? 1 : -1)
      }
    },
    submit () {
      this.$v.$touch()
      this.newNews.publishedAt = new Date().toLocaleDateString()
      this.newNews.source.name = this.inputSource
      this.newNews.title = this.inputTitle
      this.newNews.description = this.inputDescription
      console.log(this.newNews)
      console.log(this.publishedAt)
      this.news.push(this.newNews)
      alert('Новость добавлена')
      return this.news
    },
    clear () {
      this.$v.$reset()
      this.inputSource = ''
      this.inputTitle = ''
      this.inputDescription = ''
    }
  }
}
</script>

<style scoped>

div {
  position: relative;
  margin: 0 30px 0;
}

h1 {
  font-size: 48px;
  text-align: center;
  margin: 40px 0;
}

.container.sort {
  display: flex;
  align-items: flex-end;
  max-width: 1500px;
  margin: 0 auto 30px;
}

.sort__text {
  font-weight: bold;
  font-size: 24px;
  margin-right: 20px;
}

.sort__btn {
  margin-right: 20px;
}

.sort__btn span {
  position: relative;
  display: block;
  width: 16px;
}

.sort__btn span::before {
  position: absolute;
  top: -8px;
  content: "";
  width: 10px;
  height: 10px;
  border-bottom: 1px solid darkgrey;
  border-right: 1px solid darkgrey;
  transform: rotate(45deg);
}

.sort__btn.arrowSort span::before {
  top: -2px;
  transform: rotate(-135deg);
}

.sort__btn-add-news {
  margin-left: 20px;
  margin-right: 40px;
}

.axios-error {
  text-align: center;
}

.data-table {
  max-width: 1500px;
  border: 1px solid #ececec;
  margin: 0 auto 50px;
}

.fresh-news {
  background-color: #fff;
  box-shadow: 0px 0px 15px -5px;
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  margin: 20px 30px;
}

.fresh-news__close {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 10px;
  right: 10px;
  transition: 0.2s;
}

.fresh-news__close::before {
  content: "";
  width: 2px;
  height: 30px;
  background-color: darkgrey;
  position: absolute;
  left: 14px;
  transform: rotate(45deg);
}

.fresh-news__close::after {
  content: "";
  width: 2px;
  height: 30px;
  background-color: darkgrey;
  position: absolute;
  left: 14px;
  transform: rotate(-45deg);
}

.fresh-news__close:hover {
  cursor: pointer;
  transform: scale(1.2);
}

h2 {
  font-size: 30px;
  text-align: center;
  margin: 20px auto;
}

.fresh-news__form {
  margin: 0 0 30px;
}

.fresh-news__input-url {
  margin-bottom: 20px;
}

.is-invalid {
  color: red
}

.fresh-news__btn-submit {
  margin: 0 20px 0 30px;
}

.fresh-news__btn-clear {
  margin: 0 20px 0 0;
}

.fresh-news__btn-back {
  float: right;
  margin-right: 30px;
}
</style>
