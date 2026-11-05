"use client";
import { useEffect,useRef } from "react";
import { EditorView,basicSetup } from "codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
export function Editor({value,language,onChange,readOnly=false}:{value:string;language:"html"|"css"|"js";onChange:(v:string)=>void;readOnly?:boolean}) {
 const host=useRef<HTMLDivElement>(null),view=useRef<EditorView|null>(null),callback=useRef(onChange);
 callback.current=onChange;
 useEffect(()=> {
  if (!host.current) return;
  const editor=new EditorView({parent:host.current,doc:value,extensions:[basicSetup,language==="html"?html():language==="css"?css():javascript(),EditorView.editable.of(!readOnly),EditorView.lineWrapping,EditorView.contentAttributes.of({"aria-label":`Editor ${language.toUpperCase()}`}),EditorView.updateListener.of(u=>{if(u.docChanged)callback.current(u.state.doc.toString());}),EditorView.theme({"&":{height:"440px",fontSize:"14px"},".cm-scroller":{overflow:"auto",fontFamily:"Consolas, monospace"}})]});
  view.current=editor;return()=>{editor.destroy();view.current=null;};
 // A separate editor instance per language restores text from the current draft.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[language,readOnly]);
 useEffect(()=> {const v=view.current;if(v&&v.state.doc.toString()!==value)v.dispatch({changes:{from:0,to:v.state.doc.length,insert:value}});},[value]);
 return <div ref={host} className="code-editor"/>;
}
