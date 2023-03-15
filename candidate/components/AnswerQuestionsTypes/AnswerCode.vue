<template>
<div>
  <br>
  <prism-editor v-model="candidateAnswer" :highlight="highlighter" line-numbers class="my-editor" width="100%" @input="setAnswer"></prism-editor>
  <h4><v-btn @click="compileCode">Compile</v-btn> {{ compilerMessage }}</h4>
</div>
</template>

<script>
import {PrismEditor} from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import {highlight, languages} from 'prismjs/components/prism-core';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

import 'prismjs/themes/prism-tomorrow.css';

export default {
  name: "AnswerCode",
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
      candidateAnswer: this.$store.getters.getResponse && typeof(this.$store.getters.getResponse) === typeof("") ? this.$store.getters.getResponse : this.content.skeleton,
      compilerMessage: "",
      mainFix: " int main(){return 0;}"
    }
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.cpp, "cpp"); // languages.<insert language> to return html with markup
    },
    setAnswer() {
      this.$store.dispatch('setResponse', this.candidateAnswer)
    },
    compileCode()
    {
      this.$axios.post('candidate/compile-code', {
          code: this.candidateAnswer + this.mainFix,
          language: "cpp17"
        },{
          headers: {
            'Authorization': this.$store.getters.getJWT,
          }
        }
      ).then((res)=>{
        this.compilerMessage = (res.data.output ? res.data.output : "jdoodle.cpp: No compilation error!").replace("int main(){return 0;}","")
      }).catch((err)=>{
        this.$nuxt.error({statusCode:429,message:err.message})
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
