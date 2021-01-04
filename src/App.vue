<template>
  <div>
    <h1>Новости науки</h1>
    <p v-html="link"></p>
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
      news: [],
      link: '<p>какой-то<a href="https://ura.news/">link</a>текст</p>',
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
  }
}
</script>

<style scoped>

h1 {
  font-family: Georgia, 'Times New Roman', Times, serif;
  margin: 20px 0 30px 40px;
}

.v-data-table {
  /* max-width: 80%; */
  margin: 0 40px;
  border: 1px solid #ececec;
}
</style>
