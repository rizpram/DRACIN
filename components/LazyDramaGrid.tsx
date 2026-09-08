"use client";

import { useEffect, useRef, useState } from "react";
import type { Drama } from "@/lib/dramas";
import { DramaCard } from "@/components/DramaUI";

export default function LazyDramaGrid({dramas,initial=12,step=8}:{dramas:Drama[];initial?:number;step?:number}){
  const [visible,setVisible]=useState(Math.min(initial,dramas.length));
  const sentinel=useRef<HTMLDivElement|null>(null);

  useEffect(()=>{
    setVisible(Math.min(initial,dramas.length));
  },[dramas,initial]);

  useEffect(()=>{
    const node=sentinel.current;
    if(!node||visible>=dramas.length)return;
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting)setVisible(count=>Math.min(count+step,dramas.length));
    },{rootMargin:"320px"});
    observer.observe(node);
    return()=>observer.disconnect();
  },[visible,dramas.length,step]);

  return <>
    <div className="premium-grid">{dramas.slice(0,visible).map((drama,index)=><DramaCard key={drama.id} drama={drama} index={index} priority={index<2}/>)}</div>
    {visible<dramas.length?<div ref={sentinel} aria-hidden="true" style={{height:1}}/>:null}
  </>;
}
