(this["webpackJsonplist-reactor"]=this["webpackJsonplist-reactor"]||[]).push([[0],{20:function(t,e,i){},27:function(t,e,i){},28:function(t,e,i){},29:function(t,e,i){},30:function(t,e,i){"use strict";i.r(e);var n=i(1),s=i(0),c=i.n(s),a=i(4),o=i.n(a),r=(i(20),i(3)),l=i(8),d=i(2),u=function(t){var e=Object(s.useCallback)((function(t){t&&t.focus()}),[]);return Object(n.jsx)(n.Fragment,{children:!0===t.isEdit?Object(n.jsx)("form",{onSubmit:function(e){e.preventDefault(),t.setIsEdit()},children:Object(n.jsx)("input",{className:t.className,value:t.content,ref:e,onChange:function(e){return t.onChange(t.id,e.target.value)},onBlur:function(e){return t.setIsEdit()}})}):Object(n.jsx)("span",{className:t.className,onClick:function(e){return t.setIsEdit()},children:t.content})})},j=i(5),b=i(6),O=function(t,e){var i=function(){return t.freeIds.length>0?t.freeIds.pop():t.nextId++};switch(e.type){case"LOAD_NEW_STATE":return e.newState;case"CLEAR_STATE":return m;case"ADD_TODO":var n={id:i(),content:"Click to edit",isEdit:!0};return Object(d.a)(Object(d.a)({},t),{},{items:Object(d.a)(Object(d.a)({},t.items),{},Object(b.a)({},n.id,n)),lists:t.lists.map((function(t){return t.id===e.listId?Object(d.a)(Object(d.a)({},t),{},{items:t.items.concat(n.id)}):t}))});case"REMOVE_TODO":return t.freeIds.push(e.itemId),delete t.items[e.itemId],Object(d.a)(Object(d.a)({},t),{},{lists:t.lists.map((function(t){return t.id===e.listId?Object(d.a)(Object(d.a)({},t),{},{items:t.items.filter((function(t){return t!==e.itemId}))}):t}))});case"SET_IS_EDIT":return Object(d.a)(Object(d.a)({},t),{},{items:Object(d.a)(Object(d.a)({},t.items),{},Object(b.a)({},e.itemId,Object(d.a)(Object(d.a)({},t.items[e.itemId]),{},{isEdit:e.newState})))});case"UPDATE_TODO_CONTENT":return Object(d.a)(Object(d.a)({},t),{},{items:Object(d.a)(Object(d.a)({},t.items),{},Object(b.a)({},e.itemId,Object(d.a)(Object(d.a)({},t.items[e.itemId]),{},{content:e.content})))});case"ADD_LIST":var s={title:"New List",id:i().toString(),items:[]};return Object(d.a)(Object(d.a)({},t),{},{lists:[].concat(Object(l.a)(t.lists),[s])});case"REMOVE_LIST":return t.freeIds.push(e.listId),Object(d.a)(Object(d.a)({},t),{},{lists:t.lists.filter((function(t){return t.id!==e.listId}))});case"SET_LIST_TITLE_IS_EDIT":return Object(d.a)(Object(d.a)({},t),{},{lists:t.lists.map((function(t){return t.id===e.listId?(t.isTitleEdit=e.newState,t):t}))});case"UPDATE_LIST_TITLE":return Object(d.a)(Object(d.a)({},t),{},{lists:t.lists.map((function(t){return t.id===e.listId?Object(d.a)(Object(d.a)({},t),{},{title:e.newTitle}):t}))});case"MOVE_TODO":var c=t.lists.find((function(t){return t.id===e.payload.sourceList})).items.splice(e.payload.sourceIndex,1);return Object(d.a)(Object(d.a)({},t),{},{lists:t.lists.map((function(t){return t.id===e.payload.destList?Object(d.a)(Object(d.a)({},t),{},{items:t.items.slice(0,e.payload.destIndex).concat(c).concat(t.items.slice(e.payload.destIndex,t.items.length))}):t}))});default:return t}},m={lists:[{id:"m",title:"Monday",items:[],isTitleEdit:!1},{id:"t",title:"Tuesday",items:[],isTitleEdit:!1},{id:"w",title:"Wednesday",items:[],isTitleEdit:!1},{id:"r",title:"Thursday",items:[],isTitleEdit:!1},{id:"f",title:"Friday",items:[],isTitleEdit:!1},{id:"s",title:"Saturday",items:[],isTitleEdit:!1},{id:"u",title:"Sunday",items:[],isTitleEdit:!1}],items:{},freeIds:[],nextId:0},f=c.a.createContext(null),p=function(t){return Object(n.jsx)("button",{className:"item-menu",autoFocus:!0,style:{top:t.posY,left:t.posX},onClick:t.onClick,onBlur:t.onBlur,children:"Delete"})},x=function(t){var e=c.a.useState([0,0,!1]),i=Object(r.a)(e,2),s=i[0],a=i[1],o=c.a.useContext(f),l=function(){return Object(n.jsx)("button",{className:"deleteItemButton list-item-objects",onClick:function(t){return a([t.pageX,t.pageY,!s[2]])},children:String.fromCharCode(9899)+" "+String.fromCharCode(9899)+" "+String.fromCharCode(9899)})},b=function(t){return Object(n.jsx)(j.b,{draggableId:t.id.toString(),index:parseInt(t.index),children:function(e){return Object(n.jsx)("div",Object(d.a)(Object(d.a)(Object(d.a)({className:"list-item",ref:e.innerRef},e.draggableProps),e.dragHandleProps),{},{children:t.children}))}},t.id)};return Object(n.jsxs)(b,{id:t.id,index:parseInt(t.index),children:[Object(n.jsx)(u,{className:"list-item-objects list-item-label",id:t.id,content:t.itemObject.content,isEdit:t.itemObject.isEdit,onChange:t.onChange,setIsEdit:function(e,i){o({type:"SET_IS_EDIT",itemId:t.id,newState:!t.itemObject.isEdit})}}),Object(n.jsx)(l,{}),s[2]&&Object(n.jsx)(p,{posX:s[0],posY:s[1],onClick:t.onDeleteClick,onBlur:function(t){return a([0,0,!s])}})]})},h=function(t){var e=c.a.useContext(f),i=function(t,i){e({type:"UPDATE_TODO_CONTENT",itemId:t,content:i})},s=function(){e({type:"ADD_TODO",listId:t.id})},a=function(i){e({type:"SET_LIST_TITLE_IS_EDIT",listId:t.id,newState:!t.list.isTitleEdit})},o=function(i,n){e({type:"UPDATE_LIST_TITLE",listId:t.id,newTitle:n})},r=t.list.items.map((function(s,c){return Object(n.jsx)(x,{id:s,index:c,itemObject:t.todoState.items[s],onChange:i,onDeleteClick:function(){return i=s,void e({type:"REMOVE_TODO",listId:t.id,itemId:i});var i}},s)})),l=function(t){return Object(n.jsx)("div",{className:"".concat(t.thisClass,"-individual"),children:t.children})},b=function(){return Object(n.jsxs)("div",{className:"".concat(t.thisClass,"-individual-title"),children:[Object(n.jsx)(u,{className:"list-item-objects list-item-label",id:t.list.id,content:t.list.title,onChange:o,isEdit:t.list.isTitleEdit,setIsEdit:a}),t.canDelete&&Object(n.jsx)("button",{className:"list-delete-button",onClick:t.onDeleteClick,children:"X"})]})},O=function(){return Object(n.jsx)(j.c,{droppableId:t.list.id+"",children:function(e){return Object(n.jsxs)("div",Object(d.a)(Object(d.a)({ref:e.innerRef},e.droppableProps),{},{className:"".concat(t.thisClass,"-list"),children:[r,e.placeholder]}))}})},m=function(){return Object(n.jsx)("button",{className:"addItemButton",style:{fontsize:"2rem"},onClick:s,children:"+"})};return Object(n.jsxs)(l,{thisClass:t.thisClass,children:[Object(n.jsx)(b,{},"listtitle-".concat(t.list.id)),Object(n.jsx)(O,{},"listcontent-".concat(t.list.id)),Object(n.jsx)(m,{},"addtodobutton=".concat(t.list.id))]},"listcontainer-".concat(t.list.id))},I=(i(27),function(t){var e=c.a.useContext(f),i=function(){e({type:"ADD_LIST"})},s=function(){return Object(n.jsx)("span",{className:"addListButton",onClick:i,children:"+ Add list"})},a=function(t){return Object(n.jsx)("div",{className:"".concat(t.thisClass,"-container"),children:t.children})},o=t.todoState.lists.map((function(i,s){return Object(n.jsx)(h,{thisClass:s<=6?"calendar":"todo",todoState:t.todoState,list:i,index:s,id:i.id+"",canDelete:!(s<=6),canEditTitle:!1,onDeleteClick:function(){return n=i.id,t.todoState.lists.map((function(t){return t.id===n&&t.items.forEach((function(t){e({type:"REMOVE_TODO",itemId:t})})),t})),void e({type:"REMOVE_LIST",listId:n});var n}},i.id)}));return Object(n.jsxs)(j.a,{onDragEnd:function(t){var i=t.source,n=t.destination;null!==i&&null!==n&&e({type:"MOVE_TODO",payload:{sourceList:i.droppableId,sourceIndex:i.index,destList:n.droppableId,destIndex:n.index}})},children:[Object(n.jsx)(a,{thisClass:"calendar",children:Object(l.a)(o.slice(0,7))},"calendarcontainer"),Object(n.jsx)("hr",{style:{width:"90vw",color:"#eee"}}),Object(n.jsxs)(a,{thisClass:"todo",children:[Object(l.a)(o.slice(7,o.length)),Object(n.jsx)(s,{},"addlistbutton")]},"todolistcontainer")]})}),T=(i(28),function(t){var e=c.a.useContext(f),i=c.a.useState(!1),s=Object(r.a)(i,2),a=s[0],o=s[1],l=c.a.useState(!1),d=Object(r.a)(l,2),u=d[0],j=d[1];return Object(n.jsxs)("div",{className:"settings-menu-overlay",onClick:function(e){console.log("Clicked outside menu"),t.setSettingsMenuProps([0,0,!1])},children:[Object(n.jsxs)("ul",{className:"settings-menu",onClick:function(t){return t.stopPropagation()},style:{top:t.posY,left:t.posX},children:[Object(n.jsx)("li",{className:"settings-menu-item",onClick:function(t){o(!0),j(!1)},children:"Export"}),Object(n.jsx)("li",{className:"settings-menu-item",onClick:function(t){o(!1),j(!0)},children:"Import"}),Object(n.jsx)("li",{className:"settings-menu-item",onClick:function(){window.confirm("Clear all? This will erase the entire board!!")&&e({type:"CLEAR_STATE"})},children:"Clear All"})]}),a&&Object(n.jsx)(E,{content:t.todoState}),u&&Object(n.jsx)(C,{setIsImportShowing:j})]})}),E=function(t){return Object(n.jsxs)("div",{className:"export-display",children:[Object(n.jsx)("textarea",{className:"export-content",onClick:function(t){return t.stopPropagation()},defaultValue:btoa(JSON.stringify(t.content))}),Object(n.jsx)("div",{className:"export-buttons",children:Object(n.jsx)("span",{children:"Close"})})]})},C=function(t){var e=c.a.useContext(f),i=c.a.useState(""),s=Object(r.a)(i,2),a=s[0],o=s[1];return Object(n.jsxs)("div",{className:"export-display",children:[Object(n.jsx)("textarea",{className:"export-content",onClick:function(t){return t.stopPropagation()},value:a,onChange:function(t){return o(t.target.value)}}),Object(n.jsxs)("div",{style:{margin:"auto"},onClick:function(t){return t.stopPropagation()},children:[Object(n.jsx)("span",{className:"export-buttons",onClick:function(){t.setIsImportShowing(!1)},children:"Cancel"}),Object(n.jsx)("span",{className:"export-buttons",onClick:function(i){window.confirm("Import? This will erase all your current data!!")&&(e({type:"LOAD_NEW_STATE",newState:JSON.parse(atob(a))}),t.setIsImportShowing(!1))},children:"Import"})]})]})},S=function(t){var e=c.a.useState([0,0,!1]),i=Object(r.a)(e,2),s=i[0],a=i[1];return Object(n.jsxs)("div",{className:"navbar",children:[Object(n.jsx)("span",{className:"navbar-title navbar-item",children:"List Reactor"}),Object(n.jsx)("span",{className:"navbar-settings navbar-item",onClick:function(t){return a([t.target.offsetLeft,t.target.offsetTop,!s[2]])},children:"Settings"}),s[2]&&Object(n.jsx)(T,{posX:s[0]-10,posY:s[1]+35,todoState:t.todoState,setSettingsMenuProps:a})]})},g=(i(29),function(){var t=c.a.useReducer(O,JSON.parse(localStorage.getItem("listreactor-state"))||m),e=Object(r.a)(t,2),i=e[0],s=e[1];c.a.useEffect((function(){localStorage.setItem("listreactor-state",JSON.stringify(i))}),[i]);var a=function(t){return Object(n.jsxs)(f.Provider,{value:s,children:[Object(n.jsx)(S,{todoState:i}),Object(n.jsx)("div",{className:"app",children:t.children})]})};return Object(n.jsx)(a,{children:Object(n.jsx)(I,{todoState:i})})});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(Object(n.jsx)(c.a.StrictMode,{children:Object(n.jsx)(g,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[30,1,2]]]);
//# sourceMappingURL=main.df1bf16f.chunk.js.map