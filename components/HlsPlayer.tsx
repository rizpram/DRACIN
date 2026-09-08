"use client";

import Link from "next/link";
import { useEffect,useRef,useState } from "react";

function clock(value:number){if(!Number.isFinite(value))return"00:00";const m=Math.floor(value/60),s=Math.floor(value%60);return`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}

export default function HlsPlayer({src,poster,nextHref}:{src:string;poster?:string;nextHref?:string}){
  const ref=useRef<HTMLVideoElement>(null);const [playing,setPlaying]=useState(false);const [buffering,setBuffering]=useState(true);const [current,setCurrent]=useState(0);const [duration,setDuration]=useState(0);const [muted,setMuted]=useState(false);const [controls,setControls]=useState(true);const [countdown,setCountdown]=useState<number|null>(null);const [playbackError,setPlaybackError]=useState("");const hide=useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(()=>{
    const video=ref.current;if(!video)return;
    let cancelled=false;let destroy:undefined|(()=>void);
    setBuffering(true);setPlaybackError("");

    if(video.canPlayType("application/vnd.apple.mpegurl")){
      video.src=src;video.load();
      return()=>{video.removeAttribute("src");video.load()};
    }

    void(async()=>{
      try{
        const {default:Hls}=await import("hls.js");
        if(cancelled)return;
        if(!Hls.isSupported()){
          setPlaybackError("Browser ini belum mendukung HLS.");setBuffering(false);return;
        }
        const hls=new Hls({enableWorker:true,lowLatencyMode:true,backBufferLength:30});
        destroy=()=>hls.destroy();
        hls.on(Hls.Events.ERROR,(_event,data)=>{
          if(data.fatal){setPlaybackError("Video gagal dimuat. Coba lagi sebentar.");setBuffering(false)}
        });
        hls.loadSource(src);hls.attachMedia(video);
      }catch{
        if(!cancelled){setPlaybackError("Player gagal dimuat. Coba refresh halaman.");setBuffering(false)}
      }
    })();

    return()=>{cancelled=true;destroy?.()};
  },[src]);

  useEffect(()=>{if(countdown===null||!nextHref)return;if(countdown<=0){location.href=nextHref;return}const t=setTimeout(()=>setCountdown(x=>x===null?null:x-1),1000);return()=>clearTimeout(t)},[countdown,nextHref]);
  function reveal(){setControls(true);if(hide.current)clearTimeout(hide.current);if(playing)hide.current=setTimeout(()=>setControls(false),3000)}
  function toggle(){const v=ref.current;if(!v||playbackError)return;v.paused?v.play().catch(()=>{}):v.pause()}
  function skip(n:number){const v=ref.current;if(v)v.currentTime=Math.max(0,Math.min(v.duration||0,v.currentTime+n))}
  return <div className="custom-player" onMouseMove={reveal} onTouchStart={reveal}>
    <video ref={ref} playsInline preload="metadata" poster={poster} className="vertical-video" onClick={toggle} onPlay={()=>{setPlaying(true);reveal()}} onPause={()=>setPlaying(false)} onWaiting={()=>setBuffering(true)} onCanPlay={()=>setBuffering(false)} onPlaying={()=>setBuffering(false)} onLoadedMetadata={e=>{setDuration(e.currentTarget.duration||0);setBuffering(false)}} onTimeUpdate={e=>{const v=e.currentTarget;setCurrent(v.currentTime);if(nextHref&&v.duration&&v.currentTime/v.duration>.95&&countdown===null)setCountdown(5)}} onEnded={()=>nextHref&&setCountdown(5)} />
    {buffering&&!playbackError?<div className="player-spinner">◌</div>:null}
    {playbackError?<div className="player-spinner">{playbackError}</div>:null}
    {!playing&&!buffering&&!playbackError?<button className="center-play-button" onClick={toggle} aria-label="Putar">▶</button>:null}
    <div className={`custom-controls ${controls?"show":""}`}>
      <div className="center-skip"><button onClick={()=>skip(-10)}>↺10</button><button onClick={toggle}>{playing?"Ⅱ":"▶"}</button><button onClick={()=>skip(10)}>10↻</button></div>
      <div className="player-bottom-controls"><div className="seekbar" onClick={e=>{const v=ref.current;if(!v||!duration)return;const r=e.currentTarget.getBoundingClientRect();v.currentTime=((e.clientX-r.left)/r.width)*duration}}><span style={{width:duration?`${current/duration*100}%`:"0%"}}/></div><div className="player-control-row"><button onClick={toggle}>{playing?"Ⅱ":"▶"}</button><button onClick={()=>{const v=ref.current;if(v){v.muted=!v.muted;setMuted(v.muted)}}}>{muted?"🔇":"🔊"}</button><code>{clock(current)} / {clock(duration)}</code><button onClick={()=>ref.current?.parentElement?.requestFullscreen?.()}>⛶</button></div></div>
    </div>
    {countdown!==null&&nextHref?<div className="next-up"><strong>Episode berikutnya dalam {countdown}</strong><div><Link href={nextHref}>Tonton Sekarang</Link><button onClick={()=>setCountdown(null)}>Batal</button></div></div>:null}
  </div>
}
