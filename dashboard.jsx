import { useState, useMemo } from "react";

const START = new Date(2026, 6, 30);
const END   = new Date(2027, 0, 1);

let _nextId = 16;
const uid = () => ++_nextId;

const DEFAULT_SCHEDULE = [
  { id:1,  time:"5:00–6:00 AM",      label:"Running",       cat:"fitness", icon:"🏃‍♂️" },
  { id:2,  time:"6:00–6:20 AM",      label:"Freshen Up",    cat:"break",   icon:"🚿"  },
  { id:3,  time:"6:20–6:35 AM",      label:"Breakfast",     cat:"meal",    icon:"🍳"  },
  { id:4,  time:"6:35–9:35 AM",      label:"Class 1",       cat:"class",   icon:"📚"  },
  { id:5,  time:"9:35–9:40 AM",      label:"Short Break",   cat:"break",   icon:"☕"  },
  { id:6,  time:"9:40–11:40 AM",     label:"DSA",           cat:"dsa",     icon:"💻"  },
  { id:7,  time:"11:40 AM–12:05 PM", label:"Lunch",         cat:"meal",    icon:"🍱"  },
  { id:8,  time:"12:05–3:05 PM",     label:"Class 2",       cat:"class",   icon:"📖"  },
  { id:9,  time:"3:05–3:10 PM",      label:"Short Break",   cat:"break",   icon:"☕"  },
  { id:10, time:"3:10–4:10 PM",      label:"Project Work",  cat:"project", icon:"🛠️"  },
  { id:11, time:"4:10–4:20 PM",      label:"Travel to Gym", cat:"break",   icon:"🚗"  },
  { id:12, time:"4:20–6:20 PM",      label:"Gym",           cat:"fitness", icon:"🏋️‍♂️" },
  { id:13, time:"6:20–6:30 PM",      label:"Shower",        cat:"break",   icon:"🚿"  },
  { id:14, time:"6:30–7:00 PM",      label:"Dinner",        cat:"meal",    icon:"🍽️"  },
  { id:15, time:"7:00 PM–5:00 AM",   label:"Sleep",         cat:"sleep",   icon:"😴"  },
];

const CAT_COLORS = {
  fitness: { light:"#FEE2E2", border:"#EF4444", text:"#DC2626" },
  class:   { light:"#EDE9FE", border:"#8B5CF6", text:"#7C3AED" },
  dsa:     { light:"#FEF3C7", border:"#F59E0B", text:"#B45309" },
  project: { light:"#D1FAE5", border:"#10B981", text:"#059669" },
  meal:    { light:"#FFEDD5", border:"#F97316", text:"#EA580C" },
  break:   { light:"#F8FAFC", border:"#CBD5E1", text:"#64748B" },
  sleep:   { light:"#DBEAFE", border:"#3B82F6", text:"#1D4ED8" },
};

const CATS = Object.keys(CAT_COLORS);
const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const DAY_INIT = ["S","M","T","W","T","F","S"];

function fmtKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function getDays(s, e) {
  const a=[]; let d=new Date(s);
  while(d<=e){a.push(new Date(d));d.setDate(d.getDate()+1);}
  return a;
}

function Ring({ pct, size=52, stroke=5, color="#6366F1" }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={circ}
        strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 0.4s ease"}}/>
    </svg>
  );
}

