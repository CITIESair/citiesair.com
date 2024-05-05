"use strict";(self.webpackChunkfront_end=self.webpackChunkfront_end||[]).push([[1],{31900:(e,t,s)=>{s.r(t),s.d(t,{default:()=>Le});var n=s(72791),o=s(57689),a=s(78914),r=s(75973),i=s(53540),l=s(36305),c=s(61745),d=s(40472),u=s(20068),h=s(81918),x=s(47047),m=s(20890),p=s(89164),j=s(61889),g=s(697),Z=s(36314),f=s(94721),v=s(13967),y=s(30604),b=s(60173),S=s(49877),D=s(55396),C=s(60627),k=s(35527),w=s(61162),_=s(53524),I=s(47438),T=s(80223),P=s(80184);function z(e){const[t,s]=(0,n.useState)(null),o=e=>{s(e.currentTarget),I.y(I.z.airQualityIndexLegendQuickGlance)},a=()=>{s(null)},r=Boolean(t);return(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(_.TF,{...e,distanceFromBottomOfWindow:"5.5rem",children:(0,P.jsx)(S.Z,{sx:{mt:1},"aria-owns":r?I.z.airQualityIndexLegendQuickGlance:void 0,"aria-haspopup":"true",onMouseEnter:o,onMouseLeave:a,onClick:e=>b.tq&&(r?a():o(e)),"aria-label":I.z.airQualityIndexLegendQuickGlance,color:"primary",children:(0,P.jsxs)(Z.Z,{direction:"column",alignItems:"center",children:[(0,P.jsx)(w.Z,{fontSize:"1rem"}),(0,P.jsx)(m.Z,{variant:"body2",fontWeight:"500",children:"AQI"})]})})}),(0,P.jsx)(D.Z,{id:I.z.airQualityIndexLegendQuickGlance,sx:{pointerEvents:"none",mt:-1},open:r,anchorEl:t,placement:"top-end",onClose:a,keepMounted:!0,disableRestoreFocus:!0,transition:!0,children:e=>{let{TransitionProps:t}=e;return(0,P.jsx)(C.Z,{...t,timeout:350,children:(0,P.jsxs)(k.Z,{elevation:8,sx:{py:.5,mb:1},children:[(0,P.jsx)(m.Z,{sx:{mx:2,mt:1},color:"text.disabled",variant:"body1",fontWeight:500,children:"AQI at quick glance"}),(0,P.jsx)(T.Z,{isTiny:!0,hideAQIDescription:!0})]})})}})]})}var A=s(71478),M=s(40501),E=s(44281),L=(s(14058),s(4853)),O=s(69161),U=s(69755),B=s(95193),Q=s(94294),F=s(29818),N=s(97123),G=s(30195),R=s(80043),W=s(79836),H=s(56890),$=s(35855),q=s(53994),V=s(53382),Y=s(68096),X=s(99321),J=s(5022),K=s(73518),ee=s(71566),te=s(31009),se=s(48206),ne=s(6694),oe=s(83165);function ae(e){const{currentSchoolID:t,current:s}=(0,n.useContext)(oe.G),[o,a]=(0,n.useState)({}),[r,i]=(0,n.useState)("placeholder");(0,n.useEffect)((()=>{if(!s)return;const e=s.filter((e=>e&&e.sensor)).reduce(((e,t)=>(e[t.sensor.location_short]={location_type:t.sensor.location_type,location_short:t.sensor.location_short,location_long:t.sensor.location_long,last_seen:t.sensor.last_seen.split("T")[0],rawDatasets:Object.keys(se.M$).reduce(((e,t)=>(e[se.M$[t]]={sample:null,full:null},e)),{})},e)),{});a(e)}),[s]);const l=(0,v.Z)(),c=(0,B.Z)(l.breakpoints.down("sm")),[d,u]=(0,n.useState)(!1),x=()=>{u(!1)};return(0,P.jsxs)(P.Fragment,{children:[(0,P.jsxs)(Q.Z,{onClick:()=>{i(null),u(!0),I.y(I.z.rawDatasetButtonClicked)},variant:"contained",children:[(0,P.jsx)(ee.Z,{sx:{fontSize:"1rem"}}),"\xa0Raw Dataset"]}),(0,P.jsxs)(F.Z,{open:d,onClose:x,maxWidth:"lg",fullWidth:!0,fullScreen:c,keepMounted:!0,zIndex:1e4,children:[c&&(0,P.jsx)(N.Z,{sx:{justifyContent:"start"},children:(0,P.jsxs)(Q.Z,{autoFocus:!0,onClick:x,children:[(0,P.jsx)(te.Z,{sx:{fontSize:"1rem"}}),"Back"]})}),(0,P.jsxs)(G.Z,{sx:{px:c?2:3,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"start"},children:[(0,P.jsx)(h.Z,{label:t?"School: ".concat(t.toUpperCase()):"No School",size:"small",sx:{mb:1}}),(0,P.jsx)(m.Z,{variant:"h6",zIndex:"10000",sx:{mb:1},children:"Preview and download raw dataset(s)"}),(0,P.jsx)(re,{sensorsDatasets:o,updateSensorsDatasets:a,previewingDataset:r,setPreviewingDataset:i,smallScreen:c,schoolID:t}),o&&(0,P.jsxs)(m.Z,{variant:"caption",sx:{my:3,fontStyle:"italic"},children:["These datasets are provided by CITIESair from sensors operated by CITIESair. Should you intend to utilize them for your project, research, or publication, we kindly request that you notify us at ",(0,P.jsx)(R.Z,{href:"mailto:nyuad.cities@nyu.edu",children:"nyuad.cities@nyu.edu"})," to discuss citation requirements."]})]})]})]})}const re=e=>{const{sensorsDatasets:t,updateSensorsDatasets:s,previewingDataset:o,setPreviewingDataset:r,smallScreen:i,schoolID:l}=e;return(0,n.useEffect)((()=>{if(Object.keys(t).length>0&&!o){const e=Object.keys(t)[0],n=se.M$.hourly;if(r({sensor:e,datasetType:n}),t[e].rawDatasets[n].sample)return;const o=(0,se.OM)({school_id:l,sensor_location_short:e,datasetType:n,isSample:!0});(0,a.m)({url:o,extension:"csv",needsAuthorization:!0}).then((o=>{const a={...t};a[e].rawDatasets[n].sample=o,s(a)})).catch((e=>console.log(e)))}}),[t,o]),(0,P.jsxs)(j.ZP,{container:!0,justifyContent:"center",alignItems:"start",spacing:i?1:2,sx:{mt:0},overflow:"scroll",children:[(0,P.jsx)(j.ZP,{item:!0,sm:12,md:6,children:(0,P.jsx)(ie,{schoolID:l,sensorsDatasets:t,updateSensorsDatasets:s,smallScreen:i,previewingDataset:o,setPreviewingDataset:r})}),(0,P.jsx)(j.ZP,{item:!0,sm:12,md:6,maxWidth:i?"100%":"unset",sx:{mt:1},children:(0,P.jsx)(ce,{sensorsDatasets:t,updateSensorsDatasets:s,previewingDataset:o,schoolID:l,smallScreen:i})})]})},ie=e=>{const{schoolID:t,sensorsDatasets:s,smallScreen:n,previewingDataset:o,setPreviewingDataset:a,updateSensorsDatasets:r}=e;return(0,P.jsxs)(W.Z,{size:"small",sx:{tableLayout:"fixed","& td, div, .MuiMenuItem-root":{fontSize:n?"0.625rem":"0.8rem"}},children:[(0,P.jsx)(H.Z,{children:(0,P.jsxs)($.Z,{children:[(0,P.jsx)(q.Z,{sx:{pl:1},children:"Sensor Location"}),(0,P.jsx)(q.Z,{sx:{width:n?"9.5rem":"11rem"},children:"Dataset Type"})]})}),(0,P.jsx)(V.Z,{children:s&&Object.keys(s).map((e=>(0,P.jsx)(le,{schoolID:t,smallScreen:n,sensor:e,sensorsDatasets:s,previewingDataset:o,setPreviewingDataset:a,isPreviewing:e===(null===o||void 0===o?void 0:o.sensor),updateSensorsDatasets:r})))})]})},le=e=>{const{schoolID:t,sensorsDatasets:s,sensor:o,previewingDataset:r,setPreviewingDataset:i,isPreviewing:l,updateSensorsDatasets:c}=e,[d,u]=(0,n.useState)(se.M$.hourly);(0,n.useEffect)((()=>{d!==se.M$.hourly&&u(se.M$.hourly)}),[t]);const h=e=>{if(!s[o].rawDatasets[e].sample){const n=(0,se.OM)({school_id:t,sensor_location_short:s[o].location_short,datasetType:e,isSample:!0});(0,a.m)({url:n,extension:"csv",needsAuthorization:!0}).then((t=>{const n={...s};n[o].rawDatasets[e].sample=t,c(n)}))}},x=(0,v.Z)();return(0,P.jsx)(P.Fragment,{children:(0,P.jsxs)($.Z,{children:[(0,P.jsx)(q.Z,{sx:{pl:1,cursor:"pointer",background:l&&x.palette.background.NYUpurpleLight},onClick:()=>{(null===r||void 0===r?void 0:r.sensor)!==o&&(i({datasetType:d,sensor:o}),h(d))},children:s[o].location_long}),(0,P.jsx)(q.Z,{sx:{position:"relative",background:l&&x.palette.background.NYUpurpleLight},children:(0,P.jsx)(Y.Z,{size:"small",children:(0,P.jsx)(X.Z,{value:d,onChange:e=>{const t=e.target.value;u(t),i({datasetType:t,sensor:o}),h(t)},variant:"standard",MenuProps:{disablePortal:!0},children:Object.keys(s[o].rawDatasets).reverse().map(((e,t)=>(0,P.jsx)(J.Z,{value:e,children:(0,P.jsx)(Z.Z,{direction:"row",alignItems:"center",children:e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()})},t)))})})})]},o)})},ce=e=>{const{sensorsDatasets:t,updateSensorsDatasets:s,previewingDataset:o,schoolID:r,smallScreen:i}=e,l=(0,v.Z)(),[c,d]=(0,n.useState)("Not previewing any dataset"),[u,h]=(0,n.useState)("No dataset"),[x,p]=(0,n.useState)(!1),j=e=>{const t=new Blob([e],{type:"application/octet-stream"}),s=URL.createObjectURL(t),n=document.createElement("a");n.href=s,n.download=u,document.body.appendChild(n),n.click(),URL.revokeObjectURL(s),document.body.removeChild(n)},[f,y]=(0,n.useState)(""),[b,S]=(0,n.useState)("");return(0,n.useEffect)((()=>{var e,s;if(!o)return;d("Previewing: ".concat(o.sensor," (").concat(o.datasetType,")"));const n=null===(e=t[o.sensor])||void 0===e||null===(s=e.rawDatasets[o.datasetType])||void 0===s?void 0:s.sample;if(!n)return S(null),y(null),h("Loading..."),void p(!0);x&&p(!1);const a=n.split("\n"),i=a[0].split(","),l=a.slice(1);let c;if(S(["",...l.map((e=>e.split(",")[0]))].join("\n")),y([i.slice(1).join(","),...l.map((e=>e.split(",").slice(1).join(",")))].join("\n")),l.length>0){const e=l[l.length-1].split(",");if(e.length>=2){c=e[1].split("T")[0]}}const u="".concat(r,"-").concat(o.sensor,"-").concat(o.datasetType,"-").concat(c,".csv");h(u)}),[o,t]),(0,P.jsxs)(Z.Z,{spacing:1,children:[(0,P.jsxs)(g.Z,{sx:{"& *":{fontFamily:"monospace !important"}},children:[(0,P.jsx)(Z.Z,{direction:"row",children:(0,P.jsx)(m.Z,{variant:"body2",gutterBottom:!0,fontWeight:500,children:c})}),(0,P.jsx)(g.Z,{component:"pre",sx:{overflowX:"auto",color:l.palette.text.secondary,backgroundColor:l.palette.customBackground,p:2,pt:1.5,borderRadius:l.shape.borderRadius,borderTopLeftRadius:0,height:i?"11.8rem":"14rem",width:i?"100%":"unset",marginTop:0},children:(0,P.jsx)(Z.Z,{direction:"row",sx:{fontSize:i?"0.625rem !important":"0.8rem !important"},children:f?(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(g.Z,{sx:{mr:2,userSelect:"none"},children:b}),(0,P.jsx)(g.Z,{children:f})]}):(0,P.jsx)(ne.Z,{optionalText:"Loading"})})})]}),(0,P.jsx)(g.Z,{textAlign:"center",children:(0,P.jsxs)(Q.Z,{variant:"contained",sx:{textTransform:"none",textAlign:"left",lineHeight:1.1,px:1.5,py:1},onClick:()=>{(()=>{if(!o)return;const e=t[o.sensor].rawDatasets[o.datasetType].full;if(e)j(e);else{const e=(0,se.OM)({school_id:r,sensor_location_short:o.sensor,datasetType:o.datasetType,isSample:!1});(0,a.m)({url:e,extension:"csv",needsAuthorization:!0}).then((e=>{const n={...t};n[o.sensor].rawDatasets[o.datasetType].full=e,s(n),j(e)}))}})(),I.y(I.z.rawDatasetDownloaded,{dataset_type:null===o||void 0===o?void 0:o.datasetType,sensor:null===o||void 0===o?void 0:o.sensor})},disabled:x,children:[(0,P.jsx)(K.Z,{sx:{fontSize:"1.25rem",mr:.5}}),u]})})]})};var de=s(65117),ue=s(11087),he=s(22981),xe=s(81131),me=s(51440);const pe=()=>{const{currentSchoolID:e,schoolMetadata:t}=(0,n.useContext)(oe.G);if(!t)return;const s=t.screens;if(!Array.isArray(s))return null;if(s.length<=1)return(0,P.jsxs)(Q.Z,{variant:"contained",component:ue.rU,to:"/screen/".concat(e),children:[(0,P.jsx)(he.Z,{sx:{fontSize:"1rem"}}),"\xa0TV Screen"]});const[o,a]=(0,n.useState)(null),r=Boolean(o);return(0,P.jsxs)(P.Fragment,{children:[(0,P.jsxs)(Q.Z,{id:"basic-button","aria-controls":r?"tv-screen-list-menu":void 0,"aria-haspopup":"true","aria-expanded":r?"true":void 0,onClick:e=>{a(e.currentTarget)},variant:"contained",children:[(0,P.jsx)(he.Z,{sx:{fontSize:"1rem"}}),"\xa0 TV Screens List"]}),(0,P.jsx)(de.Z,{id:"tv-screen-list-menu",anchorEl:o,open:r,onClose:()=>{a(null)},MenuListProps:{"aria-labelledby":"basic-button"},children:s.map(((t,s)=>(0,P.jsx)(xe.ZP,{behavior:me.Z.toNewPage,to:"/screen/".concat(e,"/").concat(t.screen_name),label:t.location_long,sx:{fontSize:"0.8rem"}},s)))})]})};var je=s(16344),ge=s(1414),Ze=s(25028),fe=s(58562),ve=s(16071),ye=s(18610),be=s(31781),Se=s(26759),De=s(70366);const Ce=()=>{const{currentSchoolID:e,schoolMetadata:t}=(0,n.useContext)(oe.G),{user:s}=(0,n.useContext)(be.S);if(!Array.isArray(s.allowedSchools)||s.allowedSchools.length<=1)return(0,P.jsx)(ze,{icon:(0,P.jsx)(fe.Z,{}),label:(null===t||void 0===t?void 0:t.name)||"N/A",tooltipTitle:"School"});const[a,r]=(0,n.useState)(""),[i,l]=(0,n.useState)(null),c=()=>{l(null)},d=(0,o.s0)(),u=t=>()=>{e!==t&&(localStorage.setItem(ve.m.schoolID,t),r(t),I.y(I.z.internalNavigation,{origin_school:e,destination_school_id:t,origin_id:"school_selector"}),d("".concat(ye.f.dashboard,"/").concat(t))),c()};return(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(ze,{icon:(0,P.jsx)(fe.Z,{}),label:(0,P.jsxs)(g.Z,{sx:{"& svg":{fontSize:"1rem",verticalAlign:"sub",marginLeft:"0.25rem"}},children:[(null===t||void 0===t?void 0:t.name)||"N/A",Boolean(i)?(0,P.jsx)(De.Z,{}):(0,P.jsx)(Se.Z,{})]}),tooltipTitle:"Click to Select School",clickable:!0,onClick:e=>{l(e.currentTarget)},"aria-controls":open?"basic-menu":void 0,"aria-haspopup":"true","aria-expanded":open?"true":void 0}),(0,P.jsx)(de.Z,{anchorEl:i,open:Boolean(i),onClose:c,MenuListProps:{"aria-labelledby":"basic-button"},children:(0,P.jsx)(Ze.Z,{dense:!0,children:s.allowedSchools.map(((e,t)=>(0,P.jsx)(J.Z,{onClick:u(e.school_id),children:e.name},t)))})})]})};var ke=s(70445),we=s(26459),_e=s(19132),Ie=s(85172);const Te=()=>{const{setLoadMoreCharts:e}=(0,n.useContext)(oe.G);return(0,P.jsx)(Z.Z,{sx:{mt:6,mx:"auto",maxWidth:"sm"},children:(0,P.jsxs)(Q.Z,{variant:"contained",onClick:()=>{e(!0)},children:[(0,P.jsx)(Ie.Z,{sx:{fontSize:"1rem"}}),"\xa0Load More Charts"]})})};var Pe=s(35429);const ze=e=>{const{tooltipTitle:t,label:s,...n}=e;return(0,P.jsx)(u.Z,{title:t,enterDelay:0,leaveDelay:200,children:(0,P.jsx)(h.Z,{size:"small",label:s||(0,P.jsx)(x.Z,{variant:"text",sx:{minWidth:"5rem"}}),...n})})},Ae=()=>{let e;const{setChartsTitlesList:t}=(0,n.useContext)(r.F),{commentCounts:s,fetchCommentCounts:o,setCommentCounts:a}=(0,n.useContext)(ke.c),{schoolMetadata:u,current:h,allChartsData:b,loadMoreCharts:S}=(0,n.useContext)(oe.G),{themePreference:D,temperatureUnitPreference:C}=(0,n.useContext)(_e.p),[k,w]=(0,n.useState)(!1),[_,T]=(0,n.useState)(!1);(0,n.useEffect)((()=>{if(!u)return;const e="nyuad"===u.school_id;w(e),T(e),e&&!s&&o().then((e=>{a(e)}))}),[u]),(0,n.useEffect)((()=>{if(null===b||void 0===b||!b.charts)return;const e=null===b||void 0===b?void 0:b.charts.map(((e,t)=>({chartTitle:e.title,chartID:"chart-".concat(t+1)})));t(e)}),[b]);const B=(0,v.Z)(),Q=e=>!0===e&&!1===S?(0,P.jsx)(Te,{}):null,F=()=>(0,P.jsxs)(j.ZP,{container:!0,spacing:1,sx:{mt:-3,pb:3},children:[(0,P.jsx)(j.ZP,{item:!0,children:(0,P.jsx)(Ce,{})}),(0,P.jsx)(j.ZP,{item:!0,children:(0,P.jsx)(ze,{icon:(0,P.jsx)(M.Z,{}),label:null===u||void 0===u?void 0:u.contactPerson,tooltipTitle:"Contact Person"})}),(0,P.jsx)(j.ZP,{item:!0,children:(0,P.jsx)(ze,{icon:(0,P.jsx)(E.Z,{}),label:null===u||void 0===u?void 0:u.contactEmail,tooltipTitle:"Contact Email",component:"a",href:"mailto:".concat(null===u||void 0===u?void 0:u.contactEmail),clickable:!0})}),(0,P.jsx)(j.ZP,{item:!0,children:(0,P.jsx)(ze,{icon:(0,P.jsx)(L.Z,{}),label:"".concat(Object.keys(b).length||"..."," Chart").concat(1!==Object.keys(b).length?"s":""),tooltipTitle:"Number of Charts",onClick:()=>{var e;(0,xe.Qj)(A.O3.id),I.y(I.z.internalNavigation,{destination_id:A.O3.id,destination_label:null===(e=A.chartData)||void 0===e?void 0:e.toString(),origin_id:"chip"})}})}),e,!0===k&&null!==s&&(0,P.jsx)(j.ZP,{item:!0,children:(0,P.jsx)(ze,{icon:(0,P.jsx)(O.Z,{}),label:"".concat(s[d.Hf]," Comment").concat(s[d.Hf]>1?"s":""),tooltipTitle:"Number of Comments",onClick:()=>{(0,xe.Qj)(A.Sf.id),I.y(I.z.internalNavigation,{destination_id:A.Sf.id,destination_label:A.Sf.toString(),origin_id:"chip"})}})})]});return(0,P.jsxs)(g.Z,{width:"100%",children:[(0,P.jsx)(z,{}),(0,P.jsx)(je.Z,{backgroundColor:"customAlternateBackground",children:(0,P.jsxs)(p.Z,{sx:{pt:5},children:[(0,P.jsx)(c.Z,{text:(()=>{if(null!==u&&void 0!==u&&u.school_id)return"Air Quality | ".concat(null===u||void 0===u?void 0:u.school_id)})()}),(0,P.jsx)(F,{})]})}),!0===_&&(0,P.jsx)(we.Z,{initialNyuadCurrentData:h,isOnBannerPage:!1,themePreference:D,minMapHeight:"250px"}),(0,P.jsx)(je.Z,{backgroundColor:"customAlternateBackground",children:(0,P.jsxs)(p.Z,{sx:{pt:3,pb:3},children:[!1===_&&(0,P.jsx)(g.Z,{textAlign:"center",sx:{mb:2},children:(0,P.jsx)(ge.Z,{currentSensorsData:h,isScreen:!1,temperatureUnitPreference:C})}),u?(0,P.jsx)(m.Z,{component:"div",variant:"body1",color:"text.secondary",sx:{textAlign:"justify",pb:2,mb:0,"& table *":{color:"".concat(B.palette.text.secondary)}},gutterBottom:!0,children:(0,i.ZP)(u.description||"",{replace:U.T})}):Array.from({length:3}).map(((e,t)=>(0,P.jsx)(x.Z,{variant:"text"},t))),(0,P.jsxs)(Z.Z,{direction:"row",spacing:2,children:[(0,P.jsx)(pe,{}),(0,P.jsx)(ae,{})]}),(0,P.jsx)(Pe.Z,{})]})}),(0,P.jsx)(g.Z,{id:A.O3.id,children:Object.keys(b).length>0?(0,P.jsx)(P.Fragment,{children:Object.keys(b).map(((e,t)=>(0,P.jsx)(je.Z,{backgroundColor:t%2!==0?"customAlternateBackground":"",children:(0,P.jsxs)(p.Z,{sx:{pt:4,pb:4},height:"auto",className:D===y.Z.dark?"dark":"",id:"chart-".concat(t+1),children:[(0,P.jsxs)(m.Z,{variant:"h6",color:"text.primary",children:[t+1,". ",b[e].title]}),(0,P.jsx)(l.Z,{generalChartSubtitle:b[e].subtitle,generalChartReference:b[e].reference,chartData:{chartIndex:t,...b[e]}}),Q(t===Object.keys(b).length-1)]})},e)))}):(0,P.jsx)(ne.Z,{optionalText:"Loading Visualizations"})}),(0,P.jsx)(f.Z,{}),!0===k&&(0,P.jsx)(je.Z,{id:A.Sf.id,sx:{pt:3,pb:4},children:(0,P.jsx)(d.ZP,{pageID:d.Hf})})]})},Me=[se.ZU.historical,se.ZU.dailyAverageAllTime],Ee=[se.ZU.percentageByMonth,se.ZU.yearlyAverageByDoW,se.ZU.hourlyAverageByMonth,se.ZU.correlationDailyAverage],Le=()=>{const{school_id_param:e}=(0,o.UO)(),t=(0,o.s0)(),s=(0,o.TH)().pathname;(0,n.useEffect)((()=>{e&&(document.title="CITIESair | ".concat(e.toUpperCase()))}),[e]);const{setCurrentPage:i}=(0,n.useContext)(r.F);(0,n.useEffect)((()=>{i(ye.f.dashboard)}),[]);const{currentSchoolID:l,setCurrentSchoolID:c,schoolMetadata:d,setSchoolMetadata:u,current:h,setCurrent:x,allChartsData:m,setIndividualChartData:p,loadMoreCharts:j}=(0,n.useContext)(oe.G),{user:g}=(0,n.useContext)(be.S);(0,n.useEffect)((()=>{if("nyuad"===e)return Z("nyuad"),void c("nyuad");!0===g.checkedAuthentication&&!1===g.authenticated&&t("".concat(ye.f.login,"?").concat(ye.f.redirectQuery,"=").concat(s));const n=g.allowedSchools;if(Array.isArray(n)&&n.length>0){if(!e){let e;const s=localStorage.getItem(ve.m.schoolID);n.map((e=>e.school_id)).includes(s)?e=s:(e=n[0].school_id,c(e),localStorage.setItem(ve.m.schoolID,e)),t(e,{replace:!0}),(d||h||m)&&Z(e)}if(n.map((e=>e.school_id)).includes(e))return c(e),Z(e),void localStorage.setItem(ve.m.schoolID,e)}}),[g,e]);const Z=async e=>{try{u(),x();const t=await Promise.all([(0,a.m)({url:(0,se.kG)({endpoint:se.a3.schoolmetadata,school_id:e}),extension:"json",needsAuthorization:!0}),(0,se.mQ)((0,se.kG)({endpoint:se.a3.current,school_id:e}))]);u(t[0]),x(t[1])}catch(t){console.log(t)}(j?Me.concat(Ee):Me).forEach((t=>{(0,a.m)({url:(0,se.kq)({endpoint:t,school_id:e}),extension:"json",needsAuthorization:!0}).then((e=>{p(e)})).catch((e=>{console.log(e)}))}))};return(0,n.useEffect)((()=>{!0===j&&Ee.forEach((e=>{const t=(0,se.Eh)({endpoint:e,school_id:l});(0,a.m)({url:t,extension:"json",needsAuthorization:!0}).then((e=>{p(e)})).catch((e=>{console.log(e)}))}))}),[j]),(0,P.jsx)(P.Fragment,{children:(0,P.jsx)(Ae,{})})}}}]);
//# sourceMappingURL=1.852969d8.chunk.js.map