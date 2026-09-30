import React, {useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {
  MapPin, Bike, ShoppingBag, Clock3, IndianRupee, Search, Bell,
  ChevronRight, Navigation, Zap, CheckCircle2, Utensils, TrendingUp,
  X, Plus, Minus, Users, Store, BarChart3, Settings, Home, Truck,
  CircleUserRound
} from "lucide-react";
import "./style.css";

const ORDER_DATA = [
 {id:"FD-1048",customer:"Rahul Sharma",restaurant:"Pizza Palace",items:"Farmhouse Pizza + Garlic Bread",amount:649,status:"On the way",eta:12,rider:"Arjun",progress:78},
 {id:"FD-1047",customer:"Simran Kaur",restaurant:"Burger House",items:"Classic Burger Combo",amount:429,status:"Preparing",eta:25,rider:"Vikram",progress:38},
 {id:"FD-1046",customer:"Aman Jain",restaurant:"Spice Garden",items:"Paneer Tikka + Naan",amount:589,status:"Delivered",eta:0,rider:"Rohit",progress:100},
 {id:"FD-1045",customer:"Neha Verma",restaurant:"Wrap Corner",items:"Paneer Wrap + Fries",amount:379,status:"Delivered",eta:0,rider:"Karan",progress:100},
 {id:"FD-1044",customer:"Riya Singh",restaurant:"Biryani Bowl",items:"Chicken Biryani + Raita",amount:529,status:"On the way",eta:8,rider:"Dev",progress:86},
];

function App(){
  const [page,setPage] = useState("Overview");
  const [selected,setSelected] = useState(ORDER_DATA[0]);
  const [search,setSearch] = useState("");
  const [active,setActive] = useState(186);
  const [time,setTime] = useState(new Date());
  const [noticeOpen,setNoticeOpen] = useState(false);
  const [mapZoom,setMapZoom] = useState(1);
  const [centered,setCentered] = useState(false);
  const [toast,setToast] = useState("");

  useEffect(()=>{
    const timer=setInterval(()=>{
      setTime(new Date());
      setActive(v=>Math.max(0,v+(Math.random()>.6?1:-1)));
    },3000);
    return ()=>clearInterval(timer);
  },[]);

  useEffect(()=>{
    if(!toast) return;
    const t=setTimeout(()=>setToast(""),2200);
    return ()=>clearTimeout(t);
  },[toast]);

  const filtered = useMemo(()=>{
    const q=search.trim().toLowerCase();
    if(!q) return ORDER_DATA;
    return ORDER_DATA.filter(o =>
      (o.id+" "+o.customer+" "+o.restaurant+" "+o.status).toLowerCase().includes(q)
    );
  },[search]);

  const selectOrder = (o)=>{
    setSelected(o);
    setToast(`${o.id} selected`);
  };

  const navItems=[
    ["Overview",TrendingUp],
    ["Orders",ShoppingBag],
    ["Delivery Fleet",Truck],
    ["Live Tracking",MapPin],
    ["Restaurants",Utensils]
  ];

  return <div className="app">
    <aside>
      <div className="brand">
        <div className="brandIcon">🍔</div>
        <div>Food<span>Dash</span><small>DELIVERY OS</small></div>
      </div>

      <nav>
        {navItems.map(([name,Icon])=>
          <button key={name} className={page===name?"navBtn active":"navBtn"} onClick={()=>{setPage(name);setToast(name+" opened")}}>
            <Icon/><span>{name}</span>{name==="Orders"&&<b>24</b>}
          </button>
        )}
      </nav>

      <div className="sideBottom">
        <button className="mini" onClick={()=>setToast("All systems are operational")}>
          <Zap/> Live system<br/><strong>All services operational</strong>
        </button>
        <button className="profile" onClick={()=>setToast("Admin profile opened")}>
          <div className="avatar">JM</div>
          <div><b>Janvi</b><small>Admin</small></div>
        </button>
      </div>
    </aside>

    <main>
      <header>
        <div>
          <div className="eyebrow">WEDNESDAY · 30 SEPTEMBER 2026</div>
          <h1>{page==="Overview" ? "Good morning, Janvi 👋" : page}</h1>
          <p>{page==="Overview" ? "Here’s what’s happening with your deliveries today." : `Manage your ${page.toLowerCase()} from one place.`}</p>
        </div>
        <div className="headRight">
          <span className="liveDot">● LIVE</span>
          <span className="time">{time.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</span>
          <button className="bell" onClick={()=>setNoticeOpen(v=>!v)}><Bell size={19}/><i/></button>
          {noticeOpen && <div className="notifications">
            <b>Notifications</b>
            <p>🚴 Rider Arjun is 12 min away.</p>
            <p>📦 186 deliveries are currently active.</p>
            <button onClick={()=>{setNoticeOpen(false);setToast("Notifications marked as read")}}>Mark as read</button>
          </div>}
        </div>
      </header>

      {page==="Overview" && <>
        <section className="kpis">
          <Kpi icon={<ShoppingBag/>} cls="orange" label="TODAY'S ORDERS" value="1,284" note="↑ 12.4%" sub="vs yesterday"/>
          <Kpi icon={<Bike/>} cls="purple" label="ACTIVE DELIVERIES" value={active} note="●" sub="Live right now"/>
          <Kpi icon={<IndianRupee/>} cls="green" label="REVENUE TODAY" value="₹2.84L" note="↑ 8.7%" sub="this week"/>
          <Kpi icon={<Clock3/>} cls="blue" label="AVG DELIVERY" value="28" suffix="MIN" note="↓ 3 min" sub="faster today"/>
        </section>

        <section className="topGrid">
          <div className="panel tracking">
            <div className="panelHead">
              <div><h2>Live delivery tracking</h2><p>Real-time rider location · Auto-refreshing</p></div>
              <span className="pulse">● LIVE</span>
            </div>
            <div className="map" style={{"--zoom":mapZoom}}>
              <div className="gridlines"/>
              <div className="route route1"/><div className="route route2"/>
              <div className="road rA"/><div className="road rB"/>
              <div className="place p1"><span>🍕</span><b>Pizza Palace</b></div>
              <div className="riderPin"><Bike size={18}/><span>RD-104</span></div>
              <div className="place p2"><span>🏠</span><b>Rahul's Home</b></div>
              <div className="mapInfo">
                <div className="miTop"><span className="statusCircle"/> <b>Rider {selected.rider}</b><span>ETA {selected.eta} min</span></div>
                <small>{selected.status} · {selected.restaurant}</small>
                <div className="tinyProgress"><i style={{width:selected.progress+"%"}}/></div>
              </div>
              <div className="zoom">
                <button onClick={()=>setMapZoom(z=>Math.min(1.35,z+.12))}><Plus size={14}/></button>
                <hr/>
                <button onClick={()=>setMapZoom(z=>Math.max(.8,z-.12))}><Minus size={14}/></button>
              </div>
              {centered && <div className="centerTag">✓ Rider centered</div>}
            </div>
            <div className="trackingFooter">
              <div><span className="legend riderL"/>Rider <span className="legend restL"/>Restaurant <span className="legend homeL"/>Customer</div>
              <button onClick={()=>{setCentered(true);setMapZoom(1.12);setToast("Map centered on rider")}}><Navigation size={15}/> Center on rider</button>
            </div>
          </div>

          <div className="panel selected">
            <div className="panelHead"><div><h2>Order tracking</h2><p>Track any active order</p></div><span className="orderTag">{selected.id}</span></div>
            <div className="search"><Search size={16}/><input placeholder="Search order ID, customer..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
            <div className="searchResults">
              {search && filtered.map(o=><button key={o.id} onClick={()=>selectOrder(o)}><b>{o.id}</b><span>{o.customer} · {o.restaurant}</span></button>)}
            </div>
            <div className="customer"><div className="foodPic">🍕</div><div><b>{selected.restaurant}</b><p>{selected.items}</p></div><strong>₹{selected.amount}</strong></div>
            <div className="timeline">
              {["Order placed","Preparing","Picked up","On the way","Delivered"].map((s,i)=>{
                const done=(i*25)<selected.progress;
                return <div className={done?"done":""} key={s}><span>{done?<CheckCircle2/>:<i/>}</span><small>{s}</small></div>
              })}
            </div>
            <div className="etaBox"><div className="riderAvatar">🛵</div><div><small>DELIVERY PARTNER</small><b>{selected.rider} · Rider #RD104</b></div><strong>{selected.status==="Delivered"?"Delivered":selected.eta+" min"}<small> ETA</small></strong></div>
          </div>
        </section>

        <section className="bottomGrid">
          <div className="panel">
            <div className="panelHead"><div><h2>Today's orders</h2><p>Click any order to track it</p></div><button className="view" onClick={()=>setPage("Orders")}>View all <ChevronRight size={15}/></button></div>
            <div className="table">
              {filtered.map(o=><button className="tr" onClick={()=>selectOrder(o)} key={o.id}>
                <div className="id">{o.id}</div><div><b>{o.customer}</b><small>{o.restaurant}</small></div><div className="amount">₹{o.amount}</div><div className={"badge "+o.status.toLowerCase().replaceAll(" ","-")}>{o.status}</div><ChevronRight size={16}/>
              </button>)}
              {!filtered.length && <div className="empty">No matching orders found.</div>}
            </div>
          </div>
          <div className="panel performance">
            <div className="panelHead"><div><h2>Delivery health</h2><p>Live performance indicators</p></div></div>
            <Metric name="On-time delivery" value={91} cls="orange"/>
            <Metric name="Order accuracy" value={97} cls="purple"/>
            <Metric name="Customer satisfaction" value={94} cls="green"/>
            <div className="spark"><div className="sparkTitle">ORDERS THIS WEEK <b>+18.2%</b></div><div className="bars">{[35,52,43,68,58,82,94].map((x,i)=><i key={i} style={{height:x+"%"}}/>)}</div><div className="days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div>
          </div>
        </section>
      </>}

      {page==="Orders" && <FullPage title="Orders" icon={<ShoppingBag/>}>
        <div className="fullSearch"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders, customers or restaurants..."/></div>
        <div className="orderCards">{filtered.map(o=><button className="orderCard" key={o.id} onClick={()=>{setSelected(o);setPage("Overview");setToast(o.id+" opened")}}>
          <div className="orderCardTop"><b>{o.id}</b><span className={"badge "+o.status.toLowerCase().replaceAll(" ","-")}>{o.status}</span></div>
          <h3>{o.restaurant}</h3><p>{o.customer} · {o.items}</p><strong>₹{o.amount}</strong><div className="cardArrow"><ChevronRight/></div>
        </button>)}</div>
      </FullPage>}

      {page==="Delivery Fleet" && <FullPage title="Delivery Fleet" icon={<Truck/>}>
        <div className="fleetStats"><MiniStat icon={<Bike/>} title="Riders online" value="148"/><MiniStat icon={<Truck/>} title="On delivery" value="186"/><MiniStat icon={<Clock3/>} title="Avg shift" value="6.2h"/></div>
        <div className="fleetList">{["Arjun","Vikram","Rohit","Karan","Dev"].map((r,i)=><div className="fleetRow" key={r}><div className="riderCircle">🛵</div><b>{r}</b><span>Rider #RD10{i+1}</span><em className={i===2?"offline":""}>{i===2?"Offline":"Online"}</em><button onClick={()=>{setSelected(ORDER_DATA[i]);setPage("Overview")}}>Track</button></div>)}</div>
      </FullPage>}

      {page==="Live Tracking" && <FullPage title="Live Tracking" icon={<MapPin/>}>
        <div className="bigTracking"><div className="map big"><div className="gridlines"/><div className="route route1"/><div className="route route2"/><div className="riderPin"><Bike size={18}/><span>RD-104</span></div><div className="place p1">🍕 Pizza Palace</div><div className="place p2">🏠 Customer</div><div className="mapInfo"><b>Rider {selected.rider}</b><small>{selected.status} · ETA {selected.eta} min</small></div></div></div>
      </FullPage>}

      {page==="Restaurants" && <FullPage title="Restaurants" icon={<Utensils/>}>
        <div className="restaurantGrid">{[["Pizza Palace","🍕","42 orders"],["Burger House","🍔","31 orders"],["Spice Garden","🍛","27 orders"],["Wrap Corner","🌯","19 orders"]].map(r=><button className="restaurantCard" key={r[0]} onClick={()=>setToast(r[0]+" selected")}><div>{r[1]}</div><b>{r[0]}</b><small>{r[2]} today</small></button>)}</div>
      </FullPage>}

      <footer>FoodDash · Delivery Operations Dashboard <span>Built with React.js + Node.js + Vite · VS Code</span></footer>
    </main>
    {toast && <div className="toast">✓ {toast}</div>}
  </div>
}

function Kpi({icon,cls,label,value,note,sub,suffix}){return <div className="kpi"><div className={"kicon "+cls}>{icon}</div><div><small>{label}</small><strong>{value} {suffix&&<small className="min">{suffix}</small>}</strong><em>{note} <span>{sub}</span></em></div></div>}
function Metric({name,value,cls}){return <div className="metric"><div><span>{name}</span><b>{value}%</b></div><div className="meter"><i className={cls} style={{width:value+"%"}}/></div></div>}
function FullPage({title,icon,children}){return <section className="fullPage"><div className="fullTitle">{icon}<div><h2>{title}</h2><p>Interactive FoodDash management module</p></div></div>{children}</section>}
function MiniStat({icon,title,value}){return <div className="miniStat">{icon}<div><small>{title}</small><b>{value}</b></div></div>}

createRoot(document.getElementById("root")).render(<App/>);
