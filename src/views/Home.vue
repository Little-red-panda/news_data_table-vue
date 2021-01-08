<template>
  <div>
    <h1>Самые свежие новости науки</h1>
    <v-container>
      <p>Сортировать</p>
      <v-btn
       elevation="3"
       small
       @click ="[isSortData = !isSortData, sortData()]"
       :class="{'arrowSort': isSortData}"
       >По дате
       <span></span>
      </v-btn>
      <v-btn
       elevation="3"
       small
       @click ="[isSortSource = !isSortSource, sortSource()]"
       :class="{'arrowSort': isSortSource}"
       >По источнику
       <span></span>
      </v-btn>
      <v-text-field
       label="ПОИСК НОВОСТЕЙ"
       hide-details="auto"
       v-model="searchNews"
    ></v-text-field>
    <router-link to="/about">
      <v-btn
        elevation="3"
        small
        class="addNews"
        >Добавить новость
      </v-btn>
    </router-link>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="filteredNews"
      class="elevation-1"
      disable-sort
      disable-pagination
      hide-default-footer
    >
    <template  v-slot:item.description="{ item }">
      <span v-html="item.description"></span>
    </template>

    <template  v-slot:item.source.name="{ item }">
      <span>{{ item.source.name | lowercase }}</span>
    </template>
    </v-data-table>
    <router-view></router-view>
    <div class="about">
      <h1>Новая свежая новость</h1>
      <router-link to="/">
        <v-btn
        elevation="3"
        small
        >Вернуться к новостям
        </v-btn>
      </router-link>
      <v-container>
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
      </v-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'
export default {
  name: 'Home',
  mixins: [validationMixin],

  data () {
    return {
      isSortData: false,
      isSortSource: false,
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
      newNews: {
        publishedAt: '',
        source: {
          name: ''
        },
        title: '',
        description: ''
      }
    }
  },

  validations: {
    inputSource: { required, maxLength: maxLength(20) },
    inputTitle: { required, maxLength: maxLength(120) },
    inputDescription: { maxLength: maxLength(250) }
  },

  filters: {
    lowercase (value) {
      if (value[0] === 'W') {
        return value.toLowerCase()
      }
      return value
    }
  },

  mounted () {
    axios.get('http://newsapi.org/v2/top-headlines?country=ru&category=science&apiKey=595eb52772fc46a0a2e1ec29428c872d')
      .then(response => {
        this.news = response.data.articles
        console.log(this.news)
        this.news.forEach(function (newsItem) {
          newsItem.publishedAt = new Date(newsItem.publishedAt).toLocaleDateString()
          newsItem.description = '<p>' + newsItem.description + '</p>'
          return newsItem
        })
      })
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
  margin: 0 30px 0;
}

h1 {
  font-size: 48px;
  text-align: center;
  margin: 40px 0;
}

.container {
  display: flex;
  align-items: flex-end;
  max-width: 1500px;
  margin: 0 auto 30px;
}

p {
  font-weight: bold;
  font-size: 24px;
  margin-right: 20px;
}

.v-btn {
  margin-right: 20px;
}

.v-btn span {
  position: relative;
  display: block;
  width: 16px;
}

.v-btn span::before {
  position: absolute;
  top: -8px;
  content: "";
  width: 10px;
  height: 10px;
  border-bottom: 1px solid darkgrey;
  border-right: 1px solid darkgrey;
  transform: rotate(45deg);
}

.v-btn.arrowSort span::before {
  top: -2px;
  transform: rotate(-135deg);
}

.v-text-field {
  margin-left: 20px;
  margin-right: 40px;
}

.addNews {
  margin: 0;
}

.v-data-table {
  max-width: 1500px;
  border: 1px solid #ececec;
  margin: 0 auto 50px;
}

.about {
  margin: 20px 30px;
}

.is-invalid {
  color: red
}
</style>
