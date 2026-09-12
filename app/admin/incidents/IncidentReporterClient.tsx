'use client';
import {useMemo,useState} from 'react';
import styles from './incidents.module.css';

type Failure={episode:string;status:string;kind:string;latencyMs:string;attempts:string;requestId:string};
type Result={diagnosticId:string;report:string;csv:string;diagnostics:unknown};
const blankFailure=():Failure=>({episode:'',status:'',kind:'upstream',latencyMs:'',attempts:'3',requestId:''});

export default function IncidentReporterClient(){
  const [provider,setProvider]=useState('DramaBox');
  const [endpoint,setEndpoint]=useState('/api/stream');
  const [contentId,setContentId]=useState('');
  const [language,setLanguage]=useState('en');
  const [title,setTitle]=useState('');
  const [totalEpisodes,setTotalEpisodes]=useState('');
  const [firstFailureAt,setFirstFailureAt]=useState('');
  const [lastFailureAt,setLastFailureAt]=useState('');
  const [status,setStatus]=useState('OPEN');
  const [fallbackAvailable,setFallbackAvailable]=useState(false);
  const [failures,setFailures]=useState<Failure[]>([blankFailure()]);
  const [result,setResult]=useState<Result|null>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');

  const valid=useMemo(()=>provider.trim()&&endpoint.trim()&&firstFailureAt&&lastFailureAt&&failures.some(f=>f.episode||f.kind),[provider,endpoint,firstFailureAt,lastFailureAt,failures]);
  function updateFailure(i:number,key:keyof Failure,value:string){setFailures(v=>v.map((f,n)=>n===i?{...f,[key]:value}:f))}
  function toIso(v:string){return v?new Date(v).toISOString():''}
  async function generate(){
    setBusy(true);setError('');setResult(null);
    const payload={provider,endpoint,contentId:contentId||undefined,language:language||undefined,title:title||undefined,totalEpisodes:Number(totalEpisodes)||undefined,firstFailureAt:toIso(firstFailureAt),lastFailureAt:toIso(lastFailureAt),status,fallbackAvailable,failures:failures.map(f=>({episode:Number(f.episode)||undefined,status:Number(f.status)||undefined,kind:f.kind,latencyMs:Number(f.latencyMs)||undefined,attempts:Number(f.attempts)||undefined,requestId:f.requestId||undefined}))};
    try{const r=await fetch('/api/admin/incidents/report',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});const data=await r.json();if(!r.ok||!data.ok)throw new Error(data.error||'Gagal generate report');setResult(data)}catch(e){setError(e instanceof Error?e.message:'Gagal generate report')}finally{setBusy(false)}
  }
  async function copy(text:string){await navigator.clipboard.writeText(text)}
  function download(){if(!result)return;const blob=new Blob([result.csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${result.diagnosticId}.csv`;a.click();URL.revokeObjectURL(url)}
  return <section className={styles.wrap}>
    <div className={styles.card}>
      <div className={styles.grid}>
        <label>Provider<input value={provider} onChange={e=>setProvider(e.target.value)} placeholder="DramaBox"/></label>
        <label>Endpoint<input value={endpoint} onChange={e=>setEndpoint(e.target.value)} placeholder="/api/stream"/></label>
        <label>Content ID<input value={contentId} onChange={e=>setContentId(e.target.value)} placeholder="42000026729"/></label>
        <label>Language<input value={language} onChange={e=>setLanguage(e.target.value)} placeholder="en"/></label>
        <label className={styles.span2}>Drama title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Optional"/></label>
        <label>Total episodes<input type="number" min="1" value={totalEpisodes} onChange={e=>setTotalEpisodes(e.target.value)}/></label>
        <label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option>OPEN</option><option>MONITORING</option><option>RECOVERED</option></select></label>
        <label>First failure<input type="datetime-local" value={firstFailureAt} onChange={e=>setFirstFailureAt(e.target.value)}/></label>
        <label>Last failure<input type="datetime-local" value={lastFailureAt} onChange={e=>setLastFailureAt(e.target.value)}/></label>
      </div>
      <label className={styles.check}><input type="checkbox" checked={fallbackAvailable} onChange={e=>setFallbackAvailable(e.target.checked)}/> Fallback source tersedia</label>
    </div>

    <div className={styles.card}><div className={styles.sectionTitle}><div><span className="eyebrow">Failures</span><h2>Episode errors</h2></div><button className={styles.secondary} onClick={()=>setFailures(v=>[...v,blankFailure()])}>+ Add</button></div>
      <div className={styles.failures}>{failures.map((f,i)=><div className={styles.failure} key={i}>
        <input aria-label="episode" placeholder="EP" type="number" value={f.episode} onChange={e=>updateFailure(i,'episode',e.target.value)}/>
        <input aria-label="http status" placeholder="HTTP" type="number" value={f.status} onChange={e=>updateFailure(i,'status',e.target.value)}/>
        <select aria-label="error kind" value={f.kind} onChange={e=>updateFailure(i,'kind',e.target.value)}><option value="upstream">upstream</option><option value="timeout">timeout</option><option value="rate_limit">rate_limit</option><option value="invalid_media">invalid_media</option><option value="unknown">unknown</option></select>
        <input aria-label="latency" placeholder="ms" type="number" value={f.latencyMs} onChange={e=>updateFailure(i,'latencyMs',e.target.value)}/>
        <input aria-label="attempts" placeholder="try" type="number" value={f.attempts} onChange={e=>updateFailure(i,'attempts',e.target.value)}/>
        <button className={styles.remove} onClick={()=>setFailures(v=>v.length===1?v:v.filter((_,n)=>n!==i))}>×</button>
      </div>)}</div>
    </div>

    <button className={styles.generate} disabled={!valid||busy} onClick={generate}>{busy?'Generating…':'Generate Provider Report'}</button>
    {error?<p className={styles.error}>{error}</p>:null}
    {result?<div className={styles.card}><div className={styles.resultHead}><div><span className="eyebrow">Generated</span><h2>{result.diagnosticId}</h2></div><div className={styles.actions}><button className={styles.secondary} onClick={()=>copy(result.report)}>Copy Report</button><button className={styles.secondary} onClick={()=>copy(JSON.stringify(result.diagnostics,null,2))}>Copy JSON</button><button className={styles.secondary} onClick={download}>Download CSV</button></div></div><textarea className={styles.report} readOnly value={result.report}/></div>:null}
  </section>
}
