const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

let results = [];

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const ast = parser.parse(content, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript']
        });
        
        traverse(ast, {
          CallExpression(path) {
            const callee = path.node.callee;
            if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') {
              const methodName = callee.property.name;
              if (['map', 'filter', 'forEach', 'reduce'].includes(methodName)) {
                // We are inside a loop
                path.traverse({
                  CallExpression(innerPath) {
                    const innerCallee = innerPath.node.callee;
                    if (innerCallee.type === 'MemberExpression' && innerCallee.property.type === 'Identifier') {
                      const innerMethod = innerCallee.property.name;
                      if (['includes', 'indexOf', 'find', 'some'].includes(innerMethod)) {
                        results.push({
                          file: fullPath,
                          line: innerPath.node.loc.start.line
                        });
                      }
                    }
                  }
                });
              }
            }
          }
        });
      } catch(e) {}
    }
  });
}

walk('d:/Employment Management System/src/app');
console.log(JSON.stringify(results, null, 2));
