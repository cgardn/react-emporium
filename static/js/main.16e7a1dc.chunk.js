(this["webpackJsonplist-reactor"]=this["webpackJsonplist-reactor"]||[]).push([[0],[,,,,,,,,function(e,t,n){e.exports=n(16)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(0),i=n.n(a),r=n(7),c=n.n(r),l=(n(13),n(2)),o=n(5),s=n(1),d=function(e){i.a.useState(e.canEdit||!0);return i.a.createElement(i.a.Fragment,null,!0===e.isEdit?i.a.createElement("form",{onSubmit:function(t){t.preventDefault(),e.setIsEdit(!1)}},i.a.createElement("input",{className:e.class,value:e.content,autoFocus:!0,onFocus:function(e){return e.target.select()},onChange:function(t){return e.onChange(e.id,t.target.value)},onBlur:function(t){return e.setIsEdit(!1)}})):i.a.createElement("span",{className:e.class,onClick:function(t){return e.setIsEdit(!0)}},e.content))},u=function(e){return i.a.createElement("button",{className:"item-menu",autoFocus:!0,style:{top:e.posY,left:e.posX},onClick:e.onClick,onBlur:e.onBlur},"Delete")},m=function(e){var t=i.a.useState([0,0,!1]),n=Object(s.a)(t,2),a=n[0],r=n[1],c=i.a.useState(!0),l=Object(s.a)(c,2),o=l[0],m=l[1],E=i.a.useState(!1),f=Object(s.a)(E,2),g=f[0],p=f[1],D=function(e){e.stopPropagation()},O=function(e){p(!1)};return g?i.a.createElement("div",{className:"list-item-placeholder",onDragEnd:O,onDragOver:D}):i.a.createElement("div",{className:"list-item",draggable:o?"false":"true",onDragStart:function(t){var n=JSON.stringify({overIndex:e.index,itemId:e.id,content:e.content});p(!0),e.dragDispatch({type:"SET_DRAGGED_ITEM",payload:{id:e.id}}),t.dataTransfer.setData("listItem",n),console.log(t.dataTransfer.getData("listItem"))},onDragEnd:O,onDragOver:D},i.a.createElement(d,{class:"list-item-objects list-item-label",id:e.id,content:e.content,onChange:e.onChange,isEdit:o,setIsEdit:m}),i.a.createElement("button",{className:"deleteItemButton list-item-objects",onClick:function(e){return r([e.pageX,e.pageY,!a[2]])}},String.fromCharCode(9899)+" "+String.fromCharCode(9899)+" "+String.fromCharCode(9899)),a[2]&&i.a.createElement(u,{posX:a[0],posY:a[1],onClick:e.onDeleteClick,onBlur:function(e){return r([0,0,!a])}}))},E=(n(14),function(e){var t=i.a.useContext(D),n=i.a.useContext(O),a=i.a.useState(!1),r=Object(s.a)(a,2),c=r[0],l=r[1],o=function(e,t){n({type:"UPDATE_TODO_CONTENT",itemId:e,payload:t})},u=function(e){var t=JSON.parse(e.dataTransfer.getData("listitem"));console.log(t)};return i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{className:"".concat(e.thisClass,"-individual-title")},i.a.createElement(d,{class:"list-item-objects list-item-label",id:e.id,content:e.title,onChange:function(e,n){t({type:"UPDATE_LIST_TITLE",id:e,payload:n})},isEdit:c,setIsEdit:l,titleEdit:[c,l]}),e.canDelete&&i.a.createElement("button",{className:"list-delete-button",onClick:e.onDeleteClick},"X")),i.a.createElement("div",{className:"".concat(e.thisClass,"-list")},i.a.createElement("div",{className:"list-content",onDragEnter:function(t){return function(t){t.preventDefault(),t.stopPropagation(),n({type:"UPDATE_TODO_OWNER",itemId:e.draggedItem.id,newOwner:e.id,index:e.getSize(e.id)})}(t)}},e.items.filter((function(t){return t.belongsTo===e.id})).sort((function(e,t){return e.index>t.index?1:-1})).map((function(t){return i.a.createElement(m,{key:t.id,id:t.id,index:t.index,content:t.content,swapItems:u,dragDispatch:e.dragDispatch,onChange:o,onDeleteClick:function(){return e=t.id,void n({type:"REMOVE_TODO",itemId:e});var e}})}))),i.a.createElement("button",{className:"addItemButton",style:{fontsize:"2rem"},onClick:function(){n({type:"ADD_TODO",payload:{id:e.getId(),index:e.getSize(e.id),belongsTo:e.id,content:"Click to edit"}})}},"+")))}),f=function(e,t){switch(t.type){case"ADD_LIST":return[].concat(Object(o.a)(e),[t.payload]);case"REMOVE_LIST":return e.filter((function(e){return e.id!==t.listId}));case"UPDATE_LIST_TITLE":return e.map((function(e){return e.id===t.id?Object(l.a)(Object(l.a)({},e),{},{title:t.payload}):e}));default:return e}},g=function(e,t){switch(t.type){case"ADD_TODO":return[].concat(Object(o.a)(e),[t.payload]);case"REMOVE_TODO":return e.filter((function(e){return e.id!==t.itemId})).map((function(e,t){return Object(l.a)(Object(l.a)({},e),{},{index:t})}));case"UPDATE_TODO_CONTENT":return e.map((function(e){return e.id===t.itemId?Object(l.a)(Object(l.a)({},e),{},{content:t.payload}):e}));case"SWAP_TODO_ORDER":return e;case"UPDATE_TODO_OWNER":return e.map((function(e){return e.id===t.itemId?Object(l.a)(Object(l.a)({},e),{},{belongsTo:t.newOwner}):e}));default:return e}},p=function(e,t){switch(t.type){case"SET_DRAGGED_ITEM":return t.payload;case"CLEAR_DRAGGED_ITEM":return{};default:return e}},D=i.a.createContext(null),O=i.a.createContext(null),T=[{id:"m",title:"Monday"},{id:"t",title:"Tuesday"},{id:"w",title:"Wednesday"},{id:"r",title:"Thursday"},{id:"f",title:"Friday"},{id:"s",title:"Saturday"},{id:"u",title:"Sunday"}],v=[],I={},y=function(e){var t=i.a.useReducer(f,T),n=Object(s.a)(t,2),a=n[0],r=n[1],c=i.a.useReducer(g,v),l=Object(s.a)(c,2),o=l[0],d=l[1],u=i.a.useReducer(p,I),m=Object(s.a)(u,2),y=m[0],b=m[1],h=i.a.useState(e.startId||0),C=Object(s.a)(h,2),S=C[0],_=C[1],N=function(){var e=S;return _(S+1),e},k=function(e){o.map((function(t){t.belongsTo===e&&d({type:"REMOVE_TODO",itemId:t.id})})),r({type:"REMOVE_LIST",listId:e})},j=function(e){return o.filter((function(t){return t.belongsTo===e})).length};return i.a.createElement(i.a.Fragment,null,i.a.createElement(D.Provider,{value:r},i.a.createElement(O.Provider,{value:d},i.a.createElement("div",{className:"calendar"},i.a.createElement("div",{className:"calendar-container"},a.map((function(e,t){return t<=6&&i.a.createElement("div",{className:"calendar-individual",key:e.id},i.a.createElement(i.a.Fragment,null,i.a.createElement(E,{thisClass:"calendar",title:e.title,key:e.id,id:e.id,getId:N,items:o,getSize:j,canDelete:!1,canEditTitle:!1,draggedItem:y,dragDispatch:b,onDeleteClick:function(){return k(e.id)}})))})))),i.a.createElement("hr",{style:{width:"90vw"}}),i.a.createElement("div",{className:"todo"},i.a.createElement("div",{className:"todo-container"},a.length>0&&i.a.createElement(i.a.Fragment,null,a.map((function(e,t){return t>6&&i.a.createElement("div",{className:"todo-individual",key:e.id},i.a.createElement(i.a.Fragment,null,i.a.createElement(E,{thisClass:"todo",canDelete:!0,title:e.title,key:e.id,id:e.id,items:o,getSize:j,getId:N,canEditTitle:!0,draggedItem:y,dragDispatch:b,onDeleteClick:function(){return k(e.id)}})))}))),i.a.createElement("button",{className:"addListButton",onClick:function(){var e={title:"New List",id:N()};r({type:"ADD_LIST",listId:e.id,payload:e})}},"+ Add list"))))))},b=(n(15),function(){return i.a.createElement("div",{className:"app"},i.a.createElement(y,null))});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(b,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[8,1,2]]]);
//# sourceMappingURL=main.16e7a1dc.chunk.js.map