<template>
  <div>
  <h3>Question:</h3>
    <div v-html="parsedRichText"></div>
    <h3>Database Schema</h3>
    <prism-editor :value="sql.content.databaseSchema" :highlight="highlighter" line-numbers class="my-editor" width="100%" :readonly="true"></prism-editor>
    <div v-for="(table, index) in sql.content.snapshotTables" :key="index">
      <h3>Data Snapshot n° {{ index + 1}}</h3>
      <prism-editor :value="table" :highlight="highlighter" line-numbers class="my-editor" width="100%" :readonly="true"></prism-editor>
    </div>
  <h3>Query:</h3>
    <prism-editor :value="sql.content.query" :highlight="highlighter" line-numbers class="my-editor" width="100%" :readonly="true"></prism-editor>
    <v-row>
      <v-col>
        <v-checkbox v-model="sql.content.sameColumnRelevant" readonly label="Are allowed more columns?"></v-checkbox>
      </v-col>
      <v-col>
        <v-checkbox v-model="sql.content.orderRelevant" readonly label="Is the order relevant?"></v-checkbox>
      </v-col>
      <v-col>
        <v-checkbox v-model="sql.content.multiplicityRelevant" readonly label="Is multiplicity relevant?"></v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';

import 'prismjs/components/prism-sql';
export default {
  name: "ShowSQL",
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
      sql: this.question
    }
  },
  computed: {
    parsedRichText() {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.sql.question, "text/html");
      const imgs = doc.querySelectorAll("img");
      imgs.forEach(img => {
        img.style.maxWidth = "100%";
        img.style.height = "100%";
      });
      return doc.body.innerHTML;
    }
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.sql, "sql"); // languages.<insert language> to return html with markup
    },
  },
}
</script>

<style scoped>
@import "~vue2-editor/dist/vue2-editor.css";
@import '~quill/dist/quill.snow.css';
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
