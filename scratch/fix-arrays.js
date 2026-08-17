"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_morph_1 = require("ts-morph");
var fs = require("fs");
var data = JSON.parse(fs.readFileSync('C:/Users/sathy/.gemini/antigravity-ide/brain/ff916d09-2954-45e5-adab-860039908cac/scratch/js-set-map-lookups-arrays.json', 'utf8'));
var project = new ts_morph_1.Project();
var filesToProcess = __spreadArray([], new Set(data.map(function (d) { return d.file; })), true);
filesToProcess.forEach(function (f) { return project.addSourceFileAtPath(f); });
var _loop_1 = function (sourceFile) {
    var madeChanges = false;
    var filePath = sourceFile.getFilePath();
    // Find all instructions for this file
    var fileData = data.filter(function (d) { return d.file === filePath || filePath.endsWith(d.file.split('/').pop()); });
    var _loop_2 = function (instruction) {
        if (instruction.file.includes("AddOrganizationForm"))
            return "continue"; // already fixed
        var targetArray = instruction.target;
        if (!targetArray)
            return "continue";
        var setName = targetArray.replace(/[^a-zA-Z0-9]/g, '') + "Set";
        // Find CallExpressions like targetArray.includes(...)
        var callExpressions = sourceFile.getDescendantsOfKind(ts_morph_1.SyntaxKind.CallExpression);
        var _loop_3 = function (callExpr) {
            var expr = callExpr.getExpression();
            if (expr.getKind() === ts_morph_1.SyntaxKind.PropertyAccessExpression) {
                var propAccess = expr.asKind(ts_morph_1.SyntaxKind.PropertyAccessExpression);
                if (propAccess.getExpression().getText() === targetArray && propAccess.getName() === "includes") {
                    // Found it! Check if it's inside a loop.
                    // For simplicity, we just look for the closest parent block and insert the Set creation there.
                    // But wait, the user wants it created ONCE before the loop.
                    // The nearest enclosing map/filter call is what we want.
                    var loopCall = callExpr.getFirstAncestorByKind(ts_morph_1.SyntaxKind.CallExpression);
                    if (loopCall && (loopCall.getExpression().getText().endsWith(".map") || loopCall.getExpression().getText().endsWith(".filter"))) {
                        // We need to insert before the statement containing loopCall
                        var statement_1 = loopCall.getFirstAncestorByKind(ts_morph_1.SyntaxKind.ExpressionStatement) ||
                            loopCall.getFirstAncestorByKind(ts_morph_1.SyntaxKind.VariableStatement) ||
                            loopCall.getFirstAncestorByKind(ts_morph_1.SyntaxKind.ReturnStatement) ||
                            loopCall.getFirstAncestorByKind(ts_morph_1.SyntaxKind.JsxExpression) ||
                            loopCall.getFirstAncestorByKind(ts_morph_1.SyntaxKind.JsxElement);
                        if (statement_1) {
                            // If it's JSX expression, we might need to insert before the parent element or return statement.
                            var insertBlock = callExpr.getFirstAncestorByKind(ts_morph_1.SyntaxKind.Block);
                            if (insertBlock) {
                                // Check if the Set is already created in this block
                                var existing = insertBlock.getVariableStatement(function (stmt) { return stmt.getText().includes("const ".concat(setName, " = new Set")); });
                                if (!existing) {
                                    // Find index of statement in block
                                    var ancestorsSet = new Set(statement_1.getAncestors());
                                    var childIndex = insertBlock.getStatements().findIndex(function (s) { return ancestorsSet.has(s) || s === statement_1; });
                                    if (childIndex !== -1) {
                                        insertBlock.insertStatements(childIndex, "const ".concat(setName, " = new Set(").concat(targetArray, ");"));
                                    }
                                    else {
                                        insertBlock.insertStatements(0, "const ".concat(setName, " = new Set(").concat(targetArray, ");"));
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
        };
        for (var _c = 0, callExpressions_1 = callExpressions; _c < callExpressions_1.length; _c++) {
            var callExpr = callExpressions_1[_c];
            _loop_3(callExpr);
        }
    };
    for (var _b = 0, fileData_1 = fileData; _b < fileData_1.length; _b++) {
        var instruction = fileData_1[_b];
        _loop_2(instruction);
    }
    if (madeChanges) {
        sourceFile.saveSync();
        console.log("Updated", filePath);
    }
};
for (var _i = 0, _a = project.getSourceFiles(); _i < _a.length; _i++) {
    var sourceFile = _a[_i];
    _loop_1(sourceFile);
}
