import { Project, SyntaxKind, CallExpression, Node } from "ts-morph";
import * as fs from "fs";

const data = JSON.parse(fs.readFileSync('C:/Users/sathy/.gemini/antigravity-ide/brain/ff916d09-2954-45e5-adab-860039908cac/scratch/js-set-map-lookups-arrays.json', 'utf8'));

const project = new Project();
const filesToProcess = [...new Set(data.map((d: { file: string }) => d.file))];

filesToProcess.forEach(f => project.addSourceFileAtPath(f as string));

for (const sourceFile of project.getSourceFiles()) {
  let madeChanges = false;
  const filePath = sourceFile.getFilePath();
  
  const fileData = data.filter((d: { file: string }) => {
    const fileName = d.file.split('/').pop();
    return d.file === filePath || (fileName !== undefined && filePath.endsWith(fileName));
  });
  
  for (const instruction of fileData) {
    if (instruction.file.includes("AddOrganizationForm")) continue;
    
    const targetArray = instruction.target;
    if (!targetArray) continue;
    
    const setName = targetArray.replace(/[^a-zA-Z0-9]/g, '') + "Set";
    
    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    
    for (const callExpr of callExpressions) {
      const expr = callExpr.getExpression();
      if (expr.getKind() === SyntaxKind.PropertyAccessExpression) {
        const propAccess = expr.asKind(SyntaxKind.PropertyAccessExpression);
        if (propAccess && propAccess.getExpression().getText() === targetArray && propAccess.getName() === "includes") {
          
          const loopCall = callExpr.getFirstAncestorByKind(SyntaxKind.CallExpression);
          
          if (loopCall && (loopCall.getExpression().getText().endsWith(".map") || loopCall.getExpression().getText().endsWith(".filter"))) {
             
             // WE WANT TO INSERT BEFORE THE STATEMENT CONTAINING THE LOOP CALL.
             const loopStatement = loopCall.getFirstAncestor(node => {
               const kind = node.getKind();
               return kind === SyntaxKind.VariableStatement ||
                      kind === SyntaxKind.ExpressionStatement ||
                      kind === SyntaxKind.ReturnStatement ||
                      kind === SyntaxKind.IfStatement ||
                      kind === SyntaxKind.JsxElement ||
                      kind === SyntaxKind.JsxFragment ||
                      kind === SyntaxKind.JsxExpression;
             });

             if (loopStatement) {
                // Find the block containing the loopStatement, or a place to insert.
                // It might be a block, or it might be directly in a Jsx block.
                let insertBlock = loopStatement.getParentIfKind(SyntaxKind.Block);
                let insertTarget = loopStatement;
                
                if (!insertBlock) {
                  // Keep walking up until we find a Block
                  const block = loopCall.getFirstAncestorByKind(SyntaxKind.Block);
                  if (block) {
                    insertBlock = block;
                    // Find which child of this block contains the loopCall
                    const children = block.getStatements();
                    const loopCallAncestorsSet = new Set(loopCall.getAncestors());
                    insertTarget = children.find(c => (c as Node) === (loopCall as Node) || loopCallAncestorsSet.has(c as any)) || block.getStatements()[0];
                  }
                }
                
                if (insertBlock) {
                   const existing = insertBlock.getVariableStatement(stmt => stmt.getText().includes(`const ${setName} = new Set`));
                   if (!existing) {
                      const childIndex = insertBlock.getStatements().findIndex(s => s === insertTarget);
                      if (childIndex !== -1) {
                         insertBlock.insertStatements(childIndex, `const ${setName} = new Set(${targetArray});`);
                      } else {
                         insertBlock.insertStatements(0, `const ${setName} = new Set(${targetArray});`);
                      }
                   }
                   
                   propAccess!.getExpression().replaceWithText(setName);
                   propAccess!.getNameNode().replaceWithText("has");
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
