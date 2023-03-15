<template>
  <div>
    <br>
    <PrismEditor v-model="candidateAnswer" :highlight="highlighter" line-numbers class="my-editor" width="100%" @input="setAnswer"></PrismEditor>
    <h4><v-btn @click="checkQuery">Check Syntax</v-btn> {{ checkResult }}</h4>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-tomorrow.css';
export default {
  name: "AnswerSQL",
  components: {
    PrismEditor
  },
  props: {
    content: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      candidateAnswer: this.$store.getters.getResponse && typeof(this.$store.getters.getResponse) === typeof("") ? this.$store.getters.getResponse : "",
      checkResult: ""
    }
  },
  computed: {
    databaseSchema() {
      return this.$store.getters.getCurrentQuestionContent.databaseSchema
    }
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.sql, "sql"); // languages.<insert language> to return html with markup
    },
    setAnswer() {
      this.$store.dispatch('setResponse', this.candidateAnswer)
    },
    checkQuery()
    {
      this.$axios.post('candidate/check-query', {
          db: this.databaseSchema,
          query: this.candidateAnswer
        },{
          headers: {
            'Authorization': this.$store.getters.getJWT,
          }
        }
      ).then((res)=>{
        this.checkResult = res.data.includes("syntax error") ? "Syntax Error Found" : "No Syntax Error"
      }).catch((err)=>{
        this.$nuxt.error({statusCode:500,message:err.message})
      })
    },
  },
}
</script>

<style scoped>
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #2d2d2d;
  color: #ccc;

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
}
</style>
