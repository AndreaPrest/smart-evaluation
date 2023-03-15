<template>
  <div>
    <h3>Question:</h3>
    <div v-html="parsedRichText"></div>
    <h3>Libraries</h3>
    <prism-editor v-model="code.content.testLibraries" :highlight="highlighter" line-numbers class="my-editor" width="100%" :readonly="true"></prism-editor>
    <h3>Tests</h3>
    <div v-for="(test,index) in code.content.tests" :key="index">
      <h4>Test n° {{ index + 1}}</h4>
      <prism-editor  v-model="code.content.tests[index]" :highlight="highlighter" line-numbers class="my-editor" width="100%" :readonly="true"></prism-editor>
    </div>
    <h3>Answer Skeleton</h3>
    <prism-editor v-model="code.content.skeleton" :highlight="highlighter" line-numbers class="my-editor" width="100%" :readonly="true"></prism-editor>
  </div>
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
  name: "ShowCode",
  components: {
    PrismEditor
  },
  props: {
    question: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      code: this.question
    }
  },
  computed: {
    parsedRichText() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.code.question, "text/html");
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

