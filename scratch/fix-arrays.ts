import { Project, SyntaxKind, CallExpression, Node } from "ts-morph";
import * as fs from "fs";

const data = JSON.parse(fs.readFileSync('C:/Users/sathy/.gemini/antigravity-ide/brain/ff916d09-2954-45e5-adab-860039908cac/scratch/js-set-map-lookups-arrays.json', 'utf8'));

const project = new Project();
const filesToProcess: string[] = Array.from(new Set(data.map((d: any) => d.file as string)));

filesToProcess.forEach((f: string) => project.addSourceFileAtPath(f));

for (const sourceFile of project.getSourceFiles()) {
  let madeChanges = false;
  const filePath = sourceFile.getFilePath();
  
  // Find all instructions for this file
  const fileData = data.filter((d: any) => d.file === filePath || filePath.endsWith(d.file.split('/').pop()));
  
  for (const instruction of fileData) {
    if (instruction.file.includes("AddOrganizationForm")) continue; // already fixed
    
    const targetArray = instruction.target;
    if (!targetArray) continue;
    
    const setName = targetArray.replace(/[^a-zA-Z0-9]/g, '') + "Set";
    
    // Find CallExpressions like targetArray.includes(...)
    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    
    for (const callExpr of callExpressions) {
      const expr = callExpr.getExpression();
      if (expr.getKind() === SyntaxKind.PropertyAccessExpression) {
        const propAccess = expr.asKind(SyntaxKind.PropertyAccessExpression);
        if (propAccess && propAccess.getExpression().getText() === targetArray && propAccess.getName() === "includes") {
          // Found it! Check if it's inside a loop.
          // For simplicity, we just look for the closest parent block and insert the Set creation there.
          // But wait, the user wants it created ONCE before the loop.
          // The nearest enclosing map/filter call is what we want.
          const loopCall = callExpr.getFirstAncestorByKind(SyntaxKind.CallExpression);
          
          if (loopCall && (loopCall.getExpression().getText().endsWith(".map") || loopCall.getExpression().getText().endsWith(".filter"))) {
             // We need to insert before the statement containing loopCall
             const statement = loopCall.getFirstAncestorByKind(SyntaxKind.ExpressionStatement) || 
                               loopCall.getFirstAncestorByKind(SyntaxKind.VariableStatement) ||
                               loopCall.getFirstAncestorByKind(SyntaxKind.ReturnStatement) ||
                               loopCall.getFirstAncestorByKind(SyntaxKind.JsxExpression) ||
                               loopCall.getFirstAncestorByKind(SyntaxKind.JsxElement);
                               
             if (statement) {
                // If it's JSX expression, we might need to insert before the parent element or return statement.
                const insertBlock = callExpr.getFirstAncestorByKind(SyntaxKind.Block);
                if (insertBlock) {
                   // Check if the Set is already created in this block
                   const existing = insertBlock.getVariableStatement(stmt => stmt.getText().includes(`const ${setName} = new Set`));
                   if (!existing) {
                      // Find index of statement in block
                      const statementAncestorsSet = new Set(statement.getAncestors());
                      const childIndex = insertBlock.getStatements().findIndex(s => statementAncestorsSet.has(s as any) || s === statement);
                      if (childIndex !== -1) {
                         insertBlock.insertStatements(childIndex, `const ${setName} = new Set(${targetArray});`);
                      } else {
                         insertBlock.insertStatements(0, `const ${setName} = new Set(${targetArray});`);
                      }
                   }
                   
                   // Replace call
                   propAccess.getExpression().replaceWithText(setName);
                   propAccess.getNameNode().replaceWithText("has");
                   madeChanges = true;
                }
             }
          }
        }
      }
    }
  }
  
  if (madeChanges) {
    sourceFile.saveSync();
    console.log("Updated", filePath);
  }
}
