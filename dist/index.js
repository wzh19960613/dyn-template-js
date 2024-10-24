function l(t,r){const s=r.length;if(!s)return{first:t[0],fns:c,strs:c};const a=[],n=[];let e=0;for(let y=0;y<s;++y){n[e]?n[e]+=t[y]:n[e]=t[y];const f=r[y],o=typeof f;if(o==="function")a[e]=f,e+=1;else if(o==="string")n[e]+=f;else n[e]+=String(f)}const i=n.shift();return--e,n[e]?n[e]+=t[s]:n[e]=t[s],Object.freeze(n),Object.freeze(a),{first:i,fns:a,strs:n}}function g(t,...r){return l(t,r)}function u(t){const{first:r,fns:s,strs:a}=t;return function(){return s.reduce((n,e,i)=>n+e()+a[i],r)}}function p(t,...r){return u(l(t,r))}var c=Object.freeze([]);export{g as dynTemplate,p as dyn,u as closure};

//# debugId=E34028814FCA697064756E2164756E21
//# sourceMappingURL=index.js.map
