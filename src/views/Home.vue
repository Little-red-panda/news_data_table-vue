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
      <!-- <template v-slot:item.publishedAt="{ item }">
        <v-chip>
          {{ item.publishedAt }}
        </v-chip>
      </template> -->
    </v-data-table>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',

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
      ]
    }
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
      // return this.news.filter(item => {
      //   return item.indexOf(this.searchNews) !== -1
      // })
    }
  },

  methods: {
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
</style>
