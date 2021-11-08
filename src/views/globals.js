// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from 'vue'

// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(	
	'.', 	// look for files in the current directory
	false,	// no subdirectories
	/\.vue/ // all .vue files
)

// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  // Get the PascalCase version of the component name
  const componentName = fileName
    // 去掉开头的./和文件后缀名
    .replace(/^\.\//, '').replace(/\.\w+$/, '')
    // SW 把文件名中的-去掉，并且把各个单词首字符大写
    .split('-').map((kebab) => kebab.charAt(0).toUpperCase() + kebab.slice(1)).join('')

  // Globally register the component
  Vue.component(componentName, componentConfig.default || componentConfig)
})
