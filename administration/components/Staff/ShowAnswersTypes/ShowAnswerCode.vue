<template>
  <v-card elevation="8">
    <v-card-title>
      Question n° {{ questionNumber + 1 }}
    </v-card-title>
    <v-card-text>
      <h3>Title:</h3>
      <p> {{ question.question.title }} </p>
      <h3>Question:</h3>
      <div v-html="parsedRichText"></div>
      <h3>Candidate Answer:</h3>
      <br>
      <prism-editor :value="question.response" :highlight="highlighter" line-numbers class="my-editor" width="100%" :readonly="true"/>
      <br>
      <h3>Test Passed:</h3>
      <p>{{passedTests}}</p>
      <h3>Evaluation:</h3>
      <p>{{evaluation}}</p>
    </v-card-text>
  </v-card>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

import 'prismjs/themes/prism-tomorrow.css';
export default {
  name: "ShowAnswerCode",
  components: {
    PrismEditor
  },
  props: {
    questionNumber:{
      type: Number,
      required: true
    },
    question: {
      type: Object,
      required: true
    },
  },
  computed: {
    passedTests() {
      return this.question.question.content.passedTests + "/" + this.question.question.content.tests.length
    },
    evaluation()
    {
      return this.question.evaluation + "/" + this.question.value
    },
    parsedRichText() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.question.question.question, "text/html");
      const imgs = doc.querySelectorAll("img");
      imgs.forEach(img => {
        img.style.maxWidth = "100%";
        img.style.height = "100%";
      });
      return doc.body.innerHTML;
    }
  },
  methods: {
    highlighter(c) {
      return highlight(c, languages.cpp, "cpp"); // languages.<insert language> to return html with markup
    },

  }
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

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>
