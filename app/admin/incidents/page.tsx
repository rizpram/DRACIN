import Link from 'next/link';
import { TopBar } from '@/components/AppChrome';
import IncidentReporterClient from './IncidentReporterClient';
import styles from './incidents.module.css';

export default function IncidentReporterPage(){
  return <main className="app-shell premium-shell"><div className="mobile-frame premium-frame"><TopBar title="Provider Incidents"/><section className={styles.hero}><span className="eyebrow">Operations</span><h1>Provider Incident Reporter</h1><p>Susun laporan teknis ke provider dari error episode, lalu copy report atau download diagnostics.</p><Link href="/admin" className={styles.back}>← Admin</Link></section><IncidentReporterClient/></div></main>
}
