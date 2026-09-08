import type { Drama } from "@/lib/dramas";
import { getPlayableCatalog } from "@/lib/playable-catalog";
import { getCatalog } from "@/lib/catalog";
import { VERIFIED_PLAYABLE_PROVIDERS } from "@/lib/playable-providers";
import { withSharedCache } from "@/lib/shared-cache";

const CURATED=[...VERIFIED_PLAYABLE_PROVIDERS];
const TTL_SECONDS=300;

function matches(drama:Drama,q:string){const hay=[drama.title,drama.synopsis,drama.genre,drama.providerName].join(" ").toLowerCase();return hay.includes(q.toLowerCase())}

export async function searchCatalogs(query:string,provider?:string):Promise<Drama[]>{
  const q=query.trim();if(!q)return[];
  const cacheKey=`search:playable-v2:${provider||"all"}:${q.toLowerCase()}`;
  return withSharedCache(cacheKey,TTL_SECONDS,async()=>{
    if(provider&&provider!=="all"){
      try{return (await getCatalog(provider)).filter(d=>matches(d,q)).slice(0,60)}catch{return[]}
    }

    const settled=await Promise.allSettled(CURATED.map(slug=>getPlayableCatalog(slug)));
    const rows=settled.flatMap(x=>x.status==="fulfilled"?x.value:[]);
    const seen=new Set<string>();
    return rows.filter(d=>matches(d,q)).filter(d=>{if(seen.has(d.id))return false;seen.add(d.id);return true}).slice(0,80);
  });
}
