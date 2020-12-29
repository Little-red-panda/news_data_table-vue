<template>
  <div>
    <ul>
      <li v-for="(item, index) in news" :key="index">{{ index+1 }} {{ item.title }}</li>
    </ul>
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
      news: []
    }
  },

  mounted () {
    axios.get('http://newsapi.org/v2/top-headlines?country=ru&category=science&apiKey=595eb52772fc46a0a2e1ec29428c872d')
      .then(response => {
        this.news = response.data.articles
        console.log(this.news)
      })
  }
}
</script>
