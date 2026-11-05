import { parse } from "@babel/parser";
import traverseImport from "@babel/traverse";
import generateImport from "@babel/generator";
import * as t from "@babel/types";
const traverse=(traverseImport as unknown as {default?:typeof traverseImport}).default??traverseImport;
const generate=(generateImport as unknown as {default?:typeof generateImport}).default??generateImport;
/** Cooperative budget checks at loop backedges and function entry points. */
export function instrument(source:string,guard:string,expression=false) {
 const ast=parse(expression?`window.__testResult = (async () => (\n${source}\n))();`:source,{sourceType:"script",allowAwaitOutsideFunction:false});
 const check=()=>t.expressionStatement(t.callExpression(t.identifier(guard),[]));
 traverse(ast,{
  Loop(path) {const body=path.node.body; if (t.isBlockStatement(body)) body.body.unshift(check()); else path.node.body=t.blockStatement([check(),body]);},
  Function(path) {const body=path.node.body;if (t.isBlockStatement(body)) body.body.unshift(check());else path.node.body=t.blockStatement([check(),t.returnStatement(body)]);},
  ImportDeclaration() {throw new Error("Import tidak tersedia di sandbox.");},
  CallExpression(path) {if (path.node.callee.type==="Import") throw new Error("Import dinamis tidak tersedia di sandbox.");}
 });
 return generate(ast).code;
}
