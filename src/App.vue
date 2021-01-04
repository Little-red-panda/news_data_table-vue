<template>
  <div>
    <h1>Новости науки</h1>
    <v-container>
      <p>Сортировать</p>
      <v-btn elevation="3" @click ="[isSortData = !isSortData, sortData()]" :class="{'arrowSort': isSortData}">По дате<span></span></v-btn>
      <v-btn elevation="3" @click ="[isSortSource = !isSortSource, sortSource()]" :class="{'arrowSort': isSortSource}">По источнику<span></span></v-btn>
    </v-container>
    <v-data-table
      :headers="headers"
      :items="news"
      class="elevation-1"
      disable-sort
      disable-pagination
      hide-default-footer
    >
    <template  v-slot:item.description="{ item }">
      <span v-html="item.description"></span>
    </template>
      <!-- <template v-slot:item.publishedAt="{ item }">
        <v-chip>
          {{ item.publishedAt }}
        </v-chip>
      </template> -->
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',

  components: {
    //
  },

  data () {
    return {
      isSortData: false,
      isSortSource: false,
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
    // sortData () {
    //   if (this.isSort) {
    //     this.news.sort((a, b) => a.publishedAt > b.publishedAt ? 1 : -1)
    //   } else {
    //     this.news.sort((a, b) => a.publishedAt < b.publishedAt ? 1 : -1)
    //   }
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

h1 {
  font-family: Georgia, 'Times New Roman', Times, serif;
  margin: 20px 0 30px 40px;
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

.v-data-table {
  margin: 0 40px;
  border: 1px solid #ececec;
}
</style>