function Chip({ label, val, sub, accent }) {
  return (
    <div style={{background:accent?"#6366F1":"#fff",
      border:`1.5px solid ${accent?"#6366F1":"#E2E8F0"}`,
      borderRadius:12,padding:"10px 16px",textAlign:"center",minWidth:80,
      boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
      <div style={{fontSize:9,color:accent?"rgba(255,255,255,0.75)":"#94A3B8",
        letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>{label}</div>
      <div style={{fontSize:18,fontWeight:800,color:accent?"#fff":"#1E293B"}}>{val}</div>
      {sub&&<div style={{fontSize:9,color:accent?"rgba(255,255,255,0.65)":"#94A3B8",marginTop:2}}>{sub}</div>}
    </div>
  );
}

function BlockEditor({ block, onSave, onCancel, onDelete }) {
  const [form, setForm] = useState({...block});
  const col = CAT_COLORS[form.cat]||CAT_COLORS.break;

  const inp = (field) => ({
    value: form[field],
    onChange: e => setForm(f=>({...f,[field]:e.target.value})),
    style: {
      width:"100%", boxSizing:"border-box",
      padding:"7px 10px", border:"1.5px solid #E2E8F0",
      borderRadius:8, fontSize:13, color:"#1E293B",
      background:"#fff", outline:"none",
      fontFamily:"inherit",
    }
  });

  return (
    <div style={{border:`2px solid ${col.border}`,borderRadius:12,padding:14,
      background:col.light,display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",gap:8}}>
        <input {...inp("icon")} style={{...inp("icon").style,
          width:44,textAlign:"center",fontSize:18,padding:"7px 4px",flexShrink:0}}
          placeholder="🎯"/>
        <input {...inp("label")} style={{...inp("label").style,fontWeight:700}}
          placeholder="Task name"/>
      </div>
      <input {...inp("time")} placeholder="e.g. 5:00–6:00 AM"/>
      <select value={form.cat} onChange={e=>setForm(f=>({...f,cat:e.target.value}))}
        style={{width:"100%",padding:"7px 10px",border:"1.5px solid #E2E8F0",
          borderRadius:8,fontSize:13,color:"#1E293B",background:"#fff",
          fontFamily:"inherit",cursor:"pointer"}}>
        {CATS.map(c=>(
          <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
        ))}
      </select>
      <div style={{display:"flex",gap:6,marginTop:2}}>
        <button onClick={()=>onSave(form)} style={{flex:1,padding:"8px",borderRadius:8,
          border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>
          Save
        </button>
        <button onClick={onCancel} style={{flex:1,padding:"8px",borderRadius:8,
          border:"1.5px solid #E2E8F0",background:"#fff",color:"#64748B",fontSize:12,cursor:"pointer"}}>
          Cancel
        </button>
        <button onClick={onDelete} title="Delete"
          style={{padding:"8px 12px",borderRadius:8,
          border:"1.5px solid #FEE2E2",background:"#FEF2F2",
          color:"#EF4444",fontSize:14,cursor:"pointer",lineHeight:1}}>
          🗑
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [schedule,  setSchedule]  = useState(DEFAULT_SCHEDULE);
  const [selected,  setSelected]  = useState(null);
  const [done,      setDone]      = useState({});
  const [editMode,  setEditMode]  = useState(false);
  const [editingId, setEditingId] = useState(null);

  const allDays   = useMemo(()=>getDays(START,END),[]);
  const totalDays = allDays.length;
  const todayKey  = fmtKey(new Date());

  const isDayComplete = (key) => {
    const ids = done[key]||[];
    return ids.length>0 && schedule.every(b=>ids.includes(b.id));
  };

  const completedCount = useMemo(()=>
    allDays.filter(d=>isDayComplete(fmtKey(d))).length,
  [done,allDays,schedule]);

  const streak = useMemo(()=>{
    let n=0; const now=new Date(); now.setHours(0,0,0,0);
    for(let i=allDays.length-1;i>=0;i--){
      const d=new Date(allDays[i]); d.setHours(0,0,0,0);
      if(d>now) continue;
      if(isDayComplete(fmtKey(allDays[i]))) n++;
      else break;
    }
    return n;
  },[done,allDays,schedule]);

  const overallPct = Math.round((completedCount/totalDays)*100);

  const months = useMemo(()=>{
    const m={};
    allDays.forEach(d=>{
      const k=`${d.getFullYear()}-${d.getMonth()}`;
      if(!m[k]) m[k]={y:d.getFullYear(),mo:d.getMonth(),days:[]};
      m[k].days.push(d);
    });
    return Object.values(m);
  },[allDays]);

  const selIds     = selected?(done[selected]||[]):[];
  const doneInSched= selIds.filter(id=>schedule.find(b=>b.id===id)).length;
  const dayPct     = schedule.length>0?Math.round((doneInSched/schedule.length)*100):0;
  const allChecked = schedule.length>0&&schedule.every(b=>selIds.includes(b.id));
  const selDateObj = selected?new Date(selected+"T12:00:00"):null;

  const toggleBlock = (id) => {
    if(!selected||editMode) return;
    setDone(p=>{
      const cur=p[selected]||[];
      return {...p,[selected]:cur.includes(id)?cur.filter(x=>x!==id):[...cur,id]};
    });
  };

  const statusOf = (d) => {
    const k=fmtKey(d);
    const now=new Date(); now.setHours(0,0,0,0);
    const dd=new Date(d); dd.setHours(0,0,0,0);
    const ids=done[k]||[];
    if(ids.length>0&&schedule.every(b=>ids.includes(b.id))) return "complete";
    if(ids.length>0) return "partial";
    if(dd<now) return "missed";
    if(dd.getTime()===now.getTime()) return "today";
    return "upcoming";
  };

  const STATUS_STYLES = {
    complete:{bg:"#D1FAE5",border:"#10B981",text:"#059669"},
    partial: {bg:"#FEF9C3",border:"#EAB308",text:"#A16207"},
    missed:  {bg:"#FEF2F2",border:"#FECACA",text:"#FECACA"},
    today:   {bg:"#EDE9FE",border:"#8B5CF6",text:"#6D28D9"},
    upcoming:{bg:"#fff",   border:"#E2E8F0",text:"#CBD5E1"},
  };

  const addBlock = () => {
    const nb={id:uid(),time:"",label:"New Task",cat:"break",icon:"✏️"};
    setSchedule(s=>[...s,nb]);
    setEditingId(nb.id);
  };

  return (
    <div style={{fontFamily:"'Inter',-apple-system,sans-serif",background:"#F8FAFC",
      minHeight:"100vh",color:"#1E293B",padding:"24px 20px"}}>

      {/* ── Header ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",
        flexWrap:"wrap",gap:16,marginBottom:24}}>
        <div>
          <div style={{fontSize:10,letterSpacing:4,color:"#6366F1",
            textTransform:"uppercase",marginBottom:6,fontWeight:700}}>Study Grind</div>
          <h1 style={{margin:0,fontSize:26,fontWeight:800,color:"#1E293B"}}>
            Jul 30 → Jan 1
          </h1>
          <div style={{fontSize:12,color:"#94A3B8",marginTop:4}}>
            2026 – 2027 · {totalDays} days
          </div>
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <button onClick={()=>{setEditMode(e=>!e);setEditingId(null);}}
            style={{padding:"9px 16px",borderRadius:10,cursor:"pointer",fontSize:12,
              fontWeight:700,display:"flex",alignItems:"center",gap:6,
              border:`1.5px solid ${editMode?"#6366F1":"#E2E8F0"}`,
              background:editMode?"#6366F1":"#fff",
              color:editMode?"#fff":"#64748B",
              boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            ✏️ {editMode?"Done Editing":"Edit Schedule"}
          </button>
          <Chip label="Streak"   val={`${streak} 🔥`}/>
          <Chip label="Complete" val={completedCount} sub={`of ${totalDays}`}/>
          <Chip label="Progress" val={`${overallPct}%`} accent/>
        </div>
      </div>

      {/* ── Journey bar ── */}
      <div style={{background:"#fff",borderRadius:14,padding:"14px 20px",marginBottom:24,
        border:"1.5px solid #E2E8F0",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        <div style={{display:"flex",justifyContent:"space-between",
          fontSize:11,color:"#94A3B8",marginBottom:8}}>
          <span>Jul 30, 2026</span>
          <span style={{color:"#6366F1",fontWeight:700}}>
            Day {Math.min(allDays.findIndex(d=>fmtKey(d)>=todayKey)+1,totalDays)} of {totalDays}
          </span>
          <span>Jan 1, 2027</span>
        </div>
        <div style={{background:"#F1F5F9",borderRadius:99,height:8,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${overallPct}%`,
            background:"linear-gradient(90deg,#6366F1,#8B5CF6)",
            borderRadius:99,transition:"width 0.6s ease"}}/>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{display:"grid",
        gridTemplateColumns:selected?"minmax(0,1fr) 340px":"1fr",
        gap:20,alignItems:"start"}}>

        {/* Calendar months */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {months.map(({y,mo,days})=>{
            const firstDow=days[0].getDay();
            const cells=Array(firstDow).fill(null).concat(days);
            return (
              <div key={`${y}-${mo}`} style={{background:"#fff",borderRadius:16,
                padding:"16px 14px",border:"1.5px solid #E2E8F0",
                boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
                <div style={{fontSize:13,fontWeight:700,color:"#475569",
                  marginBottom:12,letterSpacing:0.3}}>
                  {MONTH_NAMES[mo]} {y}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
                  {DAY_INIT.map((d,i)=>(
                    <div key={i} style={{textAlign:"center",fontSize:9,color:"#CBD5E1",
                      padding:"3px 0",fontWeight:700,letterSpacing:0.5}}>{d}</div>
                  ))}
                  {cells.map((d,i)=>{
                    if(!d) return <div key={`e${i}`}/>;
                    const k=fmtKey(d);
                    const st=statusOf(d);
                    const ss=STATUS_STYLES[st];
                    const isSel=selected===k;
                    return (
                      <div key={i} onClick={()=>setSelected(isSel?null:k)}
                        title={d.toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                        style={{aspectRatio:"1",display:"flex",alignItems:"center",
                          justifyContent:"center",fontSize:11,
                          fontWeight:isSel?800:500,borderRadius:8,cursor:"pointer",
                          background:isSel?"#EDE9FE":ss.bg,
                          border:`1.5px solid ${isSel?"#6366F1":ss.border}`,
                          color:isSel?"#6366F1":ss.text,
                          transition:"all 0.1s",position:"relative",
                          boxShadow:isSel?"0 0 0 3px rgba(99,102,241,0.15)":"none"}}>
                        {d.getDate()}
                        {st==="complete"&&(
                          <div style={{position:"absolute",top:2,right:2,
                            width:4,height:4,borderRadius:"50%",background:"#10B981"}}/>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Day detail panel */}
        {selected && (
          <div style={{position:"sticky",top:20}}>
            <div style={{background:"#fff",borderRadius:16,
              border:"1.5px solid #E2E8F0",overflow:"hidden",
              boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>

              {/* Panel header */}
              <div style={{padding:"16px 20px",borderBottom:"1px solid #F1F5F9",
                background:"#FAFBFC",display:"flex",gap:14,alignItems:"center"}}>
                <div style={{position:"relative",flexShrink:0}}>
                  <Ring pct={dayPct} color={dayPct===100?"#10B981":"#F59E0B"}/>
                  <div style={{position:"absolute",inset:0,display:"flex",
                    alignItems:"center",justifyContent:"center",
                    fontSize:10,fontWeight:800,
                    color:dayPct===100?"#059669":"#B45309"}}>{dayPct}%</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:"#94A3B8",marginBottom:2}}>
                    {selDateObj?.toLocaleDateString("en-US",{weekday:"long"})}
                  </div>
                  <div style={{fontSize:16,fontWeight:800,color:"#1E293B"}}>
                    {selDateObj?.toLocaleDateString("en-US",
                      {month:"short",day:"numeric",year:"numeric"})}
                  </div>
                  <div style={{fontSize:10,color:"#94A3B8",marginTop:2}}>
                    {doneInSched}/{schedule.length} blocks done
                  </div>
                </div>
                {editMode&&(
                  <div style={{fontSize:10,color:"#6366F1",fontWeight:700,
                    background:"#EDE9FE",padding:"4px 8px",borderRadius:6}}>
                    EDIT MODE
                  </div>
                )}
              </div>

              {/* Schedule blocks */}
              <div style={{padding:10,maxHeight:"56vh",overflowY:"auto",
                display:"flex",flexDirection:"column",gap:5}}>
                {schedule.map((block)=>{
                  const col=CAT_COLORS[block.cat]||CAT_COLORS.break;
                  const isDone=selIds.includes(block.id)&&!editMode;

                  if(editMode&&editingId===block.id) return (
                    <BlockEditor key={block.id} block={block}
                      onSave={form=>{setSchedule(s=>s.map(b=>b.id===form.id?form:b));setEditingId(null);}}
                      onCancel={()=>setEditingId(null)}
                      onDelete={()=>{setSchedule(s=>s.filter(b=>b.id!==block.id));setEditingId(null);}}/>
                  );

                  return (
                    <div key={block.id}
                      onClick={()=>editMode?setEditingId(block.id):toggleBlock(block.id)}
                      style={{display:"flex",alignItems:"center",gap:10,
                        padding:"9px 12px",borderRadius:10,
                        border:`1.5px solid ${isDone?col.border:"#E2E8F0"}`,
                        background:isDone?col.light:editMode?"#FAFAFA":"#fff",
                        cursor:"pointer",transition:"all 0.12s",
                        opacity:isDone?1:editMode?0.9:0.75,
                        outline:editMode?"1.5px dashed #E2E8F0":"none",
                        outlineOffset:"-1px"}}>
                      <span style={{fontSize:15,flexShrink:0}}>{block.icon}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:700,
                          color:isDone?col.text:"#1E293B",marginBottom:1,
                          textDecoration:isDone?"line-through":"none",
                          whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                          {block.label}
                        </div>
                        <div style={{fontSize:9,color:"#94A3B8"}}>{block.time||"No time set"}</div>
                      </div>
                      {editMode?(
                        <span style={{fontSize:11,color:"#94A3B8",flexShrink:0}}>Edit ›</span>
                      ):(
                        <div style={{width:17,height:17,borderRadius:"50%",flexShrink:0,
                          border:`2px solid ${isDone?col.border:"#CBD5E1"}`,
                          background:isDone?col.border:"transparent",
                          display:"flex",alignItems:"center",justifyContent:"center",
                          transition:"all 0.12s"}}>
                          {isDone&&<span style={{color:"#fff",fontSize:8,fontWeight:900}}>✓</span>}
                        </div>
                      )}
                    </div>
                  );
                })}

                {editMode&&(
                  <button onClick={addBlock}
                    style={{marginTop:4,padding:"10px",borderRadius:10,
                      border:"2px dashed #CBD5E1",background:"transparent",
                      color:"#94A3B8",fontSize:12,cursor:"pointer",fontWeight:600,
                      display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    + Add Task
                  </button>
                )}
              </div>

              {/* Footer */}
              {!editMode&&(
                <div style={{padding:12,borderTop:"1px solid #F1F5F9"}}>
                  <button onClick={()=>setDone(p=>({
                    ...p,[selected]:allChecked?[]:schedule.map(b=>b.id)
                  }))} style={{width:"100%",padding:"10px",borderRadius:10,
                    border:`1.5px solid ${allChecked?"#10B981":"#6366F1"}`,
                    background:allChecked?"#D1FAE5":"#6366F1",
                    color:allChecked?"#059669":"#fff",
                    fontSize:13,fontWeight:700,cursor:"pointer",
                    transition:"all 0.15s"}}>
                    {allChecked?"✓ Day Complete!":"Mark All Done"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Legend ── */}
      <div style={{display:"flex",gap:16,flexWrap:"wrap",marginTop:20,
        paddingTop:16,borderTop:"1px solid #E2E8F0"}}>
        {Object.entries(CAT_COLORS).map(([cat,col])=>(
          <div key={cat} style={{display:"flex",alignItems:"center",gap:5,
            fontSize:11,color:"#94A3B8"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:col.border}}/>
            <span style={{textTransform:"capitalize"}}>{cat}</span>
          </div>
        ))}
        <div style={{marginLeft:"auto",fontSize:11,color:"#CBD5E1"}}>
          Click a date · ✏️ Edit Schedule to customise tasks
        </div>
      </div>
    </div>
  );
}
